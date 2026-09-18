const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");
const commonFunction = require("../models/commonfunction.model");
const emailEngine = require("../models/emailengine.model");
const authToken = require("../models/authtoken.model");
const path = require("path");
const fs = require("fs");
const notificationEngine = require("../models/notificationengine.model");

exports.AuthenticateAppUser = async (req, res) => {
  var { UserName, Password } = req.body;

  var errorMessage = "Invalid email or password.";

  try {
    var userData;
    const readuserRequest = req.app.locals.db.request();
    readuserRequest.input("UserName", UserName);
    readuserRequest.input("Password", cryptoEngine.Encrypt(Password, true));
    const userResult = await readuserRequest.execute("AuthenticateAppUser");
    if (userResult.recordset.length > 0) {
      userData = userResult.recordset[0];
    }

    if (userData != null) {
      var token = authToken.GenerateMidToken(
        cryptoEngine.ParamEncrypt(userData.Id, true),
        UserName
      );
      res.status(200).send({ Status: true, Data: { Token: token } });
    } else {
      res
        .status(200)
        .send({ Status: false, Message: "Invalid email or password." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(errorMessage);
  }
};

exports.AuthenticateAppUserPin = async (req, res) => {
  var { Token, Pin } = req.body;

  var errorMessage = "Invalid PIN.";

  try {
    let MidData = authToken.VerifyMidToken(Token);
    let Id = cryptoEngine.ParamDecrypt(MidData.user_id, true);

    var userData;
    var AssociateId = cryptoEngine.ParamEncrypt('0', true);
    var EmployeeId = cryptoEngine.ParamEncrypt('0', true);
    var ClientId = cryptoEngine.ParamEncrypt('0', true);
    var UserRole = 'SA';
    var UserFirstName = 'Super Admin';
    var IsPrimaryAssociate = false;

    const readUserRequest = req.app.locals.db.request();
    readUserRequest.input("Id", Id);
    readUserRequest.input("Pin", cryptoEngine.Encrypt(Pin, true));
    const userResult = await readUserRequest.execute("AuthenticateAppUserPin");
    if (userResult.recordset.length > 0) {
      userData = userResult.recordset[0];
    }

    if (userData != null) {
      const transaction = req.app.locals.db.transaction();
      try {
        await transaction.begin();

        const request = transaction.request();
        request.input("AppUserId", userData.Id);

        const result = await request.execute("InsertLoginLog");

        await transaction.commit();
      }
      catch (err) {
        console.log(err);
        try {
          await transaction.rollback();
        } catch (sqlerr) {
          console.log(sqlerr);
        }

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }
      }
    }

    if (userData != null) {
      const readAssociateRequest = req.app.locals.db.request();
      readAssociateRequest.input("AppUserId", Id);
      const associateResult = await readAssociateRequest.execute("GetAppUserAssociate");
      if (associateResult.recordset.length > 0) {
        let associateData = associateResult.recordset[0];
        AssociateId = cryptoEngine.ParamEncrypt(associateData.AssociateId, true);
        UserRole = 'Associate';
        UserFirstName = (associateData.EntityName == '') ? associateData.Name : associateData.EntityName;
        IsPrimaryAssociate = associateData.IsPrimaryAssociate;
      }

      if (UserRole != 'Associate') {
        const readEmployeeRequest = req.app.locals.db.request();
        readEmployeeRequest.input("AppUserId", Id);
        const employeeResult = await readEmployeeRequest.execute("GetAppUserEmployee");
        if (employeeResult.recordset.length > 0) {
          let employeeData = employeeResult.recordset[0];
          EmployeeId = cryptoEngine.ParamEncrypt(employeeData.EmployeeId, true);
          AssociateId = cryptoEngine.ParamEncrypt(employeeData.AssociateId, true);
          UserRole = 'Employee';
          UserFirstName = employeeData.Name;
          IsPrimaryAssociate = employeeData.IsPrimaryAssociate;
        }
      }

      if (UserRole != 'Associate' && UserRole != 'Employee') {
        const readClientRequest = req.app.locals.db.request();
        readClientRequest.input("AppUserId", Id);
        const clientResult = await readClientRequest.execute("GetAppUserClient");
        if (clientResult.recordset.length > 0) {
          let clientData = clientResult.recordset[0];
          ClientId = cryptoEngine.ParamEncrypt(clientData.ClientId, true);
          AssociateId = cryptoEngine.ParamEncrypt(clientData.AssociateId, true);
          UserRole = 'Client';
          UserFirstName = clientData.Name;
        }
      }

      var token = authToken.GenerateToken(
        cryptoEngine.ParamEncrypt(userData.Id, true),
        userData.UserName,
        UserRole,
        AssociateId,
        EmployeeId,
        ClientId
      );

      res.status(200).send({ Status: true, Data: { Token: token, Role: UserRole, AssociateId: AssociateId, EmployeeId: EmployeeId, ClientId: ClientId, UserDisplayName: UserFirstName, IsPrimaryAssociate: IsPrimaryAssociate, UserId: cryptoEngine.ParamEncrypt(Id, true) } });
    } else {
      res
        .status(200)
        .send({ Status: false, Message: "Invalid PIN." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(errorMessage);
  }
};

exports.GetAppUsers = async (req, res) => {
  try {
    var dataList = [];

    const readRequest = req.app.locals.db.request();
    const readResult = await readRequest.execute("GetAppUsers");
    if (readResult.recordset.length > 0) {
      dataList = readResult.recordset;
    }

    var data = [];
    if (dataList.length > 0) {
      for (let i = 0; i < dataList.length; i++) {
        let dataItem = {
          Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
          UserName: dataList[i].UserName,
          UserType: dataList[i].UserType,
          Created: dataList[i].Created,
          Modified: dataList[i].Modified
        };
        data.push(dataItem)
      }
    }
    res.status(200).send({ Status: true, Message: "", Data: data });
  }
  catch (err) {
    console.log(err);
    res.status(500).send(errorMessage);
  }
};

exports.CreateAppUser = async (req, res, Id, UserName, EntityDate, AssociateId, EmployeeId, ClientId, ClientProfileId) => {
  var errorMessage = "Error while saving appuser data...";
  let passwordDate = new Date((new Date(EntityDate)).toISOString().slice(0, -1));
  let newPassword = UserName.toUpperCase().substr(0, 5) + commonFunction.padLeft(passwordDate.getDate().toString(), '0', 2) + commonFunction.padLeft((passwordDate.getMonth() + 1).toString(), '0', 2);
  var Password = cryptoEngine.Encrypt(newPassword, true);
  var PIN = cryptoEngine.Encrypt(commonFunction.GetRandomNumber(6), true);
  const transaction = req.app.locals.db.transaction();
  try {
    await transaction.begin();

    if (cryptoEngine.ParamDecrypt(Id, true) == 0) {
      const request = transaction.request();

      request.output("Id", msSql.BigInt)
        .input("UserName", UserName.toUpperCase())
        .input("Password", Password)
        .input("PIN", PIN)
        .input("IsActive", false)
        .input("Email", "");
      const result = await request.execute("InsertAppUser");

      Id = cryptoEngine.ParamEncrypt(result.output.Id, true);
    }

    if (cryptoEngine.ParamDecrypt(AssociateId, true) != 0) {
      const request = transaction.request();

      request.input("AppUserId", cryptoEngine.ParamDecrypt(Id, true))
        .input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
      const result = await request.execute("InsertAppUserAssociate");
    }

    if (cryptoEngine.ParamDecrypt(EmployeeId, true) != 0) {
      const request = transaction.request();

      request.input("AppUserId", cryptoEngine.ParamDecrypt(Id, true))
        .input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
      const result = await request.execute("InsertAppUserEmployee");
    }

    if (cryptoEngine.ParamDecrypt(ClientId, true) != 0) {
      const request = transaction.request();

      request.input("AppUserId", cryptoEngine.ParamDecrypt(Id, true))
        .input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
        .input("ClientKycProfileId", cryptoEngine.ParamDecrypt(ClientProfileId, true));
      const result = await request.execute("InsertAppUserClient");
    }

    await transaction.commit();

    return Id;
  }
  catch (err) {
    console.log(err);
    try {
      await transaction.rollback();
    }
    catch (sqlerr) {
      console.log(sqlerr);
    }

    if (err.message.includes("UK_")) {
      errorMessage = "Duplicate record. User already exists.";
    }

    res.status(500).send(errorMessage);
  }
};

exports.AuthenticateAppUserAssociate = async (req, res) => {
  var { AssociateId } = req.body;

  var errorMessage = "Invalid request.";

  try {
    var userData;
    var EmployeeId = cryptoEngine.ParamEncrypt('0', true);
    var ClientId = cryptoEngine.ParamEncrypt('0', true);
    var UserRole = 'SA';
    var UserFirstName = 'Super Admin';

    const readUserRequest = req.app.locals.db.request();
    readUserRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
    const userResult = await readUserRequest.execute("GetAppUserByAssociateId");
    if (userResult.recordset.length > 0) {
      userData = userResult.recordset[0];
    }

    if (userData != null) {
      var token = authToken.GeneratePublicToken(
        cryptoEngine.ParamEncrypt(userData.Id, true),
        userData.UserName
      );

      const readAssociateRequest = req.app.locals.db.request();
      readAssociateRequest.input("AppUserId", userData.Id);
      const associateResult = await readAssociateRequest.execute("GetAppUserAssociate");
      if (associateResult.recordset.length > 0) {
        let associateData = associateResult.recordset[0];
        AssociateId = cryptoEngine.ParamEncrypt(associateData.AssociateId, true);
        UserRole = 'Associate';
        UserFirstName = associateData.EntityName;
      }

      res.status(200).send({ Status: true, Data: { Token: token, Role: UserRole, AssociateId: AssociateId, EmployeeId: EmployeeId, ClientId: ClientId, UserDisplayName: UserFirstName, UserId: cryptoEngine.ParamEncrypt(userData.Id, true) } });
    } else {
      res
        .status(200)
        .send({ Status: false, Message: "Invalid request." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(errorMessage);
  }
};

exports.AuthenticateAppUserEmployee = async (req, res) => {
  var { EmployeeId } = req.body;

  var errorMessage = "Invalid request.";

  try {
    var userData;
    var AssociateId = cryptoEngine.ParamEncrypt('0', true);
    var ClientId = cryptoEngine.ParamEncrypt('0', true);
    var UserRole = 'SA';
    var UserFirstName = 'Super Admin';

    const readUserRequest = req.app.locals.db.request();
    readUserRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
    const userResult = await readUserRequest.execute("GetAppUserByEmployeeId");
    if (userResult.recordset.length > 0) {
      userData = userResult.recordset[0];
    }

    if (userData != null) {
      var token = authToken.GeneratePublicToken(
        cryptoEngine.ParamEncrypt(userData.Id, true),
        userData.UserName
      );

      const readEmployeeRequest = req.app.locals.db.request();
      readEmployeeRequest.input("AppUserId", userData.Id);
      const employeeResult = await readEmployeeRequest.execute("GetAppUserEmployee");
      if (employeeResult.recordset.length > 0) {
        let employeeData = employeeResult.recordset[0];
        EmployeeId = cryptoEngine.ParamEncrypt(employeeData.EmployeeId, true);
        AssociateId = cryptoEngine.ParamEncrypt(employeeData.AssociateId, true);
        UserRole = 'Employee';
        UserFirstName = employeeData.Name;
      }

      res.status(200).send({ Status: true, Data: { Token: token, Role: UserRole, AssociateId: AssociateId, EmployeeId: EmployeeId, ClientId: ClientId, UserDisplayName: UserFirstName, UserId: cryptoEngine.ParamEncrypt(userData.Id, true) } });
    } else {
      res
        .status(200)
        .send({ Status: false, Message: "Invalid request." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(errorMessage);
  }
};

exports.AuthenticateAppUserClient = async (req, res) => {
  var { ClientId, ClientKycProfileId } = req.body;

  var errorMessage = "Invalid request.";

  try {
    var userData;
    var EmployeeId = cryptoEngine.ParamEncrypt('0', true);
    var AssociateId = cryptoEngine.ParamEncrypt('0', true);
    var UserRole = 'SA';
    var UserFirstName = 'Super Admin';

    const readUserRequest = req.app.locals.db.request();
    readUserRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
      .input("ClientKycProfileId", cryptoEngine.ParamDecrypt(ClientKycProfileId, true));
    const userResult = await readUserRequest.execute("GetAppUserByClientKycProfileId");
    if (userResult.recordset.length > 0) {
      userData = userResult.recordset[0];
    }

    if (userData != null) {
      var token = authToken.GeneratePublicToken(
        cryptoEngine.ParamEncrypt(userData.Id, true),
        userData.UserName
      );

      const readClientRequest = req.app.locals.db.request();
      readClientRequest.input("AppUserId", userData.Id);
      const clientResult = await readClientRequest.execute("GetAppUserClient");
      if (clientResult.recordset.length > 0) {
        let clientData = clientResult.recordset[0];
        ClientId = cryptoEngine.ParamEncrypt(clientData.ClientId, true);
        AssociateId = cryptoEngine.ParamEncrypt(clientData.AssociateId, true);
        UserRole = 'Client';
        UserFirstName = clientData.Name;
      }

      res.status(200).send({ Status: true, Data: { Token: token, Role: UserRole, AssociateId: AssociateId, EmployeeId: EmployeeId, ClientId: ClientId, UserDisplayName: UserFirstName, UserId: cryptoEngine.ParamEncrypt(userData.Id, true), IsPasswordSet: (userData.Password != '') } });
    } else {
      res
        .status(200)
        .send({ Status: false, Message: "Invalid request." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(errorMessage);
  }
};

exports.AuthenticateTransactionAppUserClient = async (req, res) => {
  var { ClientId, ClientKycProfileId, Password, PIN } = req.body;

  var errorMessage = "Invalid request.";

  try {
    var userData;
    var EmployeeId = cryptoEngine.ParamEncrypt('0', true);
    var AssociateId = cryptoEngine.ParamEncrypt('0', true);
    var UserRole = 'SA';
    var UserFirstName = 'Super Admin';

    const readUserRequest = req.app.locals.db.request();
    readUserRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
      .input("ClientKycProfileId", cryptoEngine.ParamDecrypt(ClientKycProfileId, true))
      .input("Password", cryptoEngine.Encrypt(Password, true))
      .input("PIN", cryptoEngine.Encrypt(PIN, true));
    const userResult = await readUserRequest.execute("GetAppUserByTransactionClientKycProfileId");
    if (userResult.recordset.length > 0) {
      userData = userResult.recordset[0];
    }

    if (userData != null) {
      var token = authToken.GeneratePublicToken(
        cryptoEngine.ParamEncrypt(userData.Id, true),
        userData.UserName
      );

      const readClientRequest = req.app.locals.db.request();
      readClientRequest.input("AppUserId", userData.Id);
      const clientResult = await readClientRequest.execute("GetAppUserClient");
      if (clientResult.recordset.length > 0) {
        let clientData = clientResult.recordset[0];
        ClientId = cryptoEngine.ParamEncrypt(clientData.ClientId, true);
        AssociateId = cryptoEngine.ParamEncrypt(clientData.AssociateId, true);
        UserRole = 'Client';
        UserFirstName = clientData.Name;
      }

      var notificationData = {
        SenderId: cryptoEngine.ParamEncrypt("1", true),
        ReceiverId: cryptoEngine.ParamEncrypt(userData.Id, true),
        Status: true,
        StatusMessage: 'Client credentials validated successfully...',
        RecordType: 'Order Progress'
      };

      notificationEngine.SendRealCommunicationOrderProgress(JSON.stringify(notificationData));

      res.status(200).send({ Status: true, Data: { Token: token, Role: UserRole, AssociateId: AssociateId, EmployeeId: EmployeeId, ClientId: ClientId, UserDisplayName: UserFirstName } });
    } else {
      res.status(200).send({ Status: false, Message: "Invalid request." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(errorMessage);
  }
};

exports.SendForgotPasswordRequest = async (req, res) => {
  var { UserName, Device, Browser, IpAddress } = req.body;

  var appUserData;
  var Id = "414E2B5048745659672B513D";
  var errorMessage = "Error while sending the forgot password request ...";

  const userReadResquest = req.app.locals.db.request();
  userReadResquest.input("UserName", UserName);
  const userResult = await userReadResquest.execute("GetEmailByUserName");

  if (userResult.recordset.length > 0) {
    appUserData = userResult.recordset[0];
  }
  if (appUserData != null || appUserData != undefined) {
    Email = appUserData.Email;
    const transaction = req.app.locals.db.transaction();
    try {
      await transaction.begin();
      const userRequest = transaction.request();
      userRequest
        .output("Id", msSql.BigInt)
        .input("Email", Email)
        .input("UserName", UserName)
        .input("Device", Device)
        .input("Browser", Browser)
        .input("IPAddress", IpAddress)
        .input("IsLinkExpired", false)
      const UserResult = await userRequest.execute(
        "InsertPasswordResetRequest"
      );
      Id = cryptoEngine.ParamEncrypt(UserResult.output.Id, true);
      await transaction.commit();

      const ResetLink =
        process.env.WEB_APP_LINK + '/reset-password/' + Id
      emailEngine.SendRestPasswordEmailLink(Email, Device, Browser, IpAddress, ResetLink, appUserData.Name);
    } catch (error) {
      console.log(error);
      try {
        await transaction.rollback();
      } catch (sqlerr) {
        console.log(sqlerr);
      }
      res.status(500).send(errorMessage);
    }
    res.status(200).send({
      Status: true,
      Message:
        "You will receive reset password instruction mail if provided email id match with registered account.",
      Data: { Id: Id },
    });
  } else {
    res.status(200).send({
      Status: false,
      Message: "User not found.",
      Data: { Id: Id },
    });
  }
};

exports.SendClientForgotPasswordRequest = async (req, res) => {
  var { UserName, Device, Browser, IpAddress } = req.body;

  var appUserData;
  var Id = "414E2B5048745659672B513D";
  var errorMessage = "Error while sending the forgot password request ...";

  UserName = req.User.user_name;

  const userReadResquest = req.app.locals.db.request();
  userReadResquest.input("UserName", UserName);
  const userResult = await userReadResquest.execute("GetEmailByUserName");

  if (userResult.recordset.length > 0) {
    appUserData = userResult.recordset[0];
  }
  if (appUserData != null || appUserData != undefined) {
    Email = appUserData.Email;
    const transaction = req.app.locals.db.transaction();
    try {
      await transaction.begin();
      const userRequest = transaction.request();
      userRequest
        .output("Id", msSql.BigInt)
        .input("Email", Email)
        .input("UserName", UserName)
        .input("Device", Device)
        .input("Browser", Browser)
        .input("IPAddress", IpAddress)
        .input("IsLinkExpired", false)
      const UserResult = await userRequest.execute(
        "InsertPasswordResetRequest"
      );
      Id = cryptoEngine.ParamEncrypt(UserResult.output.Id, true);
      await transaction.commit();

      const ResetLink =
        process.env.WEB_APP_LINK + '/reset-password/' + Id
      emailEngine.SendRestPasswordEmailLink(Email, Device, Browser, IpAddress, ResetLink, appUserData.Name);
    } catch (error) {
      console.log(error);
      try {
        await transaction.rollback();
      } catch (sqlerr) {
        console.log(sqlerr);
      }
      res.status(500).send(errorMessage);
    }
    res.status(200).send({
      Status: true,
      Message:
        "You will receive reset password instruction mail if provided email id match with registered account.",
      Data: { Id: Id, Email: Email },
    });
  } else {
    res.status(200).send({
      Status: false,
      Message: "User not found.",
      Data: { Id: Id },
    });
  }
};

exports.ResetPassword = async (req, res) => {
  var { Id, NewPassword, NewPIN } = req.body;
  var dataItem;
  var appUserData;
  var errorMessage = "Error while Updating Password...";

  const readRequest = req.app.locals.db.request();
  readRequest.input("Id", cryptoEngine.ParamDecrypt(Id, true));
  const readResult = await readRequest.execute("GetUserNameByPasswordResetRequestId");
  if (readResult.recordset.length > 0) {
    dataItem = readResult.recordset[0];
  }

  const readUserNameRequest = req.app.locals.db.request();
  readUserNameRequest.input("UserName", dataItem.UserName);
  const readuserNameResult = await readUserNameRequest.execute("GetAppUserByUserName");
  if (readuserNameResult.recordset.length > 0) {
    appUserData = readuserNameResult.recordset[0];
  }
  data = {
    "Id": cryptoEngine.ParamEncrypt(appUserData.Id, true),
  }
  const AppUserId = data.Id;
  const transaction = req.app.locals.db.transaction();
  try {
    await transaction.begin();
    const request = transaction.request();
    request.input("Id", cryptoEngine.ParamDecrypt(AppUserId, true))
      .input("Password", cryptoEngine.Encrypt(NewPassword, true))
      .input("PIN", cryptoEngine.Encrypt(NewPIN, true));
    const result = await request.execute("UpdateAppUserPasswordPin");

    const requestLink = transaction.request();
    requestLink.input("Id", cryptoEngine.ParamDecrypt(Id, true))
      .input("IsLinkExpired", true);
    const resultLink = await requestLink.execute("UpdatePasswordResetRequestLink");

    await transaction.commit();

    res.status(200).send({ Status: true, Message: "", Data: Id });
  } catch (err) {
    console.log(err);
    try {
      await transaction.rollback();
    } catch (sqlerr) {
      console.log(sqlerr);
    }
    res.status(500).send(errorMessage);
  }

};

exports.GetAppUserMenuOptions = async (req, res) => {
  const AppUserId = req.params.AppUserId;
  const AppUserType = req.params.AppUserType;

  var errorMessage = "Error while fetching preferences...";

  try {
    let data = await this.GetAppUserTypeMenuOptions(res, req, AppUserId, AppUserType);

    res.status(200).send({ Status: true, Message: "", Data: data });
  }
  catch (err) {
    console.log(err);
    res.status(500).send(errorMessage);
  }
};

exports.GetAppUserTypeMenuOptions = async (req, res, AppUserId, AppUserType) => {
  var moduleDataList = [];

  const readRequest = req.app.locals.db.request();
  readRequest.input("AppUserType", AppUserType);
  const readResult = await readRequest.execute("GetAppUserTypeMenuOptionModules");
  if (readResult.recordset.length > 0) {
    moduleDataList = readResult.recordset;
  }

  var data = [];
  if (moduleDataList.length > 0) {
    for (let i = 0; i < moduleDataList.length; i++) {
      var menuGroups = [];
      var menuGroupsDataList = [];

      const readRequest = req.app.locals.db.request();
      readRequest.input("AppUserType", AppUserType)
        .input("Module", moduleDataList[i].Module);
      const readResult = await readRequest.execute("GetAppUserTypeMenuOptionMenuGroups");
      if (readResult.recordset.length > 0) {
        menuGroupsDataList = readResult.recordset;
      }

      for (let j = 0; j < menuGroupsDataList.length; j++) {
        var menuOptions = [];
        var menuOptionDataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AppUserType", AppUserType)
          .input("Module", moduleDataList[i].Module)
          .input("MenuGroup", menuGroupsDataList[j].MenuGroup)
          .input("AppUserId", cryptoEngine.ParamDecrypt(AppUserId, true));
        const readResult = await readRequest.execute("GetAppUserTypeMenuOptionModuleWise");
        if (readResult.recordset.length > 0) {
          menuOptionDataList = readResult.recordset;
        }

        for (let k = 0; k < menuOptionDataList.length; k++) {
          let menuItem = {
            Id: cryptoEngine.ParamEncrypt(menuOptionDataList[k].Id, true),
            Module: menuOptionDataList[k].Module,
            MenuGroup: menuOptionDataList[k].MenuGroup,
            Name: menuOptionDataList[k].Name,
            Code: menuOptionDataList[k].Code,
            AppType: menuOptionDataList[k].AppType,
            IsSelected: menuOptionDataList[k].IsSelected
          };

          menuOptions.push(menuItem);
        }

        let menuGroupItem = {
          MenuGroup: menuGroupsDataList[j].MenuGroup,
          MenuOptions: menuOptions,
        };

        menuGroups.push(menuGroupItem);
      }

      let dataItem = {
        Module: moduleDataList[i].Module,
        MenuGroups: menuGroups,
      };
      data.push(dataItem)
    }
  }

  return data;
};

exports.ResetClientTransactionPassword = async (req, res) => {
  var { ClientId, ClientKycProfileId, NewPassword, NewPIN } = req.body;
  var errorMessage = "Error while updating password...";

  const transaction = req.app.locals.db.transaction();
  try {
    await transaction.begin();
    const request = transaction.request();
    request.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
      .input("ClientKycProfileId", cryptoEngine.ParamDecrypt(ClientKycProfileId, true))
      .input("Password", cryptoEngine.Encrypt(NewPassword, true))
      .input("PIN", cryptoEngine.Encrypt(NewPIN, true));
    const result = await request.execute("UpdateClientCredentials");

    await transaction.commit();

    res.status(200).send({ Status: true, Message: "", Data: { ClientId: ClientId, ClientKycProfileId: ClientKycProfileId } });
  } catch (err) {
    console.log(err);
    try {
      await transaction.rollback();
    } catch (sqlerr) {
      console.log(sqlerr);
    }
    res.status(500).send(errorMessage);
  }

};
