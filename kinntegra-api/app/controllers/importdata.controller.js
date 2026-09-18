const importDataService = require("../models/importdataservice.model");
const msSql = require("mssql");
const xlsx = require('xlsx');
const path = require('path');
const cryptoEngine = require("../models/cryptoengine.model");
const commonFunction = require("../models/commonfunction.model");
const date = require('date-and-time');
const mime = require('mime-types');
const appPool = require("../models/db.model");
const appUserController = require('../controllers/appuser.controller');
const luxon = require('luxon');
const transactionController = require('../controllers/transaction.controller');

exports.ImportAssociate = async (req, res) => {
    var errorMessage = "Error while importing associate...";
    const transaction = req.app.locals.db.transaction();
    try {
        var associateList = await importDataService.GetAssociateList();
        await transaction.begin();
        for (let i = 0; i < associateList.length; i++) {

            if (associateList[i].PanCardNumber.trim() != '') {
                var associateData = await importDataService.GetAssociate(associateList[i].PanCardNumber);

                let Profession = associateData['ProfessionName'];
                let EntityName = associateData['EntityName'];
                let AuthorisedPerson1 = associateData['AuthorisedPerson1'];
                let Email1 = associateData['Email1'];
                let Mobile1 = associateData['Mobile1'];
                let PAN1 = associateData['PAN1'];
                let AuthorisedPerson2 = associateData['AuthorisedPerson2'];
                let Email2 = associateData['Email2'];
                let Mobile2 = associateData['Mobile2'];
                let PAN2 = associateData['PAN2'];
                let AuthorisedPerson3 = associateData['AuthorisedPerson3'];
                let Email3 = associateData['Email3'];
                let Mobile3 = associateData['Mobile3'];
                let PAN3 = associateData['PAN3'];
                let AssociateName = associateData['Name'];
                let PANCardNumber = associateData['PANCardNumber'];
                let AadharCardNumber = associateData['AadharCardNumber'];
                let DateOfBirth = associateData['DateOfBirth'];
                let DateOfIncorporation = associateData['DateOfIncorporation'];
                let GSTIN = associateData['GSTIN'];
                let GSTINValidDate = associateData['GSTINValidDate'];
                let ShopCertificateNumber = associateData['ShopCertificateNumber'];
                let ShopCertificateValidDate = associateData['ShopCertificateValidDate'];
                let TAN = associateData['TAN'];
                let PrimaryColor = associateData['PrimaryColor'];
                let SecondaryColor = associateData['SecondaryColor'];
                let ARNHolderName = associateData['ARNHolderName'];
                let ARN = associateData['ARN'];
                let ARNValidDate = associateData['ARNValidDate'];
                let EUINHolderName = associateData['EUINHolderName'];
                let EUIN = associateData['EUIN'];
                let EUINValidDate = associateData['EUINValidDate'];
                let RIAName = associateData['RIAName'];
                let RIANumber = associateData['RIANumber'];
                let RIAValidDate = associateData['RIAValidDate'];
                let IsActive = associateData['IsActive'];
                let AssociateCode = associateData['AssociateCode'];
                let BSEPassword = associateData['BSEPassword'];
                let IsBSEFileUploaded = associateData['IsBSEFileUploaded'];
                let IsAdminVerified = associateData['IsAdminVerified'];
                let IsSelfVerified = associateData['IsSelfVerified'];
                let IsGeneralInfoCompleted = associateData['IsGeneralInfoCompleted'];
                let IsEntityDetailsCompleted = associateData['IsEntityDetailsCompleted'];
                let IsPhotoDetailsCompleted = associateData['IsPhotoDetailsCompleted'];
                let IsCommunicationCompleted = associateData['IsCommunicationCompleted'];
                let IsBankCompleted = associateData['IsBankCompleted'];
                let IsOtherCompleted = associateData['IsOtherCompleted'];
                let IsNomineeCompleted = associateData['IsNomineeCompleted'];
                let IsGuardianCompleted = associateData['IsGuardianCompleted'];
                let IsLicenseCompleted = associateData['IsLicenseCompleted'];
                let IsCertificateCompleted = associateData['IsCertificateCompleted'];
                let IsCommerialsCompleted = associateData['IsCommerialsCompleted'];
                let IsRightsCompleted = associateData['IsRightsCompleted'];
                let IsDownloadCompleted = associateData['IsDownloadCompleted'];
                let CreatedBy = associateData['CreatedBy'];
                let Revision = associateData['Revision'];
                let EntityType = associateData['AssociateIntroducer']['AssociateEntityType'];
                let Address1 = associateData['AssociateCommunication']['Address1'];
                let Address2 = associateData['AssociateCommunication']['Address2'];
                let Address3 = associateData['AssociateCommunication']['Address3'];
                let City = associateData['AssociateCommunication']['City'];
                let State = associateData['AssociateCommunication']['StateName'];
                let Country = associateData['AssociateCommunication']['CountryName'];
                let PinCode = associateData['AssociateCommunication']['PinCode'];
                let MobileNumber = associateData['AssociateCommunication']['MobileNumber'];
                let TelephoneNumber = associateData['AssociateCommunication']['TelephoneNumber'];
                let Email = associateData['AssociateCommunication']['Email'];
                let IFSC = associateData['AssociateBank']['IFSC'];
                let BankName = associateData['AssociateBank']['BankName'];
                let Branch = associateData['AssociateBank']['Branch'];
                let MICR = associateData['AssociateBank']['MICR'];
                let BankAccountType = associateData['AssociateBank']['BankAccountTypeName'];
                let AccountNumber = associateData['AssociateBank']['AccountNumber'];
                let RIAIFSC = associateData['AssociateBankRia']['IFSC'];
                let RIABankName = associateData['AssociateBankRia']['BankName'];
                let RIABranch = associateData['AssociateBankRia']['Branch'];
                let RIAMICR = associateData['AssociateBankRia']['MICR'];
                let RIABankAccountType = associateData['AssociateBankRia']['BankAccountTypeName'];
                let RIAAccountNumber = associateData['AssociateBankRia']['AccountNumber'];
                let NomineeName = associateData['AssociateNominee']['Name'];
                let NomineeDateOfBirth = associateData['AssociateNominee']['DateOfBirth'];
                let NomineePrimaryAddress = associateData['AssociateNominee']['IsAddressAsPrimaryHolder'];
                let NomineeAddress1 = associateData['AssociateNominee']['Address1'];
                let NomineeAddress2 = associateData['AssociateNominee']['Address2'];
                let NomineeAddress3 = associateData['AssociateNominee']['Address3'];
                let NomineeCity = associateData['AssociateNominee']['City'];
                let NomineeCountry = associateData['AssociateNominee']['CountryName'];
                let NomineeState = associateData['AssociateNominee']['StateName'];
                let NomineePinCode = associateData['AssociateNominee']['PinCode'];
                let NomineeMobileNumber = associateData['AssociateNominee']['MobileNumber'];
                let NomineeTelephone = associateData['AssociateNominee']['TelephoneNumber'];
                let NomineeEmail = associateData['AssociateNominee']['Email'];
                let GuardianName = associateData['AssociateNomineeGuardian']['Name'];
                let GuardianPanNo = associateData['AssociateNomineeGuardian']['PANCardNumber'];
                let GuardianRelation = associateData['AssociateNomineeGuardian']['RelationName'];
                //let GuardianDateOfBirth = associateData['AssociateNomineeGuardian']['DateOfBirth'];
                let GuardianPrimaryAddress = associateData['AssociateNomineeGuardian']['IsAddressAsPrimaryHolder'];
                let GuardianAddress1 = associateData['AssociateNomineeGuardian']['Address1'];
                let GuardianAddress2 = associateData['AssociateNomineeGuardian']['Address2'];
                let GuardianAddress3 = associateData['AssociateNomineeGuardian']['Address3'];
                let GuardianCity = associateData['AssociateNomineeGuardian']['City'];
                let GuardianCountry = associateData['AssociateNomineeGuardian']['CountryName'];
                let GuardianState = associateData['AssociateNomineeGuardian']['StateName'];
                let GuardianPinCode = associateData['AssociateNomineeGuardian']['PinCode'];
                let GuardianMobileNumber = associateData['AssociateNomineeGuardian']['MobileNumber'];
                let GuardianTelephone = associateData['AssociateNomineeGuardian']['TelephoneNumber'];
                let GuardianEmail = associateData['AssociateNomineeGuardian']['Email'];
                let NismVaNumber = associateData['AssociateCertificate']['NismVaNumber'];
                let NismVaValidDate = associateData['AssociateCertificate']['NismVaValidDate'];
                let NismXaNumber = associateData['AssociateCertificate']['NismXaNumber'];
                let NismXaValidDate = associateData['AssociateCertificate']['NismXaValidDate'];
                let NismXbNumber = associateData['AssociateCertificate']['NismXbNumber'];
                let NismXbValidDate = associateData['AssociateCertificate']['NismXbValidDate'];
                let CfpNumber = associateData['AssociateCertificate']['CfpNumber'];
                let CfpValidDate = associateData['AssociateCertificate']['CfpValidDate'];
                let CwmNumber = associateData['AssociateCertificate']['CwmNumber'];
                let CwmValidDate = associateData['AssociateCertificate']['CwmValidDate'];
                let CaNumber = associateData['AssociateCertificate']['CaNumber'];
                let CaValidDate = associateData['AssociateCertificate']['CaValidDate'];
                let CsNumber = associateData['AssociateCertificate']['CsNumber'];
                let CsValidDate = associateData['AssociateCertificate']['CsValidDate'];
                let CourseName = associateData['AssociateCertificate']['CourseName'];
                let CourseNumber = associateData['AssociateCertificate']['CourseNumber'];
                let CourseValidDate = associateData['AssociateCertificate']['CourseValidDate'];



                if (EntityType == 'Partnership/LLP') {
                    EntityType = 'Partnership Firm';
                }
                if (EntityType == 'Sole Proprietor') {
                    EntityType = 'Solo Proprietor';
                }
                if (DateOfBirth == '') {
                    DateOfBirth = null;
                }
                if (DateOfIncorporation == '') {
                    DateOfIncorporation = null;
                }
                if (GSTINValidDate == '') {
                    GSTINValidDate = null;
                }
                if (ShopCertificateValidDate == '') {
                    ShopCertificateValidDate = null;
                }
                if (ARNValidDate == '') {
                    ARNValidDate = null;
                }
                if (EUINValidDate == '') {
                    EUINValidDate = null;
                }

                if (RIAValidDate == '') {
                    RIAValidDate = null;
                }
                if (NomineeDateOfBirth == '') {
                    NomineeDateOfBirth = null;
                }
                if (NismVaValidDate == '') {
                    NismVaValidDate = null;
                }
                if (NismXaValidDate == '') {
                    NismXaValidDate = null;
                }
                if (NismXbValidDate == '') {
                    NismXbValidDate = null;
                }
                if (CfpValidDate == '') {
                    CfpValidDate = null;
                }
                if (CwmValidDate == '') {
                    CwmValidDate = null;
                }
                if (CaValidDate == '') {
                    CaValidDate = null;
                }
                if (CsValidDate == '') {
                    CsValidDate = null;
                }
                if (CourseValidDate == '') {
                    CourseValidDate = null;
                }

                const importAssociateRequest = transaction.request();
                importAssociateRequest.input("Profession", Profession)
                    .input("EntityName", EntityName)
                    .input("EntityType", EntityType)
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
                    .input("Name", AssociateName)
                    .input("PANCardNumber", PANCardNumber)
                    .input("AadharCardNumber", AadharCardNumber)
                    .input("DateOfBirth", DateOfBirth)
                    .input("DateOfIncorporation", DateOfIncorporation)
                    .input("GSTIN", GSTIN)
                    .input("GSTINValidDate", GSTINValidDate)
                    .input("ShopCertificateNumber", ShopCertificateNumber)
                    .input("ShopCertificateValidDate", ShopCertificateValidDate)
                    .input("TAN", TAN)
                    .input("PrimaryColor", PrimaryColor)
                    .input("SecondaryColor", SecondaryColor)
                    .input("ARNHolderName", ARNHolderName)
                    .input("ARN", ARN)
                    .input("ARNValidDate", ARNValidDate)
                    .input("EUINHolderName", EUINHolderName)
                    .input("EUIN", EUIN)
                    .input("EUINValidDate", EUINValidDate)
                    .input("RIAName", RIAName)
                    .input("RIANumber", RIANumber)
                    .input("RIAValidDate", RIAValidDate)
                    .input("IsActive", IsActive)
                    .input("AssociateCode", AssociateCode)
                    .input("BSEPassword", BSEPassword)
                    .input("IsBSEFileUploaded", IsBSEFileUploaded)
                    .input("IsAdminVerified", IsAdminVerified)
                    .input("IsSelfVerified", IsSelfVerified)
                    .input("IsGeneralInfoCompleted", IsGeneralInfoCompleted)
                    .input("IsEntityDetailsCompleted", IsEntityDetailsCompleted)
                    .input("IsPhotoDetailsCompleted", IsPhotoDetailsCompleted)
                    .input("IsCommunicationCompleted", IsCommunicationCompleted)
                    .input("IsBankCompleted", IsBankCompleted)
                    .input("IsOtherCompleted", IsOtherCompleted)
                    .input("IsNomineeCompleted", IsNomineeCompleted)
                    .input("IsGuardianCompleted", IsGuardianCompleted)
                    .input("IsLicenseCompleted", IsLicenseCompleted)
                    .input("IsCertificateCompleted", IsCertificateCompleted)
                    .input("IsCommerialsCompleted", IsCommerialsCompleted)
                    .input("IsRightsCompleted", IsRightsCompleted)
                    .input("IsDownloadCompleted", IsDownloadCompleted)
                    // .input("CreatedBy", CreatedBy)
                    .input("Revision", Revision)
                    .input("Address1", Address1)
                    .input("Address2", Address2)
                    .input("Address3", Address3)
                    .input("City", City)
                    .input("Country", Country)
                    .input("State", State)
                    .input("PinCode", PinCode)
                    .input("MobileNumber", MobileNumber)
                    .input("TelephoneNumber", TelephoneNumber)
                    .input("Email", Email)
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
                    .input("NomineeName", NomineeName)
                    .input("NomineeDateOfBirth", NomineeDateOfBirth)
                    .input("NomineePrimaryAddress", NomineePrimaryAddress)
                    .input("NomineeAddress1", NomineeAddress1)
                    .input("NomineeAddress2", NomineeAddress2)
                    .input("NomineeAddress3", NomineeAddress3)
                    .input("NomineeCity", NomineeCity)
                    .input("NomineeCountry", NomineeCountry)
                    .input("NomineeState", NomineeState)
                    .input("NomineePinCode", NomineePinCode)
                    .input("NomineeMobileNumber", NomineeMobileNumber)
                    .input("NomineeTelephone", NomineeTelephone)
                    .input("NomineeEmail", NomineeEmail)
                    .input("GuardianName", GuardianName)
                    .input("GuardianPanNo", GuardianPanNo)
                    .input("GuardianRelation", GuardianRelation)
                    .input("GuardianPrimaryAddress", GuardianPrimaryAddress)
                    .input("GuardianAddress1", GuardianAddress1)
                    .input("GuardianAddress2", GuardianAddress2)
                    .input("GuardianAddress3", GuardianAddress3)
                    .input("GuardianCity", GuardianCity)
                    .input("GuardianCountry", GuardianCountry)
                    .input("GuardianState", GuardianState)
                    .input("GuardianPinCode", GuardianPinCode)
                    .input("GuardianMobileNumber", GuardianMobileNumber)
                    .input("GuardianTelephone", GuardianTelephone)
                    .input("GuardianEmail", GuardianEmail)
                if (AccountNumber != '') {
                    importAssociateRequest.input("IFSC", IFSC)
                        .input("BankName", BankName)
                        .input("Branch", Branch)
                        .input("MICR", MICR)
                        .input("BankAccountType", BankAccountType)
                        .input("AccountNumber", AccountNumber)
                        .input("RIAAccountNumber", RIAAccountNumber);
                }
                if (RIAAccountNumber != '') {
                    importAssociateRequest.input("IFSC", RIAIFSC)
                        .input("BankName", RIABankName)
                        .input("Branch", RIABranch)
                        .input("MICR", RIAMICR)
                        .input("BankAccountType", RIABankAccountType)
                        .input("RIAAccountNumber", RIAAccountNumber);
                }
                const ImportAssociateResult = await importAssociateRequest.execute("ImportAssociateNew");
                //await transaction.commit();
            }
        }

        for (let j = 0; j < associateList.length; j++) {
            //  await transaction.begin();
            if (associateList[j].PanCardNumber.trim() != '') {
                var associateCertficateData = await importDataService.GetAssociate(associateList[j].PanCardNumber);
                let AssociatePANCardNumber = associateCertficateData['PANCardNumber'];
                let IntroducerAssociatePan = associateCertficateData['AssociateIntroducer']['AssociatePANCardNumber'];
                let BusinessTagAssociatePanNo = associateCertficateData['AssociateIntroducer']['AssociateBusinessTag'];
                //let EmployeePANCardNumber = associateCertficateData['AssociateIntroducer']['AssociateIntroducerEmployee'];


                const findAssociateIdRequest = transaction.request();
                findAssociateIdRequest.input("PANCardNumber", AssociatePANCardNumber);
                const findAssociateIdResult = await findAssociateIdRequest.execute('GetAssociateIdByPanCardNumber');
                var photoIdData;
                if (findAssociateIdResult.recordset.length > 0) {
                    photoIdData = findAssociateIdResult.recordset[0];
                }
                let AssociateId = photoIdData.Id;
                let UserName = photoIdData.PANCardNumber;
                let EntityDate = (photoIdData.DateOfIncorporation != null) ? photoIdData.DateOfIncorporation : photoIdData.DateOfBirth;



                for (let k = 0; k < associateCertficateData['AssociateCertificationType'].length; k++) {
                    const associateCertificationTypeRequest = transaction.request();
                    associateCertificationTypeRequest.input("AssociateId", AssociateId)
                        .input("CertificationType", associateCertficateData['AssociateCertificationType'][k]);
                    const AssociateCertificationTypeResult = await associateCertificationTypeRequest.execute("InsertAssociateImportCertificate");
                }


                for (let l = 0; l < associateCertficateData['AssociateCommercial'].length; l++) {
                    const AssociateCommercialRequest = transaction.request();
                    AssociateCommercialRequest.input("AssociateId", AssociateId)
                        .input("CommercialName", associateCertficateData['AssociateCommercial'][l]['CommercialName'])
                        .input("BPS", associateCertficateData['AssociateCommercial'][l]['BPS'])
                        .input("Percentage", associateCertficateData['AssociateCommercial'][l]['Percentage']);
                    const AssociateCommercialResult = await AssociateCommercialRequest.execute("InsertAssociateCommercialImport");
                }


                for (let m = 0; m < associateCertficateData['AssociateDocument'].length; m++) {
                    let FileName = associateCertficateData['AssociateDocument'][m]['FileName'];
                    if (FileName == undefined) {
                        FileName = '';
                    }
                    if (FileName != '') {
                        var fileTypeData = mime.lookup(FileName);
                        let FileContent = await importDataService.GetDocument(associateCertficateData['AssociateDocument'][m]["FilePath"]);
                        const AssociateDocumentRequest = transaction.request();
                        AssociateDocumentRequest.input("AssociateId", AssociateId)
                            .input("Name", associateCertficateData['AssociateDocument'][m]['Name'])
                            .input("FileName", FileName)
                            .input("FileContent", FileContent)
                            .input("FileContentType", fileTypeData)
                        const AssociateDocumentResult = await AssociateDocumentRequest.execute("InsertImportAssociateDocument");
                    }
                }


                let passwordDate = new Date((new Date(EntityDate)).toISOString().slice(0, -1));
                let newPassword = UserName.toUpperCase().substr(0, 5) + commonFunction.padLeft(passwordDate.getDate().toString(), '0', 2) + commonFunction.padLeft((passwordDate.getMonth() + 1).toString(), '0', 2);
                var Password = cryptoEngine.Encrypt(newPassword, true);
                var PIN = cryptoEngine.Encrypt(commonFunction.GetRandomNumber(6), true);


                if (IntroducerAssociatePan != '') {
                    const findIntroducerAssociateIdRequest = transaction.request();
                    findIntroducerAssociateIdRequest.input("PANCardNumber", IntroducerAssociatePan);
                    const findIntroducerAssociateIdResult = await findIntroducerAssociateIdRequest.execute('GetIntroducerAssociateIdByPanCardNumber');

                    let IntroducerAssociateId = 0;
                    if (findIntroducerAssociateIdResult.recordset.length > 0) {
                        IntroducerAssociateId = findIntroducerAssociateIdResult.recordset[0].Id;
                    }

                    const InsertAssociateIntroducerRequest = transaction.request();
                    InsertAssociateIntroducerRequest.input("AssociateId", AssociateId)
                        .input("IntroducerAssociateId", IntroducerAssociateId)
                    const InsertAssociateIntroducerResult = await InsertAssociateIntroducerRequest.execute("InsertAssociateIntroducer");

                }

                if (BusinessTagAssociatePanNo != '') {
                    const findBusinessAssociateIdRequest = transaction.request();
                    findBusinessAssociateIdRequest.input("PANCardNumber", BusinessTagAssociatePanNo);
                    const findBusinessAssociateIdResult = await findBusinessAssociateIdRequest.execute('GetIntroducerAssociateIdByPanCardNumber');


                    let AssociateBusinessId = 0;
                    if (findBusinessAssociateIdResult.recordset.length > 0) {
                        AssociateBusinessId = findBusinessAssociateIdResult.recordset[0].Id;
                    }


                    const InsertAssociateBusinessTagRequest = transaction.request();
                    InsertAssociateBusinessTagRequest.input("AssociateId", AssociateId)
                        .input("AssociateBusinessId", AssociateBusinessId)
                    const InsertAssociateBusinessTagResult = await InsertAssociateBusinessTagRequest.execute("InsertAssociateBusinessTag");
                }
                //  await transaction.commit();

                // if (EmployeePANCardNumber != '') {
                //     const findEmployeeIdRequest = transaction.request();
                //     findEmployeeIdRequest.input("PANCardNumber", EmployeePANCardNumber);
                //     const findEmployeeIdResult = await findEmployeeIdRequest.execute('GetEmployeeIdByPanCardNumber');


                //     var photoIdData;

                //     if (findEmployeeIdResult.recordset.length > 0) {
                //         photoIdData = findEmployeeIdResult.recordset[0];
                //     }

                //     let EmployeeId = photoIdData.Id;

                //     const InsertAssociateIntroducerEmployeeRequest = transaction.request();
                //     InsertAssociateIntroducerEmployeeRequest.input("AssociateId", AssociateId)
                //         .input("EmployeeId", EmployeeId)
                //     const InsertAssociateIntroducerEmployeeResult = await InsertAssociateIntroducerEmployeeRequest.execute("InsertAssociateIntroducerEmployee");
                // }
                const request = transaction.request();
                request.output("Id", msSql.BigInt)
                    .input("UserName", UserName.toUpperCase())
                    .input("Password", Password)
                    .input("PIN", PIN)
                    .input("IsActive", true)
                    .input("Email", "");
                const result = await request.execute("InsertAppUser");

                Id = result.output.Id

                const insertAppUserAssociateRequest = transaction.request();
                insertAppUserAssociateRequest.input("AppUserId", Id)
                    .input("AssociateId", AssociateId);
                const insertAppUserAssociateResult = await insertAppUserAssociateRequest.execute("InsertAppUserAssociate");

                var LogMessage = "Active";
                const logRequest = transaction.request();
                logRequest.input("AssociateId", AssociateId)
                    .input("AppUserId", Id)
                    .input("LogMessage", LogMessage)
                    .input("IsPrimaryStatus", true)
                    .input("Revision", 0)
                    .input("Indicator", 0);
                const LogResult = await logRequest.execute("InsertAssociateLog");
            }

        }

        await transaction.commit();

        res.status(200).send({ Status: true, Message: "Associate data imported successfully.", Data: associateList });
    }
    catch (err) {
        await transaction.rollback();
        console.log(err);
        res.status(500).send(errorMessage);
    }
}

exports.ImportClient = async (req, res) => {
    var errorMessage = "Error while importing client...";

    try {
        var appUserId = await getSuperUser(req);

        var leads = await importDataService.GetClientList();

        for (let l = 0; l < leads.length; l++) {
            if (leads[l]["Client"]["Id"] == 873) {
                var dataItem = leads[l];

                var leadItem = dataItem["Lead"];
                var clientItem = dataItem["Client"];

                var clientDetailItem = await importDataService.GetClient(clientItem["Id"]);

                // console.log('ClientId: ' + clientItem["Id"]);

                const readAssociateRequest = req.app.locals.db.request();
                readAssociateRequest.input("PANCardNumber", leadItem["AssociatePANCardNumber"]);
                const readAssociateResult = await readAssociateRequest.execute("GetAssociateIdByPanCardNumber");
                if (readAssociateResult.recordset.length > 0) {
                    var associateData = readAssociateResult.recordset[0];
                    var associateId = associateData.Id;
                    var leadId = 0;
                    var clientId = 0;
                    var leadGenderId = await getGender(req, leadItem["GenderName"].trim());
                    var leadCountryId = await getCountry(req, leadItem["CountryName"].trim());
                    var leadStateId = await getState(req, leadItem["StateName"].trim(), leadCountryId);

                    const readLeadRequest = req.app.locals.db.request();
                    readLeadRequest.input("AssociateId", associateId)
                        .input("FirstName", leadItem["FirstName"])
                        .input("LastName", leadItem["LastName"])
                        .input("MobileNumber", leadItem["MobileNumber"])
                        .input("LeadDate", leadItem["LeadDate"]);
                    const readLeadResult = await readLeadRequest.execute("GetExistingImportedLead");
                    if (readLeadResult.recordset.length > 0) {
                        var existingLeadData = readLeadResult.recordset[0];
                        leadId = existingLeadData.Id;
                    }

                    const transaction = req.app.locals.db.transaction();

                    //Lead
                    if (associateId != 0 && leadGenderId != 0 && leadCountryId != 0 && leadStateId != 0) {
                        try {
                            await transaction.begin();
                            if (leadId == 0) {
                                const request = transaction.request();
                                request.output("Id", msSql.BigInt)
                                    .input("LeadDate", leadItem["LeadDate"])
                                    .input("AssociateId", associateId)
                                    .input("FirstName", leadItem["FirstName"])
                                    .input("LastName", leadItem["LastName"])
                                    .input("GenderId", leadGenderId)
                                    .input("MobileNumber", leadItem["MobileNumber"])
                                    .input("Email", (leadItem["Email"] == null) ? "" : leadItem["Email"])
                                    .input("CountryId", leadCountryId)
                                    .input("Address1", leadItem["Address1"])
                                    .input("Address2", leadItem["Address2"])
                                    .input("Address3", leadItem["Address3"])
                                    .input("City", leadItem["City"])
                                    .input("StateId", leadStateId)
                                    .input("PinCode", leadItem["PinCode"]);

                                const result = await request.execute("InsertLead");
                                leadId = result.output.Id;
                            }
                            else {
                                const request = transaction.request();
                                request.input("Id", leadId)
                                    .input("AssociateId", associateId)
                                    .input("FirstName", leadItem["FirstName"])
                                    .input("LastName", leadItem["LastName"])
                                    .input("GenderId", leadGenderId)
                                    .input("MobileNumber", leadItem["MobileNumber"])
                                    .input("Email", (leadItem["Email"] == null) ? "" : leadItem["Email"])
                                    .input("CountryId", leadCountryId)
                                    .input("Address1", leadItem["Address1"])
                                    .input("Address2", leadItem["Address2"])
                                    .input("Address3", leadItem["Address3"])
                                    .input("City", leadItem["City"])
                                    .input("StateId", leadStateId)
                                    .input("PinCode", leadItem["PinCode"]);
                                const result = await request.execute("UpdateLead");
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
                            return;
                        }
                    }

                    if (leadId != 0) {
                        clientId = await getClient(req, leadId);

                        //Client
                        try {
                            await transaction.begin();

                            if (clientId == 0) {
                                const request = transaction.request();
                                request.output("Id", msSql.BigInt)
                                    .input("LeadId", leadId)
                                    .input("AssociateId", associateId)
                                    .input("IsIndividual", clientItem["IsIndividual"])
                                    .input("IsNonIndividual", clientItem["IsNonIndividual"])
                                    .input("FamilyName", clientItem["FamilyName"])
                                    .input("CreatedBy", appUserId);
                                const result = await request.execute("InsertClient");
                                clientId = result.output.Id;
                            }
                            else {
                                const request = transaction.request();
                                request.input("Id", clientId)
                                    .input("LeadId", leadId)
                                    .input("AssociateId", associateId)
                                    .input("IsIndividual", clientItem["IsIndividual"])
                                    .input("IsNonIndividual", clientItem["IsNonIndividual"])
                                    .input("FamilyName", clientItem["FamilyName"]);
                                const result = await request.execute("UpdateClient");
                            }

                            const deleteRequest = transaction.request();
                            deleteRequest.input("ClientId", clientId);
                            const deleteResult = await deleteRequest.execute("DeleteClientAssetAllocation");

                            const deleteGuardianRequest = transaction.request();
                            deleteGuardianRequest.input("ClientId", clientId);
                            const deleteGuardianResult = await deleteGuardianRequest.execute("DeleteClientAccountNomineeGuardian");

                            const deleteNomineeRequest = transaction.request();
                            deleteNomineeRequest.input("ClientId", clientId);
                            const deleteNomineeResult = await deleteNomineeRequest.execute("DeleteClientAccountNominee");

                            const deleteBankRequest = transaction.request();
                            deleteBankRequest.input("ClientId", clientId);
                            const deleteBankResult = await deleteBankRequest.execute("DeleteClientAccountBank");

                            const deleteHolderRequest = transaction.request();
                            deleteHolderRequest.input("ClientId", clientId);
                            const deleteHolderResult = await deleteHolderRequest.execute("DeleteClientAccountHolder");

                            const statusRequest = transaction.request();
                            statusRequest.input("Id", clientId)
                                .input("IsAdminVerified", true);
                            const statusResult = await statusRequest.execute("UpdateClientAdminVerifiedStatus");

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

                        //Client Introduction
                        for (let i = 0; i < clientDetailItem["Profiles"].length; i++) {
                            var profileItem = clientDetailItem["Profiles"][i];

                            if (profileItem["ProfileType"] == "F") {
                                var clientFamilyId = await getClientFamily(req, clientId, profileItem["Name"].trim());
                                var relationId = await getRelation(req, profileItem["RelationName"].trim());
                                var taxStatusId = await getTaxStatus(req, profileItem["TaxStatusName"].trim());
                                var taxSlabId = await getTaxSlab(req, profileItem["TaxSlabName"].toString());

                                try {
                                    await transaction.begin();

                                    if (clientFamilyId == 0) {
                                        const memberRequest = transaction.request();
                                        memberRequest.output("Id", msSql.BigInt)
                                            .input("ClientId", clientId)
                                            .input("Name", profileItem["Name"].trim())
                                            .input("DateOfBirth", profileItem["DateOfBirth"])
                                            .input("RelationId", relationId)
                                            .input("TaxStatusId", taxStatusId)
                                            .input("TaxSlabId", taxSlabId)
                                            .input("LifeExpectancy", profileItem["LifeExpectancy"])
                                            .input("FatherName", profileItem["FatherName"]);
                                        const memeberResult = await memberRequest.execute("InsertClientFamily");
                                        clientFamilyId = memeberResult.output.Id;
                                    }
                                    else {
                                        const memberRequest = transaction.request();
                                        memberRequest.input("Id", clientFamilyId)
                                            .input("ClientId", clientId)
                                            .input("Name", profileItem["Name"].trim())
                                            .input("DateOfBirth", profileItem["DateOfBirth"])
                                            .input("RelationId", relationId)
                                            .input("TaxStatusId", taxStatusId)
                                            .input("TaxSlabId", taxSlabId)
                                            .input("LifeExpectancy", profileItem["LifeExpectancy"])
                                            .input("FatherName", profileItem["FatherName"]);
                                        const memeberResult = await memberRequest.execute("UpdateClientFamily");
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
                                    return;
                                }
                            }

                            if (profileItem["ProfileType"] == "C") {
                                var clientCompanyId = await getClientCompany(req, clientId, profileItem["Name"].trim());
                                var taxStatusId = await getTaxStatus(req, profileItem["TaxStatusName"].trim());
                                var taxSlabId = await getTaxSlab(req, profileItem["TaxSlabName"].toString());

                                try {
                                    await transaction.begin();

                                    if (clientCompanyId == 0) {
                                        const companyRequest = transaction.request();
                                        companyRequest.output("Id", msSql.BigInt)
                                            .input("ClientId", clientId)
                                            .input("Name", profileItem["Name"].trim())
                                            .input("DateOfIncorporation", profileItem["DateOfIncorporation"])
                                            .input("TaxStatusId", taxStatusId)
                                            .input("TaxSlabId", taxSlabId);
                                        const companyResult = await companyRequest.execute("InsertClientCompany");
                                        clientCompanyId = companyResult.output.Id;
                                    }
                                    else {
                                        const companyRequest = transaction.request();
                                        companyRequest.input("Id", clientCompanyId)
                                            .input("ClientId", clientId)
                                            .input("Name", profileItem["Name"].trim())
                                            .input("DateOfIncorporation", profileItem["DateOfIncorporation"])
                                            .input("TaxStatusId", taxStatusId)
                                            .input("TaxSlabId", taxSlabId);
                                        const companyResult = await companyRequest.execute("UpdateClientCompany");
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
                                    return;
                                }
                            }
                        }

                        for (let i = 0; i < clientDetailItem["Accounts"].length; i++) {
                            if (clientDetailItem["Accounts"][i]["HasNominee"] == true) {
                                var nominieeItem = clientDetailItem["Accounts"][i]["AccountNominees"];
                                var clientFamilyId = await getClientFamily(req, clientId, nominieeItem["ProfileName"].trim());
                                var relationId = await getRelation(req, nominieeItem["RelationName"].trim());
                                var taxStatusId = await getTaxStatus(req, 'INDIVIDUAL');
                                var taxSlabId = await getTaxSlab(req, '0');

                                try {
                                    await transaction.begin();

                                    if (clientFamilyId == 0) {
                                        const memberRequest = transaction.request();
                                        memberRequest.output("Id", msSql.BigInt)
                                            .input("ClientId", clientId)
                                            .input("Name", nominieeItem["ProfileName"].trim())
                                            .input("DateOfBirth", date.format(new Date(), 'YYYY-MM-DD'))
                                            .input("RelationId", relationId)
                                            .input("TaxStatusId", taxStatusId)
                                            .input("TaxSlabId", taxSlabId)
                                            .input("LifeExpectancy", 85)
                                            .input("FatherName", '');
                                        const memeberResult = await memberRequest.execute("InsertClientFamily");
                                        clientFamilyId = memeberResult.output.Id;
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
                                    return;
                                }
                            }
                        }

                        for (let i = 0; i < clientDetailItem["Accounts"].length; i++) {
                            if (clientDetailItem["Accounts"][i]["HasNominee"] == true) {
                                var nominieeItem = clientDetailItem["Accounts"][i]["AccountNominees"];

                                if (nominieeItem["GuardianName"].trim() != '') {
                                    var clientFamilyId = await getClientFamily(req, clientId, nominieeItem["GuardianName"].trim());
                                    var relationId = await getRelation(req, 'Other');
                                    var taxStatusId = await getTaxStatus(req, 'INDIVIDUAL');
                                    var taxSlabId = await getTaxSlab(req, '0');

                                    try {
                                        await transaction.begin();

                                        if (clientFamilyId == 0) {
                                            const memberRequest = transaction.request();
                                            memberRequest.output("Id", msSql.BigInt)
                                                .input("ClientId", clientId)
                                                .input("Name", nominieeItem["GuardianName"].trim())
                                                .input("DateOfBirth", date.format(new Date(), 'YYYY-MM-DD'))
                                                .input("RelationId", relationId)
                                                .input("TaxStatusId", taxStatusId)
                                                .input("TaxSlabId", taxSlabId)
                                                .input("LifeExpectancy", 85)
                                                .input("FatherName", '');
                                            const memeberResult = await memberRequest.execute("InsertClientFamily");
                                            clientFamilyId = memeberResult.output.Id;
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
                                        return;
                                    }
                                }
                            }
                        }

                        //Client Kyc
                        try {
                            await transaction.begin();

                            const memberDeleteRequest = transaction.request();
                            memberDeleteRequest.input("ClientId", clientId);
                            const memberDeleteResult = await memberDeleteRequest.execute("DeleteClientKycFamily");

                            const companyDeleteRequest = transaction.request();
                            companyDeleteRequest.input("ClientId", clientId);
                            const companyDeleteResult = await companyDeleteRequest.execute("DeleteClientKycCompany");

                            for (let i = 0; i < clientDetailItem["Profiles"].length; i++) {
                                var profileItem = clientDetailItem["Profiles"][i];

                                if (profileItem["ProfileType"] == "F" && profileItem["IsKYCProfile"] == true) {
                                    var clientFamilyId = await getClientFamily(req, clientId, profileItem["Name"].trim());
                                    const memberRequest = transaction.request();
                                    memberRequest.output("Id", msSql.BigInt)
                                        .input("ClientId", clientId)
                                        .input("ClientFamilyId", clientFamilyId);
                                    const memeberResult = await memberRequest.execute("InsertClientKycFamily");
                                }

                                if (profileItem["ProfileType"] == "C" && profileItem["IsKYCProfile"] == true) {
                                    var clientCompanyId = await getClientCompany(req, clientId, profileItem["Name"].trim());
                                    const memberRequest = transaction.request();
                                    memberRequest.output("Id", msSql.BigInt)
                                        .input("ClientId", clientId)
                                        .input("ClientCompanyId", clientCompanyId);
                                    const memeberResult = await memberRequest.execute("InsertClientKycCompany");
                                }
                            }

                            const statusRequest = transaction.request();
                            statusRequest.input("Id", clientId)
                                .input("IsKycCompleted", true);
                            const statusResult = await statusRequest.execute("UpdateKycCompletedStatus");

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

                        //Client Kyc Profile
                        for (let i = 0; i < clientDetailItem["Profiles"].length; i++) {
                            var profileItem = clientDetailItem["Profiles"][i];

                            if (profileItem["IsKYCProfile"] == true) {
                                var clientKycProfileId = 0;
                                var clientFamilyId = 0;
                                var clientCompanyId = 0;
                                var kycStatusId = await getKYCStatus(req, profileItem["KycStatusName"]);
                                var occupationId = await getOccupation(req, profileItem["OccupationName"]);
                                var grossAnnualIncomeId = await getGrossAnnualIncome(req, profileItem["GrossAnnualIncomeName"]);
                                var wealthSourceId = await getWealthSource(req, profileItem["WealthSourceName"]);
                                var taxStatusId = await getTaxStatus(req, profileItem["TaxStatusName"]);
                                var genderId = await getGender(req, profileItem["GenderName"]);
                                var mobileSelfDeclarationId = await getSelfDeclaration(req, profileItem["MobileDeclaration"]);
                                var emailSelfDeclarationId = await getSelfDeclaration(req, profileItem["EmailDeclaration"]);

                                if (profileItem["ProfileType"] == "F") {
                                    clientFamilyId = await getClientFamily(req, clientId, profileItem["Name"].trim());
                                    clientKycProfileId = await getClientKycProfileFamily(req, clientFamilyId);
                                }
                                if (profileItem["ProfileType"] == "C") {
                                    clientCompanyId = await getClientCompany(req, clientId, profileItem["Name"].trim());
                                    clientKycProfileId = await getClientKycProfileCompany(req, clientCompanyId);
                                }

                                try {
                                    await transaction.begin();

                                    if (clientKycProfileId == 0) {
                                        const request = transaction.request();
                                        request.output("Id", msSql.BigInt)
                                            .input("ClientId", clientId)
                                            .input("PANCardNumber", profileItem["PANCardNumber"])
                                            .input("CKYCNumber", profileItem["CKYCNumber"])
                                            .input("AadharCardNumber", profileItem["AadharCardNumber"])
                                            .input("CountryCode", profileItem["CountryCode"])
                                            .input("MobileNumber", profileItem["MobileNumber"])
                                            .input("Email", profileItem["Email"])
                                            .input("PlaceOfBirth", profileItem["PlaceOfBirth"])
                                            .input("CountryOfBirth", profileItem["CountryOfBirth"])
                                            .input("EmployerName", profileItem["EmployerName"])
                                            .input("NetWorth", profileItem["NetWorth"])
                                            .input("NetWorthDate", (profileItem["NetWorthDate"] == '') ? null : profileItem["NetWorthDate"])
                                            .input("PlaceOfIncorporation", profileItem["PlaceOfIncorporation"])
                                            .input("CountryOfIncorporation", profileItem["CountryOfIncorporation"])
                                            .input("NatureOfBusiness", profileItem["NatureOfBusiness"])
                                            .input("KycStatusId", kycStatusId)
                                            .input("IsPoliticallyExposed", profileItem["IsPoliticallyExposed"]);
                                        const result = await request.execute("InsertClientKycProfile");
                                        clientKycProfileId = result.output.Id;
                                    }
                                    else {
                                        const request = transaction.request();
                                        request.input("Id", clientKycProfileId)
                                            .input("ClientId", clientId)
                                            .input("PANCardNumber", profileItem["PANCardNumber"])
                                            .input("CKYCNumber", profileItem["CKYCNumber"])
                                            .input("AadharCardNumber", profileItem["AadharCardNumber"])
                                            .input("CountryCode", profileItem["CountryCode"])
                                            .input("MobileNumber", profileItem["MobileNumber"])
                                            .input("Email", profileItem["Email"])
                                            .input("PlaceOfBirth", profileItem["PlaceOfBirth"])
                                            .input("CountryOfBirth", profileItem["CountryOfBirth"])
                                            .input("EmployerName", profileItem["EmployerName"])
                                            .input("NetWorth", profileItem["NetWorth"])
                                            .input("NetWorthDate", (profileItem["NetWorthDate"] == '') ? null : profileItem["NetWorthDate"])
                                            .input("PlaceOfIncorporation", profileItem["PlaceOfIncorporation"])
                                            .input("CountryOfIncorporation", profileItem["CountryOfIncorporation"])
                                            .input("NatureOfBusiness", profileItem["NatureOfBusiness"])
                                            .input("KycStatusId", kycStatusId)
                                            .input("IsPoliticallyExposed", profileItem["IsPoliticallyExposed"]);
                                        const result = await request.execute("UpdateClientKycProfile");
                                    }

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

                                        //need to change import api
                                        // if (cryptoEngine.ParamDecrypt(GuardianId, true) != 0) {
                                        //     const guardianRequest = transaction.request();
                                        //     guardianRequest.input("ClientKycProfileId", cryptoEngine.ParamDecrypt(Id, true))
                                        //         .input("ClientFamilyId", cryptoEngine.ParamDecrypt(GuardianId, true));
                                        //     const guardianResult = await guardianRequest.execute("InsertClientKycProfileGuardian");
                                        // }

                                        const mobileRequest = transaction.request();
                                        mobileRequest.input("ClientKycProfileId", clientKycProfileId)
                                            .input("SelfDeclarationId", mobileSelfDeclarationId);
                                        const mobileResult = await mobileRequest.execute("InsertClientKycProfileMobileDeclaration");

                                        const emailRequest = transaction.request();
                                        emailRequest.input("ClientKycProfileId", clientKycProfileId)
                                            .input("SelfDeclarationId", emailSelfDeclarationId);
                                        const emailResult = await emailRequest.execute("InsertClientKycProfileEmailDeclaration");

                                        const statusRequest = transaction.request();
                                        statusRequest.input("ClientFamilyId", clientFamilyId)
                                            .input("IsProfileCompleted", true);
                                        const statusResult = await statusRequest.execute("UpdateKycFamilyProfileCompletedStatus");
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

                                        const statusRequest = transaction.request();
                                        statusRequest.input("ClientCompanyId", clientCompanyId)
                                            .input("IsProfileCompleted", true);
                                        const statusResult = await statusRequest.execute("UpdateKycCompanyProfileCompletedStatus");
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

                                    for (let i = 0; i < profileItem["Documents"].length; i++) {
                                        let documentItem = profileItem["Documents"][i];
                                        if (documentItem["FileName"] != '') {
                                            let fileContent = await importDataService.GetDocument(documentItem["FilePath"]);

                                            var fileTypeData = mime.lookup(documentItem["FileName"]);
                                            const fileRequest = transaction.request();
                                            fileRequest.input("ClientKycProfileId", clientKycProfileId)
                                                .input("Name", documentItem["Name"])
                                                .input("FileName", documentItem["FileName"])
                                                .input("FileContent", fileContent)
                                                .input("FileContentType", fileTypeData);
                                            if (documentItem["Name"] == "Bank Proof") {
                                                const fileResult = await fileRequest.execute("InsertClientKycProfileBankDocument");
                                            }
                                            else {
                                                const fileResult = await fileRequest.execute("InsertClientKycProfileDocument");
                                            }
                                        }
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
                                    return;
                                }
                            }
                        }

                        //Client Kyc Address
                        for (let i = 0; i < clientDetailItem["Profiles"].length; i++) {
                            var profileItem = clientDetailItem["Profiles"][i];

                            if (profileItem["IsKYCProfile"] == true) {
                                var clientKycProfileId = 0;
                                var clientFamilyId = 0;
                                var clientCompanyId = 0;
                                var localAddressId = 0;
                                var foreignAddressId = 0;

                                if (profileItem["ProfileType"] == "F") {
                                    clientFamilyId = await getClientFamily(req, clientId, profileItem["Name"].trim());
                                    clientKycProfileId = await getClientKycProfileFamily(req, clientFamilyId);

                                    var addressData = await getClientKycAddressFamily(req, clientFamilyId);

                                    localAddressId = addressData.LocalAddressId;
                                    foreignAddressId = addressData.ForeignAddressId;
                                }
                                if (profileItem["ProfileType"] == "C") {
                                    clientCompanyId = await getClientCompany(req, clientId, profileItem["Name"].trim());
                                    clientKycProfileId = await getClientKycProfileCompany(req, clientCompanyId);

                                    var addressData = await getClientKycAddressCompany(req, clientCompanyId);

                                    localAddressId = addressData.LocalAddressId;
                                    foreignAddressId = addressData.ForeignAddressId;
                                }

                                try {
                                    await transaction.begin();

                                    var localAddressItem = profileItem["LocalAddress"];
                                    var foreignAddressItem = profileItem["ForeignAddress"];

                                    if (localAddressItem["AddressTypeName"] != '') {
                                        var addressTypeId = await getAddressType(req, localAddressItem["AddressTypeName"]);
                                        var countryId = await getCountry(req, localAddressItem["CountryName"]);
                                        var stateId = await getState(req, localAddressItem["StateName"], countryId);

                                        if (localAddressId == 0) {
                                            const request = transaction.request();
                                            request.output("Id", msSql.BigInt)
                                                .input("ClientKycProfileId", clientKycProfileId)
                                                .input("AddressTypeId", addressTypeId)
                                                .input("Address1", localAddressItem["Address1"])
                                                .input("Address2", localAddressItem["Address2"])
                                                .input("Address3", localAddressItem["Address3"])
                                                .input("City", localAddressItem["City"])
                                                .input("CountryId", countryId)
                                                .input("StateId", stateId)
                                                .input("PinCode", localAddressItem["PinCode"])
                                                .input("IsSameForAll", localAddressItem["IsSameForAll"])
                                                .input("UseGuardianAddress", localAddressItem["UseGuardianAddress"]);
                                            const result = await request.execute("InsertClientKycLocalAddress");
                                            localAddressId = result.output.Id;
                                        }
                                        else {
                                            const request = transaction.request();
                                            request.input("Id", localAddressId)
                                                .input("ClientKycProfileId", clientKycProfileId)
                                                .input("AddressTypeId", addressTypeId)
                                                .input("Address1", localAddressItem["Address1"])
                                                .input("Address2", localAddressItem["Address2"])
                                                .input("Address3", localAddressItem["Address3"])
                                                .input("City", localAddressItem["City"])
                                                .input("CountryId", countryId)
                                                .input("StateId", stateId)
                                                .input("PinCode", localAddressItem["PinCode"])
                                                .input("IsSameForAll", localAddressItem["IsSameForAll"])
                                                .input("UseGuardianAddress", localAddressItem["UseGuardianAddress"]);
                                            const result = await request.execute("UpdateClientKycLocalAddress");
                                        }
                                    }

                                    if (foreignAddressItem["AddressTypeName"] != '') {
                                        var addressTypeId = await getAddressType(req, foreignAddressItem["AddressTypeName"]);
                                        var countryId = await getCountry(req, foreignAddressItem["CountryName"]);
                                        var stateId = await getState(req, foreignAddressItem["StateName"], countryId);

                                        if (foreignAddressId == 0) {
                                            const request = transaction.request();
                                            request.output("Id", msSql.BigInt)
                                                .input("ClientKycProfileId", clientKycProfileId)
                                                .input("AddressTypeId", addressTypeId)
                                                .input("Address1", foreignAddressItem["Address1"])
                                                .input("Address2", foreignAddressItem["Address2"])
                                                .input("Address3", foreignAddressItem["Address3"])
                                                .input("City", foreignAddressItem["City"])
                                                .input("CountryId", countryId)
                                                .input("StateId", stateId)
                                                .input("PinCode", foreignAddressItem["PinCode"])
                                                .input("IsSameForAll", foreignAddressItem["IsSameForAll"])
                                                .input("UseGuardianAddress", foreignAddressItem["UseGuardianAddress"]);
                                            const result = await request.execute("InsertClientKycForeignAddress");
                                            foreignAddressId = result.output.Id;
                                        }
                                        else {
                                            const request = transaction.request();
                                            request.input("Id", foreignAddressId)
                                                .input("ClientKycProfileId", clientKycProfileId)
                                                .input("AddressTypeId", addressTypeId)
                                                .input("Address1", foreignAddressItem["Address1"])
                                                .input("Address2", foreignAddressItem["Address2"])
                                                .input("Address3", foreignAddressItem["Address3"])
                                                .input("City", foreignAddressItem["City"])
                                                .input("CountryId", countryId)
                                                .input("StateId", stateId)
                                                .input("PinCode", foreignAddressItem["PinCode"])
                                                .input("IsSameForAll", foreignAddressItem["IsSameForAll"])
                                                .input("UseGuardianAddress", foreignAddressItem["UseGuardianAddress"]);
                                            const result = await request.execute("UpdateClientKycForeignAddress");
                                        }
                                    }

                                    const statusRequest = transaction.request();
                                    statusRequest.input("ClientKycProfileId", clientKycProfileId)
                                        .input("IsCommunicationCompleted", true);
                                    const statusResult = await statusRequest.execute("UpdateKycCommunicationCompletedStatus");

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
                        }

                        //Client Kyc Bank
                        for (let i = 0; i < clientDetailItem["Profiles"].length; i++) {
                            var profileItem = clientDetailItem["Profiles"][i];

                            if (profileItem["IsKYCProfile"] == true) {
                                var clientKycProfileId = 0;
                                var clientFamilyId = 0;
                                var clientCompanyId = 0;

                                if (profileItem["ProfileType"] == "F") {
                                    clientFamilyId = await getClientFamily(req, clientId, profileItem["Name"].trim());
                                    clientKycProfileId = await getClientKycProfileFamily(req, clientFamilyId);
                                }
                                if (profileItem["ProfileType"] == "C") {
                                    clientCompanyId = await getClientCompany(req, clientId, profileItem["Name"].trim());
                                    clientKycProfileId = await getClientKycProfileCompany(req, clientCompanyId);
                                }

                                for (let j = 0; j < profileItem["Banks"].length; j++) {
                                    var bankItem = profileItem["Banks"][j];

                                    var bankAccountTypeId = await getBankAccountType(req, bankItem["BankAccountTypeName"]);
                                    var bankId = await getClientKycBank(req, clientKycProfileId, bankAccountTypeId, bankItem["AccountNumber"]);

                                    try {
                                        await transaction.begin();

                                        if (bankId == 0) {
                                            const request = transaction.request();
                                            request.output("Id", msSql.BigInt)
                                                .input("ClientKycProfileId", clientKycProfileId)
                                                .input("IFSC", bankItem["IFSC"].toUpperCase())
                                                .input("BankName", bankItem["BankName"])
                                                .input("BankBranch", bankItem["BankBranch"])
                                                .input("MICR", bankItem["MICR"])
                                                .input("BankAccountTypeId", bankAccountTypeId)
                                                .input("AccountNumber", bankItem["AccountNumber"])
                                                .input("UPIId", bankItem["UPIId"])
                                                .input("FileTag", bankItem["FileTag"])
                                                .input("IsActive", bankItem["IsActive"]);
                                            const result = await request.execute("InsertClientKycBank");
                                            bankId = result.output.Id;
                                        }
                                        else {
                                            const request = transaction.request();
                                            request.input("Id", bankId)
                                                .input("ClientKycProfileId", clientKycProfileId)
                                                .input("IFSC", bankItem["IFSC"].toUpperCase())
                                                .input("BankName", bankItem["BankName"])
                                                .input("BankBranch", bankItem["BankBranch"])
                                                .input("MICR", bankItem["MICR"])
                                                .input("BankAccountTypeId", bankAccountTypeId)
                                                .input("AccountNumber", bankItem["AccountNumber"])
                                                .input("UPIId", bankItem["UPIId"])
                                                .input("FileTag", bankItem["FileTag"])
                                                .input("IsActive", bankItem["IsActive"]);
                                            const result = await request.execute("UpdateClientKycBank");
                                        }

                                        const statusRequest = transaction.request();
                                        statusRequest.input("ClientKycProfileId", clientKycProfileId)
                                            .input("IsBankCompleted", true);
                                        const statusResult = await statusRequest.execute("UpdateKycBankCompletedStatus");

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
                            }
                        }

                        //Client Asset Allocation
                        for (let i = 0; i < clientDetailItem["Profiles"].length; i++) {
                            var profileItem = clientDetailItem["Profiles"][i];

                            if (profileItem["IsKYCProfile"] == true) {
                                var clientFamilyId = 0;
                                var clientCompanyId = 0;

                                var assetAllocationItem = profileItem["AssetAllocation"];

                                if (profileItem["ProfileType"] == "F") {
                                    clientFamilyId = await getClientFamily(req, clientId, profileItem["Name"].trim());
                                }
                                if (profileItem["ProfileType"] == "C") {
                                    clientCompanyId = await getClientCompany(req, clientId, profileItem["Name"].trim());
                                }

                                try {
                                    await transaction.begin();

                                    if (clientFamilyId != 0) {
                                        const request = transaction.request();
                                        request.input("ClientId", clientId)
                                            .input("ClientFamilyId", clientFamilyId)
                                            .input("LumpsumEquity", assetAllocationItem["LumpsumEquity"])
                                            .input("LumpsumDebt", assetAllocationItem["LumpsumDebt"])
                                            .input("SipEquity", assetAllocationItem["SipEquity"])
                                            .input("SipDebt", assetAllocationItem["SipDebt"]);
                                        const result = await request.execute("InsertClientFamilyAssetAllocation");
                                    }

                                    if (clientCompanyId != 0) {
                                        const request = transaction.request();
                                        request.input("ClientId", clientId)
                                            .input("ClientCompanyId", clientCompanyId)
                                            .input("LumpsumEquity", assetAllocationItem["LumpsumEquity"])
                                            .input("LumpsumDebt", assetAllocationItem["LumpsumDebt"])
                                            .input("SipEquity", assetAllocationItem["SipEquity"])
                                            .input("SipDebt", assetAllocationItem["SipDebt"]);
                                        const result = await request.execute("InsertClientCompanyAssetAllocation");
                                    }

                                    const statusRequest = transaction.request();
                                    statusRequest.input("Id", clientId)
                                        .input("IsAssetAllocationCompleted", true);
                                    const statusResult = await statusRequest.execute("UpdateAssetAllocationCompletedStatus");

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
                        }

                        //Client Accounts
                        for (let i = 0; i < clientDetailItem["Accounts"].length; i++) {
                            var accountItem = clientDetailItem["Accounts"][i];
                            var accountHolders = accountItem["AccountHolders"];
                            var accountNominee = accountItem["AccountNominees"];
                            var accountBanks = accountItem["AccountBanks"];
                            var accountMandates = accountItem["AccountMandates"];
                            var accountDocuments = accountItem["AccountDocuments"];

                            var clientAccountId = await getClientAccount(accountItem["UCC"]);
                            var accountTypeId = await getAccountType(req, accountItem["AccountTypeName"]);
                            var firstHolderId = 0;
                            var secondHolderId = 0;
                            var thirdHolderId = 0;
                            var nomineeProfileId = await getClientFamily(req, clientId, accountNominee["ProfileName"].trim());
                            var nomineeGuardianId = 0;
                            if (accountNominee["GuardianName"] != '') {
                                nomineeGuardianId = await getClientFamily(req, clientId, accountNominee["GuardianName"].trim());
                            }
                            var nomineeRelationId = await getRelation(req, accountNominee["RelationName"]);

                            for (let j = 0; j < accountHolders.length; j++) {
                                if (accountHolders[j]["SerialNumber"] == 1 && accountHolders[j]["ProfileName"] != '') {
                                    var clientFamilyId = await getClientFamily(req, clientId, accountHolders[j]["ProfileName"].trim());
                                    var clientCompanyId = await getClientCompany(req, clientId, accountHolders[j]["ProfileName"].trim());

                                    if (clientFamilyId != 0) {
                                        firstHolderId = await getClientKycProfileFamily(req, clientFamilyId);
                                    }
                                    if (clientCompanyId != 0) {
                                        firstHolderId = await getClientKycProfileCompany(req, clientCompanyId);
                                    }
                                }
                                if (accountHolders[j]["SerialNumber"] == 2 && accountHolders[j]["ProfileName"] != '') {
                                    var clientFamilyId = await getClientFamily(req, clientId, accountHolders[j]["ProfileName"].trim());
                                    var clientCompanyId = await getClientCompany(req, clientId, accountHolders[j]["ProfileName"].trim());

                                    if (clientFamilyId != 0) {
                                        secondHolderId = await getClientKycProfileFamily(req, clientFamilyId);
                                    }
                                    if (clientCompanyId != 0) {
                                        secondHolderId = await getClientKycProfileCompany(req, clientCompanyId);
                                    }
                                }
                                if (accountHolders[j]["SerialNumber"] == 3 && accountHolders[j]["ProfileName"] != '') {
                                    var clientFamilyId = await getClientFamily(req, clientId, accountHolders[j]["ProfileName"].trim());
                                    var clientCompanyId = await getClientCompany(req, clientId, accountHolders[j]["ProfileName"].trim());

                                    if (clientFamilyId != 0) {
                                        thirdHolderId = await getClientKycProfileFamily(req, clientFamilyId);
                                    }
                                    if (clientCompanyId != 0) {
                                        thirdHolderId = await getClientKycProfileCompany(req, clientCompanyId);
                                    }
                                }
                            }

                            try {
                                await transaction.begin();

                                if (clientAccountId == 0) {
                                    const request = transaction.request();
                                    request.output("Id", msSql.BigInt)
                                        .input("ClientId", clientId)
                                        .input("AccountTypeId", accountTypeId)
                                        .input("UCCSerialNumber", accountItem["UCCSerialNumber"])
                                        .input("UCC", accountItem["UCC"])
                                        .input("HasNominee", accountItem["HasNominee"])
                                        .input("CreateBSEAccount", accountItem["CreateBSEAccount"])
                                        .input("IsSelfVerified", accountItem["IsSelfVerified"])
                                        .input("SelfVerifiedDate", accountItem["SelfVerifiedDate"])
                                        .input("IsAccountCreatedAtBSE", accountItem["IsAccountCreatedAtBSE"])
                                        .input("BSEAccountCreatedDate", accountItem["BSEAccountCreatedDate"])
                                        .input("ISAOFFileUploadedToBSE", accountItem["ISAOFFileUploadedToBSE"])
                                        .input("BSEAOFFileUploadedDate", accountItem["BSEAOFFileUploadedDate"]);
                                    const result = await request.execute("InsertClientAccountImport");
                                    clientAccountId = result.output.Id;
                                }
                                else {
                                    const request = transaction.request();
                                    request.input("Id", clientAccountId)
                                        .input("ClientId", clientId)
                                        .input("AccountTypeId", accountTypeId)
                                        .input("UCCSerialNumber", accountItem["UCCSerialNumber"])
                                        .input("UCC", accountItem["UCC"])
                                        .input("HasNominee", accountItem["HasNominee"])
                                        .input("CreateBSEAccount", accountItem["CreateBSEAccount"])
                                        .input("IsSelfVerified", accountItem["IsSelfVerified"])
                                        .input("SelfVerifiedDate", accountItem["SelfVerifiedDate"])
                                        .input("IsAccountCreatedAtBSE", accountItem["IsAccountCreatedAtBSE"])
                                        .input("BSEAccountCreatedDate", accountItem["BSEAccountCreatedDate"])
                                        .input("ISAOFFileUploadedToBSE", accountItem["ISAOFFileUploadedToBSE"])
                                        .input("BSEAOFFileUploadedDate", accountItem["BSEAOFFileUploadedDate"]);
                                    const result = await request.execute("UpdateClientAccountImport");
                                }

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

                                if (accountItem["HasNominee"] == true) {
                                    if (nomineeProfileId != 0) {
                                        const request = transaction.request();
                                        request.output("Id", msSql.BigInt)
                                            .input("ClientAccountId", clientAccountId)
                                            .input("ClientFamilyId", nomineeProfileId)
                                            .input("RelationId", nomineeRelationId)
                                            .input("Shares", accountNominee["Shares"]);
                                        const result = await request.execute("InsertClientAccountNominee");
                                        let nomineeId = result.output.Id;

                                        if (nomineeGuardianId != 0) {
                                            const requestGuardian = transaction.request();
                                            requestGuardian.input("ClientAccountNomineeId", nomineeId)
                                                .input("ClientFamilyId", nomineeGuardianId);
                                            const resultGuardian = await requestGuardian.execute("InsertClientAccountNomineeGuardian");
                                        }
                                    }
                                }

                                for (let b = 0; b < accountBanks.length; b++) {
                                    var clientKycBankId = await getClientAccountBank(req, clientId, accountBanks[b]["ProfileBankAccountNumber"]);
                                    const request = transaction.request();
                                    request.input("ClientAccountId", clientAccountId)
                                        .input("ClientKycBankId", clientKycBankId)
                                        .input("IsDefault", accountBanks[b]["IsDefault"]);
                                    const result = await request.execute("InsertClientAccountBank");
                                }

                                const statusRequest = transaction.request();
                                statusRequest.input("Id", clientId)
                                    .input("IsAccountCompleted", true);
                                const statusResult = await statusRequest.execute("UpdateAccountCompletedStatus");

                                const request = transaction.request();
                                request.input("Id", clientAccountId)
                                    .input("IsSelfVerified", true);
                                const result = await request.execute("UpdateClientAccountSelfVerifiedStatus");

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

                            if (clientAccountId != 0) {
                                for (let m = 0; m < accountMandates.length; m++) {
                                    var mandateItem = accountMandates[m];

                                    var mandateId = await getClientAccountMandate(req, mandateItem["BSEMandateId"]);
                                    var clientKycBankId = await getClientAccountBank(req, clientId, mandateItem["ProfileBankAccountNumber"]);
                                    var mandateTypeId = await getMandateType(req, mandateItem["MandateTypeName"]);

                                    try {
                                        await transaction.begin();

                                        if (mandateId == 0) {
                                            const request = transaction.request();
                                            request.input("ClientAccountId", clientAccountId)
                                                .input("ClientKycBankId", clientKycBankId)
                                                .input("Amount", mandateItem["Amount"])
                                                .input("MandateTypeId", mandateTypeId)
                                                .input("Status", mandateItem["Status"])
                                                .input("BSEMandateId", mandateItem["BSEMandateId"])
                                                .input("StartDate", mandateItem["StartDate"])
                                                .input("EndDate", mandateItem["EndDate"])
                                                .input("IsMandateCreatedAtBSE", mandateItem["IsMandateCreatedAtBSE"])
                                                .input("BSEMandateCreatedDate", mandateItem["BSEMandateCreatedDate"])
                                                .input("IsMandateScanUploadedToBSE", mandateItem["IsMandateScanUploadedToBSE"])
                                                .input("BSEMandateScanUploadedDate", mandateItem["BSEMandateScanUploadedDate"]);
                                            const result = await request.execute("InsertClientAccountMandateImport");
                                        }
                                        else {
                                            const request = transaction.request();
                                            request.input("Id", mandateId)
                                                .input("ClientAccountId", clientAccountId)
                                                .input("ClientKycBankId", clientKycBankId)
                                                .input("Amount", mandateItem["Amount"])
                                                .input("MandateTypeId", mandateTypeId)
                                                .input("Status", mandateItem["Status"])
                                                .input("BSEMandateId", mandateItem["BSEMandateId"])
                                                .input("StartDate", mandateItem["StartDate"])
                                                .input("EndDate", mandateItem["EndDate"])
                                                .input("IsMandateCreatedAtBSE", mandateItem["IsMandateCreatedAtBSE"])
                                                .input("BSEMandateCreatedDate", mandateItem["BSEMandateCreatedDate"])
                                                .input("IsMandateScanUploadedToBSE", mandateItem["IsMandateScanUploadedToBSE"])
                                                .input("BSEMandateScanUploadedDate", mandateItem["BSEMandateScanUploadedDate"]);
                                            const result = await request.execute("UpdateClientAccountMandateImport");
                                        }

                                        const statusRequest = transaction.request();
                                        statusRequest.input("Id", clientId)
                                            .input("IsMandateCompleted", true);
                                        const statusResult = await statusRequest.execute("UpdateMandateCompletedStatus");

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

                                for (let d = 0; d < accountDocuments.length; d++) {
                                    var accountDocumentItem = accountDocuments[d];
                                    var clientAccountMandateId = 0;

                                    if (accountDocumentItem["Name"] == 'Mandate' || accountDocumentItem["Name"] == 'Mandate Scan' || accountDocumentItem["Name"] == 'Mandate Image') {
                                        clientAccountMandateId = await getClientAccountMandate(req, accountDocumentItem["BSEMandateId"]);
                                    }

                                    if (accountDocumentItem["FileName"] != '') {
                                        try {
                                            await transaction.begin();

                                            var fileTypeData = mime.lookup(accountDocumentItem["FileName"]);
                                            let FileContent = await importDataService.GetDocument(accountDocumentItem["FilePath"]);

                                            const fileRequest = transaction.request();
                                            fileRequest.input("ClientAccountId", clientAccountId)
                                                .input("ClientAccountMandateId", clientAccountMandateId)
                                                .input("Name", accountDocumentItem["Name"])
                                                .input("FileName", accountDocumentItem["FileName"])
                                                .input("FileContent", FileContent)
                                                .input("FileContentType", fileTypeData)
                                                .input("DocumentType", accountDocumentItem["DocumentType"]);
                                            const fileResult = await fileRequest.execute("InsertClientAccountDocument");

                                            const statusRequest1 = transaction.request();
                                            statusRequest1.input("Id", clientId)
                                                .input("AccountStatus", true);
                                            const statusResult1 = await statusRequest1.execute("UpdateClientAccountStatus");

                                            const statusRequest2 = transaction.request();
                                            statusRequest2.input("Id", clientId)
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
                                            return;
                                        }
                                    }
                                }
                            }
                        }

                        //Client Users
                        const readUserRequest = req.app.locals.db.request();
                        readUserRequest.input("ClientId", clientId);
                        const readUserResult = await readUserRequest.execute("GetClientAccountFirstHolder");
                        if (readUserResult.recordset.length > 0) {
                            var accountHolderList = readUserResult.recordset;
                            for (let i = 0; i < accountHolderList.length; i++) {
                                let AppUserId = await appUserController.CreateAppUser(req, res, '414E2B5048745659672B513D', accountHolderList[i].PANCardNumber, accountHolderList[i].DateOfBirth, '414E2B5048745659672B513D', '414E2B5048745659672B513D', cryptoEngine.ParamEncrypt(clientId, true), cryptoEngine.ParamEncrypt(accountHolderList[i].Id, true));
                            }
                        }
                    }
                }
            }
        }

        res.status(200).send({ Status: true, Message: "Client imported successfully.", Data: { LeadCount: leads.length } });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.ImportState = async (req, res) => {
    var errorMessage = "Error while importing state...";

    try {
        var states = await importDataService.GetStateList();

        for (let i = 0; i < states.length; i++) {
            var dataItem = states[i];

            var countryId = await getCountry(req, dataItem["CountryName"]);
            var stateId = await getState(req, dataItem["StateName"], countryId);

            const transaction = req.app.locals.db.transaction();

            try {
                await transaction.begin();

                if (stateId == 0) {
                    const request = transaction.request();

                    request.output("Id", msSql.BigInt)
                        .input("CountryId", countryId)
                        .input("Name", dataItem["StateName"])
                        .input("Code", dataItem["BSEStateCode"])
                        .input("MFUCode", '');

                    const result = await request.execute("InsertState");
                    stateId = result.output.Id;
                }
                else {
                    const request = transaction.request();
                    request.input("Id", stateId)
                        .input("CountryId", countryId)
                        .input("Name", dataItem["StateName"])
                        .input("Code", dataItem["BSEStateCode"])
                        .input("MFUCode", '');
                    const result = await request.execute("UpdateState");
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
                return;
            }
        }

        res.status(200).send({ Status: true, Message: "State imported successfully.", Data: { StateCount: states.length } });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.ImportBank = async (req, res) => {
    var errorMessage = "Error while importing bank...";

    try {
        var totalBanks = 170000;
        var recordCount = 10000;
        var multipleOf = totalBanks / recordCount;
        var bankCount = 0;

        for (let i = 0; i < multipleOf; i++) {
            var from = (i == 0) ? 0 : (i * recordCount);
            var to = recordCount;

            // console.log('Log Date: ' + new Date() + 'From: ' + from + ' To: ' + to);

            var banks = await importDataService.GetBankList(from, to);

            // console.log('Log Date: ' + new Date() + 'From: ' + from + ' To: ' + to + ' Records: ' + banks.length);

            bankCount += banks.length;

            for (let j = 0; j < banks.length; j++) {
                var dataItem = banks[j];

                const transaction = req.app.locals.db.transaction();

                try {
                    await transaction.begin();

                    const request = transaction.request();
                    request.input("Name", dataItem["name"])
                        .input("IFSC", dataItem["ifsc"])
                        .input("MICRCode", dataItem["micr_code"])
                        .input("Branch", dataItem["branch"])
                        .input("Address", dataItem["address"])
                        .input("Contact", dataItem["contact"])
                        .input("City", dataItem["city"])
                        .input("District", dataItem["district"])
                        .input("State", dataItem["state"])
                        .input("BSEMode", dataItem["bse_mode"])
                        .input("BSECode", dataItem["bse_code"])
                        .input("RBIId", '')
                        .input("IsCooperative", false);
                    const result = await request.execute("ImportBank");

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

            // console.log('Log Date: ' + new Date() + 'From: ' + from + ' To: ' + to + ' Records: ' + banks.length + ' updated');
        }

        res.status(200).send({ Status: true, Message: "Banks imported successfully.", Data: { BankCount: bankCount } });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.ImportTransactionUnitLedger = async (req, res) => {
    var errorMessage = 'Error while importing transaction unit ledger...';
    try {
        var dataCount = 0;
        var missingRecords = [];

        var dataList = await importDataService.GetTransactionUnitLedgerList();
        dataCount = dataList.length;

        for (let i = 0; i < dataCount; i++) {
            // console.log('id: ' + dataList[i]["id"]);
            var dataItem = await importDataService.GetTransactionUnitLedgerData(dataList[i]["id"]);

            var clientAccountId = await getClientAccount(dataItem["ucc"]);
            var bseScheme = await getBseSchemeByIsin(dataItem["kbs_schemes_isin"]);

            if (clientAccountId != 0 && bseScheme != null) {
                const transaction = req.app.locals.db.transaction();

                try {
                    await transaction.begin();

                    const request = transaction.request();
                    request.input("ClientAccountId", clientAccountId)
                        .input("TransactionType", dataItem["trans_type"])
                        .input("TransactionDate", dataItem["trans_date"])
                        .input("BSEOrderId", dataItem["bse_order_id"])
                        .input("OrderDate", dataItem["order_date"])
                        .input("BSESchemeId", bseScheme.Id)
                        .input("FolioNumber", dataItem["folio_number"])
                        .input("Units", dataItem["units"])
                        .input("NAV", dataItem["nav"])
                        .input("Amount", dataItem["amount"])
                        .input("BalanceUnits", dataItem["balance_units"])
                        .input("ProvisionalUnits", dataItem["provisional_units"])
                        .input("ProvisionalNAV", dataItem["provisional_nav"])
                        .input("ProvisionalAmount", dataItem["provisional_amount"])
                        .input("ProvisionalBalanceUnits", dataItem["provisional_balance_units"])
                        .input("ProvisionalBalanceAmount", dataItem["provisional_balance_amount"])
                        .input("HoldingBalanceUnits", dataItem["holding_balance_units"])
                        .input("HoldingBalanceAmount", dataItem["holding_balance_amount"])
                        .input("TotalBalanceUnits", dataItem["holding_balance_units"])
                        .input("TotalBalanceAmount", dataItem["holding_balance_amount"])
                        .input("TradeType", dataItem["trade_type"]);
                    const result = await request.execute("ImportClientTransactionUnitLedger");

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
            else {
                // console.log('Cannot found record: ' + JSON.stringify(dataItem));

                missingRecords.push(dataItem);
            }
        }

        res.status(200).send({ Status: true, Message: "Transaction unit ledger imported successfully.", Data: { DataCount: dataCount, MissingRecords: missingRecords } });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.ImportDateWiseTransactionUnitLedger = async (req, res) => {
    var errorMessage = 'Error while importing transaction unit ledger...';
    try {
        var missingRecords = [];

        var startDate = new Date(2025, 2, 1, 0, 0, 0, 0);
        var endDate = new Date();

        while (startDate <= endDate) {
            var dataCount = 0;
            var dataPList = await importDataService.GetDateWiseTransactionUnitLedgerData(date.format(startDate, 'YYYY-MM-DD'), 'P');
            var dataRList = await importDataService.GetDateWiseTransactionUnitLedgerData(date.format(startDate, 'YYYY-MM-DD'), 'R');

            var dataList = dataPList.concat(dataRList);
            dataCount = dataList.length;

            for (let i = 0; i < dataCount; i++) {
                dataItem = dataList[i];
                var clientAccountId = await getClientAccount(dataItem["ucc"]);
                var bseScheme = await getBseSchemeByIsin(dataItem["isin"]);

                if (clientAccountId != 0 && bseScheme != null) {
                    const transaction = req.app.locals.db.transaction();

                    try {
                        await transaction.begin();

                        const request = transaction.request();
                        request.input("ClientAccountId", clientAccountId)
                            .input("TransactionType", dataItem["trans_type"])
                            .input("TransactionDate", dataItem["trans_date"])
                            .input("BSEOrderId", dataItem["bse_order_id"])
                            .input("OrderDate", dataItem["order_date"])
                            .input("BSESchemeId", bseScheme.Id)
                            .input("FolioNumber", dataItem["folio_number"])
                            .input("Units", dataItem["units"])
                            .input("NAV", dataItem["nav"])
                            .input("Amount", dataItem["amount"])
                            .input("BalanceUnits", dataItem["balance_units"])
                            .input("ProvisionalUnits", dataItem["provisional_units"])
                            .input("ProvisionalNAV", dataItem["provisional_nav"])
                            .input("ProvisionalAmount", dataItem["provisional_amount"])
                            .input("ProvisionalBalanceUnits", dataItem["provisional_balance_units"])
                            .input("ProvisionalBalanceAmount", dataItem["provisional_balance_amount"])
                            .input("HoldingBalanceUnits", dataItem["holding_balance_units"])
                            .input("HoldingBalanceAmount", dataItem["holding_balance_amount"])
                            .input("TotalBalanceUnits", dataItem["holding_balance_units"])
                            .input("TotalBalanceAmount", dataItem["holding_balance_amount"])
                            .input("TradeType", dataItem["trade_type"]);
                        const result = await request.execute("ImportClientTransactionUnitLedger");

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
                else {
                    // console.log('Cannot found record: ' + JSON.stringify(dataItem));

                    missingRecords.push(dataItem);
                }
            }

            startDate.setDate(startDate.getDate() + 1);
        }

        res.status(200).send({ Status: true, Message: "Transaction unit ledger imported successfully.", Data: { MissingRecords: missingRecords } });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.ImportBSESchemeAmfi = async (req, res) => {
    const errorMessage = 'Error while uploading...';

    try {
        var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'uploads', 'amfi_scheme_codes.xlsx');
        const workBook = xlsx.readFile(dataFilePath);
        const workSheet = workBook.Sheets[workBook.SheetNames[0]];
        const jsonData = xlsx.utils.sheet_to_json(workSheet);

        const transaction = req.app.locals.db.transaction();
        for (const row of jsonData) {
            const amc = row['amc'];
            const code = row['code'];
            const scheme_name = row['scheme_name'];
            const scheme_type = row['scheme_type'];
            const scheme_category = row['scheme_category'];
            const scheme_nav_name = row['scheme_nav_name'];
            const scheme_minimum_amount = row['scheme_minimum_amount'];
            const launch_date = row['launch_date'];
            const closure_date = row['closure_date'];
            const isin = row['isin'];
            const portfolio = row['portfolio'];
            const channel_partner_code = row['channel_partner_code'];
            const purchase_allowed = row['purchase_allowed'];
            const redemption_allowed = row['redemption_allowed'];
            const sip_flag = row['sip_flag'];
            const stp_flag = row['stp_flag'];
            const swp_flag = row['swp_flag'];
            const switch_flag = row['switch_flag'];

            var launchDate = null;
            var closureDate = null;
            var portfolioName = '';
            var portfolioType = '';

            // console.log(launch_date);
            if (launch_date != null && launch_date != undefined && launch_date != '' && launch_date != 'NULL') {
                launchDate = date.format(commonFunction.ExcelDateToJSDate(launch_date), 'YYYY-MM-DD');
            }

            if (closure_date != null && closure_date != undefined && closure_date != '' && closure_date != 'NULL') {
                closureDate = date.format(commonFunction.ExcelDateToJSDate(closure_date), 'YYYY-MM-DD');
            }

            if (portfolio != undefined) {
                var portfolioList = portfolio.split('-');

                portfolioName = portfolioList[0].trim();
                if (portfolioList.length > 1) {
                    portfolioType = portfolioList[1].trim();
                }
            }

            // console.log('Code: ' + code);
            // console.log('ISIN: ' + isin);

            try {
                await transaction.begin();

                const insertRequest = transaction.request();
                insertRequest.input("AMC", (amc == undefined) ? '' : amc)
                    .input("Code", (code == undefined) ? '' : code)
                    .input("SchemeName", (scheme_name == undefined) ? '' : scheme_name)
                    .input("SchemeType", (scheme_type == undefined) ? '' : scheme_type)
                    .input("SchemeCategory", (scheme_category == undefined) ? '' : scheme_category)
                    .input("SchemeNavName", (scheme_nav_name == undefined) ? '' : scheme_nav_name)
                    .input("SchemeMinimumAmount", (scheme_minimum_amount == undefined) ? '' : scheme_minimum_amount)
                    .input("LaunchDate", launchDate)
                    .input("ClosureDate", closureDate)
                    .input("ISIN", (isin == undefined) ? '' : isin)
                    .input("Portfolio", portfolioName)
                    .input("PortfolioType", portfolioType)
                    .input("ChannelPartnerCode", (channel_partner_code == undefined) ? '' : channel_partner_code)
                    .input("PurchaseAllowed", (purchase_allowed == undefined) ? '' : purchase_allowed)
                    .input("RedemptionAllowed", (redemption_allowed == undefined) ? '' : redemption_allowed)
                    .input("SIPFlag", (sip_flag == undefined) ? '' : sip_flag)
                    .input("STPFlag", (stp_flag == undefined) ? '' : stp_flag)
                    .input("SWPFlag", (swp_flag == undefined) ? '' : swp_flag)
                    .input("SwitchFlag", (switch_flag == undefined) ? '' : switch_flag);
                const result = await insertRequest.execute("SaveBSESchemeAmfi");

                await transaction.commit();
            }
            catch (error) {
                console.log(error);
                await transaction.rollback();
            }
        }

        res.status(200).send({
            Status: true,
            Message: "Data uploaded successfully.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            Message: errorMessage,
        });
    }
};

exports.ImportBSESchemeAmfiOld = async (req, res) => {
    var errorMessage = 'Error while importing BSE scheme amfi codes...';
    try {
        var dataCount = 0;

        var dataList = await importDataService.GetBSESchemeAmfiList();
        dataCount = dataList.length;

        for (let i = 0; i < dataCount; i++) {
            // console.log('id: ' + dataList[i]["id"]);
            var dataItem = dataList[i];
            const transaction = req.app.locals.db.transaction();
            try {
                await transaction.begin();

                const request = transaction.request();
                request.input("ISIN", dataItem["isin"])
                    .input("FundClass", dataItem["fund_class"])
                    .input("FundType", dataItem["type"])
                    .input("AmfiCode", dataItem["amfi_code"])
                    .input("IsActive", dataItem["is_active"]);
                const result = await request.execute("ImportBSESchemeAmfi");

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

        res.status(200).send({ Status: true, Message: "BSE scheme amfi codes imported successfully.", Data: { DataCount: dataCount } });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.ImportDailyTransactionUnitLedger = async (req, res) => {
    var { UnitLedgerOrders } = req.body;

    let UnitLedgerOrdersData = JSON.parse(UnitLedgerOrders);

    var errorMessage = 'Error while importing transaction unit ledger...';

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        for (let i = 0; i < UnitLedgerOrdersData.length; i++) {
            var item = UnitLedgerOrdersData[i];

            const requestInsert = transaction.request();
            requestInsert.input("BSEOrderId", item.BSEOrderId)
                .input("FolioNumber", item.FolioNumber)
                .input("Units", item.Units)
                .input("NAV", item.NAV)
                .input("Amount", item.Amount)
                .input("BalanceUnits", item.BalanceUnits)
                .input("ExitFreeDays", item.ExitFreeDays)
                .input("ExitLoad", item.ExitLoad)
                .input("TaxFreeDays", item.TaxFreeDays)
                .input("TaxEfficient", item.TaxEfficient)
                .input("ProvisionalUnits", item.ProvisionalUnits)
                .input("ProvisionalNAV", item.ProvisionalNAV)
                .input("ProvisionalAmount", item.ProvisionalAmount)
                .input("ProvisionalBalanceUnits", item.ProvisionalBalanceUnits)
                .input("ProvisionalBalanceAmount", item.ProvisionalBalanceAmount)
                .input("HoldingBalanceUnits", item.HoldingBalanceUnits)
                .input("HoldingBalanceAmount", item.HoldingBalanceAmount)
                .input("TotalBalanceUnits", item.TotalBalanceUnits)
                .input("TotalBalanceAmount", item.TotalBalanceAmount);
            const resultInsert = await requestInsert.execute("UpdateClientTransactionUnitLedger");
        }

        await transaction.commit();

        res.status(200).send({ Status: true, Message: "Unit ledger updated successfully...", Data: { TotalRecords: UnitLedgerOrdersData.length } });

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

exports.ImportMandateBank = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'uploads', 'mandateBook1.xlsx');
    const workBook = xlsx.readFile(dataFilePath);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        for (const row of jsonData) {
            try {
                await transaction.begin();

                let Ucc = row['Ucc'];
                let BSEMandateId = row['BSEMandateId'];
                let BSEAccountNumber = row['BSEAccountNumber'];

                const insertBankRequest = transaction.request();
                insertBankRequest.input("UCC", Ucc)
                    .input("AccountNumber", BSEAccountNumber)
                    .input("BSEMandateId", BSEMandateId);
                const result = await insertBankRequest.execute("UpdateMandateBank");

                await transaction.commit();
            }
            catch (err) {
                console.log(err);
                try {
                    await transaction.rollback();
                } catch (sqlerr) {
                    console.log(sqlerr);
                }

                if (err.message.includes("UK_")) {
                    errorMessage = "Duplicate record. Record already exists.";
                }

            }
        }
        res.status(200).send({
            Status: true,
            Message: "File Uploaded successfully.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            Message: errorMessage,
        });
    }
};

exports.ImportEMandate = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'uploads', 'E Mandate23042025.xlsx');
    const workBook = xlsx.readFile(dataFilePath);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        for (const row of jsonData) {
            try {
                await transaction.begin();

                let MANDATECODE = row['MANDATE CODE'] || '';
                let CLIENTCODE = row['CLIENT CODE'] || '';
                let CLIENTNAME = row['CLIENT NAME'] || '';
                let MEMBERCODE = row['MEMBERCODE'] || '';
                let BANKNAME = row['BANK NAME'] || '';
                let BANKBRANCH = row['BANK BRANCH'] || '';
                let AMOUNT = row['AMOUNT'] || 0;
                let REGNDATE = null;
                let STATUS = row['STATUS'] || '';
                let UMRNNO = row['UMRN NO'] || '';
                let REMARKS = row['REMARKS'] || '';
                let APPROVEDDATE = null;
                let BANKACCOUNTNUMBER = row['BANK ACCOUNT NUMBER'] || '';
                let MANDATECOLLECTIONTYPE = row['MANDATE COLLECTION TYPE'] || '';
                let MANDATETYPE = row['MANDATE TYPE'] || '';
                let DATEOFUPLOAD = row['DATE OF UPLOAD'] || '';
                let STARTDATE = null;
                let ENDDATE = null;
                let DATEOFREUPLOAD = row['DATE OF RE-UPLOAD'];

                if (row['REGN DATE'] != null && row['REGN DATE'] != undefined) {
                    if (row['REGN DATE'].toString().includes('-')) {
                        REGNDATE = commonFunction.ConvertDateDMYToYMD(row['REGN DATE'], '-');
                    }
                    else {
                        REGNDATE = date.format(commonFunction.ExcelDateToJSDate(row['REGN DATE']), 'YYYY-MM-DD');
                    }
                }

                // console.log('REGNDATE: ' + REGNDATE);

                if (row['APPROVED DATE'] != null && row['APPROVED DATE'] != undefined) {
                    if (row['APPROVED DATE'].toString().includes('-')) {
                        APPROVEDDATE = commonFunction.ConvertDateDMYToYMD(row['APPROVED DATE'], '-');
                    }
                    else {
                        APPROVEDDATE = date.format(commonFunction.ExcelDateToJSDate(row['APPROVED DATE']), 'YYYY-MM-DD');
                    }
                }
                // console.log('APPROVEDDATE: ' + APPROVEDDATE);

                if (row['START DATE'] != null && row['START DATE'] != undefined) {
                    if (row['START DATE'].toString().includes('-')) {
                        STARTDATE = commonFunction.ConvertDateDMYToYMD(row['START DATE'], '-');
                    }
                    else {
                        STARTDATE = date.format(commonFunction.ExcelDateToJSDate(row['START DATE']), 'YYYY-MM-DD');
                    }
                }
                // console.log('STARTDATE: ' + STARTDATE);

                if (row['END DATE'] != null && row['END DATE'] != undefined) {
                    if (row['END DATE'].toString().includes('-')) {
                        ENDDATE = commonFunction.ConvertDateDMYToYMD(row['END DATE'], '-');
                    }
                    else {
                        ENDDATE = date.format(commonFunction.ExcelDateToJSDate(row['END DATE']), 'YYYY-MM-DD');
                    }
                }
                // console.log('ENDDATE: ' + ENDDATE);

                // console.log('MANDATECODE: ' + MANDATECODE);

                const insertBankRequest = transaction.request();
                insertBankRequest.input("UCC", CLIENTCODE)
                    .input("AccountNumber", BANKACCOUNTNUMBER)
                    .input("Amount", AMOUNT)
                    .input("Status", STATUS)
                    .input("BSEMandateId", MANDATECODE)
                    .input("StartDate", STARTDATE)
                    .input("EndDate", ENDDATE)
                    .input("IsMandateCreatedAtBSE", 1)
                    .input("BSEMandateCreatedDate", REGNDATE);
                const result = await insertBankRequest.execute("ImportEMandate");

                await transaction.commit();
            }
            catch (err) {
                console.log(err);
                try {
                    await transaction.rollback();
                } catch (sqlerr) {
                    console.log(sqlerr);
                }

                if (err.message.includes("UK_")) {
                    errorMessage = "Duplicate record. Record already exists.";
                }

            }
        }
        res.status(200).send({
            Status: true,
            Message: "File Uploaded successfully.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            Message: errorMessage,
        });
    }
};

exports.ImportSIP = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'uploads', 'oldsipreg.xlsx');
    const workBook = xlsx.readFile(dataFilePath);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        for (const row of jsonData) {
            try {
                await transaction.begin();

                let UCC = row['Client Code'] || '';
                let ProductCode = row['RTA Scheme Code'] || '';
                let BSEMandateId = row['Mandate ID'] || '';
                let SIPAmount = row['Installments Amt'] || 0;
                let SIPTenure = row['No. Of Installments'] || 0;
                let SIPFrequency = row['Frequency Type'] || '';
                let FolioNumber = row['Folio No'] || '';
                let FundAmount = row['Installments Amt'] || 0;
                let SIPStartDate = null;
                let SIPEndDate = null;
                let BSETradeOn = null;
                let BSEOrderId = row['XSIP Regn No'] || '';
                let TransactionDate = null;

                if (row['Start Date'] != null && row['Start Date'] != undefined) {
                    SIPStartDate = commonFunction.ConvertDateDMYToYMD(row['Start Date'], ' ');
                }
                if (row['End Date'] != null && row['End Date'] != undefined) {
                    SIPEndDate = commonFunction.ConvertDateDMYToYMD(row['End Date'], ' ');
                }
                if (row['Regn Date'] != null && row['Regn Date'] != undefined) {
                    BSETradeOn = commonFunction.ConvertDateDMYToYMD(row['Regn Date'], ' ');
                    TransactionDate = commonFunction.ConvertDateDMYToYMD(row['Regn Date'], ' ');
                }

                if (row['Start Date'] != null && row['Start Date'] != undefined && row['End Date'] != null && row['End Date'] != undefined) {
                    var startYear = Number(SIPStartDate.toString().substr(0, 4));
                    var endYear = Number(SIPEndDate.toString().substr(0, 4));

                    SIPTenure = (endYear - startYear) * 12;
                }

                // console.log('BSEOrderId:' + BSEOrderId);

                const insertBankRequest = transaction.request();
                insertBankRequest.input("UCC", UCC)
                    .input("ProductCode", ProductCode)
                    .input("BSEMandateId", BSEMandateId)
                    .input("SIPAmount", SIPAmount)
                    .input("SIPTenure", SIPTenure)
                    .input("SIPFrequency", SIPFrequency)
                    .input("FolioNumber", FolioNumber)
                    .input("FundAmount", FundAmount)
                    .input("SIPStartDate", SIPStartDate)
                    .input("SIPEndDate", SIPEndDate)
                    .input("BSETradeOn", BSETradeOn)
                    .input("BSEOrderId", BSEOrderId)
                    .input("TransactionDate", TransactionDate);
                const result = await insertBankRequest.execute("ImportSIPRegistration");
                // const result = await insertBankRequest.execute("ImportSIPRegistrationUpdateBSEScheme");

                await transaction.commit();
            }
            catch (err) {
                console.log(err);
                try {
                    await transaction.rollback();
                } catch (sqlerr) {
                    console.log(sqlerr);
                }

                if (err.message.includes("UK_")) {
                    errorMessage = "Duplicate record. Record already exists.";
                }

            }
        }
        res.status(200).send({
            Status: true,
            Message: "File Uploaded successfully.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            Message: errorMessage,
        });
    }
};

exports.ImportSIPCancel = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'uploads', 'oldsipreg.xlsx');
    const workBook = xlsx.readFile(dataFilePath);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        for (const row of jsonData) {
            try {
                await transaction.begin();

                let UCC = row['CLIENT CODE'] || '';
                let xSIPRegNo = row['XSIP REGN NO'] || '';
                let BSETradeOn = null;
                let Remark = row['REMARK'] || '';
                let SIPRegistrationId = Number(xSIPRegNo.replace('X', '')).toString();

                if (row['XSIP CANCELLATION DATE'] != null && row['XSIP CANCELLATION DATE'] != undefined) {
                    BSETradeOn = commonFunction.ConvertDateDMYToYMD(row['XSIP CANCELLATION DATE'], '-');
                }

                // console.log('BSEOrderId:' + SIPRegistrationId);

                const insertBankRequest = transaction.request();
                insertBankRequest.input("UCC", UCC)
                    .input("BSETradeOn", BSETradeOn)
                    .input("SIPRegistrationId", SIPRegistrationId)
                    .input("Remark", Remark);
                const result = await insertBankRequest.execute("ImportSIPCancellation");

                await transaction.commit();
            }
            catch (err) {
                console.log(err);
                try {
                    await transaction.rollback();
                } catch (sqlerr) {
                    console.log(sqlerr);
                }

                if (err.message.includes("UK_")) {
                    errorMessage = "Duplicate record. Record already exists.";
                }

            }
        }
        res.status(200).send({
            Status: true,
            Message: "File Uploaded successfully.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            Message: errorMessage,
        });
    }
};

exports.ImportSIPAutoCancel = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'uploads', 'oldsipreg.xlsx');
    const workBook = xlsx.readFile(dataFilePath);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        for (const row of jsonData) {
            let Status = row['Status'] || '';
            if (Status == 'AUTOCXL') {
                try {
                    await transaction.begin();

                    let UCC = row['Client Code'] || '';
                    let SIPRegistrationId = row['XSIP Regn No'] || '';
                    let BSETradeOn = null;
                    let Remark = 'AUTOCXL';

                    if (row['Regn Date'] != null && row['Regn Date'] != undefined) {
                        BSETradeOn = commonFunction.ConvertDateDMYToYMD(row['Regn Date'], ' ');
                    }

                    // console.log('BSEOrderId:' + SIPRegistrationId);

                    const insertBankRequest = transaction.request();
                    insertBankRequest.input("UCC", UCC)
                        .input("BSETradeOn", BSETradeOn)
                        .input("SIPRegistrationId", SIPRegistrationId)
                        .input("Remark", Remark);
                    const result = await insertBankRequest.execute("ImportSIPCancellation");

                    await transaction.commit();
                }
                catch (err) {
                    console.log(err);
                    try {
                        await transaction.rollback();
                    } catch (sqlerr) {
                        console.log(sqlerr);
                    }

                    if (err.message.includes("UK_")) {
                        errorMessage = "Duplicate record. Record already exists.";
                    }

                }
            }
        }
        res.status(200).send({
            Status: true,
            Message: "File Uploaded successfully.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            Message: errorMessage,
        });
    }
};

exports.ImportExitLoad = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'uploads', 'master_scheme_exit_loads.csv');
    const workBook = xlsx.readFile(dataFilePath, { FS: ",", raw: true });
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        for (const row of jsonData) {
            // console.log(row);
            // break;
            try {
                await transaction.begin();

                let wef_date = row['wef_date'];
                let isin = row['isin'] || '';
                let nil_upto = row['nil_upto'] || 0;
                let min_days = row['min_days'] || 0;
                let max_days = row['max_days'] || 0;
                let exit_load = row['exit_load'] || 0;
                let age = row['age'] || 0;
                let lock_in = row['lock_in'] || 0;

                // if (row['wef_date'] != null && row['wef_date'] != undefined) {
                //     wef_date = new Date(row['wef_date']);
                // }

                const insertBankRequest = transaction.request();
                insertBankRequest.input("WefDate", wef_date)
                    .input("ISIN", isin)
                    .input("NilUpto", nil_upto)
                    .input("MinDays", min_days)
                    .input("MaxDays", max_days)
                    .input("ExitLoad", exit_load)
                    .input("Age", age)
                    .input("LockIn", lock_in);
                const result = await insertBankRequest.execute("ImportBSESchemeExitLoad");

                await transaction.commit();
            }
            catch (err) {
                console.log(err);
                try {
                    await transaction.rollback();
                } catch (sqlerr) {
                    console.log(sqlerr);
                }

                if (err.message.includes("UK_")) {
                    errorMessage = "Duplicate record. Record already exists.";
                }

            }
        }
        res.status(200).send({
            Status: true,
            Message: "File Uploaded successfully.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            Message: errorMessage,
        });
    }
};

exports.ImportSWP = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'uploads', 'oldswpreg.xlsx');
    const workBook = xlsx.readFile(dataFilePath);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);

    try {
        var swpData = [];
        var swpPortfolioData = [];

        for (const row of jsonData) {
            let Status = row['Status'] || '';
            let MemberCode = row['Member Code'] || '';
            let ClientCode = row['Client Code'] || '';
            let SWPRegistrationNo = row['SWP Registration No.'] || '';
            let FolioNo = row['Folio No.'] || '';
            let AMC = row['AMC'] || '';
            let SchemeName = row['Scheme Name'] || '';
            let FrequencyType = row['Frequency Type'] || '';
            let SWPRegistrationDate = null;
            let SWPStartDate = null;
            let SWPEndDate = null;
            let WithdrawlAmount = row['Withdrawl Amount'] || 0;
            let WithdrawalUnits = row['Withdrawal Units'] || 0;
            let NoofWithdrawls = row['No. of Withdrawls'] || 0;
            let EUINDeclaration = row['EUIN Declaration'] || '';
            let EUINNumber = row['EUIN Number'] || '';
            let SubBrCode = row['SubBr.Code'] || '';
            let FirstOrderFlag = row['First Order Flag'] || '';
            let IntRefNo = row['Int Ref No'] || '';
            let Remark = row['Remark'] || '';
            let SubBrokerARNCode = row['Sub Broker ARN Code'] || '';
            let BSESchemeCode = row['BSE Scheme Code'] || '';
            let TransactionMode = row['Transaction Mode'] || '';
            let MOBILENO = row['MOBILE NO'] || '';
            let EMAILID = row['EMAIL ID'] || '';
            let BANKACCOUNTNO = row['BANK ACCOUNT NO'] || '';

            if (row['SWP Registration Date'] != null && row['SWP Registration Date'] != undefined) {
                if (row['SWP Registration Date'].toString().includes('-')) {
                    SWPRegistrationDate = commonFunction.ConvertDateDMYToYMD(row['SWP Registration Date'], '-');
                }
                else {
                    SWPRegistrationDate = date.format(commonFunction.ExcelDateToJSDate(row['SWP Registration Date']), 'YYYY-MM-DD');
                }
            }

            if (row['SWP Start Date'] != null && row['SWP Start Date'] != undefined) {
                if (row['SWP Start Date'].toString().includes('-')) {
                    SWPStartDate = commonFunction.ConvertDateDMYToYMD(row['SWP Start Date'], '-');
                }
                else {
                    SWPStartDate = date.format(commonFunction.ExcelDateToJSDate(row['SWP Start Date']), 'YYYY-MM-DD');
                }
            }

            if (row['SWP End Date'] != null && row['SWP End Date'] != undefined) {
                if (row['SWP End Date'].toString().includes('-')) {
                    SWPEndDate = commonFunction.ConvertDateDMYToYMD(row['SWP End Date'], '-');
                }
                else {
                    SWPEndDate = date.format(commonFunction.ExcelDateToJSDate(row['SWP End Date']), 'YYYY-MM-DD');
                }
            }

            // console.log(BSESchemeCode);

            var orderDetails = await getBSEOrderDetails(SWPRegistrationNo);

            if (orderDetails == null) {
                var schemeDetails = await getBseSchemeByCode(BSESchemeCode);

                swpData.push({
                    MemberCode: MemberCode,
                    ClientCode: (Number.isInteger(ClientCode) ? commonFunction.padLeft(ClientCode, '0', 10) : ClientCode),
                    SWPRegistrationNo: SWPRegistrationNo,
                    FolioNo: FolioNo,
                    AMC: AMC,
                    SchemeName: SchemeName,
                    FrequencyType: FrequencyType,
                    SWPRegistrationDate: SWPRegistrationDate,
                    SWPStartDate: SWPStartDate,
                    SWPEndDate: SWPEndDate,
                    WithdrawlAmount: WithdrawlAmount,
                    WithdrawalUnits: WithdrawalUnits,
                    NoofWithdrawls: NoofWithdrawls,
                    EUINDeclaration: EUINDeclaration,
                    EUINNumber: EUINNumber,
                    SubBrCode: SubBrCode,
                    FirstOrderFlag: FirstOrderFlag,
                    IntRefNo: IntRefNo,
                    Remark: Remark,
                    SubBrokerARNCode: SubBrokerARNCode,
                    BSESchemeCode: BSESchemeCode,
                    TransactionMode: TransactionMode,
                    MOBILENO: MOBILENO,
                    EMAILID: EMAILID,
                    BANKACCOUNTNO: BANKACCOUNTNO,
                    BSESchemeId: schemeDetails.Id,
                    ISIN: schemeDetails.ISIN,
                    SchemeDetails: schemeDetails
                });
            }
        }

        if (swpData.length > 0) {
            let swpPortfolioDataList = swpData.map(item => {
                const ClientCode = item.ClientCode;
                const SWPRegistrationDate = item.SWPRegistrationDate;
                const WithdrawlAmount = item.WithdrawlAmount;
                const SWPMonths = 0;
                const ClientTransactionId = '';

                return { ClientCode, SWPRegistrationDate, WithdrawlAmount, SWPMonths, ClientTransactionId };
            });

            const uniqueObjects = new Map();
            swpPortfolioDataList.forEach(obj => {
                const key = JSON.stringify(obj);
                uniqueObjects.set(key, obj);
            });

            swpPortfolioData = Array.from(uniqueObjects.values());

            for (let i = 0; i < swpPortfolioData.length; i++) {
                var swpItem = swpPortfolioData[i];

                var swpAllocationData = swpData.filter(x => x.ClientCode == swpItem.ClientCode && x.SWPRegistrationDate == swpItem.SWPRegistrationDate && x.WithdrawlAmount == swpItem.WithdrawlAmount);

                swpItem.SWPMonths = swpAllocationData.reduce((sum, fund) => sum + fund.NoofWithdrawls, 0);

                var clientTransactionId = await saveSWPClientTransaction(req, swpItem, swpAllocationData);

                swpItem.ClientTransactionId = cryptoEngine.ParamDecrypt(clientTransactionId, true);

                // break;
            }
        }

        res.status(200).send({
            Status: true,
            Message: "File Uploaded successfully.",
            Data: swpPortfolioData
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            Message: errorMessage,
        });
    }
};

exports.ImportSWPCancel = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'uploads', 'oldsipreg.xlsx');
    const workBook = xlsx.readFile(dataFilePath);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        for (const row of jsonData) {
            try {
                await transaction.begin();

                let UCC = row['Client Code'] || '';
                let SWPRegistrationId = row['SWP Registration No.'] || '';
                let BSETradeOn = null;
                let Remark = row['Remark'] || '';

                if (row['SWP Cancellation Date'] != null && row['SWP Cancellation Date'] != undefined) {
                    BSETradeOn = commonFunction.ConvertDateDMYToYMD(row['SWP Cancellation Date'], '-');
                }

                // console.log('BSEOrderId:' + SWPRegistrationId);

                const insertBankRequest = transaction.request();
                insertBankRequest.input("UCC", UCC)
                    .input("BSETradeOn", BSETradeOn)
                    .input("SWPRegistrationId", SWPRegistrationId)
                    .input("Remark", Remark);
                const result = await insertBankRequest.execute("ImportSWPCancellation");

                await transaction.commit();
            }
            catch (err) {
                console.log(err);
                try {
                    await transaction.rollback();
                } catch (sqlerr) {
                    console.log(sqlerr);
                }

                if (err.message.includes("UK_")) {
                    errorMessage = "Duplicate record. Record already exists.";
                }
            }
        }
        res.status(200).send({
            Status: true,
            Message: "File Uploaded successfully.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            Message: errorMessage,
        });
    }
};

exports.ImportSWPAutoCancel = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'uploads', 'oldsipreg.xlsx');
    const workBook = xlsx.readFile(dataFilePath);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        for (const row of jsonData) {
            let Status = row['Status'] || '';
            if (Status == 'AUTOCXL') {
                try {
                    await transaction.begin();

                    let UCC = row['Client Code'] || '';
                    let SWPRegistrationId = row['SWP Registration No.'] || '';
                    let BSETradeOn = null;
                    let Remark = row['Remark'] || '';

                    if (row['SWP Registration Date'] != null && row['SWP Registration Date'] != undefined) {
                        BSETradeOn = commonFunction.ConvertDateDMYToYMD(row['SWP Registration Date'], '-');
                    }

                    // console.log('BSEOrderId:' + SWPRegistrationId);

                    const insertBankRequest = transaction.request();
                    insertBankRequest.input("UCC", UCC)
                        .input("BSETradeOn", BSETradeOn)
                        .input("SWPRegistrationId", SWPRegistrationId)
                        .input("Remark", Remark);
                    const result = await insertBankRequest.execute("ImportSWPCancellation");

                    await transaction.commit();
                }
                catch (err) {
                    console.log(err);
                    try {
                        await transaction.rollback();
                    } catch (sqlerr) {
                        console.log(sqlerr);
                    }

                    if (err.message.includes("UK_")) {
                        errorMessage = "Duplicate record. Record already exists.";
                    }
                }
            }
        }
        res.status(200).send({
            Status: true,
            Message: "File Uploaded successfully.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            Message: errorMessage,
        });
    }
};

exports.ImportBSEOrderStatusReport = async (req, res) => {
    const errorMessage = 'Error while uploading...';

    try {
        var dataFiles = [
            {
                FileName: 'OrderStatusReport1.xlsx'
            },
            {
                FileName: 'OrderStatusReport2.xlsx'
            },
            {
                FileName: 'OrderStatusReport3.xlsx'
            },
            {
                FileName: 'OrderStatusReport4.xlsx'
            },
            {
                FileName: 'OrderStatusReport5.xlsx'
            }
        ];

        for (let f = 0; f < dataFiles.length; f++) {
            var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'uploads', dataFiles[f].FileName);
            const workBook = xlsx.readFile(dataFilePath);
            const workSheet = workBook.Sheets[workBook.SheetNames[0]];
            const jsonData = xlsx.utils.sheet_to_json(workSheet);
            const transaction = req.app.locals.db.transaction();

            for (const row of jsonData) {
                let MemberCode = row['Member Code'] || '';
                let Date = null;
                let Time = row['Time'] || '';
                let OrderNo = row['Order No'] || '';
                let SettNo = row['Sett No'] || '';
                let ClientCode = row['Client Code'] || '';
                let ClientName = row['Client Name'] || '';
                let SchemeCode = row['Scheme Code'] || '';
                let SchemeName = row['Scheme Name'] || '';
                let ISIN = row['ISIN'] || '';
                let BuySell = row['Buy/Sell'] || '';
                let Amount = row['Amount'] || 0;
                let Units = row['Units'] || 0;
                let DPTrans = row['DP Trans'] || '';
                let DPFolioNo = row['DP/Folio No'] || '';
                let FolioNo = row['Folio No'] || '';
                let EntryBy = row['Entry By'] || '';
                let OrderStatus = row['Order Status'] || '';
                let OrderRemark = row['Order Remark'] || '';
                let InternalRefNo = row['Internal Ref No'] || '';
                let SettType = row['Sett Type'] || '';
                let OrderType = row['Order Type'] || '';
                let SIPRegnNo = row['SIP Regn No'] || '';
                let SIPRegnDate = null;
                let SubBrCode = row['SubBr Code'] || '';
                let EUIN = row['EUIN'] || '';
                let EUINDecl = row['EUIN Decl'] || '';
                let AllUnitsFlag = row['All Units Flag'] || '';
                let DPCFlag = row['DPC Flag'] || '';
                let SubOrderType = row['Sub Order Type'] || '';
                let FirstOrder = row['First Order'] || '';
                let PurchaseRedeemFreshAdditional = row['Purchase / Redeem(Fresh/Additional)'] || '';
                let MemberRemarks = row['Member Remarks'] || '';
                let KYCFlag = row['KYC Flag'] || '';
                let MINredemptionflag = row['MIN redemption flag'] || '';
                let SubbrokerARNCode = row['Sub- broker ARN Code'] || '';

                // console.log('FileName: ' + dataFiles[f].FileName + '|OrderNo:' + OrderNo);

                if (row['Date'] != null && row['Date'] != undefined) {
                    if (row['Date'].toString().includes('-')) {
                        Date = commonFunction.ConvertDateDMYToYMD(row['Date'], '-');
                    }
                    else if (row['Date'].toString().includes('/')) {
                        Date = commonFunction.ConvertDateDMYToYMD(row['Date'], '/');
                    }
                    else {
                        Date = date.format(commonFunction.ExcelDateToJSDate(row['Date']), 'YYYY-MM-DD');
                    }
                }

                if (row['SIP Regn Date'] != null && row['SIP Regn Date'] != undefined && row['SIP Regn Date'] != '' && row['SIP Regn Date'] != 'NULL') {
                    // console.log(row['SIP Regn Date']);
                    if (row['SIP Regn Date'].toString().includes('-')) {
                        SIPRegnDate = commonFunction.ConvertDateDMYToYMD(row['SIP Regn Date'], '-');
                    }
                    else if (row['SIP Regn Date'].toString().includes('/')) {
                        SIPRegnDate = commonFunction.ConvertDateDMYToYMD(row['SIP Regn Date'], '/');
                    }
                    else {
                        SIPRegnDate = date.format(commonFunction.ExcelDateToJSDate(row['SIP Regn Date']), 'YYYY-MM-DD');
                    }
                }

                try {
                    await transaction.begin();

                    const requestInsert = transaction.request();
                    requestInsert.input("MemberCode", MemberCode)
                        .input("OrderDate", Date)
                        .input("OrderTime", Time)
                        .input("OrderNumber", OrderNo)
                        .input("SettNumber", SettNo)
                        .input("ClientCode", ClientCode)
                        .input("ClientName", ClientName)
                        .input("SchemeCode", SchemeCode)
                        .input("SchemeName", SchemeName)
                        .input("ISIN", ISIN)
                        .input("BuySell", BuySell)
                        .input("Amount", Amount)
                        .input("Units", Units)
                        .input("DPTrans", DPTrans)
                        .input("DPFolioNumber", DPFolioNo)
                        .input("FolioNumber", FolioNo)
                        .input("EntryBy", EntryBy)
                        .input("OrderStatus", OrderStatus)
                        .input("OrderRemark", OrderRemark)
                        .input("InternalRefNumber", InternalRefNo)
                        .input("SettType", SettType)
                        .input("OrderType", OrderType)
                        .input("SIPRegNumber", SIPRegnNo)
                        .input("SIPRegDate", SIPRegnDate)
                        .input("SubBrokerCode", SubBrCode)
                        .input("EUIN", EUIN)
                        .input("EUINDeclaration", EUINDecl)
                        .input("AllUnitsFlag", AllUnitsFlag)
                        .input("DPCFlag", DPCFlag)
                        .input("SubOrderType", SubOrderType)
                        .input("FirstOrder", FirstOrder)
                        .input("FreshAdditional", PurchaseRedeemFreshAdditional)
                        .input("MemberRemarks", MemberRemarks)
                        .input("KYCFlag", KYCFlag)
                        .input("MinRedemptionFlag", MINredemptionflag)
                        .input("SubBrokerARNCode", SubbrokerARNCode);
                    const resultInsert = await requestInsert.execute("InsertFeedBSEOrderStatus");

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
            }
        }

        res.status(200).send({
            Status: true,
            Message: "File Uploaded successfully.",
            Data: null
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            Message: errorMessage,
        });
    }
};

exports.ImportBSEOrderSell = async (req, res) => {
    const errorMessage = 'Error while uploading...';

    try {
        var profiles = await getClientTransactionProfiles(cryptoEngine.ParamEncrypt('0', true));
        // profiles = profiles.filter(x => x.PANCardNumber != 'LBJPS1839Q');
        // console.log(profiles);

        for (let p = 0; p < profiles.length; p++) {
            var profileItem = profiles[p];
            // console.log((p + 1) + '/' + profiles.length + ' : ' + profileItem.PANCardNumber);

            if (profileItem.PANCardNumber.trim() != '') {
                var historyData = await getFeedTransactionBSEOrderStatusSell(profileItem.PANCardNumber);

                while (historyData.length > 0) {
                    var selectedHistoryData = await processHistoryData(historyData);
                    // break;

                    if (selectedHistoryData.length > 0) {
                        var clientTransactionId = selectedHistoryData[0].ClientTransactionId;
                        var inputData = {
                            ClientTransactionId: clientTransactionId,
                            InvestmentType: 'NA',
                            PaymentType: '',
                            ReinvestmentAmount: 0,
                            AdditionalAmount: 0,
                            Allocations: JSON.stringify(selectedHistoryData)
                        };

                        await saveTransactionTagging(req, res, inputData.ClientTransactionId, inputData.InvestmentType, inputData.PaymentType, inputData.ReinvestmentAmount, inputData.AdditionalAmount, inputData.Allocations);

                        historyData = await getFeedTransactionBSEOrderStatusSell(profileItem.PANCardNumber);

                        // historyData = [];
                    }
                    else {
                        historyData = [];
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            Message: errorMessage,
        });
    }
};

exports.ImportCamsTransactionType = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'uploads', 'CamsTransactionType.xlsx');
    const workBook = xlsx.readFile(dataFilePath);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        for (const row of jsonData) {
            try {
                await transaction.begin();

                let TransactionType = row['TRXNTYPE'] || '';
                let TransactionNature = row['TRXN_NATUR'] || '';
                let TransactionTypeName = row['Type'] || '';
                let PurchaseRedemptionType = row['PurchaseRedemptionType'] || '';

                const insertBankRequest = transaction.request();
                insertBankRequest.input("CamsTransactionType", TransactionType)
                    .input("CamsTransactionNature", TransactionNature)
                    .input("TransactionTypeName", TransactionTypeName)
                    .input("PurchaseRedemptionType", PurchaseRedemptionType);
                const result = await insertBankRequest.execute("InsertTransactionTypeCams");

                await transaction.commit();
            }
            catch (err) {
                console.log(err);
                try {
                    await transaction.rollback();
                } catch (sqlerr) {
                    console.log(sqlerr);
                }

                if (err.message.includes("UK_")) {
                    errorMessage = "Duplicate record. Record already exists.";
                }
            }
        }
        res.status(200).send({
            Status: true,
            Message: "File Uploaded successfully.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            Message: errorMessage,
        });
    }
};

exports.ImportKarvyTransactionType = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'uploads', 'KarvyTransactionType.xlsx');
    const workBook = xlsx.readFile(dataFilePath);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        for (const row of jsonData) {
            try {
                await transaction.begin();

                let TransactionType = row['TRDESC'] || '';
                let TransactionNature = row['TD_PURRED'] || '';
                let TransactionTypeName = row['Type'] || '';
                let PurchaseRedemptionType = row['PurchaseRedemptionType'] || '';

                const insertBankRequest = transaction.request();
                insertBankRequest.input("KarvyTransactionType", TransactionType)
                    .input("KarvyTransactionNature", TransactionNature)
                    .input("TransactionTypeName", TransactionTypeName)
                    .input("PurchaseRedemptionType", PurchaseRedemptionType);
                const result = await insertBankRequest.execute("InsertTransactionTypeKarvy");

                await transaction.commit();
            }
            catch (err) {
                console.log(err);
                try {
                    await transaction.rollback();
                } catch (sqlerr) {
                    console.log(sqlerr);
                }

                if (err.message.includes("UK_")) {
                    errorMessage = "Duplicate record. Record already exists.";
                }
            }
        }
        res.status(200).send({
            Status: true,
            Message: "File Uploaded successfully.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            Message: errorMessage,
        });
    }
};

async function getGender(req, name) {
    var Id = 0;

    if (name == '') {
        name = 'Other';
    }

    const readRequest = req.app.locals.db.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetGenderByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getCountry(req, name) {
    var Id = 0;

    const readRequest = req.app.locals.db.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetCountryByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getState(req, name, countryId) {
    var Id = 0;

    const readRequest = req.app.locals.db.request();
    readRequest.input("Name", name)
        .input("CountryId", countryId);
    const readResult = await readRequest.execute("GetStateByNameCountry");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getSuperUser(req) {
    var Id = 0;

    const readRequest = req.app.locals.db.request();
    readRequest.input("UserName", "Superadmin");
    const readResult = await readRequest.execute("GetAppUserByUserName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getClient(req, leadId) {
    var Id = 0;

    const readRequest = req.app.locals.db.request();
    readRequest.input("LeadId", leadId);
    const readResult = await readRequest.execute("GetClientByLead");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getClientFamily(req, clientId, name) {
    var Id = 0;

    const readRequest = req.app.locals.db.request();
    readRequest.input("ClientId", clientId)
        .input("Name", name);
    const readResult = await readRequest.execute("GetClientFamilyByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getClientCompany(req, clientId, name) {
    var Id = 0;

    const readRequest = req.app.locals.db.request();
    readRequest.input("ClientId", clientId)
        .input("Name", name);
    const readResult = await readRequest.execute("GetClientCompanyByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getRelation(req, name) {
    var Id = 0;

    if (name.toLowerCase() == 'primary') {
        name = 'Self';
    }
    else if (name.toLowerCase() == 'others') {
        name = 'Other';
    }

    const readRequest = req.app.locals.db.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetRelationByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getTaxStatus(req, name) {
    var Id = 0;

    if (name == 'NON INDIVIDUAL') {
        name = 'INDIVIDUAL';
    }

    const readRequest = req.app.locals.db.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetTaxStatusByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getTaxSlab(req, code) {
    var Id = 0;

    const readRequest = req.app.locals.db.request();
    readRequest.input("Code", code);
    const readResult = await readRequest.execute("GetTaxSlabByCode");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getClientKycProfileFamily(req, clientFamilyId) {
    var Id = 0;

    const readRequest = req.app.locals.db.request();
    readRequest.input("ClientFamilyId", clientFamilyId);
    const readResult = await readRequest.execute("GetClientKycProfileFamily");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].ClientKycProfileId;
    }

    return Id;
};

async function getClientKycProfileCompany(req, clientCompanyId) {
    var Id = 0;

    const readRequest = req.app.locals.db.request();
    readRequest.input("ClientCompanyId", clientCompanyId);
    const readResult = await readRequest.execute("GetClientKycProfileCompany");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].ClientKycProfileId;
    }

    return Id;
};

async function getKYCStatus(req, name) {
    var Id = 0;

    if (name == '') {
        name = 'Not Available';
    }

    const readRequest = req.app.locals.db.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetKYCStatusByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getOccupation(req, name) {
    var Id = 0;

    if (name == '') {
        name = 'Others';
    }

    const readRequest = req.app.locals.db.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetOccupationByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getGrossAnnualIncome(req, name) {
    var Id = 0;

    if (name == '') {
        name = 'None';
    }

    const readRequest = req.app.locals.db.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetGrossAnnualIncomeByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getWealthSource(req, name) {
    var Id = 0;

    if (name == '') {
        name = 'Others';
    }

    const readRequest = req.app.locals.db.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetWealthSourceByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getSelfDeclaration(req, code) {
    var Id = 0;

    if (code == '') {
        code = 'SE';
    }

    const readRequest = req.app.locals.db.request();
    readRequest.input("Code", code);
    const readResult = await readRequest.execute("GetSelfDeclarationByCode");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getClientKycAddressFamily(req, clientFamilyId) {
    var LocalId = 0;
    var ForeignId = 0;

    const readRequest = req.app.locals.db.request();
    readRequest.input("ClientFamilyId", clientFamilyId);
    const readResult = await readRequest.execute("GetClientKycAddressFamily");
    if (readResult.recordset.length > 0) {
        LocalId = readResult.recordset[0].ClientKycLocalAddressId;
        ForeignId = readResult.recordset[0].ClientKycForeignAddressId;
    }

    return { LocalAddressId: LocalId, ForeignAddressId: ForeignId };
};

async function getClientKycAddressCompany(req, clientCompanyId) {
    var LocalId = 0;
    var ForeignId = 0;

    const readRequest = req.app.locals.db.request();
    readRequest.input("ClientCompanyId", clientCompanyId);
    const readResult = await readRequest.execute("GetClientKycAddressCompany");
    if (readResult.recordset.length > 0) {
        LocalId = readResult.recordset[0].ClientKycLocalAddressId;
        ForeignId = readResult.recordset[0].ClientKycForeignAddressId;
    }

    return { LocalAddressId: LocalId, ForeignAddressId: ForeignId };
};

async function getAddressType(req, name) {
    var Id = 0;

    const readRequest = req.app.locals.db.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetAddressTypeByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getBankAccountType(req, name) {
    var Id = 0;

    const readRequest = req.app.locals.db.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetBankAccountTypeByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getClientKycBank(req, clientKycProfileId, bankAccountTypeId, accountNumber) {
    var Id = 0;

    const readRequest = req.app.locals.db.request();
    readRequest.input("ClientKycProfileId", clientKycProfileId)
        .input("BankAccountTypeId", bankAccountTypeId)
        .input("AccountNumber", accountNumber);
    const readResult = await readRequest.execute("GetClientKycBankByAccountNumber");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getAccountType(req, name) {
    var Id = 0;

    if (name == 'NON INDIVIDUAL') {
        name = 'SINGLE';
    }

    const readRequest = req.app.locals.db.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetAccountTypeByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getClientAccount(ucc) {
    var Id = 0;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("UCC", ucc);
    const readResult = await readRequest.execute("GetClientAccountByUCC");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getClientAccountBank(req, clientId, accountNumber) {
    var Id = 0;

    const readRequest = req.app.locals.db.request();
    readRequest.input("ClientId", clientId)
        .input("AccountNumber", accountNumber);
    const readResult = await readRequest.execute("GetClientKycBankByClientAccountNumber");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getMandateType(req, name) {
    var Id = 0;

    const readRequest = req.app.locals.db.request();
    readRequest.input("Name", name);
    const readResult = await readRequest.execute("GetMandateTypeByName");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getClientAccountMandate(req, bseMandateId) {
    var Id = 0;

    const readRequest = req.app.locals.db.request();
    readRequest.input("BSEMandateId", bseMandateId);
    const readResult = await readRequest.execute("GetClientAccountMandateByBSEMandateId");
    if (readResult.recordset.length > 0) {
        Id = readResult.recordset[0].Id;
    }

    return Id;
};

async function getBseSchemeByIsin(isin) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("ISIN", isin);
    const readResult = await readRequest.execute("GetBSESchemeByISIN");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function getBseSchemeByCode(code) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("SchemeCode", code);
    const readResult = await readRequest.execute("GetBSESchemeByCode");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];

        data.Id = cryptoEngine.ParamEncrypt(data.Id, true);
    }

    return data;
};

async function getBSEOrderDetails(orderid) {
    var data = null;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("BSEOrderId", orderid);
    const readResult = await readRequest.execute("GetClientTransactionAllocationByBSEOrderId");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function saveSWPClientTransaction(req, swpPortfolioData, swpAllocationData) {
    var PANCardNumber = '';
    var clientAccountId = '414E2B5048745659672B513D';
    var transactionTypeId = '414E2B5048745659672B513D';
    var transactionPlanId = '414E2B5048745659672B513D';
    var sellCriteria = '';
    var transactionPortfolioTypes = [];
    var clientTransactionId = '414E2B5048745659672B513D';
    var currentDate = luxon.DateTime.now().setZone('Asia/Kolkata');

    try {
        const readFTUccRequest = req.app.locals.db.request();
        readFTUccRequest.input('Ucc', swpPortfolioData.ClientCode)
            .input('FirstHolderName', '')
            .input('SecondHolderName', '')
            .input('ThirdHolderName', '')
            .input('GuardianName', '')
            .input('NomineeName', '')
            .input('Nominee2Name', '')
            .input('Nominee3Name', '');
        const readFTUccResult = await readFTUccRequest.execute("GetFeedTransactionUccFolioFirstHolderPAN");
        if (readFTUccResult.recordset.length > 0) {
            PANCardNumber = readFTUccResult.recordset[0].FirstHolderPan;
        }

        const readCARequest = req.app.locals.db.request();
        readCARequest.input('UCC', swpPortfolioData.ClientCode);
        const readCAResult = await readCARequest.execute("GetClientAccountByUCC");
        if (readCAResult.recordset.length > 0) {
            clientAccountId = cryptoEngine.ParamEncrypt(readCAResult.recordset[0].Id, true);
        }

        const readTransactionTypeRequest = req.app.locals.db.request();
        const readTransactionTypeResult = await readTransactionTypeRequest.execute("GetTransactionType");
        if (readTransactionTypeResult.recordset.length > 0) {
            var transactionTypeDataList = readTransactionTypeResult.recordset;

            var transactionType = transactionTypeDataList.find(x => x.Code == 'B');

            if (transactionType != null) {
                transactionTypeId = cryptoEngine.ParamEncrypt(transactionType.Id, true);
            }
        }

        const readTransactionPlanRequest = req.app.locals.db.request();
        const readTransactionPlanResult = await readTransactionPlanRequest.execute("GetTransactionPlanList");
        if (readTransactionPlanResult.recordset.length > 0) {
            var transactionPlanDataList = readTransactionPlanResult.recordset;

            var transactionPlan = transactionPlanDataList.find(x => x.Code == 'L');

            if (transactionPlan != null) {
                transactionPlanId = cryptoEngine.ParamEncrypt(transactionPlan.Id, true);
            }
        }

        const readTransactionPortfolioTypeRequest = req.app.locals.db.request();
        const readTransactionPortfolioTypeResult = await readTransactionPortfolioTypeRequest.execute("GetTransactionPortfolioType");
        if (readTransactionPortfolioTypeResult.recordset.length > 0) {
            transactionPortfolioTypes = readTransactionPortfolioTypeResult.recordset.filter(x => x.Code == 'W').map(item => {
                const Id = cryptoEngine.ParamEncrypt(item.Id, true);

                return { ...item, Id };
            });
        }
    }
    catch (err) {
        console.log(err);

        return;
    }

    // console.log(swpPortfolioData.ClientCode);
    // console.log(cryptoEngine.ParamDecrypt(clientAccountId, true));

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        const request = transaction.request();
        request.output("Id", msSql.BigInt)
            .input("TransactionTypeId", cryptoEngine.ParamDecrypt(transactionTypeId, true))
            .input("PANCardNumber", PANCardNumber)
            .input("TransactionPlanId", cryptoEngine.ParamDecrypt(transactionPlanId, true))
            .input("SellCriteria", sellCriteria)
            .input("SwitchBy", '')
            .input("TradeStatus", 'Completed')
            .input("STPType", '');
        const result = await request.execute("InsertClientTransaction");
        clientTransactionId = cryptoEngine.ParamEncrypt(result.output.Id, true);

        const requestClient = transaction.request();
        requestClient.input("ClientTransactionId", cryptoEngine.ParamDecrypt(clientTransactionId, true))
            .input("ClientAccountId", cryptoEngine.ParamDecrypt(clientAccountId, true));
        const resultClient = await requestClient.execute("InsertClientTransactionAccount");

        for (let i = 0; i < transactionPortfolioTypes.length; i++) {
            const transactionPortfolioTypeDetailsRequest = transaction.request();
            transactionPortfolioTypeDetailsRequest.input("ClientTransactionId", cryptoEngine.ParamDecrypt(clientTransactionId, true))
                .input("TransactionPortfolioTypeId", cryptoEngine.ParamDecrypt(transactionPortfolioTypes[i].Id, true));

            const TransactionPortfolioTypeDetailsResult = await transactionPortfolioTypeDetailsRequest.execute("InsertClientTransactionPortfolioType");
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

        // res.status(500).send(errorMessage);
        return;
    }

    var clientTransactionData = await transactionController.GetClientTransaction(req, null, clientTransactionId);

    try {
        await transaction.begin();

        for (let i = 0; i < clientTransactionData.PortfolioTypes.length; i++) {
            var portfolioTypeItem = clientTransactionData.PortfolioTypes[i];

            var portfolioItem = clientTransactionData.ClientTransactionPortfolios.find(item => item.ClientTransactionPortfolioTypeId == portfolioTypeItem.ClientTransactionPortfolioTypeId);

            if (portfolioItem == null) {
                const request = transaction.request();
                request.output("Id", msSql.BigInt)
                    .input("ClientTransactionId", cryptoEngine.ParamDecrypt(clientTransactionId, true))
                    .input("ClientTransactionPortfolioTypeId", cryptoEngine.ParamDecrypt(portfolioTypeItem.ClientTransactionPortfolioTypeId, true))
                    .input("Amount", 0)
                    .input("LumpsumAllocationType", 'R')
                    .input("LumpsumEquity", 0)
                    .input("LumpsumDebt", 0)
                    .input("IsNewSIP", false)
                    .input("SIPTransactionType", '')
                    .input("SIPModificationType", '')
                    .input("SIPAmount", 0)
                    .input("SIPAllocationType", '')
                    .input("SIPEquity", 0)
                    .input("SIPDebt", 0)
                    .input("SIPTenure", 0)
                    .input("SIPFrequency", '')
                    .input("IsIncrementSIP", false)
                    .input("SIPIncrementTenure", 0)
                    .input("SIPIncrementPercentage", 0)
                    .input("SIPIncrementAmount", 0)
                    .input("SIPStartDateType", '')
                    .input("SIPStartDate", '')
                    .input("IsSIPFirstOrderToday", false)
                    .input("BSESIPCeaseCode", '')
                    .input("SIPCeaseRemark", '')
                    .input("SellFrom", '')
                    .input("CustomSellType", '')
                    .input("RationalForTrade", 'Old system record')
                    .input("TradeStatus", 'Completed')
                    .input("SubTransactionType", 'SWP')
                    .input("SWPPercentage", 9.5)
                    .input("SWPAmount", swpPortfolioData.WithdrawlAmount)
                    .input("SWPFrequency", 'Monthly')
                    .input("SWPStartDate", swpPortfolioData.SWPRegistrationDate)
                    .input("SWPMonths", swpPortfolioData.SWPMonths)
                    .input("InvestmentType", '')
                    .input("ReinvestmentAmount", 0)
                    .input("AdditionalAmount", 0)
                    .input("IsHistoricalRecord", false);
                const result = await request.execute("InsertClientTransactionPortfolio");
            }
            else {
                const request = transaction.request();
                request.input("Id", cryptoEngine.ParamDecrypt(portfolioItem.Id, true))
                    .input("ClientTransactionId", cryptoEngine.ParamDecrypt(clientTransactionId, true))
                    .input("ClientTransactionPortfolioTypeId", cryptoEngine.ParamDecrypt(portfolioTypeItem.ClientTransactionPortfolioTypeId, true))
                    .input("Amount", (portfolioTypeItem.TransactionPortfolioTypeCode == 'A') ? amount : 0)
                    .input("LumpsumAllocationType", 'R')
                    .input("LumpsumEquity", 0)
                    .input("LumpsumDebt", 0)
                    .input("IsNewSIP", false)
                    .input("SIPTransactionType", '')
                    .input("SIPModificationType", '')
                    .input("SIPAmount", 0)
                    .input("SIPAllocationType", '')
                    .input("SIPEquity", 0)
                    .input("SIPDebt", 0)
                    .input("SIPTenure", 0)
                    .input("SIPFrequency", '')
                    .input("IsIncrementSIP", false)
                    .input("SIPIncrementTenure", 0)
                    .input("SIPIncrementPercentage", 0)
                    .input("SIPIncrementAmount", 0)
                    .input("SIPStartDateType", '')
                    .input("SIPStartDate", '')
                    .input("IsSIPFirstOrderToday", false)
                    .input("SellFrom", '')
                    .input("CustomSellType", '')
                    .input("SubTransactionType", 'SWP')
                    .input("SWPPercentage", 9.5)
                    .input("SWPAmount", swpPortfolioData.WithdrawlAmount)
                    .input("SWPFrequency", 'Monthly')
                    .input("SWPStartDate", swpPortfolioData.SWPRegistrationDate)
                    .input("SWPMonths", swpPortfolioData.SWPMonths)
                    .input("InvestmentType", '')
                    .input("ReinvestmentAmount", 0)
                    .input("AdditionalAmount", 0)
                    .input("IsHistoricalRecord", false);
                const result = await request.execute("UpdateClientTransactionPortfolio");
            }
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

        return;
    }

    clientTransactionData = await transactionController.GetClientTransaction(req, null, clientTransactionId);

    try {
        await transaction.begin();

        for (let p = 0; p < clientTransactionData.ClientTransactionPortfolios.length; p++) {
            var portfolioDataItem = clientTransactionData.ClientTransactionPortfolios[p];

            var SubTransactionType = 'SWP';

            if (swpAllocationData.length > 0) {
                var ClientTransactionPortfolioId = portfolioDataItem.Id;

                const requestLogDelete = transaction.request();
                requestLogDelete.input("ClientTransactionPortfolioId", cryptoEngine.ParamDecrypt(ClientTransactionPortfolioId, true))
                    .input("SubTransactionType", SubTransactionType);
                const resultLogDelete = await requestLogDelete.execute("DeleteClientTransactionAllocationLog");

                const requestDelete = transaction.request();
                requestDelete.input("ClientTransactionPortfolioId", cryptoEngine.ParamDecrypt(ClientTransactionPortfolioId, true))
                    .input("SubTransactionType", SubTransactionType);
                const resultDelete = await requestDelete.execute("DeleteClientTransactionAllocation");

                for (let i = 0; i < swpAllocationData.length; i++) {
                    var item = swpAllocationData[i];

                    // console.log(item);

                    const requestInsert = transaction.request();
                    requestInsert.input("ClientTransactionPortfolioId", cryptoEngine.ParamDecrypt(ClientTransactionPortfolioId, true))
                        .input("BSESchemeId", cryptoEngine.ParamDecrypt(item.BSESchemeId, true))
                        .input("ISIN", item.ISIN)
                        .input("IsHoliday", false)
                        .input("IsExitLoadChanged", false)
                        .input("AvailableAmount", 0)
                        .input("FolioNumber", item.FolioNo)
                        .input("FundAmount", 0)
                        .input("FundUnits", 0)
                        .input("FundCategory", '')
                        .input("FundPercentage", 0)
                        .input("FundOtherDetails", JSON.stringify(item.SchemeDetails))
                        .input("AllocationPercentage", 0)
                        .input("SellAll", false)
                        .input("AvailableUnits", 0)
                        .input("SIPStartDate", null)
                        .input("SIPEndDate", null)
                        .input("SIPTenure", 0)
                        .input("SIPIncrementTenure", 0)
                        .input("SIPFrequency", '')
                        .input("SIPDay", 0)
                        .input("IsMinimumInvestmentValid", false)
                        .input("CalculationType", '')
                        .input("Month", 0)
                        .input("AdjustDays", 0)
                        .input("MarketAmount", 0)
                        .input("MarketPercentage", 0)
                        .input("FundMinAmount", 0)
                        .input("BSETradeOn", item.SWPRegistrationDate)
                        .input("BSEURN", '')
                        .input("BSEOrderId", item.SWPRegistrationNo)
                        .input("BSEResponse", 'SWP REGISTRATION DONE SUCCESSFULLY')
                        .input("BSEOrderStatus", '')
                        .input("TradeStatus", 'Completed')
                        .input("IsSIP", false)
                        .input("SubTransactionType", SubTransactionType)
                        .input("SWPAmount", (item.WithdrawlAmount * item.NoofWithdrawls))
                        .input("SWPInstallmentAmount", item.WithdrawlAmount)
                        .input("SWPMonths", item.NoofWithdrawls)
                        .input("SWPAllocation", 0)
                        .input("SWPStartDate", item.SWPStartDate)
                        .input("SWPEndDate", item.SWPEndDate)
                        .input("XIRR", 0)
                        .input("SWPType", 'SWP');
                    const resultInsert = await requestInsert.execute("InsertClientTransactionAllocationSWP");
                }
            }
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

        return;
    }

    // console.log(clientTransactionId);

    return clientTransactionId;
}

async function getClientTransactionProfiles(associateId) {
    var data = [];

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true));
    const readResult = await readRequest.execute("GetClientTransactionProfiles");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
}

async function getFeedTransactionBSEOrderStatusSell(PANCardNumber) {
    var data = [];

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("PANCardNumber", PANCardNumber);
    const readResult = await readRequest.execute("GetFeedTransactionBSEOrderStatusSell");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset.map(item => {
            const Id = cryptoEngine.ParamEncrypt(item.Id, true);
            const ClientTransactionId = cryptoEngine.ParamEncrypt(item.ClientTransactionId, true);
            const ClientTransactionPortfolioId = cryptoEngine.ParamEncrypt(item.ClientTransactionPortfolioId, true);
            const ClientTransactionAllocationId = cryptoEngine.ParamEncrypt(item.ClientTransactionAllocationId, true);
            var purchaseRedemptionType = '';
            switch (item.PurchaseRedemptionType) {
                case 'P':
                    purchaseRedemptionType = 'Buy';
                    break;
                case 'R':
                    purchaseRedemptionType = 'Sell';
                    break;
                case 'L':
                    purchaseRedemptionType = 'Pledged';
                    break;
                case 'U':
                    purchaseRedemptionType = 'Unpledged';
                    break;
                case 'T':
                    purchaseRedemptionType = 'Dematerialized';
                    break;
                case 'TI':
                    purchaseRedemptionType = 'TICOB';
                    break;
                default:
                    purchaseRedemptionType = item.PurchaseRedemptionType;
                    break;
            }
            const PurchaseRedemptionType = purchaseRedemptionType;
            const IsSelected = false;
            const Priority = 999999;

            return { ...item, Id, ClientTransactionId, ClientTransactionPortfolioId, ClientTransactionAllocationId, PurchaseRedemptionType, IsSelected, Priority };
        });
    }

    return data;
}

async function processHistoryData(historyData) {
    var selectedHistoryData = [];

    if (historyData.length > 0) {
        var existingNewSystemData = historyData.filter(x => x.ClientTransactionId.toUpperCase() != '414E2B5048745659672B513D');
        if (existingNewSystemData.length > 0) {
            var existingNewSystemFirstData = existingNewSystemData.filter(x => x.ClientTransactionId == existingNewSystemData[0].ClientTransactionId && x.Portfolio == existingNewSystemData[0].Portfolio);
            for (let i = 0; i < existingNewSystemFirstData.length; i++) {
                var historyDataItem = historyData.find(x => x.Id == existingNewSystemFirstData[i].Id);
                if (historyDataItem != null) {
                    historyDataItem.Priority = (i + 1);
                    historyDataItem.IsSelected = true;
                    selectedHistoryData.push(historyDataItem);
                }
            }
        }
        else {
            var existingOldSystemData = historyData.filter(x => x.ClientTransactionId.toUpperCase() == '414E2B5048745659672B513D' && x.IsBSEOrder == true);
            // console.log(existingOldSystemData.length);
            if (existingOldSystemData.length > 0) {
                var existingOldSystemFirstData = [];

                if (existingOldSystemData[0].PurchaseRedemptionType == 'Buy') {
                    existingOldSystemFirstData = existingOldSystemData.filter(x => x.OrderDate.toISOString() == existingOldSystemData[0].OrderDate.toISOString()
                        && x.PurchaseRedemptionType == existingOldSystemData[0].PurchaseRedemptionType
                        && x.UCC == existingOldSystemData[0].UCC
                        && x.Portfolio == existingOldSystemData[0].Portfolio);
                }
                else if (existingOldSystemData[0].PurchaseRedemptionType == 'Sell') {
                    // console.log(existingOldSystemData[0].OrderDate.toISOString());
                    existingOldSystemFirstData = existingOldSystemData.filter(x => x.OrderDate.toISOString() == existingOldSystemData[0].OrderDate.toISOString()
                        && x.PurchaseRedemptionType == existingOldSystemData[0].PurchaseRedemptionType);
                }

                // console.log(existingOldSystemFirstData);

                for (let i = 0; i < existingOldSystemFirstData.length; i++) {
                    var historyDataItem = historyData.find(x => x.Id == existingOldSystemFirstData[i].Id);
                    if (historyDataItem != null) {
                        historyDataItem.Priority = (i + 1);
                        historyDataItem.IsSelected = true;
                        selectedHistoryData.push(historyDataItem);
                    }
                }
            }
            else {
                for (let i = 0; i < historyData.length; i++) {
                    var historyDataItem = historyData[i];
                    if (historyDataItem != null) {
                        historyDataItem.Priority = (i + 1);
                        historyDataItem.IsSelected = false;
                    }
                }
            }
        }

        historyData.sort((a, b) => a.Priority - b.Priority);
    }

    return selectedHistoryData;
}

async function saveTransactionTagging(req, res, ClientTransactionId, InvestmentType, PaymentType, ReinvestmentAmount, AdditionalAmount, Allocations) {
    var AllocationData = JSON.parse(Allocations);

    var errorMessage = "Error while client transaction data...";

    try {
        if (cryptoEngine.ParamDecrypt(ClientTransactionId, true) != 0) {
            await tagExistingTransactions(req, res, ClientTransactionId, InvestmentType, PaymentType, AllocationData);
        }
        else {
            await tagOldTransactions(req, res, ClientTransactionId, InvestmentType, PaymentType, ReinvestmentAmount, AdditionalAmount, AllocationData);
        }
    }
    catch (err) {
        console.log(err);
    }
}

async function tagExistingTransactions(req, res, ClientTransactionId, InvestmentType, PaymentType, ReinvestmentAmount, AdditionalAmount, Allocations) {
    var portfolioDataList = Allocations.map(item => {
        const ClientTransactionPortfolioId = item.ClientTransactionPortfolioId;

        return { ClientTransactionPortfolioId };
    });

    const uniqueObjects = new Map();
    portfolioDataList.forEach(obj => {
        const key = JSON.stringify(obj);
        uniqueObjects.set(key, obj);
    });

    var portfolioData = Array.from(uniqueObjects.values());

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        for (let i = 0; i < portfolioData.length; i++) {
            const request = transaction.request();
            request.input("Id", cryptoEngine.ParamDecrypt(portfolioData[i].ClientTransactionPortfolioId, true))
                .input("InvestmentType", InvestmentType)
                .input("ReinvestmentAmount", ReinvestmentAmount)
                .input("AdditionalAmount", AdditionalAmount);
            const result = await request.execute("UpdateClientTransactionPortfolioInvestmentType");
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

        throw Error('Error while tagging existing transaction');
    }
};

async function tagOldTransactions(req, res, ClientTransactionId, InvestmentType, PaymentType, ReinvestmentAmount, AdditionalAmount, Allocations) {
    var transactionTypeId = '414E2B5048745659672B513D';
    var transactionPlanId = '414E2B5048745659672B513D';
    var PANCardNumber = (Allocations[0].FirstHolderPan.trim() != '') ? Allocations[0].FirstHolderPan : Allocations[0].GuardianPan;
    var clientTransactionId = '414E2B5048745659672B513D';
    var currentDate = luxon.DateTime.now().setZone('Asia/Kolkata');
    var amount = Allocations.reduce((sum, fund) => sum + fund.Amount, 0);
    var sellCriteria = '';
    var orderDate = Allocations[0].OrderDate;

    var accountsDataList = Allocations.map(item => {
        const UCC = item.UCC;
        const FirstHolderName = item.FirstHolderName;
        const SecondHolderName = item.SecondHolderName;
        const ThirdHolderName = item.ThirdHolderName;
        const GuardianName = item.GuardianName;
        const Nominee1Name = item.Nominee1Name;
        const Nominee2Name = item.Nominee2Name;
        const Nominee3Name = item.Nominee3Name;
        const ClientAccountId = '414E2B5048745659672B513D';

        return { UCC, FirstHolderName, SecondHolderName, ThirdHolderName, GuardianName, Nominee1Name, Nominee2Name, Nominee3Name, ClientAccountId };
    });

    const uniqueAccountsObjects = new Map();
    accountsDataList.forEach(obj => {
        const key = JSON.stringify(obj);
        uniqueAccountsObjects.set(key, obj);
    });

    var accountsData = Array.from(uniqueAccountsObjects.values());

    for (let a = 0; a < accountsData.length; a++) {
        if (accountsData[a].UCC != '') {
            const readCARequest = req.app.locals.db.request();
            readCARequest.input('UCC', accountsData[a].UCC);
            const readCAResult = await readCARequest.execute("GetClientAccountByUCC");
            if (readCAResult.recordset.length > 0) {
                accountsData[a].ClientAccountId = cryptoEngine.ParamEncrypt(readCAResult.recordset[0].Id, true);
            }
        }
    }

    var systemAccounts = accountsData.filter(item => item.UCC != '');
    var nonSystemAccounts = accountsData.filter(item => item.UCC == '');

    var portfolioTypeDataList = Allocations.map(item => {
        const Name = item.Portfolio;
        const Id = '414E2B5048745659672B513D';
        const RecordOrder = 0;
        const Amount = 0;

        return { Id, Name, RecordOrder, Amount };
    });

    const uniquePortfolioTypeObjects = new Map();
    portfolioTypeDataList.forEach(obj => {
        const key = JSON.stringify(obj);
        uniquePortfolioTypeObjects.set(key, obj);
    });

    var portfolioTypeData = Array.from(uniquePortfolioTypeObjects.values());

    if (Allocations[0].PurchaseRedemptionType == 'Sell') {
        portfolioTypeData.push({ Id: '414E2B5048745659672B513D', Name: 'All', RecordOrder: 0 });
    }

    for (let a = 0; a < portfolioTypeData.length; a++) {
        const readCARequest = req.app.locals.db.request();
        readCARequest.input('Name', portfolioTypeData[a].Name);
        const readCAResult = await readCARequest.execute("GetTransactionPortfolioTypeByName");
        if (readCAResult.recordset.length > 0) {
            portfolioTypeData[a].Id = cryptoEngine.ParamEncrypt(readCAResult.recordset[0].Id, true);
            portfolioTypeData[a].RecordOrder = readCAResult.recordset[0].RecordOrder;
        }

        if (Allocations[0].PurchaseRedemptionType == 'Sell') {
            if (portfolioTypeData[a].Name == 'All') {
                portfolioTypeData[a].Amount = Allocations.reduce((sum, fund) => sum + fund.Amount, 0);
            }
        }
        else {
            portfolioTypeData[a].Amount = Allocations.filter(x => x.Portfolio == portfolioTypeData[a].Name).reduce((sum, fund) => sum + fund.Amount, 0);
        }
    }

    portfolioTypeData.sort((a, b) => a.RecordOrder - b.RecordOrder);

    const readTransactionTypeRequest = req.app.locals.db.request();
    const readTransactionTypeResult = await readTransactionTypeRequest.execute("GetTransactionType");
    if (readTransactionTypeResult.recordset.length > 0) {
        var transactionTypeDataList = readTransactionTypeResult.recordset;

        var transactionTypeName = Allocations[0].PurchaseRedemptionType;
        var code = '';
        switch (transactionTypeName) {
            case 'Buy':
                code = 'B';
                sellCriteria = '';
                break;
            case 'Sell':
                code = 'S';
                sellCriteria = 'A';
                break;
        }

        var transactionType = transactionTypeDataList.find(x => x.Code == code);

        if (transactionType != null) {
            transactionTypeId = cryptoEngine.ParamEncrypt(transactionType.Id, true);
        }
    }

    const readTransactionPlanRequest = req.app.locals.db.request();
    const readTransactionPlanResult = await readTransactionPlanRequest.execute("GetTransactionPlanList");
    if (readTransactionPlanResult.recordset.length > 0) {
        var transactionPlanDataList = readTransactionPlanResult.recordset;

        var transactionPlan = transactionPlanDataList.find(x => x.Code == 'L');

        if (transactionPlan != null) {
            transactionPlanId = cryptoEngine.ParamEncrypt(transactionPlan.Id, true);
        }
    }

    // create transaction
    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const request = transaction.request();
        request.output("Id", msSql.BigInt)
            .input("TransactionDate", orderDate)
            .input("TransactionTypeId", cryptoEngine.ParamDecrypt(transactionTypeId, true))
            .input("PANCardNumber", PANCardNumber)
            .input("TransactionPlanId", cryptoEngine.ParamDecrypt(transactionPlanId, true))
            .input("SellCriteria", sellCriteria)
            .input("SwitchBy", '')
            .input("TradeStatus", 'Completed')
            .input("STPType", '');
        const result = await request.execute("InsertClientTransactionOld");
        clientTransactionId = cryptoEngine.ParamEncrypt(result.output.Id, true);

        // console.log(clientTransactionId);

        for (let a = 0; a < systemAccounts.length; a++) {
            const request = transaction.request();
            request.input("ClientTransactionId", cryptoEngine.ParamDecrypt(clientTransactionId, true))
                .input("ClientAccountId", cryptoEngine.ParamDecrypt(systemAccounts[a].ClientAccountId, true));
            const result = await request.execute("InsertClientTransactionAccount");
        }

        for (let a = 0; a < nonSystemAccounts.length; a++) {
            const request = transaction.request();
            request.input("ClientTransactionId", cryptoEngine.ParamDecrypt(clientTransactionId, true))
                .input("FirstHolderName", nonSystemAccounts[a].FirstHolderName)
                .input("SecondHolderName", nonSystemAccounts[a].SecondHolderName)
                .input("ThirdHolderName", nonSystemAccounts[a].ThirdHolderName)
                .input("FirstNomineeName", nonSystemAccounts[a].Nominee1Name)
                .input("SecondNomineeName", nonSystemAccounts[a].Nominee2Name)
                .input("ThirdNomineeName", nonSystemAccounts[a].Nominee3Name)
                .input("GuardianName", nonSystemAccounts[a].GuardianName);
            const result = await request.execute("InsertClientTransactionNonAccount");
        }

        for (let i = 0; i < portfolioTypeData.length; i++) {
            const transactionPortfolioTypeDetailsRequest = transaction.request();
            transactionPortfolioTypeDetailsRequest.input("ClientTransactionId", cryptoEngine.ParamDecrypt(clientTransactionId, true))
                .input("TransactionPortfolioTypeId", cryptoEngine.ParamDecrypt(portfolioTypeData[i].Id, true));

            const TransactionPortfolioTypeDetailsResult = await transactionPortfolioTypeDetailsRequest.execute("InsertClientTransactionPortfolioType");
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

        throw Error('Error while tagging old transaction');
    }

    var clientTransactionData = await transactionController.GetClientTransaction(req, res, clientTransactionId);

    //create transaction portfolio
    try {
        await transaction.begin();

        for (let i = 0; i < clientTransactionData.PortfolioTypes.length; i++) {
            var portfolioTypeItem = clientTransactionData.PortfolioTypes[i];

            var portfolioItem = clientTransactionData.ClientTransactionPortfolios.find(item => item.ClientTransactionPortfolioTypeId == portfolioTypeItem.ClientTransactionPortfolioTypeId);
            var portfolioTypeDataItem = portfolioTypeData.find(item => item.Id == portfolioTypeItem.TransactionPortfolioTypeId);

            if (portfolioItem == null) {
                const request = transaction.request();
                request.output("Id", msSql.BigInt)
                    .input("ClientTransactionId", cryptoEngine.ParamDecrypt(clientTransactionId, true))
                    .input("ClientTransactionPortfolioTypeId", cryptoEngine.ParamDecrypt(portfolioTypeItem.ClientTransactionPortfolioTypeId, true))
                    .input("Amount", portfolioTypeDataItem.Amount)
                    .input("LumpsumAllocationType", '')
                    .input("LumpsumEquity", 0)
                    .input("LumpsumDebt", 0)
                    .input("IsNewSIP", false)
                    .input("SIPTransactionType", '')
                    .input("SIPModificationType", '')
                    .input("SIPAmount", 0)
                    .input("SIPAllocationType", '')
                    .input("SIPEquity", 0)
                    .input("SIPDebt", 0)
                    .input("SIPTenure", 0)
                    .input("SIPFrequency", '')
                    .input("IsIncrementSIP", false)
                    .input("SIPIncrementTenure", 0)
                    .input("SIPIncrementPercentage", 0)
                    .input("SIPIncrementAmount", 0)
                    .input("SIPStartDateType", '')
                    .input("SIPStartDate", '')
                    .input("IsSIPFirstOrderToday", false)
                    .input("BSESIPCeaseCode", '')
                    .input("SIPCeaseRemark", '')
                    .input("SellFrom", 'R')
                    .input("CustomSellType", '')
                    .input("RationalForTrade", '')
                    .input("TradeStatus", 'Completed')
                    .input("SubTransactionType", 'NA')
                    .input("SWPPercentage", 0)
                    .input("SWPAmount", 0)
                    .input("SWPFrequency", '')
                    .input("SWPStartDate", null)
                    .input("SWPMonths", 0)
                    .input("InvestmentType", InvestmentType)
                    .input("ReinvestmentAmount", ReinvestmentAmount)
                    .input("AdditionalAmount", AdditionalAmount)
                    .input("IsHistoricalRecord", true);
                const result = await request.execute("InsertClientTransactionPortfolio");
            }
            else {
                const request = transaction.request();
                request.input("Id", cryptoEngine.ParamDecrypt(portfolioItem.Id, true))
                    .input("ClientTransactionId", cryptoEngine.ParamDecrypt(clientTransactionId, true))
                    .input("ClientTransactionPortfolioTypeId", cryptoEngine.ParamDecrypt(portfolioTypeItem.ClientTransactionPortfolioTypeId, true))
                    .input("Amount", portfolioTypeDataItem.Amount)
                    .input("LumpsumAllocationType", '')
                    .input("LumpsumEquity", 0)
                    .input("LumpsumDebt", 0)
                    .input("IsNewSIP", false)
                    .input("SIPTransactionType", '')
                    .input("SIPModificationType", '')
                    .input("SIPAmount", 0)
                    .input("SIPAllocationType", '')
                    .input("SIPEquity", 0)
                    .input("SIPDebt", 0)
                    .input("SIPTenure", 0)
                    .input("SIPFrequency", '')
                    .input("IsIncrementSIP", false)
                    .input("SIPIncrementTenure", 0)
                    .input("SIPIncrementPercentage", 0)
                    .input("SIPIncrementAmount", 0)
                    .input("SIPStartDateType", '')
                    .input("SIPStartDate", '')
                    .input("IsSIPFirstOrderToday", false)
                    .input("SellFrom", 'R')
                    .input("CustomSellType", '')
                    .input("SubTransactionType", 'NA')
                    .input("SWPPercentage", 0)
                    .input("SWPAmount", 0)
                    .input("SWPFrequency", '')
                    .input("SWPStartDate", null)
                    .input("SWPMonths", 0)
                    .input("InvestmentType", InvestmentType)
                    .input("ReinvestmentAmount", ReinvestmentAmount)
                    .input("AdditionalAmount", AdditionalAmount)
                    .input("IsHistoricalRecord", true);
                const result = await request.execute("UpdateClientTransactionPortfolio");
            }
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

        throw Error('Error while tagging old transaction');
    }

    clientTransactionData = await transactionController.GetClientTransaction(req, res, clientTransactionId);

    //create transaction allocation
    try {
        await transaction.begin();

        for (let i = 0; i < clientTransactionData.PortfolioTypes.length; i++) {
            var portfolioTypeItem = clientTransactionData.PortfolioTypes[i];

            // console.log(portfolioTypeItem.TransactionPortfolioTypeName);

            if (portfolioTypeItem.TransactionPortfolioTypeName != 'All') {
                var portfolioItem = clientTransactionData.ClientTransactionPortfolios.find(item => item.ClientTransactionPortfolioTypeId == portfolioTypeItem.ClientTransactionPortfolioTypeId);
                var portfolioTypeDataItem = portfolioTypeData.find(item => item.Id == portfolioTypeItem.TransactionPortfolioTypeId);

                var allocations = Allocations.filter(item => item.Portfolio == portfolioTypeItem.TransactionPortfolioTypeName);

                const requestDelete = transaction.request();
                requestDelete.input("ClientTransactionPortfolioId", cryptoEngine.ParamDecrypt(portfolioItem.Id, true))
                    .input("SubTransactionType", 'NA');
                const resultDelete = await requestDelete.execute("DeleteClientTransactionAllocation");

                for (let a = 0; a < allocations.length; a++) {
                    var item = allocations[a];

                    var schemeDetails = await getBseSchemeByIsin(item.ISIN);

                    const requestInsert = transaction.request();
                    requestInsert.input("ClientTransactionPortfolioId", cryptoEngine.ParamDecrypt(portfolioItem.Id, true))
                        .input("BSESchemeId", schemeDetails.Id)
                        .input("ISIN", item.ISIN)
                        .input("IsHoliday", false)
                        .input("IsExitLoadChanged", false)
                        .input("AvailableAmount", 0)
                        .input("FolioNumber", item.FolioNumber)
                        .input("FundAmount", item.Amount)
                        .input("FundUnits", item.Units)
                        .input("FundCategory", '')
                        .input("FundPercentage", 0)
                        .input("FundOtherDetails", JSON.stringify(schemeDetails))
                        .input("AllocationPercentage", 0)
                        .input("SellAll", false)
                        .input("AvailableUnits", 0)
                        .input("SIPStartDate", null)
                        .input("SIPEndDate", null)
                        .input("SIPTenure", 0)
                        .input("SIPIncrementTenure", 0)
                        .input("SIPFrequency", '')
                        .input("SIPDay", 0)
                        .input("IsMinimumInvestmentValid", false)
                        .input("CalculationType", '')
                        .input("Month", 0)
                        .input("AdjustDays", 0)
                        .input("MarketAmount", 0)
                        .input("MarketPercentage", 0)
                        .input("FundMinAmount", 0)
                        .input("BSETradeOn", item.OrderDate)
                        .input("BSEURN", item.InternalRefNumber)
                        .input("BSEOrderId", item.OrderNumber)
                        .input("BSEResponse", item.OrderRemark)
                        .input("BSEOrderStatus", item.OrderStatus)
                        .input("TradeStatus", 'Completed')
                        .input("IsSIP", false)
                        .input("SubTransactionType", 'NA')
                        .input("SWPAmount", 0)
                        .input("SWPInstallmentAmount", 0)
                        .input("SWPMonths", 0)
                        .input("SWPAllocation", 0)
                        .input("SWPStartDate", null)
                        .input("SWPEndDate", null)
                        .input("XIRR", 0)
                        .input("SWPType", '');
                    const resultInsert = await requestInsert.execute("InsertClientTransactionAllocationOld");
                }
            }
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

        throw Error('Error while tagging old transaction');
    }

    //create transaction payment
    if (Allocations[0].PurchaseRedemptionType == 'Buy') {
        clientTransactionData = await transactionController.GetClientTransaction(req, res, clientTransactionId);
        var ClientAccountMandateId = '414E2B5048745659672B513D';
        var ClientKycBankId = '414E2B5048745659672B513D';

        var activeMandates = clientTransactionData.ClientAccount.AccountMandates.filter(item => item.Status == 'APPROVED');
        if (activeMandates.length > 0) {
            ClientAccountMandateId = activeMandates[0].Id;
        }

        var defaultBank = clientTransactionData.ClientAccount.AccountBanks.find(item => item.IsDefault == true);
        if (defaultBank != null) {
            ClientKycBankId = defaultBank.ClientKycBankId;
        }

        try {
            await transaction.begin();

            const requestDelete = transaction.request();
            requestDelete.input("ClientTransactionId", cryptoEngine.ParamDecrypt(clientTransactionId, true));
            const resultDelete = await requestDelete.execute("DeleteClientTransactionPayment");

            if (PaymentType == 'Mandate') {
                if (cryptoEngine.ParamDecrypt(ClientAccountMandateId, true) != 0) {
                    const request = transaction.request();
                    request.output("Id", msSql.BigInt)
                        .input("ClientTransactionId", cryptoEngine.ParamDecrypt(clientTransactionId, true))
                        .input("ClientAccountMandateId", cryptoEngine.ParamDecrypt(ClientAccountMandateId, true))
                        .input("PaymentType", PaymentType);
                    const result = await request.execute("InsertClientTransactionPaymentMandate");
                    var ClientTransactionPaymentId = cryptoEngine.ParamEncrypt(result.output.Id, true);
                }
            }
            else {
                if (cryptoEngine.ParamDecrypt(ClientKycBankId, true) != 0) {
                    const request = transaction.request();
                    request.output("Id", msSql.BigInt)
                        .input("ClientTransactionId", cryptoEngine.ParamDecrypt(clientTransactionId, true))
                        .input("ClientKycBankId", cryptoEngine.ParamDecrypt(ClientKycBankId, true))
                        .input("PaymentType", PaymentType)
                        .input("UPIId", '')
                        .input("UTRNo", '')
                        .input("Amount", amount)
                        .input("ChequeNumber", '')
                        .input("ChequeDate", null)
                        .input("PickupPoint", '')
                        .input("City", '');
                    const result = await request.execute("InsertClientTransactionPayment");
                    var ClientTransactionPaymentId = cryptoEngine.ParamEncrypt(result.output.Id, true);

                    if (PaymentType == 'Cheque') {
                        const requestCheque = transaction.request();
                        requestCheque.input("ClientTransactionPaymentId", cryptoEngine.ParamDecrypt(ClientTransactionPaymentId, true))
                            .input("UniqueId", '')
                            .input("GroupId", '')
                            .input("DepositChallanNumber", '');
                        const resultCheque = await requestCheque.execute("InsertClientTransactionPaymentCheque");
                    }
                }
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

            throw Error('Error while tagging old transaction');
        }
    }
};


function getRandomByteArray(length) {
    const byteArray = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        byteArray[i] = Math.floor(Math.random() * 256);
    }
    return Buffer.from(byteArray);
}