const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");
const emailEngine = require("../models/emailengine.model");
const bseService = require("../models/bseservice.model");
const mfuService = require("../models/mfuservice.model");
const lendboxService = require("../models/lendboxservice.model");
const mime = require('mime-types');
const util = require('node:util');
const date = require('date-and-time');
const notificationEngine = require("../models/notificationengine.model");
const notificationController = require('../controllers/notification.controller');
const appUserController = require('../controllers/appuser.controller');
const reports = require('../models/reports.model');
const exportData = require('../controllers/exportdata.controller');
const commonFunction = require('../models/commonfunction.model');
const luxon = require('luxon');
const xirr = require('node-irr');
const transactionPortfolioController = require('../controllers/transactionportfolio.controller');
const excelEngine = require("../models/excelengine.model");
const path = require('path');
const fileSystem = require("fs");
const appPool = require("../models/db.model");

exports.SaveClientIntroduction = async (req, res) => {
    var { Id, LeadId, AssociateId, EmployeeId, IsIndividual, IsNonIndividual, FamilyName, ClientFamily, ClientCompany } = req.body;

    let ClientFamilyData = JSON.parse(ClientFamily);
    let ClientCompanyData = JSON.parse(ClientCompany);

    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);

    var errorMessage = "Error while saving client introduction...";

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(Id, true) == 0) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("LeadId", cryptoEngine.ParamDecrypt(LeadId, true))
                .input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("IsIndividual", IsIndividual)
                .input("IsNonIndividual", IsNonIndividual)
                .input("FamilyName", FamilyName)
                .input("CreatedBy", UserId);
            const result = await request.execute("InsertClient");
            Id = cryptoEngine.ParamEncrypt(result.output.Id, true);
        }
        else {
            const request = transaction.request();
            request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                .input("LeadId", cryptoEngine.ParamDecrypt(LeadId, true))
                .input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
                .input("IsIndividual", IsIndividual)
                .input("IsNonIndividual", IsNonIndividual)
                .input("FamilyName", FamilyName);
            const result = await request.execute("UpdateClient");
        }

        const employeeDeleteRequest = transaction.request();
        employeeDeleteRequest.input("ClientId", cryptoEngine.ParamDecrypt(Id, true));
        const employeeDeleteResult = await employeeDeleteRequest.execute("DeleteClientAssociateEmployee");

        if (cryptoEngine.ParamDecrypt(EmployeeId, true) != 0) {
            const employeeRequest = transaction.request();
            employeeRequest.output("Id", msSql.BigInt)
                .input("ClientId", cryptoEngine.ParamDecrypt(Id, true))
                .input("EmployeeId", cryptoEngine.ParamDecrypt(EmployeeId, true));
            const employeeResult = await employeeRequest.execute("InsertClientAssociateEmployee");
        }

        for (let i = 0; i < ClientFamilyData.length; i++) {
            if (ClientFamilyData[i].IsRemoved == true) {
                const memberDeleteRequest = transaction.request();
                memberDeleteRequest.input("Id", cryptoEngine.ParamDecrypt(ClientFamilyData[i].Id, true));
                const memberDeleteResult = await memberDeleteRequest.execute("DeleteClientFamily");
            }
            else {
                if (cryptoEngine.ParamDecrypt(ClientFamilyData[i].Id, true) == 0) {
                    const memberRequest = transaction.request();
                    memberRequest.output("Id", msSql.BigInt)
                        .input("ClientId", cryptoEngine.ParamDecrypt(Id, true))
                        .input("Name", ClientFamilyData[i].Name)
                        .input("DateOfBirth", ClientFamilyData[i].DateOfBirth)
                        .input("RelationId", cryptoEngine.ParamDecrypt(ClientFamilyData[i].RelationId, true))
                        .input("TaxStatusId", cryptoEngine.ParamDecrypt(ClientFamilyData[i].TaxStatusId, true))
                        .input("TaxSlabId", cryptoEngine.ParamDecrypt(ClientFamilyData[i].TaxSlabId, true))
                        .input("LifeExpectancy", ClientFamilyData[i].LifeExpectancy)
                        .input("FatherName", ClientFamilyData[i].FatherName);
                    const memeberResult = await memberRequest.execute("InsertClientFamily");
                    ClientFamilyData[i].Id = cryptoEngine.ParamEncrypt(memeberResult.output.Id, true);
                }
                else {
                    const memberRequest = transaction.request();
                    memberRequest.input("Id", cryptoEngine.ParamDecrypt(ClientFamilyData[i].Id, true))
                        .input("ClientId", cryptoEngine.ParamDecrypt(Id, true))
                        .input("Name", ClientFamilyData[i].Name)
                        .input("DateOfBirth", ClientFamilyData[i].DateOfBirth)
                        .input("RelationId", cryptoEngine.ParamDecrypt(ClientFamilyData[i].RelationId, true))
                        .input("TaxStatusId", cryptoEngine.ParamDecrypt(ClientFamilyData[i].TaxStatusId, true))
                        .input("TaxSlabId", cryptoEngine.ParamDecrypt(ClientFamilyData[i].TaxSlabId, true))
                        .input("LifeExpectancy", ClientFamilyData[i].LifeExpectancy)
                        .input("FatherName", ClientFamilyData[i].FatherName);
                    const memeberResult = await memberRequest.execute("UpdateClientFamily");
                }
            }
        }

        for (let i = 0; i < ClientCompanyData.length; i++) {
            if (ClientCompanyData[i].IsRemoved == true) {
                const companyDeleteRequest = transaction.request();
                companyDeleteRequest.input("Id", cryptoEngine.ParamDecrypt(ClientCompanyData[i].Id, true));
                const companyDeleteResult = await companyDeleteRequest.execute("DeleteClientCompany");
            }
            else {
                if (cryptoEngine.ParamDecrypt(ClientCompanyData[i].Id, true) == 0) {
                    const companyRequest = transaction.request();
                    companyRequest.output("Id", msSql.BigInt)
                        .input("ClientId", cryptoEngine.ParamDecrypt(Id, true))
                        .input("Name", ClientCompanyData[i].Name)
                        .input("DateOfIncorporation", ClientCompanyData[i].DateOfIncorporation)
                        .input("TaxStatusId", cryptoEngine.ParamDecrypt(ClientCompanyData[i].TaxStatusId, true))
                        .input("TaxSlabId", cryptoEngine.ParamDecrypt(ClientCompanyData[i].TaxSlabId, true));
                    const companyResult = await companyRequest.execute("InsertClientCompany");
                    ClientCompanyData[i].Id = cryptoEngine.ParamEncrypt(companyResult.output.Id, true);
                }
                else {
                    const companyRequest = transaction.request();
                    companyRequest.input("Id", cryptoEngine.ParamDecrypt(ClientCompanyData[i].Id, true))
                        .input("ClientId", cryptoEngine.ParamDecrypt(Id, true))
                        .input("Name", ClientCompanyData[i].Name)
                        .input("DateOfIncorporation", ClientCompanyData[i].DateOfIncorporation)
                        .input("TaxStatusId", cryptoEngine.ParamDecrypt(ClientCompanyData[i].TaxStatusId, true))
                        .input("TaxSlabId", cryptoEngine.ParamDecrypt(ClientCompanyData[i].TaxSlabId, true));
                    const companyResult = await companyRequest.execute("UpdateClientCompany");
                }
            }

            const companyPersonDeleteRequest = transaction.request();
            companyPersonDeleteRequest.input("ClientCompanyId", cryptoEngine.ParamDecrypt(ClientCompanyData[i].Id, true));
            const companyPersonDeleteResult = await companyPersonDeleteRequest.execute("DeleteClientCompanyPerson");

            let member1 = ClientFamilyData.find(m => m.UID === ClientCompanyData[i].AuthorizedPerson1UID);
            const companyPersonRequest = transaction.request();
            companyPersonRequest.output("Id", msSql.BigInt)
                .input("ClientCompanyId", cryptoEngine.ParamDecrypt(ClientCompanyData[i].Id, true))
                .input("SerialNumber", 1)
                .input("ClientFamilyId", cryptoEngine.ParamDecrypt(member1.Id, true))
                .input("Designation", ClientCompanyData[i].AuthorizedPerson1Designation);
            const companyPersonResult = await companyPersonRequest.execute("InsertClientCompanyPerson");

            let member2 = ClientFamilyData.find(m => m.UID === ClientCompanyData[i].AuthorizedPerson2UID);
            const companyPerson2Request = transaction.request();
            companyPerson2Request.output("Id", msSql.BigInt)
                .input("ClientCompanyId", cryptoEngine.ParamDecrypt(ClientCompanyData[i].Id, true))
                .input("SerialNumber", 2)
                .input("ClientFamilyId", cryptoEngine.ParamDecrypt(member2.Id, true))
                .input("Designation", ClientCompanyData[i].AuthorizedPerson2Designation);
            const companyPerson2Result = await companyPerson2Request.execute("InsertClientCompanyPerson");
        }

        await transaction.commit();

        res.status(200).send({ Status: true, Message: "Client introduction saved successfully.", Data: { Id: Id, LeadId: LeadId } });
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

exports.SaveClientKycDetails = async (req, res) => {
    var { ClientId, ClientKycFamily, ClientKycCompany } = req.body;

    let ClientKycFamilyData = JSON.parse(ClientKycFamily);
    let ClientKycCompanyData = JSON.parse(ClientKycCompany);

    var errorMessage = "Error while saving client kyc details...";

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        const memberDeleteRequest = transaction.request();
        memberDeleteRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const memberDeleteResult = await memberDeleteRequest.execute("DeleteClientKycFamily");

        for (let i = 0; i < ClientKycFamilyData.length; i++) {
            const memberRequest = transaction.request();
            memberRequest.output("Id", msSql.BigInt)
                .input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                .input("ClientFamilyId", cryptoEngine.ParamDecrypt(ClientKycFamilyData[i].ClientFamilyId, true));
            const memeberResult = await memberRequest.execute("InsertClientKycFamily");
        }

        const companyDeleteRequest = transaction.request();
        companyDeleteRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const companyDeleteResult = await companyDeleteRequest.execute("DeleteClientKycCompany");

        for (let i = 0; i < ClientKycCompanyData.length; i++) {
            const memberRequest = transaction.request();
            memberRequest.output("Id", msSql.BigInt)
                .input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                .input("ClientCompanyId", cryptoEngine.ParamDecrypt(ClientKycCompanyData[i].ClientCompanyId, true));
            const memeberResult = await memberRequest.execute("InsertClientKycCompany");
        }

        const statusRequest = transaction.request();
        statusRequest.input("Id", cryptoEngine.ParamDecrypt(ClientId, true))
            .input("IsKycCompleted", true);
        const statusResult = await statusRequest.execute("UpdateKycCompletedStatus");

        await transaction.commit();

        res.status(200).send({ Status: true, Message: "Client kyc details saved successfully.", Data: { ClientId: ClientId } });
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

exports.GetClientById = async (req, res) => {
    const Id = req.params.Id;

    var errorMessage = "Error while fetching client...";

    try {
        var dataItem;
        var clientFamilyData = [];
        var clientCompanyData = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("Id", cryptoEngine.ParamDecrypt(Id, true));
        const readResult = await readRequest.execute("GetClientById");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        const readFamilyRequest = req.app.locals.db.request();
        readFamilyRequest.input("ClientId", cryptoEngine.ParamDecrypt(Id, true));
        const readFamilyResult = await readFamilyRequest.execute("GetClientFamilyByClientId");
        if (readFamilyResult.recordset.length > 0) {
            let familyData = readFamilyResult.recordset;
            for (let i = 0; i < familyData.length; i++) {
                let familyItem = {
                    Id: cryptoEngine.ParamEncrypt(familyData[i].Id, true),
                    ClientId: cryptoEngine.ParamEncrypt(familyData[i].ClientId, true),
                    Name: familyData[i].Name,
                    DateOfBirth: familyData[i].DateOfBirth,
                    RelationId: cryptoEngine.ParamEncrypt(familyData[i].RelationId, true),
                    TaxStatusId: cryptoEngine.ParamEncrypt(familyData[i].TaxStatusId, true),
                    TaxSlabId: cryptoEngine.ParamEncrypt(familyData[i].TaxSlabId, true),
                    LifeExpectancy: familyData[i].LifeExpectancy,
                    FatherName: familyData[i].FatherName,
                    IsSelf: familyData[i].IsSelf,
                };

                clientFamilyData.push(familyItem);
            }
        }

        const readCompanyRequest = req.app.locals.db.request();
        readCompanyRequest.input("ClientId", cryptoEngine.ParamDecrypt(Id, true));
        const readCompanyResult = await readCompanyRequest.execute("GetClientCompanyByClientId");
        if (readCompanyResult.recordset.length > 0) {
            let companyData = readCompanyResult.recordset;
            for (let i = 0; i < companyData.length; i++) {
                let companyItem = {
                    Id: cryptoEngine.ParamEncrypt(companyData[i].Id, true),
                    ClientId: cryptoEngine.ParamEncrypt(companyData[i].ClientId, true),
                    Name: companyData[i].Name,
                    DateOfIncorporation: companyData[i].DateOfIncorporation,
                    TaxStatusId: cryptoEngine.ParamEncrypt(companyData[i].TaxStatusId, true),
                    TaxSlabId: cryptoEngine.ParamEncrypt(companyData[i].TaxSlabId, true),
                    AuthorizedPerson1: cryptoEngine.ParamEncrypt(companyData[i].AuthorizedPerson1, true),
                    AuthorizedPerson1Designation: companyData[i].AuthorizedPerson1Designation,
                    AuthorizedPerson2: cryptoEngine.ParamEncrypt(companyData[i].AuthorizedPerson2, true),
                    AuthorizedPerson2Designation: companyData[i].AuthorizedPerson2Designation,
                };

                clientCompanyData.push(companyItem);
            }
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                LeadId: cryptoEngine.ParamEncrypt(dataItem.LeadId, true),
                AssociateId: cryptoEngine.ParamEncrypt(dataItem.AssociateId, true),
                IsIndividual: dataItem.IsIndividual,
                IsNonIndividual: dataItem.IsNonIndividual,
                FamilyName: dataItem.FamilyName,
                IntroductionStatus: dataItem.IntroductionStatus,
                AccountStatus: dataItem.AccountStatus,
                ComprehensiveStatus: dataItem.ComprehensiveStatus,
                TransactionStatus: dataItem.TransactionStatus,
                IsActive: dataItem.IsActive,
                IsAdminVerified: dataItem.IsAdminVerified,
                IsSelfVerified: dataItem.IsSelfVerified,
                Revision: dataItem.Revision,
                CreatedBy: cryptoEngine.ParamEncrypt(dataItem.CreatedBy, true),
                EmployeeId: cryptoEngine.ParamEncrypt(dataItem.EmployeeId, true),
                ClientFamily: clientFamilyData,
                ClientCompany: clientCompanyData,
            };
        }
        res.status(200).send({ Status: (dataItem != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientFamilyByClientId = async (req, res) => {

    const Id = req.params.ClientId;


    var errorMessage = "Error while fetching client...";

    try {

        var clientFamilyData = [];

        const readFamilyRequest = req.app.locals.db.request();
        readFamilyRequest.input("ClientId", cryptoEngine.ParamDecrypt(Id, true));
        const readFamilyResult = await readFamilyRequest.execute("GetClientFamilyDetailsByClientId");
        if (readFamilyResult.recordset.length > 0) {
            let familyData = readFamilyResult.recordset;
            for (let i = 0; i < familyData.length; i++) {
                let familyItem = {
                    Id: cryptoEngine.ParamEncrypt(familyData[i].Id, true),
                    ClientId: cryptoEngine.ParamEncrypt(familyData[i].ClientId, true),
                    Name: familyData[i].Name,
                    DateOfBirth: familyData[i].DateOfBirth,
                    RelationId: cryptoEngine.ParamEncrypt(familyData[i].RelationId, true),
                    TaxStatusId: cryptoEngine.ParamEncrypt(familyData[i].TaxStatusId, true),
                    TaxSlabId: cryptoEngine.ParamEncrypt(familyData[i].TaxSlabId, true),
                    LifeExpectancy: familyData[i].LifeExpectancy,
                    FatherName: familyData[i].FatherName,
                    BirthYear: familyData[i].BirthYear,
                    CurrentYear: familyData[i].CurrentYear,
                    GoalYear: familyData[i].GoalYear
                };

                clientFamilyData.push(familyItem);
            }
        }


        data = {

            ClientFamily: clientFamilyData
        };

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientKycFamilyByClient = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching client...";

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientKycFamilyByClientId");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    ClientFamilyId: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    Name: dataList[i].Name,
                    IsSelected: (dataList[i].ClientKycId == 0) ? false : true,
                    IsAccountCreated: dataList[i].IsAccountCreated
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

exports.GetClientKycCompanyByClient = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching client...";

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientKycCompanyByClientId");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    ClientCompanyId: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    Name: dataList[i].Name,
                    IsSelected: (dataList[i].ClientKycId == 0) ? false : true,
                    IsAccountCreated: dataList[i].IsAccountCreated
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

exports.GetClientKycProfilesByClient = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching client...";

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientKycProfiles");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    ClientFamilyId: cryptoEngine.ParamEncrypt(dataList[i].ClientFamilyId, true),
                    ClientCompanyId: cryptoEngine.ParamEncrypt(dataList[i].ClientCompanyId, true),
                    ClientId: cryptoEngine.ParamEncrypt(dataList[i].ClientId, true),
                    Name: dataList[i].Name,
                    Type: dataList[i].Type,
                    ProfileId: cryptoEngine.ParamEncrypt(dataList[i].ProfileId, true),
                    CommunicationId: cryptoEngine.ParamEncrypt(dataList[i].CommunicationId, true),
                    BankId: cryptoEngine.ParamEncrypt(dataList[i].BankId, true),
                    IsProfileCompleted: dataList[i].IsProfileCompleted,
                    IsCommunicationCompleted: dataList[i].IsCommunicationCompleted,
                    IsBankCompleted: dataList[i].IsBankCompleted
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

exports.GetClientFamilyById = async (req, res) => {
    const Id = req.params.Id;

    var errorMessage = "Error while fetching client...";

    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("Id", cryptoEngine.ParamDecrypt(Id, true));
        const readResult = await readRequest.execute("GetClientFamilyById");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                ClientId: cryptoEngine.ParamEncrypt(dataItem.ClientId, true),
                Name: dataItem.Name,
                DateOfBirth: dataItem.DateOfBirth,
                RelationId: cryptoEngine.ParamEncrypt(dataItem.RelationId, true),
                TaxStatusId: cryptoEngine.ParamEncrypt(dataItem.TaxStatusId, true),
                TaxSlabId: cryptoEngine.ParamEncrypt(dataItem.TaxSlabId, true),
                LifeExpectancy: dataItem.LifeExpectancy,
                RelationName: dataItem.RelationName,
                Age: dataItem.Age,
                TaxStatusName: dataItem.TaxStatusName,
                FatherName: dataItem.FatherName,
                TaxStatusCode: dataItem.TaxStatusCode,
            };
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientCompanyById = async (req, res) => {
    const Id = req.params.Id;

    var errorMessage = "Error while fetching client...";

    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("Id", cryptoEngine.ParamDecrypt(Id, true));
        const readResult = await readRequest.execute("GetClientCompanyById");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                ClientId: cryptoEngine.ParamEncrypt(dataItem.ClientId, true),
                Name: dataItem.Name,
                DateOfIncorporation: dataItem.DateOfIncorporation,
                TaxStatusId: cryptoEngine.ParamEncrypt(dataItem.TaxStatusId, true),
                TaxSlabId: cryptoEngine.ParamEncrypt(dataItem.TaxSlabId, true),
                TaxStatusName: dataItem.TaxStatusName,
                TaxStatusCode: dataItem.TaxStatusCode,
            };
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientGuardiansByClient = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching client...";

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetGuardians");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    ClientFamilyId: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    Name: dataList[i].Name,
                    DateOfBirth: dataList[i].DateOfBirth,
                    RelationId: cryptoEngine.ParamEncrypt(dataList[i].RelationId, true),
                    TaxStatusId: cryptoEngine.ParamEncrypt(dataList[i].TaxStatusId, true),
                    TaxSlabId: cryptoEngine.ParamEncrypt(dataList[i].TaxSlabId, true),
                    LifeExpectancy: dataList[i].LifeExpectancy,
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

exports.GetClientKycProfileFamily = async (req, res) => {
    const Id = req.params.ClientFamilyId;

    var errorMessage = "Error while fetching client...";

    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientFamilyId", cryptoEngine.ParamDecrypt(Id, true));
        const readResult = await readRequest.execute("GetClientKycProfileFamily");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                ClientFamilyId: cryptoEngine.ParamEncrypt(dataItem.ClientFamilyId, true),
                ClientId: cryptoEngine.ParamEncrypt(dataItem.ClientId, true),
                Name: dataItem.Name,
                DateOfBirth: dataItem.DateOfBirth,
                RelationId: cryptoEngine.ParamEncrypt(dataItem.RelationId, true),
                TaxStatusId: cryptoEngine.ParamEncrypt(dataItem.TaxStatusId, true),
                TaxSlabId: cryptoEngine.ParamEncrypt(dataItem.TaxSlabId, true),
                LifeExpectancy: dataItem.LifeExpectancy,
                ClientKycProfileId: cryptoEngine.ParamEncrypt(dataItem.ClientKycProfileId, true),
                PANCardNumber: dataItem.PANCardNumber,
                CKYCNumber: dataItem.CKYCNumber,
                AadharCardNumber: dataItem.AadharCardNumber,
                CountryCode: dataItem.CountryCode,
                MobileNumber: dataItem.MobileNumber,
                Email: dataItem.Email,
                PlaceOfBirth: dataItem.PlaceOfBirth,
                CountryOfBirth: dataItem.CountryOfBirth,
                EmployerName: dataItem.EmployerName,
                NetWorth: dataItem.NetWorth,
                NetWorthDate: dataItem.NetWorthDate,
                PlaceOfIncorporation: dataItem.PlaceOfIncorporation,
                CountryOfIncorporation: dataItem.CountryOfIncorporation,
                NatureOfBusiness: dataItem.NatureOfBusiness,
                KycStatusId: cryptoEngine.ParamEncrypt(dataItem.KycStatusId, true),
                OccupationId: cryptoEngine.ParamEncrypt(dataItem.OccupationId, true),
                GrossAnnualIncomeId: cryptoEngine.ParamEncrypt(dataItem.GrossAnnualIncomeId, true),
                WealthSourceId: cryptoEngine.ParamEncrypt(dataItem.WealthSourceId, true),
                FamilyGuardianId: cryptoEngine.ParamEncrypt(dataItem.FamilyGuardianId, true),
                FamilyGuardianRelationId: cryptoEngine.ParamEncrypt(dataItem.FamilyGuardianRelationId, true),
                GenderId: cryptoEngine.ParamEncrypt(dataItem.GenderId, true),
                MobileSelfDeclarationId: cryptoEngine.ParamEncrypt(dataItem.MobileSelfDeclarationId, true),
                EmailSelfDeclarationId: cryptoEngine.ParamEncrypt(dataItem.EmailSelfDeclarationId, true),
                IsPoliticallyExposed: dataItem.IsPoliticallyExposed,
                Age: dataItem.Age,
                BirthCertificateFileName: dataItem.BirthCertificateFileName,
                MemberPanFileName: dataItem.MemberPanFileName,
                MemberKycFileName: dataItem.MemberKycFileName,
                TaxStatusCode: dataItem.TaxStatusCode,
            };
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientKycProfileCompany = async (req, res) => {
    const Id = req.params.ClientCompanyId;

    var errorMessage = "Error while fetching client...";

    try {
        var dataItem;
        var ClientKycProfileUbo = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientCompanyId", cryptoEngine.ParamDecrypt(Id, true));
        const readResult = await readRequest.execute("GetClientKycProfileCompany");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        if (dataItem != null) {
            const readUboRequest = req.app.locals.db.request();
            readUboRequest.input("ClientKycProfileId", dataItem.ClientKycProfileId);
            const readUboResult = await readUboRequest.execute("GetClientKycProfileUbo");
            if (readUboResult.recordset.length > 0) {
                let uboDataList = readUboResult.recordset;

                for (let i = 0; i < uboDataList.length; i++) {
                    ClientKycProfileUbo.push({ ClientFamilyId: cryptoEngine.ParamEncrypt(uboDataList[i].ClientFamilyId, true) });
                }
            }
        }

        var data;
        if (dataItem != null) {
            data = {
                ClientCompanyId: cryptoEngine.ParamEncrypt(dataItem.ClientCompanyId, true),
                ClientId: cryptoEngine.ParamEncrypt(dataItem.ClientId, true),
                Name: dataItem.Name,
                DateOfIncorporation: dataItem.DateOfIncorporation,
                TaxStatusId: cryptoEngine.ParamEncrypt(dataItem.TaxStatusId, true),
                TaxSlabId: cryptoEngine.ParamEncrypt(dataItem.TaxSlabId, true),
                ClientKycProfileId: cryptoEngine.ParamEncrypt(dataItem.ClientKycProfileId, true),
                PANCardNumber: dataItem.PANCardNumber,
                CKYCNumber: dataItem.CKYCNumber,
                AadharCardNumber: dataItem.AadharCardNumber,
                CountryCode: dataItem.CountryCode,
                MobileNumber: dataItem.MobileNumber,
                Email: dataItem.Email,
                PlaceOfBirth: dataItem.PlaceOfBirth,
                CountryOfBirth: dataItem.CountryOfBirth,
                EmployerName: dataItem.EmployerName,
                NetWorth: dataItem.NetWorth,
                NetWorthDate: dataItem.NetWorthDate,
                PlaceOfIncorporation: dataItem.PlaceOfIncorporation,
                CountryOfIncorporation: dataItem.CountryOfIncorporation,
                NatureOfBusiness: dataItem.NatureOfBusiness,
                KycStatusId: cryptoEngine.ParamEncrypt(dataItem.KycStatusId, true),
                OccupationId: cryptoEngine.ParamEncrypt(dataItem.OccupationId, true),
                GrossAnnualIncomeId: cryptoEngine.ParamEncrypt(dataItem.GrossAnnualIncomeId, true),
                WealthSourceId: cryptoEngine.ParamEncrypt(dataItem.WealthSourceId, true),
                IsPoliticallyExposed: dataItem.IsPoliticallyExposed,
                ClientKycProfileUbo: ClientKycProfileUbo,
                CompanyPanFileName: dataItem.CompanyPanFileName,
                CompayKycFileName: dataItem.CompayKycFileName,
                TaxStatusCode: dataItem.TaxStatusCode,
                MobileSelfDeclarationId: cryptoEngine.ParamEncrypt(dataItem.MobileSelfDeclarationId, true),
                EmailSelfDeclarationId: cryptoEngine.ParamEncrypt(dataItem.EmailSelfDeclarationId, true),
            };
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.SaveClientKycProfile = async (req, res) => {
    var { Id, ClientId, ClientFamilyId, ClientCompanyId, PANCardNumber, CKYCNumber, AadharCardNumber, CountryCode, MobileNumber, Email, PlaceOfBirth, CountryOfBirth, EmployerName, NetWorth, NetWorthDate, PlaceOfIncorporation, CountryOfIncorporation, NatureOfBusiness, KycStatusId, TaxStatusId, OccupationId, GrossAnnualIncomeId, WealthSourceId, MobileSelfDeclarationId, EmailSelfDeclarationId, GenderId, GuardianId, GuardianRelationId, ClientKycProfileUbo, IsPoliticallyExposed } = req.body;

    // console.log(NetWorthDate);

    let ClientKycProfileUboData = JSON.parse(ClientKycProfileUbo);

    var IsMinorProfile = false;

    if (cryptoEngine.ParamDecrypt(ClientFamilyId, true) != 0) {
        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientFamilyId", cryptoEngine.ParamDecrypt(ClientFamilyId, true));
        const readResult = await readRequest.execute("GetClientKycProfileFamily");
        if (readResult.recordset.length > 0) {
            let dataItem = readResult.recordset[0];

            IsMinorProfile = (dataItem.Age < 18);
        }
    }

    if (IsMinorProfile == false) {
        const readCheckRequest = req.app.locals.db.request();
        readCheckRequest.input("Id", cryptoEngine.ParamDecrypt(Id, true))
            .input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
            .input("PANCardNumber", PANCardNumber);
        const readCheckResult = await readCheckRequest.execute("CheckDuplicateClientRecord");
        if (readCheckResult.recordset.length > 0) {
            // res.status(200).send({ Status: false, Message: 'Client profile already exists with PAN card number ' + PANCardNumber });
            // return;
        }
    }

    var errorMessage = "Error while saving client profile...";

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(Id, true) == 0) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                .input("PANCardNumber", PANCardNumber)
                .input("CKYCNumber", CKYCNumber)
                .input("AadharCardNumber", AadharCardNumber)
                .input("CountryCode", CountryCode)
                .input("MobileNumber", MobileNumber)
                .input("Email", Email)
                .input("PlaceOfBirth", PlaceOfBirth)
                .input("CountryOfBirth", CountryOfBirth)
                .input("EmployerName", EmployerName)
                .input("NetWorth", NetWorth)
                .input("NetWorthDate", (NetWorthDate == "null") ? null : NetWorthDate)
                .input("PlaceOfIncorporation", PlaceOfIncorporation)
                .input("CountryOfIncorporation", CountryOfIncorporation)
                .input("NatureOfBusiness", NatureOfBusiness)
                .input("KycStatusId", cryptoEngine.ParamDecrypt(KycStatusId, true))
                .input("IsPoliticallyExposed", IsPoliticallyExposed);
            const result = await request.execute("InsertClientKycProfile");
            Id = cryptoEngine.ParamEncrypt(result.output.Id, true);
        }
        else {
            const request = transaction.request();
            request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                .input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                .input("PANCardNumber", PANCardNumber)
                .input("CKYCNumber", CKYCNumber)
                .input("AadharCardNumber", AadharCardNumber)
                .input("CountryCode", CountryCode)
                .input("MobileNumber", MobileNumber)
                .input("Email", Email)
                .input("PlaceOfBirth", PlaceOfBirth)
                .input("CountryOfBirth", CountryOfBirth)
                .input("EmployerName", EmployerName)
                .input("NetWorth", NetWorth)
                .input("NetWorthDate", (NetWorthDate == "null") ? null : NetWorthDate)
                .input("PlaceOfIncorporation", PlaceOfIncorporation)
                .input("CountryOfIncorporation", CountryOfIncorporation)
                .input("NatureOfBusiness", NatureOfBusiness)
                .input("KycStatusId", cryptoEngine.ParamDecrypt(KycStatusId, true))
                .input("IsPoliticallyExposed", IsPoliticallyExposed);
            const result = await request.execute("UpdateClientKycProfile");
        }

        if (cryptoEngine.ParamDecrypt(ClientFamilyId, true) != 0) {
            const employeeRequest = transaction.request();
            employeeRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true))
                .input("ClientFamilyId", cryptoEngine.ParamDecrypt(ClientFamilyId, true));
            const employeeResult = await employeeRequest.execute("InsertClientKycProfileFamily");

            const taxRequest = transaction.request();
            taxRequest.input("ClientFamilyId", cryptoEngine.ParamDecrypt(ClientFamilyId, true))
                .input("TaxStatusId", cryptoEngine.ParamDecrypt(TaxStatusId, true));
            const taxResult = await taxRequest.execute("UpdateClientFamilyTaxStatus");

            const genderRequest = transaction.request();
            genderRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true))
                .input("GenderId", cryptoEngine.ParamDecrypt(GenderId, true));
            const genderResult = await genderRequest.execute("InsertClientKycProfileGender");

            if (cryptoEngine.ParamDecrypt(GuardianId, true) != 0) {
                const guardianRequest = transaction.request();
                guardianRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("ClientFamilyId", cryptoEngine.ParamDecrypt(GuardianId, true))
                    .input("RelationId", cryptoEngine.ParamDecrypt(GuardianRelationId, true));
                const guardianResult = await guardianRequest.execute("InsertClientKycProfileGuardian");
            }

            const statusRequest = transaction.request();
            statusRequest.input("ClientFamilyId", cryptoEngine.ParamDecrypt(ClientFamilyId, true))
                .input("IsProfileCompleted", true);
            const statusResult = await statusRequest.execute("UpdateKycFamilyProfileCompletedStatus");
        }

        if (cryptoEngine.ParamDecrypt(ClientCompanyId, true) != 0) {
            const employeeRequest = transaction.request();
            employeeRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true))
                .input("ClientCompanyId", cryptoEngine.ParamDecrypt(ClientCompanyId, true));
            const employeeResult = await employeeRequest.execute("InsertClientKycProfileCompany");

            const taxRequest = transaction.request();
            taxRequest.input("ClientCompanyId", cryptoEngine.ParamDecrypt(ClientCompanyId, true))
                .input("TaxStatusId", cryptoEngine.ParamDecrypt(TaxStatusId, true));
            const taxResult = await taxRequest.execute("UpdateClientCompanyTaxStatus");

            const deleteUboRequest = transaction.request();
            deleteUboRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true));
            const deleteUboResult = await deleteUboRequest.execute("DeleteClientKycProfileUbo");

            for (let i = 0; i < ClientKycProfileUboData.length; i++) {
                const memberUboRequest = transaction.request();
                memberUboRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("ClientFamilyId", cryptoEngine.ParamDecrypt(ClientKycProfileUboData[i].ClientFamilyId, true));
                const memeberUboResult = await memberUboRequest.execute("InsertClientKycProfileUbo");
            }

            const statusRequest = transaction.request();
            statusRequest.input("ClientCompanyId", cryptoEngine.ParamDecrypt(ClientCompanyId, true))
                .input("IsProfileCompleted", true);
            const statusResult = await statusRequest.execute("UpdateKycCompanyProfileCompletedStatus");
        }

        const deleteMobileRequest = transaction.request();
        deleteMobileRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true));
        const deleteMobileResult = await deleteMobileRequest.execute("DeleteClientKycProfileMobileDeclaration");

        if (cryptoEngine.ParamDecrypt(MobileSelfDeclarationId, true) != 0) {
            const mobileRequest = transaction.request();
            mobileRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true))
                .input("SelfDeclarationId", cryptoEngine.ParamDecrypt(MobileSelfDeclarationId, true));
            const mobileResult = await mobileRequest.execute("InsertClientKycProfileMobileDeclaration");
        }

        const deleteEmailRequest = transaction.request();
        deleteEmailRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true));
        const deleteEmailResult = await deleteEmailRequest.execute("DeleteClientKycProfileEmailDeclaration");

        if (cryptoEngine.ParamDecrypt(EmailSelfDeclarationId, true) != 0) {
            const emailRequest = transaction.request();
            emailRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true))
                .input("SelfDeclarationId", cryptoEngine.ParamDecrypt(EmailSelfDeclarationId, true));
            const emailResult = await emailRequest.execute("InsertClientKycProfileEmailDeclaration");
        }

        const deleteOccupationRequest = transaction.request();
        deleteOccupationRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true));
        const deleteOccupationResult = await deleteOccupationRequest.execute("DeleteClientKycProfileOccupation");

        if (cryptoEngine.ParamDecrypt(OccupationId, true) != 0) {
            const occupationRequest = transaction.request();
            occupationRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true))
                .input("OccupationId", cryptoEngine.ParamDecrypt(OccupationId, true));
            const occupationResult = await occupationRequest.execute("InsertClientKycProfileOccupation");
        }

        const deleteGAIRequest = transaction.request();
        deleteGAIRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true));
        const deleteGAIResult = await deleteGAIRequest.execute("DeleteClientKycProfileGrossAnnualIncome");

        if (cryptoEngine.ParamDecrypt(GrossAnnualIncomeId, true) != 0) {
            const gaiRequest = transaction.request();
            gaiRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true))
                .input("GrossAnnualIncomeId", cryptoEngine.ParamDecrypt(GrossAnnualIncomeId, true));
            const gaiResult = await gaiRequest.execute("InsertClientKycProfileGrossAnnualIncome");
        }

        const deleteWSRequest = transaction.request();
        deleteWSRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true));
        const deleteWSResult = await deleteWSRequest.execute("DeleteClientKycProfileWealthSource");

        if (cryptoEngine.ParamDecrypt(WealthSourceId, true) != 0) {
            const wsRequest = transaction.request();
            wsRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true))
                .input("WealthSourceId", cryptoEngine.ParamDecrypt(WealthSourceId, true));
            const wsResult = await wsRequest.execute("InsertClientKycProfileWealthSource");
        }

        if (req.files) {
            if (req.files.BirthCertificateFile) {
                var fileTypeData = mime.lookup(req.files.BirthCertificateFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "Birth Certificate")
                    .input("FileName", req.files.BirthCertificateFile.name)
                    .input("FileContent", req.files.BirthCertificateFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertClientKycProfileDocument");
            }

            if (req.files.MemberPanCardFile) {
                var fileTypeData = mime.lookup(req.files.MemberPanCardFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "Member PAN Card")
                    .input("FileName", req.files.MemberPanCardFile.name)
                    .input("FileContent", req.files.MemberPanCardFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertClientKycProfileDocument");
            }

            if (req.files.MemberKycFile) {
                var fileTypeData = mime.lookup(req.files.MemberKycFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "Member KYC")
                    .input("FileName", req.files.MemberKycFile.name)
                    .input("FileContent", req.files.MemberKycFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertClientKycProfileDocument");
            }

            if (req.files.CompanyPanCardFile) {
                var fileTypeData = mime.lookup(req.files.CompanyPanCardFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "Company PAN Card")
                    .input("FileName", req.files.CompanyPanCardFile.name)
                    .input("FileContent", req.files.CompanyPanCardFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertClientKycProfileDocument");
            }

            if (req.files.CompanyKycFile) {
                var fileTypeData = mime.lookup(req.files.CompanyKycFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true))
                    .input("Name", "Company KYC")
                    .input("FileName", req.files.CompanyKycFile.name)
                    .input("FileContent", req.files.CompanyKycFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertClientKycProfileDocument");
            }
        }

        await transaction.commit();

        res.status(200).send({ Status: true, Message: "Client kyc profile saved successfully.", Data: { Id: Id } });
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

exports.GetClientKycAddressFamily = async (req, res) => {
    const Id = req.params.ClientFamilyId;

    var errorMessage = "Error while fetching client...";

    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientFamilyId", cryptoEngine.ParamDecrypt(Id, true));
        const readResult = await readRequest.execute("GetClientKycAddressFamily");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                ClientFamilyId: cryptoEngine.ParamEncrypt(dataItem.ClientFamilyId, true),
                ClientId: cryptoEngine.ParamEncrypt(dataItem.ClientId, true),
                Name: dataItem.Name,
                DateOfBirth: dataItem.DateOfBirth,
                RelationId: cryptoEngine.ParamEncrypt(dataItem.RelationId, true),
                TaxStatusId: cryptoEngine.ParamEncrypt(dataItem.TaxStatusId, true),
                TaxSlabId: cryptoEngine.ParamEncrypt(dataItem.TaxSlabId, true),
                LifeExpectancy: dataItem.LifeExpectancy,
                ClientKycProfileId: cryptoEngine.ParamEncrypt(dataItem.ClientKycProfileId, true),
                ClientKycLocalAddressId: cryptoEngine.ParamEncrypt(dataItem.ClientKycLocalAddressId, true),
                LocalAddressTypeId: cryptoEngine.ParamEncrypt(dataItem.LocalAddressTypeId, true),
                LocalAddress1: dataItem.LocalAddress1,
                LocalAddress2: dataItem.LocalAddress2,
                LocalAddress3: dataItem.LocalAddress3,
                LocalCity: dataItem.LocalCity,
                LocalCountryId: cryptoEngine.ParamEncrypt(dataItem.LocalCountryId, true),
                LocalStateId: cryptoEngine.ParamEncrypt(dataItem.LocalStateId, true),
                LocalPinCode: dataItem.LocalPinCode,
                LocalIsSameForAll: dataItem.LocalIsSameForAll,
                LocalUseGuardianAddress: dataItem.LocalUseGuardianAddress,
                ClientKycForeignAddressId: cryptoEngine.ParamEncrypt(dataItem.ClientKycForeignAddressId, true),
                ForeignAddressTypeId: cryptoEngine.ParamEncrypt(dataItem.ForeignAddressTypeId, true),
                ForeignAddress1: dataItem.ForeignAddress1,
                ForeignAddress2: dataItem.ForeignAddress2,
                ForeignAddress3: dataItem.ForeignAddress3,
                ForeignCity: dataItem.ForeignCity,
                ForeignCountryId: cryptoEngine.ParamEncrypt(dataItem.ForeignCountryId, true),
                ForeignStateId: cryptoEngine.ParamEncrypt(dataItem.ForeignStateId, true),
                ForeignPinCode: dataItem.ForeignPinCode,
                LocalAddressFileName: dataItem.LocalAddressFileName,
                foreignAddressFileName: dataItem.foreignAddressFileName,
            };
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientKycAddressCompany = async (req, res) => {
    const Id = req.params.ClientCompanyId;

    var errorMessage = "Error while fetching client...";

    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientCompanyId", cryptoEngine.ParamDecrypt(Id, true));
        const readResult = await readRequest.execute("GetClientKycAddressCompany");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                ClientCompanyId: cryptoEngine.ParamEncrypt(dataItem.ClientCompanyId, true),
                ClientId: cryptoEngine.ParamEncrypt(dataItem.ClientId, true),
                Name: dataItem.Name,
                DateOfIncorporation: dataItem.DateOfIncorporation,
                TaxStatusId: cryptoEngine.ParamEncrypt(dataItem.TaxStatusId, true),
                TaxSlabId: cryptoEngine.ParamEncrypt(dataItem.TaxSlabId, true),
                ClientKycProfileId: cryptoEngine.ParamEncrypt(dataItem.ClientKycProfileId, true),
                ClientKycLocalAddressId: cryptoEngine.ParamEncrypt(dataItem.ClientKycLocalAddressId, true),
                LocalAddressTypeId: cryptoEngine.ParamEncrypt(dataItem.LocalAddressTypeId, true),
                LocalAddress1: dataItem.LocalAddress1,
                LocalAddress2: dataItem.LocalAddress2,
                LocalAddress3: dataItem.LocalAddress3,
                LocalCity: dataItem.LocalCity,
                LocalCountryId: cryptoEngine.ParamEncrypt(dataItem.LocalCountryId, true),
                LocalStateId: cryptoEngine.ParamEncrypt(dataItem.LocalStateId, true),
                LocalPinCode: dataItem.LocalPinCode,
                LocalIsSameForAll: dataItem.LocalIsSameForAll,
                LocalUseGuardianAddress: dataItem.LocalUseGuardianAddress,
                ClientKycForeignAddressId: cryptoEngine.ParamEncrypt(dataItem.ClientKycForeignAddressId, true),
                ForeignAddressTypeId: cryptoEngine.ParamEncrypt(dataItem.ForeignAddressTypeId, true),
                ForeignAddress1: dataItem.ForeignAddress1,
                ForeignAddress2: dataItem.ForeignAddress2,
                ForeignAddress3: dataItem.ForeignAddress3,
                ForeignCity: dataItem.ForeignCity,
                ForeignCountryId: cryptoEngine.ParamEncrypt(dataItem.ForeignCountryId, true),
                ForeignStateId: cryptoEngine.ParamEncrypt(dataItem.ForeignStateId, true),
                ForeignPinCode: dataItem.ForeignPinCode,
                LocalAddressFileName: dataItem.LocalAddressFileName,
                foreignAddressFileName: dataItem.foreignAddressFileName,
            };
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.SaveClientKycAddress = async (req, res) => {
    var { ClientKycLocalAddress, ClientKycForeignAddress } = req.body;

    let ClientKycLocalAddressData = JSON.parse(ClientKycLocalAddress);
    let ClientKycForeignAddressData = JSON.parse(ClientKycForeignAddress);

    var errorMessage = "Error while saving client address...";

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(ClientKycLocalAddressData.Id, true) == 0) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("ClientKycProfileId", cryptoEngine.ParamDecrypt(ClientKycLocalAddressData.ClientKycProfileId, true))
                .input("AddressTypeId", cryptoEngine.ParamDecrypt(ClientKycLocalAddressData.AddressTypeId, true))
                .input("Address1", ClientKycLocalAddressData.Address1)
                .input("Address2", ClientKycLocalAddressData.Address2)
                .input("Address3", ClientKycLocalAddressData.Address3)
                .input("City", ClientKycLocalAddressData.City)
                .input("CountryId", cryptoEngine.ParamDecrypt(ClientKycLocalAddressData.CountryId, true))
                .input("StateId", cryptoEngine.ParamDecrypt(ClientKycLocalAddressData.StateId, true))
                .input("PinCode", ClientKycLocalAddressData.PinCode)
                .input("IsSameForAll", ClientKycLocalAddressData.IsSameForAll)
                .input("UseGuardianAddress", ClientKycLocalAddressData.UseGuardianAddress);
            const result = await request.execute("InsertClientKycLocalAddress");
            ClientKycLocalAddressData.Id = cryptoEngine.ParamEncrypt(result.output.Id, true);
        }
        else {
            const request = transaction.request();
            request.input("Id", cryptoEngine.ParamDecrypt(ClientKycLocalAddressData.Id, true))
                .input("ClientKycProfileId", cryptoEngine.ParamDecrypt(ClientKycLocalAddressData.ClientKycProfileId, true))
                .input("AddressTypeId", cryptoEngine.ParamDecrypt(ClientKycLocalAddressData.AddressTypeId, true))
                .input("Address1", ClientKycLocalAddressData.Address1)
                .input("Address2", ClientKycLocalAddressData.Address2)
                .input("Address3", ClientKycLocalAddressData.Address3)
                .input("City", ClientKycLocalAddressData.City)
                .input("CountryId", cryptoEngine.ParamDecrypt(ClientKycLocalAddressData.CountryId, true))
                .input("StateId", cryptoEngine.ParamDecrypt(ClientKycLocalAddressData.StateId, true))
                .input("PinCode", ClientKycLocalAddressData.PinCode)
                .input("IsSameForAll", ClientKycLocalAddressData.IsSameForAll)
                .input("UseGuardianAddress", ClientKycLocalAddressData.UseGuardianAddress);
            const result = await request.execute("UpdateClientKycLocalAddress");
        }

        if (ClientKycForeignAddressData.Address1 != '') {
            if (cryptoEngine.ParamDecrypt(ClientKycForeignAddressData.Id, true) == 0) {
                const request = transaction.request();
                request.output("Id", msSql.BigInt)
                    .input("ClientKycProfileId", cryptoEngine.ParamDecrypt(ClientKycForeignAddressData.ClientKycProfileId, true))
                    .input("AddressTypeId", cryptoEngine.ParamDecrypt(ClientKycForeignAddressData.AddressTypeId, true))
                    .input("Address1", ClientKycForeignAddressData.Address1)
                    .input("Address2", ClientKycForeignAddressData.Address2)
                    .input("Address3", ClientKycForeignAddressData.Address3)
                    .input("City", ClientKycForeignAddressData.City)
                    .input("CountryId", cryptoEngine.ParamDecrypt(ClientKycForeignAddressData.CountryId, true))
                    .input("StateId", cryptoEngine.ParamDecrypt(ClientKycForeignAddressData.StateId, true))
                    .input("PinCode", ClientKycForeignAddressData.PinCode)
                    .input("IsSameForAll", ClientKycForeignAddressData.IsSameForAll)
                    .input("UseGuardianAddress", ClientKycForeignAddressData.UseGuardianAddress);
                const result = await request.execute("InsertClientKycForeignAddress");
                ClientKycForeignAddressData.Id = cryptoEngine.ParamEncrypt(result.output.Id, true);
            }
            else {
                const request = transaction.request();
                request.input("Id", cryptoEngine.ParamDecrypt(ClientKycForeignAddressData.Id, true))
                    .input("ClientKycProfileId", cryptoEngine.ParamDecrypt(ClientKycForeignAddressData.ClientKycProfileId, true))
                    .input("AddressTypeId", cryptoEngine.ParamDecrypt(ClientKycForeignAddressData.AddressTypeId, true))
                    .input("Address1", ClientKycForeignAddressData.Address1)
                    .input("Address2", ClientKycForeignAddressData.Address2)
                    .input("Address3", ClientKycForeignAddressData.Address3)
                    .input("City", ClientKycForeignAddressData.City)
                    .input("CountryId", cryptoEngine.ParamDecrypt(ClientKycForeignAddressData.CountryId, true))
                    .input("StateId", cryptoEngine.ParamDecrypt(ClientKycForeignAddressData.StateId, true))
                    .input("PinCode", ClientKycForeignAddressData.PinCode)
                    .input("IsSameForAll", ClientKycForeignAddressData.IsSameForAll)
                    .input("UseGuardianAddress", ClientKycForeignAddressData.UseGuardianAddress);
                const result = await request.execute("UpdateClientKycForeignAddress");
            }
        }

        if (req.files) {
            if (req.files.LocalAddressFile) {
                var fileTypeData = mime.lookup(req.files.LocalAddressFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(ClientKycLocalAddressData.ClientKycProfileId, true))
                    .input("Name", "Local Address")
                    .input("FileName", req.files.LocalAddressFile.name)
                    .input("FileContent", req.files.LocalAddressFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertClientKycProfileDocument");
            }

            if (req.files.ForeignAddressFile) {
                var fileTypeData = mime.lookup(req.files.ForeignAddressFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(ClientKycLocalAddressData.ClientKycProfileId, true))
                    .input("Name", "Foreign Address")
                    .input("FileName", req.files.ForeignAddressFile.name)
                    .input("FileContent", req.files.ForeignAddressFile.data)
                    .input("FileContentType", fileTypeData);
                const fileResult = await fileRequest.execute("InsertClientKycProfileDocument");
            }
        }

        const statusRequest = transaction.request();
        statusRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(ClientKycLocalAddressData.ClientKycProfileId, true))
            .input("IsCommunicationCompleted", true);
        const statusResult = await statusRequest.execute("UpdateKycCommunicationCompletedStatus");

        await transaction.commit();

        res.status(200).send({ Status: true, Message: "Client kyc address saved successfully.", Data: { LocalAddressId: ClientKycLocalAddressData.Id, ForeignAddressId: ClientKycForeignAddressData.Id } });
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

exports.GetClientKycBankFamily = async (req, res) => {
    const Id = req.params.ClientFamilyId;

    var errorMessage = "Error while fetching client...";

    try {
        var dataList;

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientFamilyId", cryptoEngine.ParamDecrypt(Id, true));
        const readResult = await readRequest.execute("GetClientKycBankFamily");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList != null) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = dataList[i];

                var bankItem = {
                    ClientFamilyId: cryptoEngine.ParamEncrypt(dataItem.ClientFamilyId, true),
                    ClientId: cryptoEngine.ParamEncrypt(dataItem.ClientId, true),
                    Name: dataItem.Name,
                    DateOfBirth: dataItem.DateOfBirth,
                    RelationId: cryptoEngine.ParamEncrypt(dataItem.RelationId, true),
                    TaxStatusId: cryptoEngine.ParamEncrypt(dataItem.TaxStatusId, true),
                    TaxSlabId: cryptoEngine.ParamEncrypt(dataItem.TaxSlabId, true),
                    LifeExpectancy: dataItem.LifeExpectancy,
                    ClientKycProfileId: cryptoEngine.ParamEncrypt(dataItem.ClientKycProfileId, true),
                    ClientKycBankId: cryptoEngine.ParamEncrypt(dataItem.ClientKycBankId, true),
                    IFSC: dataItem.IFSC,
                    BankName: dataItem.BankName,
                    BankBranch: dataItem.BankBranch,
                    MICR: dataItem.MICR,
                    BankAccountTypeId: cryptoEngine.ParamEncrypt(dataItem.BankAccountTypeId, true),
                    AccountNumber: dataItem.AccountNumber,
                    UPIId: dataItem.UPIId,
                    FileTag: dataItem.FileTag,
                    IsActive: dataItem.IsActive,
                    FileName: dataItem.FileName,
                    BankAccountTypeName: dataItem.BankAccountTypeName
                };

                data.push(bankItem);
            }
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientKycBankCompany = async (req, res) => {
    const Id = req.params.ClientCompanyId;

    var errorMessage = "Error while fetching client...";

    try {
        var dataList;

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientCompanyId", cryptoEngine.ParamDecrypt(Id, true));
        const readResult = await readRequest.execute("GetClientKycBankCompany");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList != null) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = dataList[i];

                var bankItem = {
                    ClientCompanyId: cryptoEngine.ParamEncrypt(dataItem.ClientCompanyId, true),
                    ClientId: cryptoEngine.ParamEncrypt(dataItem.ClientId, true),
                    Name: dataItem.Name,
                    DateOfIncorporation: dataItem.DateOfIncorporation,
                    TaxStatusId: cryptoEngine.ParamEncrypt(dataItem.TaxStatusId, true),
                    TaxSlabId: cryptoEngine.ParamEncrypt(dataItem.TaxSlabId, true),
                    ClientKycProfileId: cryptoEngine.ParamEncrypt(dataItem.ClientKycProfileId, true),
                    ClientKycBankId: cryptoEngine.ParamEncrypt(dataItem.ClientKycBankId, true),
                    IFSC: dataItem.IFSC,
                    BankName: dataItem.BankName,
                    BankBranch: dataItem.BankBranch,
                    MICR: dataItem.MICR,
                    BankAccountTypeId: cryptoEngine.ParamEncrypt(dataItem.BankAccountTypeId, true),
                    AccountNumber: dataItem.AccountNumber,
                    UPIId: dataItem.UPIId,
                    FileTag: dataItem.FileTag,
                    IsActive: dataItem.IsActive,
                    FileName: dataItem.FileName,
                    BankAccountTypeName: dataItem.BankAccountTypeName
                };

                data.push(bankItem);
            }
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.SaveClientKycBank = async (req, res) => {
    var { MemberId, CompanyId, LeadId, ClientKycBank } = req.body;

    let ClientKycBankData = JSON.parse(ClientKycBank);
    let ClientKycProfileId = '';

    var errorMessage = "Error while saving client bank...";

    if (cryptoEngine.ParamDecrypt(MemberId, true) != 0) {
        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientFamilyId", cryptoEngine.ParamDecrypt(MemberId, true));
        const readResult = await readRequest.execute("GetClientKycProfileFamily");
        if (readResult.recordset.length > 0) {
            ClientKycProfileId = cryptoEngine.ParamEncrypt(readResult.recordset[0].ClientKycProfileId, true);
        }
    }

    if (cryptoEngine.ParamDecrypt(CompanyId, true) != 0) {
        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientCompanyId", cryptoEngine.ParamDecrypt(CompanyId, true));
        const readResult = await readRequest.execute("GetClientKycProfileCompany");
        if (readResult.recordset.length > 0) {
            ClientKycProfileId = cryptoEngine.ParamEncrypt(readResult.recordset[0].ClientKycProfileId, true);
        }
    }

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        for (let i = 0; i < ClientKycBankData.length; i++) {
            let bankItem = ClientKycBankData[i];
            if (cryptoEngine.ParamDecrypt(bankItem.Id, true) == 0) {
                const request = transaction.request();
                request.output("Id", msSql.BigInt)
                    .input("ClientKycProfileId", cryptoEngine.ParamDecrypt(ClientKycProfileId, true))
                    .input("IFSC", bankItem.IFSC.toUpperCase())
                    .input("BankName", bankItem.BankName)
                    .input("BankBranch", bankItem.BankBranch)
                    .input("MICR", bankItem.MICR)
                    .input("BankAccountTypeId", cryptoEngine.ParamDecrypt(bankItem.BankAccountTypeId, true))
                    .input("AccountNumber", bankItem.AccountNumber)
                    .input("UPIId", bankItem.UPIId)
                    .input("FileTag", bankItem.FileTag)
                    .input("IsActive", bankItem.IsActive);
                const result = await request.execute("InsertClientKycBank");
                ClientKycBankData[i].Id = cryptoEngine.ParamEncrypt(result.output.Id, true);
            }
            else {
                const request = transaction.request();
                request.input("Id", cryptoEngine.ParamDecrypt(bankItem.Id, true))
                    .input("ClientKycProfileId", cryptoEngine.ParamDecrypt(ClientKycProfileId, true))
                    .input("IFSC", bankItem.IFSC.toUpperCase())
                    .input("BankName", bankItem.BankName)
                    .input("BankBranch", bankItem.BankBranch)
                    .input("MICR", bankItem.MICR)
                    .input("BankAccountTypeId", cryptoEngine.ParamDecrypt(bankItem.BankAccountTypeId, true))
                    .input("AccountNumber", bankItem.AccountNumber)
                    .input("UPIId", bankItem.UPIId)
                    .input("FileTag", bankItem.FileTag)
                    .input("IsActive", bankItem.IsActive);
                const result = await request.execute("UpdateClientKycBank");
            }
        }

        if (req.files) {
            if (util.isArray(req.files.BankDocumentFiles)) {
                for (let i = 0; i < req.files.BankDocumentFiles.length; i++) {
                    var fileTypeData = mime.lookup(req.files.BankDocumentFiles[i].name);
                    var fileNameList = req.files.BankDocumentFiles[i].name.split('.');

                    const fileRequest = transaction.request();
                    fileRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(ClientKycProfileId, true))
                        .input("Name", "Bank Proof")
                        .input("FileName", req.files.BankDocumentFiles[i].name)
                        .input("FileContent", req.files.BankDocumentFiles[i].data)
                        .input("FileContentType", fileTypeData)
                        .input("FileTag", fileNameList[0]);
                    const fileResult = await fileRequest.execute("InsertClientKycProfileBankDocument");
                }
            }
            else {
                var fileTypeData = mime.lookup(req.files.BankDocumentFiles.name);
                var fileNameList = req.files.BankDocumentFiles.name.split('.');

                const fileRequest = transaction.request();
                fileRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(ClientKycProfileId, true))
                    .input("Name", "Bank Proof")
                    .input("FileName", req.files.BankDocumentFiles.name)
                    .input("FileContent", req.files.BankDocumentFiles.data)
                    .input("FileContentType", fileTypeData)
                    .input("FileTag", fileNameList[0]);
                const fileResult = await fileRequest.execute("InsertClientKycProfileBankDocument");
            }
        }

        const statusRequest = transaction.request();
        statusRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(ClientKycProfileId, true))
            .input("IsBankCompleted", true);
        const statusResult = await statusRequest.execute("UpdateKycBankCompletedStatus");

        await transaction.commit();

        res.status(200).send({ Status: true, Message: "Client kyc bank saved successfully.", Data: { MemberId: MemberId, CompanyId: CompanyId, LeadId: LeadId } });
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

exports.GetClientAssetAllocation = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching client...";

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientAssetAllocation");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    ClientFamilyId: cryptoEngine.ParamEncrypt(dataList[i].ClientFamilyId, true),
                    ClientCompanyId: cryptoEngine.ParamEncrypt(dataList[i].ClientCompanyId, true),
                    ClientId: cryptoEngine.ParamEncrypt(dataList[i].ClientId, true),
                    Name: dataList[i].Name,
                    Type: dataList[i].Type,
                    TaxStatusName: dataList[i].TaxStatusName,
                    LumpsumEquity: dataList[i].LumpsumEquity,
                    LumpsumDebt: dataList[i].LumpsumDebt,
                    SipEquity: dataList[i].SipEquity,
                    SipDebt: dataList[i].SipDebt
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

exports.SaveClientAssetAllocation = async (req, res) => {
    var { ClientId, ClientAssetAllocation, ModificationReason } = req.body;

    let ClientAssetAllocationData = JSON.parse(ClientAssetAllocation);

    var errorMessage = "Error while saving client asset allocation...";

    var currentDate = luxon.DateTime.now().setZone('Asia/Kolkata');

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        const deleteRequest = transaction.request();
        deleteRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const deleteResult = await deleteRequest.execute("DeleteClientAssetAllocation");

        for (let i = 0; i < ClientAssetAllocationData.length; i++) {
            let item = ClientAssetAllocationData[i];

            if (cryptoEngine.ParamDecrypt(item.ClientFamilyId, true) != 0) {
                const request = transaction.request();
                request.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                    .input("ClientFamilyId", cryptoEngine.ParamDecrypt(item.ClientFamilyId, true))
                    .input("LumpsumEquity", item.LumpsumEquity)
                    .input("LumpsumDebt", item.LumpsumDebt)
                    .input("SipEquity", item.SipEquity)
                    .input("SipDebt", item.SipDebt);
                const result = await request.execute("InsertClientFamilyAssetAllocation");
            }

            if (cryptoEngine.ParamDecrypt(item.ClientCompanyId, true) != 0) {
                const request = transaction.request();
                request.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                    .input("ClientCompanyId", cryptoEngine.ParamDecrypt(item.ClientCompanyId, true))
                    .input("LumpsumEquity", item.LumpsumEquity)
                    .input("LumpsumDebt", item.LumpsumDebt)
                    .input("SipEquity", item.SipEquity)
                    .input("SipDebt", item.SipDebt);
                const result = await request.execute("InsertClientCompanyAssetAllocation");
            }
        }

        const statusRequest = transaction.request();
        statusRequest.input("Id", cryptoEngine.ParamDecrypt(ClientId, true))
            .input("IsAssetAllocationCompleted", true);
        const statusResult = await statusRequest.execute("UpdateAssetAllocationCompletedStatus");

        if (ModificationReason.trim() != '') {
            const request = transaction.request();
            request.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                .input("ModificationDate", currentDate.toFormat('yyyy-MM-dd'))
                .input("ModificationReason", ModificationReason);
            const result = await request.execute("InsertClientAssetAllocationModificationLog");
        }

        await transaction.commit();

        res.status(200).send({ Status: true, Message: "Client asset allocation saved successfully.", Data: { ClientId: ClientId } });
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

exports.GetClientKycProfileAccount = async (req, res) => {
    const ClientId = req.params.ClientId;
    const FirstAccountHolderId = req.params.FirstAccountHolderId;
    const SecondAccountHolderId = req.params.SecondAccountHolderId;

    var errorMessage = "Error while fetching client...";

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        readRequest.input("FirstAccountHolderId", cryptoEngine.ParamDecrypt(FirstAccountHolderId, true));
        readRequest.input("SecondAccountHolderId", cryptoEngine.ParamDecrypt(SecondAccountHolderId, true));
        const readResult = await readRequest.execute("GetClientKycProfileAccount");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    Name: dataList[i].Name,
                    TaxStatusId: cryptoEngine.ParamEncrypt(dataList[i].TaxStatusId, true),
                    TaxSlabId: cryptoEngine.ParamEncrypt(dataList[i].TaxSlabId, true),
                    ProfileType: dataList[i].ProfileType,
                    Age: dataList[i].Age,
                    IsMinorProfile: Boolean(dataList[i].IsMinorProfile)
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

exports.GetClientKycProfileAccountNominee = async (req, res) => {
    const ClientId = req.params.ClientId;
    const FirstAccountHolderId = req.params.FirstAccountHolderId;
    const SecondAccountHolderId = req.params.SecondAccountHolderId;
    const ThirdAccountHolderId = req.params.ThirdAccountHolderId;
    const FirstNomineeId = req.params.FirstNomineeId;
    const SecondNomineeId = req.params.SecondNomineeId;

    var errorMessage = "Error while fetching client...";

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        readRequest.input("FirstAccountHolderId", cryptoEngine.ParamDecrypt(FirstAccountHolderId, true));
        readRequest.input("SecondAccountHolderId", cryptoEngine.ParamDecrypt(SecondAccountHolderId, true));
        readRequest.input("ThirdAccountHolderId", cryptoEngine.ParamDecrypt(ThirdAccountHolderId, true));
        readRequest.input("FirstNomineeId", cryptoEngine.ParamDecrypt(FirstNomineeId, true));
        readRequest.input("SecondNomineeId", cryptoEngine.ParamDecrypt(SecondNomineeId, true));
        const readResult = await readRequest.execute("GetClientKycProfileAccountNominee");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    Name: dataList[i].Name,
                    TaxStatusId: cryptoEngine.ParamEncrypt(dataList[i].TaxStatusId, true),
                    TaxSlabId: cryptoEngine.ParamEncrypt(dataList[i].TaxSlabId, true),
                    ProfileType: dataList[i].ProfileType
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

exports.GetClientKycProfileAccountNomineeGuardians = async (req, res) => {
    const ClientId = req.params.ClientId;
    const FirstAccountHolderId = req.params.FirstAccountHolderId;
    const SecondAccountHolderId = req.params.SecondAccountHolderId;
    const ThirdAccountHolderId = req.params.ThirdAccountHolderId;
    const NomineeId = req.params.NomineeId;

    var errorMessage = "Error while fetching client...";

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        readRequest.input("FirstAccountHolderId", cryptoEngine.ParamDecrypt(FirstAccountHolderId, true));
        readRequest.input("SecondAccountHolderId", cryptoEngine.ParamDecrypt(SecondAccountHolderId, true));
        readRequest.input("ThirdAccountHolderId", cryptoEngine.ParamDecrypt(ThirdAccountHolderId, true));
        readRequest.input("NomineeId", cryptoEngine.ParamDecrypt(NomineeId, true));
        const readResult = await readRequest.execute("GetClientKycProfileAccountNomineeGuardians");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    Name: dataList[i].Name,
                    TaxStatusId: cryptoEngine.ParamEncrypt(dataList[i].TaxStatusId, true),
                    TaxSlabId: cryptoEngine.ParamEncrypt(dataList[i].TaxSlabId, true),
                    ProfileType: dataList[i].ProfileType
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

exports.GetClientKycProfileAccountBank = async (req, res) => {
    const ClientId = req.params.ClientId;
    const FirstAccountHolderId = req.params.FirstAccountHolderId;

    var errorMessage = "Error while fetching client...";

    try {
        var data = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        readRequest.input("FirstAccountHolderId", cryptoEngine.ParamDecrypt(FirstAccountHolderId, true));
        const readResult = await readRequest.execute("GetClientKycProfileAccountBanks");
        if (readResult.recordset.length > 0) {
            data = readResult.recordset.map(item => {
                const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                const BankAccountTypeId = cryptoEngine.ParamEncrypt(item.BankAccountTypeId, true);
                const Name = item.BankName + ' - ' + item.Code + ' (' + item.AccountNumber + ')';

                return { ...item, Id, BankAccountTypeId, Name };
            });
        }

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientKycProfileAccountOtherBank = async (req, res) => {
    const ClientId = req.params.ClientId;
    const FirstAccountHolderId = req.params.FirstAccountHolderId;
    const ClientKycBankId = req.params.ClientKycBankId;

    var errorMessage = "Error while fetching client...";

    try {
        var data = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        readRequest.input("FirstAccountHolderId", cryptoEngine.ParamDecrypt(FirstAccountHolderId, true));
        readRequest.input("ClientKycBankId", cryptoEngine.ParamDecrypt(ClientKycBankId, true));
        const readResult = await readRequest.execute("GetClientKycProfileAccountOtherBanks");
        if (readResult.recordset.length > 0) {
            data = readResult.recordset.map(item => {
                const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                const BankAccountTypeId = cryptoEngine.ParamEncrypt(item.BankAccountTypeId, true);
                const Name = item.BankName + ' - ' + item.Code + ' (' + item.AccountNumber + ')';

                return { ...item, Id, BankAccountTypeId, Name };
            });
        }

        let dataItem = {
            Id: cryptoEngine.ParamEncrypt('-1', true),
            IFSC: '',
            BankName: 'NA',
            BankBranch: '',
            MICR: '',
            BankAccountTypeId: cryptoEngine.ParamEncrypt('0', true),
            AccountNumber: '',
            BankAccountTypeName: '',
            Code: '',
            IsActive: true,
            Name: 'NA',
        };

        data.unshift(dataItem);

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientAccount = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching client...";

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientAccounts");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];

        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    FirstHolderId: null,
                    SecondHolderId: null,
                    ThirdHolderId: null,
                    AccountHolderName: '',
                    AccountTypeId: cryptoEngine.ParamEncrypt(dataList[i].AccountTypeId, true),
                    UCCSerialNumber: dataList[i].UCCSerialNumber,
                    UCC: dataList[i].UCC,
                    MFUCAN: dataList[i].MFUCAN,
                    HasNominee: dataList[i].HasNominee,
                    CreateBSEAccount: dataList[i].CreateBSEAccount,
                    CreateMFUAccount: dataList[i].CreateMFUAccount,
                    CreateP2PAccount: dataList[i].CreateP2PAccount,
                    IsSelfVerified: dataList[i].IsSelfVerified,
                    SelfVerifiedDate: dataList[i].SelfVerifiedDate,
                    IsAccountCreatedAtBSE: dataList[i].IsAccountCreatedAtBSE,
                    BSEAccountCreatedDate: dataList[i].BSEAccountCreatedDate,
                    ISAOFFileUploadedToBSE: dataList[i].ISAOFFileUploadedToBSE,
                    BSEAOFFileUploadedDate: dataList[i].BSEAOFFileUploadedDate,
                    IsAccountCreatedAtMFU: dataList[i].IsAccountCreatedAtMFU,
                    MFUAccountCreatedDate: dataList[i].MFUAccountCreatedDate,
                    IsAccountCreatedAtLB: dataList[i].IsAccountCreatedAtLB,
                    LBAccountCreatedDate: dataList[i].LBAccountCreatedDate,
                    IsWelcomeEmailSent: dataList[i].IsWelcomeEmailSent,
                    FirstNomineeId: null,
                    FirstNomineeGuardianId: null,
                    FirstNomineeRelationId: null,
                    FirstNomineeShare: 0,
                    SecondNomineeId: null,
                    SecondNomineeGuardianId: null,
                    SecondNomineeRelationId: null,
                    SecondNomineeShare: 0,
                    ThirdNomineeId: null,
                    ThirdNomineeGuardianId: null,
                    ThridNomineeRelationId: null,
                    ThirdNomineeShare: 0,
                    DefaultBankId: null,
                    SelectedOtherBanks: [cryptoEngine.ParamEncrypt('-1', true)],
                    IsAccountCreated: (dataList[i].IsAccountCreatedAtBSE || dataList[i].IsAccountCreatedAtMFU || dataList[i].IsAccountCreatedAtLB),
                    ModificationLog: []
                };

                const readHolderRequest = req.app.locals.db.request();
                readHolderRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(dataItem.Id, true));
                const readHolderResult = await readHolderRequest.execute("GetClientAccountHolders");
                if (readHolderResult.recordset.length > 0) {
                    let holderDataList = readHolderResult.recordset;
                    for (let h = 0; h < holderDataList.length; h++) {
                        switch (holderDataList[h].SerialNumber) {
                            case 1:
                                dataItem.FirstHolderId = cryptoEngine.ParamEncrypt(holderDataList[h].ClientKycProfileId, true);
                                dataItem.AccountHolderName = holderDataList[h].Name;
                                break;
                            case 2:
                                dataItem.SecondHolderId = cryptoEngine.ParamEncrypt(holderDataList[h].ClientKycProfileId, true);
                                dataItem.AccountHolderName += ' + ' + holderDataList[h].Name;
                                break;
                            case 3:
                                dataItem.ThirdHolderId = cryptoEngine.ParamEncrypt(holderDataList[h].ClientKycProfileId, true);
                                dataItem.AccountHolderName += ' + ' + holderDataList[h].Name;
                                break;

                        }
                    }
                }

                const readNomineeRequest = req.app.locals.db.request();
                readNomineeRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(dataItem.Id, true));
                const readNomineeResult = await readNomineeRequest.execute("GetClientAccountNominee");
                if (readNomineeResult.recordset.length > 0) {
                    let nomineeDataList = readNomineeResult.recordset;
                    for (let n = 0; n < nomineeDataList.length; n++) {
                        switch (n) {
                            case 0:
                                dataItem.FirstNomineeId = cryptoEngine.ParamEncrypt(nomineeDataList[n].ClientFamilyId, true);
                                dataItem.FirstNomineeRelationId = cryptoEngine.ParamEncrypt(nomineeDataList[n].RelationId, true);
                                dataItem.FirstNomineeShare = nomineeDataList[n].Shares;

                                const readGuardianRequest1 = req.app.locals.db.request();
                                readGuardianRequest1.input("ClientAccountNomineeId", nomineeDataList[n].Id);
                                const readGuardianResult1 = await readGuardianRequest1.execute("GetClientAccountNomineeGuardian");
                                if (readGuardianResult1.recordset.length > 0) {
                                    let guardianDataList = readGuardianResult1.recordset[0];
                                    if (guardianDataList != null) {
                                        dataItem.FirstNomineeGuardianId = cryptoEngine.ParamEncrypt(guardianDataList.ClientFamilyId, true);
                                    }
                                }
                                break;
                            case 1:
                                dataItem.SecondNomineeId = cryptoEngine.ParamEncrypt(nomineeDataList[n].ClientFamilyId, true);
                                dataItem.SecondNomineeRelationId = cryptoEngine.ParamEncrypt(nomineeDataList[n].RelationId, true);
                                dataItem.SecondNomineeShare = nomineeDataList[n].Shares;

                                const readGuardianRequest2 = req.app.locals.db.request();
                                readGuardianRequest2.input("ClientAccountNomineeId", nomineeDataList[n].Id);
                                const readGuardianResult2 = await readGuardianRequest2.execute("GetClientAccountNomineeGuardian");
                                if (readGuardianResult2.recordset.length > 0) {
                                    let guardianDataList = readGuardianResult2.recordset[0];
                                    if (guardianDataList != null) {
                                        dataItem.SecondNomineeGuardianId = cryptoEngine.ParamEncrypt(guardianDataList.ClientFamilyId, true);
                                    }
                                }
                                break;
                            case 2:
                                dataItem.ThirdNomineeId = cryptoEngine.ParamEncrypt(nomineeDataList[n].ClientFamilyId, true);
                                dataItem.ThridNomineeRelationId = cryptoEngine.ParamEncrypt(nomineeDataList[n].RelationId, true);
                                dataItem.ThirdNomineeShare = nomineeDataList[n].Shares;

                                const readGuardianRequest3 = req.app.locals.db.request();
                                readGuardianRequest3.input("ClientAccountNomineeId", cryptoEngine.ParamDecrypt(dataItem.ThirdNomineeId, true));
                                const readGuardianResult3 = await readGuardianRequest3.execute("GetClientAccountNomineeGuardian");
                                if (readGuardianResult3.recordset.length > 0) {
                                    let guardianDataList = readGuardianResult3.recordset[0];
                                    if (guardianDataList != null) {
                                        dataItem.ThirdNomineeGuardianId = cryptoEngine.ParamEncrypt(guardianDataList.ClientFamilyId, true);
                                    }
                                }
                                break;
                        }
                    }
                }

                const readBankRequest = req.app.locals.db.request();
                readBankRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(dataItem.Id, true));
                const readBankResult = await readBankRequest.execute("GetClientAccountBank");
                if (readBankResult.recordset.length > 0) {
                    let bankDataList = readBankResult.recordset;
                    for (let b = 0; b < bankDataList.length; b++) {
                        if (bankDataList[b].IsDefault == true) {
                            dataItem.DefaultBankId = cryptoEngine.ParamEncrypt(bankDataList[b].ClientKycBankId, true);
                        }
                        else {
                            dataItem.SelectedOtherBanks.push(cryptoEngine.ParamEncrypt(bankDataList[b].ClientKycBankId, true));
                        }
                    }
                }

                const readAccountLogRequest = req.app.locals.db.request();
                readAccountLogRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                    .input("ClientAccountId", cryptoEngine.ParamDecrypt(dataItem.Id, true));
                const readAccountLogResult = await readAccountLogRequest.execute("GetClientAccountModificationLog");
                if (readAccountLogResult.recordset.length > 0) {
                    dataItem.ModificationLog = readAccountLogResult.recordset.map(item => {
                        const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                        const ClientId = cryptoEngine.ParamEncrypt(item.ClientId, true);
                        const ClientAccountId = cryptoEngine.ParamEncrypt(item.ClientAccountId, true);

                        return { ...item, Id, ClientId, ClientAccountId };
                    });
                }

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

exports.SaveClientAccount = async (req, res) => {
    var { ClientId, ClientAccounts } = req.body;

    let ClientAccountsData = JSON.parse(ClientAccounts);

    var errorMessage = "Error while saving client account...";

    var currentDate = luxon.DateTime.now().setZone('Asia/Kolkata');

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        const deleteGuardianRequest = transaction.request();
        deleteGuardianRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const deleteGuardianResult = await deleteGuardianRequest.execute("DeleteClientAccountNomineeGuardian");

        const deleteNomineeRequest = transaction.request();
        deleteNomineeRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const deleteNomineeResult = await deleteNomineeRequest.execute("DeleteClientAccountNominee");

        const deleteBankRequest = transaction.request();
        deleteBankRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const deleteBankResult = await deleteBankRequest.execute("DeleteClientAccountBank");

        const deleteHolderRequest = transaction.request();
        deleteHolderRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const deleteHolderResult = await deleteHolderRequest.execute("DeleteClientAccountHolder");

        for (let i = 0; i < ClientAccountsData.length; i++) {
            let item = ClientAccountsData[i];

            if (cryptoEngine.ParamDecrypt(item.Id, true) == 0) {
                const request = transaction.request();
                request.output("Id", msSql.BigInt)
                    .input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                    .input("AccountTypeId", cryptoEngine.ParamDecrypt(item.AccountTypeId, true))
                    .input("HasNominee", item.HasNominee)
                    .input("CreateBSEAccount", item.CreateBSEAccount)
                    .input("CreateMFUAccount", item.CreateMFUAccount)
                    .input("CreateP2PAccount", item.CreateP2PAccount);
                const result = await request.execute("InsertClientAccount");
                item.Id = cryptoEngine.ParamEncrypt(result.output.Id, true);
            }
            else {
                const request = transaction.request();
                request.input("Id", cryptoEngine.ParamDecrypt(item.Id, true))
                    .input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                    .input("AccountTypeId", cryptoEngine.ParamDecrypt(item.AccountTypeId, true))
                    .input("HasNominee", item.HasNominee)
                    .input("CreateBSEAccount", item.CreateBSEAccount)
                    .input("CreateMFUAccount", item.CreateMFUAccount)
                    .input("CreateP2PAccount", item.CreateP2PAccount);
                const result = await request.execute("UpdateClientAccount");
            }

            if (cryptoEngine.ParamDecrypt(item.FirstHolderId, true) != 0) {
                const request = transaction.request();
                request.input("ClientAccountId", cryptoEngine.ParamDecrypt(item.Id, true))
                    .input("ClientKycProfileId", cryptoEngine.ParamDecrypt(item.FirstHolderId, true))
                    .input("SerialNumber", 1);
                const result = await request.execute("InsertClientAccountHolder");
            }

            if (cryptoEngine.ParamDecrypt(item.SecondHolderId, true) != 0) {
                const request = transaction.request();
                request.input("ClientAccountId", cryptoEngine.ParamDecrypt(item.Id, true))
                    .input("ClientKycProfileId", cryptoEngine.ParamDecrypt(item.SecondHolderId, true))
                    .input("SerialNumber", 2);
                const result = await request.execute("InsertClientAccountHolder");
            }

            if (cryptoEngine.ParamDecrypt(item.ThirdHolderId, true) != 0) {
                const request = transaction.request();
                request.input("ClientAccountId", cryptoEngine.ParamDecrypt(item.Id, true))
                    .input("ClientKycProfileId", cryptoEngine.ParamDecrypt(item.ThirdHolderId, true))
                    .input("SerialNumber", 3);
                const result = await request.execute("InsertClientAccountHolder");
            }

            if (item.HasNominee == true) {
                if (cryptoEngine.ParamDecrypt(item.FirstNomineeId, true) != 0) {
                    const request = transaction.request();
                    request.output("Id", msSql.BigInt)
                        .input("ClientAccountId", cryptoEngine.ParamDecrypt(item.Id, true))
                        .input("ClientFamilyId", cryptoEngine.ParamDecrypt(item.FirstNomineeId, true))
                        .input("RelationId", cryptoEngine.ParamDecrypt(item.FirstNomineeRelationId, true))
                        .input("Shares", item.FirstNomineeShare);
                    const result = await request.execute("InsertClientAccountNominee");
                    let nomineeId = cryptoEngine.ParamEncrypt(result.output.Id, true);

                    if (cryptoEngine.ParamDecrypt(item.FirstNomineeGuardianId, true) != 0) {
                        const requestGuardian = transaction.request();
                        requestGuardian.input("ClientAccountNomineeId", cryptoEngine.ParamDecrypt(nomineeId, true))
                            .input("ClientFamilyId", cryptoEngine.ParamDecrypt(item.FirstNomineeGuardianId, true));
                        const resultGuardian = await requestGuardian.execute("InsertClientAccountNomineeGuardian");
                    }
                }

                if (cryptoEngine.ParamDecrypt(item.SecondNomineeId, true) != 0) {
                    const request = transaction.request();
                    request.output("Id", msSql.BigInt)
                        .input("ClientAccountId", cryptoEngine.ParamDecrypt(item.Id, true))
                        .input("ClientFamilyId", cryptoEngine.ParamDecrypt(item.SecondNomineeId, true))
                        .input("RelationId", cryptoEngine.ParamDecrypt(item.SecondNomineeRelationId, true))
                        .input("Shares", item.SecondNomineeShare);
                    const result = await request.execute("InsertClientAccountNominee");
                    let nomineeId = cryptoEngine.ParamEncrypt(result.output.Id, true);

                    if (cryptoEngine.ParamDecrypt(item.SecondNomineeGuardianId, true) != 0) {
                        const requestGuardian = transaction.request();
                        requestGuardian.input("ClientAccountNomineeId", cryptoEngine.ParamDecrypt(nomineeId, true))
                            .input("ClientFamilyId", cryptoEngine.ParamDecrypt(item.SecondNomineeGuardianId, true));
                        const resultGuardian = await requestGuardian.execute("InsertClientAccountNomineeGuardian");
                    }
                }

                if (cryptoEngine.ParamDecrypt(item.ThirdNomineeId, true) != 0) {
                    const request = transaction.request();
                    request.output("Id", msSql.BigInt)
                        .input("ClientAccountId", cryptoEngine.ParamDecrypt(item.Id, true))
                        .input("ClientFamilyId", cryptoEngine.ParamDecrypt(item.ThirdNomineeId, true))
                        .input("RelationId", cryptoEngine.ParamDecrypt(item.ThridNomineeRelationId, true))
                        .input("Shares", item.ThirdNomineeShare);
                    const result = await request.execute("InsertClientAccountNominee");
                    let nomineeId = cryptoEngine.ParamEncrypt(result.output.Id, true);

                    if (cryptoEngine.ParamDecrypt(item.ThirdNomineeGuardianId, true) != 0) {
                        const requestGuardian = transaction.request();
                        requestGuardian.input("ClientAccountNomineeId", cryptoEngine.ParamDecrypt(nomineeId, true))
                            .input("ClientFamilyId", cryptoEngine.ParamDecrypt(item.ThirdNomineeGuardianId, true));
                        const resultGuardian = await requestGuardian.execute("InsertClientAccountNomineeGuardian");
                    }
                }
            }

            if (cryptoEngine.ParamDecrypt(item.DefaultBankId, true) != 0) {
                const request = transaction.request();
                request.input("ClientAccountId", cryptoEngine.ParamDecrypt(item.Id, true))
                    .input("ClientKycBankId", cryptoEngine.ParamDecrypt(item.DefaultBankId, true))
                    .input("IsDefault", true);
                const result = await request.execute("InsertClientAccountBank");
            }

            let OtherBanksData = JSON.parse(item.SelectedOtherBanks);
            for (let j = 0; j < OtherBanksData.length; j++) {
                let bankItem = OtherBanksData[j];

                if (cryptoEngine.ParamDecrypt(bankItem.Id, true) != -1) {
                    const request = transaction.request();
                    request.input("ClientAccountId", cryptoEngine.ParamDecrypt(item.Id, true))
                        .input("ClientKycBankId", cryptoEngine.ParamDecrypt(bankItem.Id, true))
                        .input("IsDefault", false);
                    const result = await request.execute("InsertClientAccountBank");
                }
            }

            if (item.ModificationReason.trim() != '') {
                const request = transaction.request();
                request.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                    .input("ClientAccountId", cryptoEngine.ParamDecrypt(item.Id, true))
                    .input("ModificationDate", currentDate.toFormat('yyyy-MM-dd'))
                    .input("ModificationReason", item.ModificationReason)
                    .input("IsLocked", true);
                const result = await request.execute("InsertClientAccountModificationLog");
            }
        }

        const statusRequest = transaction.request();
        statusRequest.input("Id", cryptoEngine.ParamDecrypt(ClientId, true))
            .input("IsAccountCompleted", true);
        const statusResult = await statusRequest.execute("UpdateAccountCompletedStatus");

        await transaction.commit();

        res.status(200).send({ Status: true, Message: "Client accounts saved successfully.", Data: { ClientId: ClientId } });
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

exports.GetClientMandates = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching client mandates...";

    try {
        var accountsDataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientAccounts");
        if (readResult.recordset.length > 0) {
            accountsDataList = readResult.recordset;
        }

        var data = [];

        if (accountsDataList.length > 0) {
            for (let i = 0; i < accountsDataList.length; i++) {
                let accountsDataItem = accountsDataList[i];

                var holdersDataList = [];

                const readRequest = req.app.locals.db.request();
                readRequest.input("ClientAccountId", accountsDataItem.Id);
                const readResult = await readRequest.execute("GetClientAccountHolders");
                if (readResult.recordset.length > 0) {
                    holdersDataList = readResult.recordset;
                }

                let holderList = [];
                let accountName = '';
                for (let j = 0; j < holdersDataList.length; j++) {
                    let holderItem = {
                        Id: cryptoEngine.ParamEncrypt(holdersDataList[j].Id, true),
                        ClientAccountId: cryptoEngine.ParamEncrypt(holdersDataList[j].ClientAccountId, true),
                        ClientKycProfileId: cryptoEngine.ParamEncrypt(holdersDataList[j].ClientKycProfileId, true),
                        SerialNumber: holdersDataList[j].SerialNumber,
                        Name: holdersDataList[j].Name
                    };

                    holderList.push(holderItem);

                    if (accountName == '') {
                        accountName += holdersDataList[j].Name;
                    }
                    else {
                        accountName += ' + ' + holdersDataList[j].Name;
                    }
                }

                var mandateDataList = [];

                const readMandateRequest = req.app.locals.db.request();
                readMandateRequest.input("ClientAccountId", accountsDataItem.Id);
                const readMandateResult = await readMandateRequest.execute("GetClientAccountMandates");
                if (readMandateResult.recordset.length > 0) {
                    mandateDataList = readMandateResult.recordset;
                }

                let mandateList = [];
                for (let j = 0; j < mandateDataList.length; j++) {
                    let mandateItem = {
                        Id: cryptoEngine.ParamEncrypt(mandateDataList[j].Id, true),
                        ClientAccountId: cryptoEngine.ParamEncrypt(mandateDataList[j].ClientAccountId, true),
                        ClientKycBankId: cryptoEngine.ParamEncrypt(mandateDataList[j].ClientKycBankId, true),
                        Amount: mandateDataList[j].Amount,
                        MandateTypeId: cryptoEngine.ParamEncrypt(mandateDataList[j].MandateTypeId, true),
                        MandateTypeName: mandateDataList[j].MandateTypeName,
                        Status: mandateDataList[j].Status,
                        BSEMandateId: mandateDataList[j].BSEMandateId,
                        StartDate: mandateDataList[j].StartDate,
                        EndDate: mandateDataList[j].EndDate,
                        IsMandateCreatedAtBSE: mandateDataList[j].IsMandateCreatedAtBSE,
                        BSEMandateCreatedDate: mandateDataList[j].BSEMandateCreatedDate,
                        IsMandateScanUploadedToBSE: mandateDataList[j].IsMandateScanUploadedToBSE,
                        BSEMandateScanUploadedDate: mandateDataList[j].BSEMandateScanUploadedDate,
                        MMRN: mandateDataList[j].MMRN,
                        MFUUniqueRefNo: mandateDataList[j].MFUUniqueRefNo,
                        MFUApproveLink: mandateDataList[j].MFUApproveLink,
                        MFUStartDate: mandateDataList[j].MFUStartDate,
                        MFUEndDate: mandateDataList[j].MFUEndDate,
                        MFUPRN: mandateDataList[j].MFUPRN,
                        MMRNRegStatus: mandateDataList[j].MMRNRegStatus,
                        MMRNAggrStatus: mandateDataList[j].MMRNAggrStatus,
                        BSERemarks: mandateDataList[j].BSERemarks,
                        Bank: {
                            IFSC: mandateDataList[j].IFSC,
                            BankName: mandateDataList[j].BankName,
                            BankBranch: mandateDataList[j].BankBranch,
                            MICR: mandateDataList[j].MICR,
                            BankAccountTypeId: mandateDataList[j].BankAccountTypeId,
                            BankAccountTypeName: mandateDataList[j].BankAccountTypeName,
                            BankAccountTypeCode: mandateDataList[j].BankAccountTypeCode,
                            AccountNumber: mandateDataList[j].AccountNumber
                        },
                        IsNew: false
                    };

                    mandateList.push(mandateItem);
                }

                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(accountsDataItem.Id, true),
                    ClientId: cryptoEngine.ParamEncrypt(accountsDataItem.ClientId, true),
                    AccountTypeId: cryptoEngine.ParamEncrypt(accountsDataItem.AccountTypeId, true),
                    UCCSerialNumber: accountsDataItem.UCCSerialNumber,
                    UCC: accountsDataItem.UCC,
                    MFUCAN: accountsDataItem.MFUCAN,
                    HasNominee: accountsDataItem.HasNominee,
                    CreateBSEAccount: accountsDataItem.CreateBSEAccount,
                    CreateMFUAccount: accountsDataItem.CreateMFUAccount,
                    CreateP2PAccount: accountsDataItem.CreateP2PAccount,
                    IsSelfVerified: accountsDataItem.IsSelfVerified,
                    SelfVerifiedDate: accountsDataItem.SelfVerifiedDate,
                    IsAccountCreatedAtBSE: accountsDataItem.IsAccountCreatedAtBSE,
                    BSEAccountCreatedDate: accountsDataItem.BSEAccountCreatedDate,
                    ISAOFFileUploadedToBSE: accountsDataItem.ISAOFFileUploadedToBSE,
                    BSEAOFFileUploadedDate: accountsDataItem.BSEAOFFileUploadedDate,
                    IsAccountCreatedAtMFU: accountsDataItem.IsAccountCreatedAtMFU,
                    MFUAccountCreatedDate: accountsDataItem.MFUAccountCreatedDate,
                    IsWelcomeEmailSent: accountsDataItem.IsWelcomeEmailSent,
                    AccountTypeName: accountsDataItem.AccountTypeName,
                    AccountTypeCode: accountsDataItem.AccountTypeCode,
                    AccountHolders: holderList,
                    AccountHolderName: accountName,
                    ClientAccountMandate: mandateList,
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

exports.GetClientKycBankMandate = async (req, res) => {
    const ClientAccountId = req.params.ClientAccountId;

    var errorMessage = "Error while fetching client mandates...";

    try {
        var bankDataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(ClientAccountId, true));
        const readResult = await readRequest.execute("GetClientKycBankMandate");
        if (readResult.recordset.length > 0) {
            bankDataList = readResult.recordset;
        }

        var data = [];

        if (bankDataList.length > 0) {
            for (let i = 0; i < bankDataList.length; i++) {
                let bankDataItem = bankDataList[i];

                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(bankDataItem.Id, true),
                    ClientKycProfileId: cryptoEngine.ParamEncrypt(bankDataItem.ClientKycProfileId, true),
                    IFSC: bankDataItem.IFSC,
                    BankName: bankDataItem.BankName,
                    BankBranch: bankDataItem.BankBranch,
                    MICR: bankDataItem.MICR,
                    BankAccountTypeId: cryptoEngine.ParamEncrypt(bankDataItem.BankAccountTypeId, true),
                    AccountNumber: bankDataItem.AccountNumber,
                    UPIId: bankDataItem.UPIId,
                    FileTag: bankDataItem.FileTag,
                    IsActive: bankDataItem.IsActive,
                    Name: bankDataItem.Name,
                    BankAccountTypeName: bankDataItem.BankAccountTypeName,
                    BankAccountTypeCode: bankDataItem.BankAccountTypeCode
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

exports.SaveClientAccountMandate = async (req, res) => {
    var { Mode, ClientId, ClientAccountMandates } = req.body;

    let ClientAccountMandatesData = JSON.parse(ClientAccountMandates);

    var errorMessage = "Error while saving client mandate...";

    var accountsDataList = [];

    const readRequest = req.app.locals.db.request();
    readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
    const readResult = await readRequest.execute("GetClientAccounts");
    if (readResult.recordset.length > 0) {
        accountsDataList = readResult.recordset;
    }

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        for (let i = 0; i < ClientAccountMandatesData.length; i++) {
            let item = ClientAccountMandatesData[i];

            if (cryptoEngine.ParamDecrypt(item.Id, true) == 0) {
                const request = transaction.request();
                request.input("ClientAccountId", cryptoEngine.ParamDecrypt(item.ClientAccountId, true))
                    .input("ClientKycBankId", cryptoEngine.ParamDecrypt(item.ClientKycBankId, true))
                    .input("Amount", item.Amount)
                    .input("MandateTypeId", cryptoEngine.ParamDecrypt(item.MandateTypeId, true))
                    .input("Status", "PENDING");
                const result = await request.execute("InsertClientAccountMandate");
            }
            else {
                const request = transaction.request();
                request.input("Id", cryptoEngine.ParamDecrypt(item.Id, true))
                    .input("ClientAccountId", cryptoEngine.ParamDecrypt(item.ClientAccountId, true))
                    .input("ClientKycBankId", cryptoEngine.ParamDecrypt(item.ClientKycBankId, true))
                    .input("Amount", item.Amount)
                    .input("MandateTypeId", cryptoEngine.ParamDecrypt(item.MandateTypeId, true));
                const result = await request.execute("UpdateClientAccountMandate");
            }
        }

        const statusRequest = transaction.request();
        statusRequest.input("Id", cryptoEngine.ParamDecrypt(ClientId, true))
            .input("IsMandateCompleted", true);
        const statusResult = await statusRequest.execute("UpdateMandateCompletedStatus");

        if (Mode == 'verify') {
            for (let i = 0; i < accountsDataList.length; i++) {
                const uccRequest = transaction.request();
                uccRequest.input("Id", accountsDataList[i].Id)
                    .input("Prefix", process.env.BSE_UCC_PREFIX);
                const uccResult = await uccRequest.execute("UpdateClientAccountUCC");
            }

            const statusRequest = transaction.request();
            statusRequest.input("Id", cryptoEngine.ParamDecrypt(ClientId, true))
                .input("IsAdminVerified", true);
            const statusResult = await statusRequest.execute("UpdateClientAdminVerifiedStatus");
        }

        await transaction.commit();

        if (Mode == 'verify') {
            // for (let i = 0; i < accountsDataList.length; i++) {
            //     let accountData = await this.GetClientAccountInfo(req, res, cryptoEngine.ParamEncrypt(accountsDataList[i].Id, true));

            //     let mandateDataList = accountData.AccountMandates.filter(x => x.MandateTypeCode === 'X' && x.BSEMandateId === '');

            //     let endDate = new Date((new Date()).getFullYear() + 40, (new Date()).getMonth(), (new Date()).getDate());
            //     endDate.setDate(endDate.getDate() - 1);

            //     for (let m = 0; m < mandateDataList.length; m++) {
            //         let mandateItem = {
            //             ClientAccountId: accountData.Id,
            //             UCC: accountData.UCC,
            //             AccountMandate: mandateDataList[m],
            //             StartDate: new Date(),
            //             EndDate: endDate
            //         };

            //         var bseResult = await bseService.UploadMandateMFD(mandateItem);
            //     }

            //     let mandatePdfDataList = accountData.AccountMandates.filter(x => x.MandateTypeCode === 'X' && x.BSEMandateId != '' && x.IsMandateScanUploadedToBSE === false);
            //     let firstHolder = accountData.AccountHolders.find(x => x.SerialNumber === 1);;
            //     for (let m = 0; m < mandatePdfDataList.length; m++) {
            //         let mandateItem = {
            //             ClientAccountId: accountData.Id,
            //             UCC: accountData.UCC,
            //             StartDate: new Date(),
            //             EndDate: endDate,
            //             AccountMandate: mandatePdfDataList[m],
            //             AccountFirstHolder: firstHolder,
            //         };

            //         var mandateReportData = await reports.PrepareMandateScanFilePdf(mandateItem);
            //         var mandateResult = await this.SaveClientAccountDocument(req, res, mandateItem.ClientAccountId, mandatePdfDataList[m].Id, 'Mandate', mandateReportData.FileName, mandateReportData.ReportBuffer, 'application/pdf');
            //     }
            // }

            var accountHolderList = [];

            const readRequest = req.app.locals.db.request();
            readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
            const readResult = await readRequest.execute("GetClientAccountFirstHolder");
            if (readResult.recordset.length > 0) {
                accountHolderList = readResult.recordset.filter(x => x.IsLocked == true);
            }

            for (let i = 0; i < accountHolderList.length; i++) {
                let AppUserId = await appUserController.CreateAppUser(req, res, '414E2B5048745659672B513D', accountHolderList[i].PANCardNumber, accountHolderList[i].DateOfBirth, '414E2B5048745659672B513D', '414E2B5048745659672B513D', ClientId, cryptoEngine.ParamEncrypt(accountHolderList[i].Id, true));
            }

            for (let i = 0; i < accountHolderList.length; i++) {
                var timeStamp = new Date();
                var link = process.env.WEB_APP_LINK + '/client-self-verification/' + ClientId + '/' + cryptoEngine.ParamEncrypt(accountHolderList[i].Id, true) + '/' + cryptoEngine.ParamEncrypt('externalverify', true) + "/" + cryptoEngine.ParamEncrypt(timeStamp.toISOString(), true);
                console.log(link);
                emailEngine.SendClientSelfVerification(accountHolderList[i].Email, accountHolderList[i].Name, link);
            }
        }

        res.status(200).send({ Status: true, Message: "Client mandate saved successfully.", Data: { ClientId: ClientId } });
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

exports.GetClientDefaultAddress = async (req, res) => {
    const Id = req.params.ClientId;

    var errorMessage = "Error while fetching client...";

    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(Id, true));
        const readResult = await readRequest.execute("GetClientDefaultAddress");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                LocalAddress: {
                    Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                    ClientKycProfileId: cryptoEngine.ParamEncrypt(dataItem.ClientKycProfileId, true),
                    AddressTypeId: cryptoEngine.ParamEncrypt(dataItem.AddressTypeId, true),
                    Address1: dataItem.Address1,
                    Address2: dataItem.Address2,
                    Address3: dataItem.Address3,
                    City: dataItem.City,
                    CountryId: cryptoEngine.ParamEncrypt(dataItem.CountryId, true),
                    StateId: cryptoEngine.ParamEncrypt(dataItem.StateId, true),
                    PinCode: dataItem.PinCode,
                    IsSameForAll: dataItem.IsSameForAll,
                    UseGuardianAddress: dataItem.UseGuardianAddress
                },
                ForeignAddress: {
                    Id: cryptoEngine.ParamEncrypt(dataItem.ForeignAddressId, true),
                    ClientKycProfileId: cryptoEngine.ParamEncrypt(dataItem.ClientKycProfileId, true),
                    AddressTypeId: cryptoEngine.ParamEncrypt(dataItem.ForeignAddressAddressTypeId, true),
                    Address1: dataItem.ForeignAddressAddress1,
                    Address2: dataItem.ForeignAddressAddress2,
                    Address3: dataItem.ForeignAddressAddress3,
                    City: dataItem.ForeignAddressCity,
                    CountryId: cryptoEngine.ParamEncrypt(dataItem.ForeignAddressCountryId, true),
                    StateId: cryptoEngine.ParamEncrypt(dataItem.ForeignAddressStateId, true),
                    PinCode: dataItem.ForeignAddressPinCode,
                    IsSameForAll: false,
                    UseGuardianAddress: false
                },
            };
        }
        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientDocument = async (req, res) => {
    const ClientKycProfileId = req.params.ClientKycProfileId;
    const Name = req.params.Name;
    const FileName = req.params.FileName;

    var errorMessage = "Error while fetching client...";

    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(ClientKycProfileId, true));
        readRequest.input("Name", Name);
        readRequest.input("FileName", FileName);
        const readResult = await readRequest.execute("GetClientKycProfileDocument");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                ClientKycProfileId: cryptoEngine.ParamEncrypt(dataItem.ClientKycProfileId, true),
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

exports.GetClientAccountDocuments = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching client...";

    try {
        var accountsDataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientAccounts");
        if (readResult.recordset.length > 0) {
            accountsDataList = readResult.recordset;
        }

        var data = [];

        if (accountsDataList.length > 0) {
            for (let i = 0; i < accountsDataList.length; i++) {
                let accountsDataItem = accountsDataList[i];

                var holdersDataList = [];

                const readRequest = req.app.locals.db.request();
                readRequest.input("ClientAccountId", accountsDataItem.Id);
                const readResult = await readRequest.execute("GetClientAccountHolders");
                if (readResult.recordset.length > 0) {
                    holdersDataList = readResult.recordset;
                }

                let holderList = [];
                let accountName = '';
                for (let j = 0; j < holdersDataList.length; j++) {
                    let holderItem = {
                        Id: cryptoEngine.ParamEncrypt(holdersDataList[j].Id, true),
                        ClientAccountId: cryptoEngine.ParamEncrypt(holdersDataList[j].ClientAccountId, true),
                        ClientKycProfileId: cryptoEngine.ParamEncrypt(holdersDataList[j].ClientKycProfileId, true),
                        SerialNumber: holdersDataList[j].SerialNumber,
                        Name: holdersDataList[j].Name
                    };

                    holderList.push(holderItem);

                    if (accountName == '') {
                        accountName += holdersDataList[j].Name;
                    }
                    else {
                        accountName += ' + ' + holdersDataList[j].Name;
                    }
                }

                var documentDataList = [];
                let aofData = null;
                let mandateList = [];
                let loeData = null;
                let niFatcaData = null;

                const readDocumentRequest = req.app.locals.db.request();
                readDocumentRequest.input("ClientAccountId", accountsDataItem.Id);
                const readDocumentResult = await readDocumentRequest.execute("GetClientAccountDocuments");
                if (readDocumentResult.recordset.length > 0) {
                    documentDataList = readDocumentResult.recordset.filter(x => x.DocumentType == 'D');
                }

                for (let j = 0; j < documentDataList.length; j++) {
                    if (documentDataList[j].ClientAccountMandateId != 0 && documentDataList[j].Name == 'Mandate') {
                        let mandateItem = {
                            Id: cryptoEngine.ParamEncrypt(documentDataList[j].Id, true),
                            ClientAccountMandateId: cryptoEngine.ParamEncrypt(documentDataList[j].ClientAccountMandateId, true),
                            Name: documentDataList[j].Name,
                            FileName: documentDataList[j].FileName,
                            FileContentType: documentDataList[j].FileContentType
                        };

                        mandateList.push(mandateItem);
                    }
                    else if (documentDataList[j].Name == 'AOF') {
                        aofData = {
                            Id: cryptoEngine.ParamEncrypt(documentDataList[j].Id, true),
                            ClientAccountMandateId: cryptoEngine.ParamEncrypt(documentDataList[j].ClientAccountMandateId, true),
                            Name: documentDataList[j].Name,
                            FileName: documentDataList[j].FileName,
                            FileContentType: documentDataList[j].FileContentType
                        };
                    }
                    else if (documentDataList[j].Name == 'LOE') {
                        loeData = {
                            Id: cryptoEngine.ParamEncrypt(documentDataList[j].Id, true),
                            ClientAccountMandateId: cryptoEngine.ParamEncrypt(documentDataList[j].ClientAccountMandateId, true),
                            Name: documentDataList[j].Name,
                            FileName: documentDataList[j].FileName,
                            FileContentType: documentDataList[j].FileContentType
                        };
                    }
                    else if (documentDataList[j].Name == 'NI FATCA') {
                        niFatcaData = {
                            Id: cryptoEngine.ParamEncrypt(documentDataList[j].Id, true),
                            ClientAccountMandateId: cryptoEngine.ParamEncrypt(documentDataList[j].ClientAccountMandateId, true),
                            Name: documentDataList[j].Name,
                            FileName: documentDataList[j].FileName,
                            FileContentType: documentDataList[j].FileContentType
                        };
                    }
                }

                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(accountsDataItem.Id, true),
                    ClientId: cryptoEngine.ParamEncrypt(accountsDataItem.ClientId, true),
                    AccountTypeId: cryptoEngine.ParamEncrypt(accountsDataItem.AccountTypeId, true),
                    UCCSerialNumber: accountsDataItem.UCCSerialNumber,
                    UCC: accountsDataItem.UCC,
                    MFUCAN: accountsDataItem.MFUCAN,
                    HasNominee: accountsDataItem.HasNominee,
                    CreateBSEAccount: accountsDataItem.CreateBSEAccount,
                    CreateMFUAccount: accountsDataItem.CreateMFUAccount,
                    CreateP2PAccount: accountsDataItem.CreateP2PAccount,
                    IsSelfVerified: accountsDataItem.IsSelfVerified,
                    SelfVerifiedDate: accountsDataItem.SelfVerifiedDate,
                    IsAccountCreatedAtBSE: accountsDataItem.IsAccountCreatedAtBSE,
                    BSEAccountCreatedDate: accountsDataItem.BSEAccountCreatedDate,
                    ISAOFFileUploadedToBSE: accountsDataItem.ISAOFFileUploadedToBSE,
                    BSEAOFFileUploadedDate: accountsDataItem.BSEAOFFileUploadedDate,
                    IsAccountCreatedAtMFU: accountsDataItem.IsAccountCreatedAtMFU,
                    MFUAccountCreatedDate: accountsDataItem.MFUAccountCreatedDate,
                    IsWelcomeEmailSent: accountsDataItem.IsWelcomeEmailSent,
                    AccountTypeName: accountsDataItem.AccountTypeName,
                    AccountTypeCode: accountsDataItem.AccountTypeCode,
                    AccountHolders: holderList,
                    AccountHolderName: accountName,
                    MandateDocuments: mandateList,
                    AOFDocument: aofData,
                    LOEDocument: loeData,
                    NIFATCADocument: niFatcaData,
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

exports.GetClientAccountDocument = async (req, res) => {
    const ClientAccountId = req.params.ClientAccountId;
    const ClientAccountMandateId = req.params.ClientAccountMandateId;
    const Name = req.params.Name;
    const FileName = req.params.FileName;

    var errorMessage = "Error while fetching client...";

    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(ClientAccountId, true));
        readRequest.input("ClientAccountMandateId", cryptoEngine.ParamDecrypt(ClientAccountMandateId, true));
        readRequest.input("Name", Name);
        readRequest.input("FileName", FileName);
        const readResult = await readRequest.execute("GetClientAccountDocument");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                ClientAccountId: cryptoEngine.ParamEncrypt(dataItem.ClientAccountId, true),
                ClientAccountMandateId: cryptoEngine.ParamEncrypt(dataItem.ClientAccountMandateId, true),
                Name: dataItem.Name,
                FileName: dataItem.FileName,
                FileContent: dataItem.FileContent,
                FileContentType: dataItem.FileContentType,
                DocumentType: dataItem.DocumentType,
            };
        }
        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.SendNotificationAssociateAdmin = async (req, res) => {
    var { ClientId, LeadId } = req.body;

    var errorMessage = "Error while saving notification...";

    try {
        var familyName = '';
        var dataItem;
        var notificationAppUsers = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("Id", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientById");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        if (dataItem != null) {
            const readRequest = req.app.locals.db.request();
            readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
            const readResult = await readRequest.execute("GetClientNotificationAppUserAdmin");
            if (readResult.recordset.length > 0) {
                notificationAppUsers = readResult.recordset;
            }
        }

        if (dataItem != null) {
            familyName = dataItem.FamilyName;

            let title = familyName + ' account received for verification.';
            let link = 'client-introduction/' + ClientId + '/' + LeadId + '/' + cryptoEngine.ParamEncrypt('verify', true);

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
            res.status(200).send({ Status: false, Message: "Invalid client.", Data: null });
        }
    }
    catch (err) {
        console.log(err);

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        res.status(500).send(errorMessage);
    }
};

exports.GetClientAccountUploadDocuments = async (req, res) => {
    const AccountId = req.params.AccountId;

    let errorMessage = "Error while fetching upload documents...";

    try {
        var accountData = await this.GetClientAccountInfo(req, res, AccountId);

        var data;

        if (accountData != null) {
            var documentDataList = [];
            var documentUploadDataList = [];
            let aofData = null;
            let mandateList = [];
            let loeData = null;
            let niFatcaData = null;

            const readDocumentRequest = req.app.locals.db.request();
            readDocumentRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(AccountId, true));
            const readDocumentResult = await readDocumentRequest.execute("GetClientAccountDocuments");
            if (readDocumentResult.recordset.length > 0) {
                documentDataList = readDocumentResult.recordset.filter(x => x.DocumentType = 'D');
                documentUploadDataList = readDocumentResult.recordset.filter(x => x.DocumentType = 'U');
            }

            for (let j = 0; j < documentDataList.length; j++) {
                if (documentDataList[j].ClientAccountMandateId != 0 && documentDataList[j].Name == 'Mandate') {
                    let mandateUploadItem = documentUploadDataList.find(x => (x.ClientAccountMandateId == documentDataList[j].ClientAccountMandateId && x.Name == 'Mandate Scan'));

                    let mandateItem = {
                        Id: (mandateUploadItem != null) ? cryptoEngine.ParamEncrypt(mandateUploadItem.Id, true) : cryptoEngine.ParamEncrypt('0', true),
                        ClientAccountMandateId: cryptoEngine.ParamEncrypt(documentDataList[j].ClientAccountMandateId, true),
                        Name: documentDataList[j].Name + ' Scan',
                        FileName: (mandateUploadItem != null) ? mandateUploadItem.FileName : documentDataList[j].FileName,
                        FileContentType: (mandateUploadItem != null) ? mandateUploadItem.FileContentType : '',
                        FileContent: null,
                        DocumentFileName: (mandateUploadItem != null) ? mandateUploadItem.FileName : '',
                        DocumentFile: null,
                        DocumentFileUrl: '',
                        BSEMandateId: documentDataList[j].BSEMandateId
                    };

                    mandateList.push(mandateItem);
                }
                else if (documentDataList[j].Name == 'AOF') {
                    let aofUploadItem = documentUploadDataList.find(x => x.Name == 'AOF Scan');

                    aofData = {
                        Id: (aofUploadItem != null) ? cryptoEngine.ParamEncrypt(aofUploadItem.Id, true) : cryptoEngine.ParamEncrypt('0', true),
                        ClientAccountMandateId: cryptoEngine.ParamEncrypt(documentDataList[j].ClientAccountMandateId, true),
                        Name: documentDataList[j].Name + ' Scan',
                        FileName: (aofUploadItem != null) ? aofUploadItem.FileName : documentDataList[j].FileName,
                        FileContentType: (aofUploadItem != null) ? aofUploadItem.FileContentType : '',
                        FileContent: null,
                        DocumentFileName: (aofUploadItem != null) ? aofUploadItem.FileName : '',
                        DocumentFile: null,
                        DocumentFileUrl: ''
                    };
                }
                else if (documentDataList[j].Name == 'LOE') {
                    let loeUploadItem = documentUploadDataList.find(x => x.Name == 'LOE Scan');

                    loeData = {
                        Id: (loeUploadItem != null) ? cryptoEngine.ParamEncrypt(loeUploadItem.Id, true) : cryptoEngine.ParamEncrypt('0', true),
                        ClientAccountMandateId: cryptoEngine.ParamEncrypt(documentDataList[j].ClientAccountMandateId, true),
                        Name: documentDataList[j].Name + ' Scan',
                        FileName: (loeUploadItem != null) ? loeUploadItem.FileName : documentDataList[j].FileName,
                        FileContentType: (loeUploadItem != null) ? loeUploadItem.FileContentType : '',
                        FileContent: null,
                        DocumentFileName: (loeUploadItem != null) ? loeUploadItem.FileName : '',
                        DocumentFile: null,
                        DocumentFileUrl: ''
                    };
                }
                else if (documentDataList[j].Name == 'NI FATCA') {
                    let fatcaUploadItem = documentUploadDataList.find(x => x.Name == 'NI FATCA Scan');

                    niFatcaData = {
                        Id: (fatcaUploadItem != null) ? cryptoEngine.ParamEncrypt(fatcaUploadItem.Id, true) : cryptoEngine.ParamEncrypt('0', true),
                        ClientAccountMandateId: cryptoEngine.ParamEncrypt(documentDataList[j].ClientAccountMandateId, true),
                        Name: documentDataList[j].Name + ' Scan',
                        FileName: (fatcaUploadItem != null) ? fatcaUploadItem.FileName : documentDataList[j].FileName,
                        FileContentType: (fatcaUploadItem != null) ? fatcaUploadItem.FileContentType : '',
                        FileContent: null,
                        DocumentFileName: (fatcaUploadItem != null) ? fatcaUploadItem.FileName : '',
                        DocumentFile: null,
                        DocumentFileUrl: ''
                    };
                }
            }

            data = {
                Id: accountData.Id,
                ClientId: accountData.ClientId,
                AssociateCode: accountData.AssociateCode,
                EntityTypeName: accountData.EntityTypeName,
                AssociateName: accountData.AssociateName,
                EUINHolderName: accountData.EUINHolderName,
                ARN: accountData.ARN,
                EUIN: accountData.EUIN,
                AccountTypeId: accountData.AccountTypeId,
                UCCSerialNumber: accountData.UCCSerialNumber,
                UCC: accountData.UCC,
                MFUCAN: accountData.MFUCAN,
                AccountProfileType: accountData.AccountProfileType,
                HasNominee: accountData.HasNominee,
                CreateBSEAccount: accountData.CreateBSEAccount,
                CreateMFUAccount: accountData.CreateMFUAccount,
                CreateP2PAccount: accountData.CreateP2PAccount,
                IsSelfVerified: accountData.IsSelfVerified,
                SelfVerifiedDate: accountData.SelfVerifiedDate,
                IsAccountCreatedAtBSE: accountData.IsAccountCreatedAtBSE,
                BSEAccountCreatedDate: accountData.BSEAccountCreatedDate,
                ISAOFFileUploadedToBSE: accountData.ISAOFFileUploadedToBSE,
                BSEAOFFileUploadedDate: accountData.BSEAOFFileUploadedDate,
                IsAccountCreatedAtMFU: accountData.IsAccountCreatedAtMFU,
                MFUAccountCreatedDate: accountData.MFUAccountCreatedDate,
                AccountTypeName: accountData.AccountTypeName,
                AccountTypeCode: accountData.AccountTypeCode,
                AccountHolderName: accountData.AccountHolderName,
                AccountHolders: accountData.AccountHolders,
                AccountNominees: accountData.AccountNominees,
                AccountBanks: accountData.AccountBanks,
                AccountMandates: accountData.AccountMandates,
                Created: accountData.Created,
                MandateDocuments: mandateList,
                AOFDocument: aofData,
                LOEDocument: loeData,
                NIFATCADocument: niFatcaData,
            };
        }

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientProgress = async (req, res) => {
    const ClientId = req.params.Id;
    var errorMessage = "Error while getting client progress data";
    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("Id", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientProgress");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                IntroductionStatus: dataItem.IntroductionStatus,
                AccountStatus: dataItem.AccountStatus,
                ComprehensiveStatus: dataItem.ComprehensiveStatus,
                TransactionStatus: dataItem.TransactionStatus,
                IsActive: dataItem.IsActive,
                IsAdminVerified: dataItem.IsAdminVerified,
                IsSelfVerified: dataItem.IsSelfVerified,
                IsIntroductionCompleted: dataItem.IsIntroductionCompleted,
                IsComprehensiveCompleted: dataItem.IsComprehensiveCompleted,
                IsIncomeDetailsCompleted: dataItem.IsIncomeDetailsCompleted,
                IsGoalCompleted: dataItem.IsGoalCompleted,
                IsExpenseCompleted: dataItem.IsExpenseCompleted,
                IsInsuranceCompleted: dataItem.IsInsuranceCompleted,
                IsLiabilityCompleted: dataItem.IsLiabilityCompleted,
                IsSurplusCompleted: dataItem.IsSurplusCompleted,
                IsAllocationCompleted: dataItem.IsAllocationCompleted,
                IsCashFlowCompleted: dataItem.IsCashFlowCompleted,
                IsRecommendationCompleted: dataItem.IsRecommendationCompleted,
                IsKycCompleted: dataItem.IsKycCompleted,
                IsAssetAllocationCompleted: dataItem.IsAssetAllocationCompleted,
                IsAccountCompleted: dataItem.IsAccountCompleted,
                IsMandateCompleted: dataItem.IsMandateCompleted,
                IsDownloadCompleted: dataItem.IsDownloadCompleted,
                IsUploadCompleted: dataItem.IsUploadCompleted,
                IsRightsCompleted: dataItem.IsRightsCompleted,
            };
        }
        res.status(200).send({ Status: (dataItem != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientAccountByFirstHolder = async (req, res) => {
    const ClientId = req.params.ClientId;
    const ClientKycProfileId = req.params.ClientKycProfileId;

    var errorMessage = "Error while fetching client...";

    try {
        var accountsDataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
            .input("ClientKycProfileId", cryptoEngine.ParamDecrypt(ClientKycProfileId, true));
        const readResult = await readRequest.execute("GetClientAccountByFirstHolder");
        if (readResult.recordset.length > 0) {
            accountsDataList = readResult.recordset;
        }

        var data = [];

        if (accountsDataList.length > 0) {
            for (let i = 0; i < accountsDataList.length; i++) {
                let accountsDataItem = accountsDataList[i];

                var holdersDataList = [];

                const readRequest = req.app.locals.db.request();
                readRequest.input("ClientAccountId", accountsDataItem.Id);
                const readResult = await readRequest.execute("GetClientAccountHolders");
                if (readResult.recordset.length > 0) {
                    holdersDataList = readResult.recordset;
                }

                let holderList = [];
                let accountName = '';
                for (let j = 0; j < holdersDataList.length; j++) {
                    let holderItem = {
                        Id: cryptoEngine.ParamEncrypt(holdersDataList[j].Id, true),
                        ClientAccountId: cryptoEngine.ParamEncrypt(holdersDataList[j].ClientAccountId, true),
                        ClientKycProfileId: cryptoEngine.ParamEncrypt(holdersDataList[j].ClientKycProfileId, true),
                        SerialNumber: holdersDataList[j].SerialNumber,
                        Name: holdersDataList[j].Name
                    };

                    holderList.push(holderItem);

                    let nameParts = holdersDataList[j].Name.split(' ');

                    if (accountName == '') {
                        accountName += nameParts[0];
                    }
                    else {
                        accountName += ' + ' + nameParts[0];
                    }
                }

                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(accountsDataItem.Id, true),
                    ClientId: cryptoEngine.ParamEncrypt(accountsDataItem.ClientId, true),
                    AccountTypeId: cryptoEngine.ParamEncrypt(accountsDataItem.AccountTypeId, true),
                    HasNominee: accountsDataItem.HasNominee,
                    CreateBSEAccount: accountsDataItem.CreateBSEAccount,
                    CreateMFUAccount: accountsDataItem.CreateMFUAccount,
                    CreateP2PAccount: accountsDataItem.CreateP2PAccount,
                    AccountHolders: holderList,
                    AccountHolderName: accountName,
                };

                data.push(dataItem)
            }
        }
        res.status(200).send({ Status: (data.length > 0), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientAccountDetails = async (req, res) => {
    const Id = req.params.Id;

    var errorMessage = "Error while fetching client...";

    try {
        var data = await this.GetClientAccountInfo(req, res, Id);
        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientAccountInfo = async (req, res, Id) => {
    var accountDataItem;
    var clientDataItem;
    var holderDataList = [];
    var nomineeDataList = [];
    var bankDataList = [];
    var mandateDataList = [];
    var accountHolderName = "";
    var accountHolders = [];
    var accountNominees = [];
    var accountBanks = [];
    var accountMandates = [];
    var accountProfileType = '';

    const readRequest = req.app.locals.db.request();
    readRequest.input("Id", cryptoEngine.ParamDecrypt(Id, true));
    const readResult = await readRequest.execute("GetClientAccountById");
    if (readResult.recordset.length > 0) {
        accountDataItem = readResult.recordset[0];
    }

    if (accountDataItem != null) {
        const readRequest = req.app.locals.db.request();
        readRequest.input("Id", accountDataItem.ClientId);
        const readResult = await readRequest.execute("GetClientById");
        if (readResult.recordset.length > 0) {
            clientDataItem = readResult.recordset[0];
        }
    }

    const readHolderRequest = req.app.locals.db.request();
    readHolderRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(Id, true));
    const readHolderResult = await readHolderRequest.execute("GetClientAccountHolders");
    if (readHolderResult.recordset.length > 0) {
        holderDataList = readHolderResult.recordset;
        for (let h = 0; h < holderDataList.length; h++) {
            switch (holderDataList[h].SerialNumber) {
                case 1:
                    accountHolderName = holderDataList[h].Name;
                    break;
                case 2:
                    accountHolderName += ' + ' + holderDataList[h].Name;
                    break;
                case 3:
                    accountHolderName += ' + ' + holderDataList[h].Name;
                    break;
            }
        }

        for (let h = 0; h < holderDataList.length; h++) {
            let item = holderDataList[h];

            if (item.SerialNumber == 1) {
                accountProfileType = item.ProfileType;
            }

            let guardianData = {
                ClientKycProfileId: cryptoEngine.ParamEncrypt(item.ClientKycProfileId, true),
                ProfileType: '',
                IsMinorProfile: false,
                IsFATCAUploaded: false,
                FATCAUploadedDate: null,
                IsPoliticallyExposed: false,
                ProfileDetails: {
                    Name: '',
                    DateOfBirth: null,
                    RelationId: cryptoEngine.ParamEncrypt('0', true),
                    RelationName: '',
                    TaxStatusId: cryptoEngine.ParamEncrypt('0', true),
                    TaxStatusName: '',
                    TaxStatusCode: '',
                    TaxSlabId: cryptoEngine.ParamEncrypt('0', true),
                    TaxSlabName: '',
                    LifeExpectancy: 0,
                    PANCardNumber: '',
                    CKYCNumber: '',
                    AadharCardNumber: '',
                    CountryCode: '',
                    MobileNumber: '',
                    Email: '',
                    PlaceOfBirth: '',
                    CountryOfBirth: '',
                    CountryOfBirthFATCACode: '',
                    CountryOfBirthCode: '',
                    EmployerName: '',
                    NetWorth: 0,
                    NetWorthDate: null,
                    PlaceOfIncorporation: '',
                    CountryOfIncorporation: '',
                    CountryOfIncorporationFATCACode: '',
                    CountryOfIncorporationCode: '',
                    NatureOfBusiness: '',
                    KycStatusId: cryptoEngine.ParamEncrypt('0', true),
                    KycStatusName: '',
                    OccupationId: cryptoEngine.ParamEncrypt('0', true),
                    OccupationName: '',
                    OccupationCode: '',
                    OccupationType: '',
                    GrossAnnualIncomeId: cryptoEngine.ParamEncrypt('0', true),
                    GrossAnnualIncomeName: '',
                    GrossAnnualIncomeCode: '',
                    WealthSourceId: cryptoEngine.ParamEncrypt('0', true),
                    WealthSourceName: '',
                    WealthSourceCode: '',
                    UBONames: '',
                    GenderId: cryptoEngine.ParamEncrypt('0', true),
                    GenderName: '',
                    GenderCode: '',
                    MobileSelfDeclarationId: cryptoEngine.ParamEncrypt('0', true),
                    MobileSelfDeclarationName: '',
                    MobileSelfDeclarationCode: '',
                    EmailSelfDeclarationId: cryptoEngine.ParamEncrypt('', true),
                    EmailSelfDeclarationName: '',
                    EmailSelfDeclarationCode: '',
                    MemberPANCardFileName: '',
                    MemberKYCFileName: '',
                    BirthCertificateFileName: '',
                    Age: 0,
                    FatherName: '',
                    GuardianRelationId: cryptoEngine.ParamEncrypt('0', true),
                    GuradianRelationName: '',
                    GuardianRelationBSECode: ''
                },
                CommincationDetails: {
                    LocalAddressTypeId: cryptoEngine.ParamEncrypt('', true),
                    LocalAddressTypeName: '',
                    LocalAddressTypeCode: '',
                    LocalAddress1: '',
                    LocalAddress2: '',
                    LocalAddress3: '',
                    LocalCity: '',
                    LocalCountryId: cryptoEngine.ParamEncrypt('0', true),
                    LocalCountryName: '',
                    LocalCountryFATCACode: '',
                    LocalCountryCode: '',
                    LocalStateId: cryptoEngine.ParamEncrypt('0', true),
                    LocalStateName: '',
                    LocalStateCode: '',
                    LocalPinCode: '',
                    ForeignAddressTypeId: cryptoEngine.ParamEncrypt('0', true),
                    ForeignAddressTypeName: '',
                    ForeignAddress1: '',
                    ForeignAddress2: '',
                    ForeignAddress3: '',
                    ForeignCity: '',
                    ForeignCountryId: cryptoEngine.ParamEncrypt('0', true),
                    ForeignCountryName: '',
                    ForeignCountryCode: '',
                    ForeignStateId: cryptoEngine.ParamEncrypt('0', true),
                    ForeignStateName: '',
                    ForeignPinCode: '',
                    LocalAddressFileName: '',
                    ForeignAddressFileName: '',
                },
            };

            let uboDetails = [];

            const readGuardianRequest = req.app.locals.db.request();
            readGuardianRequest.input("ClientKycProfileId", item.GuardianClientKycProfileId);
            const readGuardianResult = await readGuardianRequest.execute("GetClientAccountHolderGuardian");
            if (readGuardianResult.recordset.length > 0) {
                let guardianItem = readGuardianResult.recordset[0];
                guardianData = {
                    ClientKycProfileId: cryptoEngine.ParamEncrypt(item.GuardianClientKycProfileId, true),
                    ProfileType: guardianItem.ProfileType,
                    IsMinorProfile: guardianItem.IsMinorProfile,
                    IsFATCAUploaded: guardianItem.IsFATCAUploaded,
                    FATCAUploadedDate: guardianItem.FATCAUploadedDate,
                    IsPoliticallyExposed: guardianItem.IsPoliticallyExposed,
                    ProfileDetails: {
                        Name: guardianItem.Name,
                        DateOfBirth: guardianItem.DateOfBirth,
                        RelationId: cryptoEngine.ParamEncrypt(guardianItem.RelationId, true),
                        RelationName: guardianItem.RelationName,
                        TaxStatusId: cryptoEngine.ParamEncrypt(guardianItem.TaxStatusId, true),
                        TaxStatusName: guardianItem.TaxStatusName,
                        TaxStatusCode: guardianItem.TaxStatusCode,
                        TaxSlabId: cryptoEngine.ParamEncrypt(guardianItem.TaxSlabId, true),
                        TaxSlabName: guardianItem.TaxSlabName,
                        LifeExpectancy: guardianItem.LifeExpectancy,
                        PANCardNumber: guardianItem.PANCardNumber,
                        CKYCNumber: guardianItem.CKYCNumber,
                        AadharCardNumber: guardianItem.AadharCardNumber,
                        CountryCode: guardianItem.CountryCode,
                        MobileNumber: guardianItem.MobileNumber,
                        Email: guardianItem.Email,
                        PlaceOfBirth: guardianItem.PlaceOfBirth,
                        CountryOfBirth: guardianItem.CountryOfBirth,
                        CountryOfBirthFATCACode: guardianItem.CountryOfBirthFATCACode,
                        CountryOfBirthCode: guardianItem.CountryOfBirthCode,
                        EmployerName: guardianItem.EmployerName,
                        NetWorth: guardianItem.NetWorth,
                        NetWorthDate: guardianItem.NetWorthDate,
                        PlaceOfIncorporation: guardianItem.PlaceOfIncorporation,
                        CountryOfIncorporation: guardianItem.CountryOfIncorporation,
                        CountryOfIncorporationFATCACode: guardianItem.CountryOfIncorporationFATCACode,
                        CountryOfIncorporationCode: guardianItem.CountryOfIncorporationCode,
                        NatureOfBusiness: guardianItem.NatureOfBusiness,
                        KycStatusId: cryptoEngine.ParamEncrypt(guardianItem.KycStatusId, true),
                        KycStatusName: guardianItem.KycStatusName,
                        OccupationId: cryptoEngine.ParamEncrypt(guardianItem.OccupationId, true),
                        OccupationName: guardianItem.OccupationName,
                        OccupationCode: guardianItem.OccupationCode,
                        OccupationType: guardianItem.OccupationType,
                        GrossAnnualIncomeId: cryptoEngine.ParamEncrypt(guardianItem.GrossAnnualIncomeId, true),
                        GrossAnnualIncomeName: guardianItem.GrossAnnualIncomeName,
                        GrossAnnualIncomeCode: guardianItem.GrossAnnualIncomeCode,
                        WealthSourceId: cryptoEngine.ParamEncrypt(guardianItem.WealthSourceId, true),
                        WealthSourceName: guardianItem.WealthSourceName,
                        WealthSourceCode: guardianItem.WealthSourceCode,
                        UBONames: guardianItem.UBONames,
                        GenderId: cryptoEngine.ParamEncrypt(guardianItem.GenderId, true),
                        GenderName: guardianItem.GenderName,
                        GenderCode: guardianItem.GenderCode,
                        MobileSelfDeclarationId: cryptoEngine.ParamEncrypt(guardianItem.MobileSelfDeclarationId, true),
                        MobileSelfDeclarationName: guardianItem.MobileSelfDeclarationName,
                        MobileSelfDeclarationCode: guardianItem.MobileSelfDeclarationCode,
                        EmailSelfDeclarationId: cryptoEngine.ParamEncrypt(guardianItem.EmailSelfDeclarationId, true),
                        EmailSelfDeclarationName: guardianItem.EmailSelfDeclarationName,
                        EmailSelfDeclarationCode: guardianItem.EmailSelfDeclarationCode,
                        MemberPANCardFileName: guardianItem.MemberPANCardFileName,
                        MemberKYCFileName: guardianItem.MemberKYCFileName,
                        BirthCertificateFileName: guardianItem.BirthCertificateFileName,
                        Age: guardianItem.Age,
                        FatherName: guardianItem.FatherName,
                        GuardianRelationId: cryptoEngine.ParamEncrypt(item.GuardianRelationId, true),
                        GuradianRelationName: item.GuradianRelationName,
                        GuardianRelationBSECode: item.GuardianRelationBSECode
                    },
                    CommincationDetails: {
                        LocalAddressTypeId: cryptoEngine.ParamEncrypt(guardianItem.LocalAddressTypeId, true),
                        LocalAddressTypeName: guardianItem.LocalAddressTypeName,
                        LocalAddressTypeCode: guardianItem.LocalAddressTypeCode,
                        LocalAddress1: guardianItem.LocalAddress1,
                        LocalAddress2: guardianItem.LocalAddress2,
                        LocalAddress3: guardianItem.LocalAddress3,
                        LocalCity: guardianItem.LocalCity,
                        LocalCountryId: cryptoEngine.ParamEncrypt(guardianItem.LocalCountryId, true),
                        LocalCountryName: guardianItem.LocalCountryName,
                        LocalCountryFATCACode: guardianItem.LocalCountryFATCACode,
                        LocalCountryCode: guardianItem.LocalCountryCode,
                        LocalStateId: cryptoEngine.ParamEncrypt(guardianItem.LocalStateId, true),
                        LocalStateName: guardianItem.LocalStateName,
                        LocalStateCode: guardianItem.LocalStateCode,
                        LocalPinCode: guardianItem.LocalPinCode,
                        ForeignAddressTypeId: cryptoEngine.ParamEncrypt(guardianItem.ForeignAddressTypeId, true),
                        ForeignAddressTypeName: guardianItem.ForeignAddressTypeName,
                        ForeignAddress1: guardianItem.ForeignAddress1,
                        ForeignAddress2: guardianItem.ForeignAddress2,
                        ForeignAddress3: guardianItem.ForeignAddress3,
                        ForeignCity: guardianItem.ForeignCity,
                        ForeignCountryId: cryptoEngine.ParamEncrypt(guardianItem.ForeignCountryId, true),
                        ForeignCountryName: guardianItem.ForeignCountryName,
                        ForeignCountryCode: guardianItem.ForeignCountryCode,
                        ForeignStateId: cryptoEngine.ParamEncrypt(guardianItem.ForeignStateId, true),
                        ForeignStateName: guardianItem.ForeignStateName,
                        ForeignPinCode: guardianItem.ForeignPinCode,
                        LocalAddressFileName: guardianItem.LocalAddressFileName,
                        ForeignAddressFileName: guardianItem.ForeignAddressFileName,
                    },
                };
            }

            const readUBORequest = req.app.locals.db.request();
            readUBORequest.input("ClientKycProfileId", item.ClientKycProfileId);
            const readUBOResult = await readUBORequest.execute("GetClientKycProfileUbo");
            if (readUBOResult.recordset.length > 0) {
                let uboList = readUBOResult.recordset;
                for (let u = 0; u < uboList.length; u++) {
                    let uboItem = uboList[u];
                    let uboProfile = {
                        Id: cryptoEngine.ParamEncrypt(uboItem.Id, true),
                        ClientKycProfileId: cryptoEngine.ParamEncrypt(uboItem.ClientKycProfileId, true),
                        ClientFamilyId: cryptoEngine.ParamEncrypt(uboItem.ClientFamilyId, true),
                        Name: uboItem.Name,
                        DateOfBirth: uboItem.DateOfBirth,
                        RelationId: cryptoEngine.ParamEncrypt(uboItem.RelationId, true),
                        TaxStatusId: cryptoEngine.ParamEncrypt(uboItem.TaxStatusId, true),
                        TaxSlabId: cryptoEngine.ParamEncrypt(uboItem.TaxSlabId, true),
                        LifeExpectancy: uboItem.LifeExpectancy,
                        RelationName: uboItem.RelationName,
                        TaxStatusName: uboItem.TaxStatusName,
                        TaxStatusCode: uboItem.TaxStatusCode,
                        TaxStatusType: uboItem.TaxStatusType,
                        TaxSlabName: uboItem.TaxSlabName,
                        TaxSlabCode: uboItem.TaxSlabCode,
                        TaxSlabType: uboItem.TaxSlabType,
                        PANCardNumber: uboItem.PANCardNumber,
                        CKYCNumber: uboItem.CKYCNumber,
                        AadharCardNumber: uboItem.AadharCardNumber,
                        CountryCode: uboItem.CountryCode,
                        MobileNumber: uboItem.MobileNumber,
                        Email: uboItem.Email,
                        PlaceOfBirth: uboItem.PlaceOfBirth,
                        CountryOfBirth: uboItem.CountryOfBirth,
                        EmployerName: uboItem.EmployerName,
                        NetWorth: uboItem.NetWorth,
                        NetWorthDate: uboItem.NetWorthDate,
                        PlaceOfIncorporation: uboItem.PlaceOfIncorporation,
                        CountryOfIncorporation: uboItem.CountryOfIncorporation,
                        NatureOfBusiness: uboItem.NatureOfBusiness,
                        KycStatusId: cryptoEngine.ParamEncrypt(uboItem.KycStatusId, true),
                        OccupationId: cryptoEngine.ParamEncrypt(uboItem.OccupationId, true),
                        GrossAnnualIncomeId: cryptoEngine.ParamEncrypt(uboItem.GrossAnnualIncomeId, true),
                        WealthSourceId: cryptoEngine.ParamEncrypt(uboItem.WealthSourceId, true),
                        IsFATCAUploaded: uboItem.IsFATCAUploaded,
                        FATCAUploadedDate: uboItem.FATCAUploadedDate,
                        IsPoliticallyExposed: uboItem.IsPoliticallyExposed,
                        GenderName: uboItem.GenderName,
                        GenderCode: uboItem.GenderCode,
                        OccupationName: uboItem.OccupationName,
                        OccupationCode: uboItem.OccupationCode,
                        OccupationType: uboItem.OccupationType,
                        AddressTypeId: cryptoEngine.ParamEncrypt(uboItem.AddressTypeId, true),
                        Address1: uboItem.Address1,
                        Address2: uboItem.Address2,
                        Address3: uboItem.Address3,
                        City: uboItem.City,
                        CountryId: cryptoEngine.ParamEncrypt(uboItem.CountryId, true),
                        StateId: cryptoEngine.ParamEncrypt(uboItem.StateId, true),
                        PinCode: uboItem.PinCode,
                        CountryName: uboItem.CountryName,
                        CountryCode: uboItem.CountryCode,
                        CountryFATCACode: uboItem.CountryFATCACode,
                        StateName: uboItem.StateName,
                        StateCode: uboItem.StateCode,
                        AddressTypeName: uboItem.AddressTypeName,
                        AddressTypeCode: uboItem.AddressTypeCode,
                    };

                    uboDetails.push(uboProfile);
                }
            }

            let holder = {
                Id: cryptoEngine.ParamEncrypt(item.Id, true),
                ClientAccountId: cryptoEngine.ParamEncrypt(item.ClientAccountId, true),
                ClientKycProfileId: cryptoEngine.ParamEncrypt(item.ClientKycProfileId, true),
                SerialNumber: item.SerialNumber,
                ProfileType: item.ProfileType,
                IsMinorProfile: item.IsMinorProfile,
                IsFATCAUploaded: item.IsFATCAUploaded,
                FATCAUploadedDate: item.FATCAUploadedDate,
                IsPoliticallyExposed: item.IsPoliticallyExposed,
                ProfileDetails: {
                    Name: item.Name,
                    GuardianName: item.GaurdianName,
                    DateOfBirth: item.DateOfBirth,
                    RelationId: cryptoEngine.ParamEncrypt(item.RelationId, true),
                    RelationName: item.RelationName,
                    TaxStatusId: cryptoEngine.ParamEncrypt(item.TaxStatusId, true),
                    TaxStatusName: item.TaxStatusName,
                    TaxStatusCode: item.TaxStatusCode,
                    TaxSlabId: cryptoEngine.ParamEncrypt(item.TaxSlabId, true),
                    TaxSlabName: item.TaxSlabName,
                    LifeExpectancy: item.LifeExpectancy,
                    PANCardNumber: item.PANCardNumber,
                    CKYCNumber: item.CKYCNumber,
                    AadharCardNumber: item.AadharCardNumber,
                    CountryCode: item.CountryCode,
                    MobileNumber: item.MobileNumber,
                    Email: item.Email,
                    PlaceOfBirth: item.PlaceOfBirth,
                    CountryOfBirth: item.CountryOfBirth,
                    CountryOfBirthFATCACode: item.CountryOfBirthFATCACode,
                    CountryOfBirthCode: item.CountryOfBirthCode,
                    EmployerName: item.EmployerName,
                    NetWorth: item.NetWorth,
                    NetWorthDate: item.NetWorthDate,
                    PlaceOfIncorporation: item.PlaceOfIncorporation,
                    CountryOfIncorporation: item.CountryOfIncorporation,
                    CountryOfIncorporationFATCACode: item.CountryOfIncorporationFATCACode,
                    CountryOfIncorporationCode: item.CountryOfIncorporationCode,
                    NatureOfBusiness: item.NatureOfBusiness,
                    KycStatusId: cryptoEngine.ParamEncrypt(item.KycStatusId, true),
                    KycStatusName: item.KycStatusName,
                    OccupationId: cryptoEngine.ParamEncrypt(item.OccupationId, true),
                    OccupationName: item.OccupationName,
                    OccupationCode: item.OccupationCode,
                    OccupationType: item.OccupationType,
                    GrossAnnualIncomeId: cryptoEngine.ParamEncrypt(item.GrossAnnualIncomeId, true),
                    GrossAnnualIncomeName: item.GrossAnnualIncomeName,
                    GrossAnnualIncomeCode: item.GrossAnnualIncomeCode,
                    WealthSourceId: cryptoEngine.ParamEncrypt(item.WealthSourceId, true),
                    WealthSourceName: item.WealthSourceName,
                    WealthSourceCode: item.WealthSourceCode,
                    UBONames: item.UBONames,
                    GenderId: cryptoEngine.ParamEncrypt(item.GenderId, true),
                    GenderName: item.GenderName,
                    GenderCode: item.GenderCode,
                    MobileSelfDeclarationId: cryptoEngine.ParamEncrypt(item.MobileSelfDeclarationId, true),
                    MobileSelfDeclarationName: item.MobileSelfDeclarationName,
                    MobileSelfDeclarationCode: item.MobileSelfDeclarationCode,
                    EmailSelfDeclarationId: cryptoEngine.ParamEncrypt(item.EmailSelfDeclarationId, true),
                    EmailSelfDeclarationName: item.EmailSelfDeclarationName,
                    EmailSelfDeclarationCode: item.EmailSelfDeclarationCode,
                    MemberPANCardFileName: item.MemberPANCardFileName,
                    MemberKYCFileName: item.MemberKYCFileName,
                    BirthCertificateFileName: item.BirthCertificateFileName,
                    Age: item.Age,
                    FatherName: item.FatherName
                },
                CommincationDetails: {
                    LocalAddressTypeId: cryptoEngine.ParamEncrypt(item.LocalAddressTypeId, true),
                    LocalAddressTypeName: item.LocalAddressTypeName,
                    LocalAddressTypeCode: item.LocalAddressTypeCode,
                    LocalAddress1: item.LocalAddress1,
                    LocalAddress2: item.LocalAddress2,
                    LocalAddress3: item.LocalAddress3,
                    LocalCity: item.LocalCity,
                    LocalCountryId: cryptoEngine.ParamEncrypt(item.LocalCountryId, true),
                    LocalCountryName: item.LocalCountryName,
                    LocalCountryFATCACode: item.LocalCountryFATCACode,
                    LocalCountryCode: item.LocalCountryCode,
                    LocalStateId: cryptoEngine.ParamEncrypt(item.LocalStateId, true),
                    LocalStateName: item.LocalStateName,
                    LocalStateCode: item.LocalStateCode,
                    LocalPinCode: item.LocalPinCode,
                    ForeignAddressTypeId: cryptoEngine.ParamEncrypt(item.ForeignAddressTypeId, true),
                    ForeignAddressTypeName: item.ForeignAddressTypeName,
                    ForeignAddress1: item.ForeignAddress1,
                    ForeignAddress2: item.ForeignAddress2,
                    ForeignAddress3: item.ForeignAddress3,
                    ForeignCity: item.ForeignCity,
                    ForeignCountryId: cryptoEngine.ParamEncrypt(item.ForeignCountryId, true),
                    ForeignCountryName: item.ForeignCountryName,
                    ForeignCountryCode: item.ForeignCountryCode,
                    ForeignStateId: cryptoEngine.ParamEncrypt(item.ForeignStateId, true),
                    ForeignStateName: item.ForeignStateName,
                    ForeignPinCode: item.ForeignPinCode,
                    LocalAddressFileName: item.LocalAddressFileName,
                    ForeignAddressFileName: item.ForeignAddressFileName,
                },
                GuardianDetails: guardianData,
                UBODetails: uboDetails,
                Allocation: {
                    LumpsumEquity: item.LumpsumEquity,
                    LumpsumDebt: item.LumpsumDebt,
                    SipEquity: item.SipEquity,
                    SipDebt: item.SipDebt
                }
            };

            // console.log(holder);

            accountHolders.push(holder);
        }
    }

    const readNomineeRequest = req.app.locals.db.request();
    readNomineeRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(Id, true));
    const readNomineeResult = await readNomineeRequest.execute("GetClientAccountNominee");
    if (readNomineeResult.recordset.length > 0) {
        nomineeDataList = readNomineeResult.recordset;

        accountNominees = nomineeDataList.map(item => {
            const Id = cryptoEngine.ParamEncrypt(item.Id, true);
            const ClientAccountId = cryptoEngine.ParamEncrypt(item.ClientAccountId, true);
            const ClientFamilyId = cryptoEngine.ParamEncrypt(item.ClientFamilyId, true);
            const RelationId = cryptoEngine.ParamEncrypt(item.RelationId, true);

            return { ...item, Id, ClientAccountId, ClientFamilyId, RelationId };
        });
    }

    const readBankRequest = req.app.locals.db.request();
    readBankRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(Id, true));
    const readBankResult = await readBankRequest.execute("GetClientAccountBank");
    if (readBankResult.recordset.length > 0) {
        bankDataList = readBankResult.recordset;

        for (let b = 0; b < bankDataList.length; b++) {
            let item = bankDataList[b];

            let bank = {
                Id: cryptoEngine.ParamEncrypt(item.Id, true),
                ClientAccountId: cryptoEngine.ParamEncrypt(item.ClientAccountId, true),
                ClientKycProfileId: cryptoEngine.ParamEncrypt(item.ClientKycProfileId, true),
                ClientKycBankId: cryptoEngine.ParamEncrypt(item.ClientKycBankId, true),
                IsDefault: item.IsDefault,
                IFSC: item.IFSC,
                BankName: item.BankName,
                BankBranch: item.BankBranch,
                MICR: item.MICR,
                BankAccountTypeId: cryptoEngine.ParamEncrypt(item.BankAccountTypeId, true),
                BankAccountTypeName: item.BankAccountTypeName,
                BankAccountTypeCode: item.BankAccountTypeCode,
                AccountNumber: item.AccountNumber,
                UPIId: item.UPIId,
                FileTag: item.FileTag,
                IsActive: item.IsActive,
                BankProofFileName: item.BankProofFileName,
                Address: item.Address,
                City: item.City,
                District: item.District,
                State: item.State,
                RBIId: item.RBIId,
                Name: item.BankName + ' - ' + item.BankAccountTypeCode + ' (' + item.AccountNumber + ')'
            };

            accountBanks.push(bank);
        }
    }

    const readMandateRequest = req.app.locals.db.request();
    readMandateRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(Id, true));
    const readMandateResult = await readMandateRequest.execute("GetClientAccountMandates");
    if (readMandateResult.recordset.length > 0) {
        mandateDataList = readMandateResult.recordset;

        for (let m = 0; m < mandateDataList.length; m++) {
            let item = mandateDataList[m];

            let mandate = {
                Id: cryptoEngine.ParamEncrypt(item.Id, true),
                ClientAccountId: cryptoEngine.ParamEncrypt(item.ClientAccountId, true),
                ClientKycBankId: cryptoEngine.ParamEncrypt(item.ClientKycBankId, true),
                Amount: item.Amount,
                MandateTypeId: cryptoEngine.ParamEncrypt(item.MandateTypeId, true),
                MandateTypeName: item.MandateTypeName,
                MandateTypeCode: item.MandateTypeCode,
                Status: item.Status,
                IFSC: item.IFSC,
                BankName: item.BankName,
                BankBranch: item.BankBranch,
                MICR: item.MICR,
                BankAccountTypeId: cryptoEngine.ParamEncrypt(item.BankAccountTypeId, true),
                BankAccountTypeName: item.BankAccountTypeName,
                BankAccountTypeCode: item.BankAccountTypeCode,
                AccountNumber: item.AccountNumber,
                FileTag: item.FileTag,
                IsActive: item.IsActive,
                BSEMandateId: item.BSEMandateId,
                StartDate: item.StartDate,
                EndDate: item.EndDate,
                IsMandateCreatedAtBSE: item.IsMandateCreatedAtBSE,
                BSEMandateCreatedDate: item.BSEMandateCreatedDate,
                IsMandateScanUploadedToBSE: item.IsMandateScanUploadedToBSE,
                BSEMandateScanUploadedDate: item.BSEMandateScanUploadedDate,
                MMRN: item.MMRN,
                MFUUniqueRefNo: item.MFUUniqueRefNo,
                MFUApproveLink: item.MFUApproveLink,
                MFUStartDate: item.MFUStartDate,
                MFUEndDate: item.MFUEndDate,
                MFUPRN: item.MFUPRN,
                MMRNRegStatus: item.MMRNRegStatus,
                MMRNAggrStatus: item.MMRNAggrStatus,
                DisplayName: item.BSEMandateId + ' | ₹ ' + commonFunction.FormatToINR(item.Amount) + ' | ' + item.BankName + ' | ***' + item.AccountNumber.slice(-4)
            };

            accountMandates.push(mandate);
        }
    }

    var data;

    if (accountDataItem != null && clientDataItem != null) {
        data = {
            Id: cryptoEngine.ParamEncrypt(accountDataItem.Id, true),
            ClientId: cryptoEngine.ParamEncrypt(accountDataItem.ClientId, true),
            LeadId: cryptoEngine.ParamEncrypt(accountDataItem.LeadId, true),
            AssociateId: cryptoEngine.ParamEncrypt(clientDataItem.AssociateId, true),
            FamilyName: accountDataItem.FamilyName,
            BSEMemberId: process.env.BSE_MEMBER_ID,
            AssociateCode: clientDataItem.AssociateCode,
            EntityTypeName: clientDataItem.EntityTypeName,
            AssociateName: clientDataItem.AssociateName,
            AuthorisedPerson1: clientDataItem.AuthorisedPerson1,
            Mobile1: clientDataItem.Mobile1,
            Email1: clientDataItem.Email1,
            EUINHolderName: clientDataItem.EUINHolderName,
            ARN: clientDataItem.ARN,
            RIANumber: clientDataItem.RIANumber,
            EUIN: clientDataItem.EUIN,
            AccountTypeId: cryptoEngine.ParamEncrypt(accountDataItem.AccountTypeId, true),
            UCCSerialNumber: accountDataItem.UCCSerialNumber,
            UCC: accountDataItem.UCC,
            MFUCAN: accountDataItem.MFUCAN,
            MFUCANStatus: accountDataItem.MFUCANStatus,
            LBUserId: accountDataItem.LBUserId,
            AccountProfileType: accountProfileType,
            HasNominee: accountDataItem.HasNominee,
            CreateBSEAccount: accountDataItem.CreateBSEAccount,
            CreateMFUAccount: accountDataItem.CreateMFUAccount,
            CreateP2PAccount: accountDataItem.CreateP2PAccount,
            IsSelfVerified: accountDataItem.IsSelfVerified,
            SelfVerifiedDate: accountDataItem.SelfVerifiedDate,
            IsAccountCreatedAtBSE: accountDataItem.IsAccountCreatedAtBSE,
            BSEAccountCreatedDate: accountDataItem.BSEAccountCreatedDate,
            ISAOFFileUploadedToBSE: accountDataItem.ISAOFFileUploadedToBSE,
            BSEAOFFileUploadedDate: accountDataItem.BSEAOFFileUploadedDate,
            IsAccountCreatedAtMFU: accountDataItem.IsAccountCreatedAtMFU,
            MFUAccountCreatedDate: accountDataItem.MFUAccountCreatedDate,
            IsAccountCreatedAtLB: accountDataItem.IsAccountCreatedAtLB,
            LBAccountCreatedDate: accountDataItem.LBAccountCreatedDate,
            IsWelcomeEmailSent: accountDataItem.IsWelcomeEmailSent,
            AccountTypeName: accountDataItem.AccountTypeName,
            AccountTypeCode: accountDataItem.AccountTypeCode,
            AccountHolderName: accountHolderName,
            AccountHolders: accountHolders,
            AccountNominees: accountNominees,
            AccountBanks: accountBanks,
            AccountMandates: accountMandates,
            Created: accountDataItem.Created,
        };
    }

    return data;
};

exports.GetClientAccountInfoByUcc = async (req, res, UCC) => {
    var clientAccount;
    const readAccountRequest = req.app.locals.db.request();
    readAccountRequest.input("UCC", UCC);
    const readAccountResult = await readAccountRequest.execute("GetClientAccountByUCC");
    if (readAccountResult.recordset.length > 0) {
        let accountData = readAccountResult.recordset[0];

        clientAccount = await this.GetClientAccountInfo(req, res, cryptoEngine.ParamEncrypt(accountData.Id, true));
    }

    return clientAccount;
};

exports.GetClientNonAccountInfo = async (req, res, FirstHolderName, SecondHolderName, ThirdHolderName, FirstNomineeName, SecondNomineeName, ThirdNomineeName, GuardianName) => {
    var accountDataItem;
    var data;
    var accountHolders = [];
    var accountNominees = [];
    var accountBanks = [];
    var accountMandates = [];

    const readRequest = req.app.locals.db.request();
    readRequest.input("FirstHolderName", FirstHolderName)
        .input("SecondHolderName", SecondHolderName)
        .input("ThirdHolderName", ThirdHolderName)
        .input("FirstNomineeName", FirstNomineeName)
        .input("SecondNomineeName", SecondNomineeName)
        .input("ThirdNomineeName", ThirdNomineeName)
        .input("GuardianName", GuardianName);
    const readResult = await readRequest.execute("GetClientNonAccountData");
    if (readResult.recordset.length > 0) {
        accountDataItem = readResult.recordset[0];
    }

    if (accountDataItem != null) {
        if (FirstHolderName != '') {
            var holder = {
                Id: '414e2b5048745659672b513d',
                ClientAccountId: '414e2b5048745659672b513d',
                ClientKycProfileId: '414e2b5048745659672b513d',
                SerialNumber: 1,
                ProfileType: 'F',
                IsMinorProfile: (GuardianName == '') ? false : true,
                IsFATCAUploaded: true,
                FATCAUploadedDate: null,
                IsPoliticallyExposed: false,
                ProfileDetails: {
                    Name: FirstHolderName,
                    GuardianName: '',
                    DateOfBirth: accountDataItem.DateOfBirth,
                    RelationId: '414e2b5048745659672b513d',
                    RelationName: 'Self',
                    TaxStatusId: '414e2b5048745659672b513d',
                    TaxStatusName: accountDataItem.TaxStatus,
                    TaxStatusCode: '',
                    TaxSlabId: '414e2b5048745659672b513d',
                    TaxSlabName: '',
                    LifeExpectancy: 80,
                    PANCardNumber: accountDataItem.FirstHolderPan,
                    CKYCNumber: '',
                    AadharCardNumber: '',
                    CountryCode: '',
                    MobileNumber: accountDataItem.Mobile,
                    Email: accountDataItem.Email,
                    PlaceOfBirth: '',
                    CountryOfBirth: '',
                    CountryOfBirthFATCACode: '',
                    CountryOfBirthCode: '',
                    EmployerName: '',
                    NetWorth: 0,
                    NetWorthDate: null,
                    PlaceOfIncorporation: '',
                    CountryOfIncorporation: '',
                    CountryOfIncorporationFATCACode: '',
                    CountryOfIncorporationCode: '',
                    NatureOfBusiness: '',
                    KycStatusId: '414e2b5048745659672b513d',
                    KycStatusName: '',
                    OccupationId: '414e2b5048745659672b513d',
                    OccupationName: '',
                    OccupationCode: '',
                    OccupationType: '',
                    GrossAnnualIncomeId: '414e2b5048745659672b513d',
                    GrossAnnualIncomeName: '',
                    GrossAnnualIncomeCode: '',
                    WealthSourceId: '414e2b5048745659672b513d',
                    WealthSourceName: '',
                    WealthSourceCode: '',
                    UBONames: '',
                    GenderId: '414e2b5048745659672b513d',
                    GenderName: '',
                    GenderCode: '',
                    MobileSelfDeclarationId: '414e2b5048745659672b513d',
                    MobileSelfDeclarationName: '',
                    MobileSelfDeclarationCode: '',
                    EmailSelfDeclarationId: '414e2b5048745659672b513d',
                    EmailSelfDeclarationName: '',
                    EmailSelfDeclarationCode: '',
                    MemberPANCardFileName: '',
                    MemberKYCFileName: '',
                    BirthCertificateFileName: '',
                    Age: 0,
                    FatherName: ''
                },
                CommincationDetails: {
                    LocalAddressTypeId: '414e2b5048745659672b513d',
                    LocalAddressTypeName: 'Residential',
                    LocalAddressTypeCode: '2',
                    LocalAddress1: accountDataItem.Address1,
                    LocalAddress2: accountDataItem.Address2,
                    LocalAddress3: accountDataItem.Address3,
                    LocalCity: accountDataItem.City,
                    LocalCountryId: '414e2b5048745659672b513d',
                    LocalCountryName: accountDataItem.Country,
                    LocalCountryFATCACode: '',
                    LocalCountryCode: '',
                    LocalStateId: '414e2b5048745659672b513d',
                    LocalStateName: accountDataItem.State,
                    LocalStateCode: '',
                    LocalPinCode: accountDataItem.PinCode,
                    ForeignAddressTypeId: '414e2b5048745659672b513d',
                    ForeignAddressTypeName: '',
                    ForeignAddress1: '',
                    ForeignAddress2: '',
                    ForeignAddress3: '',
                    ForeignCity: '',
                    ForeignCountryId: '414e2b5048745659672b513d',
                    ForeignCountryName: '',
                    ForeignCountryCode: '',
                    ForeignStateId: '414e2b5048745659672b513d',
                    ForeignStateName: '',
                    ForeignPinCode: '',
                    LocalAddressFileName: '',
                    ForeignAddressFileName: ''
                },
                GuardianDetails: {
                    ClientKycProfileId: '414e2b5048745659672b513d',
                    ProfileType: '',
                    IsMinorProfile: false,
                    IsFATCAUploaded: false,
                    FATCAUploadedDate: null,
                    IsPoliticallyExposed: false,
                    ProfileDetails: {
                        Name: GuardianName,
                        DateOfBirth: null,
                        RelationId: '414e2b5048745659672b513d',
                        RelationName: '',
                        TaxStatusId: '414e2b5048745659672b513d',
                        TaxStatusName: '',
                        TaxStatusCode: '',
                        TaxSlabId: '414e2b5048745659672b513d',
                        TaxSlabName: '',
                        LifeExpectancy: 0,
                        PANCardNumber: accountDataItem.GuardianPan,
                        CKYCNumber: '',
                        AadharCardNumber: '',
                        CountryCode: '',
                        MobileNumber: '',
                        Email: '',
                        PlaceOfBirth: '',
                        CountryOfBirth: '',
                        CountryOfBirthFATCACode: '',
                        CountryOfBirthCode: '',
                        EmployerName: '',
                        NetWorth: 0,
                        NetWorthDate: null,
                        PlaceOfIncorporation: '',
                        CountryOfIncorporation: '',
                        CountryOfIncorporationFATCACode: '',
                        CountryOfIncorporationCode: '',
                        NatureOfBusiness: '',
                        KycStatusId: '414e2b5048745659672b513d',
                        KycStatusName: '',
                        OccupationId: '414e2b5048745659672b513d',
                        OccupationName: '',
                        OccupationCode: '',
                        OccupationType: '',
                        GrossAnnualIncomeId: '414e2b5048745659672b513d',
                        GrossAnnualIncomeName: '',
                        GrossAnnualIncomeCode: '',
                        WealthSourceId: '414e2b5048745659672b513d',
                        WealthSourceName: '',
                        WealthSourceCode: '',
                        UBONames: '',
                        GenderId: '414e2b5048745659672b513d',
                        GenderName: '',
                        GenderCode: '',
                        MobileSelfDeclarationId: '414e2b5048745659672b513d',
                        MobileSelfDeclarationName: '',
                        MobileSelfDeclarationCode: '',
                        EmailSelfDeclarationId: '414e2b5048745659672b513d',
                        EmailSelfDeclarationName: '',
                        EmailSelfDeclarationCode: '',
                        MemberPANCardFileName: '',
                        MemberKYCFileName: '',
                        BirthCertificateFileName: '',
                        Age: 0,
                        FatherName: '',
                        GuardianRelationId: '414e2b5048745659672b513d',
                        GuradianRelationName: '',
                        GuardianRelationBSECode: ''
                    },
                    CommincationDetails: {
                        LocalAddressTypeId: '414e2b5048745659672b513d',
                        LocalAddressTypeName: '',
                        LocalAddressTypeCode: '',
                        LocalAddress1: '',
                        LocalAddress2: '',
                        LocalAddress3: '',
                        LocalCity: '',
                        LocalCountryId: '414e2b5048745659672b513d',
                        LocalCountryName: '',
                        LocalCountryFATCACode: '',
                        LocalCountryCode: '',
                        LocalStateId: '414e2b5048745659672b513d',
                        LocalStateName: '',
                        LocalStateCode: '',
                        LocalPinCode: '',
                        ForeignAddressTypeId: '414e2b5048745659672b513d',
                        ForeignAddressTypeName: '',
                        ForeignAddress1: '',
                        ForeignAddress2: '',
                        ForeignAddress3: '',
                        ForeignCity: '',
                        ForeignCountryId: '414e2b5048745659672b513d',
                        ForeignCountryName: '',
                        ForeignCountryCode: '',
                        ForeignStateId: '414e2b5048745659672b513d',
                        ForeignStateName: '',
                        ForeignPinCode: '',
                        LocalAddressFileName: '',
                        ForeignAddressFileName: ''
                    }
                },
                UBODetails: [],
                Allocation: { LumpsumEquity: 0, LumpsumDebt: 0, SipEquity: 0, SipDebt: 0 }
            };

            accountHolders.push(holder);
        }

        if (SecondHolderName != '') {
            var holder = {
                Id: '414e2b5048745659672b513d',
                ClientAccountId: '414e2b5048745659672b513d',
                ClientKycProfileId: '414e2b5048745659672b513d',
                SerialNumber: 2,
                ProfileType: 'F',
                IsMinorProfile: false,
                IsFATCAUploaded: true,
                FATCAUploadedDate: null,
                IsPoliticallyExposed: false,
                ProfileDetails: {
                    Name: SecondHolderName,
                    GuardianName: '',
                    DateOfBirth: accountDataItem.SecondHolderDob,
                    RelationId: '414e2b5048745659672b513d',
                    RelationName: 'Self',
                    TaxStatusId: '414e2b5048745659672b513d',
                    TaxStatusName: '',
                    TaxStatusCode: '',
                    TaxSlabId: '414e2b5048745659672b513d',
                    TaxSlabName: '',
                    LifeExpectancy: 80,
                    PANCardNumber: accountDataItem.SecondHolderPan,
                    CKYCNumber: '',
                    AadharCardNumber: '',
                    CountryCode: '',
                    MobileNumber: '',
                    Email: '',
                    PlaceOfBirth: '',
                    CountryOfBirth: '',
                    CountryOfBirthFATCACode: '',
                    CountryOfBirthCode: '',
                    EmployerName: '',
                    NetWorth: 0,
                    NetWorthDate: null,
                    PlaceOfIncorporation: '',
                    CountryOfIncorporation: '',
                    CountryOfIncorporationFATCACode: '',
                    CountryOfIncorporationCode: '',
                    NatureOfBusiness: '',
                    KycStatusId: '414e2b5048745659672b513d',
                    KycStatusName: '',
                    OccupationId: '414e2b5048745659672b513d',
                    OccupationName: '',
                    OccupationCode: '',
                    OccupationType: '',
                    GrossAnnualIncomeId: '414e2b5048745659672b513d',
                    GrossAnnualIncomeName: '',
                    GrossAnnualIncomeCode: '',
                    WealthSourceId: '414e2b5048745659672b513d',
                    WealthSourceName: '',
                    WealthSourceCode: '',
                    UBONames: '',
                    GenderId: '414e2b5048745659672b513d',
                    GenderName: '',
                    GenderCode: '',
                    MobileSelfDeclarationId: '414e2b5048745659672b513d',
                    MobileSelfDeclarationName: '',
                    MobileSelfDeclarationCode: '',
                    EmailSelfDeclarationId: '414e2b5048745659672b513d',
                    EmailSelfDeclarationName: '',
                    EmailSelfDeclarationCode: '',
                    MemberPANCardFileName: '',
                    MemberKYCFileName: '',
                    BirthCertificateFileName: '',
                    Age: 0,
                    FatherName: ''
                },
                CommincationDetails: {
                    LocalAddressTypeId: '414e2b5048745659672b513d',
                    LocalAddressTypeName: '',
                    LocalAddressTypeCode: '',
                    LocalAddress1: '',
                    LocalAddress2: '',
                    LocalAddress3: '',
                    LocalCity: '',
                    LocalCountryId: '414e2b5048745659672b513d',
                    LocalCountryName: '',
                    LocalCountryFATCACode: '',
                    LocalCountryCode: '',
                    LocalStateId: '414e2b5048745659672b513d',
                    LocalStateName: '',
                    LocalStateCode: '',
                    LocalPinCode: '',
                    ForeignAddressTypeId: '414e2b5048745659672b513d',
                    ForeignAddressTypeName: '',
                    ForeignAddress1: '',
                    ForeignAddress2: '',
                    ForeignAddress3: '',
                    ForeignCity: '',
                    ForeignCountryId: '414e2b5048745659672b513d',
                    ForeignCountryName: '',
                    ForeignCountryCode: '',
                    ForeignStateId: '414e2b5048745659672b513d',
                    ForeignStateName: '',
                    ForeignPinCode: '',
                    LocalAddressFileName: '',
                    ForeignAddressFileName: ''
                },
                GuardianDetails: {
                    ClientKycProfileId: '414e2b5048745659672b513d',
                    ProfileType: '',
                    IsMinorProfile: false,
                    IsFATCAUploaded: false,
                    FATCAUploadedDate: null,
                    IsPoliticallyExposed: false,
                    ProfileDetails: {
                        Name: '',
                        DateOfBirth: null,
                        RelationId: '414e2b5048745659672b513d',
                        RelationName: '',
                        TaxStatusId: '414e2b5048745659672b513d',
                        TaxStatusName: '',
                        TaxStatusCode: '',
                        TaxSlabId: '414e2b5048745659672b513d',
                        TaxSlabName: '',
                        LifeExpectancy: 0,
                        PANCardNumber: '',
                        CKYCNumber: '',
                        AadharCardNumber: '',
                        CountryCode: '',
                        MobileNumber: '',
                        Email: '',
                        PlaceOfBirth: '',
                        CountryOfBirth: '',
                        CountryOfBirthFATCACode: '',
                        CountryOfBirthCode: '',
                        EmployerName: '',
                        NetWorth: 0,
                        NetWorthDate: null,
                        PlaceOfIncorporation: '',
                        CountryOfIncorporation: '',
                        CountryOfIncorporationFATCACode: '',
                        CountryOfIncorporationCode: '',
                        NatureOfBusiness: '',
                        KycStatusId: '414e2b5048745659672b513d',
                        KycStatusName: '',
                        OccupationId: '414e2b5048745659672b513d',
                        OccupationName: '',
                        OccupationCode: '',
                        OccupationType: '',
                        GrossAnnualIncomeId: '414e2b5048745659672b513d',
                        GrossAnnualIncomeName: '',
                        GrossAnnualIncomeCode: '',
                        WealthSourceId: '414e2b5048745659672b513d',
                        WealthSourceName: '',
                        WealthSourceCode: '',
                        UBONames: '',
                        GenderId: '414e2b5048745659672b513d',
                        GenderName: '',
                        GenderCode: '',
                        MobileSelfDeclarationId: '414e2b5048745659672b513d',
                        MobileSelfDeclarationName: '',
                        MobileSelfDeclarationCode: '',
                        EmailSelfDeclarationId: '414e2b5048745659672b513d',
                        EmailSelfDeclarationName: '',
                        EmailSelfDeclarationCode: '',
                        MemberPANCardFileName: '',
                        MemberKYCFileName: '',
                        BirthCertificateFileName: '',
                        Age: 0,
                        FatherName: '',
                        GuardianRelationId: '414e2b5048745659672b513d',
                        GuradianRelationName: '',
                        GuardianRelationBSECode: ''
                    },
                    CommincationDetails: {
                        LocalAddressTypeId: '414e2b5048745659672b513d',
                        LocalAddressTypeName: '',
                        LocalAddressTypeCode: '',
                        LocalAddress1: '',
                        LocalAddress2: '',
                        LocalAddress3: '',
                        LocalCity: '',
                        LocalCountryId: '414e2b5048745659672b513d',
                        LocalCountryName: '',
                        LocalCountryFATCACode: '',
                        LocalCountryCode: '',
                        LocalStateId: '414e2b5048745659672b513d',
                        LocalStateName: '',
                        LocalStateCode: '',
                        LocalPinCode: '',
                        ForeignAddressTypeId: '414e2b5048745659672b513d',
                        ForeignAddressTypeName: '',
                        ForeignAddress1: '',
                        ForeignAddress2: '',
                        ForeignAddress3: '',
                        ForeignCity: '',
                        ForeignCountryId: '414e2b5048745659672b513d',
                        ForeignCountryName: '',
                        ForeignCountryCode: '',
                        ForeignStateId: '414e2b5048745659672b513d',
                        ForeignStateName: '',
                        ForeignPinCode: '',
                        LocalAddressFileName: '',
                        ForeignAddressFileName: ''
                    }
                },
                UBODetails: [],
                Allocation: { LumpsumEquity: 0, LumpsumDebt: 0, SipEquity: 0, SipDebt: 0 }
            };

            accountHolders.push(holder);
        }

        if (ThirdHolderName != '') {
            var holder = {
                Id: '414e2b5048745659672b513d',
                ClientAccountId: '414e2b5048745659672b513d',
                ClientKycProfileId: '414e2b5048745659672b513d',
                SerialNumber: 3,
                ProfileType: 'F',
                IsMinorProfile: false,
                IsFATCAUploaded: true,
                FATCAUploadedDate: null,
                IsPoliticallyExposed: false,
                ProfileDetails: {
                    Name: ThirdHolderName,
                    GuardianName: '',
                    DateOfBirth: accountDataItem.ThirdHolderDob,
                    RelationId: '414e2b5048745659672b513d',
                    RelationName: 'Self',
                    TaxStatusId: '414e2b5048745659672b513d',
                    TaxStatusName: '',
                    TaxStatusCode: '',
                    TaxSlabId: '414e2b5048745659672b513d',
                    TaxSlabName: '',
                    LifeExpectancy: 80,
                    PANCardNumber: accountDataItem.ThirdHolderPan,
                    CKYCNumber: '',
                    AadharCardNumber: '',
                    CountryCode: '',
                    MobileNumber: '',
                    Email: '',
                    PlaceOfBirth: '',
                    CountryOfBirth: '',
                    CountryOfBirthFATCACode: '',
                    CountryOfBirthCode: '',
                    EmployerName: '',
                    NetWorth: 0,
                    NetWorthDate: null,
                    PlaceOfIncorporation: '',
                    CountryOfIncorporation: '',
                    CountryOfIncorporationFATCACode: '',
                    CountryOfIncorporationCode: '',
                    NatureOfBusiness: '',
                    KycStatusId: '414e2b5048745659672b513d',
                    KycStatusName: '',
                    OccupationId: '414e2b5048745659672b513d',
                    OccupationName: '',
                    OccupationCode: '',
                    OccupationType: '',
                    GrossAnnualIncomeId: '414e2b5048745659672b513d',
                    GrossAnnualIncomeName: '',
                    GrossAnnualIncomeCode: '',
                    WealthSourceId: '414e2b5048745659672b513d',
                    WealthSourceName: '',
                    WealthSourceCode: '',
                    UBONames: '',
                    GenderId: '414e2b5048745659672b513d',
                    GenderName: '',
                    GenderCode: '',
                    MobileSelfDeclarationId: '414e2b5048745659672b513d',
                    MobileSelfDeclarationName: '',
                    MobileSelfDeclarationCode: '',
                    EmailSelfDeclarationId: '414e2b5048745659672b513d',
                    EmailSelfDeclarationName: '',
                    EmailSelfDeclarationCode: '',
                    MemberPANCardFileName: '',
                    MemberKYCFileName: '',
                    BirthCertificateFileName: '',
                    Age: 0,
                    FatherName: ''
                },
                CommincationDetails: {
                    LocalAddressTypeId: '414e2b5048745659672b513d',
                    LocalAddressTypeName: '',
                    LocalAddressTypeCode: '',
                    LocalAddress1: '',
                    LocalAddress2: '',
                    LocalAddress3: '',
                    LocalCity: '',
                    LocalCountryId: '414e2b5048745659672b513d',
                    LocalCountryName: '',
                    LocalCountryFATCACode: '',
                    LocalCountryCode: '',
                    LocalStateId: '414e2b5048745659672b513d',
                    LocalStateName: '',
                    LocalStateCode: '',
                    LocalPinCode: '',
                    ForeignAddressTypeId: '414e2b5048745659672b513d',
                    ForeignAddressTypeName: '',
                    ForeignAddress1: '',
                    ForeignAddress2: '',
                    ForeignAddress3: '',
                    ForeignCity: '',
                    ForeignCountryId: '414e2b5048745659672b513d',
                    ForeignCountryName: '',
                    ForeignCountryCode: '',
                    ForeignStateId: '414e2b5048745659672b513d',
                    ForeignStateName: '',
                    ForeignPinCode: '',
                    LocalAddressFileName: '',
                    ForeignAddressFileName: ''
                },
                GuardianDetails: {
                    ClientKycProfileId: '414e2b5048745659672b513d',
                    ProfileType: '',
                    IsMinorProfile: false,
                    IsFATCAUploaded: false,
                    FATCAUploadedDate: null,
                    IsPoliticallyExposed: false,
                    ProfileDetails: {
                        Name: '',
                        DateOfBirth: null,
                        RelationId: '414e2b5048745659672b513d',
                        RelationName: '',
                        TaxStatusId: '414e2b5048745659672b513d',
                        TaxStatusName: '',
                        TaxStatusCode: '',
                        TaxSlabId: '414e2b5048745659672b513d',
                        TaxSlabName: '',
                        LifeExpectancy: 0,
                        PANCardNumber: '',
                        CKYCNumber: '',
                        AadharCardNumber: '',
                        CountryCode: '',
                        MobileNumber: '',
                        Email: '',
                        PlaceOfBirth: '',
                        CountryOfBirth: '',
                        CountryOfBirthFATCACode: '',
                        CountryOfBirthCode: '',
                        EmployerName: '',
                        NetWorth: 0,
                        NetWorthDate: null,
                        PlaceOfIncorporation: '',
                        CountryOfIncorporation: '',
                        CountryOfIncorporationFATCACode: '',
                        CountryOfIncorporationCode: '',
                        NatureOfBusiness: '',
                        KycStatusId: '414e2b5048745659672b513d',
                        KycStatusName: '',
                        OccupationId: '414e2b5048745659672b513d',
                        OccupationName: '',
                        OccupationCode: '',
                        OccupationType: '',
                        GrossAnnualIncomeId: '414e2b5048745659672b513d',
                        GrossAnnualIncomeName: '',
                        GrossAnnualIncomeCode: '',
                        WealthSourceId: '414e2b5048745659672b513d',
                        WealthSourceName: '',
                        WealthSourceCode: '',
                        UBONames: '',
                        GenderId: '414e2b5048745659672b513d',
                        GenderName: '',
                        GenderCode: '',
                        MobileSelfDeclarationId: '414e2b5048745659672b513d',
                        MobileSelfDeclarationName: '',
                        MobileSelfDeclarationCode: '',
                        EmailSelfDeclarationId: '414e2b5048745659672b513d',
                        EmailSelfDeclarationName: '',
                        EmailSelfDeclarationCode: '',
                        MemberPANCardFileName: '',
                        MemberKYCFileName: '',
                        BirthCertificateFileName: '',
                        Age: 0,
                        FatherName: '',
                        GuardianRelationId: '414e2b5048745659672b513d',
                        GuradianRelationName: '',
                        GuardianRelationBSECode: ''
                    },
                    CommincationDetails: {
                        LocalAddressTypeId: '414e2b5048745659672b513d',
                        LocalAddressTypeName: '',
                        LocalAddressTypeCode: '',
                        LocalAddress1: '',
                        LocalAddress2: '',
                        LocalAddress3: '',
                        LocalCity: '',
                        LocalCountryId: '414e2b5048745659672b513d',
                        LocalCountryName: '',
                        LocalCountryFATCACode: '',
                        LocalCountryCode: '',
                        LocalStateId: '414e2b5048745659672b513d',
                        LocalStateName: '',
                        LocalStateCode: '',
                        LocalPinCode: '',
                        ForeignAddressTypeId: '414e2b5048745659672b513d',
                        ForeignAddressTypeName: '',
                        ForeignAddress1: '',
                        ForeignAddress2: '',
                        ForeignAddress3: '',
                        ForeignCity: '',
                        ForeignCountryId: '414e2b5048745659672b513d',
                        ForeignCountryName: '',
                        ForeignCountryCode: '',
                        ForeignStateId: '414e2b5048745659672b513d',
                        ForeignStateName: '',
                        ForeignPinCode: '',
                        LocalAddressFileName: '',
                        ForeignAddressFileName: ''
                    }
                },
                UBODetails: [],
                Allocation: { LumpsumEquity: 0, LumpsumDebt: 0, SipEquity: 0, SipDebt: 0 }
            };

            accountHolders.push(holder);
        }

        if (FirstNomineeName != '') {
            var nominee = {
                Id: '414e2b5048745659672b513d',
                ClientAccountId: '414e2b5048745659672b513d',
                ClientFamilyId: '414e2b5048745659672b513d',
                NomineeName: accountDataItem.Nominee1FLName,
                RelationId: '414e2b5048745659672b513d',
                RelationName: accountDataItem.NomineeRelation,
                Shares: accountDataItem.NomineePercentage,
                GuardianName: '',
                IsMinorProfile: 0,
                Age: 0,
                DateOfBirth: null,
                GuardianDateOfBirth: null,
                RelationBSECode: '',
                PANCardNumber: '',
                CKYCNumber: '',
                AadharCardNumber: '',
                CountryCode: '',
                MobileNumber: '',
                Email: '',
                PlaceOfBirth: '',
                CountryOfBirth: '',
                EmployerName: '',
                NetWorth: 0,
                NetWorthDate: null,
                PlaceOfIncorporation: '',
                CountryOfIncorporation: '',
                NatureOfBusiness: '',
                KycStatusId: '',
                OccupationId: '',
                GrossAnnualIncomeId: '',
                WealthSourceId: '',
                IsFATCAUploaded: true,
                FATCAUploadedDate: null,
                IsPoliticallyExposed: false,
                Address1: accountDataItem.NomineeAddress1,
                Address2: accountDataItem.NomineeAddress2,
                Address3: accountDataItem.NomineeAddress3,
                City: accountDataItem.NomineeCity,
                PinCode: accountDataItem.NomineePincode,
                CountryName: '',
                StateName: accountDataItem.NomineeState
            };

            accountNominees.push(nominee);
        }

        if (SecondNomineeName != '') {
            var nominee = {
                Id: '414e2b5048745659672b513d',
                ClientAccountId: '414e2b5048745659672b513d',
                ClientFamilyId: '414e2b5048745659672b513d',
                NomineeName: accountDataItem.Nominee2FLName,
                RelationId: '414e2b5048745659672b513d',
                RelationName: accountDataItem.Nominee2Relation,
                Shares: accountDataItem.Nominee2Percentage,
                GuardianName: '',
                IsMinorProfile: 0,
                Age: 0,
                DateOfBirth: null,
                GuardianDateOfBirth: null,
                RelationBSECode: '',
                PANCardNumber: '',
                CKYCNumber: '',
                AadharCardNumber: '',
                CountryCode: '',
                MobileNumber: '',
                Email: '',
                PlaceOfBirth: '',
                CountryOfBirth: '',
                EmployerName: '',
                NetWorth: 0,
                NetWorthDate: null,
                PlaceOfIncorporation: '',
                CountryOfIncorporation: '',
                NatureOfBusiness: '',
                KycStatusId: '',
                OccupationId: '',
                GrossAnnualIncomeId: '',
                WealthSourceId: '',
                IsFATCAUploaded: true,
                FATCAUploadedDate: null,
                IsPoliticallyExposed: false,
                Address1: accountDataItem.Nominee2Address1,
                Address2: accountDataItem.Nominee2Address2,
                Address3: accountDataItem.Nominee2Address3,
                City: accountDataItem.Nominee2City,
                PinCode: accountDataItem.Nominee2Pincode,
                CountryName: '',
                StateName: accountDataItem.Nominee2State
            };

            accountNominees.push(nominee);
        }

        if (ThirdNomineeName != '') {
            var nominee = {
                Id: '414e2b5048745659672b513d',
                ClientAccountId: '414e2b5048745659672b513d',
                ClientFamilyId: '414e2b5048745659672b513d',
                NomineeName: accountDataItem.Nominee3FLName,
                RelationId: '414e2b5048745659672b513d',
                RelationName: accountDataItem.Nominee3Relation,
                Shares: accountDataItem.Nominee3Percentage,
                GuardianName: '',
                IsMinorProfile: 0,
                Age: 0,
                DateOfBirth: null,
                GuardianDateOfBirth: null,
                RelationBSECode: '',
                PANCardNumber: '',
                CKYCNumber: '',
                AadharCardNumber: '',
                CountryCode: '',
                MobileNumber: '',
                Email: '',
                PlaceOfBirth: '',
                CountryOfBirth: '',
                EmployerName: '',
                NetWorth: 0,
                NetWorthDate: null,
                PlaceOfIncorporation: '',
                CountryOfIncorporation: '',
                NatureOfBusiness: '',
                KycStatusId: '',
                OccupationId: '',
                GrossAnnualIncomeId: '',
                WealthSourceId: '',
                IsFATCAUploaded: true,
                FATCAUploadedDate: null,
                IsPoliticallyExposed: false,
                Address1: accountDataItem.Nominee3Address1,
                Address2: accountDataItem.Nominee3Address2,
                Address3: accountDataItem.Nominee3Address3,
                City: accountDataItem.Nominee3City,
                PinCode: accountDataItem.Nominee3Pincode,
                CountryName: '',
                StateName: accountDataItem.Nominee3State
            };

            accountNominees.push(nominee);
        }

        if (accountDataItem.AccountNo != '') {
            var bank = {
                Id: '414e2b5048745659672b513d',
                ClientAccountId: '414e2b5048745659672b513d',
                ClientKycProfileId: '414e2b5048745659672b513d',
                ClientKycBankId: '414e2b5048745659672b513d',
                IsDefault: true,
                IFSC: accountDataItem.BankIFSCCode,
                BankName: accountDataItem.BankName,
                BankBranch: accountDataItem.BankBranch,
                MICR: '',
                BankAccountTypeId: '414e2b5048745659672b513d',
                BankAccountTypeName: '',
                BankAccountTypeCode: accountDataItem.AccountType,
                AccountNumber: accountDataItem.AccountNo,
                UPIId: '',
                FileTag: '',
                IsActive: true,
                BankProofFileName: '',
                Address: accountDataItem.BankAddress1 + ' ' + accountDataItem.BankAddress2 + ' ' + accountDataItem.BankAddress3,
                City: accountDataItem.BankCity,
                District: '',
                State: accountDataItem.BankState,
                RBIId: '',
                Name: accountDataItem.BankName + '- ' + accountDataItem.AccountType + ' (' + accountDataItem.AccountNo + ')'
            };

            accountBanks.push(bank);
        }

        data = {
            Id: '414e2b5048745659672b513d',
            ClientId: '414e2b5048745659672b513d',
            LeadId: '414e2b5048745659672b513d',
            AssociateId: '414e2b5048745659672b513d',
            FamilyName: '',
            BSEMemberId: '19941',
            AssociateCode: accountDataItem.SubBrokerCode.replace('19941', ''),
            EntityTypeName: '',
            AssociateName: '',
            AuthorisedPerson1: '',
            Mobile1: '',
            Email1: '',
            EUINHolderName: '',
            ARN: accountDataItem.BrokerCode.replace('ARN-', ''),
            RIANumber: '',
            EUIN: '',
            AccountTypeId: '414e2b5048745659672b513d',
            UCCSerialNumber: 0,
            UCC: '',
            MFUCAN: '',
            MFUCANStatus: '',
            LBUserId: '',
            AccountProfileType: 'F',
            HasNominee: true,
            CreateBSEAccount: true,
            CreateMFUAccount: false,
            CreateP2PAccount: false,
            IsSelfVerified: true,
            SelfVerifiedDate: null,
            IsAccountCreatedAtBSE: true,
            BSEAccountCreatedDate: null,
            ISAOFFileUploadedToBSE: true,
            BSEAOFFileUploadedDate: null,
            IsAccountCreatedAtMFU: false,
            MFUAccountCreatedDate: null,
            IsAccountCreatedAtLB: false,
            LBAccountCreatedDate: null,
            AccountTypeName: accountDataItem.HoldingNature,
            AccountTypeCode: '',
            AccountHolderName: accountDataItem.FirstHolderName,
            AccountHolders: accountHolders,
            AccountNominees: accountNominees,
            AccountBanks: accountBanks,
            AccountMandates: accountMandates,
            Created: accountDataItem.Created
        };
    }
    else {
        if (FirstHolderName != '') {
            var holder = {
                Id: '414e2b5048745659672b513d',
                ClientAccountId: '414e2b5048745659672b513d',
                ClientKycProfileId: '414e2b5048745659672b513d',
                SerialNumber: 1,
                ProfileType: 'F',
                IsMinorProfile: (GuardianName == '') ? false : true,
                IsFATCAUploaded: true,
                FATCAUploadedDate: null,
                IsPoliticallyExposed: false,
                ProfileDetails: {
                    Name: FirstHolderName,
                    GuardianName: '',
                    DateOfBirth: null,
                    RelationId: '414e2b5048745659672b513d',
                    RelationName: 'Self',
                    TaxStatusId: '414e2b5048745659672b513d',
                    TaxStatusName: '',
                    TaxStatusCode: '',
                    TaxSlabId: '414e2b5048745659672b513d',
                    TaxSlabName: '',
                    LifeExpectancy: 80,
                    PANCardNumber: '',
                    CKYCNumber: '',
                    AadharCardNumber: '',
                    CountryCode: '',
                    MobileNumber: '',
                    Email: '',
                    PlaceOfBirth: '',
                    CountryOfBirth: '',
                    CountryOfBirthFATCACode: '',
                    CountryOfBirthCode: '',
                    EmployerName: '',
                    NetWorth: 0,
                    NetWorthDate: null,
                    PlaceOfIncorporation: '',
                    CountryOfIncorporation: '',
                    CountryOfIncorporationFATCACode: '',
                    CountryOfIncorporationCode: '',
                    NatureOfBusiness: '',
                    KycStatusId: '414e2b5048745659672b513d',
                    KycStatusName: '',
                    OccupationId: '414e2b5048745659672b513d',
                    OccupationName: '',
                    OccupationCode: '',
                    OccupationType: '',
                    GrossAnnualIncomeId: '414e2b5048745659672b513d',
                    GrossAnnualIncomeName: '',
                    GrossAnnualIncomeCode: '',
                    WealthSourceId: '414e2b5048745659672b513d',
                    WealthSourceName: '',
                    WealthSourceCode: '',
                    UBONames: '',
                    GenderId: '414e2b5048745659672b513d',
                    GenderName: '',
                    GenderCode: '',
                    MobileSelfDeclarationId: '414e2b5048745659672b513d',
                    MobileSelfDeclarationName: '',
                    MobileSelfDeclarationCode: '',
                    EmailSelfDeclarationId: '414e2b5048745659672b513d',
                    EmailSelfDeclarationName: '',
                    EmailSelfDeclarationCode: '',
                    MemberPANCardFileName: '',
                    MemberKYCFileName: '',
                    BirthCertificateFileName: '',
                    Age: 0,
                    FatherName: ''
                },
                CommincationDetails: {
                    LocalAddressTypeId: '414e2b5048745659672b513d',
                    LocalAddressTypeName: 'Residential',
                    LocalAddressTypeCode: '2',
                    LocalAddress1: '',
                    LocalAddress2: '',
                    LocalAddress3: '',
                    LocalCity: '',
                    LocalCountryId: '414e2b5048745659672b513d',
                    LocalCountryName: '',
                    LocalCountryFATCACode: '',
                    LocalCountryCode: '',
                    LocalStateId: '414e2b5048745659672b513d',
                    LocalStateName: '',
                    LocalStateCode: '',
                    LocalPinCode: '',
                    ForeignAddressTypeId: '414e2b5048745659672b513d',
                    ForeignAddressTypeName: '',
                    ForeignAddress1: '',
                    ForeignAddress2: '',
                    ForeignAddress3: '',
                    ForeignCity: '',
                    ForeignCountryId: '414e2b5048745659672b513d',
                    ForeignCountryName: '',
                    ForeignCountryCode: '',
                    ForeignStateId: '414e2b5048745659672b513d',
                    ForeignStateName: '',
                    ForeignPinCode: '',
                    LocalAddressFileName: '',
                    ForeignAddressFileName: ''
                },
                GuardianDetails: {
                    ClientKycProfileId: '414e2b5048745659672b513d',
                    ProfileType: '',
                    IsMinorProfile: false,
                    IsFATCAUploaded: false,
                    FATCAUploadedDate: null,
                    IsPoliticallyExposed: false,
                    ProfileDetails: {
                        Name: GuardianName,
                        DateOfBirth: null,
                        RelationId: '414e2b5048745659672b513d',
                        RelationName: '',
                        TaxStatusId: '414e2b5048745659672b513d',
                        TaxStatusName: '',
                        TaxStatusCode: '',
                        TaxSlabId: '414e2b5048745659672b513d',
                        TaxSlabName: '',
                        LifeExpectancy: 0,
                        PANCardNumber: '',
                        CKYCNumber: '',
                        AadharCardNumber: '',
                        CountryCode: '',
                        MobileNumber: '',
                        Email: '',
                        PlaceOfBirth: '',
                        CountryOfBirth: '',
                        CountryOfBirthFATCACode: '',
                        CountryOfBirthCode: '',
                        EmployerName: '',
                        NetWorth: 0,
                        NetWorthDate: null,
                        PlaceOfIncorporation: '',
                        CountryOfIncorporation: '',
                        CountryOfIncorporationFATCACode: '',
                        CountryOfIncorporationCode: '',
                        NatureOfBusiness: '',
                        KycStatusId: '414e2b5048745659672b513d',
                        KycStatusName: '',
                        OccupationId: '414e2b5048745659672b513d',
                        OccupationName: '',
                        OccupationCode: '',
                        OccupationType: '',
                        GrossAnnualIncomeId: '414e2b5048745659672b513d',
                        GrossAnnualIncomeName: '',
                        GrossAnnualIncomeCode: '',
                        WealthSourceId: '414e2b5048745659672b513d',
                        WealthSourceName: '',
                        WealthSourceCode: '',
                        UBONames: '',
                        GenderId: '414e2b5048745659672b513d',
                        GenderName: '',
                        GenderCode: '',
                        MobileSelfDeclarationId: '414e2b5048745659672b513d',
                        MobileSelfDeclarationName: '',
                        MobileSelfDeclarationCode: '',
                        EmailSelfDeclarationId: '414e2b5048745659672b513d',
                        EmailSelfDeclarationName: '',
                        EmailSelfDeclarationCode: '',
                        MemberPANCardFileName: '',
                        MemberKYCFileName: '',
                        BirthCertificateFileName: '',
                        Age: 0,
                        FatherName: '',
                        GuardianRelationId: '414e2b5048745659672b513d',
                        GuradianRelationName: '',
                        GuardianRelationBSECode: ''
                    },
                    CommincationDetails: {
                        LocalAddressTypeId: '414e2b5048745659672b513d',
                        LocalAddressTypeName: '',
                        LocalAddressTypeCode: '',
                        LocalAddress1: '',
                        LocalAddress2: '',
                        LocalAddress3: '',
                        LocalCity: '',
                        LocalCountryId: '414e2b5048745659672b513d',
                        LocalCountryName: '',
                        LocalCountryFATCACode: '',
                        LocalCountryCode: '',
                        LocalStateId: '414e2b5048745659672b513d',
                        LocalStateName: '',
                        LocalStateCode: '',
                        LocalPinCode: '',
                        ForeignAddressTypeId: '414e2b5048745659672b513d',
                        ForeignAddressTypeName: '',
                        ForeignAddress1: '',
                        ForeignAddress2: '',
                        ForeignAddress3: '',
                        ForeignCity: '',
                        ForeignCountryId: '414e2b5048745659672b513d',
                        ForeignCountryName: '',
                        ForeignCountryCode: '',
                        ForeignStateId: '414e2b5048745659672b513d',
                        ForeignStateName: '',
                        ForeignPinCode: '',
                        LocalAddressFileName: '',
                        ForeignAddressFileName: ''
                    }
                },
                UBODetails: [],
                Allocation: { LumpsumEquity: 0, LumpsumDebt: 0, SipEquity: 0, SipDebt: 0 }
            };

            accountHolders.push(holder);
        }

        if (SecondHolderName != '') {
            var holder = {
                Id: '414e2b5048745659672b513d',
                ClientAccountId: '414e2b5048745659672b513d',
                ClientKycProfileId: '414e2b5048745659672b513d',
                SerialNumber: 2,
                ProfileType: 'F',
                IsMinorProfile: false,
                IsFATCAUploaded: true,
                FATCAUploadedDate: null,
                IsPoliticallyExposed: false,
                ProfileDetails: {
                    Name: SecondHolderName,
                    GuardianName: '',
                    DateOfBirth: null,
                    RelationId: '414e2b5048745659672b513d',
                    RelationName: 'Self',
                    TaxStatusId: '414e2b5048745659672b513d',
                    TaxStatusName: '',
                    TaxStatusCode: '',
                    TaxSlabId: '414e2b5048745659672b513d',
                    TaxSlabName: '',
                    LifeExpectancy: 80,
                    PANCardNumber: '',
                    CKYCNumber: '',
                    AadharCardNumber: '',
                    CountryCode: '',
                    MobileNumber: '',
                    Email: '',
                    PlaceOfBirth: '',
                    CountryOfBirth: '',
                    CountryOfBirthFATCACode: '',
                    CountryOfBirthCode: '',
                    EmployerName: '',
                    NetWorth: 0,
                    NetWorthDate: null,
                    PlaceOfIncorporation: '',
                    CountryOfIncorporation: '',
                    CountryOfIncorporationFATCACode: '',
                    CountryOfIncorporationCode: '',
                    NatureOfBusiness: '',
                    KycStatusId: '414e2b5048745659672b513d',
                    KycStatusName: '',
                    OccupationId: '414e2b5048745659672b513d',
                    OccupationName: '',
                    OccupationCode: '',
                    OccupationType: '',
                    GrossAnnualIncomeId: '414e2b5048745659672b513d',
                    GrossAnnualIncomeName: '',
                    GrossAnnualIncomeCode: '',
                    WealthSourceId: '414e2b5048745659672b513d',
                    WealthSourceName: '',
                    WealthSourceCode: '',
                    UBONames: '',
                    GenderId: '414e2b5048745659672b513d',
                    GenderName: '',
                    GenderCode: '',
                    MobileSelfDeclarationId: '414e2b5048745659672b513d',
                    MobileSelfDeclarationName: '',
                    MobileSelfDeclarationCode: '',
                    EmailSelfDeclarationId: '414e2b5048745659672b513d',
                    EmailSelfDeclarationName: '',
                    EmailSelfDeclarationCode: '',
                    MemberPANCardFileName: '',
                    MemberKYCFileName: '',
                    BirthCertificateFileName: '',
                    Age: 0,
                    FatherName: ''
                },
                CommincationDetails: {
                    LocalAddressTypeId: '414e2b5048745659672b513d',
                    LocalAddressTypeName: '',
                    LocalAddressTypeCode: '',
                    LocalAddress1: '',
                    LocalAddress2: '',
                    LocalAddress3: '',
                    LocalCity: '',
                    LocalCountryId: '414e2b5048745659672b513d',
                    LocalCountryName: '',
                    LocalCountryFATCACode: '',
                    LocalCountryCode: '',
                    LocalStateId: '414e2b5048745659672b513d',
                    LocalStateName: '',
                    LocalStateCode: '',
                    LocalPinCode: '',
                    ForeignAddressTypeId: '414e2b5048745659672b513d',
                    ForeignAddressTypeName: '',
                    ForeignAddress1: '',
                    ForeignAddress2: '',
                    ForeignAddress3: '',
                    ForeignCity: '',
                    ForeignCountryId: '414e2b5048745659672b513d',
                    ForeignCountryName: '',
                    ForeignCountryCode: '',
                    ForeignStateId: '414e2b5048745659672b513d',
                    ForeignStateName: '',
                    ForeignPinCode: '',
                    LocalAddressFileName: '',
                    ForeignAddressFileName: ''
                },
                GuardianDetails: {
                    ClientKycProfileId: '414e2b5048745659672b513d',
                    ProfileType: '',
                    IsMinorProfile: false,
                    IsFATCAUploaded: false,
                    FATCAUploadedDate: null,
                    IsPoliticallyExposed: false,
                    ProfileDetails: {
                        Name: '',
                        DateOfBirth: null,
                        RelationId: '414e2b5048745659672b513d',
                        RelationName: '',
                        TaxStatusId: '414e2b5048745659672b513d',
                        TaxStatusName: '',
                        TaxStatusCode: '',
                        TaxSlabId: '414e2b5048745659672b513d',
                        TaxSlabName: '',
                        LifeExpectancy: 0,
                        PANCardNumber: '',
                        CKYCNumber: '',
                        AadharCardNumber: '',
                        CountryCode: '',
                        MobileNumber: '',
                        Email: '',
                        PlaceOfBirth: '',
                        CountryOfBirth: '',
                        CountryOfBirthFATCACode: '',
                        CountryOfBirthCode: '',
                        EmployerName: '',
                        NetWorth: 0,
                        NetWorthDate: null,
                        PlaceOfIncorporation: '',
                        CountryOfIncorporation: '',
                        CountryOfIncorporationFATCACode: '',
                        CountryOfIncorporationCode: '',
                        NatureOfBusiness: '',
                        KycStatusId: '414e2b5048745659672b513d',
                        KycStatusName: '',
                        OccupationId: '414e2b5048745659672b513d',
                        OccupationName: '',
                        OccupationCode: '',
                        OccupationType: '',
                        GrossAnnualIncomeId: '414e2b5048745659672b513d',
                        GrossAnnualIncomeName: '',
                        GrossAnnualIncomeCode: '',
                        WealthSourceId: '414e2b5048745659672b513d',
                        WealthSourceName: '',
                        WealthSourceCode: '',
                        UBONames: '',
                        GenderId: '414e2b5048745659672b513d',
                        GenderName: '',
                        GenderCode: '',
                        MobileSelfDeclarationId: '414e2b5048745659672b513d',
                        MobileSelfDeclarationName: '',
                        MobileSelfDeclarationCode: '',
                        EmailSelfDeclarationId: '414e2b5048745659672b513d',
                        EmailSelfDeclarationName: '',
                        EmailSelfDeclarationCode: '',
                        MemberPANCardFileName: '',
                        MemberKYCFileName: '',
                        BirthCertificateFileName: '',
                        Age: 0,
                        FatherName: '',
                        GuardianRelationId: '414e2b5048745659672b513d',
                        GuradianRelationName: '',
                        GuardianRelationBSECode: ''
                    },
                    CommincationDetails: {
                        LocalAddressTypeId: '414e2b5048745659672b513d',
                        LocalAddressTypeName: '',
                        LocalAddressTypeCode: '',
                        LocalAddress1: '',
                        LocalAddress2: '',
                        LocalAddress3: '',
                        LocalCity: '',
                        LocalCountryId: '414e2b5048745659672b513d',
                        LocalCountryName: '',
                        LocalCountryFATCACode: '',
                        LocalCountryCode: '',
                        LocalStateId: '414e2b5048745659672b513d',
                        LocalStateName: '',
                        LocalStateCode: '',
                        LocalPinCode: '',
                        ForeignAddressTypeId: '414e2b5048745659672b513d',
                        ForeignAddressTypeName: '',
                        ForeignAddress1: '',
                        ForeignAddress2: '',
                        ForeignAddress3: '',
                        ForeignCity: '',
                        ForeignCountryId: '414e2b5048745659672b513d',
                        ForeignCountryName: '',
                        ForeignCountryCode: '',
                        ForeignStateId: '414e2b5048745659672b513d',
                        ForeignStateName: '',
                        ForeignPinCode: '',
                        LocalAddressFileName: '',
                        ForeignAddressFileName: ''
                    }
                },
                UBODetails: [],
                Allocation: { LumpsumEquity: 0, LumpsumDebt: 0, SipEquity: 0, SipDebt: 0 }
            };

            accountHolders.push(holder);
        }

        if (ThirdHolderName != '') {
            var holder = {
                Id: '414e2b5048745659672b513d',
                ClientAccountId: '414e2b5048745659672b513d',
                ClientKycProfileId: '414e2b5048745659672b513d',
                SerialNumber: 3,
                ProfileType: 'F',
                IsMinorProfile: false,
                IsFATCAUploaded: true,
                FATCAUploadedDate: null,
                IsPoliticallyExposed: false,
                ProfileDetails: {
                    Name: ThirdHolderName,
                    GuardianName: '',
                    DateOfBirth: null,
                    RelationId: '414e2b5048745659672b513d',
                    RelationName: 'Self',
                    TaxStatusId: '414e2b5048745659672b513d',
                    TaxStatusName: '',
                    TaxStatusCode: '',
                    TaxSlabId: '414e2b5048745659672b513d',
                    TaxSlabName: '',
                    LifeExpectancy: 80,
                    PANCardNumber: '',
                    CKYCNumber: '',
                    AadharCardNumber: '',
                    CountryCode: '',
                    MobileNumber: '',
                    Email: '',
                    PlaceOfBirth: '',
                    CountryOfBirth: '',
                    CountryOfBirthFATCACode: '',
                    CountryOfBirthCode: '',
                    EmployerName: '',
                    NetWorth: 0,
                    NetWorthDate: null,
                    PlaceOfIncorporation: '',
                    CountryOfIncorporation: '',
                    CountryOfIncorporationFATCACode: '',
                    CountryOfIncorporationCode: '',
                    NatureOfBusiness: '',
                    KycStatusId: '414e2b5048745659672b513d',
                    KycStatusName: '',
                    OccupationId: '414e2b5048745659672b513d',
                    OccupationName: '',
                    OccupationCode: '',
                    OccupationType: '',
                    GrossAnnualIncomeId: '414e2b5048745659672b513d',
                    GrossAnnualIncomeName: '',
                    GrossAnnualIncomeCode: '',
                    WealthSourceId: '414e2b5048745659672b513d',
                    WealthSourceName: '',
                    WealthSourceCode: '',
                    UBONames: '',
                    GenderId: '414e2b5048745659672b513d',
                    GenderName: '',
                    GenderCode: '',
                    MobileSelfDeclarationId: '414e2b5048745659672b513d',
                    MobileSelfDeclarationName: '',
                    MobileSelfDeclarationCode: '',
                    EmailSelfDeclarationId: '414e2b5048745659672b513d',
                    EmailSelfDeclarationName: '',
                    EmailSelfDeclarationCode: '',
                    MemberPANCardFileName: '',
                    MemberKYCFileName: '',
                    BirthCertificateFileName: '',
                    Age: 0,
                    FatherName: ''
                },
                CommincationDetails: {
                    LocalAddressTypeId: '414e2b5048745659672b513d',
                    LocalAddressTypeName: '',
                    LocalAddressTypeCode: '',
                    LocalAddress1: '',
                    LocalAddress2: '',
                    LocalAddress3: '',
                    LocalCity: '',
                    LocalCountryId: '414e2b5048745659672b513d',
                    LocalCountryName: '',
                    LocalCountryFATCACode: '',
                    LocalCountryCode: '',
                    LocalStateId: '414e2b5048745659672b513d',
                    LocalStateName: '',
                    LocalStateCode: '',
                    LocalPinCode: '',
                    ForeignAddressTypeId: '414e2b5048745659672b513d',
                    ForeignAddressTypeName: '',
                    ForeignAddress1: '',
                    ForeignAddress2: '',
                    ForeignAddress3: '',
                    ForeignCity: '',
                    ForeignCountryId: '414e2b5048745659672b513d',
                    ForeignCountryName: '',
                    ForeignCountryCode: '',
                    ForeignStateId: '414e2b5048745659672b513d',
                    ForeignStateName: '',
                    ForeignPinCode: '',
                    LocalAddressFileName: '',
                    ForeignAddressFileName: ''
                },
                GuardianDetails: {
                    ClientKycProfileId: '414e2b5048745659672b513d',
                    ProfileType: '',
                    IsMinorProfile: false,
                    IsFATCAUploaded: false,
                    FATCAUploadedDate: null,
                    IsPoliticallyExposed: false,
                    ProfileDetails: {
                        Name: '',
                        DateOfBirth: null,
                        RelationId: '414e2b5048745659672b513d',
                        RelationName: '',
                        TaxStatusId: '414e2b5048745659672b513d',
                        TaxStatusName: '',
                        TaxStatusCode: '',
                        TaxSlabId: '414e2b5048745659672b513d',
                        TaxSlabName: '',
                        LifeExpectancy: 0,
                        PANCardNumber: '',
                        CKYCNumber: '',
                        AadharCardNumber: '',
                        CountryCode: '',
                        MobileNumber: '',
                        Email: '',
                        PlaceOfBirth: '',
                        CountryOfBirth: '',
                        CountryOfBirthFATCACode: '',
                        CountryOfBirthCode: '',
                        EmployerName: '',
                        NetWorth: 0,
                        NetWorthDate: null,
                        PlaceOfIncorporation: '',
                        CountryOfIncorporation: '',
                        CountryOfIncorporationFATCACode: '',
                        CountryOfIncorporationCode: '',
                        NatureOfBusiness: '',
                        KycStatusId: '414e2b5048745659672b513d',
                        KycStatusName: '',
                        OccupationId: '414e2b5048745659672b513d',
                        OccupationName: '',
                        OccupationCode: '',
                        OccupationType: '',
                        GrossAnnualIncomeId: '414e2b5048745659672b513d',
                        GrossAnnualIncomeName: '',
                        GrossAnnualIncomeCode: '',
                        WealthSourceId: '414e2b5048745659672b513d',
                        WealthSourceName: '',
                        WealthSourceCode: '',
                        UBONames: '',
                        GenderId: '414e2b5048745659672b513d',
                        GenderName: '',
                        GenderCode: '',
                        MobileSelfDeclarationId: '414e2b5048745659672b513d',
                        MobileSelfDeclarationName: '',
                        MobileSelfDeclarationCode: '',
                        EmailSelfDeclarationId: '414e2b5048745659672b513d',
                        EmailSelfDeclarationName: '',
                        EmailSelfDeclarationCode: '',
                        MemberPANCardFileName: '',
                        MemberKYCFileName: '',
                        BirthCertificateFileName: '',
                        Age: 0,
                        FatherName: '',
                        GuardianRelationId: '414e2b5048745659672b513d',
                        GuradianRelationName: '',
                        GuardianRelationBSECode: ''
                    },
                    CommincationDetails: {
                        LocalAddressTypeId: '414e2b5048745659672b513d',
                        LocalAddressTypeName: '',
                        LocalAddressTypeCode: '',
                        LocalAddress1: '',
                        LocalAddress2: '',
                        LocalAddress3: '',
                        LocalCity: '',
                        LocalCountryId: '414e2b5048745659672b513d',
                        LocalCountryName: '',
                        LocalCountryFATCACode: '',
                        LocalCountryCode: '',
                        LocalStateId: '414e2b5048745659672b513d',
                        LocalStateName: '',
                        LocalStateCode: '',
                        LocalPinCode: '',
                        ForeignAddressTypeId: '414e2b5048745659672b513d',
                        ForeignAddressTypeName: '',
                        ForeignAddress1: '',
                        ForeignAddress2: '',
                        ForeignAddress3: '',
                        ForeignCity: '',
                        ForeignCountryId: '414e2b5048745659672b513d',
                        ForeignCountryName: '',
                        ForeignCountryCode: '',
                        ForeignStateId: '414e2b5048745659672b513d',
                        ForeignStateName: '',
                        ForeignPinCode: '',
                        LocalAddressFileName: '',
                        ForeignAddressFileName: ''
                    }
                },
                UBODetails: [],
                Allocation: { LumpsumEquity: 0, LumpsumDebt: 0, SipEquity: 0, SipDebt: 0 }
            };

            accountHolders.push(holder);
        }

        if (FirstNomineeName != '') {
            var nominee = {
                Id: '414e2b5048745659672b513d',
                ClientAccountId: '414e2b5048745659672b513d',
                ClientFamilyId: '414e2b5048745659672b513d',
                NomineeName: FirstNomineeName,
                RelationId: '414e2b5048745659672b513d',
                RelationName: '',
                Shares: 0,
                GuardianName: '',
                IsMinorProfile: 0,
                Age: 0,
                DateOfBirth: null,
                GuardianDateOfBirth: null,
                RelationBSECode: '',
                PANCardNumber: '',
                CKYCNumber: '',
                AadharCardNumber: '',
                CountryCode: '',
                MobileNumber: '',
                Email: '',
                PlaceOfBirth: '',
                CountryOfBirth: '',
                EmployerName: '',
                NetWorth: 0,
                NetWorthDate: null,
                PlaceOfIncorporation: '',
                CountryOfIncorporation: '',
                NatureOfBusiness: '',
                KycStatusId: '',
                OccupationId: '',
                GrossAnnualIncomeId: '',
                WealthSourceId: '',
                IsFATCAUploaded: true,
                FATCAUploadedDate: null,
                IsPoliticallyExposed: false,
                Address1: '',
                Address2: '',
                Address3: '',
                City: '',
                PinCode: '',
                CountryName: '',
                StateName: ''
            };

            accountNominees.push(nominee);
        }

        if (SecondNomineeName != '') {
            var nominee = {
                Id: '414e2b5048745659672b513d',
                ClientAccountId: '414e2b5048745659672b513d',
                ClientFamilyId: '414e2b5048745659672b513d',
                NomineeName: SecondNomineeName,
                RelationId: '414e2b5048745659672b513d',
                RelationName: '',
                Shares: 0,
                GuardianName: '',
                IsMinorProfile: 0,
                Age: 0,
                DateOfBirth: null,
                GuardianDateOfBirth: null,
                RelationBSECode: '',
                PANCardNumber: '',
                CKYCNumber: '',
                AadharCardNumber: '',
                CountryCode: '',
                MobileNumber: '',
                Email: '',
                PlaceOfBirth: '',
                CountryOfBirth: '',
                EmployerName: '',
                NetWorth: 0,
                NetWorthDate: null,
                PlaceOfIncorporation: '',
                CountryOfIncorporation: '',
                NatureOfBusiness: '',
                KycStatusId: '',
                OccupationId: '',
                GrossAnnualIncomeId: '',
                WealthSourceId: '',
                IsFATCAUploaded: true,
                FATCAUploadedDate: null,
                IsPoliticallyExposed: false,
                Address1: '',
                Address2: '',
                Address3: '',
                City: '',
                PinCode: '',
                CountryName: '',
                StateName: ''
            };

            accountNominees.push(nominee);
        }

        if (ThirdNomineeName != '') {
            var nominee = {
                Id: '414e2b5048745659672b513d',
                ClientAccountId: '414e2b5048745659672b513d',
                ClientFamilyId: '414e2b5048745659672b513d',
                NomineeName: ThirdNomineeName,
                RelationId: '414e2b5048745659672b513d',
                RelationName: '',
                Shares: 0,
                GuardianName: '',
                IsMinorProfile: 0,
                Age: 0,
                DateOfBirth: null,
                GuardianDateOfBirth: null,
                RelationBSECode: '',
                PANCardNumber: '',
                CKYCNumber: '',
                AadharCardNumber: '',
                CountryCode: '',
                MobileNumber: '',
                Email: '',
                PlaceOfBirth: '',
                CountryOfBirth: '',
                EmployerName: '',
                NetWorth: 0,
                NetWorthDate: null,
                PlaceOfIncorporation: '',
                CountryOfIncorporation: '',
                NatureOfBusiness: '',
                KycStatusId: '',
                OccupationId: '',
                GrossAnnualIncomeId: '',
                WealthSourceId: '',
                IsFATCAUploaded: true,
                FATCAUploadedDate: null,
                IsPoliticallyExposed: false,
                Address1: '',
                Address2: '',
                Address3: '',
                City: '',
                PinCode: '',
                CountryName: '',
                StateName: ''
            };

            accountNominees.push(nominee);
        }

        data = {
            Id: '414e2b5048745659672b513d',
            ClientId: '414e2b5048745659672b513d',
            LeadId: '414e2b5048745659672b513d',
            AssociateId: '414e2b5048745659672b513d',
            FamilyName: '',
            BSEMemberId: '19941',
            AssociateCode: '',
            EntityTypeName: '',
            AssociateName: '',
            AuthorisedPerson1: '',
            Mobile1: '',
            Email1: '',
            EUINHolderName: '',
            ARN: '',
            RIANumber: '',
            EUIN: '',
            AccountTypeId: '414e2b5048745659672b513d',
            UCCSerialNumber: 0,
            UCC: '',
            MFUCAN: '',
            MFUCANStatus: '',
            LBUserId: '',
            AccountProfileType: 'F',
            HasNominee: true,
            CreateBSEAccount: true,
            CreateMFUAccount: false,
            CreateP2PAccount: false,
            IsSelfVerified: true,
            SelfVerifiedDate: null,
            IsAccountCreatedAtBSE: true,
            BSEAccountCreatedDate: null,
            ISAOFFileUploadedToBSE: true,
            BSEAOFFileUploadedDate: null,
            IsAccountCreatedAtMFU: false,
            MFUAccountCreatedDate: null,
            IsAccountCreatedAtLB: false,
            LBAccountCreatedDate: null,
            AccountTypeName: '',
            AccountTypeCode: '',
            AccountHolderName: FirstHolderName,
            AccountHolders: accountHolders,
            AccountNominees: accountNominees,
            AccountBanks: accountBanks,
            AccountMandates: accountMandates,
            Created: null
        };
    }

    return data;
};

exports.SaveApprovedClientAccount = async (req, res) => {
    var { ClientId, ClientKycProfileId } = req.body;

    var errorMessage = "Error while saving client account...";

    const readRequest = req.app.locals.db.request();
    readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
        .input("ClientKycProfileId", cryptoEngine.ParamDecrypt(ClientKycProfileId, true));
    const readResult = await readRequest.execute("GetClientAccountByFirstHolder");
    if (readResult.recordset.length > 0) {
        let accountsDataList = readResult.recordset;

        for (let i = 0; i < accountsDataList.length; i++) {
            let ClientAccountId = cryptoEngine.ParamEncrypt(accountsDataList[i].Id, true);

            const transaction = req.app.locals.db.transaction();

            try {
                await transaction.begin();

                const request = transaction.request();
                request.input("Id", cryptoEngine.ParamDecrypt(ClientAccountId, true))
                    .input("IsSelfVerified", true);
                const result = await request.execute("UpdateClientAccountSelfVerifiedStatus");

                const updateRequest = transaction.request();
                updateRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(ClientAccountId, true));
                const updateResult = await updateRequest.execute("UpdateClientAccountProfileUnlock");

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

                return;
            }

            try {
                var accountData = await this.GetClientAccountInfo(req, res, ClientAccountId);

                if (accountData.CreateBSEAccount == true) {
                    if (accountData.AccountTypeCode != 'NI') {
                        var bseResult = await bseService.UploadClientMFD(accountData);

                        if (bseResult.Status == 0 || bseResult.Remarks.includes('MODIFICATION NOT FOUND')) {
                            let accountData = await this.GetClientAccountInfo(req, res, ClientAccountId);

                            if (accountData.AccountTypeCode != 'NI' && accountData.AccountProfileType == 'F') {
                                for (let i = 0; i < accountData.AccountHolders.length; i++) {
                                    await bseService.UploadClientFATCA(accountData.AccountHolders[i]);
                                }
                            }

                            let firstHolderData = accountData.AccountHolders[0];

                            if (firstHolderData.IsMinorProfile == false) {
                                // let mandateDataList = accountData.AccountMandates.filter(x => x.MandateTypeCode === 'X' && x.BSEMandateId === '');
                                let mandateDataList = accountData.AccountMandates.filter(x => x.BSEMandateId === '');

                                let endDate = new Date((new Date()).getFullYear() + 40, (new Date()).getMonth(), (new Date()).getDate());
                                endDate.setDate(endDate.getDate() - 1);

                                for (let m = 0; m < mandateDataList.length; m++) {
                                    let mandateItem = {
                                        ClientAccountId: accountData.Id,
                                        UCC: accountData.UCC,
                                        AccountMandate: mandateDataList[m],
                                        StartDate: new Date(),
                                        EndDate: endDate
                                    };

                                    var bseResult = await bseService.UploadMandateMFD(mandateItem);
                                }

                                accountData = await this.GetClientAccountInfo(req, res, ClientAccountId);
                                let mandatePdfDataList = accountData.AccountMandates.filter(x => x.MandateTypeCode === 'X' && x.BSEMandateId != '');
                                let firstHolder = accountData.AccountHolders.find(x => x.SerialNumber === 1);
                                for (let m = 0; m < mandatePdfDataList.length; m++) {
                                    let mandateItem = {
                                        ClientAccountId: accountData.Id,
                                        UCC: accountData.UCC,
                                        StartDate: mandatePdfDataList[m].StartDate,
                                        EndDate: mandatePdfDataList[m].EndDate,
                                        AccountMandate: mandatePdfDataList[m],
                                        AccountFirstHolder: firstHolder,
                                    };

                                    var mandateReportData = await reports.PrepareMandateScanFilePdf(mandateItem);
                                    var mandateResult = await this.SaveClientAccountDocument(req, res, mandateItem.ClientAccountId, mandatePdfDataList[m].Id, 'Mandate', mandateReportData.FileName, mandateReportData.ReportBuffer, 'application/pdf', 'D');
                                }
                            }
                        }
                        else {
                            res.status(200).send({ Status: false, Message: "Error while creating account at BSE.", Data: { ClientId: ClientId, ClientKycProfileId: ClientKycProfileId } });
                            return;
                        }
                    }

                    var aofReportData = await reports.PrepareClientAOFPdf(accountData);
                    var aofResult = await this.SaveClientAccountDocument(req, res, ClientAccountId, cryptoEngine.ParamEncrypt('0', true), 'AOF', aofReportData.FileName, aofReportData.ReportBuffer, 'application/pdf', 'D');

                    if (accountData.AccountProfileType == 'C') {
                        var fatcaReportData = await reports.PrepareNonIndividualClientFATCAPdf(accountData);
                        var fatcaResult = await this.SaveClientAccountDocument(req, res, ClientAccountId, cryptoEngine.ParamEncrypt('0', true), 'NI FATCA', fatcaReportData.FileName, fatcaReportData.ReportBuffer, 'application/pdf', 'D');
                    }
                }

                if (accountData.CreateMFUAccount == true) {
                    if (accountData.AccountProfileType == 'F') {
                        var mfuResult = await mfuService.UploadClientECAN(accountData);

                        accountData = await this.GetClientAccountInfo(req, res, ClientAccountId);

                        if (accountData.IsAccountCreatedAtMFU == true) {
                            for (let i = 0; i < accountData.AccountHolders.length; i++) {
                                var mfuDocDataList = [];
                                var mfuPANDocument = null;
                                var mfuBankDocument = null;
                                var mfuBirthDocument = null;

                                const readMfuDocRequest = req.app.locals.db.request();
                                readMfuDocRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(ClientAccountId, true))
                                    .input("ClientKycProfileId", cryptoEngine.ParamDecrypt(accountData.AccountHolders[i].ClientKycProfileId, true));
                                const readMufDocResult = await readMfuDocRequest.execute("GetClientAccountMFUDocument");
                                if (readMufDocResult.recordset.length > 0) {
                                    mfuDocDataList = readMufDocResult.recordset;
                                    mfuPANDocument = mfuDocDataList.find(x => x.Name === 'Member PAN Card');
                                    mfuBankDocument = mfuDocDataList.find(x => x.Name === 'Bank Proof');
                                    mfuBirthDocument = mfuDocDataList.find(x => x.Name === 'Birth Certificate');
                                }

                                if (mfuPANDocument == null) {
                                    const readDocRequest = req.app.locals.db.request();
                                    readDocRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(accountData.AccountHolders[i].ClientKycProfileId, true))
                                        .input("Name", "Member PAN Card")
                                        .input("FileTag", "");
                                    const readDocResult = await readDocRequest.execute("GetClientKycProfileDocumentByName");
                                    if (readDocResult.recordset.length > 0) {
                                        let doc = readDocResult.recordset[0];

                                        let inputData = {
                                            ClientAccountId: ClientAccountId,
                                            ClientKycProfileId: accountData.AccountHolders[i].ClientKycProfileId,
                                            MFUCAN: accountData.MFUCAN,
                                            Name: doc.Name,
                                            FileName: doc.FileName,
                                            FileContent: doc.FileContent,
                                            FileContentType: doc.FileContentType,
                                            MFUEventType: 'AD',
                                            MFUDocumentCode: '1#PC',
                                            MFUImageRefNumber: ''
                                        };

                                        let mfuDocResult = await mfuService.UploadImage(inputData);
                                    }
                                }

                                if (mfuBankDocument == null) {
                                    var defaultBank = accountData.AccountBanks.find(x => x.IsDefault === true);

                                    const readDocRequest = req.app.locals.db.request();
                                    readDocRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(accountData.AccountHolders[i].ClientKycProfileId, true))
                                        .input("Name", "Bank Proof")
                                        .input("FileTag", defaultBank.FileTag);
                                    const readDocResult = await readDocRequest.execute("GetClientKycProfileDocumentByName");
                                    if (readDocResult.recordset.length > 0) {
                                        let doc = readDocResult.recordset[0];

                                        let inputData = {
                                            ClientAccountId: ClientAccountId,
                                            ClientKycProfileId: accountData.AccountHolders[i].ClientKycProfileId,
                                            MFUCAN: accountData.MFUCAN,
                                            Name: doc.Name,
                                            FileName: doc.FileName,
                                            FileContent: doc.FileContent,
                                            FileContentType: doc.FileContentType,
                                            MFUEventType: 'AD',
                                            MFUDocumentCode: '2#BP',
                                            MFUImageRefNumber: ''
                                        };

                                        let mfuDocResult = await mfuService.UploadImage(inputData);
                                    }
                                }

                                if (mfuBirthDocument == null && accountData.AccountHolders[i].IsMinorProfile == true) {
                                    const readDocRequest = req.app.locals.db.request();
                                    readDocRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(accountData.AccountHolders[i].ClientKycProfileId, true))
                                        .input("Name", "Birth Certificate")
                                        .input("FileTag", "");
                                    const readDocResult = await readDocRequest.execute("GetClientKycProfileDocumentByName");
                                    if (readDocResult.recordset.length > 0) {
                                        let doc = readDocResult.recordset[0];

                                        let inputData = {
                                            ClientAccountId: ClientAccountId,
                                            ClientKycProfileId: accountData.AccountHolders[i].ClientKycProfileId,
                                            MFUCAN: accountData.MFUCAN,
                                            Name: doc.Name,
                                            FileName: doc.FileName,
                                            FileContent: doc.FileContent,
                                            FileContentType: doc.FileContentType,
                                            MFUEventType: 'AD',
                                            MFUDocumentCode: '3#BC',
                                            MFUImageRefNumber: ''
                                        };

                                        let mfuDocResult = await mfuService.UploadImage(inputData);
                                    }
                                }

                                if (accountData.AccountHolders[i].IsMinorProfile == true) {
                                    var mfuPANGaurdianDocument = null;

                                    const readMfuDocRequest = req.app.locals.db.request();
                                    readMfuDocRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(ClientAccountId, true))
                                        .input("ClientKycProfileId", cryptoEngine.ParamDecrypt(accountData.AccountHolders[i].GuardianDetails.ClientKycProfileId, true));
                                    const readMufDocResult = await readMfuDocRequest.execute("GetClientAccountMFUDocument");
                                    if (readMufDocResult.recordset.length > 0) {
                                        let mfuDocGuardianDataList = readMufDocResult.recordset;
                                        mfuPANGaurdianDocument = mfuDocGuardianDataList.find(x => x.Name === 'Member PAN Card');
                                    }

                                    // console.log(mfuPANGaurdianDocument);

                                    if (mfuPANGaurdianDocument == null) {
                                        const readDocRequest = req.app.locals.db.request();
                                        readDocRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(accountData.AccountHolders[i].GuardianDetails.ClientKycProfileId, true))
                                            .input("Name", "Member PAN Card")
                                            .input("FileTag", "");
                                        const readDocResult = await readDocRequest.execute("GetClientKycProfileDocumentByName");
                                        if (readDocResult.recordset.length > 0) {
                                            let doc = readDocResult.recordset[0];

                                            let inputData = {
                                                ClientAccountId: ClientAccountId,
                                                ClientKycProfileId: accountData.AccountHolders[i].GuardianDetails.ClientKycProfileId,
                                                MFUCAN: accountData.MFUCAN,
                                                Name: doc.Name,
                                                FileName: doc.FileName,
                                                FileContent: doc.FileContent,
                                                FileContentType: doc.FileContentType,
                                                MFUEventType: 'AD',
                                                MFUDocumentCode: '1#PC',
                                                MFUImageRefNumber: ''
                                            };

                                            let mfuDocResult = await mfuService.UploadImage(inputData);
                                        }
                                    }
                                }
                            }

                            // if (mfuResult.RESP_HEADER.RES_CODE.toString() == "0") {
                            //     var clientName = '';
                            //     var clientEmail = '';
                            //     var link = '';

                            //     if (mfuResult.RESP_BODY.NOM_VER_LINK_H1 != '') {
                            //         var firstHolder = accountData.AccountHolders.find(x => x.SerialNumber === 1);
                            //         clientName = firstHolder.ProfileDetails.Name;
                            //         clientEmail = firstHolder.ProfileDetails.Email;
                            //         link = mfuResult.RESP_BODY.NOM_VER_LINK_H1;
                            //         emailEngine.SendClientMFUCANRegistrationConsent(clientEmail, clientName, link);
                            //     }
                            //     if (mfuResult.RESP_BODY.NOM_VER_LINK_H2 != '') {
                            //         var secondHolder = accountData.AccountHolders.find(x => x.SerialNumber === 2);
                            //         clientName = secondHolder.ProfileDetails.Name;
                            //         clientEmail = secondHolder.ProfileDetails.Email;
                            //         link = mfuResult.RESP_BODY.NOM_VER_LINK_H2;
                            //         emailEngine.SendClientMFUCANRegistrationConsent(clientEmail, clientName, link);
                            //     }
                            //     if (mfuResult.RESP_BODY.NOM_VER_LINK_H3 != '') {
                            //         var thirdHolder = accountData.AccountHolders.find(x => x.SerialNumber === 3);
                            //         clientName = thirdHolder.ProfileDetails.Name;
                            //         clientEmail = thirdHolder.ProfileDetails.Email;
                            //         link = mfuResult.RESP_BODY.NOM_VER_LINK_H3;
                            //         emailEngine.SendClientMFUCANRegistrationConsent(clientEmail, clientName, link);
                            //     }
                            // }
                        }
                    }
                }

                if (accountData.CreateBSEAccount == true || accountData.CreateMFUAccount == true) {
                    var loeReportData = await reports.PrepareClientLOEPdf(accountData);
                    var loeResult = await this.SaveClientAccountDocument(req, res, ClientAccountId, cryptoEngine.ParamEncrypt('0', true), 'LOE', loeReportData.FileName, loeReportData.ReportBuffer, 'application/pdf', 'D');
                }

                if (accountData.CreateP2PAccount == true) {
                    if (accountData.IsAccountCreatedAtLB == false) {
                        var lbResult = await lendboxService.InvestorRegistration(accountData);
                    }

                    accountData = await this.GetClientAccountInfo(req, res, ClientAccountId);

                    if (accountData.LBUserId != '') {
                        var firstHolder = accountData.AccountHolders.find(x => x.SerialNumber === 1);

                        var lbDocDataList = [];
                        var lbPANDocument = null;
                        var lbAddressDocument = null;

                        const readLbDocRequest = req.app.locals.db.request();
                        readLbDocRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(ClientAccountId, true))
                            .input("ClientKycProfileId", cryptoEngine.ParamDecrypt(firstHolder.ClientKycProfileId, true));
                        const readLbDocResult = await readLbDocRequest.execute("GetClientAccountLBDocument");
                        if (readLbDocResult.recordset.length > 0) {
                            lbDocDataList = readLbDocResult.recordset;
                            lbPANDocument = lbDocDataList.find(x => x.Name === 'Member PAN Card');
                            lbAddressDocument = lbDocDataList.find(x => x.Name === 'Local Address');
                        }

                        if (lbPANDocument == null) {
                            const readDocRequest = req.app.locals.db.request();
                            readDocRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(firstHolder.ClientKycProfileId, true))
                                .input("Name", "Member PAN Card")
                                .input("FileTag", "");
                            const readDocResult = await readDocRequest.execute("GetClientKycProfileDocumentByName");
                            if (readDocResult.recordset.length > 0) {
                                let doc = readDocResult.recordset[0];

                                let inputData = {
                                    ClientAccountId: ClientAccountId,
                                    ClientKycProfileId: firstHolder.ClientKycProfileId,
                                    LBUserId: accountData.LBUserId,
                                    Name: doc.Name,
                                    FileName: doc.FileName,
                                    FileContent: doc.FileContent,
                                    FileContentType: doc.FileContentType
                                };

                                let lbDocResult = await lendboxService.UploadImage(inputData);
                            }
                        }

                        if (lbAddressDocument == null) {
                            const readDocRequest = req.app.locals.db.request();
                            readDocRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(firstHolder.ClientKycProfileId, true))
                                .input("Name", "Local Address")
                                .input("FileTag", "");
                            const readDocResult = await readDocRequest.execute("GetClientKycProfileDocumentByName");
                            if (readDocResult.recordset.length > 0) {
                                let doc = readDocResult.recordset[0];

                                let inputData = {
                                    ClientAccountId: ClientAccountId,
                                    ClientKycProfileId: firstHolder.ClientKycProfileId,
                                    LBUserId: accountData.LBUserId,
                                    Name: doc.Name,
                                    FileName: doc.FileName,
                                    FileContent: doc.FileContent,
                                    FileContentType: doc.FileContentType
                                };

                                let lbDocResult = await lendboxService.UploadImage(inputData);
                            }
                        }
                    }
                }

                //notification
                var familyName = '';
                var dataItem;
                var notificationAppUsers = [];

                const readRequest = req.app.locals.db.request();
                readRequest.input("Id", cryptoEngine.ParamDecrypt(accountData.ClientId, true));
                const readResult = await readRequest.execute("GetClientById");
                if (readResult.recordset.length > 0) {
                    dataItem = readResult.recordset[0];
                }

                if (dataItem != null) {
                    const readRequest = req.app.locals.db.request();
                    readRequest.input("ClientId", cryptoEngine.ParamDecrypt(accountData.ClientId, true));
                    const readResult = await readRequest.execute("GetClientNotificationAppUser");
                    if (readResult.recordset.length > 0) {
                        notificationAppUsers = readResult.recordset;
                    }
                }

                if (dataItem != null) {
                    familyName = dataItem.FamilyName;

                    let title = familyName + ' client is self verified the account ' + accountData.UCC + '.';
                    let link = 'client-download/' + accountData.ClientId + '/' + cryptoEngine.ParamEncrypt('edit', true);

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

                    // res.status(200).send({ Status: true, Message: "Notification saved successfully.", Data: null });
                }
                else {
                    // res.status(200).send({ Status: false, Message: "Invalid client.", Data: null });
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).send(errorMessage);
                return;
            }
        }
    }

    if (process.env.PUSH_TO_OLD_SYSTEM == 'true') {
        var exportResult = exportData.ExportSingleClient(req, res, ClientId);
    }

    res.status(200).send({ Status: true, Message: "Client account approved successfully.", Data: { ClientId: ClientId, ClientKycProfileId: ClientKycProfileId } });
};

exports.SaveClientAccountUploadDocument = async (req, res) => {
    var { ClientId, AccountId, AccountMandates, IsFATCAUploaded, AccountProfileType, ClientKycProfileId, Mode } = req.body;

    let AccountMandatesData = JSON.parse(AccountMandates);
    var accountData = await this.GetClientAccountInfo(req, res, AccountId);

    var errorMessage = "Error while saving client account upload documents...";

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        if (AccountProfileType == 'C' && IsFATCAUploaded == true) {
            const request = transaction.request();

            request.input("Id", cryptoEngine.ParamDecrypt(ClientKycProfileId, true))
                .input("IsFATCAUploaded", IsFATCAUploaded);

            const result = await request.execute("UpdateClientProfileFATCAStatus");
        }

        if (req.files) {
            if (req.files.AOFFile) {
                var fileTypeData = mime.lookup(req.files.AOFFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(AccountId, true))
                    .input("ClientAccountMandateId", cryptoEngine.ParamDecrypt('0', true))
                    .input("Name", "AOF Scan")
                    .input("FileName", req.files.AOFFile.name)
                    .input("FileContent", req.files.AOFFile.data)
                    .input("FileContentType", fileTypeData)
                    .input("DocumentType", "U");
                const fileResult = await fileRequest.execute("InsertClientAccountDocument");
            }

            if (req.files.LOEFile) {
                var fileTypeData = mime.lookup(req.files.LOEFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(AccountId, true))
                    .input("ClientAccountMandateId", cryptoEngine.ParamDecrypt('0', true))
                    .input("Name", "LOE Scan")
                    .input("FileName", req.files.LOEFile.name)
                    .input("FileContent", req.files.LOEFile.data)
                    .input("FileContentType", fileTypeData)
                    .input("DocumentType", "U");
                const fileResult = await fileRequest.execute("InsertClientAccountDocument");
            }

            if (req.files.NIFATCAFile) {
                var fileTypeData = mime.lookup(req.files.NIFATCAFile.name);
                const fileRequest = transaction.request();
                fileRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(AccountId, true))
                    .input("ClientAccountMandateId", cryptoEngine.ParamDecrypt('0', true))
                    .input("Name", "NI FATCA Scan")
                    .input("FileName", req.files.NIFATCAFile.name)
                    .input("FileContent", req.files.NIFATCAFile.data)
                    .input("FileContentType", fileTypeData)
                    .input("DocumentType", "U");
                const fileResult = await fileRequest.execute("InsertClientAccountDocument");
            }

            if (util.isArray(req.files.MandateFiles)) {
                for (let i = 0; i < req.files.MandateFiles.length; i++) {
                    var mandate = AccountMandatesData.find(x => x.DocumentFileName === req.files.MandateFiles[i].name);

                    var fileTypeData = mime.lookup(req.files.MandateFiles[i].name);
                    const fileRequest = transaction.request();
                    fileRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(AccountId, true))
                        .input("ClientAccountMandateId", cryptoEngine.ParamDecrypt(mandate.ClientAccountMandateId, true))
                        .input("Name", "Mandate Scan")
                        .input("FileName", req.files.MandateFiles[i].name)
                        .input("FileContent", req.files.MandateFiles[i].data)
                        .input("FileContentType", fileTypeData)
                        .input("DocumentType", "U");
                    const fileResult = await fileRequest.execute("InsertClientAccountDocument");
                }
            }
            else {
                if (req.files.MandateFiles != undefined) {
                    var mandate = AccountMandatesData.find(x => x.DocumentFileName === req.files.MandateFiles.name);

                    var fileTypeData = mime.lookup(req.files.MandateFiles.name);
                    const fileRequest = transaction.request();
                    fileRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(AccountId, true))
                        .input("ClientAccountMandateId", cryptoEngine.ParamDecrypt(mandate.ClientAccountMandateId, true))
                        .input("Name", "Mandate Scan")
                        .input("FileName", req.files.MandateFiles.name)
                        .input("FileContent", req.files.MandateFiles.data)
                        .input("FileContentType", fileTypeData)
                        .input("DocumentType", "U");
                    const fileResult = await fileRequest.execute("InsertClientAccountDocument");
                }
            }
        }

        const statusRequest1 = transaction.request();
        statusRequest1.input("Id", cryptoEngine.ParamDecrypt(ClientId, true))
            .input("AccountStatus", true);
        const statusResult1 = await statusRequest1.execute("UpdateClientAccountStatus");

        const statusRequest2 = transaction.request();
        statusRequest2.input("Id", cryptoEngine.ParamDecrypt(ClientId, true))
            .input("IsUploadCompleted", true);
        const statusResult2 = await statusRequest2.execute("UpdateClientUploadCompletedStatus");

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

    if (Mode == 'verify2') {
        accountData = await this.GetClientAccountInfo(req, res, AccountId);

        if (accountData.CreateBSEAccount == true) {
            //upload files to BSE
            try {
                var accountBankData = [];
                const readRequest = req.app.locals.db.request();
                readRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(AccountId, true));
                const readResult = await readRequest.execute("GetClientAccountBankDocument");
                if (readResult.recordset.length > 0) {
                    accountBankData = readResult.recordset;
                }

                var aofBanks = [];
                for (let i = 0; i < accountBankData.length; i++) {
                    var aofBankItem = {
                        UCC: accountBankData[i].UCC,
                        Name: accountBankData[i].Name,
                        FileName: accountBankData[i].FileName,
                        FileContent: accountBankData[i].FileContent,
                        FileContentType: accountBankData[i].FileContentType
                    };

                    aofBanks.push(aofBankItem);
                }

                var documentUploadDataList = [];
                let aofData;

                const readDocumentRequest = req.app.locals.db.request();
                readDocumentRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(AccountId, true));
                const readDocumentResult = await readDocumentRequest.execute("GetClientAccountDocuments");
                if (readDocumentResult.recordset.length > 0) {
                    documentUploadDataList = readDocumentResult.recordset.filter(x => x.Name == 'AOF Scan');
                }

                for (let j = 0; j < documentUploadDataList.length; j++) {
                    aofData = {
                        Id: cryptoEngine.ParamEncrypt(documentUploadDataList[j].Id, true),
                        ClientAccountMandateId: cryptoEngine.ParamEncrypt(documentUploadDataList[j].ClientAccountMandateId, true),
                        Name: documentUploadDataList[j].Name,
                        FileName: documentUploadDataList[j].FileName,
                        FileContentType: documentUploadDataList[j].FileContentType,
                        FileContent: documentUploadDataList[j].FileContent
                    };
                }

                var aofScanResult = await reports.PrepareClientAOFImage(aofBanks, aofData);

                try {
                    await transaction.begin();

                    var fileTypeData = mime.lookup(aofScanResult.FileName);
                    const fileRequest = transaction.request();
                    fileRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(AccountId, true))
                        .input("ClientAccountMandateId", cryptoEngine.ParamDecrypt('0', true))
                        .input("Name", "AOF Image")
                        .input("FileName", aofScanResult.FileName)
                        .input("FileContent", aofScanResult.ReportBuffer)
                        .input("FileContentType", fileTypeData)
                        .input("DocumentType", "BSE");
                    const fileResult = await fileRequest.execute("InsertClientAccountDocument");

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
                    return;
                }

                var documentMandateUploadDataList = [];
                let mandateDataList = [];

                const readMandateDocumentRequest = req.app.locals.db.request();
                readMandateDocumentRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(AccountId, true));
                const readMandateDocumentResult = await readMandateDocumentRequest.execute("GetClientAccountDocuments");
                if (readMandateDocumentResult.recordset.length > 0) {
                    documentMandateUploadDataList = readMandateDocumentResult.recordset.filter(x => x.Name == 'Mandate Scan' && x.DocumentType == 'U');
                }

                for (let j = 0; j < documentMandateUploadDataList.length; j++) {
                    let mandateData = {
                        Id: cryptoEngine.ParamEncrypt(documentMandateUploadDataList[j].Id, true),
                        ClientAccountMandateId: cryptoEngine.ParamEncrypt(documentMandateUploadDataList[j].ClientAccountMandateId, true),
                        Name: documentMandateUploadDataList[j].Name,
                        FileName: documentMandateUploadDataList[j].FileName,
                        FileContentType: documentMandateUploadDataList[j].FileContentType,
                        FileContent: documentMandateUploadDataList[j].FileContent
                    };

                    mandateDataList.push(mandateData);
                }

                for (let i = 0; i < mandateDataList.length; i++) {
                    var fileName = mandateDataList[i].FileName;
                    var fileContent = mandateDataList[i].FileContent;

                    if (mandateDataList[i].FileContentType == 'application/pdf') {
                        var mandateScanResult = await reports.PrepareClientMandateImage(mandateDataList[i]);

                        fileName = mandateScanResult.FileName;
                        fileContent = mandateScanResult.ReportBuffer;
                    }

                    try {
                        await transaction.begin();

                        var fileTypeData = mime.lookup(fileName);
                        const fileRequest = transaction.request();
                        fileRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(AccountId, true))
                            .input("ClientAccountMandateId", cryptoEngine.ParamDecrypt(mandateDataList[i].ClientAccountMandateId, true))
                            .input("Name", "Mandate Image")
                            .input("FileName", fileName)
                            .input("FileContent", fileContent)
                            .input("FileContentType", fileTypeData)
                            .input("DocumentType", "BSE");
                        const fileResult = await fileRequest.execute("InsertClientAccountDocument");

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
                        return;
                    }
                }

                let accountData = await this.GetClientAccountInfo(req, res, AccountId);
                let aofDocumentData = null;
                let mandateDocumentList = [];

                if (accountData != null) {
                    if (accountData.CreateBSEAccount == true && accountData.ISAOFFileUploadedToBSE == false) {
                        const readAofImageRequest = req.app.locals.db.request();
                        readAofImageRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(AccountId, true));
                        const readAofImageResult = await readAofImageRequest.execute("GetClientAccountDocuments");
                        if (readAofImageResult.recordset.length > 0) {
                            let dataList = readAofImageResult.recordset.filter(x => x.Name == 'AOF Image' && x.DocumentType == 'BSE');
                            if (dataList.length > 0) {
                                aofDocumentData = dataList[0];
                            }
                        }

                        if (aofDocumentData != null) {
                            let aofImageData = {
                                UCC: accountData.UCC,
                                FileName: aofDocumentData.FileName,
                                FileContent: Buffer.from(aofDocumentData.FileContent).toString('base64'),
                                ClientAccountId: accountData.Id
                            };
                            var bseResult = await bseService.UploadClientAOF(aofImageData);
                        }
                    }

                    const readMandateImageRequest = req.app.locals.db.request();
                    readMandateImageRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(AccountId, true));
                    const readMandateImageResult = await readMandateImageRequest.execute("GetClientAccountDocuments");
                    if (readMandateImageResult.recordset.length > 0) {
                        mandateDocumentList = readMandateImageResult.recordset.filter(x => x.Name == 'Mandate Image' && x.DocumentType == 'BSE');
                    }

                    for (let i = 0; i < accountData.AccountMandates.length; i++) {
                        let mandateItem = accountData.AccountMandates[i];
                        if (mandateItem.BSEMandateId != '' && mandateItem.IsMandateScanUploadedToBSE == false) {
                            let mandateData = mandateDocumentList.filter(x => x.ClientAccountMandateId == cryptoEngine.ParamDecrypt(mandateItem.Id, true));
                            if (mandateData.length > 0) {
                                let mandateImageData = {
                                    UCC: accountData.UCC,
                                    FileName: mandateData[0].FileName,
                                    FileContentType: mandateData[0].FileContentType,
                                    BSEMandateId: mandateItem.BSEMandateId,
                                    FileContent: Buffer.from(mandateData[0].FileContent).toString('base64'),
                                    ClientAccountId: accountData.Id,
                                    ClientAccountMandateId: mandateItem.Id
                                };
                                var bseResult = await bseService.UploadMandateScanFile(mandateImageData);
                            }
                        }
                    }
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).send(errorMessage);
                return;
            }
        }

        if (accountData.CreateMFUAccount == true) {
            await this.ProcessMFUMandate(req, res, accountData);
        }

        if (accountData.IsWelcomeEmailSent == false) {
            var zipFileData = await createClientDocumentZip(accountData);
            if (zipFileData.Status == true) {
                var firstHolder = accountData.AccountHolders.find(x => x.SerialNumber == 1);

                var emailData = {
                    ClientName: firstHolder.ProfileDetails.Name,
                    Email: firstHolder.ProfileDetails.Email,
                    FileName: zipFileData.FileName,
                    FilePath: process.env.WEB_API_LINK + '/download/doc/' + zipFileData.FileName
                };

                var subject = 'Account Opening Confirmation and Welcome to Kinntegra Wealth Private Limited.';
                emailEngine.SendClientWelcomeEmail(emailData.Email, emailData.ClientName, emailData.FileName, emailData.FilePath, subject);

                try {
                    await transaction.begin();

                    const statusRequest1 = transaction.request();
                    statusRequest1.input("Id", cryptoEngine.ParamDecrypt(accountData.Id, true));
                    const statusResult1 = await statusRequest1.execute("UpdateClientAccountWelcomeEmailSentStatus");

                    await transaction.commit();
                }
                catch (err) {
                    console.log(err);
                    try {
                        await transaction.rollback();
                    } catch (sqlerr) {
                        console.log(sqlerr);
                    }

                    res.status(500).send(errorMessage);
                }
            }
        }

        if (process.env.PUSH_TO_OLD_SYSTEM == 'true') {
            var exportResult = exportData.ExportSingleClient(req, res, ClientId);
        }
    }
    else {
        var notificationAppUsers = [];
        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientNotificationAppUserAdmin");
        if (readResult.recordset.length > 0) {
            notificationAppUsers = readResult.recordset;
        }

        accountData = await this.GetClientAccountInfo(req, res, AccountId);

        var familyName = accountData.FamilyName;

        let title = familyName + ' account received for uploaded document verification for ' + accountData.UCC + '.';
        let link = 'client-upload/' + ClientId + '/' + AccountId + '/' + cryptoEngine.ParamEncrypt('verify2', true);

        for (let i = 0; i < notificationAppUsers.length; i++) {
            let NotificationId = await notificationController.CreateNotification(req, res, cryptoEngine.ParamEncrypt('0', true),
                req.User.user_id,
                cryptoEngine.ParamEncrypt(notificationAppUsers[i].Id, true),
                title,
                '',
                link,
                'General'
            );

            var notificationData = {
                SenderId: req.User.user_id,
                ReceiverId: cryptoEngine.ParamEncrypt(notificationAppUsers[i].Id, true),
                Title: title,
                Description: '',
                Link: link,
                RecordType: 'General'
            };

            notificationEngine.SendRealCommunicationMessage(JSON.stringify(notificationData));
        }
    }

    res.status(200).send({ Status: true, Message: "Client account upload documents successfully.", Data: { ClientId: ClientId, AccountId: AccountId } });

    //update client upload file flag if all files are uploaded to bse
};

exports.ProcessMFUMandate = async (req, res, accountData) => {
    if (accountData.CreateMFUAccount == true && accountData.MFUCANStatus == 'Approved') {
        var accountMandates = accountData.AccountMandates.filter(x => x.MandateTypeCode === 'X' && x.MMRN === '');
        let startDate = new Date();
        startDate.setDate(startDate.getDate() + 2);

        let endDate = new Date((new Date()).getFullYear() + 40, (new Date()).getMonth(), (new Date()).getDate());
        endDate.setDate(endDate.getDate() - 1);

        for (let i = 0; i < accountMandates.length; i++) {
            let mandateData = {
                ClientAccountMandateId: accountMandates[i].Id,
                ClientAccountId: accountData.Id,
                ClientKycBankId: accountMandates[i].ClientKycBankId,
                MFUCAN: accountData.MFUCAN,
                ARN: accountData.ARN,
                AccountNumber: accountMandates[i].AccountNumber,
                BankAccountTypeCode: accountMandates[i].BankAccountTypeCode,
                IFSC: accountMandates[i].IFSC,
                MICR: accountMandates[i].MICR,
                BankName: accountMandates[i].BankName,
                Amount: accountMandates[i].Amount,
                StartDate: date.format(startDate, 'YYYY-MM-DD'),
                EndDate: date.format(endDate, 'YYYY-MM-DD')
            };

            let mfuMandateResult = await mfuService.ePayEezzRegistration(mandateData);

            // if (mfuMandateResult.respStatus == 0) {
            //     //send approval email
            // }
        }
    }

    return accountData;
};

exports.SaveClientAccountDocument = async (req, res, ClientAccountId, ClientAccountMandateId, Name, FileName, FileContent, FileContentType, DocumentType) => {
    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        const request = transaction.request();
        request.input("ClientAccountId", cryptoEngine.ParamDecrypt(ClientAccountId, true))
            .input("ClientAccountMandateId", cryptoEngine.ParamDecrypt(ClientAccountMandateId, true))
            .input("Name", Name)
            .input("FileName", FileName)
            .input("FileContent", FileContent)
            .input("FileContentType", FileContentType)
            .input("DocumentType", DocumentType);
        const result = await request.execute("InsertClientAccountDocument");

        await transaction.commit();

        return result;
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        return new Error('Error while saving document');
    }
};

exports.GetClientAccountListByAssociateId = async (req, res) => {
    const AssociateId = req.params.Id;

    var errorMessage = "Error while getting client account data";
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        const readResult = await readRequest.execute("GetClientAccountList");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset.map(item => {
                const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                const ClientAccountId = cryptoEngine.ParamEncrypt(item.Id, true);
                const ClientId = cryptoEngine.ParamEncrypt(item.ClientId, true);
                const AccountTypeId = cryptoEngine.ParamEncrypt(item.AccountTypeId, true);
                const AssociateData = 'Associate Code: ' + process.env.BSE_MEMBER_ID + '' + item.AssociateCode + '<br>Associate ARN: ARN-' + item.ARN + '<br>Associate EUIN: ' + ((item.EUIN != '') ? 'E' + item.EUIN : '');
                const AccountData = 'UCC: ' + item.UCC + ((item.MFUCAN != '') ? '<br>MFU eCAN: ' + item.MFUCAN : '') + ((item.LBUserId != '') ? '<br>LB User Id: ' + item.LBUserId : '') + '<br>Family Name: ' + item.FamilyName + '<br>Tax Status: ' + item.TaxStatusName;
                const LastModifiedData = 'Last Modified Date: ' + date.format(item.AccountModifiedDate, 'DD-MM-YYYY');
                const LeadId = cryptoEngine.ParamEncrypt(item.LeadId, true);
                const EmployeeId = cryptoEngine.ParamEncrypt(item.EmployeeId, true);

                return { ...item, Id, ClientAccountId, ClientId, AccountTypeId, AssociateData, AccountData, LastModifiedData, LeadId, EmployeeId };
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

exports.GetAssociateClientAccountList = async (req, res) => {
    const AssociateId = req.params.Id;

    var errorMessage = "Error while getting client account data";
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        const readResult = await readRequest.execute("GetAssociateClientAccountList");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset.map(item => {
                const ClientAccountId = cryptoEngine.ParamEncrypt(item.Id, true);
                const ClientId = cryptoEngine.ParamEncrypt(item.ClientId, true);
                const AccountTypeId = cryptoEngine.ParamEncrypt(item.AccountTypeId, true);
                const EmployeeId = cryptoEngine.ParamEncrypt(item.EmployeeId, true);

                return { ...item, ClientAccountId, ClientId, AccountTypeId, EmployeeId };
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

exports.GetClientAccountAssetAllocationByClientAccountId = async (req, res) => {
    const Id = req.params.Id;

    var errorMessage = "Error while fetching client...";

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientAccount", cryptoEngine.ParamDecrypt(Id, true));
        const readResult = await readRequest.execute("GetClientAccountAssetAllocation");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    ClientId: cryptoEngine.ParamEncrypt(dataList[i].ClientId, true),
                    ClientEntityId: cryptoEngine.ParamEncrypt(dataList[i].ClientEntityId, true),
                    LumpsumEquity: dataList[i].LumpsumEquity,
                    LumpsumDebt: dataList[i].LumpsumDebt,
                    SipEquity: dataList[i].SipEquity,
                    SipDebt: dataList[i].SipDebt

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

exports.GetClientMandateDetailsByClientAccountId = async (req, res) => {
    const Id = req.params.Id;

    // console.log(Id);

    var errorMessage = "Error while fetching client...";

    try {
        var data = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(Id, true));
        const readResult = await readRequest.execute("GetClientMandateDetailsByClientAccountId");
        if (readResult.recordset.length > 0) {
            data = readResult.recordset.map(item => {
                const Id = cryptoEngine.ParamEncrypt(item.Id, true);

                return { ...item, Id };
            });
        }

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetAppUserClientProfiles = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching profiles...";

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetAppUserClientProfile");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let menuOptions = await appUserController.GetAppUserTypeMenuOptions(req, res, cryptoEngine.ParamEncrypt(dataList[i].AppUserId, true), 'Client');

                let dataItem = {
                    AppUserId: cryptoEngine.ParamEncrypt(dataList[i].AppUserId, true),
                    ClientId: cryptoEngine.ParamEncrypt(dataList[i].ClientId, true),
                    ClientKycProfileId: cryptoEngine.ParamEncrypt(dataList[i].ClientKycProfileId, true),
                    Name: dataList[i].Name,
                    MenuOptions: menuOptions
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

exports.GetClientAccountListByAssociateIdProfile = async (req, res) => {
    const AssociateId = req.params.AssociateId;
    const PANCardNumber = req.params.PANCardNumber;
    const FirstHolderName = req.params.FirstHolderName;

    var errorMessage = "Error while getting client account data";
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true))
            .input("PANCardNumber", PANCardNumber)
            .input("FirstHolderName", FirstHolderName);
        const readResult = await readRequest.execute("GetClientAccountListByProfile");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset.map(item => {
                const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                const EmployeeId = cryptoEngine.ParamEncrypt(item.EmployeeId, true);

                return { ...item, Id, EmployeeId };
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

exports.SaveClientPreferences = async (req, res) => {
    var { ClientId, ClientUserMenuData, Mode } = req.body;

    let ClientAppUserMenuData = JSON.parse(ClientUserMenuData);

    var errorMessage = "Error while saving client preferences...";

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        for (let i = 0; i < ClientAppUserMenuData.length; i++) {
            let menuOptions = JSON.parse(ClientAppUserMenuData[i].MenuOptions);

            const requestDelete = transaction.request();

            requestDelete.input("AppUserId", cryptoEngine.ParamDecrypt(ClientAppUserMenuData[i].AppUserId, true));

            const resultDelete = await requestDelete.execute("DeleteAppUserMenuOptions");

            for (let j = 0; j < menuOptions.length; j++) {
                const request = transaction.request();

                request.input("AppUserId", cryptoEngine.ParamDecrypt(ClientAppUserMenuData[i].AppUserId, true))
                    .input("MenuOptionId", cryptoEngine.ParamDecrypt(menuOptions[j].MenuOptionId, true))
                    .input("IsCreate", true);

                const result = await request.execute("InsertAppUserMenuOption");
            }

            const requestUpdate = transaction.request();

            requestUpdate.input("Id", cryptoEngine.ParamDecrypt(ClientAppUserMenuData[i].AppUserId, true))
                .input("IsActive", true);

            const resultUpdate = await requestUpdate.execute("UpdateAppUserStatus");
        }

        const requestUpdate = transaction.request();
        requestUpdate.input("Id", cryptoEngine.ParamDecrypt(ClientId, true))
            .input("IsActive", true);
        const resultUpdate = await requestUpdate.execute("UpdateClientStatus");

        const requestUpdate1 = transaction.request();
        requestUpdate1.input("Id", cryptoEngine.ParamDecrypt(ClientId, true))
            .input("IsRightsCompleted", true);
        const resultUpdate1 = await requestUpdate1.execute("UpdateClientRightsCompletedStatus");

        await transaction.commit();

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetAppUserClientProfileCredentials");
        if (readResult.recordset.length > 0) {
            let dataList = readResult.recordset.filter(x => x.IsCredentialEmailSent == false);

            for (let i = 0; i < dataList.length; i++) {
                var link = process.env.WEB_APP_LINK + '/signin';
                emailEngine.SendClientCredentials(dataList[i].Email, dataList[i].Name, link, cryptoEngine.Decrypt(dataList[i].PIN, true));

                await updateClientCredentialSent(req, dataList[i].AppUserId);
            }
        }

        res.status(200).send({ Status: true, Message: "Client preferences saved successfully.", Data: { ClientId: ClientId } });
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

exports.DeleteClient = async (req, res) => {
    var { Id } = req.body;

    var errorMessage = "Error while deleting client...";

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        const requestDelete = transaction.request();
        requestDelete.input("Id", cryptoEngine.ParamDecrypt(Id, true));
        const resultDelete = await requestDelete.execute("DeleteClient");
        await transaction.commit();

        res.status(200).send({ Status: true, Message: "Client deleted successfully.", Data: { ClientId: Id } });
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

exports.GetClientTransactionProfiles = async (req, res) => {
    const AssociateId = req.params.AssociateId;

    var errorMessage = "Error while client profile data...";

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
        const readResult = await readRequest.execute("GetClientTransactionProfiles");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset.map(item => {
                const EmployeeId = cryptoEngine.ParamEncrypt(item.EmployeeId, true);

                return { ...item, EmployeeId };
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

exports.GetClientAccountAumSummary = async (req, res) => {
    const UCC = req.params.UCC;

    var errorMessage = "Error while client profile data...";

    try {
        var data = {
            CurrentAmount: 0,
            InvestmentAmount: 0,
            InvestmentReturns: 0
        };

        const readRequest = req.app.locals.db.request();
        readRequest.input("UCC", UCC);
        const readResult = await readRequest.execute("GetClientAccountAUM");
        if (readResult.recordset.length > 0) {
            data = readResult.recordset[0];
        }

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientAccountPortfolioAumSummary = async (req, res) => {
    const UCC = req.params.UCC;
    const PortfolioTypeCode = req.params.PortfolioTypeCode;
    const PlanTypeCode = req.params.PlanTypeCode;
    const AsOnDate = req.params.AsOnDate;

    var errorMessage = "Error while client profile data...";

    try {
        var data = {
            CurrentAmount: 0,
            InvestmentAmount: 0,
            InvestmentReturns: 0,
            CurrentEquityRatio: 0,
            CurrentDebtRatio: 0,
            BenchmarkCurrentAmount: 0,
            BenchmarkInvestmentAmount: 0,
            BenchmarkInvestmentReturns: 0
        };

        const readRequest = req.app.locals.db.request();
        readRequest.input("UCC", UCC)
            .input("PortfolioTypeCode", PortfolioTypeCode)
            .input("PlanTypeCode", PlanTypeCode)
            .input("AsOnDate", AsOnDate);
        const readResult = await readRequest.execute("GetClientAccountPortfolioAUM");
        if (readResult.recordset.length > 0) {
            var dataItem = readResult.recordset[0];

            data.CurrentAmount = dataItem.CurrentAmount;
            data.InvestmentAmount = dataItem.InvestmentAmount;
            data.InvestmentReturns = dataItem.InvestmentReturns;
            data.BenchmarkCurrentAmount = dataItem.BenchmarkCurrentAmount;
            data.BenchmarkInvestmentAmount = dataItem.BenchmarkInvestmentAmount;
            data.BenchmarkInvestmentReturns = dataItem.BenchmarkInvestmentReturns;
        }

        const readRatioRequest = req.app.locals.db.request();
        readRatioRequest.input("UCC", UCC)
            .input("PortfolioTypeCode", PortfolioTypeCode)
            .input("PlanTypeCode", PlanTypeCode)
            .input("AsOnDate", AsOnDate);
        const readRatioResult = await readRatioRequest.execute("GetClientAccountPortfolioAUMAllocation");
        if (readRatioResult.recordset.length > 0) {
            var dataList = readRatioResult.recordset;

            var equityItem = dataList.find(x => x.BuyType == 'Equity');
            var debtItem = dataList.find(x => x.BuyType == 'Debt');

            if (data.CurrentAmount != 0 && equityItem != null) {
                data.CurrentEquityRatio = Math.round((equityItem.CurrentAmount / data.CurrentAmount) * 100);
            }

            if (data.CurrentAmount != 0 && debtItem != null) {
                data.CurrentDebtRatio = Math.round((debtItem.CurrentAmount / data.CurrentAmount) * 100);
            }
        }

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientAccountPortfolioHolding = async (req, res) => {
    const UCC = req.params.UCC;
    const PortfolioTypeCode = req.params.PortfolioTypeCode;
    const PlanTypeCode = req.params.PlanTypeCode;
    const AsOnDate = req.params.AsOnDate;

    var errorMessage = "Error while client profile data...";

    try {
        var data = [];
        var dataList = [];
        var currentDate = luxon.DateTime.now().setZone('Asia/Kolkata');
        var dataAum = {
            CurrentAmount: 0,
            InvestmentAmount: 0,
            InvestmentReturns: 0,
            CurrentEquityRatio: 0,
            CurrentDebtRatio: 0
        };
        var clientAccount;
        var firstHolder;
        var isNRI = false;
        var portfolioSchemes;
        var portfolioAllSchemes = await transactionPortfolioController.GetTransationPortfolioSchemesCurrentAll(req, res);

        if (PortfolioTypeCode == 'A') {
            portfolioSchemes = portfolioAllSchemes;
        }
        else {
            portfolioSchemes = portfolioAllSchemes.filter(x => x.Code == PortfolioTypeCode);
        }

        const readClientRequest = req.app.locals.db.request();
        readClientRequest.input("UCC", UCC);
        const readClientResult = await readClientRequest.execute("GetClientAccountByUCC");
        if (readClientResult.recordset.length > 0) {
            var dataItem = readClientResult.recordset[0];

            clientAccount = await this.GetClientAccountInfo(req, res, cryptoEngine.ParamEncrypt(dataItem.Id, true));

            firstHolder = clientAccount.AccountHolders.find(x => x.SerialNumber == 1);

            isNRI = (firstHolder.ProfileDetails.TaxStatusCode == '11' || firstHolder.ProfileDetails.TaxStatusCode == '21' || firstHolder.ProfileDetails.TaxStatusCode == '24' || firstHolder.ProfileDetails.TaxStatusCode == '26' || firstHolder.ProfileDetails.TaxStatusCode == '28');
        }

        const readAumRequest = req.app.locals.db.request();
        readAumRequest.input("UCC", UCC)
            .input("PortfolioTypeCode", PortfolioTypeCode)
            .input("PlanTypeCode", PlanTypeCode)
            .input("AsOnDate", AsOnDate);
        const readAumResult = await readAumRequest.execute("GetClientAccountPortfolioAUM");
        if (readAumResult.recordset.length > 0) {
            var dataItem = readAumResult.recordset[0];

            dataAum.CurrentAmount = dataItem.CurrentAmount;
            dataAum.InvestmentAmount = dataItem.InvestmentAmount;
            dataAum.InvestmentReturns = dataItem.InvestmentReturns;
        }

        const readRequest = req.app.locals.db.request();
        readRequest.input("UCC", UCC)
            .input("PortfolioTypeCode", PortfolioTypeCode)
            .input("PlanTypeCode", PlanTypeCode)
            .input("AsOnDate", AsOnDate);
        const readResult = await readRequest.execute("GetClientAccountPortfolioHoldingRecords");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset.map(item => {
                const Id = cryptoEngine.ParamEncrypt(item.Id, true);

                return { ...item, Id };
            });
        }

        if (dataList.length > 0) {
            var dataMap = dataList.map(item => {
                const SchemeName = item.SchemeName;
                const ISIN = item.ISIN;
                const SchemeCode = item.SchemeCode;
                const FolioNumber = item.NewFolioNumber;
                const ProductCode = item.ProductCode;
                const Units = 0;
                const BuyAvg = 0;
                const InvestmentAmount = 0;
                const CurrentNAV = 0;
                const CurrentAmount = 0;
                const InvestmentReturns = 0;
                const XIRR = 0;
                const WeightagePercentage = 0;
                const DesiredPercentage = 0;
                const PortfolioTypeName = '';
                const BenchmarkInvestment = 0;
                const BenchmarkWealth = 0;
                const BenchmarkReturns = 0;

                return { SchemeName, ISIN, SchemeCode, FolioNumber, ProductCode, Units, BuyAvg, InvestmentAmount, CurrentNAV, CurrentAmount, InvestmentReturns, XIRR, WeightagePercentage, DesiredPercentage, PortfolioTypeName,BenchmarkInvestment,BenchmarkWealth,BenchmarkReturns };
            });

            const uniqueObjects = new Map();
            dataMap.forEach(obj => {
                const key = JSON.stringify(obj);
                uniqueObjects.set(key, obj);
            });

            data = Array.from(uniqueObjects.values());
        }

        for (let i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var transactionList = dataList.filter(x => x.NewFolioNumber == dataItem.FolioNumber && x.ProductCode == dataItem.ProductCode);

            var portfolioName = '';
            if (transactionList.length > 0) {
                portfolioName = transactionList[0].Portfolio;
            }

            dataItem.PortfolioTypeName = portfolioName;

            dataItem.Units = transactionList.reduce((sum, fund) => sum + fund.BalanceUnits, 0);
            dataItem.InvestmentAmount = transactionList.reduce((sum, fund) => sum + fund.InvestmentAmount, 0);
            dataItem.CurrentNAV = transactionList[0].CurrentNAV;
            dataItem.CurrentAmount = transactionList.reduce((sum, fund) => sum + fund.CurrentAmount, 0);
            dataItem.InvestmentReturns = transactionList.reduce((sum, fund) => sum + fund.InvestmentReturns, 0);
            dataItem.BenchmarkInvestment = transactionList.reduce((sum, fund) => sum + fund.BenchmarkInvestmentAmount, 0);
            dataItem.BenchmarkWealth = transactionList.reduce((sum, fund) => sum + fund.BenchmarkCurrentAmount, 0);
            dataItem.BenchmarkReturns = transactionList.reduce((sum, fund) => sum + fund.BenchmarkInvestmentReturns, 0);
            dataItem.WeightagePercentage = (portfolioName == 'Wealth') ? ((dataAum.CurrentAmount > 0) ? (dataItem.CurrentAmount / dataAum.CurrentAmount * 100) : 0) : 0;

            var totalPurchaseAmount = transactionList.reduce((sum, fund) => sum + fund.PurchaseAmount, 0);
            var totalUnits = transactionList.reduce((sum, fund) => sum + fund.Units, 0);

            dataItem.BuyAvg = Number((totalPurchaseAmount / totalUnits).toFixed(3));

            var inputData = [];
            for (let j = 0; j < transactionList.length; j++) {
                var item = transactionList[j];

                inputData.push({ amount: item.InvestmentAmount, date: luxon.DateTime.fromISO(item.TradeDate.toISOString(), { zone: 'Asia/Kolkata' }).toFormat('yyyyMMdd') });
            }

            if (dataItem.CurrentAmount > 0) {
                inputData.push({ amount: (0 - dataItem.CurrentAmount), date: currentDate.toFormat('yyyyMMdd') });

                var xirrData = xirr.xirr(inputData);
                var XIRR = xirr.convertRate(xirrData.rate, xirr.RateInterval.Year);
                dataItem.XIRR = XIRR * 100;
            }

            var portfolioSchemeItem = portfolioSchemes.find(x => x.ChannelPartnerCode == dataItem.ProductCode && x.ISIN == dataItem.ISIN);
            if (portfolioSchemeItem != null) {
                dataItem.DesiredPercentage = (portfolioName == 'Wealth') ? ((isNRI == true) ? portfolioSchemeItem.NRIPercentage : portfolioSchemeItem.ResidentPercentage) : 0;
            }
        }

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientAccountPortfolioHoldingSchemeTransactions = async (req, res) => {
    const FolioNumber = req.params.FolioNumber;
    const ProductCode = req.params.ProductCode;
    const AsOnDate = req.params.AsOnDate;

    var errorMessage = "Error while client profile data...";

    try {
        var data = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("FolioNumber", FolioNumber)
            .input("ProductCode", ProductCode)
            .input("AsOnDate", AsOnDate);
        const readResult = await readRequest.execute("GetClientAccountPortfolioHoldingSchemeDetails");
        if (readResult.recordset.length > 0) {
            data = readResult.recordset.map(item => {
                const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                const BuyAvg = 0;

                return { ...item, Id, BuyAvg };
            });
        }

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.DownloadClientAccountPortfolioHoldingReport = async (req, res) => {
    const UCC = req.params.UCC;

    var errorMessage = "Error while preparing client holding report...";

    try {
        var reportPathData = await createClientAccountPortfolioHoldingReport(req, UCC);

        res.status(200).send({ Status: true, Message: "", Data: process.env.WEB_API_LINK + '/doc/report/' + reportPathData.FileName });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.EmailClientAccountPortfolioHoldingReport = async (req, res) => {
    const UCC = req.params.UCC;

    var errorMessage = "Error while preparing client holding report...";

    try {
        var reportPathData = await createClientAccountPortfolioHoldingReport(req, UCC);

        const readAccountRequest = req.app.locals.db.request();
        readAccountRequest.input("UCC", UCC);
        const readAccountResult = await readAccountRequest.execute("GetClientAccountByUCC");
        if (readAccountResult.recordset.length > 0) {
            let accountData = readAccountResult.recordset[0];

            var clientAccount = await this.GetClientAccountInfo(req, res, cryptoEngine.ParamEncrypt(accountData.Id, true));

            var firstHolder = clientAccount.AccountHolders.find(x => x.SerialNumber == 1);

            var emailData = {
                ClientName: firstHolder.ProfileDetails.Name,
                Email: firstHolder.ProfileDetails.Email,
                FileName: reportPathData.FileName,
                FilePath: process.env.WEB_API_LINK + '/doc/report/' + reportPathData.FileName
            };

            var subject = 'Kinntegra - Holding Report';
            emailEngine.SendClientHoldingReport(emailData.Email, emailData.ClientName, emailData.FileName, emailData.FilePath, subject);
        }

        res.status(200).send({ Status: true, Message: "", Data: process.env.WEB_API_LINK + '/doc/report/' + reportPathData.FileName });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetFamilySerialNumber = async (req, res) => {
    const FamilyName = req.params.FamilyName;

    var errorMessage = "Error while fetching family names...";

    try {
        var familyNameCount = 0;

        const readAccountRequest = req.app.locals.db.request();
        readAccountRequest.input("FamilyName", FamilyName);
        const readAccountResult = await readAccountRequest.execute("GetClientFamilyNameCount");
        if (readAccountResult.recordset.length > 0) {
            familyNameCount = readAccountResult.recordset[0].FamilyNameCount;
        }

        res.status(200).send({ Status: true, Message: "", Data: { FamilySerialNumber: familyNameCount } });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.SaveClientKycModificationLog = async (req, res) => {
    var { ClientId, ModificationLog } = req.body;

    let ModificationLogData = JSON.parse(ModificationLog);

    var errorMessage = "Error while saving client profile modification log...";

    var currentDate = luxon.DateTime.now().setZone('Asia/Kolkata');

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        for (let i = 0; i < ModificationLogData.length; i++) {
            var item = ModificationLogData[i];

            const request = transaction.request();
            request.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                .input("ClientKycProfileId", cryptoEngine.ParamDecrypt(item.ClientKycProfileId, true))
                .input("ModificationDate", currentDate.toFormat('yyyy-MM-dd'))
                .input("ModificationType", item.ModificationType)
                .input("ModificationReason", item.ModificationReason)
                .input("IsLocked", true);
            const result = await request.execute("InsertClientKycModificationLog");
        }

        const accountRequest = transaction.request();
        accountRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const accountResult = await accountRequest.execute("UpdateClientAccountProfileLock");

        await transaction.commit();

        res.status(200).send({ Status: true, Message: "Client kyc modification log saved successfully.", Data: { ClientId: ClientId } });
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

exports.GetClientAccountLockedCount = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching accounts...";

    try {
        var lockedCount = 0;

        const readAccountRequest = req.app.locals.db.request();
        readAccountRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readAccountResult = await readAccountRequest.execute("GetClientAccountLockedCount");
        if (readAccountResult.recordset.length > 0) {
            lockedCount = readAccountResult.recordset[0].AccountLockedCount;
        }

        res.status(200).send({ Status: true, Message: "", Data: { AccountLockedCount: lockedCount } });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientKycModificationLog = async (req, res) => {
    const ClientId = req.params.ClientId;
    const ClientKycProfileId = req.params.ClientKycProfileId;
    const ModificationType = req.params.ModificationType;

    var errorMessage = "Error while fetching log...";

    try {
        var data = [];

        const readAccountRequest = req.app.locals.db.request();
        readAccountRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
            .input("ClientKycProfileId", cryptoEngine.ParamDecrypt(ClientKycProfileId, true))
            .input("ModificationType", ModificationType);
        const readAccountResult = await readAccountRequest.execute("GetClientKycModificationLog");
        if (readAccountResult.recordset.length > 0) {
            data = readAccountResult.recordset.map(item => {
                const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                const ClientId = cryptoEngine.ParamEncrypt(item.ClientId, true);
                const ClientKycProfileId = cryptoEngine.ParamEncrypt(item.ClientKycProfileId, true);

                return { ...item, Id, ClientId, ClientKycProfileId };
            });
        }

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientAssetAllocationModificationLog = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching log...";

    try {
        var data = [];

        const readAccountRequest = req.app.locals.db.request();
        readAccountRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readAccountResult = await readAccountRequest.execute("GetClientAssetAllocationModificationLog");
        if (readAccountResult.recordset.length > 0) {
            data = readAccountResult.recordset.map(item => {
                const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                const ClientId = cryptoEngine.ParamEncrypt(item.ClientId, true);

                return { ...item, Id, ClientId };
            });
        }

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientAccountModificationLog = async (req, res) => {
    const ClientId = req.params.ClientId;
    const ClientAccountId = req.params.ClientAccountId;

    var errorMessage = "Error while fetching log...";

    try {
        var data = [];

        const readAccountRequest = req.app.locals.db.request();
        readAccountRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
            .input("ClientAccountId", cryptoEngine.ParamDecrypt(ClientAccountId, true));
        const readAccountResult = await readAccountRequest.execute("GetClientAccountModificationLog");
        if (readAccountResult.recordset.length > 0) {
            data = readAccountResult.recordset.map(item => {
                const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                const ClientId = cryptoEngine.ParamEncrypt(item.ClientId, true);
                const ClientAccountId = cryptoEngine.ParamEncrypt(item.ClientAccountId, true);

                return { ...item, Id, ClientId, ClientAccountId };
            });
        }

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientAccountMandateModificationLog = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching log...";

    try {
        var data = [];

        const readAccountRequest = req.app.locals.db.request();
        readAccountRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readAccountResult = await readAccountRequest.execute("GetClientAccountMandateModificationLog");
        if (readAccountResult.recordset.length > 0) {
            data = readAccountResult.recordset.map(item => {
                const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                const ClientId = cryptoEngine.ParamEncrypt(item.ClientId, true);
                const ClientKycProfileId = cryptoEngine.ParamEncrypt(item.ClientKycProfileId, true);

                return { ...item, Id, ClientId, ClientKycProfileId };
            });
        }

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.SaveClientAccountRejectionLog = async (req, res) => {
    var { ClientId, RejectionLog } = req.body;

    let RejectionLogData = JSON.parse(RejectionLog);

    var errorMessage = "Error while saving client account rejection log...";

    var currentDate = luxon.DateTime.now().setZone('Asia/Kolkata');

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        for (let i = 0; i < RejectionLogData.length; i++) {
            var item = RejectionLogData[i];

            const request = transaction.request();
            request.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                .input("ClientAccountId", cryptoEngine.ParamDecrypt(item.ClientAccountId, true))
                .input("RejectionDate", currentDate.toFormat('yyyy-MM-dd'))
                .input("RejectionReason", item.RejectionReason);
            const result = await request.execute("InsertClientAccountRejectionLog");
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

    try {
        if (RejectionLogData.length > 0) {
            var item = RejectionLogData[0];

            var accountData = await this.GetClientAccountInfo(req, res, item.ClientAccountId);

            //notification
            var familyName = '';
            var dataItem;
            var notificationAppUsers = [];

            const readRequest = req.app.locals.db.request();
            readRequest.input("Id", cryptoEngine.ParamDecrypt(accountData.ClientId, true));
            const readResult = await readRequest.execute("GetClientById");
            if (readResult.recordset.length > 0) {
                dataItem = readResult.recordset[0];
            }

            if (dataItem != null) {
                const readRequest = req.app.locals.db.request();
                readRequest.input("ClientId", cryptoEngine.ParamDecrypt(accountData.ClientId, true));
                const readResult = await readRequest.execute("GetClientNotificationAppUser");
                if (readResult.recordset.length > 0) {
                    notificationAppUsers = readResult.recordset;
                }
            }

            if (dataItem != null) {
                familyName = dataItem.FamilyName;

                let title = 'Client ' + familyName + ' has declined the self-approval request. Please check your email and coordinate with the client for further assistance.'
                let link = 'client-introduction/' + ClientId + '/' + cryptoEngine.ParamEncrypt(dataItem.LeadId, true) + '/' + cryptoEngine.ParamEncrypt('edit', true);

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

                var RejectionReason = '';

                for (let i = 0; i < RejectionLogData.length; i++) {
                    var item = RejectionLogData[i];

                    RejectionReason += item.RejectionReason + '<br/>';
                }

                emailEngine.SendClientAccountRejectionLog(dataItem.Email1, dataItem.AssociateName, dataItem.FamilyName, RejectionReason);

                // res.status(200).send({ Status: true, Message: "Notification saved successfully.", Data: null });
            }
            else {
                // res.status(200).send({ Status: false, Message: "Invalid client.", Data: null });
            }
        }

        res.status(200).send({ Status: true, Message: "Client account rejection log saved successfully.", Data: { ClientId: ClientId } });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.SaveClientSupervisorRejectionLog = async (req, res) => {
    var { ClientId, RejectionReason } = req.body;

    var errorMessage = "Error while saving client rejection log...";

    var currentDate = luxon.DateTime.now().setZone('Asia/Kolkata');

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        const request = transaction.request();
        request.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
            .input("RejectionDate", currentDate.toFormat('yyyy-MM-dd'))
            .input("RejectionReason", RejectionReason);
        const result = await request.execute("InsertClientSupervisorRejectionLog");

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

    try {
        //notification
        var familyName = '';
        var dataItem;
        var notificationAppUsers = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("Id", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientById");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        if (dataItem != null) {
            const readRequest = req.app.locals.db.request();
            readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
            const readResult = await readRequest.execute("GetClientNotificationAppUser");
            if (readResult.recordset.length > 0) {
                notificationAppUsers = readResult.recordset;
            }
        }

        if (dataItem != null) {
            familyName = dataItem.FamilyName;

            let title = 'Approval Request for ' + familyName + ' has been rejected by the Super Admin. Please check your email for further details and necessary action.';
            let link = 'client-introduction/' + ClientId + '/' + cryptoEngine.ParamEncrypt(dataItem.LeadId, true) + '/' + cryptoEngine.ParamEncrypt('edit', true);

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

            emailEngine.SendClientSupervisorRejectionLog(dataItem.Email1, dataItem.AssociateName, dataItem.FamilyName, RejectionReason);

            // res.status(200).send({ Status: true, Message: "Notification saved successfully.", Data: null });
        }
        else {
            // res.status(200).send({ Status: false, Message: "Invalid client.", Data: null });
        }

        res.status(200).send({ Status: true, Message: "Client account rejection log saved successfully.", Data: { ClientId: ClientId } });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.SendBulkClientCredentials = async (req, res) => {
    var errorMessage = "Error while saving client preferences...";

    try {
        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetBulkClientCredentials");
        if (readResult.recordset.length > 0) {
            var dataList = readResult.recordset;
            for (let i = 0; i < readResult.recordset.length; i++) {
                console.log(dataList[i].Email);
                var link = process.env.WEB_APP_LINK + '/signin';
                emailEngine.SendBulkClientCredentials(dataList[i].Email, dataList[i].Name, link, cryptoEngine.Decrypt(dataList[i].PIN, true), cryptoEngine.Decrypt(dataList[i].Password, true));

                await updateClientCredentialSent(req, dataList[i].AppUserId);
            }
        }

        res.status(200).send({ Status: true, Message: "Client preferences saved successfully.", Data: { ClientCount: readResult.recordset.length } });
    }
    catch (err) {
        console.log(err);

        res.status(500).send(errorMessage);
    }
};

async function createClientAccountPortfolioHoldingReport(req, ucc) {
    var clientAccountData = await exports.GetClientAccountInfoByUcc(req, null, ucc);
    // var summaryData = await getHoldingPerformanceSummaryReportData(req, ucc);
    var cashflowData = await getHoldingPerformanceCashFlowReportData(req, ucc);
    var performanceData = await getHoldingPerformanceReportData(req, ucc);
    var purchaseData = await getFeedTransactionPurchaseData(req, ucc);
    var redemptionData = await getFeedTransactionRedemptionData(req, ucc);

    var reportPathData = await excelEngine.CreateClientHoldingReport(ucc, clientAccountData, cashflowData, performanceData, purchaseData, redemptionData);

    return reportPathData;
};

async function getHoldingPerformanceCashFlowReportData(req, ucc) {
    var currentDate = luxon.DateTime.now().setZone('Asia/Kolkata');

    var data = {
        InvestmentEquity: 0,
        InvestmentDebt: 0,
        InvestmentCommodities: 0,
        SwitchInEquity: 0,
        SwitchInDebt: 0,
        SwitchInCommodities: 0,
        RedemptionEquity: 0,
        RedemptionDebt: 0,
        RedemptionCommodities: 0,
        SwitchOutEquity: 0,
        SwitchOutDebt: 0,
        SwitchOutCommodities: 0,
        DividendPayoutEquity: 0,
        DividendPayoutDebt: 0,
        DividendPayoutCommodities: 0,
        CurrentAmountEquity: 0,
        CurrentAmountDebt: 0,
        CurrentAmountCommodities: 0,
        RealisedGainLossEquity: 0,
        RealisedGainLossDebt: 0,
        RealisedGainLossCommodities: 0,
        UnrealisedGainLossEquity: 0,
        UnrealisedGainLossDebt: 0,
        UnrealisedGainLossCommodities: 0,
        CashInFlowEquity: 0,
        CashOutFlowEquity: 0,
        NetInvestmentEquity: 0,
        NetGainEquity: 0,
        XIRREquity: 0,
        CashInFlowDebt: 0,
        CashOutFlowDebt: 0,
        NetInvestmentDebt: 0,
        NetGainDebt: 0,
        XIRRDebt: 0,
        CashInFlowCommodities: 0,
        CashOutFlowCommodities: 0,
        NetInvestmentCommodities: 0,
        NetGainCommodities: 0,
        XIRRCommodities: 0,
        InvestmentTotal: 0,
        SwitchInTotal: 0,
        RedemptionTotal: 0,
        SwitchOutTotal: 0,
        DividendPayoutTotal: 0,
        CurrentAmountTotal: 0,
        RealisedGainLossTotal: 0,
        UnrealisedGainLossTotal: 0,
        CashInFlowTotal: 0,
        CashOutFlowTotal: 0,
        NetInvestmentTotal: 0,
        NetGainTotal: 0,
        XIRRTotal: 0,
    };

    var rawData;
    var rawXirrData;

    const readRequest = req.app.locals.db.request();
    readRequest.input("UCC", ucc);
    const readResult = await readRequest.execute("GetHoldingPerformanceCashFlowReportData");
    if (readResult.recordset.length > 0) {
        rawData = readResult.recordset[0];
    }

    if (rawData != null) {
        data.InvestmentEquity = rawData.InvestmentEquity;
        data.InvestmentDebt = rawData.InvestmentDebt;
        data.InvestmentCommodities = rawData.InvestmentCommodities;
        data.SwitchInEquity = rawData.SwitchInEquity;
        data.SwitchInDebt = rawData.SwitchInDebt;
        data.SwitchInCommodities = rawData.SwitchInCommodities;
        data.RedemptionEquity = rawData.RedemptionEquity;
        data.RedemptionDebt = rawData.RedemptionDebt;
        data.RedemptionCommodities = rawData.RedemptionCommodities;
        data.SwitchOutEquity = rawData.SwitchOutEquity;
        data.SwitchOutDebt = rawData.SwitchOutDebt;
        data.SwitchOutCommodities = rawData.SwitchOutCommodities;
        data.DividendPayoutEquity = rawData.DividendPayoutEquity;
        data.DividendPayoutDebt = rawData.DividendPayoutDebt;
        data.DividendPayoutCommodities = rawData.DividendPayoutCommodities;
        data.CurrentAmountEquity = rawData.CurrentAmountEquity;
        data.CurrentAmountDebt = rawData.CurrentAmountDebt;
        data.CurrentAmountCommodities = rawData.CurrentAmountCommodities;
        data.RealisedGainLossEquity = rawData.RealisedGainLossEquity;
        data.RealisedGainLossDebt = rawData.RealisedGainLossDebt;
        data.RealisedGainLossCommodities = rawData.RealisedGainLossCommodities;
        data.UnrealisedGainLossEquity = rawData.UnrealisedGainLossEquity;
        data.UnrealisedGainLossDebt = rawData.UnrealisedGainLossDebt;
        data.UnrealisedGainLossCommodities = rawData.UnrealisedGainLossCommodities;

        data.CashInFlowEquity = rawData.InvestmentEquity + rawData.SwitchInEquity;
        data.CashInFlowDebt = rawData.InvestmentDebt + rawData.SwitchInDebt;
        data.CashInFlowCommodities = rawData.InvestmentCommodities + rawData.SwitchInCommodities;
        data.InvestmentTotal = rawData.InvestmentEquity + rawData.InvestmentDebt + rawData.InvestmentCommodities;
        data.SwitchInTotal = rawData.SwitchInEquity + rawData.SwitchInDebt + rawData.SwitchInCommodities;
        data.CashInFlowTotal = data.CashInFlowEquity + data.CashInFlowDebt + data.CashInFlowCommodities;

        data.CashOutFlowEquity = rawData.RedemptionEquity + rawData.SwitchOutEquity + rawData.DividendPayoutEquity;
        data.CashOutFlowDebt = rawData.RedemptionDebt + rawData.SwitchOutDebt + rawData.DividendPayoutDebt;
        data.CashOutFlowCommodities = rawData.RedemptionCommodities + rawData.SwitchOutCommodities + rawData.DividendPayoutCommodities;
        data.RedemptionTotal = rawData.RedemptionEquity + rawData.RedemptionDebt + rawData.RedemptionCommodities;
        data.SwitchOutTotal = rawData.SwitchOutEquity + rawData.SwitchOutDebt + rawData.SwitchOutCommodities;
        data.DividendPayoutTotal = rawData.DividendPayoutEquity + rawData.DividendPayoutDebt + rawData.DividendPayoutCommodities;
        data.CashOutFlowTotal = data.CashOutFlowEquity + data.CashOutFlowDebt + data.CashOutFlowCommodities;

        data.NetInvestmentEquity = rawData.InvestmentEquity + rawData.SwitchInEquity - rawData.RedemptionEquity - rawData.SwitchOutEquity - rawData.DividendPayoutEquity;
        data.NetInvestmentDebt = rawData.InvestmentDebt + rawData.SwitchInDebt - rawData.RedemptionDebt - rawData.SwitchOutDebt - rawData.DividendPayoutDebt;
        data.NetInvestmentCommodities = rawData.InvestmentCommodities + rawData.SwitchInCommodities - rawData.RedemptionCommodities - rawData.SwitchOutCommodities - rawData.DividendPayoutCommodities;
        data.NetInvestmentTotal = data.NetInvestmentEquity + data.NetInvestmentDebt + data.NetInvestmentCommodities;

        data.CurrentAmountEquity = rawData.CurrentAmountEquity;
        data.CurrentAmountDebt = rawData.CurrentAmountDebt;
        data.CurrentAmountCommodities = rawData.CurrentAmountCommodities;
        data.CurrentAmountTotal = data.CurrentAmountEquity + data.CurrentAmountDebt + data.CurrentAmountCommodities;

        data.NetGainEquity = data.CurrentAmountEquity - data.NetInvestmentEquity;
        data.NetGainDebt = data.CurrentAmountDebt - data.NetInvestmentDebt;
        data.NetGainCommodities = data.CurrentAmountCommodities - data.NetInvestmentCommodities;
        data.NetGainTotal = data.NetGainEquity + data.NetGainDebt + data.NetGainCommodities;

        data.RealisedGainLossEquity = rawData.RealisedGainLossEquity;
        data.RealisedGainLossDebt = rawData.RealisedGainLossDebt;
        data.RealisedGainLossCommodities = rawData.RealisedGainLossCommodities;
        data.RealisedGainLossTotal = data.RealisedGainLossEquity + data.RealisedGainLossDebt + data.RealisedGainLossCommodities;

        data.UnrealisedGainLossEquity = rawData.UnrealisedGainLossEquity;
        data.UnrealisedGainLossDebt = rawData.UnrealisedGainLossDebt;
        data.UnrealisedGainLossCommodities = rawData.UnrealisedGainLossCommodities;
        data.UnrealisedGainLossTotal = data.UnrealisedGainLossEquity + data.UnrealisedGainLossDebt + data.UnrealisedGainLossCommodities;

        const readXirrRequest = req.app.locals.db.request();
        readXirrRequest.input("UCC", ucc);
        const readXirrResult = await readXirrRequest.execute("GetHoldingPerformanceCashFlowXIRRReportData");
        if (readXirrResult.recordset.length > 0) {
            rawXirrData = readXirrResult.recordset;
        }

        if (rawXirrData.length > 0) {
            var inputData = [];
            for (let j = 0; j < rawXirrData.length; j++) {
                var item = rawXirrData[j];

                inputData.push({ amount: item.PurchaseAmount, date: luxon.DateTime.fromISO(item.TradeDate.toISOString(), { zone: 'Asia/Kolkata' }).toFormat('yyyyMMdd') });
            }

            inputData.push({ amount: (0 - (data.CurrentAmountTotal + data.CashOutFlowTotal)), date: currentDate.toFormat('yyyyMMdd') });

            var xirrData = xirr.xirr(inputData);
            var XIRRTotal = xirr.convertRate(xirrData.rate, xirr.RateInterval.Year);
            data.XIRRTotal = Number((XIRRTotal * 100).toFixed(2));

            var equityRawData = rawXirrData.filter(x => x.BuyType == 'Equity' && x.Portfolio != 'Commodities');

            var inputEquityData = [];
            for (let j = 0; j < equityRawData.length; j++) {
                var item = equityRawData[j];

                inputEquityData.push({ amount: item.PurchaseAmount, date: luxon.DateTime.fromISO(item.TradeDate.toISOString(), { zone: 'Asia/Kolkata' }).toFormat('yyyyMMdd') });
            }

            inputEquityData.push({ amount: (0 - (data.CurrentAmountEquity + data.CashOutFlowEquity)), date: currentDate.toFormat('yyyyMMdd') });

            var xirrEquityData = xirr.xirr(inputEquityData);
            var XIRREquity = xirr.convertRate(xirrEquityData.rate, xirr.RateInterval.Year);
            data.XIRREquity = Number((XIRREquity * 100).toFixed(2));

            var debtRawData = rawXirrData.filter(x => x.BuyType == 'Debt' && x.Portfolio != 'Commodities');

            var inputDebtData = [];
            for (let j = 0; j < debtRawData.length; j++) {
                var item = debtRawData[j];

                inputDebtData.push({ amount: item.PurchaseAmount, date: luxon.DateTime.fromISO(item.TradeDate.toISOString(), { zone: 'Asia/Kolkata' }).toFormat('yyyyMMdd') });
            }

            inputDebtData.push({ amount: (0 - (data.CurrentAmountDebt + data.CashOutFlowDebt)), date: currentDate.toFormat('yyyyMMdd') });

            var xirrDebtData = xirr.xirr(inputDebtData);
            var XIRRDebt = xirr.convertRate(xirrDebtData.rate, xirr.RateInterval.Year);
            data.XIRRDebt = Number((XIRRDebt * 100).toFixed(2));

            var commoditiesRawData = rawXirrData.filter(x => x.Portfolio == 'Commodities');

            var inputCommoditiesData = [];
            for (let j = 0; j < commoditiesRawData.length; j++) {
                var item = commoditiesRawData[j];

                inputCommoditiesData.push({ amount: item.PurchaseAmount, date: luxon.DateTime.fromISO(item.TradeDate.toISOString(), { zone: 'Asia/Kolkata' }).toFormat('yyyyMMdd') });
            }

            inputCommoditiesData.push({ amount: (0 - (data.CurrentAmountCommodities + data.CashOutFlowCommodities)), date: currentDate.toFormat('yyyyMMdd') });

            var xirrCommoditiesData = xirr.xirr(inputCommoditiesData);
            var XIRRCommodities = xirr.convertRate(xirrCommoditiesData.rate, xirr.RateInterval.Year);
            data.XIRRCommodities = Number((XIRRCommodities * 100).toFixed(2));
        }
    }

    return data;
};

async function getHoldingPerformanceSummaryReportData(req, ucc) {
    var data = {
        PurchaseAmount: 0,
        CurrentAmount: 0,
        RedemptionAmount: 0,
        DividendPayoutAmount: 0,
        WithdrawalAmount: 0,
        ProfitLoss: 0
    };

    const readRequest = req.app.locals.db.request();
    readRequest.input("UCC", ucc);
    const readResult = await readRequest.execute("GetHoldingPerformanceSummaryReportData");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    if (data.CurrentAmount > 0) {
        data.ProfitLoss = data.CurrentAmount - data.PurchaseAmount;
        data.WithdrawalAmount = data.RedemptionAmount;
    }
    else {
        data.ProfitLoss = data.RedemptionAmount + data.DividendPayoutAmount - data.PurchaseAmount;
        data.WithdrawalAmount = data.RedemptionAmount + data.DividendPayoutAmount;
    }

    return data;
};

async function getHoldingPerformanceReportData(req, ucc) {
    var data = [];
    var purchaseData = [];
    var currentDate = luxon.DateTime.now().setZone('Asia/Kolkata');

    const readRequest = req.app.locals.db.request();
    readRequest.input("UCC", ucc);
    const readResult = await readRequest.execute("GetHoldingPerformanceReportData");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    purchaseData = await getFeedTransactionPurchaseData(req, ucc);

    for (let i = 0; i < data.length; i++) {
        data[i].XIRR = 0;

        if (data[i].CurrentAmount > 0) {
            data[i].ProfitLoss = data[i].CurrentAmount - data[i].PurchaseAmount;
        }
        else {
            data[i].ProfitLoss = data[i].RedemptionAmount + data[i].DividendPayoutAmount - data[i].PurchaseAmount;
        }

        data[i].ProfitLossPercentage = Number((data[i].ProfitLoss / data[i].PurchaseAmount * 100).toFixed(2));

        var transactionList = purchaseData.filter(x => x.NewFolioNumber == data[i].NewFolioNumber && x.ProductCode == data[i].ProductCode);
        var inputData = [];
        for (let j = 0; j < transactionList.length; j++) {
            var item = transactionList[j];

            inputData.push({ amount: item.PurchaseAmount, date: luxon.DateTime.fromISO(item.TradeDate.toISOString(), { zone: 'Asia/Kolkata' }).toFormat('yyyyMMdd') });
        }

        if (data[i].CurrentAmount > 0) {
            inputData.push({ amount: (0 - data[i].CurrentAmount), date: currentDate.toFormat('yyyyMMdd') });

            var xirrData = xirr.xirr(inputData);
            var XIRR = xirr.convertRate(xirrData.rate, xirr.RateInterval.Year);
            data[i].XIRR = Number((XIRR * 100).toFixed(2));
        }
    }

    return data;
};

async function getFeedTransactionPurchaseData(req, ucc) {
    var data = [];

    const readRequest = req.app.locals.db.request();
    readRequest.input("UCC", ucc);
    const readResult = await readRequest.execute("GetFeedTransactionPurchaseData");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function getFeedTransactionRedemptionData(req, ucc) {
    var data = [];

    const readRequest = req.app.locals.db.request();
    readRequest.input("UCC", ucc);
    const readResult = await readRequest.execute("GetFeedTransactionRedemptionData");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function updateClientCredentialSent(req, appUserId) {
    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        const requestUpdate = transaction.request();
        requestUpdate.input("AppUserId", appUserId);
        const resultUpdate = await requestUpdate.execute("UpdateClientCredentialEmailSent");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }
    }
};

async function createClientDocumentZip(accountData) {
    var kycDocuments = [];
    var accountDocuments = [];

    var currentDate = luxon.DateTime.now().setZone('Asia/Kolkata');

    let pool = await appPool.connect();

    var accountHolders = accountData.AccountHolders;
    for (let i = 0; i < accountHolders.length; i++) {
        var accountHolder = accountHolders[i];

        const readRequest = pool.request();
        readRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(accountHolder.ClientKycProfileId, true));
        const readResult = await readRequest.execute("GetClientKycProfileDocuments");
        if (readResult.recordset.length > 0) {
            var data = readResult.recordset;

            for (let d = 0; d < data.length; d++) {
                kycDocuments.push(data[d]);
            }
        }
    }

    const readRequest = pool.request();
    readRequest.input("ClientAccountId", cryptoEngine.ParamDecrypt(accountData.Id, true));
    const readResult = await readRequest.execute("GetClientAccountDocumentsUploaded");
    if (readResult.recordset.length > 0) {
        var data = readResult.recordset;

        for (let d = 0; d < data.length; d++) {
            accountDocuments.push(data[d]);
        }
    }

    var folderName = accountData.UCC + '-' + currentDate.toFormat('yyyyMMdd') + '-' + commonFunction.GetUniqueId();
    var folderPath = path.join(__dirname.replace("app", "public"), '..', 'documents', 'temp', folderName);
    try {
        if (!fileSystem.existsSync(folderPath)) {
            fileSystem.mkdirSync(folderPath);
        }
    } catch (err) {
        console.error('Error creating folder: ' + folderName, err);
    }

    if (fileSystem.existsSync(folderPath)) {
        for (let d = 0; d < kycDocuments.length; d++) {
            var filePath = path.join(__dirname.replace("app", "public"), '..', 'documents', 'temp', folderName, kycDocuments[d].FileName);
            var fileContent = Buffer.from(kycDocuments[d].FileContent);
            fileSystem.writeFileSync(filePath, fileContent);
        }

        var folderPathUcc = path.join(__dirname.replace("app", "public"), '..', 'documents', 'temp', folderName, accountData.UCC);
        try {
            if (!fileSystem.existsSync(folderPathUcc)) {
                fileSystem.mkdirSync(folderPathUcc);
                // console.log('Folder created successfully!');
            }
        } catch (err) {
            console.error('Error creating folder: ' + folderName, err);
        }

        if (fileSystem.existsSync(folderPathUcc)) {
            for (let d = 0; d < accountDocuments.length; d++) {
                var filePath = path.join(__dirname.replace("app", "public"), '..', 'documents', 'temp', folderName, accountData.UCC, accountDocuments[d].FileName);
                var fileContent = Buffer.from(accountDocuments[d].FileContent);
                fileSystem.writeFileSync(filePath, fileContent);
            }
        }

        var zipFilePath = path.join(__dirname.replace("app", "public"), '..', 'documents', 'downloads', folderName + '.zip');

        await commonFunction.ZipDirectory(folderPath, zipFilePath);

        return { Status: true, FileName: folderName + '.zip', FilePath: zipFilePath };
    }
    else {
        return { Status: false, FileName: '', FilePath: '' };
    }
};