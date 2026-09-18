const msSql = require("mssql");
const xlsx = require('xlsx');
const path = require('path');
const cryptoEngine = require("../models/cryptoengine.model");
const commonFunction = require("../models/commonfunction.model");


exports.UploadImportAssociateExcel = async (req, res) => {

    const errorMessage = 'Error while importing associate data...';
    const workBook = xlsx.read(req.files.documentFile.data);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    

    const transaction = req.app.locals.db.transaction();
    try {
        for (const row of jsonData) {
            await transaction.begin();
            const AssociateName = row['AssociateName'] || '';
            const EntityName = row['EntityName'] || '';
            const IntroducerAssociateName = row['IntroducerAssociateName'] || '';
            const EmployeeName = row['EmployeeName'] || '';
            const AssociateIntroducerEmployeeName = row['AssociateIntroducerEmployeeName'] || '';
            let NormalBank = row['NormalBank'];
            let RiaBank = row['RiaBank'];
            let NomineePrimaryAddress = row['NomineePrimaryAddress'];
            let GuardianPrimaryAddress = row['GuardianPrimaryAddress'];
            const Profession = row['ProfessionType'] || '';
            const AcPerson = row['AcPerson'] || '';
            const AcEmail = row['AcEmail'] || '';
            const AcMobileNumber = row['AcMobileNumber'] || '';
            const AcTelephoneNumber = row['AcTelephoneNumber'] || '';
            const AuthorisedPerson1 = row['AuthorisePerson1'] || '';
            const Email1 = row['Email1'] || '';
            const Mobile1 = row['Mobile1'] || '';
            const AuthorisedPerson2 = row['AuthorisePerson2'] || '';
            const Email2 = row['Email2'] || '';
            const Mobile2 = row['Mobile2'] || '';
            const AuthorisedPerson3 = row['AuthorisePerson3'] || '';
            const Email3 = row['Email3'] || '';
            const Mobile3 = row['Mobile3'] || '';
            const EntityType = row['EntityType'] || '';
            const AadharCardNumber = row['AadharNo'] || '';
            const PANCardNumber = row['PanNo'] || '';
            let DateOfBirth = row['BirthDate']
            let DateOfIncorporation = row['BirthIncorpDate']
            const GSTIN = row['GstNo'] || '';
            let GSTINValidDate = row['GstValidity']
            const ShopCertificateNumber = row['ShopEstNo'] || '';
            let ShopCertificateValidDate = row['ShopEstValidity']
            const TAN = row['TanNo'] || '';
            const PrimaryColor = row['PrimaryColor'] || '';
            const SecondaryColor = row['SecondaryColor'] || '';
            const Address1 = row['Address1'] || '';
            const Address2 = row['Address2'] || '';
            const Address3 = row['Address3'] || '';
            const City = row['City'] || '';
            const State = row['State'] || '';
            const Country = row['Country'] || '';
            const PinCode = row['PinCode'] || '';
            const ARNHolderName = row['ArnName'] || '';
            const ARN = row['ArnNumber'] || '';
            let ARNValidDate = row['ArnValidityDate']
            const EUINHolderName = row['EuinName'] || '';
            const EUIN = row['EuinNumber'] || '';
            let EUINValidDate = row['EuinValidityDate']
            const RIAName = row['RiaName'] || '';
            const RIANumber = row['RiaNumber'] || '';
            let RIAValidDate = row['RiaValidityDate']
            const IsActive = row['IsActive']
            const IsBSEFileUploaded = row['BseUpload']
            const AssociateCode = row['AssociateCode']
            const BSEPassword = row['BsePassword']
            const TelephoneNumber = row['Telephone'] || '';
            const NomineeName = row['NomineeName'] || '';
            let NomineeDateOfBirth = row['NomineeBirthDate'];
            const NomineeEmail = row['NomineeEmail'] || '';;
            const NomineeMobileNumber = row['NomineeMobile'] || '';
            const NomineeAddress1 = row['NomineeAddress1'] || '';
            const NomineeAddress2 = row['NomineeAddress2'] || '';
            const NomineeAddress3 = row['NomineeAddress3'] || '';
            const NomineeCity = row['NomineeCity'] || '';
            const NomineeState = row['NomineeState'] || '';
            const NomineeCountry = row['NomineeCountry'] || '';
            const NomineePinCode = row['NomineePinCode'] || '';
            const NomineeTelephone = row['NomineeTelephone'] || '';
            const GuardianName = row['GuardianName'] || '';
            const GuardianPanNo = row['GuardianPanNo'] || '';
            const GuardianRelation = row['GuardianRelation'] || '';
            const GuardianAddress1 = row['GuardianAddress1'] || '';
            const GuardianAddress2 = row['GuardianAddress2'] || '';
            const GuardianAddress3 = row['GuardianAddress3'] || '';
            const GuardianCity = row['GuardianCity'] || '';
            const GuardianState = row['GuardianState'] || '';
            const GuardianCountry = row['GuardianCountry'] || '';
            const GuardianMobileNumber = row['GuardianMobile'] || '';
            const GuardianPinCode = row['GuardianPinCode'] || '';
            const GuardianEmail = row['GuardianEmail'] || '';
            const GuardianTelephone = row['GuardianTelephone'] || '';
            const NismVaNumber = row['NismVaNo'] || '';
            let NismVaValidDate = row['NismVaValidity'];
            const CaNumber = row['CaNo'] || '';
            let CaValidDate = row['CaValidity']
            const CsNumber = row['CsNo'] || '';
            let CsValidDate = row['CsValidity']
            const CourseName = row['CourseNo'] || '';
            const CourseNumber = row['CourseNumber'] || '';
            let CourseValidDate = row['CourseValidity']
            const NismXaNumber = row['NismXaNo'] || '';
            let NismXaValidDate = row['NismXaValidity']
            const NismXbNumber = row['NismXbNo'] || '';
            let NismXbValidDate = row['NismXbValidity']
            const CfpNumber = row['CfpNo'] || '';
            let CfpValidDate = row['CfpValidity']
            const CwmNumber = row['CwmNo'] || '';
            let CwmValidDate = row['CwmValidity']
            const IFSC = row['IfscNo'] || '';
            const MICR = row['Micr'] || '';
            const BankName = row['BankName'] || '';
            const Branch = row['BranchName'] || '';
            const AccountNumber = row['AccountNo'] || '';
            const BankAccountType = row['BankAccountTypeName'] || '';
            const RIAIFSC = row['RIAIFSC'] || '';
            const RIABankName = row['RIABankName'] || '';
            const RIABranch = row['RIABranch'] || '';
            const RIAMICR = row['RIAMICR'] || '';
            const RIAAccountNumber = row['RIAAccountNumber'] || '';
            const RIABankAccountType = row['RIABankAccountType'] || '';
            const CertificationType = row['CertificationType'] || '';

            // console.log(CertificationType);
            // console.log(CertificationType);

            if (NormalBank == 'NULL') {
                NormalBank = 0;
            }
            if (RiaBank == 'NULL') {
                RiaBank = 1;
            }
            if (NomineePrimaryAddress == 'NULL') {
                NomineePrimaryAddress = 0;
            }
            if (GuardianPrimaryAddress == 'NULL') {
                GuardianPrimaryAddress = 0;
            }
            if (DateOfBirth == 'NULL') {
                DateOfBirth = null;
            }
            if (DateOfIncorporation == 'NULL') {
                DateOfIncorporation = null;
            }
            if (GSTINValidDate == 'NULL') {
                GSTINValidDate = null;
            }

            if (ShopCertificateValidDate == 'NULL') {
                ShopCertificateValidDate = null;
            }

            if (ARNValidDate == 'NULL') {
                ARNValidDate = null;
            }

            if (EUINValidDate == 'NULL') {
                EUINValidDate = null;
            }

            if (RIAValidDate == 'NULL') {
                RIAValidDate = null;
            }

            if (NismVaValidDate == 'NULL') {
                NismVaValidDate = null;
            }

            if (NismXaValidDate == 'NULL') {
                NismXaValidDate = null;
            }

            if (NismXbValidDate == 'NULL') {
                NismXbValidDate = null;
            }


            if (CfpValidDate == 'NULL') {
                CfpValidDate = null;
            }


            if (CwmValidDate == 'NULL') {
                CwmValidDate = null;
            }

            if (CaValidDate == 'NULL') {
                CaValidDate = null;
            }

            if (CsValidDate == 'NULL') {
                CsValidDate = null;
            }

            if (CourseValidDate == 'NULL') {
                CourseValidDate = null;
            }

            if (NomineeDateOfBirth == 'NULL') {
                NomineeDateOfBirth = null;
            }

            const importAssociateRequest = transaction.request();
            importAssociateRequest.input("Profession", Profession)
                .input("EntityName", EntityName)
                .input("EntityType", EntityType)
                .input("AuthorisedPerson1", AuthorisedPerson1)
                .input("Email1", Email1)
                .input("Mobile1", Mobile1)
                .input("AuthorisedPerson2", AuthorisedPerson2)
                .input("Email2", Email2)
                .input("Mobile2", Mobile2)
                .input("AuthorisedPerson3", AuthorisedPerson3)
                .input("Email3", Email3)
                .input("Mobile3", Mobile3)
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
                .input("Address1", Address1)
                .input("Address2", Address2)
                .input("Address3", Address3)
                .input("City", City)
                .input("Country", Country)
                .input("State", State)
                .input("PinCode", PinCode)
                .input("MobileNumber", AcMobileNumber)
                .input("TelephoneNumber", AcTelephoneNumber)
                .input("Email", AcEmail)
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
                .input("CertificationType", CertificationType)
                .input("NormalBank", NormalBank)
                .input("RiaBank", RiaBank)
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
            if (NormalBank == 1) {
                importAssociateRequest.input("IFSC", IFSC)
                    .input("BankName", BankName)
                    .input("Branch", Branch)
                    .input("MICR", MICR)
                    .input("BankAccountType", BankAccountType)
                    .input("AccountNumber", AccountNumber);
            }
            if (RiaBank == 0) {
                importAssociateRequest.input("IFSC", RIAIFSC)
                    .input("BankName", RIABankName)
                    .input("Branch", RIABranch)
                    .input("MICR", RIAMICR)
                    .input("BankAccountType", RIABankAccountType)
                    .input("AccountNumber", RIAAccountNumber);
            }

            const ImportAssociateResult = await importAssociateRequest.execute("ImportAssociate");
            await transaction.commit();
        }

        for (const row of jsonData) {
            await transaction.begin();
            const PANCardNumber = row['PanNo'] || '';
            const IntroducerAssociatePan = row['IntroducerAssociatePan'] || '';
            const BusinessTagAssociatePanNo = row['BusinessTagAssociatePanNo'] || '';


            const findAssociateIdRequest = transaction.request();
            findAssociateIdRequest.input("PANCardNumber", PANCardNumber);
            const findAssociateIdResult = await findAssociateIdRequest.execute('GetAssociateIdByPanCardNumber');


            var photoIdData;

            if (findAssociateIdResult.recordset.length > 0) {
                photoIdData = findAssociateIdResult.recordset[0];
            }

            let AssociateId = photoIdData.Id;
            let UserName = photoIdData.PANCardNumber;
            let EntityDate = (photoIdData.DateOfIncorporation != null) ? photoIdData.DateOfIncorporation : photoIdData.DateOfBirth;
            // console.log("AssociateId", AssociateId);
            // console.log("UserName", UserName);

            let passwordDate = new Date((new Date(EntityDate)).toISOString().slice(0, -1));
            let newPassword = UserName.toUpperCase().substr(0, 5) + commonFunction.padLeft(passwordDate.getDate().toString(), '0', 2) + commonFunction.padLeft((passwordDate.getMonth() + 1).toString(), '0', 2);
            var Password = cryptoEngine.Encrypt(newPassword, true);
            var PIN = cryptoEngine.Encrypt(commonFunction.GetRandomNumber(6), true);

            const findIntroducerAssociateIdRequest = transaction.request();
            findIntroducerAssociateIdRequest.input("PANCardNumber", IntroducerAssociatePan);
            const findIntroducerAssociateIdResult = await findIntroducerAssociateIdRequest.execute('GetIntroducerAssociateIdByPanCardNumber');

            let IntroducerAssociateId = 0;
            if (findIntroducerAssociateIdResult.recordset.length > 0) {
                IntroducerAssociateId = findIntroducerAssociateIdResult.recordset[0].Id;
            }
            // console.log("IntroducerAssociateId", IntroducerAssociateId);

            const InsertAssociateIntroducerRequest = transaction.request();
            InsertAssociateIntroducerRequest.input("AssociateId", AssociateId)
                .input("IntroducerAssociateId", IntroducerAssociateId)
            const InsertAssociateIntroducerResult = await InsertAssociateIntroducerRequest.execute("InsertAssociateIntroducer");

            if (BusinessTagAssociatePanNo != '') {
                const findBusinessAssociateIdRequest = transaction.request();
                findBusinessAssociateIdRequest.input("PANCardNumber", BusinessTagAssociatePanNo);
                const findBusinessAssociateIdResult = await findBusinessAssociateIdRequest.execute('GetIntroducerAssociateIdByPanCardNumber');


                let AssociateBusinessId = 0;
                if (findBusinessAssociateIdResult.recordset.length > 0) {
                    AssociateBusinessId = findBusinessAssociateIdResult.recordset[0].Id;
                }
                //console.log("AssociateBusinessId",AssociateBusinessId);

                const InsertAssociateBusinessTagRequest = transaction.request();
                InsertAssociateBusinessTagRequest.input("AssociateId", AssociateId)
                    .input("AssociateBusinessId", AssociateBusinessId)
                const InsertAssociateBusinessTagResult = await InsertAssociateBusinessTagRequest.execute("InsertAssociateBusinessTag");
            }

            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("UserName", UserName.toUpperCase())
                .input("Password", Password)
                .input("PIN", PIN)
                .input("IsActive", false)
                .input("Email", "");
            const result = await request.execute("InsertAppUser");
            // console.log(result);
            Id = result.output.Id
            // console.log(Id);


            const insertAppUserAssociateRequest = transaction.request();
            insertAppUserAssociateRequest.input("AppUserId", Id)
                .input("AssociateId", AssociateId);
            const insertAppUserAssociateResult = await insertAppUserAssociateRequest.execute("InsertAppUserAssociate");
            await transaction.commit();
        }
        res.status(200).send({ Status: true, Message: "File Import successfully." });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).send(errorMessage);
    }
};

function getRandomByteArray(length) {
    const byteArray = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        byteArray[i] = Math.floor(Math.random() * 256);
    }
    return Buffer.from(byteArray);
}

exports.UploadImportAssociateDocumentExcel = async (req, res) => {
    const errorMessage = 'Error while importing associate document data...';
    const workBook = xlsx.read(req.files.documentFile.data);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    
    const transaction = req.app.locals.db.transaction();
    try {
        for (const row of jsonData) {
            await transaction.begin();

            let PANCardNumber = row['PanNo'] || '';
            let FileName = row['FileName'] || '';
            let Name = row['FName'];


            if (Name == 'pan_upload') {
                Name = 'PAN Card';
            }
            if (Name == 'photo_upload') {
                Name = 'Self Photo';
            }
            if (Name == 'aadhar_upload') {
                Name = 'Aadhar Card';
            }
            if (Name == 'address_upload') {
                Name = 'Address Proof';
            }
            if (Name == 'cheque_upload') {
                Name = 'Bank Proof';
            }
            if (Name == 'gst_upload') {
                Name = 'GSTIN Certificate';
            }
            if (Name == 'logo_upload') {
                Name = 'Logo';
            }
            if (Name == 'shop_est_upload') {
                Name = 'Shop Establishment Certificate';
            }
            if (Name == 'co_moa_upload') {
                Name = 'Memorandum of Association';
            }
            if (Name == 'co_aoa_upload') {
                Name = 'Article of Association';
            }
            if (Name == 'co_coi_upload') {
                Name = 'Ceriticate of Incorporation';
            }
            if (Name == 'pd_coi_upload') {
                Name = 'Ceriticate of Incorporation';
            }
            if (Name == 'co_asl_upload') {
                Name = 'Authorized Signatory List';
            }
            if (Name == 'pd_asl_upload') {
                Name = 'Authorized Signatory List';
            }
            if (Name == 'co_br_upload') {
                Name = 'Board Resolution';
            }
            if (Name == 'co_tan_upload') {
                Name = 'TAN Certificate';
            }
            if (Name == 'arn_upload') {
                Name = 'ARN Proof';
            }
            if (Name == 'euin_upload') {
                Name = 'EUIN Proof';
            }
            if (Name == 'nism_va_upload') {
                Name = 'NISM VA Certificate';
            }
            if (Name == 'nism_xa_upload') {
                Name = 'NISM XA Certificate';
            }
            if (Name == 'nism_xb_upload') {
                Name = 'NISM XB Certificate';
            }
            if (Name == 'guardian_pan_upload') {
                Name = 'Nominee Guardian PAN Card';
            }
            if (Name == 'ria_check_upload') {
                Name = 'Bank Proof RIA';
            }
            if (Name == 'mfd_ria_check_upload') {
                Name = 'Bank Proof RIA';
            }
            if (Name == 'ria_upload') {
                Name = 'RIA Proof';
            }
            if (Name == 'ca_upload') {
                Name = 'CA Certificate';
            }
            if (Name == 'cs_upload') {
                Name = 'CS Certificate';
            }
            if (Name == 'course_upload') {
                Name = 'Course Certificate';
            }
            if (Name == 'pd_upload') {
                Name = 'Partnership Deed';
            }
            if (Name == 'registration_upload') {
                Name = 'Associate Form';
            }


            if (FileName != '') {

                const findAssociateIdRequest = transaction.request();
                findAssociateIdRequest.input("PANCardNumber", PANCardNumber);
                const findAssociateIdResult = await findAssociateIdRequest.execute('GetAssociateIdByPanCardNumber');

                var photoIdData;

                if (findAssociateIdResult.recordset.length > 0) {
                    photoIdData = findAssociateIdResult.recordset[0];
                }

                let AssociateId = photoIdData.Id;
                let FileContent = getRandomByteArray(1);
                const InsertImportAssociateDocumentRequest = transaction.request();
                // InsertImportAssociateDocumentRequest.output("Id", msSql.BigInt)
                InsertImportAssociateDocumentRequest.input("AssociateId", AssociateId)
                .input("Name", Name)
                .input("FileName", FileName)
                .input("FileContent", FileContent)
                .input("FileContentType", " ")
                const InsertAssociateIntroducerResult = await InsertImportAssociateDocumentRequest.execute("InsertImportAssociateDocument");
            }

        await transaction.commit();
        }
        res.status(200).send({ Status: true, Message: "File Import successfully." });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).send(errorMessage);
    }
};



exports.UploadImportEmployeeExcel = async (req, res) => {
 
    const errorMessage = 'Error while importing employee data...';
    const workBook = xlsx.read(req.files.documentFile.data);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);


    const transaction = req.app.locals.db.transaction();
    try {
        for (const row of jsonData) {
            await transaction.begin();


            const AssociateName = row['AssociateName'] || '';
            const EmployeeName = row['EmployeeName'] || '';
            const DesignationName = row['DesignationName'] || '';
            const MobileNumber = row['MobileNumber'] || '';
            const TelephoneNumber = row['TelephoneNumber'] || '';
            const Email = row['Email'] || '';
            const HealthIssue = row['HealthIssue'] || '';
            const EmergencyContactName1 = row['EmergncyContactName1'] || '';
            const EmergencyMobileNumber1 = row['EmergncyMobileNumber1'] || '';
            const EmergencyEmail1 = row['EmergncyContactEmail1'] || '';
            const EmergencyContactName2 = row['EmergncyContactName2'] || '';
            const EmergencyMobileNumber2 = row['EmergncyMobileNumber2'] || '';
            const EmergencyEmail2 = row['EmergncyContactEmail2'] || '';
            const PANCardNumber = row['PanNo'] || '';
            const AadharCardNumber = row['AadharNo'] || '';
            let DateOfBirth = row['BirthDate'];
            let DateOfAnniversary = row['AnniversaryDate'];
            const IFSC = row['IfscNo'] || '';
            const MICR = row['Micr'] || '';
            const BankName = row['BankName'] || '';
            const Branch = row['BranchName'] || '';
            const AccountNumber = row['AccountNo'] || '';
            const BankAccountType = row['BankAccountTypeName'] || '';
            const BloodGroup = row['BloodGroup'] || '';
            const CAddress1 = row['CorrespondenceAddress1'] || '';
            const CAddress2 = row['CorrespondenceAddress2'] || '';
            const CAddress3 = row['CorrespondenceAddress3'] || '';
            const CCity = row['CorrespondenceCity'] || '';
            const CState = row['CorrespondenceState'] || '';
            const CCountry = row['CorrespondenceCountry'] || '';
            const CPinCode = row['CorrespondencePinCode'] || '';
            let IsPermanent = row['DefaultAddress'];
            const NismVaNumber = row['NismVaNo'] || '';
            let NismVaValidDate = row['NismVaValidity'];
            const EUINHolderName = row['EuinName'] || '';
            const EUIN = row['EuinNumber'] || '';
            let EUINValidDate = row['EuinValidityDate']
            const CaNumber = row['CaNo'] || '';
            let CaValidDate = row['CaValidity']
            const CsNumber = row['CsNo'] || '';
            let CsValidDate = row['CsValidity']
            const CourseName = row['CourseNo'] || '';
            const CourseNumber = row['CourseNumber'] || '';
            let CourseValidDate = row['CourseValidity']
            const CertificationType = row['CertificationType'] || '';
            const DepartmentName = row['DepartmentName'] || '';
            const SubDepartmentName = row['SubDepartmentName'] || '';



            if (DateOfBirth == 'NULL') {
                DateOfBirth = null;
            }
            if (DateOfAnniversary == 'NULL') {
                DateOfAnniversary = null;
            }

            if (IsPermanent == 'NULL') {
                IsPermanent = 0;
            }

            if (EUINValidDate == 'NULL') {
                EUINValidDate = null;
            }

            if (NismVaValidDate == 'NULL') {
                NismVaValidDate = null;
            }

            if (CaValidDate == 'NULL') {
                CaValidDate = null;
            }

            if (CsValidDate == 'NULL') {
                CsValidDate = null;
            }

            if (CourseValidDate == 'NULL') {
                CourseValidDate = null;
            }


            const importEmployeeRequest = transaction.request();
            importEmployeeRequest.input("AssociateName", AssociateName)
                .input("Name", EmployeeName)
                .input("DesignationName", DesignationName)
                .input("MobileNumber", MobileNumber)
                .input("TelephoneNumber", TelephoneNumber)
                .input("Email", Email)
                .input("HealthIssues", HealthIssue)
                .input("EmergencyContactName1", EmergencyContactName1)
                .input("EmergencyMobileNumber1", EmergencyMobileNumber1)
                .input("EmergencyEmail1", EmergencyEmail1)
                .input("EmergencyContactName2", EmergencyContactName2)
                .input("EmergencyMobileNumber2", EmergencyMobileNumber2)
                .input("EmergencyEmail2", EmergencyEmail2)
                .input("PANCardNumber", PANCardNumber)
                .input("AadharCardNumber", AadharCardNumber)
                .input("DateOfBirth", DateOfBirth)
                .input("DateOfAnniversary", DateOfAnniversary)
                .input("IFSC", IFSC.toUpperCase())
                .input("BankName", BankName)
                .input("Branch", Branch)
                .input("MICR", MICR)
                .input("BankAccountType", BankAccountType)
                .input("AccountNumber", AccountNumber)
                .input("BloodGroupName", BloodGroup)
                .input("NismVaNumber", NismVaNumber)
                .input("NismVaValidDate", NismVaValidDate)
                .input("EUINHolderName", EUINHolderName)
                .input("EUIN", EUIN)
                .input("EUINValidDate", EUINValidDate)
                .input("CANumber", CaNumber)
                .input("CAValidDate", CaValidDate)
                .input("CSNumber", CsNumber)
                .input("CSValidDate", CsValidDate)
                .input("DegreeName", CourseName)
                .input("DegreeNumber", CourseNumber)
                .input("DegreeValidDate", CourseValidDate)
                .input("CertificationType", CertificationType)
                .input("DepartmentName", DepartmentName)
                .input("SubDepartmentName", SubDepartmentName)

            if (IsPermanent == 1) {
                importEmployeeRequest.input("CAddress1", CAddress1)
                    .input("CAddress2", CAddress2)
                    .input("CAddress3", CAddress3)
                    .input("CCity", CCity)
                    .input("CCountry", CCountry)
                    .input("CState", CState)
                    .input("CPinCode", CPinCode)
                    .input("IsPermanentSame", IsPermanent)
                    .input("PAddress1", CAddress1)
                    .input("PAddress2", CAddress2)
                    .input("PAddress3", CAddress3)
                    .input("PCity", CCity)
                    .input("PCountry", CCountry)
                    .input("PState", CState)
                    .input("PPinCode", CPinCode)
            }
            const ImportEmployeeResult = await importEmployeeRequest.execute("ImportEmployee");
            await transaction.commit();
        }

        for (const row of jsonData) {
            await transaction.begin();
            const PANCardNumber = row['PanNo'] || '';
            const findEmployeeIdRequest = transaction.request();
            findEmployeeIdRequest.input("PANCardNumber", PANCardNumber);
            const findEmployeeIdResult = await findEmployeeIdRequest.execute('GetEmployeeIdByPanCardNumber');


            var photoIdData;

            if (findEmployeeIdResult.recordset.length > 0) {
                photoIdData = findEmployeeIdResult.recordset[0];
            }

            let EmployeeId = photoIdData.Id;
            let UserName = photoIdData.PANCardNumber;
            let EntityDate = photoIdData.DateOfBirth;
            // console.log("EmployeeId", EmployeeId);
            // console.log("UserName", UserName);

            let passwordDate = new Date((new Date(EntityDate)).toISOString().slice(0, -1));
            let newPassword = UserName.toUpperCase().substr(0, 5) + commonFunction.padLeft(passwordDate.getDate().toString(), '0', 2) + commonFunction.padLeft((passwordDate.getMonth() + 1).toString(), '0', 2);
            var Password = cryptoEngine.Encrypt(newPassword, true);
            var PIN = cryptoEngine.Encrypt(commonFunction.GetRandomNumber(6), true);

            const request = transaction.request();

            request.output("Id", msSql.BigInt)
                .input("UserName", UserName.toUpperCase())
                .input("Password", Password)
                .input("PIN", PIN)
                .input("IsActive", false)
                .input("Email", "");
            const result = await request.execute("InsertAppUser");
            // console.log(result);

            Id = result.output.Id
            // console.log(Id);


            const insertAppUserEmployeeRequest = transaction.request();
            insertAppUserEmployeeRequest.input("AppUserId", Id)
                .input("EmployeeId", EmployeeId);
            const insertAppUserEmployeeResult = await insertAppUserEmployeeRequest.execute("InsertAppUserEmployee");



            await transaction.commit();

        }
        res.status(200).send({ Status: true, Message: "File Import successfully." });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).send(errorMessage);
    }
};


exports.UploadImportEmployeeDocumentExcel = async (req, res) => {
    const errorMessage = 'Error while importing employee document data...';
    const workBook = xlsx.read(req.files.documentFile.data);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    
    const transaction = req.app.locals.db.transaction();
    try {
        for (const row of jsonData) {
            await transaction.begin();

            let PANCardNumber = row['PanNo'] || '';
            let FileName = row['FileName'] || '';
            let Name = row['FName'];


            if (Name == 'pan_upload') {
                Name = 'PAN Card';
            }
            if (Name == 'photo_upload') {
                Name = 'Self Photo';
            }
            if (Name == 'aadhar_upload') {
                Name = 'Aadhar Card';
            }
            if (Name == 'c_address_upload') {
                Name = 'Correspondence Address Proof';
            }
            if (Name == 'foreign_address_upload') {
                Name = 'Permanent Address Proof';
            }
            if (Name == 'cheque_upload') {
                Name = 'Bank Proof';
            }
            if (Name == 'euin_upload') {
                Name = 'EUIN Proof';
            }
            if (Name == 'nism_va_upload') {
                Name = 'NISM VA Certificate';
            }
            if (Name == 'ria_check_upload') {
                Name = 'Bank Proof RIA';
            }
            if (Name == 'ca_upload') {
                Name = 'CA Certificate';
            }
            if (Name == 'cs_upload') {
                Name = 'CS Certificate';
            }
            if (Name == 'course_upload') {
                Name = 'Degree Certificate';
            }
        
          
            if (FileName != '') {

                const findEmployeeIdRequest = transaction.request();
                findEmployeeIdRequest.input("PANCardNumber", PANCardNumber);
                const findEmployeeIdResult = await findEmployeeIdRequest.execute('GetEmployeeIdByPanCardNumber');

                var photoIdData;

                if (findEmployeeIdResult.recordset.length > 0) {
                    photoIdData = findEmployeeIdResult.recordset[0];
                }

                let EmployeeId = photoIdData.Id;
                let FileContent = getRandomByteArray(1);
                const InsertImportEmployeeDocumentRequest = transaction.request();
                // InsertImportAssociateDocumentRequest.output("Id", msSql.BigInt)
                InsertImportEmployeeDocumentRequest.input("EmployeeId", EmployeeId)
                .input("Name", Name)
                .input("FileName", FileName)
                .input("FileContent", FileContent)
                .input("FileContentType", " ")
                const InsertEmployeeDocumentResult = await InsertImportEmployeeDocumentRequest.execute("InsertImportEmployeeDocument");
            }

        await transaction.commit();
        }
        res.status(200).send({ Status: true, Message: "File Import successfully." });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).send(errorMessage);
    }
};