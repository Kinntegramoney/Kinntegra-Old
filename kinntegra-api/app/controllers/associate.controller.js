const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");
const mime = require('mime-types');
const emailEngine = require("../models/emailengine.model");
// const activityLogController = require('../controllers/appuseractivitylog.controller');
const fs = require('fs');
const commonFunction = require("../models/commonfunction.model");
const appUserController = require('../controllers/appuser.controller');
const date = require('date-and-time');
const pdfEngine = require("../models/pdfengine.model");
const notificationEngine = require("../models/notificationengine.model");
const notificationController = require('../controllers/notification.controller');
// const PDFMerger = require('../../node_modules/pdf-merger-js/index.js');
// import { PDFMerger } from '../../node_modules/pdf-merger-js/index';
// const PDFMerger = import('../../node_modules/pdf-merger-js/index.js');
const PDFMerger = require('pdf-merger-js');
const excelEngine = require("../models/excelengine.model");
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
const fileSystem = require("fs");
const bseConfig = require('../configs/bse.config');

exports.GetAssociateList = async (req, res) => {
    var errorMessage = "Error while getting associate data";
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetAssociates");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    ProfessionId: cryptoEngine.ParamEncrypt(dataList[i].ProfessionId, true),
                    EntityName: dataList[i].EntityName,
                    AuthorisedPerson1: dataList[i].AuthorisedPerson1,
                    Email1: dataList[i].Email1,
                    Mobile1: dataList[i].Mobile1,
                    PAN1: dataList[i].PAN1,
                    AuthorisedPerson2: dataList[i].AuthorisedPerson2,
                    Email2: dataList[i].Email2,
                    Mobile2: dataList[i].Mobile2,
                    PAN2: dataList[i].PAN2,
                    AuthorisedPerson3: dataList[i].AuthorisedPerson3,
                    Email3: dataList[i].Email3,
                    Mobile3: dataList[i].Mobile3,
                    PAN3: dataList[i].PAN3,
                    Name: dataList[i].Name,
                    PANCardNumber: dataList[i].PANCardNumber,
                    AadharCardNumber: dataList[i].AadharCardNumber,
                    DateOfBirth: dataList[i].DateOfBirth,
                    DateOfIncorporation: dataList[i].DateOfIncorporation,
                    GSTIN: dataList[i].GSTIN,
                    GSTINValidDate: dataList[i].GSTINValidDate,
                    ShopCertificateNumber: dataList[i].ShopCertificateNumber,
                    ShopCertificateValidDate: dataList[i].ShopCertificateValidDate,
                    TAN: dataList[i].TAN,
                    PrimaryColor: dataList[i].PrimaryColor,
                    SecondaryColor: dataList[i].SecondaryColor,
                    ARNHolderName: dataList[i].ARNHolderName,
                    ARN: dataList[i].ARN,
                    ARNValidDate: dataList[i].ARNValidDate,
                    EUINHolderName: dataList[i].EUINHolderName,
                    EUIN: dataList[i].EUIN,
                    EUINValidDate: dataList[i].EUINValidDate,
                    RIAName: dataList[i].RIAName,
                    RIANumber: dataList[i].RIANumber,
                    RIAValidDate: dataList[i].RIAValidDate,
                    IsActive: dataList[i].IsActive,
                    AssociateCode: dataList[i].AssociateCode,
                    BSEPassword: dataList[i].BSEPassword,
                    IsBSEFileUploaded: dataList[i].IsBSEFileUploaded,
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

exports.CheckReverificationProcess = async (req, res, Id) => {
    var errorMessage = "Error while getting associate data";
    var dataItem;

    const readRequest = req.app.locals.db.request();
    readRequest.input("Id", cryptoEngine.ParamDecrypt(Id, true));
    const readResult = await readRequest.execute("GetAssociateProgress");
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
                const selfresult = await selfrequest.execute("UpdateAssociateSelfVerification");

                const adminrequest = transaction.request();
                adminrequest.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                    .input("IsAdminVerified", false);
                const result = await adminrequest.execute("UpdateAssociateAdminVerification");

                const requestAppUser = transaction.request();
                requestAppUser.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("IsActive", false);
                const resultAppUser = await requestAppUser.execute("UpdateAssociateAppUserActive");

                const requestAssociate = transaction.request();
                requestAssociate.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                    .input("IsActive", false);
                const associateResult = await requestAssociate.execute("UpdateAssociateActive");

                const requestRevision = transaction.request();
                requestRevision.input("Id", cryptoEngine.ParamDecrypt(Id, true));
                const resultRevision = await requestRevision.execute("UpdateAssociateRevision");

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

exports.SaveAssociate = async (req, res) => {
    var { Id, IntroducerAssociateId, ProfessionId, EmployeeId, AssociateBusinessId, mode } = req.body;
    var errorMessage = "Error while saving associate data...";
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);

    if (mode == 'edit') {
        await this.CheckReverificationProcess(req, res, Id);
    }

    var Revision = 0;

    const readRequest = req.app.locals.db.request();
    readRequest.input("Id", cryptoEngine.ParamDecrypt(Id, true))
    const readResult = await readRequest.execute("GetAssociateRevision");
    if (readResult.recordset.length > 0) {
        let dataItem = readResult.recordset[0];
        Revision = dataItem.Revision;
    }

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(Id, true) == 0) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("ProfessionId", cryptoEngine.ParamDecrypt(ProfessionId, true))
                .input("CreatedBy", UserId);
            const result = await request.execute("InsertAssociate");
            Id = cryptoEngine.ParamEncrypt(result.output.Id, true);
        }
        else {
            const request = transaction.request();
            request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                .input("ProfessionId", cryptoEngine.ParamDecrypt(ProfessionId, true));
            const result = await request.execute("UpdateAssociate");
        }

        if (IntroducerAssociateId == null) {
            IntroducerAssociateId = Id;
        }

        const introRequest = transaction.request();
        introRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
            .input("IntroducerAssociateId", cryptoEngine.ParamDecrypt(IntroducerAssociateId, true));
        const IntroResult = await introRequest.execute("InsertAssociateIntroducer");

        const flagRequest = transaction.request();
        flagRequest.input("Id", cryptoEngine.ParamDecrypt(Id, true))
            .input("IsGeneralInfoCompleted", true);
        const FlagResult = await flagRequest.execute("UpdateAssociateGeneralInfoDetailsFlag");

        // var AppUserId = "4B31474B714330623142773D";
        var LogMessage = "Associate Creation Pending";
        const logRequest = transaction.request();
        logRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
            .input("AppUserId", UserId)
            .input("LogMessage", LogMessage)
            .input("IsPrimaryStatus", true)
            .input("Revision", Revision)
            .input("Indicator", 1);
        const LogResult = await logRequest.execute("InsertAssociateLog");

        var SecondaryLogMessage = "Associate General Information Created";
        const logSecRequest = transaction.request();
        logSecRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
            .input("AppUserId", UserId)
            .input("LogMessage", SecondaryLogMessage)
            .input("IsPrimaryStatus", false)
            .input("Revision", 0)
            .input("Indicator", 0);
        const LogSecResult = await logSecRequest.execute("InsertAssociateLog");

        if (mode == 'edit') {
            var SecondaryLogUpMessage = "Associate General Information Updated";
            const logSecUpRequest = transaction.request();
            logSecUpRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                .input("AppUserId", UserId)
                .input("LogMessage", SecondaryLogUpMessage)
                .input("IsPrimaryStatus", false)
                .input("Revision", 0)
                .input("Indicator", 0);
            const LogSecUpResult = await logSecUpRequest.execute("InsertAssociateLog");
        }

        if (cryptoEngine.ParamDecrypt(EmployeeId, true) != 0) {
            const employeeRequest = transaction.request();
            employeeRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                .input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
            const EmployeeResult = await employeeRequest.execute("InsertAssociateIntroducerEmployee");
        }

        if (cryptoEngine.ParamDecrypt(AssociateBusinessId, true) != -1) {
            const bussinessTagRequest = transaction.request();
            bussinessTagRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                .input("AssociateBusinessId", cryptoEngine.ParamDecrypt(AssociateBusinessId, true));
            const BussinessTagResult = await bussinessTagRequest.execute("InsertAssociateBusinessTag");
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
        res.status(200).send({ Status: true, Message: "Associate Saved Successfully.", Data: { Id: Id } });
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

exports.DeleteAssociate = async (req, res) => {
    var { Id } = req.body;


    var errorMessage = "Error while deleting associate data...";

    // let TransactionMode = 'Delete';

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        const request = transaction.request();

        request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
        const result = await request.execute("DeleteAssociate");
        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'Associate',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);

        res.status(200).send({ Status: true, Message: "Associate Deleted Successfully.", Data: {} });
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("FK_")) { errorMessage = "Reference exists. Cannot delete record."; }

        console.log(errorMessage);

        res.status(500).send(errorMessage);
    }
};

exports.SaveAssociateEntityType = async (req, res) => {
    var { Id, EntityName, AuthorisedPerson1, Email1, Mobile1, PAN1, AuthorisedPerson2, Email2, Mobile2, PAN2, AuthorisedPerson3, Email3, Mobile3, PAN3, EntityTypeId, mode } = req.body;
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    var errorMessage = "Error while saving associate entity type data...";

    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    if (mode == 'edit') {
        await this.CheckReverificationProcess(req, res, Id);
    }

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(Id, true) != 0) {
            const request = transaction.request();
            request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                .input("EntityName", EntityName)
                .input("AuthorisedPerson1", AuthorisedPerson1)
                .input("Email1", Email1)
                .input("Mobile1", Mobile1)
                .input("PAN1", PAN1)
                .input("AuthorisedPerson2", AuthorisedPerson2)
                .input("Email2", Email2)
                .input("Mobile2", Mobile2)
                .input("PAN2", PAN2)
                .input("AuthorisedPerson3", AuthorisedPerson3)
                .input("Email3", Email3)
                .input("Mobile3", Mobile3)
                .input("PAN3", PAN3)
            const result = await request.execute("UpdateAssociateEntityType");

            const entityRequest = transaction.request();
            entityRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                .input("EntityTypeId", cryptoEngine.ParamDecrypt(EntityTypeId, true));
            const EntityResult = await entityRequest.execute("InsertAssociateEntityType");
        }

        const flagRequest = transaction.request();
        flagRequest.input("Id", cryptoEngine.ParamDecrypt(Id, true))
            .input("IsEntityDetailsCompleted", true);
        const FlagResult = await flagRequest.execute("UpdateAssociateEntityDetailsFlag");

        var SecondaryLogMessage = "Associate Entity Details Created";
        const logSecRequest = transaction.request();
        logSecRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
            .input("AppUserId", UserId)
            .input("LogMessage", SecondaryLogMessage)
            .input("IsPrimaryStatus", false)
            .input("Revision", 0)
            .input("Indicator", 0);
        const LogSecResult = await logSecRequest.execute("InsertAssociateLog");

        if (mode == 'edit') {
            var SecondaryLogUpMessage = "Associate Entity Details Updated";
            const logSecUpRequest = transaction.request();
            logSecUpRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                .input("AppUserId", UserId)
                .input("LogMessage", SecondaryLogUpMessage)
                .input("IsPrimaryStatus", false)
                .input("Revision", 0)
                .input("Indicator", 0);
            const LogSecUpResult = await logSecUpRequest.execute("InsertAssociateLog");
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
        res.status(200).send({ Status: true, Message: "Associate Entity Type Saved Successfully.", Data: { Id: Id } });
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

exports.GetAssociateEntityTypeByAssociateId = async (req, res) => {
    const AssociateId = req.params.Id;
    var errorMessage = "Error while getting associate entity type data";
    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        const readResult = await readRequest.execute("GetAssociateEntityTypeByAssociateId");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                AssociateId: cryptoEngine.ParamEncrypt(dataItem.AssociateId, true),
                EntityTypeId: cryptoEngine.ParamEncrypt(dataItem.EntityTypeId, true),
                Created: dataItem.Created,
                Modified: dataItem.Modified
            };
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.SaveAssociatePhotoIdDetail = async (req, res) => {
    var { Id, Name, PANCardNumber, AadharCardNumber, DateOfBirth, DateOfIncorporation, mode } = req.body;
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);

    const readCheckRequest = req.app.locals.db.request();
    readCheckRequest.input("Id", cryptoEngine.ParamDecrypt(Id, true))
        .input("PANCardNumber", PANCardNumber);
    const readCheckResult = await readCheckRequest.execute("CheckDuplicateAssociateRecord");
    if (readCheckResult.recordset.length > 0) {
        res.status(200).send({ Status: false, Message: 'Associate already exists with PAN card number ' + PANCardNumber });
        return;
    }

    var errorMessage = "Error while saving associate photo id details data...";
    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';
    if (DateOfBirth == undefined) {
        DateOfBirth = null;
    }
    if (DateOfIncorporation == undefined) {
        DateOfIncorporation = null;
    }

    if (mode == 'edit') {
        await this.CheckReverificationProcess(req, res, Id);
    }

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(Id, true) != 0) {
            const request = transaction.request();
            request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                .input("Name", Name)
                .input("PANCardNumber", PANCardNumber)
                .input("AadharCardNumber", AadharCardNumber)
                .input("DateOfBirth", DateOfBirth)
                .input("DateOfIncorporation", DateOfIncorporation)
                .input("IsPhotoDetailsCompleted", true)
            const result = await request.execute("UpdateAssociatePhotoIdDetail");
        }

        if (req.files) {
            if (req.files.SelfPhotoFile) {
                var fileTypeData = mime.lookup(req.files.SelfPhotoFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "Self Photo")
                    .input("FileName", req.files.SelfPhotoFile.name)
                    .input("FileContent", req.files.SelfPhotoFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }

            if (req.files.PANCardFile) {
                var fileTypeData = mime.lookup(req.files.PANCardFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "PAN Card")
                    .input("FileName", req.files.PANCardFile.name)
                    .input("FileContent", req.files.PANCardFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }

            if (req.files.AadharCardFile) {
                var fileTypeData = mime.lookup(req.files.AadharCardFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "Aadhar Card")
                    .input("FileName", req.files.AadharCardFile.name)
                    .input("FileContent", req.files.AadharCardFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }
        }

        var SecondaryLogMessage = "Associate Photo Id Details Created";
        const logSecRequest = transaction.request();
        logSecRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
            .input("AppUserId", UserId)
            .input("LogMessage", SecondaryLogMessage)
            .input("IsPrimaryStatus", false)
            .input("Revision", 0)
            .input("Indicator", 0);
        const LogSecResult = await logSecRequest.execute("InsertAssociateLog");

        if (mode == 'edit') {
            var SecondaryLogUpMessage = "Associate Photo Id Details Updated";
            const logSecUpRequest = transaction.request();
            logSecUpRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                .input("AppUserId", UserId)
                .input("LogMessage", SecondaryLogUpMessage)
                .input("IsPrimaryStatus", false)
                .input("Revision", 0)
                .input("Indicator", 0);
            const LogSecUpResult = await logSecUpRequest.execute("InsertAssociateLog");
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
        res.status(200).send({ Status: true, Message: "Associate Photo Id Details Saved Successfully.", Data: { Id: Id } });
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_Associate_PANCardNumber")) {
            errorMessage = "PAN Card already exists.";
        }
        else if (err.message.includes("UK_Associate_AadharCardNumber")) {
            errorMessage = "Aadhar Card already exists.";
        }
        else if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        res.status(500).send(errorMessage);
    }
};

exports.SaveAssociateCommunication = async (req, res) => {
    var { Id, AssociateId, Address1, Address2, Address3, City, StateId, CountryId, PinCode, MobileNumber, TelephoneNumber, Email, mode } = req.body;
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    var errorMessage = "Error while saving associate communication data...";
    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    if (mode == 'edit') {
        await this.CheckReverificationProcess(req, res, AssociateId);
    }

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(Id, true) == 0) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("Address1", Address1)
                .input("Address2", Address2)
                .input("Address3", Address3)
                .input("City", City)
                .input("StateId", cryptoEngine.ParamDecrypt(StateId, true))
                .input("CountryId", cryptoEngine.ParamDecrypt(CountryId, true))
                .input("PinCode", PinCode)
                .input("MobileNumber", MobileNumber)
                .input("TelephoneNumber", TelephoneNumber)
                .input("Email", Email)
            const result = await request.execute("InsertAssociateCommunication");
            Id = cryptoEngine.ParamEncrypt(result.output.Id, true);
        }
        else {
            const request = transaction.request();
            request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                .input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("Address1", Address1)
                .input("Address2", Address2)
                .input("Address3", Address3)
                .input("City", City)
                .input("StateId", cryptoEngine.ParamDecrypt(StateId, true))
                .input("CountryId", cryptoEngine.ParamDecrypt(CountryId, true))
                .input("PinCode", PinCode)
                .input("MobileNumber", MobileNumber)
                .input("TelephoneNumber", TelephoneNumber)
                .input("Email", Email)
            const result = await request.execute("UpdateAssociateCommunication");
        }

        const flagRequest = transaction.request();
        flagRequest.input("Id", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("IsCommunicationCompleted", true);
        const FlagResult = await flagRequest.execute("UpdateAssociateCommunicationFlag");

        if (req.files) {
            if (req.files.AddressProofFile) {
                var fileTypeData = mime.lookup(req.files.AddressProofFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                    .input("Name", "Address Proof")
                    .input("FileName", req.files.AddressProofFile.name)
                    .input("FileContent", req.files.AddressProofFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }
        }

        var SecondaryLogMessage = "Associate Communication Details Created";
        const logSecRequest = transaction.request();
        logSecRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", SecondaryLogMessage)
            .input("IsPrimaryStatus", false)
            .input("Revision", 0)
            .input("Indicator", 0);
        const LogSecResult = await logSecRequest.execute("InsertAssociateLog");

        if (mode == 'edit') {
            var SecondaryLogUpMessage = "Associate Communication Details Updated";
            const logSecUpRequest = transaction.request();
            logSecUpRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("AppUserId", UserId)
                .input("LogMessage", SecondaryLogUpMessage)
                .input("IsPrimaryStatus", false)
                .input("Revision", 0)
                .input("Indicator", 0);
            const LogSecUpResult = await logSecUpRequest.execute("InsertAssociateLog");
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
        res.status(200).send({ Status: true, Message: "Associate Communication Saved Successfully.", Data: { Id: Id } });
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

exports.SaveAssociateBank = async (req, res) => {
    var { Id, AssociateId, IFSC, BankName, Branch, MICR, BankAccountTypeId, AccountNumber, RIAId, RIAAssociateId, RIAIFSC, RIABankName, RIABranch, RIAMICR, RIABankAccountTypeId, RIAAccountNumber, mode } = req.body;
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    var errorMessage = "Error while saving associate bank data...";

    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    if (mode == 'edit') {
        await this.CheckReverificationProcess(req, res, AssociateId);
    }

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(Id, true) == 0) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("IFSC", IFSC.toUpperCase())
                .input("BankName", BankName)
                .input("Branch", Branch)
                .input("MICR", MICR)
                .input("BankAccountTypeId", cryptoEngine.ParamDecrypt(BankAccountTypeId, true))
                .input("AccountNumber", AccountNumber)
            const result = await request.execute("InsertAssociateBank");
            Id = cryptoEngine.ParamEncrypt(result.output.Id, true);
        }
        else {
            const request = transaction.request();
            request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                .input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("IFSC", IFSC.toUpperCase())
                .input("BankName", BankName)
                .input("Branch", Branch)
                .input("MICR", MICR)
                .input("BankAccountTypeId", cryptoEngine.ParamDecrypt(BankAccountTypeId, true))
                .input("AccountNumber", AccountNumber)
            const result = await request.execute("UpdateAssociateBank");
        }

        const flagRequest = transaction.request();
        flagRequest.input("Id", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("IsBankCompleted", true);
        const FlagResult = await flagRequest.execute("UpdateAssociateBankFlag");

        if (RIAIFSC != '') {
            if (cryptoEngine.ParamDecrypt(RIAId, true) == 0) {
                const request = transaction.request();
                request.output("Id", msSql.BigInt)
                    .input("AssociateId", cryptoEngine.ParamDecrypt(RIAAssociateId, true))
                    .input("IFSC", RIAIFSC.toUpperCase())
                    .input("BankName", RIABankName)
                    .input("Branch", RIABranch)
                    .input("MICR", RIAMICR)
                    .input("BankAccountTypeId", cryptoEngine.ParamDecrypt(RIABankAccountTypeId, true))
                    .input("AccountNumber", RIAAccountNumber)
                const result = await request.execute("InsertAssociateBankRia");
                RIAId = cryptoEngine.ParamEncrypt(result.output.Id, true);
            }
            else {
                const request = transaction.request();
                request.input("Id", cryptoEngine.ParamDecrypt(RIAId, true))
                    .input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                    .input("IFSC", RIAIFSC.toUpperCase())
                    .input("BankName", RIABankName)
                    .input("Branch", RIABranch)
                    .input("MICR", RIAMICR)
                    .input("BankAccountTypeId", cryptoEngine.ParamDecrypt(RIABankAccountTypeId, true))
                    .input("AccountNumber", RIAAccountNumber)
                const result = await request.execute("UpdateAssociateBankRia");
            }
        }

        if (req.files) {
            if (req.files.BankProofFile) {
                var fileTypeData = mime.lookup(req.files.BankProofFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                    .input("Name", "Bank Proof")
                    .input("FileName", req.files.BankProofFile.name)
                    .input("FileContent", req.files.BankProofFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }
            if (req.files.BankProofRIAFile) {
                var fileTypeData = mime.lookup(req.files.BankProofRIAFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                    .input("Name", "Bank Proof RIA")
                    .input("FileName", req.files.BankProofRIAFile.name)
                    .input("FileContent", req.files.BankProofRIAFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }
        }

        var SecondaryLogMessage = "Associate Bank Details Created";
        const logSecRequest = transaction.request();
        logSecRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", SecondaryLogMessage)
            .input("IsPrimaryStatus", false)
            .input("Revision", 0)
            .input("Indicator", 0);
        const LogSecResult = await logSecRequest.execute("InsertAssociateLog");

        if (mode == 'edit') {
            var SecondaryLogUpMessage = "Associate Bank Details Updated";
            const logSecUpRequest = transaction.request();
            logSecUpRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("AppUserId", UserId)
                .input("LogMessage", SecondaryLogUpMessage)
                .input("IsPrimaryStatus", false)
                .input("Revision", 0)
                .input("Indicator", 0);
            const LogSecUpResult = await logSecUpRequest.execute("InsertAssociateLog");
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
        res.status(200).send({ Status: true, Message: "Associate Bank Saved Successfully.", Data: { Id: Id } });
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

exports.GetAssociatesEmailByAssociateId = async (req, res) => {
    const AssociateId = req.params.Id;
    var errorMessage = "Error while getting associate Email data";
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        const readResult = await readRequest.execute("GetAssociatesEmailByAssociateId");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    Email: dataList[i].Email,
                    Name: dataList[i].Name
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

exports.SaveAssociateOtherDetail = async (req, res) => {
    var { Id, GSTIN, GSTINValidDate, ShopCertificateNumber, ShopCertificateValidDate, TAN, PrimaryColor, SecondaryColor, mode } = req.body;
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    var errorMessage = "Error while saving associate other details data...";
    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';
    if (GSTINValidDate == undefined) {
        GSTINValidDate = null;
    }
    if (ShopCertificateValidDate == undefined) {
        ShopCertificateValidDate = null;
    }

    if (mode == 'edit') {
        await this.CheckReverificationProcess(req, res, Id);
    }

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(Id, true) != 0) {
            const request = transaction.request();
            request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                .input("GSTIN", GSTIN)
                .input("GSTINValidDate", GSTINValidDate)
                .input("ShopCertificateNumber", ShopCertificateNumber)
                .input("ShopCertificateValidDate", ShopCertificateValidDate)
                .input("TAN", TAN)
                .input("PrimaryColor", PrimaryColor)
                .input("SecondaryColor", SecondaryColor)
                .input("IsOtherCompleted", true);
            const result = await request.execute("UpdateAssociateOtherDetails");
        }

        if (req.files) {
            if (req.files.GSTINCertificateFile) {
                var fileTypeData = mime.lookup(req.files.GSTINCertificateFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "GSTIN Certificate")
                    .input("FileName", req.files.GSTINCertificateFile.name)
                    .input("FileContent", req.files.GSTINCertificateFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }

            if (req.files.ShopEstablishmentCertificateFile) {
                var fileTypeData = mime.lookup(req.files.ShopEstablishmentCertificateFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "Shop Establishment Certificate")
                    .input("FileName", req.files.ShopEstablishmentCertificateFile.name)
                    .input("FileContent", req.files.ShopEstablishmentCertificateFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }

            if (req.files.PartnershipDeedFile) {
                var fileTypeData = mime.lookup(req.files.PartnershipDeedFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "Partnership Deed")
                    .input("FileName", req.files.PartnershipDeedFile.name)
                    .input("FileContent", req.files.PartnershipDeedFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }

            if (req.files.AuthorizedSignatoryListFile) {
                var fileTypeData = mime.lookup(req.files.AuthorizedSignatoryListFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "Authorized Signatory List")
                    .input("FileName", req.files.AuthorizedSignatoryListFile.name)
                    .input("FileContent", req.files.AuthorizedSignatoryListFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }

            if (req.files.CeriticateofIncorporationFile) {
                var fileTypeData = mime.lookup(req.files.CeriticateofIncorporationFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "Ceriticate of Incorporation")
                    .input("FileName", req.files.CeriticateofIncorporationFile.name)
                    .input("FileContent", req.files.CeriticateofIncorporationFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }

            if (req.files.MemorandumofAssociationFile) {
                var fileTypeData = mime.lookup(req.files.MemorandumofAssociationFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "Memorandum of Association")
                    .input("FileName", req.files.MemorandumofAssociationFile.name)
                    .input("FileContent", req.files.MemorandumofAssociationFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }

            if (req.files.ArticleofAssociationFile) {
                var fileTypeData = mime.lookup(req.files.ArticleofAssociationFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "Article of Association")
                    .input("FileName", req.files.ArticleofAssociationFile.name)
                    .input("FileContent", req.files.ArticleofAssociationFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }

            if (req.files.BoardResolutionFile) {
                var fileTypeData = mime.lookup(req.files.BoardResolutionFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "Board Resolution")
                    .input("FileName", req.files.BoardResolutionFile.name)
                    .input("FileContent", req.files.BoardResolutionFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }

            if (req.files.TANCertificateFile) {
                var fileTypeData = mime.lookup(req.files.TANCertificateFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "TAN Certificate")
                    .input("FileName", req.files.TANCertificateFile.name)
                    .input("FileContent", req.files.TANCertificateFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }

            if (req.files.LogoFile) {
                var fileTypeData = mime.lookup(req.files.LogoFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "Logo")
                    .input("FileName", req.files.LogoFile.name)
                    .input("FileContent", req.files.LogoFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }
        }

        var SecondaryLogMessage = "Associate Other Details Created";
        const logSecRequest = transaction.request();
        logSecRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
            .input("AppUserId", UserId)
            .input("LogMessage", SecondaryLogMessage)
            .input("IsPrimaryStatus", false)
            .input("Revision", 0)
            .input("Indicator", 0);
        const LogSecResult = await logSecRequest.execute("InsertAssociateLog");

        if (mode == 'edit') {
            var SecondaryLogUpMessage = "Associate Other Details Updated";
            const logSecUpRequest = transaction.request();
            logSecUpRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                .input("AppUserId", UserId)
                .input("LogMessage", SecondaryLogUpMessage)
                .input("IsPrimaryStatus", false)
                .input("Revision", 0)
                .input("Indicator", 0);
            const LogSecUpResult = await logSecUpRequest.execute("InsertAssociateLog");
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
        res.status(200).send({ Status: true, Message: "Associate Other Details Saved Successfully.", Data: { Id: Id } });
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

exports.SaveAssociateLicenseDetail = async (req, res) => {
    var { Id, ARNHolderName, ARN, ARNValidDate, EUINHolderName, EUIN, EUINValidDate, RIAName, RIANumber, RIAValidDate, mode } = req.body;
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    var errorMessage = "Error while saving associate license details data...";
    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';
    if (ARNValidDate == undefined) {
        ARNValidDate = null;
    }
    if (EUINValidDate == undefined) {
        EUINValidDate = null;
    }
    if (RIAValidDate == undefined) {
        RIAValidDate = null;
    }

    if (mode == 'edit') {
        await this.CheckReverificationProcess(req, res, Id);
    }

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(Id, true) != 0) {
            const request = transaction.request();
            request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                .input("ARNHolderName", ARNHolderName)
                .input("ARN", ARN)
                .input("ARNValidDate", ARNValidDate)
                .input("EUINHolderName", EUINHolderName)
                .input("EUIN", EUIN)
                .input("EUINValidDate", EUINValidDate)
                .input("RIAName", RIAName)
                .input("RIANumber", RIANumber)
                .input("RIAValidDate", RIAValidDate)
                .input("IsLicenseCompleted", true);
            const result = await request.execute("UpdateAssociateLicenseDetails");
        }

        if (req.files) {
            if (req.files.ARNProofFile) {
                var fileTypeData = mime.lookup(req.files.ARNProofFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "ARN Proof")
                    .input("FileName", req.files.ARNProofFile.name)
                    .input("FileContent", req.files.ARNProofFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }

            if (req.files.EUINProofFile) {
                var fileTypeData = mime.lookup(req.files.EUINProofFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "EUIN Proof")
                    .input("FileName", req.files.EUINProofFile.name)
                    .input("FileContent", req.files.EUINProofFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }

            if (req.files.RIAProofFile) {
                var fileTypeData = mime.lookup(req.files.RIAProofFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "RIA Proof")
                    .input("FileName", req.files.RIAProofFile.name)
                    .input("FileContent", req.files.RIAProofFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }
        }

        var SecondaryLogMessage = "Associate License Details Created";
        const logSecRequest = transaction.request();
        logSecRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
            .input("AppUserId", UserId)
            .input("LogMessage", SecondaryLogMessage)
            .input("IsPrimaryStatus", false)
            .input("Revision", 0)
            .input("Indicator", 0);
        const LogSecResult = await logSecRequest.execute("InsertAssociateLog");

        if (mode == 'edit') {
            var SecondaryLogUpMessage = "Associate License Details Updated";
            const logSecUpRequest = transaction.request();
            logSecUpRequest.input("AssociateId", cryptoEngine.ParamDecrypt(Id, true))
                .input("AppUserId", UserId)
                .input("LogMessage", SecondaryLogUpMessage)
                .input("IsPrimaryStatus", false)
                .input("Revision", 0)
                .input("Indicator", 0);
            const LogSecUpResult = await logSecUpRequest.execute("InsertAssociateLog");
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
        res.status(200).send({ Status: true, Message: "Associate License Details Saved Successfully.", Data: { Id: Id } });
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

exports.SaveAssociateCertificate = async (req, res) => {
    var { Id, AssociateId, NismVaNumber, NismVaValidDate, CertificationTypes, NismXaNumber, NismXaValidDate, NismXbNumber, NismXbValidDate, CfpNumber, CfpValidDate, CwmNumber, CwmValidDate, CaNumber, CaValidDate, CsNumber, CsValidDate, CourseName, CourseNumber, CourseValidDate, mode } = req.body;
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    var errorMessage = "Error while saving associate certificate data...";
    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';
    if (NismVaValidDate == undefined) {
        NismVaValidDate = null;
    }
    if (NismXaValidDate == undefined) {
        NismXaValidDate = null;
    }
    if (NismXbValidDate == undefined) {
        NismXbValidDate = null;
    }
    if (CfpValidDate == undefined) {
        CfpValidDate = null;
    }
    if (CwmValidDate == undefined) {
        CwmValidDate = null;
    }
    if (CaValidDate == undefined) {
        CaValidDate = null;
    }
    if (CsValidDate == undefined) {
        CsValidDate = null;
    }
    if (CourseValidDate == undefined) {
        CourseValidDate = null;
    }

    let CertificationTypesData = JSON.parse(CertificationTypes);

    if (mode == 'edit') {
        await this.CheckReverificationProcess(req, res, AssociateId);
    }

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(Id, true) == 0) {
            const request = transaction.request();
            request.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("NismVaNumber", NismVaNumber)
                .input("NismVaValidDate", NismVaValidDate)
                .input("NismXaNumber", NismXaNumber)
                .input("NismXaValidDate", NismXaValidDate)
                .input("NismXbNumber", NismXbNumber)
                .input("NismXbValidDate", NismXbValidDate)
                .input("CfpNumber", CfpNumber)
                .input("CfpValidDate", CfpValidDate)
                .input("CwmNumber", CwmNumber)
                .input("CwmValidDate", CwmValidDate)
                .input("CaNumber", CaNumber)
                .input("CaValidDate", CaValidDate)
                .input("CsNumber", CsNumber)
                .input("CsValidDate", CsValidDate)
                .input("CourseName", CourseName)
                .input("CourseNumber", CourseNumber)
                .input("CourseValidDate", CourseValidDate)
            const result = await request.execute("InsertAssociateCertificate");
            // Id = cryptoEngine.ParamEncrypt(result.output.Id, true);
        }
        else {
            const request = transaction.request();
            request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                .input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("NismVaNumber", NismVaNumber)
                .input("NismVaValidDate", NismVaValidDate)
                .input("NismXaNumber", NismXaNumber)
                .input("NismXaValidDate", NismXaValidDate)
                .input("NismXbNumber", NismXbNumber)
                .input("NismXbValidDate", NismXbValidDate)
                .input("CfpNumber", CfpNumber)
                .input("CfpValidDate", CfpValidDate)
                .input("CwmNumber", CwmNumber)
                .input("CwmValidDate", CwmValidDate)
                .input("CaNumber", CaNumber)
                .input("CaValidDate", CaValidDate)
                .input("CsNumber", CsNumber)
                .input("CsValidDate", CsValidDate)
                .input("CourseName", CourseName)
                .input("CourseNumber", CourseNumber)
                .input("CourseValidDate", CourseValidDate)
            const result = await request.execute("UpdateAssociateCertificate");
        }

        const flagRequest = transaction.request();
        flagRequest.input("Id", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("IsCertificateCompleted", true);
        const FlagResult = await flagRequest.execute("UpdateAssociateCertificateFlag");

        const associateCertificationTypeDeleteRequest = transaction.request();
        associateCertificationTypeDeleteRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        const AssociateCertificationTypeDeleteResult = await associateCertificationTypeDeleteRequest.execute("DeleteAssociateCertificationType");

        for (let i = 0; i < CertificationTypesData.length; i++) {
            const associateCertificationTypeRequest = transaction.request();
            associateCertificationTypeRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("CertificationType", CertificationTypesData[i]);
            const AssociateCertificationTypeResult = await associateCertificationTypeRequest.execute("InsertAssociateCertificationType");
        }

        if (req.files) {
            if (req.files.NISMVACertificateFile) {
                var fileTypeData = mime.lookup(req.files.NISMVACertificateFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                    .input("Name", "NISM VA Certificate")
                    .input("FileName", req.files.NISMVACertificateFile.name)
                    .input("FileContent", req.files.NISMVACertificateFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }

            if (req.files.NISMXACertificateFile) {
                var fileTypeData = mime.lookup(req.files.NISMXACertificateFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                    .input("Name", "NISM XA Certificate")
                    .input("FileName", req.files.NISMXACertificateFile.name)
                    .input("FileContent", req.files.NISMXACertificateFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }

            if (req.files.NISMXBCertificateFile) {
                var fileTypeData = mime.lookup(req.files.NISMXBCertificateFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                    .input("Name", "NISM XB Certificate")
                    .input("FileName", req.files.NISMXBCertificateFile.name)
                    .input("FileContent", req.files.NISMXBCertificateFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }

            if (req.files.CFPCertificateFile) {
                var fileTypeData = mime.lookup(req.files.CFPCertificateFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                    .input("Name", "CFP Certificate")
                    .input("FileName", req.files.CFPCertificateFile.name)
                    .input("FileContent", req.files.CFPCertificateFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }

            if (req.files.CWMCertificateFile) {
                var fileTypeData = mime.lookup(req.files.CWMCertificateFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                    .input("Name", "CWM Certificate")
                    .input("FileName", req.files.CWMCertificateFile.name)
                    .input("FileContent", req.files.CWMCertificateFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }

            if (req.files.CACertificateFile) {
                var fileTypeData = mime.lookup(req.files.CACertificateFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                    .input("Name", "CA Certificate")
                    .input("FileName", req.files.CACertificateFile.name)
                    .input("FileContent", req.files.CACertificateFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }

            if (req.files.CSCertificateFile) {
                var fileTypeData = mime.lookup(req.files.CSCertificateFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                    .input("Name", "CS Certificate")
                    .input("FileName", req.files.CSCertificateFile.name)
                    .input("FileContent", req.files.CSCertificateFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }

            if (req.files.CourseCertificateFile) {
                var fileTypeData = mime.lookup(req.files.CourseCertificateFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                    .input("Name", "Course Certificate")
                    .input("FileName", req.files.CourseCertificateFile.name)
                    .input("FileContent", req.files.CourseCertificateFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }
        }

        var SecondaryLogMessage = "Associate Certificate Details Created";
        const logSecRequest = transaction.request();
        logSecRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", SecondaryLogMessage)
            .input("IsPrimaryStatus", false)
            .input("Revision", 0)
            .input("Indicator", 0);
        const LogSecResult = await logSecRequest.execute("InsertAssociateLog");

        if (mode == 'edit') {
            var SecondaryLogUpMessage = "Associate Certificate Details Updated";
            const logSecUpRequest = transaction.request();
            logSecUpRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("AppUserId", UserId)
                .input("LogMessage", SecondaryLogUpMessage)
                .input("IsPrimaryStatus", false)
                .input("Revision", 0)
                .input("Indicator", 0);
            const LogSecUpResult = await logSecUpRequest.execute("InsertAssociateLog");
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
        res.status(200).send({ Status: true, Message: "Associate Certificate Saved Successfully.", Data: { Id: Id } });
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

exports.SaveAssociateNominee = async (req, res) => {
    var { Id, AssociateId, Name, DateOfBirth, IsAddressAsPrimaryHolder, Address1, Address2, Address3, City, CountryId, StateId, PinCode, MobileNumber, TelephoneNumber, Email, mode } = req.body;
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    var errorMessage = "Error while saving associate nominee data...";
    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    if (DateOfBirth == undefined) {
        DateOfBirth = null;
    }

    if (mode == 'edit') {
        await this.CheckReverificationProcess(req, res, AssociateId);
    }

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(Id, true) == 0) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("Name", Name)
                .input("DateOfBirth", DateOfBirth)
                .input("IsAddressAsPrimaryHolder", IsAddressAsPrimaryHolder)
                .input("Address1", Address1)
                .input("Address2", Address2)
                .input("Address3", Address3)
                .input("City", City)
                .input("CountryId", cryptoEngine.ParamDecrypt(CountryId, true))
                .input("StateId", cryptoEngine.ParamDecrypt(StateId, true))
                .input("PinCode", PinCode)
                .input("MobileNumber", MobileNumber)
                .input("TelephoneNumber", TelephoneNumber)
                .input("Email", Email)
            const result = await request.execute("InsertAssociateNominee");
            Id = cryptoEngine.ParamEncrypt(result.output.Id, true);
        }
        else {
            const request = transaction.request();
            request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                .input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("Name", Name)
                .input("DateOfBirth", DateOfBirth)
                .input("IsAddressAsPrimaryHolder", IsAddressAsPrimaryHolder)
                .input("Address1", Address1)
                .input("Address2", Address2)
                .input("Address3", Address3)
                .input("City", City)
                .input("CountryId", cryptoEngine.ParamDecrypt(CountryId, true))
                .input("StateId", cryptoEngine.ParamDecrypt(StateId, true))
                .input("PinCode", PinCode)
                .input("MobileNumber", MobileNumber)
                .input("TelephoneNumber", TelephoneNumber)
                .input("Email", Email)
            const result = await request.execute("UpdateAssociateNominee");
        }

        const flagRequest = transaction.request();
        flagRequest.input("Id", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("IsNomineeCompleted", true);
        const FlagResult = await flagRequest.execute("UpdateAssociateNomineeFlag");

        var SecondaryLogMessage = "Associate Nominee Details Created";
        const logSecRequest = transaction.request();
        logSecRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", SecondaryLogMessage)
            .input("IsPrimaryStatus", false)
            .input("Revision", 0)
            .input("Indicator", 0);
        const LogSecResult = await logSecRequest.execute("InsertAssociateLog");

        if (mode == 'edit') {
            var SecondaryLogUpMessage = "Associate Nominee Details Updated";
            const logSecUpRequest = transaction.request();
            logSecUpRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("AppUserId", UserId)
                .input("LogMessage", SecondaryLogUpMessage)
                .input("IsPrimaryStatus", false)
                .input("Revision", 0)
                .input("Indicator", 0);
            const LogSecUpResult = await logSecUpRequest.execute("InsertAssociateLog");
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
        res.status(200).send({ Status: true, Message: "Associate Nominee Saved Successfully.", Data: { Id: Id } });
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

exports.SaveAssociateNomineeGuardian = async (req, res) => {
    var { Id, AssociateId, Name, PANCardNumber, RelationId, IsAddressAsPrimaryHolder, Address1, Address2, Address3, City, CountryId, StateId, PinCode, MobileNumber, TelephoneNumber, Email, mode } = req.body;
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    var errorMessage = "Error while saving associate nominee guardian data...";
    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    if (mode == 'edit') {
        await this.CheckReverificationProcess(req, res, AssociateId);
    }

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(Id, true) == 0) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("Name", Name)
                .input("PANCardNumber", PANCardNumber)
                .input("RelationId", cryptoEngine.ParamDecrypt(RelationId, true))
                .input("IsAddressAsPrimaryHolder", IsAddressAsPrimaryHolder)
                .input("Address1", Address1)
                .input("Address2", Address2)
                .input("Address3", Address3)
                .input("City", City)
                .input("CountryId", cryptoEngine.ParamDecrypt(CountryId, true))
                .input("StateId", cryptoEngine.ParamDecrypt(StateId, true))
                .input("PinCode", PinCode)
                .input("MobileNumber", MobileNumber)
                .input("TelephoneNumber", TelephoneNumber)
                .input("Email", Email)
            const result = await request.execute("InsertAssociateNomineeGuardian");
            Id = cryptoEngine.ParamEncrypt(result.output.Id, true);
        }
        else {
            const request = transaction.request();
            request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                .input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("Name", Name)
                .input("PANCardNumber", PANCardNumber)
                .input("RelationId", cryptoEngine.ParamDecrypt(RelationId, true))
                .input("IsAddressAsPrimaryHolder", IsAddressAsPrimaryHolder)
                .input("Address1", Address1)
                .input("Address2", Address2)
                .input("Address3", Address3)
                .input("City", City)
                .input("CountryId", cryptoEngine.ParamDecrypt(CountryId, true))
                .input("StateId", cryptoEngine.ParamDecrypt(StateId, true))
                .input("PinCode", PinCode)
                .input("MobileNumber", MobileNumber)
                .input("TelephoneNumber", TelephoneNumber)
                .input("Email", Email)
            const result = await request.execute("UpdateAssociateNomineeGuardian");
        }

        const flagRequest = transaction.request();
        flagRequest.input("Id", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("IsGuardianCompleted", true);
        const FlagResult = await flagRequest.execute("UpdateAssociateNomineeGuardianFlag");

        if (req.files) {
            if (req.files.NomineeGuardianPANCardFile) {
                var fileTypeData = mime.lookup(req.files.NomineeGuardianPANCardFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                    .input("Name", "Nominee Guardian PAN Card")
                    .input("FileName", req.files.NomineeGuardianPANCardFile.name)
                    .input("FileContent", req.files.NomineeGuardianPANCardFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }
        }

        var SecondaryLogMessage = "Associate Guardian Details Created";
        const logSecRequest = transaction.request();
        logSecRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", SecondaryLogMessage)
            .input("IsPrimaryStatus", false)
            .input("Revision", 0)
            .input("Indicator", 0);
        const LogSecResult = await logSecRequest.execute("InsertAssociateLog");

        if (mode == 'edit') {
            var SecondaryLogUpMessage = "Associate Guardian Details Updated";
            const logSecUpRequest = transaction.request();
            logSecUpRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("AppUserId", UserId)
                .input("LogMessage", SecondaryLogUpMessage)
                .input("IsPrimaryStatus", false)
                .input("Revision", 0)
                .input("Indicator", 0);
            const LogSecUpResult = await logSecUpRequest.execute("InsertAssociateLog");
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
        res.status(200).send({ Status: true, Message: "Associate Nominee Guardian Saved Successfully.", Data: { Id: Id } });
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

exports.GetCommunicationDetailsByAssociateId = async (req, res) => {
    const AssociateId = req.params.Id;
    var errorMessage = "Error while getting associate communication details data";
    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        const readResult = await readRequest.execute("GetCommunicationDetailsByAssociateId");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                AssociateId: cryptoEngine.ParamEncrypt(dataItem.AssociateId, true),
                Address1: dataItem.Address1,
                Address2: dataItem.Address2,
                Address3: dataItem.Address3,
                City: dataItem.City,
                StateId: cryptoEngine.ParamEncrypt(dataItem.StateId, true),
                CountryId: cryptoEngine.ParamEncrypt(dataItem.CountryId, true),
                PinCode: dataItem.PinCode,
                MobileNumber: dataItem.MobileNumber,
                TelephoneNumber: dataItem.TelephoneNumber,
                Email: dataItem.Email
            };
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetCommercialsByAssociateId = async (req, res) => {
    const AssociateId = req.params.Id;
    var errorMessage = "Error while getting associate commercial data";
    try {
        var dataList;

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        const readResult = await readRequest.execute("GetCommercialsByAssociateId");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    CommercialId: cryptoEngine.ParamEncrypt(dataList[i].CommercialId, true),
                    Name: dataList[i].Name,
                    BPS: dataList[i].BPS,
                    Percentage: dataList[i].Percentage
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

exports.SaveAssociateCommercial = async (req, res) => {
    var { AssociateId, AssociateCommercialDetails, mode } = req.body;
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    let AssociateCommercialData = JSON.parse(AssociateCommercialDetails);
    var errorMessage = "Error while saving associate commercials data...";
    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    if (mode == 'edit') {
        await this.CheckReverificationProcess(req, res, AssociateId);
    }

    var Revision = 0;

    const revisionRequest = req.app.locals.db.request();
    revisionRequest.input("Id", cryptoEngine.ParamDecrypt(AssociateId, true))
    const revisionResult = await revisionRequest.execute("GetAssociateRevision");
    if (revisionResult.recordset.length > 0) {
        let dataItem = revisionResult.recordset[0];
        Revision = dataItem.Revision;
    }

    try {
        var photoIdData;
        const readassociateRequest = req.app.locals.db.request();
        readassociateRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        const readAssociateResult = await readassociateRequest.execute("GetAssociatePhotoIdDetailsByAssociateId");
        if (readAssociateResult.recordset.length > 0) {
            photoIdData = readAssociateResult.recordset[0];
        }

        let UserName = photoIdData.PANCardNumber;
        let EntityDate = (photoIdData.DateOfIncorporation != null) ? photoIdData.DateOfIncorporation : photoIdData.DateOfBirth;

        let AppUserId = await appUserController.CreateAppUser(req, res, '414E2B5048745659672B513D', UserName, EntityDate, AssociateId, '414E2B5048745659672B513D', '414E2B5048745659672B513D', '414E2B5048745659672B513D');

    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
        return;
    }

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        for (let i = 0; i < AssociateCommercialData.length; i++) {
            // if (cryptoEngine.ParamDecrypt(AssociateCommercialData[i].Id, true) != 0) {

            const commercialsDeleteRequest = transaction.request();
            commercialsDeleteRequest.input("Id", cryptoEngine.ParamDecrypt(AssociateCommercialData[i].Id, true))
            // .input("AssociateId", cryptoEngine.ParamDecrypt(AssociateCommercialData[i].AssociateId, true))
            const CommercialsDeleteResult = await commercialsDeleteRequest.execute("DeleteAssociateCommercial");

            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("AssociateId", cryptoEngine.ParamDecrypt(AssociateCommercialData[i].AssociateId, true))
                .input("CommercialId", cryptoEngine.ParamDecrypt(AssociateCommercialData[i].CommercialId, true))
                .input("BPS", AssociateCommercialData[i].BPS)
                .input("Percentage", AssociateCommercialData[i].Percentage)
            const result = await request.execute("InsertAssociateCommercial");
        }

        const flagRequest = transaction.request();
        flagRequest.input("Id", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("IsCommerialsCompleted", true);
        const FlagResult = await flagRequest.execute("UpdateAssociateCommercialFlag");

        // var AppUserId = "4B31474B714330623142773D";
        var LogMessage = "Pending for Supervisior Verification";
        const logRequest = transaction.request();
        logRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", LogMessage)
            .input("IsPrimaryStatus", true)
            .input("Revision", Revision)
            .input("Indicator", 2);
        const LogResult = await logRequest.execute("InsertAssociateLog");

        // var photoIdData;

        // const readRequest = req.app.locals.db.request();
        // readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        // const readResult = await readRequest.execute("GetAssociatePhotoIdDetailsByAssociateId");
        // if (readResult.recordset.length > 0) {
        //     photoIdData = readResult.recordset[0];
        // }


        // var title = "Verification of new Associate "+photoIdData.Name+" is Pending.";
        // var link = "associate-generalinfo/" + AssociateId + "/verify";

        // const requestNotification = transaction.request();
        // requestNotification.output("Id", msSql.BigInt)
        //     .input("FromAppUserId", cryptoEngine.ParamDecrypt('4B31474B714330623142773D',true))
        //     .input("ToAppUserId", cryptoEngine.ParamDecrypt('4B31474B714330623142773D',true))
        //     .input("Title", title)
        //     .input("Description", " ")
        //     .input("Link",link)
        //     .input("IsRead",false)
        // const result = await requestNotification.execute("InsertNotification");
        // Id = cryptoEngine.ParamEncrypt(requestNotification.output.Id, true);

        // notificationEngine.SendRealTimeAssociateVerificationNotification(Id,AssociateId);

        var SecondaryLogMessage = "Associate Commercial Details Created";
        const logSecRequest = transaction.request();
        logSecRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", SecondaryLogMessage)
            .input("IsPrimaryStatus", false)
            .input("Revision", 0)
            .input("Indicator", 0);
        const LogSecResult = await logSecRequest.execute("InsertAssociateLog");

        if (mode == 'edit') {
            var SecondaryLogUpMessage = "Associate Commercial Details Updated";
            const logSecUpRequest = transaction.request();
            logSecUpRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("AppUserId", UserId)
                .input("LogMessage", SecondaryLogUpMessage)
                .input("IsPrimaryStatus", false)
                .input("Revision", 0)
                .input("Indicator", 0);
            const LogSecUpResult = await logSecUpRequest.execute("InsertAssociateLog");
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
        res.status(200).send({ Status: true, Message: "Associate Commercial Saved Successfully.", Data: {} });
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

exports.GetAssociatesList = async (req, res) => {
    var errorMessage = "Error while getting associate list data";
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetAssociatesList");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    AssociateName: dataList[i].AssociateName,
                    EmployeeName: dataList[i].EmployeeName,
                    Location: dataList[i].Location,
                    EntityType: dataList[i].EntityType,
                    LoginDate: dataList[i].LoginDate,
                    LogMessage: dataList[i].LogMessage,
                    StateName: dataList[i].StateName,
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

exports.GetAssociateGeneralInfoByAssociateId = async (req, res) => {
    const associateId = req.params.Id;
    var errorMessage = "Error while getting associate general information data";
    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true));
        const readResult = await readRequest.execute("GetAssociateGeneralInfobyAssociateId");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                IntroducerAssociateId: cryptoEngine.ParamEncrypt(dataItem.IntroducerAssociateId, true),
                ProfessionId: cryptoEngine.ParamEncrypt(dataItem.ProfessionId, true),
                EntityName: dataItem.EntityName,
                AuthorisedPerson1: dataItem.AuthorisedPerson1,
                Email1: dataItem.Email1,
                AuthorisedPerson2: dataItem.AuthorisedPerson2,
                Email2: dataItem.Email2,
                AuthorisedPerson3: dataItem.AuthorisedPerson3,
                Email3: dataItem.Email3,
                Name: dataItem.Name,
                PANCardNumber: dataItem.PANCardNumber,
                AadharCardNumber: dataItem.AadharCardNumber,
                DateOfBirth: dataItem.DateOfBirth,
                DateOfIncorporation: dataItem.DateOfIncorporation,
                GSTIN: dataItem.GSTIN,
                GSTINValidDate: dataItem.GSTINValidDate,
                ShopCertificateNumber: dataItem.ShopCertificateNumber,
                ShopCertificateValidDate: dataItem.ShopCertificateValidDate,
                TAN: dataItem.TAN,
                PrimaryColor: dataItem.PrimaryColor,
                SecondaryColor: dataItem.SecondaryColor,
                ARNHolderName: dataItem.ARNHolderName,
                ARN: dataItem.ARN,
                ARNValidDate: dataItem.ARNValidDate,
                EUINHolderName: dataItem.EUINHolderName,
                EUIN: dataItem.EUIN,
                EUINValidDate: dataItem.EUINValidDate,
                RIAName: dataItem.RIAName,
                RIANumber: dataItem.RIANumber,
                RIAValidDate: dataItem.RIAValidDate,
                IsActive: dataItem.IsActive,
                AssociateCode: dataItem.AssociateCode,
                BSEPassword: dataItem.BSEPassword,
                IsBSEFileUploaded: dataItem.IsBSEFileUploaded,
                Profession: dataItem.Profession,
                EmployeeId: cryptoEngine.ParamEncrypt(dataItem.EmployeeId, true),
                EmployeeName: dataItem.EmployeeName,
                AssociateBusinessId: cryptoEngine.ParamEncrypt(dataItem.AssociateBusinessId, true),
                BusinessTagName: dataItem.BusinessTagName,
                IsAdminVerified: dataItem.IsAdminVerified,
                IsSelfVerified: dataItem.IsSelfVerified
            };
        }
        res.status(200).send({ Status: (dataItem != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetAssociateEntityDetailsByAssociateId = async (req, res) => {
    const associateId = req.params.Id;
    var errorMessage = "Error while getting associate entity details data";
    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true));
        const readResult = await readRequest.execute("GetAssociateEntityDetailsByAssociateId");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                EntityName: dataItem.EntityName,
                AuthorisedPerson1: dataItem.AuthorisedPerson1,
                Email1: dataItem.Email1,
                Mobile1: dataItem.Mobile1,
                PAN1: dataItem.PAN1,
                AuthorisedPerson2: dataItem.AuthorisedPerson2,
                Email2: dataItem.Email2,
                Mobile2: dataItem.Mobile2,
                PAN2: dataItem.PAN2,
                AuthorisedPerson3: dataItem.AuthorisedPerson3,
                Email3: dataItem.Email3,
                Mobile3: dataItem.Mobile3,
                PAN3: dataItem.PAN3,
                EntityTypeId: cryptoEngine.ParamEncrypt(dataItem.EntityTypeId, true),
                EntityType: dataItem.EntityType
            };
        }
        res.status(200).send({ Status: (dataItem != null), Message: "", Data: data });
        // console.log(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetAssociatePhotoIdDetailsByAssociateId = async (req, res) => {
    const associateId = req.params.Id;
    var errorMessage = "Error while getting associate photoid details data";
    try {
        var photoIdData;

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true));
        const readResult = await readRequest.execute("GetAssociatePhotoIdDetailsByAssociateId");
        if (readResult.recordset.length > 0) {
            photoIdData = readResult.recordset[0];
        }

        if (photoIdData != null) {
            var data = {
                AssociateId: (photoIdData == true) ? '414E2B5048745659672B513D' : associateId,
                Name: photoIdData.Name,
                PANCardNumber: photoIdData.PANCardNumber,
                AadharCardNumber: photoIdData.AadharCardNumber,
                DateOfBirth: photoIdData.DateOfBirth,
                DateOfIncorporation: photoIdData.DateOfIncorporation,
                SelfPhotoFileName: photoIdData.SelfPhotoFileName,
                PANCardFileName: photoIdData.PANCardFileName,
                AadharCardFileName: photoIdData.AadharCardFileName
            };
        }
        res.status(200).send({ Status: (photoIdData != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetAssociateCommunicationDetailsByAssociateId = async (req, res) => {
    const associateId = req.params.Id;
    var errorMessage = "Error while getting associate communication details data";
    try {
        var addressData;
        var communicationDocumentData = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true));
        const readResult = await readRequest.execute("GetCommunicationDetailsByAssociateId");
        if (readResult.recordset.length > 0) {
            addressData = readResult.recordset[0];
        }

        // const readAddressDocumentsDetailsRequest = req.app.locals.db.request();
        // readAddressDocumentsDetailsRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true))
        // const AddressDocumentsDetailsResult = await readAddressDocumentsDetailsRequest.execute("GetAssociateCommunicationDocumentsDetailsByAssociateId");
        // if (AddressDocumentsDetailsResult.recordset.length > 0) {
        //     var addressDocumentsDetailsData = AddressDocumentsDetailsResult.recordset;
        //     for (let i = 0; i < addressDocumentsDetailsData.length; i++) {
        //         var item = {
        //             AssociateDocumentId: cryptoEngine.ParamEncrypt(addressDocumentsDetailsData[i].AssociateDocumentId, true),
        //             AssociateId: cryptoEngine.ParamEncrypt(addressDocumentsDetailsData[i].AssociateId, true),
        //             Name: addressDocumentsDetailsData[i].Name,
        //             FileName: addressDocumentsDetailsData[i].FileName,
        //             FileContent: addressDocumentsDetailsData[i].FileContent,
        //             FileContentType: addressDocumentsDetailsData[i].FileContentType,
        //         };
        //         communicationDocumentData.push(item);
        //     }
        // }

        if (addressData != null) {
            var data = {
                Id: cryptoEngine.ParamEncrypt(addressData.Id, true),
                AssociateId: (addressData == true) ? '414E2B5048745659672B513D' : associateId,
                Address1: addressData.Address1,
                Address2: addressData.Address2,
                Address3: addressData.Address3,
                City: addressData.City,
                StateId: cryptoEngine.ParamEncrypt(addressData.StateId, true),
                CountryId: cryptoEngine.ParamEncrypt(addressData.CountryId, true),
                PinCode: addressData.PinCode,
                MobileNumber: addressData.MobileNumber,
                TelephoneNumber: addressData.TelephoneNumber,
                Email: addressData.Email,
                AddressProofFileName: addressData.AddressProofFileName
            };
        }
        res.status(200).send({ Status: (addressData != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetAssociateBankDetailsByAssociateId = async (req, res) => {
    const associateId = req.params.Id;
    var errorMessage = "Error while getting associate bank details data";
    try {
        var bankData;
        var bankDocumentData = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true));
        const readResult = await readRequest.execute("GetAssociateBankDetailsByAssociateId");
        if (readResult.recordset.length > 0) {
            bankData = readResult.recordset[0];
        }

        // const readBankDocumentsDetailsRequest = req.app.locals.db.request();
        // readBankDocumentsDetailsRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true))
        // const BankDocumentsDetailsResult = await readBankDocumentsDetailsRequest.execute("GetAssociateBankDocumentsDetailsByAssociateId");
        // if (BankDocumentsDetailsResult.recordset.length > 0) {
        //     var bankDocumentsDetailsData = BankDocumentsDetailsResult.recordset;
        //     for (let i = 0; i < bankDocumentsDetailsData.length; i++) {
        //         var item = {
        //             AssociateDocumentId: cryptoEngine.ParamEncrypt(bankDocumentsDetailsData[i].AssociateDocumentId, true),
        //             AssociateId: cryptoEngine.ParamEncrypt(bankDocumentsDetailsData[i].AssociateId, true),
        //             Name: bankDocumentsDetailsData[i].Name,
        //             FileName: bankDocumentsDetailsData[i].FileName,
        //             FileContent: bankDocumentsDetailsData[i].FileContent,
        //             FileContentType: bankDocumentsDetailsData[i].FileContentType,
        //         };
        //         bankDocumentData.push(item);
        //     }
        // }

        if (bankData != null) {
            var data = {
                Id: cryptoEngine.ParamEncrypt(bankData.Id, true),
                AssociateId: (bankData == true) ? '414E2B5048745659672B513D' : associateId,
                IFSC: bankData.IFSC,
                BankName: bankData.BankName,
                Branch: bankData.Branch,
                MICR: bankData.MICR,
                BankAccountTypeId: cryptoEngine.ParamEncrypt(bankData.BankAccountTypeId, true),
                AccountNumber: bankData.AccountNumber,
                BankProofFileName: bankData.BankProofFileName,
                BankProofRIAFileName: bankData.BankProofRIAFileName
            };
        }
        res.status(200).send({ Status: (bankData != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetAssociateOtherDetailsByAssociateId = async (req, res) => {
    const associateId = req.params.Id;
    var errorMessage = "Error while getting associate other details data";
    try {
        var otherData;
        var otherDocumentData = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true));
        const readResult = await readRequest.execute("GetAssociateOtherDetailsByAssociateId");
        if (readResult.recordset.length > 0) {
            otherData = readResult.recordset[0];
        }

        // const readOtherDocumentsDetailsRequest = req.app.locals.db.request();
        // readOtherDocumentsDetailsRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true))
        // const OtherDocumentsDetailsResult = await readOtherDocumentsDetailsRequest.execute("GetAssociateOtherDocumentsDetailsByAssociateId");
        // if (OtherDocumentsDetailsResult.recordset.length > 0) {
        //     var otherDocumentsDetailsData = OtherDocumentsDetailsResult.recordset;
        //     for (let i = 0; i < otherDocumentsDetailsData.length; i++) {
        //         var item = {
        //             AssociateDocumentId: cryptoEngine.ParamEncrypt(otherDocumentsDetailsData[i].AssociateDocumentId, true),
        //             AssociateId: cryptoEngine.ParamEncrypt(otherDocumentsDetailsData[i].AssociateId, true),
        //             Name: otherDocumentsDetailsData[i].Name,
        //             FileName: otherDocumentsDetailsData[i].FileName,
        //             FileContent: otherDocumentsDetailsData[i].FileContent,
        //             FileContentType: otherDocumentsDetailsData[i].FileContentType,
        //         };
        //         otherDocumentData.push(item);
        //     }
        // }

        if (otherData != null) {
            var data = {
                AssociateId: (otherData == true) ? '414E2B5048745659672B513D' : associateId,
                GSTIN: otherData.GSTIN,
                GSTINValidDate: otherData.GSTINValidDate,
                ShopCertificateNumber: otherData.ShopCertificateNumber,
                ShopCertificateValidDate: otherData.ShopCertificateValidDate,
                TAN: otherData.TAN,
                PrimaryColor: otherData.PrimaryColor,
                SecondaryColor: otherData.SecondaryColor,
                GSTINCertificateFileName: otherData.GSTINCertificateFileName,
                ShopEstablishmentCertificateFileName: otherData.ShopEstablishmentCertificateFileName,
                PartnershipDeedFileName: otherData.PartnershipDeedFileName,
                AuthorizedSignatoryListFileName: otherData.AuthorizedSignatoryListFileName,
                CeriticateofIncorporationFileName: otherData.CeriticateofIncorporationFileName,
                MemorandumofAssociationFileName: otherData.MemorandumofAssociationFileName,
                ArticleofAssociationFileName: otherData.ArticleofAssociationFileName,
                BoardResolutionFileName: otherData.BoardResolutionFileName,
                TANCertificateFileName: otherData.TANCertificateFileName,
                LogoFileName: otherData.LogoFileName
            };
        }
        res.status(200).send({ Status: (otherData != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetAssociateProgress = async (req, res) => {
    const AssociateId = req.params.Id;
    var errorMessage = "Error while getting associate progress data";
    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("Id", cryptoEngine.ParamDecrypt(AssociateId, true));
        const readResult = await readRequest.execute("GetAssociateProgress");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                IsActive: dataItem.IsActive,
                IsBSEFileUploaded: dataItem.IsBSEFileUploaded,
                IsAdminVerified: dataItem.IsAdminVerified,
                IsSelfVerified: dataItem.IsSelfVerified,
                IsGeneralInfoCompleted: dataItem.IsGeneralInfoCompleted,
                IsPhotoDetailsCompleted: dataItem.IsPhotoDetailsCompleted,
                IsCommunicationCompleted: dataItem.IsCommunicationCompleted,
                IsBankCompleted: dataItem.IsBankCompleted,
                IsOtherCompleted: dataItem.IsOtherCompleted,
                IsNomineeCompleted: dataItem.IsNomineeCompleted,
                IsGuardianCompleted: dataItem.IsGuardianCompleted,
                IsLicenseCompleted: dataItem.IsLicenseCompleted,
                IsCertificateCompleted: dataItem.IsCertificateCompleted,
                IsCommerialsCompleted: dataItem.IsCommerialsCompleted,
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


exports.GetAssociateLicenseDetailsByAssociateId = async (req, res) => {
    const associateId = req.params.Id;
    var errorMessage = "Error while getting associate license details data";
    try {
        var licenseData;
        var licenseDocumentData = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true));
        const readResult = await readRequest.execute("GetAssociateLicenseDetailsByAssociateId");
        if (readResult.recordset.length > 0) {
            licenseData = readResult.recordset[0];
        }

        // const readLicenseDocumentsDetailsRequest = req.app.locals.db.request();
        // readLicenseDocumentsDetailsRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true))
        // const LicenseDocumentsDetailsResult = await readLicenseDocumentsDetailsRequest.execute("GetAssociateLicenseDocumentsDetailsByAssociateId");
        // if (LicenseDocumentsDetailsResult.recordset.length > 0) {
        //     var licenseDocumentsDetailsData = LicenseDocumentsDetailsResult.recordset;
        //     for (let i = 0; i < licenseDocumentsDetailsData.length; i++) {
        //         var item = {
        //             AssociateDocumentId: cryptoEngine.ParamEncrypt(licenseDocumentsDetailsData[i].AssociateDocumentId, true),
        //             AssociateId: cryptoEngine.ParamEncrypt(licenseDocumentsDetailsData[i].AssociateId, true),
        //             Name: licenseDocumentsDetailsData[i].Name,
        //             FileName: licenseDocumentsDetailsData[i].FileName,
        //             FileContent: licenseDocumentsDetailsData[i].FileContent,
        //             FileContentType: licenseDocumentsDetailsData[i].FileContentType,
        //         };
        //         licenseDocumentData.push(item);
        //     }
        // }

        if (licenseData != null) {
            var data = {
                AssociateId: (licenseData == true) ? '414E2B5048745659672B513D' : associateId,
                ARNHolderName: licenseData.ARNHolderName,
                ARN: licenseData.ARN,
                ARNValidDate: licenseData.ARNValidDate,
                EUINHolderName: licenseData.EUINHolderName,
                EUIN: licenseData.EUIN,
                EUINValidDate: licenseData.EUINValidDate,
                RIAName: licenseData.RIAName,
                RIANumber: licenseData.RIANumber,
                RIAValidDate: licenseData.RIAValidDate,
                ARNProofFileName: licenseData.ARNProofFileName,
                EUINProofFileName: licenseData.EUINProofFileName,
                RIAProofFileName: licenseData.RIAProofFileName
            };
        }
        res.status(200).send({ Status: (licenseData != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetAssociateCertificateDetailsByAssociateId = async (req, res) => {
    const associateId = req.params.Id;
    var errorMessage = "Error while getting associate certification details data";
    try {
        var certificateData;
        var certificationTypeData = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true));
        const readResult = await readRequest.execute("GetAssociateCertificateDetailsByAssociateId");
        if (readResult.recordset.length > 0) {
            certificateData = readResult.recordset[0];
        }

        const readCertificationTypeRequest = req.app.locals.db.request();
        readCertificationTypeRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true));
        const CertificationTypeResult = await readCertificationTypeRequest.execute("GetAssociateCertificationTypeById");
        if (CertificationTypeResult.recordset.length > 0) {
            var certificationTypeDetailsData = CertificationTypeResult.recordset;
            for (let i = 0; i < certificationTypeDetailsData.length; i++) {
                var item = {
                    AssociateCertificationTypeId: cryptoEngine.ParamEncrypt(certificationTypeDetailsData[i].AssociateCertificationTypeId, true),
                    AssociateId: cryptoEngine.ParamEncrypt(certificationTypeDetailsData[i].AssociateId, true),
                    CertificationType: certificationTypeDetailsData[i].CertificationType,

                };
                certificationTypeData.push(item);
            }
        }
        // const readCertificateDocumentsDetailsRequest = req.app.locals.db.request();
        // readCertificateDocumentsDetailsRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true))
        // const CertificateDocumentsDetailsResult = await readCertificateDocumentsDetailsRequest.execute("GetAssociateCertificateDocumentsDetailsByAssociateId");
        // if (CertificateDocumentsDetailsResult.recordset.length > 0) {
        //     var certificateDocumentsDetailsData = CertificateDocumentsDetailsResult.recordset;
        //     for (let i = 0; i < certificateDocumentsDetailsData.length; i++) {
        //         var item = {
        //             AssociateDocumentId: cryptoEngine.ParamEncrypt(certificateDocumentsDetailsData[i].AssociateDocumentId, true),
        //             AssociateId: cryptoEngine.ParamEncrypt(certificateDocumentsDetailsData[i].AssociateId, true),
        //             Name: certificateDocumentsDetailsData[i].Name,
        //             FileName: certificateDocumentsDetailsData[i].FileName,
        //             FileContent: certificateDocumentsDetailsData[i].FileContent,
        //             FileContentType: certificateDocumentsDetailsData[i].FileContentType,
        //         };
        //         certificateDocumentData.push(item);
        //     }
        // }

        if (certificateData != null) {
            var data = {
                Id: cryptoEngine.ParamEncrypt(certificateData.Id, true),
                AssociateId: (certificateData == true) ? '414E2B5048745659672B513D' : associateId,
                NismVaNumber: certificateData.NismVaNumber,
                NismVaValidDate: certificateData.NismVaValidDate,
                NismXaNumber: certificateData.NismXaNumber,
                NismXaValidDate: certificateData.NismXaValidDate,
                NismXbNumber: certificateData.NismXbNumber,
                NismXbValidDate: certificateData.NismXbValidDate,
                CfpNumber: certificateData.CfpNumber,
                CfpValidDate: certificateData.CfpValidDate,
                CwmNumber: certificateData.CwmNumber,
                CwmValidDate: certificateData.CwmValidDate,
                CaNumber: certificateData.CaNumber,
                CaValidDate: certificateData.CaValidDate,
                CsNumber: certificateData.CsNumber,
                CsValidDate: certificateData.CsValidDate,
                CourseName: certificateData.CourseName,
                CourseNumber: certificateData.CourseNumber,
                CourseValidDate: certificateData.CourseValidDate,
                NISMVACertificateFileName: certificateData.NISMVACertificateFileName,
                NISMXACertificateFileName: certificateData.NISMXACertificateFileName,
                NISMXBCertificateFileName: certificateData.NISMXBCertificateFileName,
                CFPCertificateFileName: certificateData.CFPCertificateFileName,
                CWMCertificateFileName: certificateData.CWMCertificateFileName,
                CACertificateFileName: certificateData.CACertificateFileName,
                CSCertificateFileName: certificateData.CSCertificateFileName,
                CourseCertificateFileName: certificateData.CourseCertificateFileName,
                // CertificateDocumentData: certificateDocumentData
                CertificationTypeData: certificationTypeData,
            };
        }
        res.status(200).send({ Status: (certificateData != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetAssociateNomineeDetailsByAssociateId = async (req, res) => {
    const associateId = req.params.Id;
    var errorMessage = "Error while getting associate nominee details data";
    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true));
        const readResult = await readRequest.execute("GetAssociateNomineeDetailsByAssociateId");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                AssociateId: (dataItem == true) ? '414E2B5048745659672B513D' : associateId,
                Name: dataItem.Name,
                DateOfBirth: dataItem.DateOfBirth,
                IsAddressAsPrimaryHolder: dataItem.IsAddressAsPrimaryHolder,
                Address1: dataItem.Address1,
                Address2: dataItem.Address2,
                Address3: dataItem.Address3,
                City: dataItem.City,
                CountryId: cryptoEngine.ParamEncrypt(dataItem.CountryId, true),
                StateId: cryptoEngine.ParamEncrypt(dataItem.StateId, true),
                PinCode: dataItem.PinCode,
                MobileNumber: dataItem.MobileNumber,
                TelephoneNumber: dataItem.TelephoneNumber,
                Email: dataItem.Email
            };
        }
        res.status(200).send({ Status: (dataItem != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetAssociateNomineeGuardianDetailsByAssociateId = async (req, res) => {
    const associateId = req.params.Id;
    var errorMessage = "Error while getting associate guardian details data";
    try {
        var nomineeGuardianData;
        var nomineeGuardianDocumentData = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true));
        const readResult = await readRequest.execute("GetAssociateNomineeGuardianDetailsByAssociateId");
        if (readResult.recordset.length > 0) {
            nomineeGuardianData = readResult.recordset[0];
        }

        // const readNomineeGuardianDocumentsDetailsRequest = req.app.locals.db.request();
        // readNomineeGuardianDocumentsDetailsRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true))
        // const NomineeGuardianDocumentsDetailsResult = await readNomineeGuardianDocumentsDetailsRequest.execute("GetAssociateNomineeGuardianDocumentsDetailsByAssociateId");
        // if (NomineeGuardianDocumentsDetailsResult.recordset.length > 0) {
        //     var nomineeGuardianDocumentsDetailsData = NomineeGuardianDocumentsDetailsResult.recordset;
        //     for (let i = 0; i < nomineeGuardianDocumentsDetailsData.length; i++) {
        //         var item = {
        //             AssociateDocumentId: cryptoEngine.ParamEncrypt(nomineeGuardianDocumentsDetailsData[i].AssociateDocumentId, true),
        //             AssociateId: cryptoEngine.ParamEncrypt(nomineeGuardianDocumentsDetailsData[i].AssociateId, true),
        //             Name: nomineeGuardianDocumentsDetailsData[i].Name,
        //             FileName: nomineeGuardianDocumentsDetailsData[i].FileName,
        //             FileContent: nomineeGuardianDocumentsDetailsData[i].FileContent,
        //             FileContentType: nomineeGuardianDocumentsDetailsData[i].FileContentType,
        //         };
        //         nomineeGuardianDocumentData.push(item);
        //     }
        // }

        if (nomineeGuardianData != null) {
            var data = {
                Id: cryptoEngine.ParamEncrypt(nomineeGuardianData.Id, true),
                AssociateId: (nomineeGuardianData == true) ? '414E2B5048745659672B513D' : associateId,
                Name: nomineeGuardianData.Name,
                PANCardNumber: nomineeGuardianData.PANCardNumber,
                RelationId: cryptoEngine.ParamEncrypt(nomineeGuardianData.RelationId, true),
                IsAddressAsPrimaryHolder: nomineeGuardianData.IsAddressAsPrimaryHolder,
                Address1: nomineeGuardianData.Address1,
                Address2: nomineeGuardianData.Address2,
                Address3: nomineeGuardianData.Address3,
                City: nomineeGuardianData.City,
                CountryId: cryptoEngine.ParamEncrypt(nomineeGuardianData.CountryId, true),
                StateId: cryptoEngine.ParamEncrypt(nomineeGuardianData.StateId, true),
                PinCode: nomineeGuardianData.PinCode,
                MobileNumber: nomineeGuardianData.MobileNumber,
                TelephoneNumber: nomineeGuardianData.TelephoneNumber,
                Email: nomineeGuardianData.Email,
                NomineeGuardianPANCardFileName: nomineeGuardianData.NomineeGuardianPANCardFileName
            };
        }
        res.status(200).send({ Status: (nomineeGuardianData != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetAssociateCommercialDetailsByAssociateId = async (req, res) => {
    const associateId = req.params.Id;
    var errorMessage = "Error while getting associate commercial details data";
    try {
        var dataList;

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true));
        const readResult = await readRequest.execute("GetAssociateCommercialDetailsByAssociateId");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
            // console.log(dataList);
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    // AssociateId: (dataItem == true) ? '414E2B5048745659672B513D' : associateId,
                    CommercialId: cryptoEngine.ParamEncrypt(dataList[i].CommercialId, true),
                    Name: dataList[i].Name,
                    BPS: dataList[i].BPS,
                    Percentage: dataList[i].Percentage
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

exports.SaveAssociateRights = async (req, res) => {
    var { AssociateId, AssociateMenuData, AppUserId, mode } = req.body;
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);

    let AssociateRightsData = JSON.parse(AssociateMenuData);
    var errorMessage = "Error while saving associate rights data...";
    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    var Revision = 0;

    const revisionRequest = req.app.locals.db.request();
    revisionRequest.input("Id", cryptoEngine.ParamDecrypt(AssociateId, true))
    const revisionResult = await revisionRequest.execute("GetAssociateRevision");
    if (revisionResult.recordset.length > 0) {
        let dataItem = revisionResult.recordset[0];
        Revision = dataItem.Revision;
    }

    var appUserData;

    const readAppUserRequest = req.app.locals.db.request();
    readAppUserRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
    const readAppUserResult = await readAppUserRequest.execute("GetAppUserByAssociateId");
    if (readAppUserResult.recordset.length > 0) {
        appUserData = readAppUserResult.recordset[0];
    }


    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const associateAppUserMenuOptionRequest = transaction.request();
        associateAppUserMenuOptionRequest.input("AppUserId", cryptoEngine.ParamDecrypt(AppUserId, true));
        const AssociateAppUserMenuOptionRequest = await associateAppUserMenuOptionRequest.execute("DeleteAppUserMenuOptions");

        for (let i = 0; i < AssociateRightsData.length; i++) {
            const request = transaction.request();
            request.input("AppUserId", appUserData.Id)
                .input("MenuOptionId", cryptoEngine.ParamDecrypt(AssociateRightsData[i].MenuOptionId, true))
                .input("IsCreate", AssociateRightsData[i].IsCreate)
            const result = await request.execute("InsertAppUserMenuOption");
        }

        const flagRequest = transaction.request();
        flagRequest.input("Id", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("IsRightsCompleted", true);
        const FlagResult = await flagRequest.execute("UpdateAssociateRightsFlag");

        // var AppUserId = "4B31474B714330623142773D";
        var LogMessage = "Approved By Supervisior";
        const logRequest = transaction.request();
        logRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", LogMessage)
            .input("IsPrimaryStatus", true)
            .input("Revision", Revision)
            .input("Indicator", 3);
        const LogResult = await logRequest.execute("InsertAssociateLog");

        // var AppUserId = "4B31474B714330623142773D";
        var LogVerificationMessage = "Pending for Associate Verification";
        const logVerificationRequest = transaction.request();
        logVerificationRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", LogVerificationMessage)
            .input("IsPrimaryStatus", true)
            .input("Revision", Revision)
            .input("Indicator", 2);
        const LogVerificationResult = await logVerificationRequest.execute("InsertAssociateLog");

        var SecondaryLogMessage = "Associate Rights Details Created";
        const logSecRequest = transaction.request();
        logSecRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", SecondaryLogMessage)
            .input("IsPrimaryStatus", false)
            .input("Revision", 0)
            .input("Indicator", 0);
        const LogSecResult = await logSecRequest.execute("InsertAssociateLog");

        if (mode == 'edit') {
            var SecondaryLogUpMessage = "Associate Rights Details Updated";
            const logSecUpRequest = transaction.request();
            logSecUpRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("AppUserId", UserId)
                .input("LogMessage", SecondaryLogUpMessage)
                .input("IsPrimaryStatus", false)
                .input("Revision", 0)
                .input("Indicator", 0);
            const LogSecUpResult = await logSecUpRequest.execute("InsertAssociateLog");
        }

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

        res.status(500).send(errorMessage);
    }

    var dataItem;

    const readRequest = req.app.locals.db.request();
    readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
    const readResult = await readRequest.execute("GetAssociateGeneralInfobyAssociateId");
    if (readResult.recordset.length > 0) {
        dataItem = readResult.recordset[0];
    }

    if (dataItem != null) {
        if (dataItem.IsActive == true && dataItem.IsAdminVerified == true && dataItem.IsSelfVerified == true) {
            res.status(200).send({ Status: true, Message: "Associate Rights Saved Successfully.", Data: {} });
        }
        else {
            try {
                var createdByData;
                var photoIdData;
                const readRequest = req.app.locals.db.request();
                readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
                const readResult = await readRequest.execute("GetAssociatesEmailByAssociateId");

                if (readResult.recordset.length > 0) {
                    createdByData = readResult.recordset[0];
                }

                const readNameRequest = req.app.locals.db.request();
                readNameRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
                const readNameResult = await readNameRequest.execute("GetAssociatePhotoIdDetailsByAssociateId");
                if (readNameResult.recordset.length > 0) {
                    photoIdData = readNameResult.recordset[0];
                }

                var timeStamp = new Date();
                var link = process.env.WEB_APP_LINK + '/associate-self-verification/' + AssociateId + '/' + cryptoEngine.ParamEncrypt('externalverify', true) + "/" + cryptoEngine.ParamEncrypt(timeStamp.toISOString(), true);
                emailEngine.SendAssociateVerification(createdByData.Email, photoIdData.Name, link);

                res.status(200).send({ Status: true, Message: "Associate Rights Saved Successfully.", Data: {} });
            }
            catch (err) {
                console.log(err);
                res.status(500).send(errorMessage);
            }
        }
    }
    else {
        res.status(200).send({ Status: true, Message: "Associate Rights Saved Successfully.", Data: {} });
    }
};

exports.SaveAssociateBSEFile = async (req, res) => {
    var { TermId, AssociateId, IsSelfVerified } = req.body;
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    var errorMessage = "Error while saving associate bse file data";

    var merger = new PDFMerger();

    var Revision = 0;

    const revisionRequest = req.app.locals.db.request();
    revisionRequest.input("Id", cryptoEngine.ParamDecrypt(AssociateId, true))
    const revisionResult = await revisionRequest.execute("GetAssociateRevision");
    if (revisionResult.recordset.length > 0) {
        let dataItem = revisionResult.recordset[0];
        Revision = dataItem.Revision;
    }

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        const readResult = await readRequest.execute("GetAssociateDownloadByAssociateId");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        let data = "{1}|{2}|{3}|{4}|{5}|{6}|{7}|{8}|{9}|{10}|{11}|{12}|{13}|{14}|{15}|{16}|{17}|{18}|{19}|{20}";
        // var code = bseConfig.MemberId + dataItem.NewAssociateCode.toString().padStart(2, "0");
        // console.log(code);
        var code = bseConfig.MemberId + dataItem.NewAssociateCode.toString().padStart(2, "0");
        var Password = commonFunction.GetRandomNumber(6);
        var encryptedPassword = cryptoEngine.Encrypt(Password, true);
        if (dataItem !== null) {
            data = data.replace('{1}', 'DEALER');
            data = data.replace('{2}', code);
            data = data.replace('{3}', 'CORPBRANCH');
            // data = data.replace('{4}', cryptoEngine.ParamDecrypt(encryptedPassword, true));
            data = data.replace('{4}', Password);
            data = data.replace('{5}', dataItem.EntityName);
            data = data.replace('{6}', code);
            data = data.replace('{7}', 'ARN-' + dataItem.ARN);
            data = data.replace('{8}', 'E ' + dataItem.EUIN);
            data = data.replace('{9}', dataItem.Address1.replace(/,/g, ' '));
            data = data.replace('{10}', dataItem.Address2.replace(/,/g, ' '));
            data = data.replace('{11}', dataItem.Address3.replace(/,/g, ' '));
            data = data.replace('{12}', dataItem.City);
            data = data.replace('{13}', dataItem.State);
            data = data.replace('{14}', dataItem.PinCode);
            data = data.replace('{15}', dataItem.Country);
            data = data.replace('{16}', dataItem.TelephoneNumber);
            data = data.replace('{17}', dataItem.MobileNumber);
            data = data.replace('{18}', '');
            data = data.replace('{19}', dataItem.Email);
            data = data.replace('{20}', 'F');
        }

        const csvData = data.replace(/\,/g, '|');
        const BSEFilebuffer = Buffer.from(csvData, 'utf8');
        // console.log(encryptedPassword);

        if (BSEFilebuffer != null) {
            var fileTypeData = mime.lookup(BSEFilebuffer.name);
            const fileRequest = transaction.request();
            fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("Name", "BSE File")
                .input("FileName", code + '.csv')
                .input("FileContent", BSEFilebuffer)
                .input("FileContentType", 'text/csv');
            const fileResult = await fileRequest.execute("InsertAssociateDocument");
        }

        if (code != null) {
            const request = transaction.request();
            request.input("Id", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("code", dataItem.NewAssociateCode.toString().padStart(2, "0"))
                // .input("code", code)
                .input("encryptedPassword", encryptedPassword)
            const result = await request.execute("UpdateAssociateCodeBSEPassword");
        }

        // var AppUserId = "4B31474B714330623142773D";
        var LogMessage = "Associate Approved";
        const logRequest = transaction.request();
        logRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", LogMessage)
            .input("IsPrimaryStatus", true)
            .input("Revision", Revision)
            .input("Indicator", 3);
        const LogResult = await logRequest.execute("InsertAssociateLog");

        // var AppUserId = "4B31474B714330623142773D";
        var LogEmpanelmentMessage = "Pending for Empanelment Form";
        const logEmpanelmentRequest = transaction.request();
        logEmpanelmentRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", LogEmpanelmentMessage)
            .input("IsPrimaryStatus", true)
            .input("Revision", Revision)
            .input("Indicator", 2);
        const LogEmpanelmentResult = await logEmpanelmentRequest.execute("InsertAssociateLog");
        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }

    try {
        await transaction.begin();
        var Reportdate;
        var formData;
        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        const result = await readRequest.execute("GetAssociateEmpanelmentbyAssociateId");
        if (result.recordset.length > 0) {
            formData = result.recordset[0];
        }

        if (formData == null) {
            errorMessage = "Data not found...";
            throw new Error(errorMessage);
        }

        if (formData.DateOfIncorporation != null) {
            Reportdate = date.format(new Date(formData.DateOfIncorporation), 'DD-MM-YYYY')
        } else {
            Reportdate = date.format(new Date(formData.DateOfBirth), 'DD-MM-YYYY')
        }

        let NismVaValidDateFormatted = '';
        if (formData.NismVaValidDate) {
            NismVaValidDateFormatted = date.format(new Date(formData.NismVaValidDate), 'DD-MM-YYYY');
        }

        let GSTINValidDateFormatted = '';
        if (formData.GSTINValidDate) {
            GSTINValidDateFormatted = date.format(new Date(formData.GSTINValidDate), 'DD-MM-YYYY');
        }

        let ARNValidDateFormatted = '';
        if (formData.ARNValidDate) {
            ARNValidDateFormatted = date.format(new Date(formData.ARNValidDate), 'DD-MM-YYYY');
        }

        let EUINValidDateFormatted = '';
        if (formData.EUINValidDate) {
            EUINValidDateFormatted = date.format(new Date(formData.EUINValidDate), 'DD-MM-YYYY');
        }

        let NomineeDateOfBirthFormatted = '';
        if (formData.NomineeDateOfBirth) {
            NomineeDateOfBirthFormatted = date.format(new Date(formData.NomineeDateOfBirth), 'DD-MM-YYYY');
        }

        let CorrespondenceAddress = '';
        if (formData.Address1) {
            CorrespondenceAddress = formData.Address1 + ', ' + formData.Address2 + ', ' + formData.Address3 + ', ' + formData.City + ', ' + formData.State + ', ' + formData.Country;
        }

        let NomineeAddress = '';
        if (formData.NomineeAddress1) {
            NomineeAddress = formData.NomineeAddress1 + ', ' + formData.NomineeAddress2 + ', ' + formData.NomineeAddress3 + ', ' + formData.NomineeCity + ', ' + formData.NomineeState + ', ' + formData.NomineeCountry;
        }

        let GaurdianAddress = '';
        if (formData.GaurdianAddress1) {
            GaurdianAddress = formData.GaurdianAddress1 + ', ' + formData.GaurdianAddress2 + ', ' + formData.GaurdianAddress3 + ', ' + formData.GaurdianCity + ', ' + formData.GaurdianState + ', ' + formData.GaurdianCountry;
        }

        let ARN = '';
        if (formData.ARN) {
            ARN = 'ARN-' + formData.ARN;
        }

        let EUIN = '';
        if (formData.EUIN) {
            EUIN = 'E ' + formData.EUIN;
        }

        const currentDocDate = new Date();
        const day = currentDocDate.getDate();
        const month = currentDocDate.toLocaleString('default', { month: 'long' });
        const year = currentDocDate.getFullYear();

        const formattedDocDate = `${day} of ${month}, ${year}`;

        // console.log(formattedDate);

        let data = {
            EmployeeName: formData.EmployeeName,
            NewAssociateCode: bseConfig.MemberId + formData.AssociateCode,
            AssociateName: formData.AssociateName,
            EntityType: formData.EntityType,
            AuthorisedPerson1: formData.AuthorisedPerson1,
            AuthorisedPerson2: formData.AuthorisedPerson2,
            AuthorisedPerson3: formData.AuthorisedPerson3,
            PANCardNumber: formData.PANCardNumber,
            CorrespondenceAddress: CorrespondenceAddress,
            City: formData.City,
            PinCode: formData.PinCode,
            MobileNumber: formData.MobileNumber,
            Email: formData.Email,
            GSTIN: formData.GSTIN,
            GSTINValidDate: GSTINValidDateFormatted,
            Email1: formData.Email1,
            Email2: formData.Email2,
            Email3: formData.Email3,
            Mobile1: formData.Mobile1,
            Mobile2: formData.Mobile2,
            Mobile3: formData.Mobile3,
            PAN1: formData.PAN1,
            PAN2: formData.PAN2,
            PAN3: formData.PAN3,
            ARN: ARN,
            ARNValidDate: ARNValidDateFormatted,
            EUIN: EUIN,
            EUINValidDate: EUINValidDateFormatted,
            NismVaNumber: formData.NismVaNumber,
            NismVaValidDate: NismVaValidDateFormatted,
            BankName: formData.BankName,
            Branch: formData.Branch,
            IFSC: formData.IFSC,
            MICR: formData.MICR,
            AccountNumber: formData.AccountNumber,
            BankAccountType: formData.BankAccountType,
            NomineeName: formData.NomineeName,
            NomineeDateOfBirth: NomineeDateOfBirthFormatted,
            GuardianRelation: formData.GuardianRelation,
            NomineeAddress: NomineeAddress,
            NomineeCity: formData.NomineeCity,
            NomineeState: formData.NomineeState,
            NomineePinCode: formData.NomineePinCode,
            NomineeEmail: formData.NomineeEmail,
            NomineeMobileNumber: formData.NomineeMobileNumber,
            GaurdianName: formData.GaurdianName,
            GuardianRelation: formData.GuardianRelation,
            GaurdianAddress: GaurdianAddress,
            GaurdianCity: formData.GaurdianCity,
            GaurdianState: formData.GaurdianState,
            GaurdianPinCode: formData.GaurdianPinCode,
            GaurdianEmail: formData.GaurdianEmail,
            GaurdianMobileNumber: formData.GaurdianMobileNumber,
            Reportdate: Reportdate
        };


        var commercialData;
        const readCommercialRequest = req.app.locals.db.request();
        readCommercialRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        const resultCommercial = await readCommercialRequest.execute("GetAssociateCommercialsByAssociateId");
        if (resultCommercial.recordset.length > 0) {
            commercialData = resultCommercial.recordset;
        }

        let loidata = {
            EmployeeName: formData.EmployeeName,
            AssociateName: formData.AssociateName,
            EQUITYMF: commercialData[0].CombinedValue,
            SHORTTERMMF: commercialData[1].CombinedValue,
            P2P: commercialData[2].CombinedValue,
        }

        let agreedata = {
            EmployeeName: formData.EmployeeName,
            AssociateName: formData.AssociateName,
            AuthorisedPerson1: formData.AuthorisedPerson1,
            EntityType: formData.EntityType,
            CorrespondenceAddress: formData.Address1 + ', ' + formData.Address2 + ', ' + formData.Address3 + ', ' + formData.City + ', ' + formData.State + ', ' + formData.Country,
            formattedDate: formattedDocDate,
        }

        var professionData;
        const readProfessionRequest = req.app.locals.db.request();
        readProfessionRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        const readProfessionResult = await readProfessionRequest.execute("GetAssociateGeneralInfobyAssociateId");
        if (readProfessionResult.recordset.length > 0) {
            professionData = readProfessionResult.recordset[0];
        }

        const currentDate = new Date();
        const formattedDate = currentDate.getDate().toString().padStart(2, '0') + (currentDate.getMonth() + 1).toString().padStart(2, '0') + currentDate.getFullYear();
        let fileName = 'temp_' + data.NewAssociateCode.toString() + formattedDate + '.pdf';
        let introagreeFileName = 'temp_' + 'in_' + data.NewAssociateCode.toString() + formattedDate + '.pdf';
        let introloiagreeFileName = 'temp_' + 'inloi_' + data.NewAssociateCode.toString() + formattedDate + '.pdf';
        let cepagreeFileName = 'temp_' + 'cep_' + data.NewAssociateCode.toString() + formattedDate + '.pdf';
        let ceploiagreeFileName = 'temp_' + 'ceploi_' + data.NewAssociateCode.toString() + formattedDate + '.pdf';

        var reportPath = await pdfEngine.GenerateA4PortraitPdfBuffer("associateempanelmentform.template.hbs", data, fileName, 'reports');
        var reportPathcep;
        var reportPathceploi;
        var reportPathintro;
        var reportPathintroloi;

        if (professionData.Profession == 'MFD' || professionData.Profession == 'RIA' || professionData.Profession == 'MFD & RIA') {
            reportPathcep = await pdfEngine.GenerateA4PortraitCEPPdfBuffer("associatecepagreement.template.hbs", agreedata, cepagreeFileName, 'reports');
            reportPathceploi = await pdfEngine.GenerateA4PortraitPdfBuffer("associateceploiagreement.template.hbs", loidata, ceploiagreeFileName, 'reports');
        } else {
            reportPathintro = await pdfEngine.GenerateA4PortraitCEPPdfBuffer("associateintroagreement.template.hbs", agreedata, introagreeFileName, 'reports');
            reportPathintroloi = await pdfEngine.GenerateA4PortraitPdfBuffer("associateintroloiagreement.template.hbs", loidata, introloiagreeFileName, 'reports');
        }

        var empanelmentFormFileName = data.NewAssociateCode.toString() + formattedDate + '.pdf';
        // var empanelmentFormFilePath = reportPath.replace('temp_' + data.NewAssociateCode.toString() + formattedDate + '.pdf', empanelmentFormFileName);

        if (formData.EmployeeName == 'Kinntegra Wealth Private Limited') {
            await merger.add(reportPath);
        } else {
            if (professionData.Profession == 'MFD' || professionData.Profession == 'RIA' || professionData.Profession == 'MFD & RIA') {
                await merger.add(reportPath);
                await merger.add(reportPathcep);
                await merger.add(reportPathceploi);
            } else {
                await merger.add(reportPath);
                await merger.add(reportPathintro);
                await merger.add(reportPathintroloi);
            }
        }

        // await merger.save(empanelmentFormFilePath);

        // const serializedData = Buffer.from(JSON.stringify(data), 'utf8');
        const serializedData = await merger.saveAsBuffer();
        if (serializedData != null) {
            const fileRequest = transaction.request();
            fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("Name", "Empanelment Form")
                .input("FileName", empanelmentFormFileName)
                .input("FileContent", serializedData)
                .input("FileContentType", 'application/pdf');
            const fileResult = await fileRequest.execute("InsertAssociateDocument");
        }

        if (cryptoEngine.ParamDecrypt(TermId, true) != 0) {
            const request = transaction.request();
            request.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("TermsConditionsId", cryptoEngine.ParamDecrypt(TermId, true))
            const result = await request.execute("InsertAssociateTermsConditions");
        }

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }

    try {
        await transaction.begin();

        const request = transaction.request();
        request.input("Id", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("IsSelfVerified", IsSelfVerified);

        const result = await request.execute("UpdateAssociateSelfVerification");

        const requestAppUser = transaction.request();
        requestAppUser.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("IsActive", true);

        const resultAppUser = await requestAppUser.execute("UpdateAssociateAppUserActive");

        await transaction.commit();

        res.status(200).send({ Status: true, Message: "", Data: AssociateId });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }

};

exports.GetAssociateDownloadDocumentsDetailsByAssociateId = async (req, res) => {
    const associateId = req.params.Id;
    var errorMessage = "Error while getting associate download documents details data";
    try {
        var downloadDocumentData = [];
        const readdownloadDocumentsDetailsRequest = req.app.locals.db.request();
        readdownloadDocumentsDetailsRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true))
        const downloadDocumentsDetailsResult = await readdownloadDocumentsDetailsRequest.execute("GetAssociateDownloadDocumentsDetailsByAssociateId");
        if (downloadDocumentsDetailsResult.recordset.length > 0) {
            var downloadDocumentsDetailsData = downloadDocumentsDetailsResult.recordset;
            for (let i = 0; i < downloadDocumentsDetailsData.length; i++) {
                var item = {
                    AssociateDocumentId: cryptoEngine.ParamEncrypt(downloadDocumentsDetailsData[i].AssociateDocumentId, true),
                    AssociateId: cryptoEngine.ParamEncrypt(downloadDocumentsDetailsData[i].AssociateId, true),
                    Name: downloadDocumentsDetailsData[i].Name,
                    FileName: downloadDocumentsDetailsData[i].FileName,
                    FileContent: downloadDocumentsDetailsData[i].FileContent,
                    FileContentType: downloadDocumentsDetailsData[i].FileContentType,
                };
                downloadDocumentData.push(item);
            }
        }

        if (downloadDocumentData != null) {
            var data = { DownloadDocumentData: downloadDocumentData };
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetAssociateEmpanelmentFormDetailsByAssociateId = async (req, res) => {
    const associateId = req.params.Id;
    var errorMessage = "Error while getting associate empanelment form details data";
    try {
        var downloadDocumentData = [];
        const readdownloadDocumentsDetailsRequest = req.app.locals.db.request();
        readdownloadDocumentsDetailsRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true))
        const downloadDocumentsDetailsResult = await readdownloadDocumentsDetailsRequest.execute("GetAssociateEmpanelmentFormDetailsByAssociateId");
        if (downloadDocumentsDetailsResult.recordset.length > 0) {
            var downloadDocumentsDetailsData = downloadDocumentsDetailsResult.recordset;
            for (let i = 0; i < downloadDocumentsDetailsData.length; i++) {
                var item = {
                    AssociateDocumentId: cryptoEngine.ParamEncrypt(downloadDocumentsDetailsData[i].AssociateDocumentId, true),
                    AssociateId: cryptoEngine.ParamEncrypt(downloadDocumentsDetailsData[i].AssociateId, true),
                    Name: downloadDocumentsDetailsData[i].Name,
                    FileName: downloadDocumentsDetailsData[i].FileName,
                    FileContent: downloadDocumentsDetailsData[i].FileContent,
                    FileContentType: downloadDocumentsDetailsData[i].FileContentType,
                };
                downloadDocumentData.push(item);
            }
        }

        if (downloadDocumentData != null) {
            var data = { DownloadEmpanelmentFormDocumentData: downloadDocumentData };
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.SaveAssociateUploadDetails = async (req, res) => {
    var { AssociateId, IsBSEFileUploaded, CanSendCredential } = req.body;
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    var errorMessage = "Error while saving associate upload details data...";
    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';
    // AppUserId = '414E2B5048745659672B513D';
    var Revision = 0;

    const revisionRequest = req.app.locals.db.request();
    revisionRequest.input("Id", cryptoEngine.ParamDecrypt(AssociateId, true))
    const revisionResult = await revisionRequest.execute("GetAssociateRevision");
    if (revisionResult.recordset.length > 0) {
        let dataItem = revisionResult.recordset[0];
        Revision = dataItem.Revision;
    }

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const request = transaction.request();
        request.input("Id", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("IsBSEFileUploaded", IsBSEFileUploaded)
        const result = await request.execute("UpdateAssociateUploadDetail");

        const flagRequest = transaction.request();
        flagRequest.input("Id", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("IsDownloadCompleted", true);
        const FlagResult = await flagRequest.execute("UpdateAssociateDownloadFlag");

        const requestStatus = transaction.request();
        requestStatus.input("Id", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("IsActive", true)
        const resultStatus = await requestStatus.execute("UpdateAssociateActive");

        if (req.files) {
            if (req.files.AssociateFormFile) {
                var fileTypeData = mime.lookup(req.files.AssociateFormFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                    .input("Name", "Associate Form")
                    .input("FileName", req.files.AssociateFormFile.name)
                    .input("FileContent", req.files.AssociateFormFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertAssociateDocument");
            }
        }

        // var AppUserId = "4B31474B714330623142773D";
        var LogMessage = "Active";
        const logRequest = transaction.request();
        logRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("AppUserId", UserId)
            .input("LogMessage", LogMessage)
            .input("IsPrimaryStatus", true)
            .input("Revision", Revision)
            .input("Indicator", 4);
        const LogResult = await logRequest.execute("InsertAssociateLog");

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

        res.status(500).send(errorMessage);
    }

    if (CanSendCredential == 'true') {
        try {
            var photoIdData;
            const readassociateRequest = req.app.locals.db.request();
            readassociateRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
            const readAssociateResult = await readassociateRequest.execute("GetAssociatePhotoIdDetailsByAssociateId");
            if (readAssociateResult.recordset.length > 0) {
                photoIdData = readAssociateResult.recordset[0];
            }

            const readAppUserDetailsRequest = req.app.locals.db.request();
            readAppUserDetailsRequest.input("UserName", photoIdData.PANCardNumber);
            const AppUserDetailsResult = await readAppUserDetailsRequest.execute("GetAppUserByUserName");
            if (AppUserDetailsResult.recordset.length > 0) {
                dataItem = AppUserDetailsResult.recordset[0];
                pin = cryptoEngine.Decrypt(dataItem.Pin, true);
            }

            var createdByData;
            const readRequest = req.app.locals.db.request();
            readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
            const readResult = await readRequest.execute("GetAssociatesEmailByAssociateId");

            if (readResult.recordset.length > 0) {
                createdByData = readResult.recordset[0];
            }

            var link = process.env.WEB_APP_LINK + '/signin';
            emailEngine.SendAssociateCredentials(createdByData.Email, photoIdData.Name, link, pin);
            res.status(200).send({ Status: true, Message: "Associate Upload Details Saved Successfully.", Data: { Id: AssociateId } });
        }
        catch (err) {
            console.log(err);
            res.status(500).send(errorMessage);
        }
    }
    else {
        res.status(200).send({ Status: true, Message: "", Data: { Id: AssociateId } });
    }
};

exports.GetAssociateIndividual = async (req, res) => {
    const AssociateId = req.params.Id;
    var errorMessage = "Error while getting associate individual data";
    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        const readResult = await readRequest.execute("GetAssociateIndividual");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                AssociateId: cryptoEngine.ParamEncrypt(dataItem.AssociateId, true),
                EntityTypeId: cryptoEngine.ParamEncrypt(dataItem.EntityTypeId, true),
                DateOfBirth: dataItem.DateOfBirth,
                Adult: dataItem.Adult,
                EntityTypeName: dataItem.EntityTypeName,
                ShowEUIN: dataItem.ShowEUIN
            };
        }
        res.status(200).send({ Status: (dataItem != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetTermsCondtionByAssociate = (req, res) => {
    var errorMessage = "Error while getting associate terms and conditions data";
    req.app.locals.db.request()
        .execute("GetAssociateTermsConditions", (err, result) => {
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
                        "TermsType": dataItem.TermsType,
                        "TermsContent": dataItem.TermsContent,

                    };
                }
                res.status(200).send({ Status: true, Message: "", Data: data });
            }
        });
};

exports.GetMenuOptions = async (req, res) => {
    const AssociateId = req.params.AssociateId;

    var errorMessage = "Error while getting menu options data"

    try {
        let menuData = [];
        let data;

        const readAppUserRequest = req.app.locals.db.request();
        readAppUserRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        const readAppUserResult = await readAppUserRequest.execute("GetAppUserByAssociateId");
        if (readAppUserResult.recordset.length > 0) {
            let appUserData = readAppUserResult.recordset[0];

            menuData = await appUserController.GetAppUserTypeMenuOptions(req, res, cryptoEngine.ParamEncrypt(appUserData.Id, true), 'Associate');

            data = {
                AppUserId: cryptoEngine.ParamEncrypt(appUserData.Id, true),
                MenuData: menuData
            };
        }

        res.status(200).send({ Status: true, Message: "", Data: data });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetNotification = async (req, res) => {
    var errorMessage = "Error while getting associate notification data";
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

exports.GetAssociateDocuments = async (req, res) => {
    const AssociateId = req.params.associateId;
    const Name = req.params.Name;
    const FileName = req.params.FileName;
    var errorMessage = "Error while getting associate documents data";
    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("associateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        readRequest.input("Name", Name);
        readRequest.input("FileName", FileName);
        const readResult = await readRequest.execute("GetAssociateDocumentsDetails");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                AssociateId: cryptoEngine.ParamEncrypt(dataItem.AssociateId, true),
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

exports.SaveAssociateRejection = async (req, res) => {
    var { AssociateId, RejectionMessage } = req.body;

    var IsResolved = false;
    // let AssociateCommercialData = JSON.parse(AssociateCommercialDetails);
    var errorMessage = "Error while saving associate rejection data...";
    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';
    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(AssociateId, true) !== 0) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("RejectionMessage", RejectionMessage)
                .input("IsResolved", IsResolved);

            const result = await request.execute("InsertAssociateRejection");
            Id = cryptoEngine.ParamEncrypt(result.output.Id, true);
        }


        await transaction.commit();
        res.status(200).send({ Status: true, Message: "", Data: AssociateId });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.SendNotificationSupervisor = async (req, res) => {
    var { AssociateId } = req.body;

    var errorMessage = "Error while saving notification...";

    try {
        var associateName = '';
        var dataItem;
        var notificationAppUsers = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        const readResult = await readRequest.execute("GetAssociatePhotoIdDetailsByAssociateId");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        if (dataItem != null) {
            const readRequest = req.app.locals.db.request();
            readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
            const readResult = await readRequest.execute("GetAssociateNotificationAppUser");
            if (readResult.recordset.length > 0) {
                notificationAppUsers = readResult.recordset;
            }
        }

        if (dataItem != null) {
            associateName = dataItem.Name;
            var title = "Verification of new Associate " + associateName + " is Pending.";
            var link = "associate-generalinfo/" + AssociateId + "/" + cryptoEngine.ParamEncrypt('verify', true);

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
            res.status(200).send({ Status: false, Message: "Invalid associate.", Data: null });
        }

    }
    catch (err) {
        console.log(err);

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        res.status(500).send(errorMessage);
    }
};

exports.SendSelfNotificationSupervisor = async (req, res) => {
    var { AssociateId } = req.body;
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);

    var errorMessage = "Error while saving notification...";

    try {
        var associateName = '';
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        const readResult = await readRequest.execute("GetAssociatePhotoIdDetailsByAssociateId");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        if (dataItem != null) {
            const readRequest = req.app.locals.db.request();
            readRequest.input("CreatedBy", dataItem.CreatedBy);
            const readResult = await readRequest.execute("GetAssociateSelfNotificationAppUser");
            if (readResult.recordset.length > 0) {
                notificationAppUsers = readResult.recordset;
            }
        }

        if (dataItem != null) {
            associateName = dataItem.Name;

            var title = "Associate" + " " + associateName + " " + "approved the self verification.";
            var link = "associate-generalinfo/" + AssociateId + "/" + cryptoEngine.ParamEncrypt('edit', true);


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

exports.UpdateAdminVerification = async (req, res) => {
    var { AssociateId, IsAdminVerified } = req.body;

    var errorMessage = "Error while saving associate rejection data...";

    // try {
    //     var photoIdData;
    //     const readassociateRequest = req.app.locals.db.request();
    //     readassociateRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
    //     const readAssociateResult = await readassociateRequest.execute("GetAssociatePhotoIdDetailsByAssociateId");
    //     if (readAssociateResult.recordset.length > 0) {
    //         photoIdData = readAssociateResult.recordset[0];
    //     }

    //     let UserName = photoIdData.PANCardNumber;
    //     let EntityDate = (photoIdData.DateOfIncorporation != null) ? photoIdData.DateOfIncorporation : photoIdData.DateOfBirth;

    //     let AppUserId = await appUserController.CreateAppUser(req, res, '414E2B5048745659672B513D', UserName, EntityDate, AssociateId, '414E2B5048745659672B513D', '414E2B5048745659672B513D');

    // } catch (err) {
    //     console.log(err);
    //     res.status(500).send(errorMessage);
    //     return;
    // }

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const request = transaction.request();
        request.input("Id", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("IsAdminVerified", IsAdminVerified);

        const result = await request.execute("UpdateAssociateAdminVerification");
        await transaction.commit();


        res.status(200).send({ Status: true, Message: "", Data: AssociateId });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetAssociateFormByAssociateId = async (req, res) => {
    const associateId = req.params.Id;
    var errorMessage = "Error while getting associate form details data";
    try {
        var associateFormata;

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true));
        const readResult = await readRequest.execute("GetAssociateFormByAssociateId");
        if (readResult.recordset.length > 0) {
            associateFormata = readResult.recordset[0];
        }

        if (associateFormata != null) {
            var data = {
                Id: cryptoEngine.ParamEncrypt(associateFormata.Id, true),
                Name: associateFormata.Name,
                IsBSEFileUploaded: associateFormata.IsBSEFileUploaded,
                AssociateFormFileName: associateFormata.AssociateFormFileName
            };
        }
        res.status(200).send({ Status: (associateFormata != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetAssociateViewLogByAssociateId = async (req, res) => {
    const AssociateId = req.params.Id;
    var errorMessage = "Error while getting associate log data";
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        const readResult = await readRequest.execute("GetAssociateLogByAssociateId");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    AssociateId: cryptoEngine.ParamEncrypt(dataList[i].AssociateId, true),
                    AppUserId: cryptoEngine.ParamEncrypt(dataList[i].AppUserId, true),
                    LogDate: dataList[i].LogDate,
                    LogMessage: dataList[i].LogMessage,
                    IsPrimaryStatus: dataList[i].IsPrimaryStatus,
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

exports.GetFilterAssociateStates = async (req, res) => {
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetFilterAssociateState");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].StateId, true),
                    Name: dataList[i].StateName,
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

exports.GetFilterAssociateCities = async (req, res) => {
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetFilterAssociateCities");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Name: dataList[i].City,
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

exports.GetFilterAssociates = async (req, res) => {
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetFilterAssociate");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    Name: dataList[i].AssociateName,
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

exports.GetFilterAssociateStatus = async (req, res) => {
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetFilterAssociateStatus");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Name: dataList[i].Status,
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

exports.GetAssociateExcelData = async (req, res) => {
    try {

        var AssociateExcelData = [];


        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetAssociateExcelData");
        if (readResult.recordset.length > 0) {

            let associateExcelData = readResult.recordset;

            for (let i = 0; i < associateExcelData.length; i++) {
                if (associateExcelData[i].DateOfIncorporation) {
                    associateExcelData[i].DateOfIncorporation = date.format(new Date(associateExcelData[i].DateOfIncorporation), 'DD-MM-YYYY');
                }
                else {
                    associateExcelData[i].DateOfIncorporation = '';
                }

                if (associateExcelData[i].DateOfBirth) {
                    associateExcelData[i].DateOfBirth = date.format(new Date(associateExcelData[i].DateOfBirth), 'DD-MM-YYYY');
                }
                else {
                    associateExcelData[i].DateOfBirth = '';
                }

                if (associateExcelData[i].GSTINValidDate) {
                    associateExcelData[i].GSTINValidDate = date.format(new Date(associateExcelData[i].GSTINValidDate), 'DD-MM-YYYY');

                }
                else {
                    associateExcelData[i].GSTINValidDate = '';
                }

                if (associateExcelData[i].ShopCertificateValidDate) {
                    associateExcelData[i].ShopCertificateValidDate = date.format(new Date(associateExcelData[i].ShopCertificateValidDate), 'DD-MM-YYYY');

                }
                else {
                    associateExcelData[i].ShopCertificateValidDate = '';
                }

                if (associateExcelData[i].ARNValidDate) {
                    associateExcelData[i].ARNValidDate = date.format(new Date(associateExcelData[i].ARNValidDate), 'DD-MM-YYYY');

                }
                else {
                    associateExcelData[i].ARNValidDate = '';
                }

                if (associateExcelData[i].EUINValidDate) {
                    associateExcelData[i].EUINValidDate = date.format(new Date(associateExcelData[i].EUINValidDate), 'DD-MM-YYYY');

                }
                else {
                    associateExcelData[i].EUINValidDate = '';
                }

                if (associateExcelData[i].RIAValidDate) {
                    associateExcelData[i].RIAValidDate = date.format(new Date(associateExcelData[i].RIAValidDate), 'DD-MM-YYYY');

                }
                else {
                    associateExcelData[i].RIAValidDate = '';
                }

                if (associateExcelData[i].NomineeDateOfBirth) {
                    associateExcelData[i].NomineeDateOfBirth = date.format(new Date(associateExcelData[i].NomineeDateOfBirth), 'DD-MM-YYYY');

                }
                else {
                    associateExcelData[i].NomineeDateOfBirth = '';
                }

                if (associateExcelData[i].NismVaValidDate) {
                    associateExcelData[i].NismVaValidDate = date.format(new Date(associateExcelData[i].NismVaValidDate), 'DD-MM-YYYY');

                }
                else {
                    associateExcelData[i].NismVaValidDate = '';
                }

                if (associateExcelData[i].NismXaValidDate) {
                    associateExcelData[i].NismXaValidDate = date.format(new Date(associateExcelData[i].NismXaValidDate), 'DD-MM-YYYY');

                }
                else {
                    associateExcelData[i].NismXaValidDate = '';
                }

                if (associateExcelData[i].NismXbValidDate) {
                    associateExcelData[i].NismXbValidDate = date.format(new Date(associateExcelData[i].NismXbValidDate), 'DD-MM-YYYY');

                }
                else {
                    associateExcelData[i].NismXbValidDate = '';
                }

                if (associateExcelData[i].CfpValidDate) {
                    associateExcelData[i].CfpValidDate = date.format(new Date(associateExcelData[i].CfpValidDate), 'DD-MM-YYYY');

                }
                else {
                    associateExcelData[i].CfpValidDate = '';
                }

                if (associateExcelData[i].CwmValidDate) {
                    associateExcelData[i].CwmValidDate = date.format(new Date(associateExcelData[i].CwmValidDate), 'DD-MM-YYYY');

                }
                else {
                    associateExcelData[i].CwmValidDate = '';
                }

                if (associateExcelData[i].CaValidDate) {
                    associateExcelData[i].CaValidDate = date.format(new Date(associateExcelData[i].CaValidDate), 'DD-MM-YYYY');

                }
                else {
                    associateExcelData[i].CaValidDate = '';
                }

                if (associateExcelData[i].CsValidDate) {
                    associateExcelData[i].CsValidDate = date.format(new Date(associateExcelData[i].CsValidDate), 'DD-MM-YYYY');

                }
                else {
                    associateExcelData[i].CsValidDate = '';
                }

                if (associateExcelData[i].CourseValidDate) {
                    associateExcelData[i].CourseValidDate = date.format(new Date(associateExcelData[i].CourseValidDate), 'DD-MM-YYYY');

                }
                else {
                    associateExcelData[i].CourseValidDate = '';
                }

                var item = {
                    AssociateName: associateExcelData[i].AssociateName,
                    EmployeeName: associateExcelData[i].EmployeeName,
                    Profession: associateExcelData[i].Profession,
                    EntityName: associateExcelData[i].EntityName,
                    AuthorisedPerson1: associateExcelData[i].AuthorisedPerson1,
                    Email1: associateExcelData[i].Email1,
                    Mobile1: associateExcelData[i].Mobile1,
                    PAN1: associateExcelData[i].PAN1,
                    AuthorisedPerson2: associateExcelData[i].AuthorisedPerson2,
                    Email2: associateExcelData[i].Email2,
                    Mobile2: associateExcelData[i].Mobile2,
                    PAN2: associateExcelData[i].PAN2,
                    AuthorisedPerson3: associateExcelData[i].AuthorisedPerson3,
                    Email3: associateExcelData[i].Email3,
                    Mobile3: associateExcelData[i].Mobile3,
                    PAN3: associateExcelData[i].PAN3,
                    PANCardNumber: associateExcelData[i].PANCardNumber,
                    AadharCardNumber: associateExcelData[i].AadharCardNumber,
                    DateOfBirth: associateExcelData[i].DateOfBirth,
                    DateOfIncorporation: associateExcelData[i].DateOfIncorporation,
                    GSTIN: associateExcelData[i].GSTIN,
                    GSTINValidDate: associateExcelData[i].GSTINValidDate,
                    ShopCertificateNumber: associateExcelData[i].ShopCertificateNumber,
                    ShopCertificateValidDate: associateExcelData[i].ShopCertificateValidDate,
                    TAN: associateExcelData[i].TAN,
                    PrimaryColor: associateExcelData[i].PrimaryColor,
                    SecondaryColor: associateExcelData[i].SecondaryColor,
                    ARNHolderName: associateExcelData[i].ARNHolderName,
                    ARN: associateExcelData[i].ARN,
                    ARNValidDate: associateExcelData[i].ARNValidDate,
                    EUINHolderName: associateExcelData[i].EUINHolderName,
                    EUIN: associateExcelData[i].EUIN,
                    EUINValidDate: associateExcelData[i].EUINValidDate,
                    RIAName: associateExcelData[i].RIAName,
                    RIANumber: associateExcelData[i].RIANumber,
                    RIAValidDate: associateExcelData[i].RIAValidDate,
                    AssociateCode: associateExcelData[i].AssociateCode,
                    BSEPassword: cryptoEngine.Decrypt(associateExcelData[i].BSEPassword, true),
                    Address1: associateExcelData[i].Address1,
                    Address2: associateExcelData[i].Address2,
                    Address3: associateExcelData[i].Address3,
                    City: associateExcelData[i].City,
                    State: associateExcelData[i].State,
                    Country: associateExcelData[i].Country,
                    PinCode: associateExcelData[i].PinCode,
                    MobileNumber: associateExcelData[i].MobileNumber,
                    TelephoneNumber: associateExcelData[i].TelephoneNumber,
                    Email: associateExcelData[i].Email,
                    EntityType: associateExcelData[i].EntityType,
                    NomineeName: associateExcelData[i].NomineeName,
                    NomineeDateOfBirth: associateExcelData[i].NomineeDateOfBirth,
                    NomineeAddress1: associateExcelData[i].NomineeAddress1,
                    NomineeAddress2: associateExcelData[i].NomineeAddress2,
                    NomineeAddress3: associateExcelData[i].NomineeAddress3,
                    NomineeCity: associateExcelData[i].NomineeCity,
                    NomineeState: associateExcelData[i].NomineeState,
                    NomineeCountry: associateExcelData[i].NomineeCountry,
                    NomineePinCode: associateExcelData[i].NomineePinCode,
                    NomineeMobileNumber: associateExcelData[i].NomineeMobileNumber,
                    NomineeEmail: associateExcelData[i].NomineeEmail,
                    GaurdianName: associateExcelData[i].GaurdianName,
                    GuardianRelation: associateExcelData[i].GuardianRelation,
                    GaurdianAddress1: associateExcelData[i].GaurdianAddress1,
                    GaurdianAddress2: associateExcelData[i].GaurdianAddress2,
                    GaurdianAddress3: associateExcelData[i].GaurdianAddress3,
                    GaurdianCity: associateExcelData[i].GaurdianCity,
                    GaurdianState: associateExcelData[i].GaurdianState,
                    GaurdianCountry: associateExcelData[i].GaurdianCountry,
                    GaurdianPinCode: associateExcelData[i].GaurdianPinCode,
                    GaurdianMobileNumber: associateExcelData[i].GaurdianMobileNumber,
                    GaurdianEmail: associateExcelData[i].GaurdianEmail,
                    CertificationType: associateExcelData[i].CertificationType,
                    NismVaNumber: associateExcelData[i].NismVaNumber,
                    NismVaValidDate: associateExcelData[i].NismVaValidDate,
                    GSTINValidDate: associateExcelData[i].GSTINValidDate,
                    NismXaNumber: associateExcelData[i].NismXaNumber,
                    NismXaValidDate: associateExcelData[i].NismXaValidDate,
                    NismXbNumber: associateExcelData[i].NismXbNumber,
                    NismXbValidDate: associateExcelData[i].NismXbValidDate,
                    CfpNumber: associateExcelData[i].CfpNumber,
                    CfpValidDate: associateExcelData[i].CfpValidDate,
                    CwmNumber: associateExcelData[i].CwmNumber,
                    CwmValidDate: associateExcelData[i].CwmValidDate,
                    CaNumber: associateExcelData[i].CaNumber,
                    CaValidDate: associateExcelData[i].CaValidDate,
                    CsNumber: associateExcelData[i].CsNumber,
                    CsValidDate: associateExcelData[i].CsValidDate,
                    CourseName: associateExcelData[i].CourseName,
                    CourseNumber: associateExcelData[i].CourseNumber,
                    CourseValidDate: associateExcelData[i].CourseValidDate,
                    IFSC: associateExcelData[i].IFSC,
                    BankName: associateExcelData[i].BankName,
                    Branch: associateExcelData[i].Branch,
                    MICR: associateExcelData[i].MICR,
                    BankAccountType: associateExcelData[i].BankAccountType,
                    AccountNumber: associateExcelData[i].AccountNumber,
                    RIAIFSC: associateExcelData[i].RIAIFSC,
                    RIABankName: associateExcelData[i].RIABankName,
                    RIABranch: associateExcelData[i].RIABranch,
                    RIAMICR: associateExcelData[i].RIAMICR,
                    RIABankAccountType: associateExcelData[i].RIABankAccountType,
                    RIAAccountNumber: associateExcelData[i].RIAAccountNumber,

                };
                AssociateExcelData.push(item);
            }
        }
        let data = {
            AssociateExcelReportData: AssociateExcelData,

        };

        let fileName = '';

        fileName = 'Associate_' + commonFunction.GetUniqueId() + '.xlsx';

        var reportPath = await excelEngine.CreateAssociateReport(data, fileName, 'reports');

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

exports.SendRejectionNotificationSupervisor = async (req, res) => {
    var { AssociateId } = req.body;
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);

    var errorMessage = "Error while saving notification...";

    try {
        var associateName = '';
        var dataItem;
        var reason = '';

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        const readResult = await readRequest.execute("GetAssociatePhotoIdDetailsByAssociateId");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        if (dataItem != null) {
            const readRequest = req.app.locals.db.request();
            readRequest.input("CreatedBy", dataItem.CreatedBy);
            const readResult = await readRequest.execute("GetAssociateSelfNotificationAppUser");
            if (readResult.recordset.length > 0) {
                notificationAppUsers = readResult.recordset;
            }
        }

        const reasonRequest = req.app.locals.db.request();
        reasonRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        const reasonResult = await reasonRequest.execute("GetAssociateRejectionByAssociateId");
        if (reasonResult.recordset.length > 0) {
            reasondata = reasonResult.recordset[0];
            reason = reasondata.RejectionMessage;
        }

        if (dataItem != null) {
            associateName = dataItem.Name;

            var title = "Associate" + " " + associateName + " " + "rejected the self verification";
            var link = "associate-generalinfo/" + AssociateId + "/" + cryptoEngine.ParamEncrypt('edit', true);
            var des = "Associate" + " " + associateName + " " + "rejected the self verification for the following reason - " + reason;


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
                // emailEngine.SendAssociateSelfRejection(notificationAppUsers[i].Email, associateName, reason);
            }

            res.status(200).send({ Status: true, Message: "Notification saved successfully.", Data: null });
        }
        else {
            res.status(200).send({ Status: false, Message: "Invalid associate.", Data: null });
        }
    }
    catch (err) {
        console.log(err);

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        res.status(500).send(errorMessage);
    }
};


exports.SendAssociateResetPasswordLink = async (req, res) => {
    var { AssociateId, Device, Browser, IpAddress } = req.body;
    var dataItem;
    var photoIdData;
    var errorMessage = "Error while sending associate reset password link...";

    const readRequest = req.app.locals.db.request();
    readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
    const readResult = await readRequest.execute("GetCommunicationDetailsByAssociateId");
    if (readResult.recordset.length > 0) {
        dataItem = readResult.recordset[0];
    }

    const readassociateRequest = req.app.locals.db.request();
    readassociateRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
    const readAssociateResult = await readassociateRequest.execute("GetAssociatePhotoIdDetailsByAssociateId");
    if (readAssociateResult.recordset.length > 0) {
        photoIdData = readAssociateResult.recordset[0];
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
        res.status(200).send({ Status: true, Message: "", Data: { Id: AssociateId } });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.ResendAssociateSelfVerificationEmail = async (req, res) => {
    var { AssociateId } = req.body;
    var errorMessage = "Error while sending associate self verification email...";

    try {
        var createdByData;
        var photoIdData;
        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        const readResult = await readRequest.execute("GetAssociatesEmailByAssociateId");

        if (readResult.recordset.length > 0) {
            createdByData = readResult.recordset[0];
        }

        const readNameRequest = req.app.locals.db.request();
        readNameRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        const readNameResult = await readNameRequest.execute("GetAssociatePhotoIdDetailsByAssociateId");
        if (readNameResult.recordset.length > 0) {
            photoIdData = readNameResult.recordset[0];
        }

        var timeStamp = new Date();
        var link = process.env.WEB_APP_LINK + '/associate-self-verification/' + AssociateId + '/' + cryptoEngine.ParamEncrypt('externalverify', true) + "/" + cryptoEngine.ParamEncrypt(timeStamp.toISOString(), true);
        emailEngine.SendAssociateVerification(createdByData.Email, photoIdData.Name, link);

        res.status(200).send({ Status: true, Message: "Associate Self Verification Email Sent Successfully.", Data: {} });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};