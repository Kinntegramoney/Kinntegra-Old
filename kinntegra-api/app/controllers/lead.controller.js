const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");

exports.GetLeadList = async (req, res) => {
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);

    var errorMessage = 'Error while fetching lead list...';

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AppUserId", UserId);
        const readResult = await readRequest.execute("GetLeads");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset.map(item => {
                const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                const ClientId = cryptoEngine.ParamEncrypt(item.ClientId, true);
                const AssociateId = cryptoEngine.ParamEncrypt(item.AssociateId, true);
                const GenderId = cryptoEngine.ParamEncrypt(item.GenderId, true);
                const CountryId = cryptoEngine.ParamEncrypt(item.CountryId, true);
                const StateId = cryptoEngine.ParamEncrypt(item.StateId, true);
                const EmployeeId = cryptoEngine.ParamEncrypt(item.EmployeeId, true);
                const AssociateData = 'Associate Code: ' + process.env.BSE_MEMBER_ID + '' + item.AssociateCode + '<br>Associate ARN: ARN-' + item.ARN + '<br>Associate EUIN: ' + ((item.EUIN != '') ? 'E' + item.EUIN : '');

                return { ...item, Id, ClientId, AssociateId, GenderId, CountryId, StateId, EmployeeId, AssociateData };
            });
        }

        var data = [];

        data = dataList;

        if (req.User.user_role == 'Employee') {
            data = dataList.filter(x => x.EmployeeId.toLowerCase() == req.User.employee_id.toLowerCase());
        }

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetLeadIntroductionList = async (req, res) => {
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);

    var errorMessage = 'Error while fetching client introduction list...';

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AppUserId", UserId);
        const readResult = await readRequest.execute("GetLeadsIntroduction");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset.map(item=>{
                const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                const ClientId = cryptoEngine.ParamEncrypt(item.ClientId, true);
                const AssociateId = cryptoEngine.ParamEncrypt(item.AssociateId, true);
                const GenderId = cryptoEngine.ParamEncrypt(item.GenderId, true);
                const CountryId = cryptoEngine.ParamEncrypt(item.CountryId, true);
                const StateId = cryptoEngine.ParamEncrypt(item.StateId, true);
                const EmployeeId = cryptoEngine.ParamEncrypt(item.EmployeeId, true);
                const AssociateData = 'Associate Code: ' + process.env.BSE_MEMBER_ID + '' + item.AssociateCode + '<br>Associate ARN: ARN-' + item.ARN + '<br>Associate EUIN: ' + ((item.EUIN != '') ? 'E' + item.EUIN : '');

                return { ...item, Id, ClientId, AssociateId, GenderId, CountryId, StateId, EmployeeId, AssociateData };
            });
        }

        var data = [];

        data = dataList;

        if (req.User.user_role == 'Employee') {
            data = dataList.filter(x => x.EmployeeId.toLowerCase() == req.User.employee_id.toLowerCase());
        }

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetLeadComprehensiveList = async (req, res) => {
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);

    var errorMessage = 'Error while tecthing comprehensive client list...';
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AppUserId", UserId);
        const readResult = await readRequest.execute("GetLeadsComprehensive");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset.map(item=>{
                const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                const ClientId = cryptoEngine.ParamEncrypt(item.ClientId, true);
                const AssociateId = cryptoEngine.ParamEncrypt(item.AssociateId, true);
                const GenderId = cryptoEngine.ParamEncrypt(item.GenderId, true);
                const CountryId = cryptoEngine.ParamEncrypt(item.CountryId, true);
                const StateId = cryptoEngine.ParamEncrypt(item.StateId, true);
                const EmployeeId = cryptoEngine.ParamEncrypt(item.EmployeeId, true);
                const AssociateData = 'Associate Code: ' + process.env.BSE_MEMBER_ID + '' + item.AssociateCode + '<br>Associate ARN: ARN-' + item.ARN + '<br>Associate EUIN: ' + ((item.EUIN != '') ? 'E' + item.EUIN : '');

                return { ...item, Id, ClientId, AssociateId, GenderId, CountryId, StateId, EmployeeId, AssociateData };
            });
        }

        var data = [];

        data = dataList;

        if (req.User.user_role == 'Employee') {
            data = dataList.filter(x => x.EmployeeId.toLowerCase() == req.User.employee_id.toLowerCase());
        }

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetLeadAccountList = async (req, res) => {
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    var errorMessage = 'Error while fetching client account list...';
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AppUserId", UserId);
        const readResult = await readRequest.execute("GetLeadsAccount");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    ClientId: cryptoEngine.ParamEncrypt(dataList[i].ClientId, true),
                    LeadDate: dataList[i].LeadDate,
                    AssociateId: cryptoEngine.ParamEncrypt(dataList[i].AssociateId, true),
                    FirstName: dataList[i].FirstName,
                    LastName: dataList[i].LastName,
                    GenderId: cryptoEngine.ParamEncrypt(dataList[i].GenderId, true),
                    MobileNumber: dataList[i].MobileNumber,
                    Email: dataList[i].Email,
                    CountryId: cryptoEngine.ParamEncrypt(dataList[i].CountryId, true),
                    Address1: dataList[i].Address1,
                    Address2: dataList[i].Address2,
                    Address3: dataList[i].Address3,
                    City: dataList[i].City,
                    StateId: cryptoEngine.ParamEncrypt(dataList[i].StateId, true),
                    PinCode: dataList[i].PinCode,
                    AssociateName: dataList[i].AssociateName,
                    FamilyName: dataList[i].FamilyName
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

exports.GetLeadById = async (req, res) => {
    const Id = req.params.Id;

    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("Id", cryptoEngine.ParamDecrypt(Id, true));
        const readResult = await readRequest.execute("GetLeadById");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                LeadDate: dataItem.LeadDate,
                AssociateId: cryptoEngine.ParamEncrypt(dataItem.AssociateId, true),
                EmployeeId: cryptoEngine.ParamEncrypt(dataItem.EmployeeId, true),
                FirstName: dataItem.FirstName,
                LastName: dataItem.LastName,
                GenderId: cryptoEngine.ParamEncrypt(dataItem.GenderId, true),
                MobileNumber: dataItem.MobileNumber,
                Email: dataItem.Email,
                CountryId: cryptoEngine.ParamEncrypt(dataItem.CountryId, true),
                Address1: dataItem.Address1,
                Address2: dataItem.Address2,
                Address3: dataItem.Address3,
                City: dataItem.City,
                StateId: cryptoEngine.ParamEncrypt(dataItem.StateId, true),
                PinCode: dataItem.PinCode,

            };
        }
        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.SaveLead = async (req, res) => {
    var { Id, LeadDate, AssociateId, EmployeeId, FirstName, LastName, GenderId, MobileNumber, Email, CountryId, Address1, Address2, Address3, City, StateId, PinCode } = req.body;

    var errorMessage = "Error while saving lead data...";

    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(Id, true) == 0) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("LeadDate", LeadDate)
                .input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("FirstName", FirstName)
                .input("LastName", LastName)
                .input("GenderId", cryptoEngine.ParamDecrypt(GenderId, true))
                .input("MobileNumber", MobileNumber)
                .input("Email", Email)
                .input("CountryId", cryptoEngine.ParamDecrypt(CountryId, true))
                .input("Address1", Address1)
                .input("Address2", Address2)
                .input("Address3", Address3)
                .input("City", City)
                .input("StateId", cryptoEngine.ParamDecrypt(StateId, true))
                .input("PinCode", PinCode);

            const result = await request.execute("InsertLead");
            Id = cryptoEngine.ParamEncrypt(result.output.Id, true);

        }
        else {
            const request = transaction.request();
            request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                .input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("FirstName", FirstName)
                .input("LastName", LastName)
                .input("GenderId", cryptoEngine.ParamDecrypt(GenderId, true))
                .input("MobileNumber", MobileNumber)
                .input("Email", Email)
                .input("CountryId", cryptoEngine.ParamDecrypt(CountryId, true))
                .input("Address1", Address1)
                .input("Address2", Address2)
                .input("Address3", Address3)
                .input("City", City)
                .input("StateId", cryptoEngine.ParamDecrypt(StateId, true))
                .input("PinCode", PinCode)
            const result = await request.execute("UpdateLead");
        }

        if (cryptoEngine.ParamDecrypt(EmployeeId, true) != 0) {
            const leadAssociateEmployeeDetailsRequest = transaction.request();
            leadAssociateEmployeeDetailsRequest.input("LeadId", cryptoEngine.ParamDecrypt(Id, true))
            leadAssociateEmployeeDetailsRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
            const LeadAssociateEmployeeDetailsResult = await leadAssociateEmployeeDetailsRequest.execute("InsertLeadAssociateEmployee");
        }
        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'Associate',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);
        res.status(200).send({ Status: true, Message: "Lead Saved Successfully.", Data: { Id: Id } });
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        res.status(500).send(errorMessage);
    }
};

exports.DeleteLead = async (req, res) => {
    var { Id } = req.body;

    var errorMessage = "Error while deleting lead data...";

    // let TransactionMode = 'Delete';

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        const request = transaction.request();

        request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
        const result = await request.execute("DeleteLead");
        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'Associate',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);

        res.status(200).send({ Status: true, Message: "Lead Deleted Successfully.", Data: {} });
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("FK_")) { errorMessage = "Reference exists. Cannot delete record."; }

        // console.log(errorMessage);

        res.status(500).send(errorMessage);
    }
};
