const msSql = require("mssql");
const date = require('date-and-time');
const appPool = require("../models/db.model");
const cryptoEngine = require("../models/cryptoengine.model");
const clientConrtroller = require('../controllers/client.controller');
const commonFuntion = require('../models/commonfunction.model');

exports.GetFeedMismatchedCasesByCaseCode = async (req, res) => {
    const CaseCode = req.params.CaseCode;
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);

    try {
        var dataList;

        const readRequest = req.app.locals.db.request();
        readRequest.input("CaseCode", CaseCode)
            .input("AppUserId", UserId);
        const readResult = await readRequest.execute("GetFeedTransactionUccFolioByCaseCode");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data;
        if (dataList != null) {
            data = dataList.map(item => {
                const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                const FolioLists = (item.FolioLists != '') ? JSON.parse(item.FolioLists) : [];

                return { ...item, Id, FolioLists };
            });
        }
        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetFeedTransactionUccFolioAssociateTag = async (req, res) => {
    try {
        var dataList;

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetFeedTransactionUccFolioAssociateTag");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data;
        if (dataList != null) {
            data = dataList.map(item => {
                const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                const FolioLists = (item.FolioLists != '') ? JSON.parse(item.FolioLists) : [];

                return { ...item, Id, FolioLists };
            });
        }
        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.UpdateFeedTransactionUccFolioSubBrokerCode = async (req, res) => {
    var { Id, AssociateCode } = req.body;

    var errorMessage = "Error while tagging associate...";

    var FeedTransactionUccFolioList = [];

    try {
        var dataItem = await getFeedTransactionUccFolioById(Id);

        if (dataItem != null) {
            var folioList = JSON.parse(dataItem.FolioLists);

            for (let i = 0; i < folioList.length; i++) {
                const readFolioRequest = req.app.locals.db.request();
                readFolioRequest.input("FolioNumber", folioList[i].FolioNumber)
                    .input("FundDescription", folioList[i].FundDescription);
                const readFolioResult = await readFolioRequest.execute("GetFeedTransactionUccFolioByFolioList");
                if (readFolioResult.recordset.length > 0) {
                    let dataList = readFolioResult.recordset;

                    for (let j = 0; j < dataList.length; j++) {
                        FeedTransactionUccFolioList.push({ Id: cryptoEngine.ParamEncrypt(dataList[j].Id, true) });
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
    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        for (let i = 0; i < FeedTransactionUccFolioList.length; i++) {
            const request = transaction.request();
            request.input("Id", cryptoEngine.ParamDecrypt(FeedTransactionUccFolioList[i].Id, true))
                .input("SubBrokerCode", AssociateCode);
            const result = await request.execute("UpdateFeedTransactionUccFolioSubBrokerCode");
        }

        await transaction.commit();

        res.status(200).send({ Status: true, Message: "Associate tagged successfully.", Data: null });
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

exports.GetFeedTransactionUccFolioFamilyTag = async (req, res) => {
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    try {
        var dataList;

        const readRequest = req.app.locals.db.request();
        readRequest.input("AppUserId", UserId);
        const readResult = await readRequest.execute("GetFeedTransactionUccFolioFamilyTag");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data;
        if (dataList != null) {
            data = dataList.map(item => {
                const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                const FolioLists = (item.FolioLists != '') ? JSON.parse(item.FolioLists) : [];
                const FamilyList = [];
                const SelectedFamily = null;
                const FamilyMemberList = [];
                const SelectedFamilyMember = null;

                return { ...item, Id, FolioLists, FamilyList, SelectedFamily, FamilyMemberList, SelectedFamilyMember };
            });
        }

        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetNewFamilyList = async (req, res) => {
    const FeedId = req.params.FeedId;
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    var UserRole = 'SA';
    var AssociateId = cryptoEngine.ParamEncrypt('0', true);

    try {
        const readAssociateRequest = req.app.locals.db.request();
        readAssociateRequest.input("AppUserId", UserId);
        const associateResult = await readAssociateRequest.execute("GetAppUserAssociate");
        if (associateResult.recordset.length > 0) {
            let associateData = associateResult.recordset[0];
            AssociateId = cryptoEngine.ParamEncrypt(associateData.AssociateId, true);
            UserRole = 'Associate';
        }

        var feedData = await getFeedTransactionUccFolioById(FeedId);

        var data;

        if (feedData != null) {
            data = await getFamilyList(UserRole, AssociateId, feedData);
        }

        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetFeedTransactionUccFolioFamilyMemberList = async (req, res) => {
    const FeedId = req.params.FeedId;
    const ClientId = req.params.ClientId;

    try {
        var data;

        if (cryptoEngine.ParamDecrypt(ClientId, true) == 0) {
            var feedItem = await getFeedTransactionUccFolioById(FeedId);
            if (feedItem != null) {
                var dataList = [];
                if (feedItem.TaxStatus.toLowerCase() == 'minor') {
                    if (feedItem.GuardianPan != '') {
                        dataList.push({ MemberName: feedItem.GuardianName });
                    }
                }
                else {
                    if (feedItem.FirstHolderPan != '') {
                        dataList.push({ MemberName: feedItem.FirstHolderName });
                    }
                    if (feedItem.SecondHolderPan != '') {
                        dataList.push({ MemberName: feedItem.SecondHolderName });
                    }
                    if (feedItem.ThirdHolderPan != '') {
                        dataList.push({ MemberName: feedItem.ThirdHolderName });
                    }
                }

                data = dataList;
            }
        }
        else {
            var dataList = [];
            const readRequest = req.app.locals.db.request();
            readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
            const readResult = await readRequest.execute("GetClientPrimaryFamilyMember");
            if (readResult.recordset.length > 0) {
                var clientItem = readResult.recordset[0];
                dataList.push({ MemberName: clientItem.Name });
                data = dataList;
            }
        }
        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.UpdateFeedTransactionUccFolioFamilyTag = async (req, res) => {
    var { FeedId, ClientId, PrimaryFamilyMember } = req.body;
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);

    var errorMessage = "Error while tagging family...";

    try {
        var feedData;
        var taxStatusData;
        var leadId;

        feedData = await getFeedTransactionUccFolioById(FeedId);

        if (feedData != null) {
            taxStatusData = await getTaxStatusDataByName(feedData.TaxStatus);
        }

        if (taxStatusData == null) {
            errorMessage = 'Invalid tax status. Cannot proceed to tag family.';
            res.status(500).send(errorMessage);
            return;
        }

        if (cryptoEngine.ParamDecrypt(ClientId, true) == 0) {
            //create new client
            let associateData = await getAssociateByCode(feedData.SubBrokerCode);

            if (associateData != null) {
                var genderId = await getGender('Other');
                var locationData = await getState(feedData.State);
                if (locationData == null) {
                    locationData = await getState('Maharashtra');
                }

                leadId = await saveLead(date.format(new Date(), 'YYYY-MM-DD'), associateData.Id, feedData.KarvyFName, feedData.KarvyLName, genderId, feedData.Mobile, feedData.Email, locationData.CountryId, feedData.Address1, feedData.Address2, feedData.Address3, feedData.City, locationData.Id, feedData.PinCode);

                let familyName = PrimaryFamilyMember + ' & Family';

                ClientId = await saveClient(leadId, associateData.Id, (taxStatusData.Type == 'Individual'), (taxStatusData.Type != 'Individual'), familyName, UserId);
            }
        }
        else {
            var clientData = await getClientById(cryptoEngine.ParamDecrypt(ClientId, true));

            leadId = clientData.LeadId;
        }

        //create account in existing client
        var FirstHolderKycProfileId = 0;
        var SecondHolderKycProfileId = 0;
        var ThirdHolderKycProfileId = 0;
        var GuardianKycProfileId = 0;
        var Nominee1FamilyId = 0;
        var Nominee2FamilyId = 0;
        var Nominee3FamilyId = 0;
        var DefaultBankId = 0;

        var taxStatusId = await getTaxStatusByName(feedData.TaxStatus);

        // console.log('feedData.TaxStatus: ' + feedData.TaxStatus);

        if (feedData.TaxStatus.toLowerCase() == 'on behalf of minor' || feedData.TaxStatus.toLowerCase() == 'nri child' || feedData.TaxStatus.toLowerCase() == 'nri - minor') {
            let guardianId = 0;
            if (feedData.GuardianPan != '') {
                let profileData = await getClientKycProfileGuardianByClientPan(feedData.GuardianPan, ClientId);
                if (profileData != null) {
                    GuardianKycProfileId = profileData.Id;

                    let guardianData = await getClientKcyProfileFamilyByProfileId(GuardianKycProfileId);
                    if (guardianData != null) {
                        guardianId = guardianData.ClientFamilyId;
                    }
                }
                else {
                    let guardianTaxStatusId = await getTaxStatusByName('Individual');
                    let familyData;

                    familyData = await getClientFamilyByPan(feedData.GuardianPan, ClientId);

                    if (familyData == null) {
                        familyData = await getClientFamilyByName(feedData.GuardianName, ClientId);
                    }

                    if (familyData != null) {
                        guardianId = familyData.Id;
                    }
                    else {
                        var relationId = await getRelation((feedData.FirstHolderName == PrimaryFamilyMember) ? 'Self' : 'Other');
                        var taxSlabId = await getTaxSlab('0');

                        guardianId = await saveClientFamily(cryptoEngine.ParamDecrypt(ClientId, true), feedData.GuardianName, null, relationId, guardianTaxStatusId, taxSlabId);
                    }

                    await saveClientKycFamily(cryptoEngine.ParamDecrypt(ClientId, true), guardianId);

                    var kycStatusId = await getKYCStatus('Not Available');
                    var occupationId = await getOccupation('Others');
                    var grossAnnualIncomeId = await getGrossAnnualIncome('None');
                    var wealthSourceId = await getWealthSource('Others');
                    var genderId = await getGender('Other');
                    var mobileSelfDeclarationId = await getSelfDeclaration('SE');
                    var emailSelfDeclarationId = await getSelfDeclaration('SE');

                    GuardianKycProfileId = await saveClientKycProfile(cryptoEngine.ParamDecrypt(ClientId, true), guardianId, 0, 0, feedData.FirstHolderPan, feedData.FirstHolderCkycNo, feedData.FirstHolderAadharNo, '', feedData.Mobile, feedData.Email, '', '', '', 0, date.format(new Date(), 'YYYY-MM-DD'), '', '', '', kycStatusId, occupationId, grossAnnualIncomeId, wealthSourceId, false, guardianTaxStatusId, genderId, mobileSelfDeclarationId, emailSelfDeclarationId, 0);
                }
            }

            // console.log('guardianId: ' + guardianId);

            //create minor profile
            let familyId = 0;
            let familyData = await getClientFamilyByName(feedData.FirstHolderName, ClientId);

            if (familyData != null) {
                familyId = familyData.Id;
            }
            else {
                var relationId = await getRelation((feedData.FirstHolderName == PrimaryFamilyMember) ? 'Self' : 'Other');
                var taxSlabId = await getTaxSlab('0');

                familyId = await saveClientFamily(cryptoEngine.ParamDecrypt(ClientId, true), feedData.FirstHolderName, feedData.DateOfBirth, relationId, taxStatusId, taxSlabId);
            }
            // console.log('minor familyId: ' + familyId);

            await saveClientKycFamily(cryptoEngine.ParamDecrypt(ClientId, true), familyId);

            let familyData1 = await getClientKcyProfileFamilyByFamilyId(familyId);
            if (familyData1 != null) {
                FirstHolderKycProfileId = familyData1.ClientKycProfileId;

                var guardianRelationId = await getRelation('Court Appointed Legal Guardian');

                if (FirstHolderKycProfileId == 0) {
                    var kycStatusId = await getKYCStatus('Not Available');
                    var occupationId = await getOccupation('Others');
                    var grossAnnualIncomeId = await getGrossAnnualIncome('None');
                    var wealthSourceId = await getWealthSource('Others');
                    var genderId = await getGender('Other');
                    var mobileSelfDeclarationId = await getSelfDeclaration('SE');
                    var emailSelfDeclarationId = await getSelfDeclaration('SE');

                    FirstHolderKycProfileId = await saveClientKycProfile(cryptoEngine.ParamDecrypt(ClientId, true), familyId, 0, guardianId, feedData.FirstHolderPan, feedData.FirstHolderCkycNo, feedData.FirstHolderAadharNo, '', feedData.Mobile, feedData.Email, '', '', '', 0, date.format(new Date(), 'YYYY-MM-DD'), '', '', '', kycStatusId, occupationId, grossAnnualIncomeId, wealthSourceId, false, taxStatusId, genderId, mobileSelfDeclarationId, emailSelfDeclarationId, guardianRelationId);
                }

                await saveClientKycProfileGuardian(FirstHolderKycProfileId, guardianId, guardianRelationId);
            }
        }
        else {
            if (feedData.FirstHolderPan != '') {
                let profileData = await getClientKycProfileByClientPan(feedData.FirstHolderPan, ClientId);
                if (profileData != null) {
                    FirstHolderKycProfileId = profileData.Id;
                }
                else {
                    if (taxStatusData.Type == 'Individual') {
                        let familyId = 0;
                        let familyData;

                        familyData = await getClientFamilyByPan(feedData.FirstHolderPan, ClientId);

                        if (familyData == null) {
                            familyData = await getClientFamilyByName(feedData.FirstHolderName, ClientId);
                        }

                        if (familyData != null) {
                            familyId = familyData.Id;
                        }
                        else {
                            var relationId = await getRelation((feedData.FirstHolderName == PrimaryFamilyMember) ? 'Self' : 'Other');
                            var taxSlabId = await getTaxSlab('0');

                            familyId = await saveClientFamily(cryptoEngine.ParamDecrypt(ClientId, true), feedData.FirstHolderName, feedData.DateOfBirth, relationId, taxStatusId, taxSlabId);
                        }

                        await saveClientKycFamily(cryptoEngine.ParamDecrypt(ClientId, true), familyId);

                        var kycStatusId = await getKYCStatus('Not Available');
                        var occupationId = await getOccupation('Others');
                        var grossAnnualIncomeId = await getGrossAnnualIncome('None');
                        var wealthSourceId = await getWealthSource('Others');
                        var genderId = await getGender('Other');
                        var mobileSelfDeclarationId = await getSelfDeclaration('SE');
                        var emailSelfDeclarationId = await getSelfDeclaration('SE');

                        FirstHolderKycProfileId = await saveClientKycProfile(cryptoEngine.ParamDecrypt(ClientId, true), familyId, 0, 0, feedData.FirstHolderPan, feedData.FirstHolderCkycNo, feedData.FirstHolderAadharNo, '', feedData.Mobile, feedData.Email, '', '', '', 0, date.format(new Date(), 'YYYY-MM-DD'), '', '', '', kycStatusId, occupationId, grossAnnualIncomeId, wealthSourceId, false, taxStatusId, genderId, mobileSelfDeclarationId, emailSelfDeclarationId, 0);
                    }
                    else {
                        let companyId = 0;
                        let companyData = await getClientCompanyByName(feedData.FirstHolderName, ClientId);

                        if (companyData != null) {
                            companyId = companyData.Id;
                        }
                        else {
                            var taxSlabId = await getTaxSlab('0');

                            companyId = await saveClientCompany(cryptoEngine.ParamDecrypt(ClientId, true), feedData.FirstHolderName, feedData.DateOfBirth, taxStatusId, taxSlabId);
                        }

                        await saveClientKycCompany(cryptoEngine.ParamDecrypt(ClientId, true), companyId);

                        var kycStatusId = await getKYCStatus('Not Available');
                        var occupationId = await getOccupation('Others');
                        var grossAnnualIncomeId = await getGrossAnnualIncome('None');
                        var wealthSourceId = await getWealthSource('Others');
                        var genderId = await getGender('Other');
                        var mobileSelfDeclarationId = await getSelfDeclaration('SE');
                        var emailSelfDeclarationId = await getSelfDeclaration('SE');

                        FirstHolderKycProfileId = await saveClientKycProfile(cryptoEngine.ParamDecrypt(ClientId, true), 0, companyId, 0, feedData.FirstHolderPan, feedData.FirstHolderCkycNo, feedData.FirstHolderAadharNo, '', feedData.Mobile, feedData.Email, '', '', '', 0, date.format(new Date(), 'YYYY-MM-DD'), '', '', '', kycStatusId, occupationId, grossAnnualIncomeId, wealthSourceId, false, taxStatusId, genderId, mobileSelfDeclarationId, emailSelfDeclarationId, 0);
                    }
                }
            }

            if (feedData.SecondHolderPan != '') {
                let profileData = await getClientKycProfileByClientPan(feedData.SecondHolderPan, ClientId);
                if (profileData != null) {
                    SecondHolderKycProfileId = profileData.Id;
                }
                else {
                    if (taxStatusData.Type == 'Individual') {
                        let familyId = 0;
                        let familyData;

                        familyData = await getClientFamilyByPan(feedData.SecondHolderPan, ClientId);

                        if (familyData == null) {
                            familyData = await getClientFamilyByName(feedData.SecondHolderName, ClientId);
                        }

                        if (familyData != null) {
                            familyId = familyData.Id;
                        }
                        else {
                            var relationId = await getRelation((feedData.SecondHolderName == PrimaryFamilyMember) ? 'Self' : 'Other');
                            var taxSlabId = await getTaxSlab('0');

                            familyId = await saveClientFamily(cryptoEngine.ParamDecrypt(ClientId, true), feedData.SecondHolderName, feedData.DateOfBirth, relationId, taxStatusId, taxSlabId);
                        }

                        await saveClientKycFamily(cryptoEngine.ParamDecrypt(ClientId, true), familyId);

                        var kycStatusId = await getKYCStatus('Not Available');
                        var occupationId = await getOccupation('Others');
                        var grossAnnualIncomeId = await getGrossAnnualIncome('None');
                        var wealthSourceId = await getWealthSource('Others');
                        var genderId = await getGender('Other');
                        var mobileSelfDeclarationId = await getSelfDeclaration('SE');
                        var emailSelfDeclarationId = await getSelfDeclaration('SE');

                        SecondHolderKycProfileId = await saveClientKycProfile(cryptoEngine.ParamDecrypt(ClientId, true), familyId, 0, 0, feedData.SecondHolderPan, feedData.SecondHolderCkycNo, feedData.SecondHolderAadharNo, '', feedData.Mobile, feedData.Email, '', '', '', 0, date.format(new Date(), 'YYYY-MM-DD'), '', '', '', kycStatusId, occupationId, grossAnnualIncomeId, wealthSourceId, false, taxStatusId, genderId, mobileSelfDeclarationId, emailSelfDeclarationId, 0);
                    }
                    else {
                        let companyId = 0;
                        let companyData = await getClientCompanyByName(feedData.SecondHolderName, ClientId);

                        if (companyData != null) {
                            companyId = companyData.Id;
                        }
                        else {
                            var taxSlabId = await getTaxSlab('0');

                            companyId = await saveClientCompany(cryptoEngine.ParamDecrypt(ClientId, true), feedData.SecondHolderName, feedData.DateOfBirth, taxStatusId, taxSlabId);
                        }

                        await saveClientKycCompany(cryptoEngine.ParamDecrypt(ClientId, true), companyId);

                        var kycStatusId = await getKYCStatus('Not Available');
                        var occupationId = await getOccupation('Others');
                        var grossAnnualIncomeId = await getGrossAnnualIncome('None');
                        var wealthSourceId = await getWealthSource('Others');
                        var genderId = await getGender('Other');
                        var mobileSelfDeclarationId = await getSelfDeclaration('SE');
                        var emailSelfDeclarationId = await getSelfDeclaration('SE');

                        SecondHolderKycProfileId = await saveClientKycProfile(cryptoEngine.ParamDecrypt(ClientId, true), 0, companyId, 0, feedData.SecondHolderPan, feedData.SecondHolderCkycNo, feedData.SecondHolderAadharNo, '', feedData.Mobile, feedData.Email, '', '', '', 0, date.format(new Date(), 'YYYY-MM-DD'), '', '', '', kycStatusId, occupationId, grossAnnualIncomeId, wealthSourceId, false, taxStatusId, genderId, mobileSelfDeclarationId, emailSelfDeclarationId, 0);
                    }
                }
            }

            if (feedData.ThirdHolderPan != '') {
                let profileData = await getClientKycProfileByClientPan(feedData.ThirdHolderPan, ClientId);
                if (profileData != null) {
                    ThirdHolderKycProfileId = profileData.Id;
                }
                else {
                    if (taxStatusData.Type == 'Individual') {
                        let familyId = 0;
                        let familyData;

                        familyData = await getClientFamilyByPan(feedData.ThirdHolderPan, ClientId);

                        if (familyData == null) {
                            familyData = await getClientFamilyByName(feedData.ThirdHolderName, ClientId);
                        }

                        if (familyData != null) {
                            familyId = familyData.Id;
                        }
                        else {
                            var relationId = await getRelation((feedData.ThirdHolderName == PrimaryFamilyMember) ? 'Self' : 'Other');
                            var taxSlabId = await getTaxSlab('0');

                            familyId = await saveClientFamily(cryptoEngine.ParamDecrypt(ClientId, true), feedData.ThirdHolderName, feedData.DateOfBirth, relationId, taxStatusId, taxSlabId);
                        }

                        await saveClientKycFamily(cryptoEngine.ParamDecrypt(ClientId, true), familyId);

                        var kycStatusId = await getKYCStatus('Not Available');
                        var occupationId = await getOccupation('Others');
                        var grossAnnualIncomeId = await getGrossAnnualIncome('None');
                        var wealthSourceId = await getWealthSource('Others');
                        var genderId = await getGender('Other');
                        var mobileSelfDeclarationId = await getSelfDeclaration('SE');
                        var emailSelfDeclarationId = await getSelfDeclaration('SE');

                        ThirdHolderKycProfileId = await saveClientKycProfile(cryptoEngine.ParamDecrypt(ClientId, true), familyId, 0, 0, feedData.ThirdHolderPan, feedData.ThirdHolderCkycNo, feedData.ThirdHolderAadharNo, '', feedData.Mobile, feedData.Email, '', '', '', 0, date.format(new Date(), 'YYYY-MM-DD'), '', '', '', kycStatusId, occupationId, grossAnnualIncomeId, wealthSourceId, false, taxStatusId, genderId, mobileSelfDeclarationId, emailSelfDeclarationId, 0);
                    }
                    else {
                        let companyId = 0;
                        let companyData = await getClientCompanyByName(feedData.ThirdHolderName, ClientId);

                        if (companyData != null) {
                            companyId = companyData.Id;
                        }
                        else {
                            var taxSlabId = await getTaxSlab('0');

                            companyId = await saveClientCompany(cryptoEngine.ParamDecrypt(ClientId, true), feedData.ThirdHolderName, feedData.DateOfBirth, taxStatusId, taxSlabId);
                        }

                        await saveClientKycCompany(cryptoEngine.ParamDecrypt(ClientId, true), companyId);

                        var kycStatusId = await getKYCStatus('Not Available');
                        var occupationId = await getOccupation('Others');
                        var grossAnnualIncomeId = await getGrossAnnualIncome('None');
                        var wealthSourceId = await getWealthSource('Others');
                        var genderId = await getGender('Other');
                        var mobileSelfDeclarationId = await getSelfDeclaration('SE');
                        var emailSelfDeclarationId = await getSelfDeclaration('SE');

                        ThirdHolderKycProfileId = await saveClientKycProfile(cryptoEngine.ParamDecrypt(ClientId, true), 0, companyId, 0, feedData.ThirdHolderPan, feedData.ThirdHolderCkycNo, feedData.ThirdHolderAadharNo, '', feedData.Mobile, feedData.Email, '', '', '', 0, date.format(new Date(), 'YYYY-MM-DD'), '', '', '', kycStatusId, occupationId, grossAnnualIncomeId, wealthSourceId, false, taxStatusId, genderId, mobileSelfDeclarationId, emailSelfDeclarationId, 0);
                    }
                }
            }
        }

        if (feedData.NomineeName != '') {
            let familyData = await getClientFamilyByName(feedData.NomineeName, ClientId);

            if (familyData != null) {
                Nominee1FamilyId = familyData.Id;
            }
            else {
                var relationId = await getRelation((feedData.FirstHolderName == PrimaryFamilyMember) ? 'Self' : 'Other');
                let nomineeTaxStatusId = await getTaxStatusByName('Individual');
                var taxSlabId = await getTaxSlab('0');

                Nominee1FamilyId = await saveClientFamily(cryptoEngine.ParamDecrypt(ClientId, true), feedData.NomineeName, null, relationId, nomineeTaxStatusId, taxSlabId);
            }
        }

        if (feedData.Nominee2Name != '') {
            let familyData = await getClientFamilyByName(feedData.Nominee2Name, ClientId);

            if (familyData != null) {
                Nominee2FamilyId = familyData.Id;
            }
            else {
                var relationId = await getRelation((feedData.FirstHolderName == PrimaryFamilyMember) ? 'Self' : 'Other');
                let nomineeTaxStatusId = await getTaxStatusByName('Individual');
                var taxSlabId = await getTaxSlab('0');

                Nominee2FamilyId = await saveClientFamily(cryptoEngine.ParamDecrypt(ClientId, true), feedData.Nominee2Name, null, relationId, nomineeTaxStatusId, taxSlabId);
            }
        }

        if (feedData.Nominee3Name != '') {
            let familyData = await getClientFamilyByName(feedData.Nominee3Name, ClientId);

            if (familyData != null) {
                Nominee3FamilyId = familyData.Id;
            }
            else {
                var relationId = await getRelation((feedData.FirstHolderName == PrimaryFamilyMember) ? 'Self' : 'Other');
                let nomineeTaxStatusId = await getTaxStatusByName('Individual');
                var taxSlabId = await getTaxSlab('0');

                Nominee3FamilyId = await saveClientFamily(cryptoEngine.ParamDecrypt(ClientId, true), feedData.Nominee3Name, null, relationId, nomineeTaxStatusId, taxSlabId);
            }
        }

        if (FirstHolderKycProfileId != 0) {
            var existingAddress = await getClientKycAddress(FirstHolderKycProfileId);
            if (existingAddress == null) {
                var addressTypeId = await getAddressType('Residential');
                var locationData = await getState(feedData.State);
                if (locationData == null) {
                    locationData = await getState('Maharashtra');
                }

                if (locationData != null) {
                    await saveClientKycLocalAddress(FirstHolderKycProfileId, addressTypeId, feedData.Address1, feedData.Address2, feedData.Address3, feedData.City, locationData.CountryId, locationData.Id, feedData.PinCode);
                }
            }

            var bankAccountTypeId = await getBankAccountType(feedData.AccountType);
            var existingBank = await getClientKycBank(FirstHolderKycProfileId, bankAccountTypeId, feedData.AccountNo);
            if (existingBank == null) {
                DefaultBankId = await saveClientKycBank(FirstHolderKycProfileId, feedData.BankIFSCCode, feedData.BankName, feedData.BankBranch, '', bankAccountTypeId, feedData.AccountNo, '', commonFuntion.GetUniqueId());
            }
            else {
                DefaultBankId = existingBank.Id;
            }

            var existingAccount = await getClientAccountHoldingPattern(cryptoEngine.ParamDecrypt(ClientId, true), FirstHolderKycProfileId, SecondHolderKycProfileId, ThirdHolderKycProfileId, Nominee1FamilyId, Nominee2FamilyId, Nominee3FamilyId);
            if (existingAccount != null) {
                let feedFolios = JSON.parse(feedData.FolioLists);
                for (let f = 0; f < feedFolios.length; f++) {
                    let uccFeeds = await getFeedTransactionUccFolioByNumberFund(feedFolios[f].FolioNumber, feedFolios[f].FundDescription);
                    for (let k = 0; k < uccFeeds.length; k++) {
                        await saveFeedUcc(uccFeeds[k].Id, existingAccount.UCC);
                    }
                }
            }
            else {
                let accountTypeId = await getAccountTypeByName(feedData.HoldingNature);
                var relationId = await getRelation('Other');
                var firstNomineeRelationId = await getRelation(feedData.NomineeRelation);
                firstNomineeRelationId = (firstNomineeRelationId == 0) ? relationId : firstNomineeRelationId;
                var secondNomineeRelationId = await getRelation(feedData.Nominee2Relation);
                secondNomineeRelationId = (secondNomineeRelationId == 0) ? relationId : secondNomineeRelationId;
                var thridNomineeRelationId = await getRelation(feedData.Nominee3Relation);
                thridNomineeRelationId = (thridNomineeRelationId == 0) ? relationId : thridNomineeRelationId;

                let clientAccountId = await saveClientAccount(cryptoEngine.ParamDecrypt(ClientId, true), accountTypeId, (Nominee1FamilyId != 0), true, false, false,
                    FirstHolderKycProfileId, SecondHolderKycProfileId, ThirdHolderKycProfileId,
                    Nominee1FamilyId, firstNomineeRelationId, feedData.NomineePercentage,
                    Nominee2FamilyId, secondNomineeRelationId, feedData.Nominee2Percentage,
                    Nominee3FamilyId, thridNomineeRelationId, feedData.Nominee3Percentage, DefaultBankId);

                let clientAccount = await getClientAccount(clientAccountId);
                if (clientAccount != null) {
                    let feedFolios = JSON.parse(feedData.FolioLists);
                    for (let f = 0; f < feedFolios.length; f++) {
                        let uccFeeds = await getFeedTransactionUccFolioByNumberFund(feedFolios[f].FolioNumber, feedFolios[f].FundDescription);
                        for (let k = 0; k < uccFeeds.length; k++) {
                            await saveFeedUcc(uccFeeds[k].Id, clientAccount.UCC);
                        }
                    }
                }
            }
        }

        // console.log({ ClientId: ClientId, LeadId: cryptoEngine.ParamEncrypt(leadId, true) });

        res.status(200).send({ Status: true, Message: "Family tagged successfully.", Data: { ClientId: ClientId, LeadId: cryptoEngine.ParamEncrypt(leadId, true) } });
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
};

exports.GetFeedTransactionUccFolioTransfer = async (req, res) => {
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);
    var UserRole = 'SA';
    var AssociateId = cryptoEngine.ParamEncrypt('0', true);
    try {
        var dataList;

        const readAssociateRequest = req.app.locals.db.request();
        readAssociateRequest.input("AppUserId", UserId);
        const associateResult = await readAssociateRequest.execute("GetAppUserAssociate");
        if (associateResult.recordset.length > 0) {
            let associateData = associateResult.recordset[0];
            AssociateId = cryptoEngine.ParamEncrypt(associateData.AssociateId, true);
            UserRole = 'Associate';
            //   UserFirstName = (associateData.EntityName == '') ? associateData.Name : associateData.EntityName;
            //   IsPrimaryAssociate = associateData.IsPrimaryAssociate;
        }

        const readRequest = req.app.locals.db.request();
        readRequest.input("AppUserId", UserId);
        const readResult = await readRequest.execute("GetFeedTransactionUccFolioTransfer");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data;
        if (dataList != null) {
            data = dataList.map(item => {
                const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                const FolioLists = (item.FolioLists != '') ? JSON.parse(item.FolioLists) : [];

                return { ...item, Id, FolioLists };
            });
        }

        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetFeedTransactionUccFolio = async (req, res) => {
    const Id = req.params.Id;

    try {
        var data = await getFeedTransactionUccFolioById(Id);

        if (data != null) {
            data.Id = cryptoEngine.ParamEncrypt(data.Id, true);
            data.FolioLists = JSON.parse(data.FolioLists);
        }

        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientAccountTransfer = async (req, res) => {
    const Id = req.params.Id;

    try {
        var data;
        var feedData = await getFeedTransactionUccFolioById(Id);

        if (feedData != null) {
            feedData.Id = cryptoEngine.ParamEncrypt(feedData.Id, true);
            feedData.FolioLists = JSON.parse(feedData.FolioLists);

            var accountList = [];
            var associates = [];
            var associateList = [];
            var accounts = [];

            if (feedData.TaxStatus.toLowerCase() == 'on behalf of minor' || feedData.TaxStatus.toLowerCase() == 'nri child' || feedData.TaxStatus.toLowerCase() == 'nri - minor' || feedData.TaxStatus.toLowerCase() == 'nri minor' || feedData.TaxStatus.toLowerCase() == 'non-resident minor') {
                //case: minor to major 
                accountList = await getClientAccountMinorToMajorTransfer(feedData.FirstHolderName, feedData.DateOfBirth, feedData.Ucc);
            }
            else {
                //case: major to major 
                if (feedData.FirstHolderPan != '') {
                    var accountDataList = await getClientAccountMajorToMajorTransfer(feedData.FirstHolderPan, feedData.SecondHolderPan, feedData.ThirdHolderPan, feedData.Ucc);
                    accountList.push(...accountDataList);
                }
                if (feedData.SecondHolderPan != '') {
                    var accountDataList = await getClientAccountMajorToMajorTransfer(feedData.SecondHolderPan, feedData.ThirdHolderPan, '', feedData.Ucc);
                    accountList.push(...accountDataList);
                }

                accountList = [...new Set(accountList)];
            }

            for (let i = 0; i < accountList.length; i++) {
                var account = await clientConrtroller.GetClientAccountInfo(req, res, cryptoEngine.ParamEncrypt(accountList[i].Id, true));

                accounts.push(account);
                associateList.push({ AssociateId: account.AssociateId, AssociateCode: account.AssociateCode, EntityTypeName: account.EntityTypeName, AssociateName: account.AssociateName, BSEMemberId: account.BSEMemberId });
            }

            associates = [...new Set(associateList)];

            data = { Associates: associates, Accounts: accounts };
        }

        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.SaveClientFolioTransfer = async (req, res) => {
    var { FeedId, AssociateId, ClientAccountId, TransferredFolios } = req.body;

    let TransferredFolioList = JSON.parse(TransferredFolios);

    var errorMessage = "Error while transferring folio...";

    var feedData = await getFeedTransactionUccFolioById(FeedId);
    var clientAccountData = await clientConrtroller.GetClientAccountInfo(req, res, ClientAccountId);

    var newFolioList = [];
    var oldFolioList = JSON.parse(feedData.FolioLists);

    newFolioList = TransferredFolioList.map(item => {
        const FolioNumber = item.FolioNumber;
        const FundDescription = item.FundDescription;
        return { FolioNumber, FundDescription };
    });

    for (let i = 0; i < newFolioList.length; i++) {
        oldFolioList = oldFolioList.filter(x => x.FolioNumber != newFolioList[i].FolioNumber && x.FundDescription != newFolioList[i].FundDescription);
    }

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        for (let i = 0; i < TransferredFolioList.length; i++) {
            const request = transaction.request();
            request.input("ClientAccountId", cryptoEngine.ParamDecrypt(ClientAccountId, true))
                .input("FolioNumber", TransferredFolioList[i].FolioNumber);
            const result = await request.execute("UpdateClientTransactionUnitLedgerFolioTransfer");

            const requestFeed = transaction.request();
            requestFeed.input("NewUCC", clientAccountData.UCC)
                .input("OldUcc", feedData.Ucc)
                .input("SubBrokerCode", clientAccountData.BSEMemberId + '' + clientAccountData.AssociateCode)
                .input("FolioNumber", TransferredFolioList[i].FolioNumber)
                .input("FundDescription", TransferredFolioList[i].FundDescription);
            const resultFeed = await requestFeed.execute("UpdateFeedTransactionUccFolioFolioTransfer");
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
        res.status(500).send(errorMessage);
        return;
    }

    try {
        await transaction.begin();

        const requestFeedNew = transaction.request();
        requestFeedNew.input("Ucc", clientAccountData.UCC)
            .input("FolioLists", JSON.stringify(newFolioList));
        const resultFeedNew = await requestFeedNew.execute("UpdateFeedTransactionUccFolioLists");

        const requestFeedOld = transaction.request();
        requestFeedOld.input("Ucc", feedData.Ucc)
            .input("FolioLists", JSON.stringify(oldFolioList));
        const resultFeedOld = await requestFeedOld.execute("UpdateFeedTransactionUccFolioLists");

        await transaction.commit();

        res.status(200).send({ Status: true, Message: "Folio transferred successfully.", Data: null });
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
};

exports.GetFeedTransactionMismatchUnits = async (req, res) => {
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetFeedTransactionMismatchUnits");
        if (readResult.recordset.length > 0) {
            var data = readResult.recordset;

            dataList = data.map(x => {
                const IsBusy = false;

                return { ...x, IsBusy };
            });
        }

        var multiBrokerData = [];
        var mismatchUnitsData = [];

        multiBrokerData = dataList.filter(x => x.IsMultiBroker == true);
        mismatchUnitsData = dataList.filter(x => x.IsMultiBroker == false);

        res.status(200).send({ Status: (dataList != null), Message: "", Data: { MultiBrokerData: multiBrokerData, MismatchUnitsData: mismatchUnitsData } });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.SaveFeedTransactionMultiBroker = async (req, res) => {
    var { NewFolioNumber, ProductCode } = req.body;

    var errorMessage = "Error while marking multi broker...";

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        const requestFeedNew = transaction.request();
        requestFeedNew.input("NewFolioNumber", NewFolioNumber)
            .input("ProductCode", ProductCode);
        const resultFeedNew = await requestFeedNew.execute("UpdateFeedTransactionUccFolioMultiBroker");

        await transaction.commit();

        res.status(200).send({ Status: true, Message: "Folio marked as multi broker successfully.", Data: null });
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
};

async function getFeedTransactionUccFolioById(id) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("Id", cryptoEngine.ParamDecrypt(id, true));
    const readResult = await readRequest.execute("GetFeedTransactionUccFolioById");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function getFeedTransactionUccFolioByNumberFund(folioNumber, fundDescription) {
    var data = [];

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("FolioNumber", folioNumber)
        .input("FundDescription", fundDescription);
    const readResult = await readRequest.execute("GetFeedTransactionUccFolioByNumberFund");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function getAssociateByCode(associateCode) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("AssociateCode", associateCode);
    const readResult = await readRequest.execute("GetAssociateByCode");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function getFamilyList(userRole, associateId, record) {
    var familyList = [];

    if (userRole == 'SA' || userRole == 'Associate') {
        if (record.TaxStatus == 'Individual' || record.TaxStatus == 'NRI Child' || record.TaxStatus == 'NRI' || record.TaxStatus == 'On behalf of minor') {
            let allPan = [];

            if (record.FirstHolderPan != '') { allPan.push(record.FirstHolderPan) };
            if (record.SecondHolderPan != '') { allPan.push(record.SecondHolderPan) };
            if (record.ThirdHolderPan != '') { allPan.push(record.ThirdHolderPan) };
            if (record.GuardianPan != '') { allPan.push(record.GuardianPan) };

            if (record.TaxStatus == 'Individual' || record.TaxStatus == 'NRI') {
                if (record.FirstHolderPan != '' && record.SecondHolderPan == '' && record.ThirdHolderPan == '' && record.GuardianPan == '') {
                    let familyListData = await getClientKycProfileSelfFamilyByPan(allPan.join(','), associateId);

                    if (familyListData.length > 0) {
                        familyList = familyListData.map((item) => {
                            const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                            const LeadId = cryptoEngine.ParamEncrypt(item.LeadId, true);
                            const AssociateId = cryptoEngine.ParamEncrypt(item.AssociateId, true);

                            return { ...item, Id, LeadId, AssociateId };
                        });
                    }
                    else {
                        let familyListData = await getClientKycProfileFamilyAll(associateId);

                        familyList = familyListData.map((item) => {
                            const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                            const LeadId = cryptoEngine.ParamEncrypt(item.LeadId, true);
                            const AssociateId = cryptoEngine.ParamEncrypt(item.AssociateId, true);

                            return { ...item, Id, LeadId, AssociateId };
                        });

                        familyList.unshift({ Id: cryptoEngine.ParamEncrypt('0', true), LeadId: cryptoEngine.ParamEncrypt('0', true), AssociateId: cryptoEngine.ParamEncrypt('0', true), FamilyName: 'New Family' });
                    }
                }
                else {
                    let familyListDataAll = await getClientKycProfileFamilyAll(associateId);
                    let familyListData = await getClientKycProfileFamilyByPan(allPan.join(','), associateId);

                    let clientProfileOne = (familyListData.length > 0) ? familyListData[0] : null;

                    if (clientProfileOne != null) {
                        let familyListDataAll1 = familyListDataAll.filter(x => x.Id != clientProfileOne.Id);

                        familyList = familyListDataAll1.map((item) => {
                            const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                            const LeadId = cryptoEngine.ParamEncrypt(item.LeadId, true);
                            const AssociateId = cryptoEngine.ParamEncrypt(item.AssociateId, true);

                            return { ...item, Id, LeadId, AssociateId };
                        });

                        familyList.unshift({ Id: cryptoEngine.ParamEncrypt(clientProfileOne.Id, true), LeadId: cryptoEngine.ParamEncrypt(clientProfileOne.LeadId, true), AssociateId: cryptoEngine.ParamEncrypt(clientProfileOne.AssociateId, true), FamilyName: clientProfileOne.FamilyName });
                        familyList.unshift({ Id: cryptoEngine.ParamEncrypt('0', true), LeadId: cryptoEngine.ParamEncrypt('0', true), AssociateId: cryptoEngine.ParamEncrypt('0', true), FamilyName: 'New Family' });
                    }
                    else {
                        familyList = familyListDataAll.map((item) => {
                            const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                            const LeadId = cryptoEngine.ParamEncrypt(item.LeadId, true);
                            const AssociateId = cryptoEngine.ParamEncrypt(item.AssociateId, true);

                            return { ...item, Id, LeadId, AssociateId };
                        });

                        familyList.unshift({ Id: cryptoEngine.ParamEncrypt('0', true), LeadId: cryptoEngine.ParamEncrypt('0', true), AssociateId: cryptoEngine.ParamEncrypt('0', true), FamilyName: 'New Family' });
                    }
                }
            }
            else if (record.TaxStatus == 'On behalf of minor' || record.TaxStatus == 'NRI Child') {
                let familyListDataAll = await getClientKycProfileFamilyAll(associateId);
                let familyListData = await getClientKycProfileFamilyByPan(allPan.join(','), associateId);

                let clientProfileOne = (familyListData.length > 0) ? familyListData[0] : null;

                if (clientProfileOne != null) {
                    let familyListDataAll1 = familyListDataAll.filter(x => x.Id != clientProfileOne.Id);

                    familyList = familyListDataAll1.map((item) => {
                        const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                        const LeadId = cryptoEngine.ParamEncrypt(item.LeadId, true);
                        const AssociateId = cryptoEngine.ParamEncrypt(item.AssociateId, true);

                        return { ...item, Id, LeadId, AssociateId };
                    });

                    familyList.unshift({ Id: cryptoEngine.ParamEncrypt(clientProfileOne.Id, true), LeadId: cryptoEngine.ParamEncrypt(clientProfileOne.LeadId, true), AssociateId: cryptoEngine.ParamEncrypt(clientProfileOne.AssociateId, true), FamilyName: clientProfileOne.FamilyName });
                }
                else {
                    familyList = familyListDataAll.map((item) => {
                        const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                        const LeadId = cryptoEngine.ParamEncrypt(item.LeadId, true);
                        const AssociateId = cryptoEngine.ParamEncrypt(item.AssociateId, true);

                        return { ...item, Id, LeadId, AssociateId };
                    });
                }
            }
            else {
                let familyListDataAll = await getClientKycProfileFamilyAll(associateId);
                let familyListData = await getClientKycProfileFamilyByPan(allPan.join(','), associateId);

                let clientProfileOne = (familyListData.length > 0) ? familyListData[0] : null;

                if (clientProfileOne != null) {
                    let familyListDataAll1 = familyListDataAll.filter(x => x.Id != clientProfileOne.Id);

                    familyList = familyListDataAll1.map((item) => {
                        const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                        const LeadId = cryptoEngine.ParamEncrypt(item.LeadId, true);
                        const AssociateId = cryptoEngine.ParamEncrypt(item.AssociateId, true);

                        return { ...item, Id, LeadId, AssociateId };
                    });

                    familyList.unshift({ Id: cryptoEngine.ParamEncrypt(clientProfileOne.Id, true), LeadId: cryptoEngine.ParamEncrypt(clientProfileOne.LeadId, true), AssociateId: cryptoEngine.ParamEncrypt(clientProfileOne.AssociateId, true), FamilyName: clientProfileOne.FamilyName });
                    familyList.unshift({ Id: cryptoEngine.ParamEncrypt('0', true), LeadId: cryptoEngine.ParamEncrypt('0', true), AssociateId: cryptoEngine.ParamEncrypt('0', true), FamilyName: 'New Family' });
                }
                else {
                    familyList = familyListDataAll.map((item) => {
                        const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                        const LeadId = cryptoEngine.ParamEncrypt(item.LeadId, true);
                        const AssociateId = cryptoEngine.ParamEncrypt(item.AssociateId, true);

                        return { ...item, Id, LeadId, AssociateId };
                    });

                    // familyList.unshift({ Id: cryptoEngine.ParamEncrypt('0', true), LeadId: cryptoEngine.ParamEncrypt('0', true), AssociateId: cryptoEngine.ParamEncrypt('0', true), FamilyName: 'New Family' });
                }
            }
        }
        else {
            let familyListDataAll = await getClientKycProfileFamilyAll(associateId);
            familyList = familyListDataAll.map((item) => {
                const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                const LeadId = cryptoEngine.ParamEncrypt(item.LeadId, true);
                const AssociateId = cryptoEngine.ParamEncrypt(item.AssociateId, true);

                return { ...item, Id, LeadId, AssociateId };
            });

            familyList.unshift({ Id: cryptoEngine.ParamEncrypt('0', true), LeadId: cryptoEngine.ParamEncrypt('0', true), AssociateId: cryptoEngine.ParamEncrypt('0', true), FamilyName: 'New Family' });
        }
    }

    return familyList;
};

async function getClientKycProfileSelfFamilyByPan(panCardNumber, associateId) {
    var data = [];

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("PANCardNumber", panCardNumber)
        .input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true));
    const readResult = await readRequest.execute("GetClientKycProfileSelfFamilyByPan");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function getClientKycProfileFamilyAll(associateId) {
    var data = [];

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true));
    const readResult = await readRequest.execute("GetClientKycProfileFamilyAll");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function getClientKycProfileFamilyByPan(panCardNumber, associateId) {
    var data = [];

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("PANCardNumber", panCardNumber)
        .input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true));
    const readResult = await readRequest.execute("GetClientKycProfileFamilyByPan");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function getClientKycProfileByClientPan(panCardNumber, clientId) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("PANCardNumber", panCardNumber)
        .input("ClientId", cryptoEngine.ParamDecrypt(clientId, true));
    const readResult = await readRequest.execute("GetClientKycProfileByClientPANCardNumber");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function getClientKycProfileGuardianByClientPan(panCardNumber, clientId) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("PANCardNumber", panCardNumber)
        .input("ClientId", cryptoEngine.ParamDecrypt(clientId, true));
    const readResult = await readRequest.execute("GetClientKycProfileGuardianByClientPANCardNumber");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function getClientKcyProfileFamilyByProfileId(clientKycProfileId) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("ClientKycProfileId", clientKycProfileId);
    const readResult = await readRequest.execute("GetClientKycProfileFamilyByProfileId");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function getClientKcyProfileFamilyByFamilyId(clientFamilyId) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("ClientFamilyId", clientFamilyId);
    const readResult = await readRequest.execute("GetClientKycProfileFamily");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function getClientFamilyByName(name, clientId) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("Name", name)
        .input("ClientId", cryptoEngine.ParamDecrypt(clientId, true));
    const readResult = await readRequest.execute("GetClientFamilyByName");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function getClientFamilyByPan(panCardNumber, clientId) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("PANCardNumber", panCardNumber)
        .input("ClientId", cryptoEngine.ParamDecrypt(clientId, true));
    const readResult = await readRequest.execute("GetClientFamilyByPan");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function getClientCompanyByName(name, clientId) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("Name", name)
        .input("ClientId", cryptoEngine.ParamDecrypt(clientId, true));
    const readResult = await readRequest.execute("GetClientCompanyByName");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function getTaxStatusDataByName(name) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetTaxStatusByName");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function getTaxStatusByName(name) {
    var data = 0;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetTaxStatusByName");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0].Id;
    }

    return data;
};

async function getRelation(name) {
    var Id = 0;

    if (name.toLowerCase() == 'primary') {
        name = 'Self';
    }
    else if (name.toLowerCase() == 'others') {
        name = 'Other';
    }

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetRelationByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getTaxSlab(code) {
    var Id = 0;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("Code", code);
    const readResult = await readRequest.execute("GetTaxSlabByCode");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getKYCStatus(name) {
    var Id = 0;

    if (name == '') {
        name = 'Not Available';
    }

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetKYCStatusByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getOccupation(name) {
    var Id = 0;

    if (name == '') {
        name = 'Others';
    }

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetOccupationByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getGrossAnnualIncome(name) {
    var Id = 0;

    if (name == '') {
        name = 'None';
    }

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetGrossAnnualIncomeByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getWealthSource(name) {
    var Id = 0;

    if (name == '') {
        name = 'Others';
    }

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetWealthSourceByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getGender(name) {
    var Id = 0;

    if (name == '') {
        name = 'Other';
    }

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetGenderByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getSelfDeclaration(code) {
    var Id = 0;

    if (code == '') {
        code = 'SE';
    }

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("Code", code);
    const readResult = await readRequest.execute("GetSelfDeclarationByCode");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getClientKycAddress(profileId) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("ClientKycProfileId", profileId);
    const readResult = await readRequest.execute("GetClientKycLocalAddressByProfileId");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function getAddressType(name) {
    var Id = 0;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetAddressTypeByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getState(name) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetStateByName");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function getBankAccountType(name) {
    var Id = 0;

    var accountType = '';

    if (name.includes('NRE')) {
        accountType = 'Non-resident External';
    }
    else if (name.includes('NRO')) {
        accountType = 'Non-resident ordinary';
    }
    else if (name.startsWith('N')) {
        accountType = 'Non-resident External';
    }
    else if (name.startsWith('S')) {
        accountType = 'Savings';
    }
    else if (name.startsWith('C')) {
        accountType = 'Current';
    }

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("Name", accountType);
    const readResult = await readRequest.execute("GetBankAccountTypeByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getClientKycBank(profileId, accountType, accountNumber) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("ClientKycProfileId", profileId)
        .input("BankAccountTypeId", accountType)
        .input("AccountNumber", accountNumber);
    const readResult = await readRequest.execute("GetClientKycBankByAccountNumber");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function getClientAccountHoldingPattern(clientId, firstHolderProfileId, secondHolderProfileId, thirdHolderProfileId, nominee1FamilyId, nominee2FamilyId, nominee3FamilyId) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("ClientId", clientId)
        .input("FirstHolderProfileId", firstHolderProfileId)
        .input("SecondHolderProfileId", secondHolderProfileId)
        .input("ThirdHolderProfileId", thirdHolderProfileId)
        .input("FirstNomineeFamilyId", nominee1FamilyId)
        .input("SecondNomineeFamilyId", nominee2FamilyId)
        .input("ThirdNomineeFamilyId", nominee3FamilyId);
    const readResult = await readRequest.execute("GetClientAccountHoldingPattern");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function getClientById(id) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("Id", id);
    const readResult = await readRequest.execute("GetClientById");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function getClientAccount(id) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("Id", id);
    const readResult = await readRequest.execute("GetClientAccountById");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function getAccountTypeByName(name) {
    var Id = 0;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetAccountTypeByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getClientAccountMinorToMajorTransfer(name, dateOfBirth, ucc) {
    var data = [];

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("Name", name)
        .input("DateOfBirth", dateOfBirth)
        .input("UCC", ucc);
    const readResult = await readRequest.execute("GetClientAccountMinorToMajorTransfer");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function getClientAccountMajorToMajorTransfer(firstHolderPANCardNumber, secondHolderPANCardNumber, thirdHolderPANCardNumber, ucc) {
    var data = [];

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("FirstHolderPANCardNumber", firstHolderPANCardNumber)
        .input("SecondHolderPANCardNumber", secondHolderPANCardNumber)
        .input("ThirdHolderPANCardNumber", thirdHolderPANCardNumber)
        .input("UCC", ucc);
    const readResult = await readRequest.execute("GetClientAccountMajorToMajorTransfer");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function saveLead(leadDate, associateId, firstName, lastName, genderId, mobileNumber, email, countryId, address1, address2, address3, city, stateId, pinCode) {
    let errorMessage = 'Error while saving lead...';
    let pool = await appPool.connect();

    let leadId = 0;

    const transaction = pool.transaction();

    try {
        await transaction.begin();

        const request = transaction.request();
        request.output("Id", msSql.BigInt)
            .input("LeadDate", leadDate)
            .input("AssociateId", associateId)
            .input("FirstName", firstName)
            .input("LastName", lastName)
            .input("GenderId", genderId)
            .input("MobileNumber", mobileNumber)
            .input("Email", email)
            .input("CountryId", countryId)
            .input("Address1", address1)
            .input("Address2", address2)
            .input("Address3", address3)
            .input("City", city)
            .input("StateId", stateId)
            .input("PinCode", pinCode);

        const result = await request.execute("InsertLead");
        leadId = result.output.Id;

        await transaction.commit();

        return leadId;
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        return Error(errorMessage);
    }
};

async function saveClient(leadId, associateId, isIndividual, isNonIndividual, familyName, appUserId) {
    let errorMessage = 'Error while saving lead...';
    let pool = await appPool.connect();

    let clientId = cryptoEngine.ParamEncrypt('0', true);

    const transaction = pool.transaction();

    try {
        await transaction.begin();

        const request = transaction.request();
        request.output("Id", msSql.BigInt)
            .input("LeadId", leadId)
            .input("AssociateId", associateId)
            .input("IsIndividual", isIndividual)
            .input("IsNonIndividual", isNonIndividual)
            .input("FamilyName", familyName)
            .input("CreatedBy", appUserId);
        const result = await request.execute("InsertClient");
        clientId = cryptoEngine.ParamEncrypt(result.output.Id, true);

        await transaction.commit();

        return clientId;
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        return Error(errorMessage);
    }
};

async function saveClientFamily(clientId, name, dateOfBirth, relationId, taxStatusId, taxSlabId) {
    let errorMessage = 'Error while saving client family...';
    let pool = await appPool.connect();

    const transaction = pool.transaction();

    try {
        let dob = date.format(new Date, 'YYYY-MM-DD');
        if (dateOfBirth != null) {
            dob = date.format(dateOfBirth, 'YYYY-MM-DD');
        }

        await transaction.begin();

        const memberRequest = transaction.request();
        memberRequest.output("Id", msSql.BigInt)
            .input("ClientId", clientId)
            .input("Name", name)
            .input("DateOfBirth", dob)
            .input("RelationId", relationId)
            .input("TaxStatusId", taxStatusId)
            .input("TaxSlabId", taxSlabId)
            .input("LifeExpectancy", 85)
            .input("FatherName", '');
        const memeberResult = await memberRequest.execute("InsertClientFamily");
        let clientFamilyId = memeberResult.output.Id;

        await transaction.commit();

        return clientFamilyId;
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        return Error(errorMessage);
    }
};

async function saveClientCompany(clientId, name, dateOfIncorporation, taxStatusId, taxSlabId) {
    let errorMessage = 'Error while saving client company...';
    let pool = await appPool.connect();

    const transaction = pool.transaction();

    try {
        let doi = null;
        if (dateOfIncorporation != null) {
            doi = date.format(dateOfIncorporation, 'YYYY-MM-DD');
        }

        await transaction.begin();

        const companyRequest = transaction.request();
        companyRequest.output("Id", msSql.BigInt)
            .input("ClientId", clientId)
            .input("Name", name)
            .input("DateOfIncorporation", doi)
            .input("TaxStatusId", taxStatusId)
            .input("TaxSlabId", taxSlabId);
        const companyResult = await companyRequest.execute("InsertClientCompany");
        let clientCompanyId = companyResult.output.Id;

        await transaction.commit();

        return clientCompanyId;
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        return Error(errorMessage);
    }
};

async function saveClientKycFamily(clientId, familyId) {
    let errorMessage = 'Error while saving client kyc...';
    let pool = await appPool.connect();

    const transaction = pool.transaction();

    try {

        await transaction.begin();

        const memberDeleteRequest = transaction.request();
        memberDeleteRequest.input("ClientId", clientId)
            .input("ClientFamilyId", familyId);
        const memberDeleteResult = await memberDeleteRequest.execute("DeleteClientKycFamilyByFamily");

        const memberRequest = transaction.request();
        memberRequest.output("Id", msSql.BigInt)
            .input("ClientId", clientId)
            .input("ClientFamilyId", familyId);
        const memeberResult = await memberRequest.execute("InsertClientKycFamily");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        return Error(errorMessage);
    }
};

async function saveClientKycCompany(clientId, companyId) {
    let errorMessage = 'Error while saving client kyc...';
    let pool = await appPool.connect();

    const transaction = pool.transaction();

    try {

        await transaction.begin();

        const memberDeleteRequest = transaction.request();
        memberDeleteRequest.input("ClientId", clientId)
            .input("ClientCompanyId", companyId);
        const memberDeleteResult = await memberDeleteRequest.execute("DeleteClientKycCompanyByCompany");

        const memberRequest = transaction.request();
        memberRequest.output("Id", msSql.BigInt)
            .input("ClientId", clientId)
            .input("ClientCompanyId", companyId);
        const memeberResult = await memberRequest.execute("InsertClientKycCompany");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        return Error(errorMessage);
    }
};

async function saveClientKycProfile(clientId, clientFamilyId, clientCompanyId, guardianId, pancardNumber, CKYCNumber, aadharCardNumber, countryCode, mobileNumber, email, placeOfBirth, countryOfBirth, employerName,
    netWorth, netWorthDate, placeOfIncorporation, countryOfIncorporation, natureOfBusiness, kycStatusId, occupationId, grossAnnualIncomeId, wealthSourceId, isPoliticallyExposed, taxStatusId, genderId, mobileSelfDeclarationId, emailSelfDeclarationId, guardianRelationId) {
    let clientKycProfileId = 0;

    let errorMessage = 'Error while saving client kyc...';
    let pool = await appPool.connect();

    const transaction = pool.transaction();

    try {

        await transaction.begin();

        const request = transaction.request();
        request.output("Id", msSql.BigInt)
            .input("ClientId", clientId)
            .input("PANCardNumber", pancardNumber)
            .input("CKYCNumber", CKYCNumber)
            .input("AadharCardNumber", aadharCardNumber)
            .input("CountryCode", countryCode)
            .input("MobileNumber", mobileNumber)
            .input("Email", email)
            .input("PlaceOfBirth", placeOfBirth)
            .input("CountryOfBirth", countryOfBirth)
            .input("EmployerName", employerName)
            .input("NetWorth", netWorth)
            .input("NetWorthDate", netWorthDate)
            .input("PlaceOfIncorporation", placeOfIncorporation)
            .input("CountryOfIncorporation", countryOfIncorporation)
            .input("NatureOfBusiness", natureOfBusiness)
            .input("KycStatusId", kycStatusId)
            .input("GrossAnnualIncomeId", grossAnnualIncomeId)
            .input("IsPoliticallyExposed", isPoliticallyExposed);
        const result = await request.execute("InsertClientKycProfile");
        clientKycProfileId = result.output.Id;

        if (clientFamilyId != 0) {
            const employeeRequest = transaction.request();
            employeeRequest.input("ClientKycProfileId", clientKycProfileId)
                .input("ClientFamilyId", clientFamilyId);
            const employeeResult = await employeeRequest.execute("InsertClientKycProfileFamily");

            const taxRequest = transaction.request();
            taxRequest.input("ClientFamilyId", clientFamilyId)
                .input("TaxStatusId", taxStatusId);
            const taxResult = await taxRequest.execute("UpdateClientFamilyTaxStatus");

            const genderRequest = transaction.request();
            genderRequest.input("ClientKycProfileId", clientKycProfileId)
                .input("GenderId", genderId);
            const genderResult = await genderRequest.execute("InsertClientKycProfileGender");

            if (guardianId != 0) {
                const guardianRequest = transaction.request();
                guardianRequest.input("ClientKycProfileId", clientKycProfileId)
                    .input("ClientFamilyId", guardianId)
                    .input("RelationId", guardianRelationId);
                const guardianResult = await guardianRequest.execute("InsertClientKycProfileGuardian");
            }

            const mobileRequest = transaction.request();
            mobileRequest.input("ClientKycProfileId", clientKycProfileId)
                .input("SelfDeclarationId", mobileSelfDeclarationId);
            const mobileResult = await mobileRequest.execute("InsertClientKycProfileMobileDeclaration");

            const emailRequest = transaction.request();
            emailRequest.input("ClientKycProfileId", clientKycProfileId)
                .input("SelfDeclarationId", emailSelfDeclarationId);
            const emailResult = await emailRequest.execute("InsertClientKycProfileEmailDeclaration");
        }

        if (clientCompanyId != 0) {
            const employeeRequest = transaction.request();
            employeeRequest.input("ClientKycProfileId", clientKycProfileId)
                .input("ClientCompanyId", clientCompanyId);
            const employeeResult = await employeeRequest.execute("InsertClientKycProfileCompany");

            const taxRequest = transaction.request();
            taxRequest.input("ClientCompanyId", clientCompanyId)
                .input("TaxStatusId", taxStatusId);
            const taxResult = await taxRequest.execute("UpdateClientCompanyTaxStatus");

            // const deleteUboRequest = transaction.request();
            // deleteUboRequest.input("ClientKycProfileId", clientKycProfileId);
            // const deleteUboResult = await deleteUboRequest.execute("DeleteClientKycProfileUbo");

            // for (let i = 0; i < ClientKycProfileUboData.length; i++) {
            //     const memberUboRequest = transaction.request();
            //     memberUboRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true))
            //         .input("ClientFamilyId", cryptoEngine.ParamDecrypt(ClientKycProfileUboData[i].ClientFamilyId, true));
            //     const memeberUboResult = await memberUboRequest.execute("InsertClientKycProfileUbo");
            // }
        }

        const deleteOccupationRequest = transaction.request();
        deleteOccupationRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(clientKycProfileId, true));
        const deleteOccupationResult = await deleteOccupationRequest.execute("DeleteClientKycProfileOccupation");

        if (cryptoEngine.ParamDecrypt(occupationId, true) != 0) {
            const occupationRequest = transaction.request();
            occupationRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(clientKycProfileId, true))
                .input("OccupationId", cryptoEngine.ParamDecrypt(occupationId, true));
            const occupationResult = await occupationRequest.execute("InsertClientKycProfileOccupation");
        }

        const deleteGAIRequest = transaction.request();
        deleteGAIRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(clientKycProfileId, true));
        const deleteGAIResult = await deleteGAIRequest.execute("DeleteClientKycProfileGrossAnnualIncome");

        if (cryptoEngine.ParamDecrypt(grossAnnualIncomeId, true) != 0) {
            const gaiRequest = transaction.request();
            gaiRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(clientKycProfileId, true))
                .input("GrossAnnualIncomeId", cryptoEngine.ParamDecrypt(grossAnnualIncomeId, true));
            const gaiResult = await gaiRequest.execute("InsertClientKycProfileGrossAnnualIncome");
        }

        const deleteWSRequest = transaction.request();
        deleteWSRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(clientKycProfileId, true));
        const deleteWSResult = await deleteWSRequest.execute("DeleteClientKycProfileWealthSource");

        if (cryptoEngine.ParamDecrypt(wealthSourceId, true) != 0) {
            const wsRequest = transaction.request();
            wsRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(clientKycProfileId, true))
                .input("WealthSourceId", cryptoEngine.ParamDecrypt(wealthSourceId, true));
            const wsResult = await wsRequest.execute("InsertClientKycProfileWealthSource");
        }

        await transaction.commit();

        return clientKycProfileId;
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        return Error(errorMessage);
    }
};

async function saveClientKycProfileGuardian(profileId, guardianId, relationId) {
    let errorMessage = 'Error while saving client minor guardian...';
    let pool = await appPool.connect();

    const transaction = pool.transaction();

    try {
        await transaction.begin();

        const memberRequest = transaction.request();
        memberRequest.input("ClientKycProfileId", profileId)
            .input("ClientFamilyId", guardianId)
            .input("RelationId", relationId);
        const memeberResult = await memberRequest.execute("InsertClientKycProfileGuardian");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        return Error(errorMessage);
    }
};

async function saveClientKycLocalAddress(clientKycProfileId, addressTypeId, address1, address2, address3, city, countryId, stateId, pinCode) {
    let errorMessage = 'Error while saving client address...';
    let pool = await appPool.connect();

    const transaction = pool.transaction();

    try {
        await transaction.begin();

        const request = transaction.request();
        request.output("Id", msSql.BigInt)
            .input("ClientKycProfileId", clientKycProfileId)
            .input("AddressTypeId", addressTypeId)
            .input("Address1", address1)
            .input("Address2", address2)
            .input("Address3", address3)
            .input("City", city)
            .input("CountryId", countryId)
            .input("StateId", stateId)
            .input("PinCode", pinCode)
            .input("IsSameForAll", false)
            .input("UseGuardianAddress", false);
        const result = await request.execute("InsertClientKycLocalAddress");
        let localAddressId = result.output.Id;

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        return Error(errorMessage);
    }
};

async function saveClientKycBank(clientKycProfileId, ifsc, bankName, bankBranch, micr, bankAccountTypeId, accountNumber, UPIId, fileTag) {
    let errorMessage = 'Error while saving client bank...';
    let pool = await appPool.connect();

    let bankId = 0;

    const transaction = pool.transaction();

    try {
        await transaction.begin();

        const request = transaction.request();
        request.output("Id", msSql.BigInt)
            .input("ClientKycProfileId", clientKycProfileId)
            .input("IFSC", ifsc.toUpperCase())
            .input("BankName", bankName)
            .input("BankBranch", bankBranch)
            .input("MICR", micr)
            .input("BankAccountTypeId", bankAccountTypeId)
            .input("AccountNumber", accountNumber)
            .input("UPIId", UPIId)
            .input("FileTag", fileTag)
            .input("IsActive", true);
        const result = await request.execute("InsertClientKycBank");
        bankId = result.output.Id;

        await transaction.commit();

        return bankId;
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        return Error(errorMessage);
    }
};

async function saveFeedUcc(id, ucc) {
    let errorMessage = 'Error while updating ucc...';
    let pool = await appPool.connect();

    const transaction = pool.transaction();

    try {
        await transaction.begin();

        const request = transaction.request();
        request.input("Id", id)
            .input("Ucc", ucc);
        const result = await request.execute("UpdateFeedTransactionUccFolioBSEUcc");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        return Error(errorMessage);
    }
};

async function saveClientAccount(clientId, accountTypeId, hasNominee, createBSEAccount, createMFUAccount, createP2PAccount, firstHolderId, secondHolderId, thirdHolderId,
    firstNomineeId, firstNomineeRelationId, firstNomineeShare, secondNomineeId, secondNomineeRelationId, secondNomineeShare,
    thirdNomineeId, thridNomineeRelationId, thirdNomineeShare, defaultBankId) {
    let errorMessage = 'Error while creating client account...';
    let pool = await appPool.connect();

    let clientAccountId = 0;

    const transaction = pool.transaction();

    try {
        await transaction.begin();

        const request = transaction.request();
        request.output("Id", msSql.BigInt)
            .input("ClientId", clientId)
            .input("AccountTypeId", accountTypeId)
            .input("HasNominee", hasNominee)
            .input("CreateBSEAccount", createBSEAccount)
            .input("CreateMFUAccount", createMFUAccount)
            .input("CreateP2PAccount", createP2PAccount);
        const result = await request.execute("InsertClientAccount");
        clientAccountId = result.output.Id;

        if (firstHolderId != 0) {
            const request = transaction.request();
            request.input("ClientAccountId", clientAccountId)
                .input("ClientKycProfileId", firstHolderId)
                .input("SerialNumber", 1);
            const result = await request.execute("InsertClientAccountHolder");
        }

        if (secondHolderId != 0) {
            const request = transaction.request();
            request.input("ClientAccountId", clientAccountId)
                .input("ClientKycProfileId", secondHolderId)
                .input("SerialNumber", 2);
            const result = await request.execute("InsertClientAccountHolder");
        }

        if (thirdHolderId != 0) {
            const request = transaction.request();
            request.input("ClientAccountId", clientAccountId)
                .input("ClientKycProfileId", thirdHolderId)
                .input("SerialNumber", 3);
            const result = await request.execute("InsertClientAccountHolder");
        }

        if (firstNomineeId != 0) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("ClientAccountId", clientAccountId)
                .input("ClientFamilyId", firstNomineeId)
                .input("RelationId", firstNomineeRelationId)
                .input("Shares", firstNomineeShare);
            const result = await request.execute("InsertClientAccountNominee");
        }

        if (secondNomineeId != 0) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("ClientAccountId", clientAccountId)
                .input("ClientFamilyId", secondNomineeId)
                .input("RelationId", secondNomineeRelationId)
                .input("Shares", secondNomineeShare);
            const result = await request.execute("InsertClientAccountNominee");
        }

        if (thirdNomineeId != 0) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("ClientAccountId", clientAccountId)
                .input("ClientFamilyId", thirdNomineeId)
                .input("RelationId", thridNomineeRelationId)
                .input("Shares", thirdNomineeShare);
            const result = await request.execute("InsertClientAccountNominee");
        }

        if (defaultBankId != 0) {
            const request = transaction.request();
            request.input("ClientAccountId", clientAccountId)
                .input("ClientKycBankId", defaultBankId)
                .input("IsDefault", true);
            const result = await request.execute("InsertClientAccountBank");
        }

        const uccRequest = transaction.request();
        uccRequest.input("Id", clientAccountId)
            .input("Prefix", process.env.BSE_UCC_PREFIX);
        const uccResult = await uccRequest.execute("UpdateClientAccountUCC");

        await transaction.commit();

        return clientAccountId;
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        return Error(errorMessage);
    }
};