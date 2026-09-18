const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");
const mime = require("mime-types");
const emailEngine = require("../models/emailengine.model");
const appUserController = require('../controllers/appuser.controller');
const notificationEngine = require("../models/notificationengine.model");
const notificationController = require('../controllers/notification.controller');
const date = require('date-and-time');
const fileSystem = require("fs");
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
const pdfEngine = require("../models/pdfengine.model");
const path = require("path");
const util = require('node:util');
const base64img = require('base64-img');
const excelEngine = require("../models/excelengine.model");


const commonFunction = require('../models/commonfunction.model');

exports.GetEmployeeList = async (req, res) => {
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AppUserId", UserId);
        const readResult = await readRequest.execute("GetEmployees");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    AssociateId: cryptoEngine.ParamEncrypt(dataList[i].AssociateId, true),
                    Name: dataList[i].Name,
                    AssociateName: dataList[i].AsssociateName,
                    DepartmentName: dataList[i].DepartmentName,
                    Grade: dataList[i].DesignationName,
                    LoginDate: dataList[i].LoginDate,
                    LogMessage: dataList[i].LogMessage,
                    StateName: dataList[i].StateName,
                    CityName: dataList[i].CityName,
                };
                data.push(dataItem);
            }
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetEmployeeExcelData = async (req, res) => {
    try {

        var EmployeeExcelData = [];


        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetEmployeesExcelData");
        if (readResult.recordset.length > 0) {
            let employeeExcelData = readResult.recordset;


            for (let i = 0; i < employeeExcelData.length; i++) {

                if (employeeExcelData[i].DateOfAnniversary) {
                    employeeExcelData[i].DateOfAnniversary = date.format(new Date(employeeExcelData[i].DateOfAnniversary), 'DD-MM-YYYY');
                }
                else {
                    employeeExcelData[i].DateOfAnniversary = '';
                }

                if (employeeExcelData[i].DateOfBirth) {
                    employeeExcelData[i].DateOfBirth = date.format(new Date(employeeExcelData[i].DateOfBirth), 'DD-MM-YYYY');
                }

                else {
                    employeeExcelData[i].DateOfBirth = '';
                }


                if (employeeExcelData[i].NismVaValidDate) {
                    employeeExcelData[i].NismVaValidDate = date.format(new Date(employeeExcelData[i].NismVaValidDate), 'DD-MM-YYYY');

                }
                else {
                    employeeExcelData[i].NismVaValidDate = '';
                }

                if (employeeExcelData[i].EUINValidDate) {
                    employeeExcelData[i].EUINValidDate = date.format(new Date(employeeExcelData[i].EUINValidDate), 'DD-MM-YYYY');

                }
                else {
                    employeeExcelData[i].EUINValidDate = '';
                }


                if (employeeExcelData[i].CAValidDate) {
                    employeeExcelData[i].CAValidDate = date.format(new Date(employeeExcelData[i].CAValidDate), 'DD-MM-YYYY');

                }
                else {
                    employeeExcelData[i].CAValidDate = '';
                }


                if (employeeExcelData[i].CSValidDate) {
                    employeeExcelData[i].CSValidDate = date.format(new Date(employeeExcelData[i].CSValidDate), 'DD-MM-YYYY');

                }
                else {
                    employeeExcelData[i].CSValidDate = '';
                }


                if (employeeExcelData[i].DegreeValidDate) {

                    employeeExcelData[i].DegreeValidDate = date.format(new Date(employeeExcelData[i].DegreeValidDate), 'DD-MM-YYYY');

                }
                else {
                    employeeExcelData[i].DegreeValidDate = '';
                }



                var item = {
                    AssociateName: employeeExcelData[i].AsssociateName,
                    EmployeeName: employeeExcelData[i].Name,
                    DepartmentName: employeeExcelData[i].DepartmentName,
                    SubDepartmentName: employeeExcelData[i].SubDepartmentName,
                    Grade: employeeExcelData[i].DesignationName,
                    SupervisorName: employeeExcelData[i].UserName,
                    MobileNumber: employeeExcelData[i].MobileNumber,
                    TelephoneNumber: employeeExcelData[i].TelephoneNumber,
                    Email: employeeExcelData[i].Email,
                    BloodGroupName: employeeExcelData[i].BloodGroupName,
                    HealthIssues: employeeExcelData[i].HealthIssues,
                    EmergencyContactName1: employeeExcelData[i].EmergencyContactName1,
                    EmergencyMobileNumber1: employeeExcelData[i].EmergencyMobileNumber1,
                    EmergencyEmail1: employeeExcelData[i].EmergencyEmail1,
                    EmergencyContactName2: employeeExcelData[i].EmergencyContactName2,
                    EmergencyMobileNumber2: employeeExcelData[i].EmergencyMobileNumber2,
                    EmergencyEmail2: employeeExcelData[i].EmergencyEmail2,
                    PANCardNumber: employeeExcelData[i].PANCardNumber,
                    AadharCardNumber: employeeExcelData[i].AadharCardNumber,
                    DateOfBirth: employeeExcelData[i].DateOfBirth,
                    DateOfAnniversary: employeeExcelData[i].DateOfAnniversary,
                    CAddress1: employeeExcelData[i].CAddress1,
                    CAddress2: employeeExcelData[i].CAddress2,
                    CAddress3: employeeExcelData[i].CAddress3,
                    CityName: employeeExcelData[i].CityName,
                    CountryName: employeeExcelData[i].CountryName,
                    StateName: employeeExcelData[i].StateName,
                    CPinCode: employeeExcelData[i].CPinCode,
                    IFSC: employeeExcelData[i].IFSC,
                    BankName: employeeExcelData[i].BankName,
                    Branch: employeeExcelData[i].Branch,
                    MICR: employeeExcelData[i].MICR,
                    BankAccountTypeName: employeeExcelData[i].BankAccountTypeName,
                    AccountNumber: employeeExcelData[i].AccountNumber,
                    NismVaNumber: employeeExcelData[i].NismVaNumber,
                    NismVaValidDate: employeeExcelData[i].NismVaValidDate,
                    EUINHolderName: employeeExcelData[i].EUINHolderName,
                    EUIN: employeeExcelData[i].EUIN,
                    EUINValidDate: employeeExcelData[i].EUINValidDate,
                    CANumber: employeeExcelData[i].CANumber,
                    CAValidDate: employeeExcelData[i].CAValidDate,
                    CSNumber: employeeExcelData[i].CSNumber,
                    CSValidDate: employeeExcelData[i].CSValidDate,
                    DegreeName: employeeExcelData[i].DegreeName,
                    DegreeNumber: employeeExcelData[i].DegreeNumber,
                    DegreeValidDate: employeeExcelData[i].DegreeValidDate,
                    CertificationType: employeeExcelData[i].CertificationType,
                };
                EmployeeExcelData.push(item);
            }

        }
        let data = {
            EmployeeExcelReportData: EmployeeExcelData,

        };


        let fileName = '';

        fileName = 'employee_' + commonFunction.GetUniqueId() + '.xlsx';


        var reportPath = await excelEngine.CreateEmployeeReport(data, fileName, 'reports');

        let tryCount = 1;
        while (!fileSystem.existsSync(reportPath)) {
            await snooze(5000);

            if (tryCount == 3) {
                throw new Error('Error while generating report...')
            }

            tryCount += 1;

        }



        res.status(200).send({ Status: true, Message: "", Data: { FileName: fileName } });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.CheckEmployeeVerificationProcess = async (req, res, Id) => {
    var errorMessage = "Error while getting associate data";
    var dataItem;

    const readRequest = req.app.locals.db.request();
    readRequest.input("Id", cryptoEngine.ParamDecrypt(Id, true));
    const readResult = await readRequest.execute("GetEmployeeProgress");
    if (readResult.recordset.length > 0) {
        dataItem = readResult.recordset[0];
    }

    if (dataItem != null) {
        if (dataItem.IsActive == true && dataItem.IsAdminVerified == true && dataItem.IsSelfVerified == true) {
            const transaction = req.app.locals.db.transaction();
            try {
                await transaction.begin();


                const selfrequest = transaction.request();
                selfrequest.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                    .input("IsSelfVerified", false);
                const selfresult = await selfrequest.execute("UpdateEmployeeSelfVerification");


                const adminrequest = transaction.request();
                adminrequest.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                    .input("IsAdminVerified", false);
                const result = await adminrequest.execute("UpdateEmployeeAdminVerification");

                const requestAppUser = transaction.request();
                requestAppUser.input("EmployeeId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("IsActive", false);
                const resultAppUser = await requestAppUser.execute("UpdateEmployeeAppUserActive");



                const requestEmployee = transaction.request();
                requestEmployee.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                    .input("IsActive", false)
                const employeeResult = await requestEmployee.execute("UpdateEmployeeActive");

                const requestRevision = transaction.request();
                requestRevision.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                const resultRevision = await requestRevision.execute("UpdateEmployeeRevision");


                await transaction.commit();

                return true;

            } catch (err) {
                console.log(err);
                try {
                    await transaction.rollback();
                }
                catch (sqlerr) {
                    console.log(sqlerr);
                }

                if (err.message.includes("UK_")) {
                    errorMessage = "Duplicate record. Record already exists.";
                }

                res.status(500).send(errorMessage);
                return;
            }

        }
    }

};


exports.SaveEmployee = async (req, res) => {
    // var { Id, AssociateId, Name, DesignationId, SupervisorAppUserId, MobileNumber, TelephoneNumber, Email, HealthIssues, EmergencyContactName1, EmergencyMobileNumber1, EmergencyEmail1,
    //     EmergencyContactName2, EmergencyMobileNumber2, EmergencyEmail2, AadharCardNumber, PANCardNumber, DateOfBirth, DateOfAnniversary, Departments,
    //     SubDepartments, Mode } = req.body;

    var { Id, AssociateId, Name, DesignationId, SupervisorAppUserId, Departments, SubDepartments, Mode } = req.body;


    let DepartmentsData = JSON.parse(Departments);
    let SubDepartmentsData = JSON.parse(SubDepartments);
    var errorMessage = "Error while saving employee data...";
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);

    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';



    if (Mode == 'edit') {
        await this.CheckEmployeeVerificationProcess(req, res, Id);
    }

    var Revision = 0;


    const readRequest = req.app.locals.db.request();
    readRequest.input("Id", cryptoEngine.ParamDecrypt(Id, true));
    const readResult = await readRequest.execute("GetEmployeeRevision");

    if (readResult.recordset.length > 0) {
        let dataItem = readResult.recordset[0];
        Revision = dataItem.Revision;
    }



    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(Id, true) == 0) {
            const request = transaction.request();
            request
                .output("Id", msSql.BigInt)
                .input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("Name", Name)
                .input("DesignationId", cryptoEngine.ParamDecrypt(DesignationId, true))
                .input("SupervisorAppUserId", cryptoEngine.ParamDecrypt(SupervisorAppUserId, true))
                // .input("MobileNumber", MobileNumber)
                // .input("TelephoneNumber", TelephoneNumber)
                // .input("Email", Email)
                // .input("HealthIssues", HealthIssues)
                // .input("EmergencyContactName1", EmergencyContactName1)
                // .input("EmergencyMobileNumber1", EmergencyMobileNumber1)
                // .input("EmergencyEmail1", EmergencyEmail1)
                // .input("EmergencyContactName2", EmergencyContactName2)
                // .input("EmergencyMobileNumber2", EmergencyMobileNumber2)
                // .input("EmergencyEmail2", EmergencyEmail2)
                // .input("PANCardNumber", PANCardNumber)
                // .input("AadharCardNumber", AadharCardNumber)
                // .input("DateOfBirth", DateOfBirth)
                // .input("DateOfAnniversary", DateOfAnniversary)
                .input("CreatedBy", UserId);

            const result = await request.execute("InsertEmployee");
            Id = cryptoEngine.ParamEncrypt(result.output.Id, true);
        } else {
            const request = transaction.request();
            request
                .input("Id", cryptoEngine.ParamDecrypt(Id, true))
                .input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("Name", Name)
                .input("DesignationId", cryptoEngine.ParamDecrypt(DesignationId, true))
                .input("SupervisorAppUserId", cryptoEngine.ParamDecrypt(SupervisorAppUserId, true))
            // .input("MobileNumber", MobileNumber)
            // .input("TelephoneNumber", TelephoneNumber)
            // .input("Email", Email)
            // .input("HealthIssues", HealthIssues)
            // .input("EmergencyContactName1", EmergencyContactName1)
            // .input("EmergencyMobileNumber1", EmergencyMobileNumber1)
            // .input("EmergencyEmail1", EmergencyEmail1)
            // .input("EmergencyContactName2", EmergencyContactName2)
            // .input("EmergencyMobileNumber2", EmergencyMobileNumber2)
            // .input("EmergencyEmail2", EmergencyEmail2)
            // .input("PANCardNumber", PANCardNumber)
            // .input("AadharCardNumber", AadharCardNumber)
            // .input("DateOfBirth", DateOfBirth)
            // .input("DateOfAnniversary", DateOfAnniversary)


            const result = await request.execute("UpdateEmployee");
        }


        const employeeGenralCompleteRequest = transaction.request();
        employeeGenralCompleteRequest.input("Id", cryptoEngine.ParamDecrypt(Id, true))
        employeeGenralCompleteRequest.input("IsGeneralInfoCompleted", true)
        const EmployeeBankCompleteRequest = await employeeGenralCompleteRequest.execute("UpdateEmployeeGeneralInfoCompleted");


        var LogMessage = "Employee Creation Pending";
        const logRequest = transaction.request();
        logRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(Id, true))
            .input("AppUserId", UserId)
            .input("LogMessage", LogMessage)
            .input("IsPrimaryStatus", true)
            .input("Revision", Revision)
            .input("Indicator", 1);
        const LogResult = await logRequest.execute("InsertEmployeeLog");

        var SecondaryLogMessage = "Employee General Information Created";
        const logSecRequest = transaction.request();
        logSecRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(Id, true))
            .input("AppUserId", UserId)
            .input("LogMessage", SecondaryLogMessage)
            .input("IsPrimaryStatus", false)
            .input("Revision", 0)
            .input("Indicator", 0);
        const LogSecResult = await logSecRequest.execute("InsertEmployeeLog");

        if (Mode == 'edit') {
            var SecondaryLogUpMessage = "Employee General Information Updated";
            const logSecUpRequest = transaction.request();
            logSecUpRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(Id, true))
                .input("AppUserId", UserId)
                .input("LogMessage", SecondaryLogUpMessage)
                .input("IsPrimaryStatus", false)
                .input("Revision", 0)
                .input("Indicator", 0);
            const LogSecUpResult = await logSecUpRequest.execute("InsertEmployeeLog");
        }

        const employeeDepartmentDeleteRequest = transaction.request();
        employeeDepartmentDeleteRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(Id, true));
        const EmployeeDepartmentDeleteResult = await employeeDepartmentDeleteRequest.execute("DeleteEmployeeDepartment");

        for (let i = 0; i < DepartmentsData.length; i++) {
            const employeeDepartmentDetailsRequest = transaction.request();
            employeeDepartmentDetailsRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(Id, true))
                .input("DepartmentId", cryptoEngine.ParamDecrypt(DepartmentsData[i].Id, true));

            const EmployeeDepartmentDetailsResult = await employeeDepartmentDetailsRequest.execute("InsertEmployeeDepartment");
        }

        const employeeSubDepartmentDeleteRequest = transaction.request();
        employeeSubDepartmentDeleteRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(Id, true));
        const EmployeeSubDepartmentDeleteResult =
            await employeeSubDepartmentDeleteRequest.execute("DeleteEmployeeSubDepartment");

        for (let i = 0; i < SubDepartmentsData.length; i++) {
            const employeeSubDepartmentDetailsRequest = transaction.request();
            employeeSubDepartmentDetailsRequest
                .input("EmployeeId", cryptoEngine.ParamDecrypt(Id, true))
                .input("SubDepartmentId", cryptoEngine.ParamDecrypt(SubDepartmentsData[i].Id, true));
            const EmployeeSubDepartmentDetailsResult = await employeeSubDepartmentDetailsRequest.execute("InsertEmployeeSubDepartment");
        }
        await transaction.commit();

        //     // let activityData = {
        //     //     Id: '414E2B5048745659672B513D',
        //     //     TransactionId: Id,
        //     //     TransactionType: 'Associate',
        //     //     Status: TransactionMode,
        //     //     Description: ''
        //     // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);
        res.status(200).send({ Status: true, Message: "", Data: { Id: Id } });
    } catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) {
            errorMessage = "Duplicate record. Record already exists.";
        }

        res.status(500).send(errorMessage);
    }
};

exports.SaveEmployeeDetails = async (req, res) => {
    var { Id, MobileNumber, TelephoneNumber, Email, HealthIssues, EmergencyContactName1, EmergencyMobileNumber1, EmergencyEmail1, EmergencyContactName2, EmergencyMobileNumber2, EmergencyEmail2, BloodGroupId, Mode } = req.body;

    var errorMessage = "Error while saving employee data...";

    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    if (Mode == 'edit') {
        await this.CheckEmployeeVerificationProcess(req, res, Id);
    }



    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(Id, true) != 0) {
            const request = transaction.request();
            request
                .input("Id", cryptoEngine.ParamDecrypt(Id, true))
                .input("MobileNumber", MobileNumber)
                .input("TelephoneNumber", TelephoneNumber)
                .input("Email", Email)
                .input("HealthIssues", HealthIssues)
                .input("EmergencyContactName1", EmergencyContactName1)
                .input("EmergencyMobileNumber1", EmergencyMobileNumber1)
                .input("EmergencyEmail1", EmergencyEmail1)
                .input("EmergencyContactName2", EmergencyContactName2)
                .input("EmergencyMobileNumber2", EmergencyMobileNumber2)
                .input("EmergencyEmail2", EmergencyEmail2)
                .input("IsEmployeeDetailsCompleted", true);

            const result = await request.execute("UpdateEmployeeDetails");
        }

        if (cryptoEngine.ParamDecrypt(Id, true) != 0) {
            const employeeBloodDetailsRequest = transaction.request();
            employeeBloodDetailsRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(Id, true));
            employeeBloodDetailsRequest.input("BloodGroupId", cryptoEngine.ParamDecrypt(BloodGroupId, true));
            const EmployeeBloodDetailsResult = await employeeBloodDetailsRequest.execute("InsertEmployeeBloodGroup");
        }

        var SecondaryLogMessage = "Employee Details Created";
        const logSecRequest = transaction.request();
        logSecRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(Id, true))
            .input("AppUserId", UserId)
            .input("LogMessage", SecondaryLogMessage)
            .input("IsPrimaryStatus", false)
            .input("Revision", 0)
            .input("Indicator", 0);
        const LogSecResult = await logSecRequest.execute("InsertEmployeeLog");

        if (Mode == 'edit') {
            var SecondaryLogUpMessage = "Employee Details Updated";
            const logSecUpRequest = transaction.request();
            logSecUpRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(Id, true))
                .input("AppUserId", UserId)
                .input("LogMessage", SecondaryLogUpMessage)
                .input("IsPrimaryStatus", false)
                .input("Revision", 0)
                .input("Indicator", 0);
            const LogSecUpResult = await logSecUpRequest.execute("InsertEmployeeLog");
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
        res.status(200).send({ Status: true, Message: "", Data: { Id: Id } });
    } catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) {
            errorMessage = "Duplicate record. Record already exists.";
        }

        res.status(500).send(errorMessage);
    }
};

exports.SaveEmployeePhotoDetails = async (req, res) => {
    var { Id, PANCardNumber, AadharCardNumber, DateOfBirth, DateOfAnniversary, Mode } = req.body;

    const readCheckRequest = req.app.locals.db.request();
    readCheckRequest.input("Id", cryptoEngine.ParamDecrypt(Id, true))
        .input("PANCardNumber", PANCardNumber);
    const readCheckResult = await readCheckRequest.execute("CheckDuplicateEmployeeRecord");
    if (readCheckResult.recordset.length > 0) {
        res.status(200).send({ Status: false, Message: 'Employee already exists with PAN card number ' + PANCardNumber });
        return;
    }

    var errorMessage = "Error while saving employee data...";
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    if (Mode == 'edit') {
        await this.CheckEmployeeVerificationProcess(req, res, Id);
    }

    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(Id, true) != 0) {
            const request = transaction.request();
            request
                .input("Id", cryptoEngine.ParamDecrypt(Id, true))
                .input("PANCardNumber", PANCardNumber)
                .input("AadharCardNumber", AadharCardNumber)
                .input("IsPhotoIdCompleted", true)
                .input("DateOfBirth", DateOfBirth)
                .input("DateOfAnniversary", DateOfAnniversary);

            const result = await request.execute("UpdateEmployeePhotoDetails");
        }

        if (req.files) {
            if (req.files.PanCardDocumentFile) {
                var fileTypeData = mime.lookup(req.files.PanCardDocumentFile.name);
                const fileRequest = transaction.request();
                fileRequest
                    .input("EmployeeId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "PAN Card")
                    .input("FileName", req.files.PanCardDocumentFile.name)
                    .input("FileContent", req.files.PanCardDocumentFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertEmployeeDocument");
            }

            if (req.files.AadharCardDocumentFile) {
                var fileTypeData = mime.lookup(req.files.AadharCardDocumentFile.name);
                const fileRequest = transaction.request();
                fileRequest
                    .input("EmployeeId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "Aadhar Card")
                    .input("FileName", req.files.AadharCardDocumentFile.name)
                    .input("FileContent", req.files.AadharCardDocumentFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertEmployeeDocument");
            }

            if (req.files.SelfPhotoDocumentFile) {
                var fileTypeData = mime.lookup(req.files.SelfPhotoDocumentFile.name);
                const fileRequest = transaction.request();
                fileRequest
                    .input("EmployeeId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "Self Photo")
                    .input("FileName", req.files.SelfPhotoDocumentFile.name)
                    .input("FileContent", req.files.SelfPhotoDocumentFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertEmployeeDocument");
            }
        }

        var SecondaryLogMessage = "Employee Photo Id Details Created";
        const logSecRequest = transaction.request();
        logSecRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(Id, true))
            .input("AppUserId", UserId)
            .input("LogMessage", SecondaryLogMessage)
            .input("IsPrimaryStatus", false)
            .input("Revision", 0)
            .input("Indicator", 0);
        const LogSecResult = await logSecRequest.execute("InsertEmployeeLog");

        if (Mode == 'edit') {
            var SecondaryLogUpMessage = "Employee Photo Id Details Updated";
            const logSecUpRequest = transaction.request();
            logSecUpRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(Id, true))
                .input("AppUserId", UserId)
                .input("LogMessage", SecondaryLogUpMessage)
                .input("IsPrimaryStatus", false)
                .input("Revision", 0)
                .input("Indicator", 0);
            const LogSecUpResult = await logSecUpRequest.execute("InsertEmployeeLog");
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
        res.status(200).send({ Status: true, Message: "", Data: { Id: Id } });
    } catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_Employee_AadharCardNumber")) {
            errorMessage = "Pan card already exists.";
        }
        else if (err.message.includes("UK_Employee_PANCardNumber")) {
            errorMessage = "Aadhar card already exists.";
        }
        // else if(err.message.includes("UK_")) {
        //     errorMessage = "Duplicate record. Record already exists.";
        // }
        else {
            errorMessage = "Duplicate record. Record already exists.";
        }

        res.status(500).send(errorMessage);
    }
};

exports.SaveEmployeeAddressDetails = async (req, res) => {
    var { Id, EmployeeId, CAddress1, CAddress2, CAddress3, CCity, CStateId, CCountryId, CPinCode, IsPermanentSame, PAddress1, PAddress2, PAddress3, PCity, PStateId, PCountryId, PPinCode, Mode } = req.body;

    var errorMessage = "Error while saving employee data...";

    if (Mode == 'edit') {
        await this.CheckEmployeeVerificationProcess(req, res, EmployeeId);
    }
    // // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(Id, true) == 0) {
            const request = transaction.request();
            request
                .output("Id", msSql.BigInt)
                .input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                .input("CAddress1", CAddress1)
                .input("CAddress2", CAddress2)
                .input("CAddress3", CAddress3)
                .input("CCity", CCity)
                .input("CStateId", cryptoEngine.ParamDecrypt(CStateId, true))
                .input("CCountryId", cryptoEngine.ParamDecrypt(CCountryId, true))
                .input("CPinCode", CPinCode)
                .input("IsPermanentSame", IsPermanentSame)
                .input("PAddress1", PAddress1)
                .input("PAddress2", PAddress2)
                .input("PAddress3", PAddress3)
                .input("PCity", PCity)
                .input("PStateId", cryptoEngine.ParamDecrypt(PStateId, true))
                .input("PCountryId", cryptoEngine.ParamDecrypt(PCountryId, true))
                .input("PPinCode", PPinCode);

            const result = await request.execute("InsertEmployeeAddress");
            Id = cryptoEngine.ParamEncrypt(result.output.Id, true);
        } else {
            const request = transaction.request();
            request
                .input("Id", cryptoEngine.ParamDecrypt(Id, true))
                .input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                .input("CAddress1", CAddress1)
                .input("CAddress2", CAddress2)
                .input("CAddress3", CAddress3)
                .input("CCity", CCity)
                .input("CStateId", cryptoEngine.ParamDecrypt(CStateId, true))
                .input("CCountryId", cryptoEngine.ParamDecrypt(CCountryId, true))
                .input("CPinCode", CPinCode)
                .input("IsPermanentSame", IsPermanentSame)
                .input("PAddress1", PAddress1)
                .input("PAddress2", PAddress2)
                .input("PAddress3", PAddress3)
                .input("PCity", PCity)
                .input("PStateId", cryptoEngine.ParamDecrypt(PStateId, true))
                .input("PCountryId", cryptoEngine.ParamDecrypt(PCountryId, true))
                .input("PPinCode", PPinCode);
            const result = await request.execute("UpdateEmployeeAddress");
        }

        const employeeAddressCompleteRequest = transaction.request();
        employeeAddressCompleteRequest.input("Id", cryptoEngine.ParamDecrypt(EmployeeId, true))
        employeeAddressCompleteRequest.input("IsAddressCompleted", true)
        const EmployeeAddressCompleteRequest = await employeeAddressCompleteRequest.execute("UpdateEmployeeAddressCompleted");

        if (req.files) {
            if (req.files.CorrospondanceDocumentFile) {
                var fileTypeData = mime.lookup(
                    req.files.CorrospondanceDocumentFile.name
                );
                const fileRequest = transaction.request();
                fileRequest
                    .input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                    .input("Name", "Correspondence Address Proof")
                    .input("FileName", req.files.CorrospondanceDocumentFile.name)
                    .input("FileContent", req.files.CorrospondanceDocumentFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertEmployeeDocument");
            }

            if (req.files.PermenantDocumentFile) {
                var fileTypeData = mime.lookup(req.files.PermenantDocumentFile.name);
                const fileRequest = transaction.request();
                fileRequest
                    .input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                    .input("Name", "Permanent Address Proof")
                    .input("FileName", req.files.PermenantDocumentFile.name)
                    .input("FileContent", req.files.PermenantDocumentFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertEmployeeDocument");
            }
        }


        var SecondaryLogMessage = "Employee Address Details Created";
        const logSecRequest = transaction.request();
        logSecRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", SecondaryLogMessage)
            .input("IsPrimaryStatus", false)
            .input("Revision", 0)
            .input("Indicator", 0);
        const LogSecResult = await logSecRequest.execute("InsertEmployeeLog");

        if (Mode == 'edit') {
            var SecondaryLogUpMessage = "Employee Address Details Updated";
            const logSecUpRequest = transaction.request();
            logSecUpRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                .input("AppUserId", UserId)
                .input("LogMessage", SecondaryLogUpMessage)
                .input("IsPrimaryStatus", false)
                .input("Revision", 0)
                .input("Indicator", 0);
            const LogSecUpResult = await logSecUpRequest.execute("InsertEmployeeLog");
        }
        await transaction.commit();

        //     // let activityData = {
        //     //     Id: '414E2B5048745659672B513D',
        //     //     TransactionId: Id,
        //     //     TransactionType: 'Associate',
        //     //     Status: TransactionMode,
        //     //     Description: ''
        //     // };

        //     // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);
        res.status(200).send({ Status: true, Message: "", Data: { Id: EmployeeId } });
    } catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) {
            errorMessage = "Duplicate record. Record already exists.";
        }

        res.status(500).send(errorMessage);
    }
};

exports.SaveEmployeeBankDetails = async (req, res) => {
    var { Id, EmployeeId, IFSC, BankName, Branch, MICR, BankAccountTypeId, AccountNumber, Mode } = req.body;

    var errorMessage = "Error while saving employee data...";

    if (Mode == 'edit') {
        await this.CheckEmployeeVerificationProcess(req, res, EmployeeId);
    }
    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(Id, true) == 0) {
            const request = transaction.request();
            request
                .output("Id", msSql.BigInt)
                .input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                .input("IFSC", IFSC.toUpperCase())
                .input("BankName", BankName)
                .input("Branch", Branch)
                .input("MICR", MICR)
                .input("BankAccountTypeId", cryptoEngine.ParamDecrypt(BankAccountTypeId, true))
                .input("AccountNumber", AccountNumber);

            const result = await request.execute("InsertEmployeeBank");
        } else {
            const request = transaction.request();
            request
                .input("Id", cryptoEngine.ParamDecrypt(Id, true))
                .input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                .input("IFSC", IFSC.toUpperCase())
                .input("BankName", BankName)
                .input("Branch", Branch)
                .input("MICR", MICR)
                .input("BankAccountTypeId", cryptoEngine.ParamDecrypt(BankAccountTypeId, true))
                .input("AccountNumber", AccountNumber);
            const result = await request.execute("UpdateEmployeeBank");
        }

        const employeeBankCompleteRequest = transaction.request();
        employeeBankCompleteRequest.input("Id", cryptoEngine.ParamDecrypt(EmployeeId, true))
        employeeBankCompleteRequest.input("IsBankCompleted", true)
        const EmployeeBankCompleteRequest = await employeeBankCompleteRequest.execute("UpdateEmployeeBankCompleted");

        if (req.files) {
            if (req.files.BankDetailsDocumentFile) {
                var fileTypeData = mime.lookup(req.files.BankDetailsDocumentFile.name);
                const fileRequest = transaction.request();
                fileRequest
                    .input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                    .input("Name", "Bank Proof")
                    .input("FileName", req.files.BankDetailsDocumentFile.name)
                    .input("FileContent", req.files.BankDetailsDocumentFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertEmployeeDocument");
            }
        }


        var SecondaryLogMessage = "Employee Bank Details Created";
        const logSecRequest = transaction.request();
        logSecRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", SecondaryLogMessage)
            .input("IsPrimaryStatus", false)
            .input("Revision", 0)
            .input("Indicator", 0);
        const LogSecResult = await logSecRequest.execute("InsertEmployeeLog");

        if (Mode == 'edit') {
            var SecondaryLogUpMessage = "Employee Bank Details Updated";
            const logSecUpRequest = transaction.request();
            logSecUpRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                .input("AppUserId", UserId)
                .input("LogMessage", SecondaryLogUpMessage)
                .input("IsPrimaryStatus", false)
                .input("Revision", 0)
                .input("Indicator", 0);
            const LogSecUpResult = await logSecUpRequest.execute("InsertEmployeeLog");
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
        res
            .status(200)
            .send({ Status: true, Message: "", Data: { Id: EmployeeId } });
    } catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) {
            errorMessage = "Duplicate record. Record already exists.";
        }

        res.status(500).send(errorMessage);
    }
};

exports.SaveEmployeeCertificateDetails = async (req, res) => {
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    var { Id, EmployeeId, NismVaNumber, NismVaValidDate, EUINHolderName, EUIN, EUINValidDate, CANumber, CAValidDate, CSNumber, CSValidDate, DegreeName, DegreeNumber, DegreeValidDate, CertificationTypes, Mode } = req.body;

    if (NismVaValidDate == undefined) {
        NismVaValidDate = null;
    }
    if (EUINValidDate == undefined) {
        EUINValidDate = null;
    }
    if (CAValidDate == undefined) {
        CAValidDate = null;
    }
    if (CSValidDate == undefined) {
        CSValidDate = null;
    }
    if (DegreeValidDate == undefined) {
        DegreeValidDate = null;
    }

    let CertificationTypesData = JSON.parse(CertificationTypes);

    var errorMessage = "Error while saving employee data...";

    if (Mode == 'edit') {
        await this.CheckEmployeeVerificationProcess(req, res, EmployeeId);
    }

    var Revision = 0;

    const readRequest = req.app.locals.db.request();
    readRequest.input("Id", cryptoEngine.ParamDecrypt(EmployeeId, true));
    const readResult = await readRequest.execute("GetEmployeeRevision");

    if (readResult.recordset.length > 0) {
        let dataItem = readResult.recordset[0];
        Revision = dataItem.Revision;
    }

    // // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    try {
        var photoIdData;

        const readRequest = req.app.locals.db.request();
        readRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
        const readResult = await readRequest.execute("GetEmployeePhotoIdDetailsById");
        if (readResult.recordset.length > 0) {
            photoIdData = readResult.recordset[0];
        }

        let UserName = photoIdData.PANCardNumber;
        let EntityDate = photoIdData.DateOfBirth;

        let AppUserId = await appUserController.CreateAppUser(req, res, '414E2B5048745659672B513D', UserName, EntityDate, '414E2B5048745659672B513D', EmployeeId, '414E2B5048745659672B513D', '414E2B5048745659672B513D');

    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
        return;
    }

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(Id, true) == 0) {
            const request = transaction.request();
            request.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                .input("NismVaNumber", NismVaNumber)
                .input("NismVaValidDate", NismVaValidDate)
                .input("EUINHolderName", EUINHolderName)
                .input("EUIN", EUIN)
                .input("EUINValidDate", EUINValidDate)
                .input("CANumber", CANumber)
                .input("CAValidDate", CAValidDate)
                .input("CSNumber", CSNumber)
                .input("CSValidDate", CSValidDate)
                .input("DegreeName", DegreeName)
                .input("DegreeNumber", DegreeNumber)
                .input("DegreeValidDate", DegreeValidDate);

            const result = await request.execute("InsertEmployeeCertificate");

        } else {
            const request = transaction.request();
            request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                .input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                .input("NismVaNumber", NismVaNumber)
                .input("NismVaValidDate", NismVaValidDate)
                .input("EUINHolderName", EUINHolderName)
                .input("EUIN", EUIN)
                .input("EUINValidDate", EUINValidDate)
                .input("CANumber", CANumber)
                .input("CAValidDate", CAValidDate)
                .input("CSNumber", CSNumber)
                .input("CSValidDate", CSValidDate)
                .input("DegreeName", DegreeName)
                .input("DegreeNumber", DegreeNumber)
                .input("DegreeValidDate", DegreeValidDate);
            const result = await request.execute("UpdateEmployeeCertificate");
        }

        const employeeCertificationCompleteRequest = transaction.request();
        employeeCertificationCompleteRequest.input("Id", cryptoEngine.ParamDecrypt(EmployeeId, true))
        employeeCertificationCompleteRequest.input("IsCertificationCompleted", true)
        const EmployeeCertificationCompleteRequest = await employeeCertificationCompleteRequest.execute("UpdateEmployeeCertificationCompleted");


        var LogMessage = "Pending for Supervisior Verification";
        const logRequest = transaction.request();
        logRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", LogMessage)
            .input("IsPrimaryStatus", true)
            .input("Revision", Revision)
            .input("Indicator", 2);
        const LogResult = await logRequest.execute("InsertEmployeeLog");


        var SecondaryLogMessage = "Employee Certification Details Created";
        const logSecRequest = transaction.request();
        logSecRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", SecondaryLogMessage)
            .input("IsPrimaryStatus", false)
            .input("Revision", 0)
            .input("Indicator", 0);
        const LogSecResult = await logSecRequest.execute("InsertEmployeeLog");

        if (Mode == 'edit') {
            var SecondaryLogUpMessage = "Employee Certification Details Updated";
            const logSecUpRequest = transaction.request();
            logSecUpRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                .input("AppUserId", UserId)
                .input("LogMessage", SecondaryLogUpMessage)
                .input("IsPrimaryStatus", false)
                .input("Revision", 0)
                .input("Indicator", 0);
            const LogSecUpResult = await logSecUpRequest.execute("InsertEmployeeLog");
        }

        const employeeCertificationTypeDeleteRequest = transaction.request();
        employeeCertificationTypeDeleteRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
        const EmployeeCertificationTypeDeleteResult = await employeeCertificationTypeDeleteRequest.execute("DeleteEmployeeCertificationType");

        for (let i = 0; i < CertificationTypesData.length; i++) {
            const employeeCertificationTypeRequest = transaction.request();
            employeeCertificationTypeRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                .input("CertificationType", CertificationTypesData[i]);
            const EmployeeCertificationTypeResult = await employeeCertificationTypeRequest.execute("InsertEmployeeCertificationType");
        }

        if (req.files) {

            if (req.files.NismVaCertificateDocumentFile != undefined) {
                var fileTypeData = mime.lookup(
                    req.files.NismVaCertificateDocumentFile.name
                );
                const fileRequest = transaction.request();
                fileRequest
                    .input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                    .input("Name", "NISM VA Certificate")
                    .input("FileName", req.files.NismVaCertificateDocumentFile.name)
                    .input("FileContent", req.files.NismVaCertificateDocumentFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertEmployeeDocument");
            }

            if (req.files.EuinProofDocumentFile != undefined) {
                var fileTypeData = mime.lookup(req.files.EuinProofDocumentFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                    .input("Name", "EUIN Proof")
                    .input("FileName", req.files.EuinProofDocumentFile.name)
                    .input("FileContent", req.files.EuinProofDocumentFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertEmployeeDocument");
            }

            if (req.files.CaCertificateDocumentFile != undefined) {
                var fileTypeData = mime.lookup(req.files.CaCertificateDocumentFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                    .input("Name", "CA Certificate")
                    .input("FileName", req.files.CaCertificateDocumentFile.name)
                    .input("FileContent", req.files.CaCertificateDocumentFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertEmployeeDocument");
            }

            if (req.files.CsCertificateDocumentFile != undefined) {
                var fileTypeData = mime.lookup(req.files.CsCertificateDocumentFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                    .input("Name", "CS Certificate")
                    .input("FileName", req.files.CsCertificateDocumentFile.name)
                    .input("FileContent", req.files.CsCertificateDocumentFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertEmployeeDocument");
            }

            if (req.files.DegreeCertificateDocumentFile != undefined) {
                var fileTypeData = mime.lookup(req.files.DegreeCertificateDocumentFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                    .input("Name", "Degree Certificate")
                    .input("FileName", req.files.DegreeCertificateDocumentFile.name)
                    .input("FileContent", req.files.DegreeCertificateDocumentFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertEmployeeDocument");
            }
        }

        await transaction.commit();

        //     // let activityData = {
        //     //     Id: '414E2B5048745659672B513D',
        //     //     TransactionId: Id,
        //     //     TransactionType: 'Associate',
        //     //     Status: TransactionMode,
        //     //     Description: ''
        //     // };

        //     // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);
        res.status(200).send({ Status: true, Message: "", Data: { Id: EmployeeId } });
    } catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) {
            errorMessage = "Duplicate record. Record already exists.";
        }

        res.status(500).send(errorMessage);
    }
};

exports.SaveEmployeeRights = async (req, res) => {
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    var { EmployeeMenuData, EmployeeId, AppUserId, Mode } = req.body;

    var createdByData;

    let EmployeeMenuoptionsData = JSON.parse(EmployeeMenuData);

    var errorMessage = "Error while saving associate rights data...";
    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    var Revision = 0;

    const readRequest = req.app.locals.db.request();
    readRequest.input("Id", cryptoEngine.ParamDecrypt(EmployeeId, true));
    const readResult = await readRequest.execute("GetEmployeeRevision");

    if (readResult.recordset.length > 0) {
        let dataItem = readResult.recordset[0];
        Revision = dataItem.Revision;
    }

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const employeeAppUserMenuOptionRequest = transaction.request();
        employeeAppUserMenuOptionRequest.input("AppUserId", cryptoEngine.ParamDecrypt(AppUserId, true));
        const EmployeeAppUserMenuOptionRequest = await employeeAppUserMenuOptionRequest.execute("DeleteAppUserMenuOptions");

        for (let i = 0; i < EmployeeMenuoptionsData.length; i++) {
            const request = transaction.request();
            request.input("AppUserId", cryptoEngine.ParamDecrypt(EmployeeMenuoptionsData[i].AppUserId, true))
                .input("MenuOptionId", cryptoEngine.ParamDecrypt(EmployeeMenuoptionsData[i].MenuOptionId, true))
                .input("IsCreate", EmployeeMenuoptionsData[i].IsCreate)
            const result = await request.execute("InsertAppUserMenuOption");
        }

        const employeeRightsCompleteRequest = transaction.request();
        employeeRightsCompleteRequest.input("Id", cryptoEngine.ParamDecrypt(EmployeeId, true))
        employeeRightsCompleteRequest.input("IsRightsCompleted", true)
        const EmployeeRightsCompleteRequest = await employeeRightsCompleteRequest.execute("UpdateEmployeeRightsCompleted");


        var LogMessage = "Approved By Supervisior";
        const logRequest = transaction.request();
        logRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", LogMessage)
            .input("IsPrimaryStatus", true)
            .input("Revision", Revision)
            .input("Indicator", 3);
        const LogResult = await logRequest.execute("InsertEmployeeLog");



        var LogVerificationMessage = "Pending for Employee Verification";
        const logVerificationRequest = transaction.request();
        logVerificationRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", LogVerificationMessage)
            .input("IsPrimaryStatus", true)
            .input("Revision", Revision)
            .input("Indicator", 2);
        const LogVerificationResult = await logVerificationRequest.execute("InsertEmployeeLog");

        var SecondaryLogMessage = "Employee Rights Details Created";
        const logSecRequest = transaction.request();
        logSecRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", SecondaryLogMessage)
            .input("IsPrimaryStatus", false)
            .input("Revision", 0)
            .input("Indicator", 0);
        const LogSecResult = await logSecRequest.execute("InsertEmployeeLog");

        if (Mode == 'edit') {
            var SecondaryLogUpMessage = "Employee Rights Details Updated";
            const logSecUpRequest = transaction.request();
            logSecUpRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                .input("AppUserId", UserId)
                .input("LogMessage", SecondaryLogUpMessage)
                .input("IsPrimaryStatus", false)
                .input("Revision", 0)
                .input("Indicator", 0);
            const LogSecUpResult = await logSecUpRequest.execute("InsertEmployeeLog");
        }

        const readRequest = transaction.request();
        readRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
        const readResult = await readRequest.execute("GetEmployeeGeneralInfoById");

        if (readResult.recordset.length > 0) {
            createdByData = readResult.recordset[0];
        }

        var timeStamp = new Date();
        var link = process.env.WEB_APP_LINK + "/employee-self-verification/" + EmployeeId + "/" + cryptoEngine.ParamEncrypt('externalverify', true) + "/" + cryptoEngine.ParamEncrypt(timeStamp.toISOString(), true);

        //  console.log(link);


        emailEngine.SendEmployeeVerification(createdByData.Email, createdByData.Name, link);

        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'Associate',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);
        res.status(200).send({ Status: true, Message: "Employee Rights Saved Successfully.", Data: createdByData });
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

exports.SaveEmployeeTermsConditions = async (req, res) => {
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    var { Id, EmployeeId, IsSelfVerified } = req.body;
    var errorMessage = "Error while saving employee data...";


    var Revision = 0;

    const readRequest = req.app.locals.db.request();
    readRequest.input("Id", cryptoEngine.ParamDecrypt(EmployeeId, true));
    const readResult = await readRequest.execute("GetEmployeeRevision");

    if (readResult.recordset.length > 0) {
        let dataItem = readResult.recordset[0];
        Revision = dataItem.Revision;
    }

    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(Id, true) != 0) {
            const request = transaction.request();
            request.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                .input("TermsConditionsId", cryptoEngine.ParamDecrypt(Id, true))
            const result = await request.execute("InsertEmployeeTermsConditions");
        }


        var LogMessage = "Employee Approved";
        const logRequest = transaction.request();
        logRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", LogMessage)
            .input("IsPrimaryStatus", true)
            .input("Revision", Revision)
            .input("Indicator", 3);
        const LogResult = await logRequest.execute("InsertEmployeeLog");



        var LogEmpanelmentMessage = "Pending for Empanelment Form";
        const logEmpanelmentRequest = transaction.request();
        logEmpanelmentRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", LogEmpanelmentMessage)
            .input("IsPrimaryStatus", true)
            .input("Revision", Revision)
            .input("Indicator", 2);
        const LogEmpanelmentResult = await logEmpanelmentRequest.execute("InsertEmployeeLog");


        await transaction.commit();

    } catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) {
            errorMessage = "Duplicate record. Record already exists.";
        }

        res.status(500).send(errorMessage);
    }

    try {
        await transaction.begin();

        const request = transaction.request();
        request.input("Id", cryptoEngine.ParamDecrypt(EmployeeId, true))
            .input("IsSelfVerified", IsSelfVerified);

        const result = await request.execute("UpdateEmployeeSelfVerification");

        const requestAppUser = transaction.request();
        requestAppUser.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
            .input("IsActive", true);

        const resultAppUser = await requestAppUser.execute("UpdateEmployeeAppUserActive");

        await transaction.commit();

        res.status(200).send({ Status: true, Message: "", Data: EmployeeId });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }

};

exports.SaveEmployeeRejection = async (req, res) => {
    var { EmployeeId, RejectionMessage } = req.body;

    var IsResolved = false;
    // let AssociateCommercialData = JSON.parse(AssociateCommercialDetails);
    var errorMessage = "Error while saving employeerejection data...";
    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';
    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(EmployeeId, true) !== 0) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                .input("RejectionMessage", RejectionMessage)
                .input("IsResolved", IsResolved);

            const result = await request.execute("InsertEmployeeRejection");
            Id = cryptoEngine.ParamEncrypt(result.output.Id, true);
        }


        await transaction.commit();
        res.status(200).send({ Status: true, Message: "", Data: EmployeeId });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.SaveEmployeeUploadDetails = async (req, res) => {
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    var { EmployeeId, CanSendCredential, Mode } = req.body;

    var errorMessage = "Error while saving employee data...";
    // // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';


    var Revision = 0;

    const readRequest = req.app.locals.db.request();
    readRequest.input("Id", cryptoEngine.ParamDecrypt(EmployeeId, true));
    const readResult = await readRequest.execute("GetEmployeeRevision");

    if (readResult.recordset.length > 0) {
        let dataItem = readResult.recordset[0];
        Revision = dataItem.Revision;
    }

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const requestStatus = transaction.request();
        requestStatus.input("Id", cryptoEngine.ParamDecrypt(EmployeeId, true))
            .input("IsActive", true)
        const employeeResult = await requestStatus.execute("UpdateEmployeeActive");

        const employeeUploadCompleteRequest = transaction.request();
        employeeUploadCompleteRequest.input("Id", cryptoEngine.ParamDecrypt(EmployeeId, true))
        employeeUploadCompleteRequest.input("IsDownloadCompleted", true)
        const EmployeeUploadCompleteRequest = await employeeUploadCompleteRequest.execute("UpdateEmployeeDownloadCompleted");



        var LogMessage = "Active";
        const logRequest = transaction.request();
        logRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", LogMessage)
            .input("IsPrimaryStatus", true)
            .input("Revision", Revision)
            .input("Indicator", 4);

        const LogResult = await logRequest.execute("InsertEmployeeLog");


        var SecondaryLogMessage = "Employee Upload Details Created";
        const logSecRequest = transaction.request();
        logSecRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", SecondaryLogMessage)
            .input("IsPrimaryStatus", false)
            .input("Revision", 0)
            .input("Indicator", 0);
        const LogSecResult = await logSecRequest.execute("InsertEmployeeLog");

        if (Mode == 'edit') {
            var SecondaryLogUpMessage = "Employee Upload Details Updated";
            const logSecUpRequest = transaction.request();
            logSecUpRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                .input("AppUserId", UserId)
                .input("LogMessage", SecondaryLogUpMessage)
                .input("IsPrimaryStatus", false)
                .input("Revision", 0)
                .input("Indicator", 0);
            const LogSecUpResult = await logSecUpRequest.execute("InsertEmployeeLog");
        }

        if (req.files) {

            if (req.files.EmpolymentAgreementeDocumentFile != undefined) {
                var fileTypeData = mime.lookup(req.files.EmpolymentAgreementeDocumentFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true))
                    .input("Name", "Empolyment Agreement")
                    .input("FileName", req.files.EmpolymentAgreementeDocumentFile.name)
                    .input("FileContent", req.files.EmpolymentAgreementeDocumentFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertEmployeeDocument");
            }
        }

        await transaction.commit();

    } catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) {
            errorMessage = "Duplicate record. Record already exists.";
        }

        res.status(500).send(errorMessage);
    }

    if (CanSendCredential == 'true') {
        try {
            var createdByData;
            var dataItem;


            const readRequest = req.app.locals.db.request();
            readRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
            const readResult = await readRequest.execute("GetEmployeePhotoIdDetailsById");
            if (readResult.recordset.length > 0) {
                photoIdData = readResult.recordset[0];
            }

            const readAppUserDetailsRequest = req.app.locals.db.request();
            readAppUserDetailsRequest.input("UserName", photoIdData.PANCardNumber);
            const AppUserDetailsResult = await readAppUserDetailsRequest.execute("GetAppUserByUserName");
            if (AppUserDetailsResult.recordset.length > 0) {
                dataItem = AppUserDetailsResult.recordset[0];

                pin = cryptoEngine.Decrypt(dataItem.Pin, true);
            }


            // const readEmailRequest = req.app.locals.db.request();
            // readEmailRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
            // const EmailResult = await readEmailRequest.execute("GetEmployeeDetailsById");

            // if (EmailResult.recordset.length > 0) {
            //     createdByData = EmailResult.recordset[0];
            // }

            const readEmployeeRequest = req.app.locals.db.request();
            readEmployeeRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
            const readEmployeeResult = await readEmployeeRequest.execute("GetEmployeeGeneralInfoById");
            if (readEmployeeResult.recordset.length > 0) {
                createdByData = readEmployeeResult.recordset[0];
            }

            var link = process.env.WEB_APP_LINK + "/signin";

            emailEngine.SendEmployeeCredentials(createdByData.Email, createdByData.Name, link, pin);

            res.status(200).send({ Status: true, Message: "", Data: { Id: EmployeeId } });
        }
        catch (err) {
            console.log(err);
            res.status(500).send(errorMessage);
        }
    }
    else {
        res.status(200).send({ Status: true, Message: "", Data: { Id: EmployeeId } });
    }
};

exports.GetEmployeeByAssociate = async (req, res) => {
    const AssociateId = req.params.AssociateId;
    var errorMessage = "Error while getting employee";

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("Id", cryptoEngine.ParamDecrypt(AssociateId, true));
        const readResult = await readRequest.execute("GetEmployeeByAssociateId");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    AssociateId: cryptoEngine.ParamEncrypt(dataList[i].AssociateId, true),
                    Name: dataList[i].Name,
                };
                data.push(dataItem);
            }
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetEmployeeViewLogById = async (req, res) => {
    const EmployeeId = req.params.EmployeeId;
    var errorMessage = "Error while getting employee view log";

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
        const readResult = await readRequest.execute("GetEmployeeViewLog");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    EmployeeId: cryptoEngine.ParamEncrypt(dataList[i].EmployeeId, true),
                    AppUserId: cryptoEngine.ParamEncrypt(dataList[i].AppUserId, true),
                    LogDate: dataList[i].LogDate,
                    LogMessage: dataList[i].LogMessage,
                    IsPrimaryStatus: dataList[i].IsPrimaryStatus
                };
                data.push(dataItem);
            }
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetSuperviseByAssociateByDesignation = async (req, res) => {
    const AssociateId = req.params.AssociateId;
    const DesignationId = req.params.DesignationId;
    var errorMessage = "Error while getting supervise";

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        readRequest.input("DesignationId", cryptoEngine.ParamDecrypt(DesignationId, true));
        const readResult = await readRequest.execute("GetSuperviseByAssociateByDesignationLevel");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    UserName: dataList[i].UserName,
                };
                data.push(dataItem);
            }
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetEmployeeGeneralInfoById = async (req, res) => {
    const employeeId = req.params.EmployeeId;

    var errorMessage = "Error while getiing employee data...";

    try {
        var dataItem;
        var employeeDepartmentData = [];
        var employeeSubDepartmentData = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(employeeId, true));
        const readResult = await readRequest.execute("GetEmployeeGeneralInfoById");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        const readEmployeeDepartmentDetailsRequest = req.app.locals.db.request();
        readEmployeeDepartmentDetailsRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(employeeId, true));
        const EmployeeDepartmentDetailsResult = await readEmployeeDepartmentDetailsRequest.execute("GetEmployeeDepartmentByEmployeeId");
        if (EmployeeDepartmentDetailsResult.recordset.length > 0) {
            var employeeDepartmentDetailsData = EmployeeDepartmentDetailsResult.recordset;
            for (let i = 0; i < employeeDepartmentDetailsData.length; i++) {
                var item = {
                    Id: cryptoEngine.ParamEncrypt(employeeDepartmentDetailsData[i].Id, true),
                    EmployeeId: cryptoEngine.ParamEncrypt(employeeDepartmentDetailsData[i].EmployeeId, true),
                    DepartmentId: cryptoEngine.ParamEncrypt(employeeDepartmentDetailsData[i].DepartmentId, true),
                };
                employeeDepartmentData.push(item);
            }
        }

        const readEmployeeSubDepartmentDetailsRequest = req.app.locals.db.request();
        readEmployeeSubDepartmentDetailsRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(employeeId, true));
        const EmployeeSubDepartmentDetailsResult = await readEmployeeSubDepartmentDetailsRequest.execute("GetEmployeeSubDepartmentByEmployeeId");
        if (EmployeeSubDepartmentDetailsResult.recordset.length > 0) {
            var employeeSubDepartmentDetailsData = EmployeeSubDepartmentDetailsResult.recordset;
            for (let i = 0; i < employeeSubDepartmentDetailsData.length; i++) {
                var item = {
                    Id: cryptoEngine.ParamEncrypt(employeeSubDepartmentDetailsData[i].Id, true),
                    EmployeeId: cryptoEngine.ParamEncrypt(employeeSubDepartmentDetailsData[i].EmployeeId, true),
                    SubDepartmentId: cryptoEngine.ParamEncrypt(employeeSubDepartmentDetailsData[i].SubDepartmentId, true),
                    Name: employeeSubDepartmentDetailsData[i].Name,
                    Code: employeeSubDepartmentDetailsData[i].Code,
                    DepartmentId: cryptoEngine.ParamEncrypt(employeeSubDepartmentDetailsData[i].DepartmentId, true),
                };
                employeeSubDepartmentData.push(item);
            }
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                AssociateId: cryptoEngine.ParamEncrypt(dataItem.AssociateId, true),
                DesignationId: cryptoEngine.ParamEncrypt(dataItem.DesignationId, true),
                SupervisorAppUserId: cryptoEngine.ParamEncrypt(dataItem.SupervisorAppUserId, true),
                Name: dataItem.Name,
                MobileNumber: dataItem.MobileNumber,
                TelephoneNumber: dataItem.TelephoneNumber,
                Email: dataItem.Email,
                HealthIssues: dataItem.HealthIssues,
                EmergencyContactName1: dataItem.EmergencyContactName1,
                EmergencyMobileNumber1: dataItem.EmergencyMobileNumber1,
                EmergencyEmail1: dataItem.EmergencyEmail1,
                EmergencyContactName2: dataItem.EmergencyContactName2,
                EmergencyMobileNumber2: dataItem.EmergencyMobileNumber2,
                EmergencyEmail2: dataItem.EmergencyEmail2,
                PANCardNumber: dataItem.PANCardNumber,
                AadharCardNumber: dataItem.AadharCardNumber,
                DateOfBirth: dataItem.DateOfBirth,
                DateOfAnniversary: dataItem.DateOfAnniversary,
                IsActive: dataItem.IsActive,
                IsAdminVerified: dataItem.IsAdminVerified,
                IsSelfVerified: dataItem.IsSelfVerified,
                EmployeeDepartmentData: employeeDepartmentData,
                EmployeeSubDepartmentData: employeeSubDepartmentData,
            };
        }
        res.status(200).send({ Status: (dataItem != null), Message: "", Data: data });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetEmployeeDetailsById = async (req, res) => {
    const employeeId = req.params.EmployeeId;
    var errorMessage = "Error while getiing employee data...";

    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input(
            "EmployeeId",
            cryptoEngine.ParamDecrypt(employeeId, true)
        );
        const readResult = await readRequest.execute("GetEmployeeDetailsById");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                MobileNumber: dataItem.MobileNumber,
                TelephoneNumber: dataItem.TelephoneNumber,
                Email: dataItem.Email,
                HealthIssues: dataItem.HealthIssues,
                EmergencyContactName1: dataItem.EmergencyContactName1,
                EmergencyMobileNumber1: dataItem.EmergencyMobileNumber1,
                EmergencyEmail1: dataItem.EmergencyEmail1,
                EmergencyContactName2: dataItem.EmergencyContactName2,
                EmergencyMobileNumber2: dataItem.EmergencyMobileNumber2,
                EmergencyEmail2: dataItem.EmergencyEmail2,
                BloodGroupId: cryptoEngine.ParamEncrypt(dataItem.BloodGroupId, true),
            };
        }
        res.status(200).send({ Status: (dataItem != null), Message: "", Data: data });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetEmployeePhotoIdDetailsById = async (req, res) => {
    const employeeId = req.params.EmployeeId;
    var errorMessage = "Error while getting employee photo id details data"
    try {
        var photoIdData;


        const readRequest = req.app.locals.db.request();
        readRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(employeeId, true));
        const readResult = await readRequest.execute("GetEmployeePhotoIdDetailsById");
        if (readResult.recordset.length > 0) {
            photoIdData = readResult.recordset[0];
        }

        if (photoIdData != null) {
            var data = {
                Id: cryptoEngine.ParamEncrypt(photoIdData.Id, true),
                // EmployeeId: photoIdData == true ? "414E2B5048745659672B513D" : employeeId,

                PANCardNumber: photoIdData.PANCardNumber,
                AadharCardNumber: photoIdData.AadharCardNumber,
                DateOfBirth: photoIdData.DateOfBirth,
                DateOfAnniversary: photoIdData.DateOfAnniversary,
                PanCardProofFileName: photoIdData.PanCardProofFileName,
                AadharCardProofFileName: photoIdData.AadharCardProofFileName,
                SelfPhotoProofFileName: photoIdData.SelfPhotoProofFileName,

            };
        }
        res.status(200).send({ Status: (photoIdData != null), Message: "", Data: data });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetEmployeeAddressDetailsById = async (req, res) => {
    const employeeId = req.params.EmployeeId;
    var errorMessage = "Error while getiing employee data...";

    try {
        var addressData;


        const readRequest = req.app.locals.db.request();
        readRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(employeeId, true));
        const readResult = await readRequest.execute("GetEmployeeAddressDetailsById");
        if (readResult.recordset.length > 0) {
            addressData = readResult.recordset[0];
        }

        if (addressData != null) {
            var data = {
                Id: cryptoEngine.ParamEncrypt(addressData.Id, true),
                // EmployeeId:addressData == true ? "414E2B5048745659672B513D" : employeeId,
                EmployeeId: cryptoEngine.ParamEncrypt(addressData.EmployeeId, true),
                CAddress1: addressData.CAddress1,
                CAddress2: addressData.CAddress2,
                CAddress3: addressData.CAddress3,
                CCity: addressData.CCity,
                CStateId: cryptoEngine.ParamEncrypt(addressData.CStateId, true),
                CCountryId: cryptoEngine.ParamEncrypt(addressData.CCountryId, true),
                CPinCode: addressData.CPinCode,
                IsPermanentSame: addressData.IsPermanentSame,
                PAddress1: addressData.PAddress1,
                PAddress2: addressData.PAddress2,
                PAddress3: addressData.PAddress3,
                PCity: addressData.PCity,
                PStateId: cryptoEngine.ParamEncrypt(addressData.PStateId, true),
                PCountryId: cryptoEngine.ParamEncrypt(addressData.PCountryId, true),
                PPinCode: addressData.PPinCode,
                CorrospondanceAddressFileName: addressData.CorrospondanceAddressFileName,
                PermenantAddressFileName: addressData.PermenantAddressFileName,

            };
        }
        res.status(200).send({ Status: (addressData != null), Message: "", Data: data });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetEmployeeBankDetailsById = async (req, res) => {
    const employeeId = req.params.EmployeeId;
    var errorMessage = "Error while getting employee bank details data"
    try {
        var bankData;


        const readRequest = req.app.locals.db.request();
        readRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(employeeId, true));
        const readResult = await readRequest.execute("GetEmployeeBankDetailsById");
        if (readResult.recordset.length > 0) {
            bankData = readResult.recordset[0];
        }

        if (bankData != null) {
            var data = {
                Id: cryptoEngine.ParamEncrypt(bankData.Id, true),
                // EmployeeId: bankData == true ? "414E2B5048745659672B513D" : employeeId,
                EmployeeId: cryptoEngine.ParamEncrypt(bankData.EmployeeId, true),
                IFSC: bankData.IFSC,
                BankName: bankData.BankName,
                Branch: bankData.Branch,
                MICR: bankData.MICR,
                BankAccountTypeId: cryptoEngine.ParamEncrypt(bankData.BankAccountTypeId, true),
                AccountNumber: bankData.AccountNumber,
                BankProofFileName: bankData.BankProofFileName,

            };
        }
        res.status(200).send({ Status: (bankData != null), Message: "", Data: data });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetEmployeeDocument = async (req, res) => {
    const employeeId = req.params.EmployeeId;
    const Name = req.params.Name;
    const FileName = req.params.FileName;
    var errorMessage = "Error while getting employee document data"

    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(employeeId, true));
        readRequest.input("Name", Name);
        readRequest.input("FileName", FileName);
        const readResult = await readRequest.execute("GetEmployeeDocument");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.EmployeeDocumentId, true),
                EmployeeId: cryptoEngine.ParamEncrypt(dataItem.EmployeeId, true),
                Name: dataItem.Name,
                FileName: dataItem.FileName,
                FileContent: dataItem.FileContent,
                FileContentType: dataItem.FileContentType
            };
        }
        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};


exports.GetEmployeeCertificateDetailsById = async (req, res) => {
    const employeeId = req.params.EmployeeId;
    var errorMessage = "Error while getting employee certificate details data"

    try {
        var certificateData;
        // var certificateDocumentData = [];
        var certificationTypeData = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(employeeId, true));
        const readResult = await readRequest.execute("GetEmployeeCertificateDetailsById");
        if (readResult.recordset.length > 0) {
            certificateData = readResult.recordset[0];
        }



        const readCertificationTypeRequest = req.app.locals.db.request();
        readCertificationTypeRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(employeeId, true));
        const CertificationTypeResult = await readCertificationTypeRequest.execute("GetEmployeeCertificationTypeById");
        if (CertificationTypeResult.recordset.length > 0) {
            var certificationTypeDetailsData = CertificationTypeResult.recordset;
            for (let i = 0; i < certificationTypeDetailsData.length; i++) {
                var item = {
                    EmployeeCertificationTypeId: cryptoEngine.ParamEncrypt(certificationTypeDetailsData[i].EmployeeCertificationTypeId, true),
                    EmployeeId: cryptoEngine.ParamEncrypt(certificationTypeDetailsData[i].EmployeeId, true),
                    CertificationType: certificationTypeDetailsData[i].CertificationType,

                };
                certificationTypeData.push(item);
            }
        }

        if (certificateData != null) {
            var data = {
                Id: cryptoEngine.ParamEncrypt(certificateData.Id, true),
                //  EmployeeId:certificateData == true ? "414E2B5048745659672B513D" : employeeId,
                EmployeeId: cryptoEngine.ParamEncrypt(certificateData.EmployeeId, true),
                NismVaNumber: certificateData.NismVaNumber,
                NismVaValidDate: certificateData.NismVaValidDate,
                EUINHolderName: certificateData.EUINHolderName,
                EUIN: certificateData.EUIN,
                EUINValidDate: certificateData.EUINValidDate,
                CANumber: certificateData.CANumber,
                CAValidDate: certificateData.CAValidDate,
                CSNumber: certificateData.CSNumber,
                CSValidDate: certificateData.CSValidDate,
                DegreeName: certificateData.DegreeName,
                DegreeNumber: certificateData.DegreeNumber,
                DegreeValidDate: certificateData.DegreeValidDate,
                // CertificateDocumentData: certificateDocumentData,
                NismVaProofFileName: certificateData.NismVaProofFileName,
                EUINProofFileName: certificateData.EUINProofFileName,
                CAProofFileName: certificateData.CAProofFileName,
                CSProofFileName: certificateData.CSProofFileName,
                DegreeProofFileName: certificateData.DegreeProofFileName,

                CertificationTypeData: certificationTypeData,
            };


        }
        res.status(200).send({ Status: (certificateData != null), Message: "", Data: data });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};


exports.GetEmployeeUploadDetailsById = async (req, res) => {
    const EmployeeId = req.params.EmployeeId;
    var errorMessage = "Error while getting employee upload data";

    try {

        var employeeUploadData;

        const readEmployeeUploadDocumentsDetailsRequest = req.app.locals.db.request();
        readEmployeeUploadDocumentsDetailsRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
        const EmployeeUploadDocumentsDetailsResult = await readEmployeeUploadDocumentsDetailsRequest.execute("GetEmployeeUploadDetailsById");
        if (EmployeeUploadDocumentsDetailsResult.recordset.length > 0) {
            employeeUploadData = EmployeeUploadDocumentsDetailsResult.recordset[0];
        }


        if (employeeUploadData != null) {
            var data = {
                EmployeeId: cryptoEngine.ParamEncrypt(employeeUploadData.Id, true),
                // EmployeeId: (employeeUploadData == true) ? '414E2B5048745659672B513D' : EmployeeId,
                EmpolymentAgreementeFileName: employeeUploadData.EmpolymentAgreementeFileName,

            };
        }
        res.status(200).send({ Status: (employeeUploadData != null), Message: "", Data: data });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetTermsCondtionByEmployee = (req, res) => {


    req.app.locals.db.request()
        .execute("GetEmployeeTermsConditions", (err, result) => {
            if (err) {
                res.status(500).send(err);
            }
            else {
                var data = null;
                if (result.recordset.length > 0) {
                    var dataItem = result.recordset[0];
                    data = {
                        "Id": cryptoEngine.ParamEncrypt(dataItem.Id, true),
                        "WefDate": dataItem.WefDate,
                        "Code": dataItem.Code,
                        "TermsType": dataItem.TermsType,
                        "TermsContent": dataItem.TermsContent,

                    };
                }
                res.status(200).send({ Status: true, Message: "", Data: data });
            }
        });
};

exports.GetMenuOptions = async (req, res) => {
    const EmployeeId = req.params.EmployeeId;

    var errorMessage = "Error while getting menu options data"

    try {
        var menuData = [];
        let appUserTypes = [];
        let menuOptionList = [];
        let data;

        const readAppUserRequest = req.app.locals.db.request();
        readAppUserRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
        const readAppUserResult = await readAppUserRequest.execute("GetAppUserByEmployeeId");
        if (readAppUserResult.recordset.length > 0) {
            let appUserData = readAppUserResult.recordset[0];

            const readRequest = req.app.locals.db.request();
            readRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
            const readResult = await readRequest.execute("GetEmployeeDepartment");
            if (readResult.recordset.length > 0) {
                let employeeDepartments = readResult.recordset;

                for (let i = 0; i < employeeDepartments.length; i++) {
                    if (employeeDepartments[i].Code == 'SC') {
                        const readSdRequest = req.app.locals.db.request();
                        readSdRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
                        const readSdResult = await readSdRequest.execute("GetEmployeeSubDepartment");
                        if (readSdResult.recordset.length > 0) {
                            let employeeSubDepartments = readSdResult.recordset;

                            for (let j = 0; j < employeeSubDepartments.length; j++) {
                                if (employeeSubDepartments[j].Name == 'B2B' || employeeSubDepartments[j].Name == 'B2C' || employeeSubDepartments[j].Name == 'B2B&B2C') {
                                    appUserTypes.push('Employee' + employeeDepartments[i].Name + employeeSubDepartments[j].Name);
                                }
                            }
                        }
                    }
                    else {
                        appUserTypes.push('Employee' + employeeDepartments[i].Name)
                    }
                }
            }

            for (let i = 0; i < appUserTypes.length; i++) {
                let menuDataList = await appUserController.GetAppUserTypeMenuOptions(req, res, cryptoEngine.ParamEncrypt(appUserData.Id, true), appUserTypes[i]);

                let menuOptions = menuDataList.flatMap((option) => option.MenuGroups.flatMap((g) => g.MenuOptions.filter((item) => item.Id === item.Id)));

                for (let j = 0; j < menuOptions.length; j++) {
                    let existingItem = menuOptionList.find((item) => item.Id === menuOptions[j].Id);

                    if (existingItem == null) {
                        menuOptionList.push(menuOptions[j]);
                    }
                }
            }

            for (let i = 0; i < menuOptionList.length; i++) {
                let existingModule = menuData.find((m) => m.Module === menuOptionList[i].Module);
                if (existingModule == null) {
                    menuData.push({ Module: menuOptionList[i].Module, MenuGroups: [] });
                }

                for (let m = 0; m < menuData.length; m++) {
                    if (menuData[m].Module == menuOptionList[i].Module) {
                        let existingMenuGroup = menuData[m].MenuGroups.find((m) => m.MenuGroup === menuOptionList[i].MenuGroup);
                        if (existingMenuGroup == null) {
                            menuData[m].MenuGroups.push({ MenuGroup: menuOptionList[i].MenuGroup, MenuOptions: [] });
                        }
                    }
                }
            }

            for (let i = 0; i < menuData.length; i++) {
                for (let m = 0; m < menuData[i].MenuGroups.length; m++) {
                    let menuOptionItems = menuOptionList.filter((item) => item.Module === menuData[i].Module && item.MenuGroup === menuData[i].MenuGroups[m].MenuGroup);

                    for (let j = 0; j < menuOptionItems.length; j++) {
                        menuData[i].MenuGroups[m].MenuOptions.push(menuOptionItems[j]);
                    }
                }
            }

            data = {
                AppUserId: cryptoEngine.ParamEncrypt(appUserData.Id, true),
                MenuData: menuData,
            };
        }

        res.status(200).send({ Status: true, Message: "", Data: data });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetNotification = async (req, res) => {
    var errorMessage = "Error while getting employee notification data";
    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetNotifications");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                FromAppUserId: cryptoEngine.ParamEncrypt(dataItem.FromAppUserId, true),
                ToAppUserId: cryptoEngine.ParamEncrypt(dataItem.ToAppUserId, true),
                RecordDate: dataItem.RecordDate,
                Title: dataItem.Title,
                Description: dataItem.Description,
                Link: dataItem.Link,
                IsRead: dataItem.IsRead
            };
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetEmployeeProgress = async (req, res) => {
    const EmployeeId = req.params.Id;
    var errorMessage = "Error while getting employee progress data";
    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("Id", cryptoEngine.ParamDecrypt(EmployeeId, true));
        const readResult = await readRequest.execute("GetEmployeeProgress");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                IsActive: dataItem.IsActive,
                IsAdminVerified: dataItem.IsAdminVerified,
                IsSelfVerified: dataItem.IsSelfVerified,
                IsGeneralInfoCompleted: dataItem.IsGeneralInfoCompleted,
                IsEmployeeDetailsCompleted: dataItem.IsEmployeeDetailsCompleted,
                IsPhotoIdCompleted: dataItem.IsPhotoIdCompleted,
                IsAddressCompleted: dataItem.IsAddressCompleted,
                IsBankCompleted: dataItem.IsBankCompleted,
                IsCertificationCompleted: dataItem.IsCertificationCompleted,
                IsRightsCompleted: dataItem.IsRightsCompleted,
                IsDownloadCompleted: dataItem.IsDownloadCompleted
            };
        }
        res.status(200).send({ Status: (dataItem != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.SendNotificationSupervisor = async (req, res) => {
    var { EmployeeId } = req.body;

    var errorMessage = "Error while saving notification...";

    try {
        var employeeName = '';
        var dataItem;
        var notificationAppUsers = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
        const readResult = await readRequest.execute("GetEmployeeGeneralInfoById");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        if (dataItem != null) {
            const readRequest = req.app.locals.db.request();
            readRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
            const readResult = await readRequest.execute("GetEmployeeNotificationAppUser");
            if (readResult.recordset.length > 0) {
                notificationAppUsers = readResult.recordset;
            }
        }

        if (dataItem != null) {
            employeeName = dataItem.Name;

            var title = "Verification of new Employee " + employeeName + " is Pending.";
            var link = "employee-general-information/" + EmployeeId + "/" + cryptoEngine.ParamEncrypt('verify', true);
            for (let i = 0; i < notificationAppUsers.length; i++) {
                let NotificationId = await notificationController.CreateNotification(req, res, cryptoEngine.ParamEncrypt('0', true),
                    cryptoEngine.ParamEncrypt(dataItem.CreatedBy, true),
                    cryptoEngine.ParamEncrypt(notificationAppUsers[i].Id, true),
                    title,
                    '',
                    link,
                    'General'
                );

                var notificationData = {
                    SenderId: cryptoEngine.ParamEncrypt(dataItem.CreatedBy, true),
                    ReceiverId: cryptoEngine.ParamEncrypt(notificationAppUsers[i].Id, true),
                    Title: title,
                    Description: '',
                    Link: link,
                    RecordType: 'General'
                };

                notificationEngine.SendRealCommunicationMessage(JSON.stringify(notificationData));
            }

            res.status(200).send({ Status: true, Message: "Notification saved successfully.", Data: null });
        }
        else {
            res.status(200).send({ Status: false, Message: "Invalid employee.", Data: null });
        }
    }
    catch (err) {
        console.log(err);

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        res.status(500).send(errorMessage);
    }
};


exports.SendSelfNotificationSupervisor = async (req, res) => {
    var { EmployeeId } = req.body;
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);

    var errorMessage = "Error while saving notification...";

    try {
        var employeeName = '';
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
        const readResult = await readRequest.execute("GetEmployeeGeneralInfoById");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        if (dataItem != null) {
            const readRequest = req.app.locals.db.request();
            readRequest.input("CreatedBy", dataItem.CreatedBy);
            const readResult = await readRequest.execute("GetEmployeeSelfNotificationAppUser");
            if (readResult.recordset.length > 0) {
                notificationAppUsers = readResult.recordset;
            }
        }

        if (dataItem != null) {
            employeeName = dataItem.Name;
            var title = "Employee " + employeeName + " approved the self verification.";
            var link = "employee-general-information/" + EmployeeId + "/" + cryptoEngine.ParamEncrypt('edit', true);


            for (let i = 0; i < notificationAppUsers.length; i++) {
                let NotificationId = await notificationController.CreateNotification(req, res, cryptoEngine.ParamEncrypt('0', true),
                    cryptoEngine.ParamEncrypt(UserId, true),
                    cryptoEngine.ParamEncrypt(notificationAppUsers[i].Id, true),
                    title,
                    '',
                    link,
                    'General'
                );

                var notificationData = {
                    SenderId: cryptoEngine.ParamEncrypt(UserId, true),
                    ReceiverId: cryptoEngine.ParamEncrypt(notificationAppUsers[i].Id, true),
                    Title: title,
                    Description: '',
                    Link: link,
                    RecordType: 'General'
                };

                notificationEngine.SendRealCommunicationMessage(JSON.stringify(notificationData));
            }

            res.status(200).send({ Status: true, Message: "Notification saved successfully.", Data: null });
        }
        else {
            res.status(200).send({ Status: false, Message: "Invalid employee.", Data: null });
        }
    }
    catch (err) {
        console.log(err);

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        res.status(500).send(errorMessage);
    }
};


exports.SendSelfRejectedNotification = async (req, res) => {
    var { EmployeeId } = req.body;
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);

    var errorMessage = "Error while saving notification...";

    try {
        var employeeName = '';
        var dataItem;
        var rejectedData;

        const readRequest = req.app.locals.db.request();
        readRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
        const readResult = await readRequest.execute("GetEmployeeGeneralInfoById");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        const readRejectionRequest = req.app.locals.db.request();
        readRejectionRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
        const readRejectionResult = await readRejectionRequest.execute("GetEmployeeRejection");
        if (readRejectionResult.recordset.length > 0) {
            rejectedData = readRejectionResult.recordset[0];
        }



        if (dataItem != null) {
            const readRequest = req.app.locals.db.request();
            readRequest.input("CreatedBy", dataItem.CreatedBy);
            const readResult = await readRequest.execute("GetEmployeeSelfNotificationAppUser");
            if (readResult.recordset.length > 0) {
                notificationAppUsers = readResult.recordset;
            }
        }

        if (dataItem != null) {
            employeeName = dataItem.Name;
            var title = "Employee " + employeeName + " rejected the self verification"
            var link = "employee-general-information/" + EmployeeId + "/" + cryptoEngine.ParamEncrypt('edit', true);
            var des = "Employee " + employeeName + " rejected the self verification for the following reason - " + rejectedData.RejectionMessage;



            for (let i = 0; i < notificationAppUsers.length; i++) {
                let NotificationId = await notificationController.CreateNotification(req, res, cryptoEngine.ParamEncrypt('0', true),
                    cryptoEngine.ParamEncrypt(UserId, true),
                    cryptoEngine.ParamEncrypt(notificationAppUsers[i].Id, true),
                    title,
                    des,
                    link,
                    'General'
                );

                var notificationData = {
                    SenderId: cryptoEngine.ParamEncrypt(UserId, true),
                    ReceiverId: cryptoEngine.ParamEncrypt(notificationAppUsers[i].Id, true),
                    Title: title,
                    Description: des,
                    Link: link,
                    RecordType: 'General'
                };

                notificationEngine.SendRealCommunicationMessage(JSON.stringify(notificationData));

                // emailEngine.SendSelfRejection(notificationAppUsers[i].Email, employeeName, rejectedData.RejectionMessage);
            }

            res.status(200).send({ Status: true, Message: "Notification saved successfully.", Data: null });
        }
        else {
            res.status(200).send({ Status: false, Message: "Invalid employee.", Data: null });
        }
    }
    catch (err) {
        console.log(err);

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        res.status(500).send(errorMessage);
    }
};

exports.UpdateAdminVerification = async (req, res) => {
    var { EmployeeId, IsAdminVerified } = req.body;

    var errorMessage = "Error while updateing admin verification...";

    // try {
    //     var photoIdData;

    //     const readRequest = req.app.locals.db.request();
    //     readRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
    //     const readResult = await readRequest.execute("GetEmployeePhotoIdDetailsById");
    //     if (readResult.recordset.length > 0) {
    //         photoIdData = readResult.recordset[0];
    //         // var UserName = photoIdData.PANCardNumber
    //         // var EntityDate = photoIdData.DateOfBirth

    //     }




    //     let UserName = photoIdData.PANCardNumber;
    //     let EntityDate = photoIdData.DateOfBirth;

    //     let AppUserId = await appUserController.CreateAppUser(req, res, '414E2B5048745659672B513D', UserName, EntityDate, '414E2B5048745659672B513D', EmployeeId, '414E2B5048745659672B513D');

    // } catch (err) {
    //     console.log(err);
    //     res.status(500).send(errorMessage);
    //     return;
    // }

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const request = transaction.request();
        request.input("Id", cryptoEngine.ParamDecrypt(EmployeeId, true))
            .input("IsAdminVerified", IsAdminVerified);

        const result = await request.execute("UpdateEmployeeAdminVerification");
        await transaction.commit();


        res.status(200).send({ Status: true, Message: "", Data: EmployeeId });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};


exports.SendEmployeeResetPasswordLink = async (req, res) => {
    var { EmployeeId, Device, Browser, IpAddress } = req.body;
    var dataItem;
    var photoIdData;
    var errorMessage = "Error while sending employee reset password link...";

    const readRequest = req.app.locals.db.request();
    readRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
    const readResult = await readRequest.execute("GetEmployeeGeneralInfoById");
    if (readResult.recordset.length > 0) {
        dataItem = readResult.recordset[0];
    }

    const readPhotoRequest = req.app.locals.db.request();
    readPhotoRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
    const readPhotoResult = await readPhotoRequest.execute("GetEmployeePhotoIdDetailsById");
    if (readPhotoResult.recordset.length > 0) {
        photoIdData = readPhotoResult.recordset[0];
    }


    const transaction = req.app.locals.db.transaction();

    try {

        await transaction.begin();
        const userRequest = transaction.request();
        userRequest.output("Id", msSql.BigInt)
            .input("Email", dataItem.Email)
            .input("UserName", photoIdData.PANCardNumber)
            .input("Device", Device)
            .input("Browser", Browser)
            .input("IPAddress", IpAddress)
            .input("IsLinkExpired", false)
        const UserResult = await userRequest.execute("InsertPasswordResetRequest");
        Id = cryptoEngine.ParamEncrypt(UserResult.output.Id, true);


        const ResetLink = process.env.WEB_APP_LINK + '/reset-password/' + Id
        emailEngine.SendRestPasswordEmailLink(dataItem.Email, Device, Browser, IpAddress, ResetLink, dataItem.Name);

        await transaction.commit();
        res.status(200).send({ Status: true, Message: "", Data: { Id: EmployeeId } });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};


exports.SendEmployeeResendVerificationEmail = async (req, res) => {
    var { EmployeeId } = req.body;
    var errorMessage = "Error while sending employee resend verfication email...";
    var createdByData;
    try {

        const readRequest = req.app.locals.db.request();
        readRequest.input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
        const readResult = await readRequest.execute("GetEmployeeGeneralInfoById");

        if (readResult.recordset.length > 0) {
            createdByData = readResult.recordset[0];
        }

        var timeStamp = new Date();
        var link = process.env.WEB_APP_LINK + "/employee-self-verification/" + EmployeeId + "/" + cryptoEngine.ParamEncrypt('externalverify', true) + "/" + cryptoEngine.ParamEncrypt(timeStamp.toISOString(), true);

        //  console.log(link);


        emailEngine.SendEmployeeVerification(createdByData.Email, createdByData.Name, link);
        res.status(200).send({ Status: true, Message: "", Data: EmployeeId });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};


