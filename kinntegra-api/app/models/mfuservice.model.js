var https = require('https');
const mfuConfig = require("../configs/mfu.config");
const date = require('date-and-time');
const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");
const appPool = require("../models/db.model");
const xml2json = require('xml2js');
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');
const commonFunction = require('./commonfunction.model');
const path = require('path');
const fileSystem = require("fs");
const pdfjsLib = require('pdfjs-dist');
const pdfJSWorker = require('pdfjs-dist/build/pdf.worker');
const canvas = require('canvas');
const joinImages = require('join-images-updated');
const Jimp = require("jimp");
const formData = require('form-data');

const MFUService = function () { }

MFUService.UploadClientECAN = async (data) => {
    try {
        var MFUUID = commonFunction.GetRandomNumber(15);
        var inputData = await MFUService.PrepareClientECANXml(data, MFUUID);

        // console.log(inputData);

        return new Promise((resolve, reject) => {

            var headers = { 'Accept': '*/*', 'Content-type': 'application/xml', 'Content-Length': Buffer.byteLength(inputData.toString()) };
            var options = {
                host: process.env.MFU_API_LINK,
                port: process.env.MFU_API_PORT,
                path: '/MFUCanFillEezzService',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            var request = https.request(options, function (response) {
                response.setEncoding('utf8');

                let responseData = '';

                response.on('data', (chunk) => { responseData += chunk });

                response.on('end', () => {
                    const resultData = responseData.toString();

                    // console.log(resultData);

                    const xmlData = new DOMParser().parseFromString(resultData, 'text/xml');

                    // console.log(xmlData);

                    var parser = new xml2json.Parser();
                    parser.parseString(xmlData, async (err, result) => {
                        // console.log(JSON.stringify(result));
                        // console.log(err);

                        let CANIndFillEezzResp = {
                            RESP_HEADER: {
                                ENTITY_ID: '',
                                UNIQUE_ID: '',
                                REQUEST_TYPE: '',
                                VERSION_NO: '',
                                TIMESTAMP: '',
                                RES_CODE: '',
                                RES_MSG: '',
                            },
                            RESP_BODY: {
                                CAN: '',
                                NOM_VER_LINK_H1: '',
                                NOM_VER_LINK_H2: '',
                                NOM_VER_LINK_H3: ''
                            },
                        };

                        CANIndFillEezzResp.RESP_HEADER.ENTITY_ID = result["CANIndFillEezzResp"]["RESP_HEADER"][0]["ENTITY_ID"][0];
                        CANIndFillEezzResp.RESP_HEADER.UNIQUE_ID = result["CANIndFillEezzResp"]["RESP_HEADER"][0]["UNIQUE_ID"][0];
                        CANIndFillEezzResp.RESP_HEADER.REQUEST_TYPE = result["CANIndFillEezzResp"]["RESP_HEADER"][0]["REQUEST_TYPE"][0];
                        CANIndFillEezzResp.RESP_HEADER.VERSION_NO = result["CANIndFillEezzResp"]["RESP_HEADER"][0]["VERSION_NO"][0];
                        CANIndFillEezzResp.RESP_HEADER.TIMESTAMP = result["CANIndFillEezzResp"]["RESP_HEADER"][0]["TIMESTAMP"][0];
                        CANIndFillEezzResp.RESP_HEADER.RES_CODE = result["CANIndFillEezzResp"]["RESP_HEADER"][0]["RES_CODE"][0];
                        CANIndFillEezzResp.RESP_HEADER.RES_MSG = result["CANIndFillEezzResp"]["RESP_HEADER"][0]["RES_MSG"][0];

                        if (CANIndFillEezzResp.RESP_HEADER.RES_CODE.toString() == "0") {
                            CANIndFillEezzResp.RESP_BODY.CAN = result["CANIndFillEezzResp"]["RESP_BODY"][0]["CAN"][0];
                            CANIndFillEezzResp.RESP_BODY.NOM_VER_LINK_H1 = result["CANIndFillEezzResp"]["RESP_BODY"][0]["NOM_VER_LINK_H1"][0];
                            CANIndFillEezzResp.RESP_BODY.NOM_VER_LINK_H2 = result["CANIndFillEezzResp"]["RESP_BODY"][0]["NOM_VER_LINK_H2"][0];
                            CANIndFillEezzResp.RESP_BODY.NOM_VER_LINK_H3 = result["CANIndFillEezzResp"]["RESP_BODY"][0]["NOM_VER_LINK_H3"][0];
                        }

                        await MFUService.CreateMFULog(cryptoEngine.ParamDecrypt(data.Id, true), 0, 'eCAN', MFUUID, CANIndFillEezzResp.RESP_HEADER.RES_CODE, CANIndFillEezzResp.RESP_HEADER.RES_MSG, resultData);

                        if (CANIndFillEezzResp.RESP_HEADER.RES_CODE.toString() == "0") {
                            await MFUService.UpdateClientAccountMFUStatus(data, CANIndFillEezzResp);

                            resolve(CANIndFillEezzResp);
                        }
                        else {
                            resolve(CANIndFillEezzResp);
                        }
                        // console.log(encryptedPassword);
                    });
                });
            });

            request.on('error', function (err) {
                console.log(err);
                reject(err);
            });

            request.on('timeout', () => {
                request.destroy();
                reject(new Error('Timeout'));
            });

            request.write(inputData);

            request.end();
        });
    }
    catch (err) {
        console.log(err);
    }
};

MFUService.PrepareClientECANXml = async (data, MFUUID) => {
    var encryptedPassword = cryptoEngine.MFUEncrypt(mfuConfig.Password, false);

    var firstHolder = data.AccountHolders.find(x => x.SerialNumber === 1);
    var secondHolder = data.AccountHolders.find(x => x.SerialNumber === 2);
    var thirdHolder = data.AccountHolders.find(x => x.SerialNumber === 3);

    var xml = "<CANIndFillEezzReq xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:noNamespaceSchemaLocation=\"CANIndFillEezzReq.xsd\">";
    xml += "    <REQ_HEADER>";
    xml += "        <ENTITY_ID>" + mfuConfig.EntityId + "</ENTITY_ID>";
    xml += "        <UNIQUE_ID>" + MFUUID + "</UNIQUE_ID>";
    xml += "        <REQUEST_TYPE>CANINDREG</REQUEST_TYPE>";
    xml += "        <LOG_USER_ID>" + mfuConfig.LoginId + "</LOG_USER_ID>";
    xml += "        <EN_ENCR_PASSWORD>" + encryptedPassword + "</EN_ENCR_PASSWORD>";
    xml += "        <VERSION_NO>1.00</VERSION_NO>";
    xml += "        <TIMESTAMP>" + date.format(new Date(), "YYYY-MM-DDTHH:mm:ss") + "</TIMESTAMP>";
    xml += "    </REQ_HEADER>";
    xml += "    <REQ_BODY>";
    xml += "        <REQ_EVENT>" + ((data.IsAccountCreatedAtMFU == true) ? "CM" : "CR") + "</REQ_EVENT>";
    if (data.IsAccountCreatedAtMFU == true) {
        xml += "        <CAN>" + data.MFUCAN + "</CAN>";
    }
    else {
        xml += "        <CAN/>";
    }
    xml += "        <REG_TYPE>E</REG_TYPE>";
    xml += "        <PROOF_UPLOAD_BY_CAN>Y</PROOF_UPLOAD_BY_CAN>";
    xml += "        <ENABLE_ONLINE_ACCESS_FLAG>N</ENABLE_ONLINE_ACCESS_FLAG>";
    xml += "        <ENTITY_EMAIL_DETAILS>";
    xml += "            <EMAIL_ID>" + mfuConfig.EntityEmail + "</EMAIL_ID>";
    xml += "            <EMAIL_ID/>";
    xml += "        </ENTITY_EMAIL_DETAILS>";
    xml += "        <HOLDING_TYPE>" + data.AccountTypeCode + "</HOLDING_TYPE>";
    xml += "        <INV_CATEGORY>" + MFUService.GetMfuInvestorCategoryCode(firstHolder.ProfileDetails.Age, data.AccountProfileType) + "</INV_CATEGORY>";
    xml += "        <TAX_STATUS>" + MFUService.GetMfuTaxStatusCode(firstHolder.ProfileDetails.TaxStatusCode) + "</TAX_STATUS>";
    if (firstHolder.IsMinorProfile == true) {
        xml += "        <HOLDER_COUNT>" + (data.AccountHolders.length + 1) + "</HOLDER_COUNT>";
    }
    else {
        xml += "        <HOLDER_COUNT>" + data.AccountHolders.length + "</HOLDER_COUNT>";
    }
    xml += "        <HOLDER_RECORDS>";

    xml += "            <HOLDER_RECORD>";
    xml += "                <HOLDER_TYPE>" + MFUService.GetMfuHolderTypeCode(1) + "</HOLDER_TYPE>";
    xml += "                <NAME>" + firstHolder.ProfileDetails.Name + "</NAME>";
    xml += "                <DOB>" + date.format(firstHolder.ProfileDetails.DateOfBirth, 'YYYY-MM-DD') + "</DOB>";
    xml += "                <PAN_EXEMPT_FLAG>N</PAN_EXEMPT_FLAG>";
    if (firstHolder.IsMinorProfile == true) {
        xml += "                <PAN_PEKRN_NO/>";
    }
    else {
        xml += "                <PAN_PEKRN_NO>" + firstHolder.ProfileDetails.PANCardNumber + "</PAN_PEKRN_NO>";
    }
    xml += "                <AADHAAR_NO/>";
    if (firstHolder.IsMinorProfile == true) {
        xml += "                <RELATIONSHIP>" + MFUService.GetMfuRelationCode(firstHolder.ProfileDetails.RelationName) + "</RELATIONSHIP>";
        xml += "                <REL_PROOF>01</REL_PROOF>";
    }
    else {
        xml += "                <RELATIONSHIP/>";
        xml += "                <REL_PROOF/>";
    }
    xml += "                <CONTACT_DETAIL>";
    xml += "                    <RES_ISD/>";
    xml += "                    <RES_STD/>";
    xml += "                    <RES_PHONE_NO/>";
    xml += "                    <MOB_ISD_CODE/>";
    xml += "                    <PRI_MOB_NO>" + firstHolder.ProfileDetails.MobileNumber + "</PRI_MOB_NO>";
    xml += "                    <PRI_MOB_BELONGSTO>" + firstHolder.ProfileDetails.MobileSelfDeclarationCode + "</PRI_MOB_BELONGSTO>";
    xml += "                    <ALT_MOB_NO/>";
    xml += "                    <OFF_ISD/>";
    xml += "                    <OFF_STD/>";
    xml += "                    <OFF_PHONE_NO/>";
    xml += "                    <PRI_EMAIL>" + firstHolder.ProfileDetails.Email + "</PRI_EMAIL>";
    xml += "                    <PRI_EMAIL_BELONGSTO>" + firstHolder.ProfileDetails.EmailSelfDeclarationCode + "</PRI_EMAIL_BELONGSTO>";
    xml += "                    <ALT_EMAIL/>";
    xml += "                </CONTACT_DETAIL>";
    xml += "                <OTHER_DETAIL>";
    xml += "                    <GROSS_INCOME>" + MFUService.GetMfuGrossAnnualIncomeCode(firstHolder.ProfileDetails.GrossAnnualIncomeCode) + "</GROSS_INCOME>";
    xml += "                    <NET_WORTH>" + firstHolder.ProfileDetails.NetWorth + "</NET_WORTH>";
    xml += "                    <NET_DATE>" + date.format(firstHolder.ProfileDetails.NetWorthDate, 'YYYY-MM-DD') + "</NET_DATE>";
    xml += "                    <SOURCE_OF_WEALTH>" + firstHolder.ProfileDetails.WealthSourceCode + "</SOURCE_OF_WEALTH>";
    if (firstHolder.ProfileDetails.WealthSourceCode == '08') {
        xml += "                    <SOURCE_OF_WEALTH_OTH>" + firstHolder.ProfileDetails.WealthSourceName + "</SOURCE_OF_WEALTH_OTH>";
    }
    else {
        xml += "                    <SOURCE_OF_WEALTH_OTH/>";
    }
    xml += "                    <KRA_ADDR_TYPE>" + firstHolder.CommincationDetails.LocalAddressTypeCode + "</KRA_ADDR_TYPE>";
    xml += "                    <OCCUPATION>" + MFUService.GetMfuOccupationCode(firstHolder.ProfileDetails.OccupationCode) + "</OCCUPATION>";
    if (MFUService.GetMfuOccupationCode(firstHolder.ProfileDetails.OccupationCode) == '99') {
        xml += "                    <OCCUPATION_OTH>" + firstHolder.ProfileDetails.OccupationName + "</OCCUPATION_OTH>";
    }
    else {
        xml += "                    <OCCUPATION_OTH/>";
    }
    xml += "                    <PEP>" + MFUService.GetMfuPoliticallyExposedCode(firstHolder.IsPoliticallyExposed) + "</PEP>";
    xml += "                    <ANY_OTH_INFO/>";
    xml += "                </OTHER_DETAIL>";
    xml += "                <FATCA_DETAIL>";
    xml += "                    <BIRTH_CITY>" + firstHolder.ProfileDetails.PlaceOfBirth + "</BIRTH_CITY>";
    xml += "                    <BIRTH_COUNTRY>" + firstHolder.ProfileDetails.CountryOfBirthCode + "</BIRTH_COUNTRY>";
    xml += "                    <BIRTH_COUNTRY_OTH/>";
    xml += "                    <CITIZENSHIP>" + firstHolder.CommincationDetails.LocalCountryCode + "</CITIZENSHIP>";
    xml += "                    <CITIZENSHIP_OTH/>";
    xml += "                    <NATIONALITY>" + firstHolder.CommincationDetails.LocalCountryCode + "</NATIONALITY>";
    xml += "                    <NATIONALITY_OTH/>";
    xml += "                    <TAX_RES_FLAG>N</TAX_RES_FLAG>";
    xml += "                    <TAXS_RECORDS/>";
    // xml += "                    <TAXS_RECORDS>";
    // xml += "                        <TAX_RECORD>";
    // xml += "                            <SEQ_NUM>1</SEQ_NUM>";
    // xml += "                            <TAX_COUNTRY/>";
    // xml += "                            <TAX_COUNTRY_OTH/>";
    // xml += "                            <TAX_REF_NO/>";
    // xml += "                            <IDENTI_TYPE/>";
    // xml += "                            <IDENTI_TYPE_OTH/>";
    // xml += "                        </TAX_RECORD>";
    // xml += "                    </TAXS_RECORDS>";
    xml += "                </FATCA_DETAIL>";
    xml += "            </HOLDER_RECORD>";

    if (firstHolder.IsMinorProfile == true) {
        xml += "            <HOLDER_RECORD>";
        xml += "                <HOLDER_TYPE>" + MFUService.GetMfuHolderTypeCode(0) + "</HOLDER_TYPE>";
        xml += "                <NAME>" + firstHolder.GuardianDetails.ProfileDetails.Name + "</NAME>";
        xml += "                <DOB>" + date.format(firstHolder.GuardianDetails.ProfileDetails.DateOfBirth, 'YYYY-MM-DD') + "</DOB>";
        xml += "                <PAN_EXEMPT_FLAG>N</PAN_EXEMPT_FLAG>";
        xml += "                <PAN_PEKRN_NO>" + firstHolder.GuardianDetails.ProfileDetails.PANCardNumber + "</PAN_PEKRN_NO>";
        xml += "                <AADHAAR_NO/>";
        xml += "                <RELATIONSHIP>03</RELATIONSHIP>";
        xml += "                <REL_PROOF>04</REL_PROOF>";
        xml += "                <CONTACT_DETAIL>";
        xml += "                    <RES_ISD/>";
        xml += "                    <RES_STD/>";
        xml += "                    <RES_PHONE_NO/>";
        xml += "                    <MOB_ISD_CODE/>";
        xml += "                    <PRI_MOB_NO>" + firstHolder.GuardianDetails.ProfileDetails.MobileNumber + "</PRI_MOB_NO>";
        xml += "                    <PRI_MOB_BELONGSTO>" + firstHolder.GuardianDetails.ProfileDetails.MobileSelfDeclarationCode + "</PRI_MOB_BELONGSTO>";
        xml += "                    <ALT_MOB_NO/>";
        xml += "                    <OFF_ISD/>";
        xml += "                    <OFF_STD/>";
        xml += "                    <OFF_PHONE_NO/>";
        xml += "                    <PRI_EMAIL>" + firstHolder.GuardianDetails.ProfileDetails.Email + "</PRI_EMAIL>";
        xml += "                    <PRI_EMAIL_BELONGSTO>" + firstHolder.GuardianDetails.ProfileDetails.EmailSelfDeclarationCode + "</PRI_EMAIL_BELONGSTO>";
        xml += "                    <ALT_EMAIL/>";
        xml += "                </CONTACT_DETAIL>";
        xml += "                <OTHER_DETAIL>";
        xml += "                    <GROSS_INCOME>" + MFUService.GetMfuGrossAnnualIncomeCode(firstHolder.GuardianDetails.ProfileDetails.GrossAnnualIncomeCode) + "</GROSS_INCOME>";
        xml += "                    <NET_WORTH>" + firstHolder.GuardianDetails.ProfileDetails.NetWorth + "</NET_WORTH>";
        xml += "                    <NET_DATE>" + date.format(firstHolder.GuardianDetails.ProfileDetails.NetWorthDate, 'YYYY-MM-DD') + "</NET_DATE>";
        xml += "                    <SOURCE_OF_WEALTH>" + firstHolder.GuardianDetails.ProfileDetails.WealthSourceCode + "</SOURCE_OF_WEALTH>";
        if (firstHolder.GuardianDetails.ProfileDetails.WealthSourceCode == '08') {
            xml += "                    <SOURCE_OF_WEALTH_OTH>" + firstHolder.GuardianDetails.ProfileDetails.WealthSourceName + "</SOURCE_OF_WEALTH_OTH>";
        }
        else {
            xml += "                    <SOURCE_OF_WEALTH_OTH/>";
        }
        xml += "                    <KRA_ADDR_TYPE>" + firstHolder.GuardianDetails.CommincationDetails.LocalAddressTypeCode + "</KRA_ADDR_TYPE>";
        xml += "                    <OCCUPATION>" + MFUService.GetMfuOccupationCode(firstHolder.GuardianDetails.ProfileDetails.OccupationCode) + "</OCCUPATION>";
        if (MFUService.GetMfuOccupationCode(firstHolder.GuardianDetails.ProfileDetails.OccupationCode) == '99') {
            xml += "                    <OCCUPATION_OTH>" + firstHolder.GuardianDetails.ProfileDetails.OccupationName + "</OCCUPATION_OTH>";
        }
        else {
            xml += "                    <OCCUPATION_OTH/>";
        }
        xml += "                    <PEP>" + MFUService.GetMfuPoliticallyExposedCode(firstHolder.GuardianDetails.IsPoliticallyExposed) + "</PEP>";
        xml += "                    <ANY_OTH_INFO/>";
        xml += "                </OTHER_DETAIL>";
        xml += "                <FATCA_DETAIL>";
        xml += "                    <BIRTH_CITY>" + firstHolder.GuardianDetails.ProfileDetails.PlaceOfBirth + "</BIRTH_CITY>";
        xml += "                    <BIRTH_COUNTRY>" + firstHolder.GuardianDetails.ProfileDetails.CountryOfBirthCode + "</BIRTH_COUNTRY>";
        xml += "                    <BIRTH_COUNTRY_OTH/>";
        xml += "                    <CITIZENSHIP>" + firstHolder.GuardianDetails.CommincationDetails.LocalCountryCode + "</CITIZENSHIP>";
        xml += "                    <CITIZENSHIP_OTH/>";
        xml += "                    <NATIONALITY>" + firstHolder.GuardianDetails.CommincationDetails.LocalCountryCode + "</NATIONALITY>";
        xml += "                    <NATIONALITY_OTH/>";
        xml += "                    <TAX_RES_FLAG>N</TAX_RES_FLAG>";
        xml += "                    <TAXS_RECORDS/>";
        // xml += "                    <TAXS_RECORDS>";
        // xml += "                        <TAX_RECORD>";
        // xml += "                            <SEQ_NUM>1</SEQ_NUM>";
        // xml += "                            <TAX_COUNTRY/>";
        // xml += "                            <TAX_COUNTRY_OTH/>";
        // xml += "                            <TAX_REF_NO/>";
        // xml += "                            <IDENTI_TYPE/>";
        // xml += "                            <IDENTI_TYPE_OTH/>";
        // xml += "                        </TAX_RECORD>";
        // xml += "                    </TAXS_RECORDS>";
        xml += "                </FATCA_DETAIL>";
        xml += "            </HOLDER_RECORD>";
    }

    if (secondHolder != null) {
        xml += "            <HOLDER_RECORD>";
        xml += "                <HOLDER_TYPE>" + MFUService.GetMfuHolderTypeCode(2) + "</HOLDER_TYPE>";
        xml += "                <NAME>" + secondHolder.ProfileDetails.Name + "</NAME>";
        xml += "                <DOB>" + date.format(secondHolder.ProfileDetails.DateOfBirth, 'YYYY-MM-DD') + "</DOB>";
        xml += "                <PAN_EXEMPT_FLAG>N</PAN_EXEMPT_FLAG>";
        xml += "                <PAN_PEKRN_NO>" + secondHolder.ProfileDetails.PANCardNumber + "</PAN_PEKRN_NO>";
        xml += "                <AADHAAR_NO/>";
        xml += "                <RELATIONSHIP/>";
        xml += "                <REL_PROOF/>";
        xml += "                <CONTACT_DETAIL>";
        xml += "                    <RES_ISD/>";
        xml += "                    <RES_STD/>";
        xml += "                    <RES_PHONE_NO/>";
        xml += "                    <MOB_ISD_CODE/>";
        xml += "                    <PRI_MOB_NO>" + secondHolder.ProfileDetails.MobileNumber + "</PRI_MOB_NO>";
        xml += "                    <PRI_MOB_BELONGSTO>" + secondHolder.ProfileDetails.MobileSelfDeclarationCode + "</PRI_MOB_BELONGSTO>";
        xml += "                    <ALT_MOB_NO/>";
        xml += "                    <OFF_ISD/>";
        xml += "                    <OFF_STD/>";
        xml += "                    <OFF_PHONE_NO/>";
        xml += "                    <PRI_EMAIL>" + secondHolder.ProfileDetails.Email + "</PRI_EMAIL>";
        xml += "                    <PRI_EMAIL_BELONGSTO>" + secondHolder.ProfileDetails.EmailSelfDeclarationCode + "</PRI_EMAIL_BELONGSTO>";
        xml += "                    <ALT_EMAIL/>";
        xml += "                </CONTACT_DETAIL>";
        xml += "                <OTHER_DETAIL>";
        xml += "                    <GROSS_INCOME>" + MFUService.GetMfuGrossAnnualIncomeCode(secondHolder.ProfileDetails.GrossAnnualIncomeCode) + "</GROSS_INCOME>";
        xml += "                    <NET_WORTH>" + secondHolder.ProfileDetails.NetWorth + "</NET_WORTH>";
        xml += "                    <NET_DATE>" + date.format(secondHolder.ProfileDetails.NetWorthDate, 'YYYY-MM-DD') + "</NET_DATE>";
        xml += "                    <SOURCE_OF_WEALTH>" + secondHolder.ProfileDetails.WealthSourceCode + "</SOURCE_OF_WEALTH>";
        if (secondHolder.ProfileDetails.WealthSourceCode == '08') {
            xml += "                    <SOURCE_OF_WEALTH_OTH>" + secondHolder.ProfileDetails.WealthSourceName + "</SOURCE_OF_WEALTH_OTH>";
        }
        else {
            xml += "                    <SOURCE_OF_WEALTH_OTH/>";
        }
        xml += "                    <KRA_ADDR_TYPE>" + secondHolder.CommincationDetails.LocalAddressTypeCode + "</KRA_ADDR_TYPE>";
        xml += "                    <OCCUPATION>" + MFUService.GetMfuOccupationCode(secondHolder.ProfileDetails.OccupationCode) + "</OCCUPATION>";
        if (MFUService.GetMfuOccupationCode(secondHolder.ProfileDetails.OccupationCode) == '99') {
            xml += "                    <OCCUPATION_OTH>" + secondHolder.ProfileDetails.OccupationName + "</OCCUPATION_OTH>";
        }
        else {
            xml += "                    <OCCUPATION_OTH/>";
        }
        xml += "                    <PEP>" + MFUService.GetMfuPoliticallyExposedCode(secondHolder.IsPoliticallyExposed) + "</PEP>";
        xml += "                    <ANY_OTH_INFO/>";
        xml += "                </OTHER_DETAIL>";
        xml += "                <FATCA_DETAIL>";
        xml += "                    <BIRTH_CITY>" + secondHolder.ProfileDetails.PlaceOfBirth + "</BIRTH_CITY>";
        xml += "                    <BIRTH_COUNTRY>" + secondHolder.ProfileDetails.CountryOfBirthCode + "</BIRTH_COUNTRY>";
        xml += "                    <BIRTH_COUNTRY_OTH/>";
        xml += "                    <CITIZENSHIP>" + secondHolder.CommincationDetails.LocalCountryCode + "</CITIZENSHIP>";
        xml += "                    <CITIZENSHIP_OTH/>";
        xml += "                    <NATIONALITY>" + secondHolder.CommincationDetails.LocalCountryCode + "</NATIONALITY>";
        xml += "                    <NATIONALITY_OTH/>";
        xml += "                    <TAX_RES_FLAG>N</TAX_RES_FLAG>";
        xml += "                    <TAXS_RECORDS/>";
        // xml += "                    <TAXS_RECORDS>";
        // xml += "                        <TAX_RECORD>";
        // xml += "                            <SEQ_NUM>1</SEQ_NUM>";
        // xml += "                            <TAX_COUNTRY/>";
        // xml += "                            <TAX_COUNTRY_OTH/>";
        // xml += "                            <TAX_REF_NO/>";
        // xml += "                            <IDENTI_TYPE/>";
        // xml += "                            <IDENTI_TYPE_OTH/>";
        // xml += "                        </TAX_RECORD>";
        // xml += "                    </TAXS_RECORDS>";
        xml += "                </FATCA_DETAIL>";
        xml += "            </HOLDER_RECORD>";
    }

    if (thirdHolder != null) {
        xml += "            <HOLDER_RECORD>";
        xml += "                <HOLDER_TYPE>" + MFUService.GetMfuHolderTypeCode(3) + "</HOLDER_TYPE>";
        xml += "                <NAME>" + thirdHolder.ProfileDetails.Name + "</NAME>";
        xml += "                <DOB>" + date.format(thirdHolder.ProfileDetails.DateOfBirth, 'YYYY-MM-DD') + "</DOB>";
        xml += "                <PAN_EXEMPT_FLAG>N</PAN_EXEMPT_FLAG>";
        xml += "                <PAN_PEKRN_NO>" + thirdHolder.ProfileDetails.PANCardNumber + "</PAN_PEKRN_NO>";
        xml += "                <AADHAAR_NO/>";
        xml += "                <RELATIONSHIP/>";
        xml += "                <REL_PROOF/>";
        xml += "                <CONTACT_DETAIL>";
        xml += "                    <RES_ISD/>";
        xml += "                    <RES_STD/>";
        xml += "                    <RES_PHONE_NO/>";
        xml += "                    <MOB_ISD_CODE/>";
        xml += "                    <PRI_MOB_NO>" + thirdHolder.ProfileDetails.MobileNumber + "</PRI_MOB_NO>";
        xml += "                    <PRI_MOB_BELONGSTO>" + thirdHolder.ProfileDetails.MobileSelfDeclarationCode + "</PRI_MOB_BELONGSTO>";
        xml += "                    <ALT_MOB_NO/>";
        xml += "                    <OFF_ISD/>";
        xml += "                    <OFF_STD/>";
        xml += "                    <OFF_PHONE_NO/>";
        xml += "                    <PRI_EMAIL>" + thirdHolder.ProfileDetails.Email + "</PRI_EMAIL>";
        xml += "                    <PRI_EMAIL_BELONGSTO>" + thirdHolder.ProfileDetails.EmailSelfDeclarationCode + "</PRI_EMAIL_BELONGSTO>";
        xml += "                    <ALT_EMAIL/>";
        xml += "                </CONTACT_DETAIL>";
        xml += "                <OTHER_DETAIL>";
        xml += "                    <GROSS_INCOME>" + MFUService.GetMfuGrossAnnualIncomeCode(thirdHolder.ProfileDetails.GrossAnnualIncomeCode) + "</GROSS_INCOME>";
        xml += "                    <NET_WORTH>" + thirdHolder.ProfileDetails.NetWorth + "</NET_WORTH>";
        xml += "                    <NET_DATE>" + date.format(thirdHolder.ProfileDetails.NetWorthDate, 'YYYY-MM-DD') + "</NET_DATE>";
        xml += "                    <SOURCE_OF_WEALTH>" + thirdHolder.ProfileDetails.WealthSourceCode + "</SOURCE_OF_WEALTH>";
        if (thirdHolder.ProfileDetails.WealthSourceCode == '08') {
            xml += "                    <SOURCE_OF_WEALTH_OTH>" + thirdHolder.ProfileDetails.WealthSourceName + "</SOURCE_OF_WEALTH_OTH>";
        }
        else {
            xml += "                    <SOURCE_OF_WEALTH_OTH/>";
        }
        xml += "                    <KRA_ADDR_TYPE>" + thirdHolder.CommincationDetails.LocalAddressTypeCode + "</KRA_ADDR_TYPE>";
        xml += "                    <OCCUPATION>" + MFUService.GetMfuOccupationCode(thirdHolder.ProfileDetails.OccupationCode) + "</OCCUPATION>";
        if (MFUService.GetMfuOccupationCode(thirdHolder.ProfileDetails.OccupationCode) == '99') {
            xml += "                    <OCCUPATION_OTH>" + thirdHolder.ProfileDetails.OccupationName + "</OCCUPATION_OTH>";
        }
        else {
            xml += "                    <OCCUPATION_OTH/>";
        }
        xml += "                    <PEP>" + MFUService.GetMfuPoliticallyExposedCode(thirdHolder.IsPoliticallyExposed) + "</PEP>";
        xml += "                    <ANY_OTH_INFO/>";
        xml += "                </OTHER_DETAIL>";
        xml += "                <FATCA_DETAIL>";
        xml += "                    <BIRTH_CITY>" + thirdHolder.ProfileDetails.PlaceOfBirth + "</BIRTH_CITY>";
        xml += "                    <BIRTH_COUNTRY>" + thirdHolder.ProfileDetails.CountryOfBirthCode + "</BIRTH_COUNTRY>";
        xml += "                    <BIRTH_COUNTRY_OTH/>";
        xml += "                    <CITIZENSHIP>" + thirdHolder.CommincationDetails.LocalCountryCode + "</CITIZENSHIP>";
        xml += "                    <CITIZENSHIP_OTH/>";
        xml += "                    <NATIONALITY>" + thirdHolder.CommincationDetails.LocalCountryCode + "</NATIONALITY>";
        xml += "                    <NATIONALITY_OTH/>";
        xml += "                    <TAX_RES_FLAG>N</TAX_RES_FLAG>";
        xml += "                    <TAXS_RECORDS/>";
        // xml += "                    <TAXS_RECORDS>";
        // xml += "                        <TAX_RECORD>";
        // xml += "                            <SEQ_NUM>1</SEQ_NUM>";
        // xml += "                            <TAX_COUNTRY/>";
        // xml += "                            <TAX_COUNTRY_OTH/>";
        // xml += "                            <TAX_REF_NO/>";
        // xml += "                            <IDENTI_TYPE/>";
        // xml += "                            <IDENTI_TYPE_OTH/>";
        // xml += "                        </TAX_RECORD>";
        // xml += "                    </TAXS_RECORDS>";
        xml += "                </FATCA_DETAIL>";
        xml += "            </HOLDER_RECORD>";
    }

    xml += "        </HOLDER_RECORDS>";
    xml += "        <ARN_DETAILS>";
    xml += "            <ARN_NO/>";
    xml += "            <RIA_CODE/>";
    xml += "            <EUIN_CODE/>";
    // xml += "            <ARN_NO>ARN-" + data.ARN + "</ARN_NO>";
    // xml += "            <RIA_CODE>" + data.RIANumber + "</RIA_CODE>";
    // xml += "            <EUIN_CODE>E" + data.EUIN + "</EUIN_CODE>";
    xml += "        </ARN_DETAILS>";
    xml += "        <BANK_DETAILS>";

    for (let i = 0; i < data.AccountBanks.length; i++) {
        xml += "            <BANK_RECORD>";
        xml += "                <SEQ_NUM>" + (i + 1) + "</SEQ_NUM>";
        xml += "                <DEFAULT_ACC_FLAG>" + ((data.AccountBanks[i].IsDefault == true) ? "Y" : "N") + "</DEFAULT_ACC_FLAG>";
        xml += "                <ACCOUNT_NO>" + data.AccountBanks[i].AccountNumber + "</ACCOUNT_NO>";
        xml += "                <ACCOUNT_TYPE>" + MFUService.GetMfuBankAccountTypeCode(data.AccountBanks[i].BankAccountTypeCode) + "</ACCOUNT_TYPE>";
        xml += "                <BANK_ID>" + data.AccountBanks[i].RBIId + "</BANK_ID>";
        xml += "                <MICR_CODE>" + data.AccountBanks[i].MICR + "</MICR_CODE>";
        xml += "                <IFSC_CODE>" + data.AccountBanks[i].IFSC + "</IFSC_CODE>";
        xml += "                <PROOF>77</PROOF>";
        xml += "            </BANK_RECORD>";
    }

    xml += "        </BANK_DETAILS>";
    xml += "        <NOMINEE_DETAILS>";
    xml += "            <NOM_DECL_LVL>C</NOM_DECL_LVL>";
    xml += "            <NOMIN_OPT_FLAG>" + ((data.AccountNominees.length > 0) ? "Y" : "N") + "</NOMIN_OPT_FLAG>";
    if (firstHolder.IsMinorProfile == true) {
        xml += "            <NOM_VERIFY_TYPE/>";
    }
    else {
        xml += "            <NOM_VERIFY_TYPE>E</NOM_VERIFY_TYPE>";
    }
    xml += "            <NOMINEES_RECORDS>";

    for (let i = 0; i < data.AccountNominees.length; i++) {
        xml += "                <NOMINEE_RECORD>";
        xml += "                    <SEQ_NUM>" + (i + 1) + "</SEQ_NUM>";
        xml += "                    <NOMINEE_NAME>" + data.AccountNominees[i].NomineeName + "</NOMINEE_NAME>";
        xml += "                    <RELATION>" + data.AccountNominees[i].RelationName + "</RELATION>";
        xml += "                    <PERCENTAGE>" + data.AccountNominees[i].Shares + "</PERCENTAGE>";
        xml += "                    <DOB>" + date.format(data.AccountNominees[i].DateOfBirth, 'YYYY-MM-DD') + "</DOB>";
        if (data.AccountNominees[i].IsMinorProfile == true) {
            xml += "                    <NOM_GURI_NAME>" + data.AccountNominees[i].GuardianName + "</NOM_GURI_NAME>";
            xml += "                    <NOM_GURI_REL>Other</NOM_GURI_REL>";
            xml += "                    <NOM_GURI_DOB>" + date.format(data.AccountNominees[i].GuardianDateOfBirth, 'YYYY-MM-DD') + "</NOM_GURI_DOB>";
        }
        else {
            xml += "                    <NOM_GURI_NAME/>";
            xml += "                    <NOM_GURI_REL/>";
            xml += "                    <NOM_GURI_DOB/>";
        }
        xml += "                </NOMINEE_RECORD>";
    }

    xml += "            </NOMINEES_RECORDS>";
    xml += "        </NOMINEE_DETAILS>";
    xml += "    </REQ_BODY>";
    xml += "</CANIndFillEezzReq>";

    return xml;
};

MFUService.GetCANDataStatus = async (data) => {
    try {
        var MFUUID = commonFunction.GetRandomNumber(15);
        var inputData = await MFUService.PrepareCANDataStatusXml(data, MFUUID);

        // console.log(inputData);

        return new Promise((resolve, reject) => {

            var headers = { 'Accept': '*/*', 'Content-type': 'application/xml', 'Content-Length': Buffer.byteLength(inputData.toString()) };
            var options = {
                host: process.env.MFU_API_LINK,
                port: process.env.MFU_API_PORT,
                path: '/MFUCanFillEezzService',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            var request = https.request(options, function (response) {
                response.setEncoding('utf8');

                let responseData = '';

                response.on('data', (chunk) => { responseData += chunk });

                response.on('end', () => {
                    const resultData = responseData.toString();

                    // console.log(resultData);

                    const xmlData = new DOMParser().parseFromString(resultData, 'text/xml');

                    // console.log(xmlData);

                    var parser = new xml2json.Parser();
                    parser.parseString(xmlData, async (err, result) => {
                        // console.log(JSON.stringify(result));
                        // console.log(err);

                        var responseMessage = result["CANDataStatusResp"]["RESP_BODY"][0]["MSG"][0];
                        var canStatus = 'Pending';
                        if (result["CANDataStatusResp"]["RESP_BODY"][0]["CAN_STATUS"]) {
                            canStatus = result["CANDataStatusResp"]["RESP_BODY"][0]["CAN_STATUS"][0];
                        }

                        await MFUService.CreateMFULog(cryptoEngine.ParamDecrypt(data.Id, true), 0, 'eCAN Status', MFUUID, '', responseMessage, resultData);

                        await MFUService.UpdateClientAccountMFUCanStatus(data, canStatus);

                        resolve(JSON.stringify(result));
                        // console.log(encryptedPassword);
                    });
                });
            });

            request.on('error', function (err) {
                console.log(err);
                reject(err);
            });

            request.on('timeout', () => {
                request.destroy();
                reject(new Error('Timeout'));
            });

            request.write(inputData);

            request.end();
        });
    }
    catch (err) {
        console.log(err);
    }
};

MFUService.PrepareCANDataStatusXml = async (data, MFUUID) => {
    var encryptedPassword = cryptoEngine.MFUEncrypt(mfuConfig.Password, false);

    var xml = "<CANDataStatusReq xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:noNamespaceSchemaLocation=\"CANDataStatusReq.xsd\">";
    xml += "    <REQ_HEADER>";
    xml += "        <ENTITY_ID>" + mfuConfig.EntityId + "</ENTITY_ID>";
    xml += "        <UNIQUE_ID>" + MFUUID + "</UNIQUE_ID>";
    xml += "        <REQUEST_TYPE>CANDATASTATUS</REQUEST_TYPE>";
    xml += "        <LOG_USER_ID>" + mfuConfig.LoginId + "</LOG_USER_ID>";
    xml += "        <EN_ENCR_PASSWORD>" + encryptedPassword + "</EN_ENCR_PASSWORD>";
    xml += "        <VERSION_NO>1.00</VERSION_NO>";
    xml += "        <TIMESTAMP>" + date.format(new Date(), "YYYY-MM-DDTHH:mm:ss") + "</TIMESTAMP>";
    xml += "    </REQ_HEADER>";
    xml += "    <REQ_BODY>";
    xml += "        <CAN>" + data.MFUCAN + "</CAN>";
    xml += "    </REQ_BODY>";
    xml += "</CANDataStatusReq>";

    return xml;
};

MFUService.UploadImage = async (data) => {
    try {
        var encryptedPassword = cryptoEngine.MFUEncrypt(mfuConfig.Password, false);
        var imageFilePath = await MFUService.PrepareUploadImage(data);

        return new Promise((resolve, reject) => {

            // var headers = { 'Accept': '*/*', 'Content-Type': 'multipart/form-data' };
            var inputForm = new formData();
            inputForm.append('param1', mfuConfig.LoginId);
            inputForm.append('param2', encryptedPassword);
            inputForm.append('param3', mfuConfig.EntityId);
            inputForm.append('param4', 'ECAN');
            inputForm.append('param5', data.MFUEventType);
            inputForm.append('param6', data.MFUCAN);
            inputForm.append('param7', data.MFUImageRefNumber);
            inputForm.append('param8', data.MFUDocumentCode);
            inputForm.append('ECAN', fileSystem.createReadStream(imageFilePath));

            // console.log(inputForm);

            var options = {
                host: process.env.MFU_API_LINK,
                port: process.env.MFU_API_PORT,
                path: '/MFUImageServerUpload',
                method: 'POST',
                headers: inputForm.getHeaders(),
                timeout: 30000,
            };

            var request = https.request(options);

            inputForm.pipe(request);

            request.on('response', function (response) {
                response.setEncoding('utf8');

                response.on('data', async function (message) {
                    // console.log(message);

                    var result = JSON.parse(message);

                    await MFUService.CreateMFULog(
                        cryptoEngine.ParamDecrypt(data.ClientAccountId, true),
                        cryptoEngine.ParamDecrypt(data.ClientKycProfileId, true),
                        'Image Upload',
                        '',
                        result.result,
                        result.responseMsg,
                        JSON.stringify(result));

                    if (result.result == 'Success') {
                        await MFUService.UpdateClientAccountImageUploadStatus(data, result);

                        resolve(result);
                    }
                    else {
                        resolve(result);
                    }
                });
            });

            request.on('error', function (err) {
                console.log(err);
                reject(err);
            });

            request.on('timeout', () => {
                request.destroy();
                reject(new Error('Timeout'));
            });

            // request.write(inputData);

            // request.end();
        });
    }
    catch (err) {
        console.log(err);
    }
};

MFUService.PrepareUploadImage = async (data) => {
    var imageFileName = '';
    var imageFilePath = '';

    if (data.FileContentType == 'application/pdf') {
        imageFileName = commonFunction.GetUniqueId() + '.png';
        imageFilePath = path.join(__dirname.replace("app", "public"), '..', 'documents', 'reports', 'temp', imageFileName);

        const pdfBuffer = Buffer.from(data.FileContent);
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfJSWorker;
        const pdfDoc = await pdfjsLib.getDocument({ data: commonFunction.ToArrayBuffer(pdfBuffer) }).promise;
        const page = await pdfDoc.getPage(1);
        const viewport = page.getViewport({ scale: 1.1 });
        const canvasDoc = canvas.createCanvas(viewport.width, viewport.height)
        const context = canvasDoc.getContext('2d');
        await page.render({ canvasContext: context, viewport, background: null }).promise;
        const imageDataURL = canvasDoc.toBuffer('image/png');

        fileSystem.writeFileSync(imageFilePath, imageDataURL);
    }
    else {
        let fileNameList = data.FileName.split('.');

        imageFileName = commonFunction.GetUniqueId() + '.' + fileNameList[fileNameList.length - 1];

        imageFilePath = path.join(__dirname.replace("app", "public"), '..', 'documents', 'reports', 'temp', imageFileName);

        fileSystem.writeFileSync(imageFilePath, Buffer.from(data.FileContent));
    }

    var fileStats = fileSystem.statSync(imageFilePath);
    var fileSizeInBytes = fileStats.size;
    if (fileSizeInBytes > 500000) {
        //optimize file size to 500kb
    }

    return imageFilePath;
};

MFUService.AuthenticationLogin = async () => {
    try {
        var encryptedPassword = cryptoEngine.MFUEncrypt(mfuConfig.Password, false);

        return new Promise((resolve, reject) => {
            var headers = { 'Accept': '*/*' };

            var options = {
                host: process.env.MFU_API_LINK,
                port: process.env.MFU_API_PORT,
                path: '/MfUtilityApiLogin.do?sendResponseFormat=JSON&loginid=' + encodeURIComponent(mfuConfig.LoginId) + '&password=' + encodeURIComponent(encryptedPassword) + '&entityId=' + encodeURIComponent(mfuConfig.EntityId) + '&logTp=A&versionNo=1.00',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            var request = https.request(options, function (response) {
                response.setEncoding('utf8');

                response.on('data', async function (message) {
                    // console.log(message);

                    var result = JSON.parse(message);

                    resolve(result);
                });
            });

            request.on('error', function (err) {
                console.log(err);
                reject(err);
            });

            request.on('timeout', () => {
                request.destroy();
                reject(new Error('Timeout'));
            });

            // request.write(JSON.stringify(inputData));

            request.end();
        });
    }
    catch (err) {
        console.log(err);
    }
};

MFUService.AuthenticationLogout = async (data) => {
    try {
        return new Promise((resolve, reject) => {
            var headers = { 'Accept': '*/*' };

            var options = {
                host: process.env.MFU_API_LINK,
                port: process.env.MFU_API_PORT,
                path: '/Logout.do?isJsonResponseFormatReqd=Y&loginid=' + encodeURIComponent(mfuConfig.LoginId) + '&sessioncontext=' + encodeURIComponent(data.sessioncontext) + '&sendersubid=' + encodeURIComponent(data.sendersubid) + '&onbehalfid=' + encodeURIComponent(data.sendersubid),
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            var request = https.request(options, function (response) {
                response.setEncoding('utf8');

                response.on('data', async function (message) {
                    // console.log(message);

                    var result = JSON.parse(message);

                    // resolve(result);
                });
            });

            request.on('error', function (err) {
                console.log(err);
                reject(err);
            });

            request.on('timeout', () => {
                request.destroy();
                reject(new Error('Timeout'));
            });

            // request.write(JSON.stringify(inputData));

            request.end();
        });
    }
    catch (err) {
        console.log(err);
    }
};

MFUService.ePayEezzRegistration = async (data) => {
    try {
        var loginSession = await MFUService.AuthenticationLogin();

        return new Promise((resolve, reject) => {
            if (loginSession.respStatus == 0) {
                var headers = { 'Accept': '*/*' };

                var options = {
                    host: process.env.MFU_API_LINK,
                    port: process.env.MFU_API_PORT,
                    path: '/APIePayEezzService.do?sendResponseFormat=JSON&sessioncontext=' + encodeURIComponent(loginSession.sessioncontext) + '&sendersubid=' + encodeURIComponent(loginSession.sendersubid) + '&logTp=A&regMode=PN&entityId=' + encodeURIComponent(mfuConfig.EntityId) + '&reqType=A&can=' + encodeURIComponent(data.MFUCAN) + '&riaNo=&arnNo=' + encodeURIComponent('ARN-' + data.ARN) + '&subBrokArn=&subBrokCode=&euincode=&accNo=' + encodeURIComponent(data.AccountNumber) + '&accType=' + encodeURIComponent(MFUService.GetMfuBankAccountTypeCode(data.BankAccountTypeCode)) + '&ifscCode=' + encodeURIComponent(data.IFSC) + '&micrCode=' + encodeURIComponent(data.MICR) + '&maxAmt=' + encodeURIComponent(data.Amount) + '&perpetualFlag=N&startDate=' + encodeURIComponent(data.StartDate) + '&endDate=' + encodeURIComponent(data.EndDate),
                    method: 'POST',
                    headers: headers,
                    timeout: 30000,
                };

                var request = https.request(options, function (response) {
                    response.setEncoding('utf8');

                    response.on('data', async function (message) {
                        // console.log(message);

                        var result = JSON.parse(message);

                        await MFUService.CreateMFULog(cryptoEngine.ParamDecrypt(data.ClientAccountId, true), 0, 'ePayEezzRegistration', '', result.respStatus, (result.respStatus == 0) ? '' : result.errorMessage, JSON.stringify(result));

                        if (result.respStatus == 0) {
                            await MFUService.UpdateClientAccountMandateMFURegistration(data, result);

                            await MFUService.AuthenticationLogout(loginSession);

                            resolve(result);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });

                request.on('error', function (err) {
                    console.log(err);
                    reject(err);
                });

                request.on('timeout', () => {
                    request.destroy();
                    reject(new Error('Timeout'));
                });

                // request.write(JSON.stringify(inputData));

                request.end();
            }
            else {
                reject(loginSession);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

MFUService.ePayEezzStatus = async (data) => {
    try {
        var loginSession = await MFUService.AuthenticationLogin();

        return new Promise((resolve, reject) => {
            if (loginSession.respStatus == 0) {
                var headers = { 'Accept': '*/*' };

                var options = {
                    host: process.env.MFU_API_LINK,
                    port: process.env.MFU_API_PORT,
                    path: '/APIEPayEezzStatusService.do?sendResponseFormat=JSON&sessioncontext=' + encodeURIComponent(loginSession.sessioncontext) + '&sendersubid=' + encodeURIComponent(loginSession.sendersubid) + '&logTp=A&can=' + encodeURIComponent(data.MFUCAN) + '&mmrn=' + encodeURIComponent(data.MMRN),
                    method: 'POST',
                    headers: headers,
                    timeout: 30000,
                };

                var request = https.request(options, function (response) {
                    response.setEncoding('utf8');

                    response.on('data', async function (message) {
                        // console.log(message);

                        var result = JSON.parse(message);

                        await MFUService.CreateMFULog(cryptoEngine.ParamDecrypt(data.ClientAccountId, true), cryptoEngine.ParamDecrypt(data.Id, true), 'ePayEezzStatus', '', result.respStatus, '', JSON.stringify(result));

                        if (result.respStatus == 0) {
                            await MFUService.UpdateClientAccountMandateMFUStatus(data, result);

                            await MFUService.AuthenticationLogout(loginSession);

                            resolve(result);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });

                request.on('error', function (err) {
                    console.log(err);
                    reject(err);
                });

                request.on('timeout', () => {
                    request.destroy();
                    reject(new Error('Timeout'));
                });

                // request.write(JSON.stringify(inputData));

                request.end();
            }
            else {
                reject(loginSession);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

//MFU Codes

MFUService.GetMfuInvestorCategoryCode = (age, accountProfileType) => {
    if (accountProfileType == 'F') {
        if (age < 18) {
            return 'M';
        }
        else {
            return 'I'
        }
    }
    else if (accountProfileType == 'C') {
        return 'N';
    }
};

MFUService.GetMfuTaxStatusCode = (code) => {
    switch (code.toString()) {
        case '01':
            return 'RI';
        case '02':
            return 'RM';
        case '11':
            return 'PI';
        case '21':
            return 'NRI';
        case '24':
            return 'NNI';
        case '26':
            return 'PM';
        case '28':
            return 'NNM';
    }
};

MFUService.GetMfuHolderTypeCode = (SerialNumber) => {
    switch (SerialNumber) {
        case 1:
            return 'PR';
        case 2:
            return 'SE';
        case 3:
            return 'TH';
        default:
            return 'GU';
    }
};

MFUService.GetMfuGrossAnnualIncomeCode = (code) => {
    switch (code.toString()) {
        case '31':
            return '01';
        case '32':
            return '02';
        case '33':
            return '03';
        case '34':
            return '04';
        case '35':
            return '05';
        case '36':
            return '06';
    }
};

MFUService.GetMfuOccupationCode = (code) => {
    switch (code.toString()) {
        case '41':
            return '01';
        case '42':
            return '02';
        case '01':
            return '03';
        case '03':
            return '04';
        case '04':
            return '05';
        case '05':
            return '06';
        case '06':
            return '07';
        case '07':
            return '08';
        case '43':
            return '09';
        case '44':
            return '10';
        case '09':
            return '11';
        default:
            return '99';
    }
};

MFUService.GetMfuPoliticallyExposedCode = (code) => {
    switch (code) {
        case true:
            return 'RPEP';
        case false:
            return 'NA';
    }
};

MFUService.GetMfuBankAccountTypeCode = (code) => {
    switch (code.toString()) {
        case 'SB':
            return 'SB';
        case 'CB':
            return 'CA';
        case 'NE':
            return 'NRE';
        case 'NO':
            return 'NRO';
    }
};

MFUService.GetMfuRelationCode = (name) => {
    switch (name.toString().toLowerCase()) {
        case 'mother':
            return '01';
        case 'father':
            return '02';
        default:
            return '03';
    }
};

//Database activity functions
MFUService.UpdateClientAccountMFUStatus = async (data, CANIndFillEezzResp) => {
    var errorMessage = "Error while updating account mfu status...";

    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("Id", cryptoEngine.ParamDecrypt(data.Id, true))
            .input("MFUCAN", CANIndFillEezzResp.RESP_BODY.CAN)
            .input("IsAccountCreatedAtMFU", true);

        const result = await request.execute("UpdateClientAccountMFUStatus");

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
};

MFUService.UpdateClientAccountMFUCanStatus = async (data, canStatus) => {
    var errorMessage = "Error while updating account mfu can status...";

    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("Id", cryptoEngine.ParamDecrypt(data.Id, true))
            .input("MFUCANStatus", canStatus);

        const result = await request.execute("UpdateClientAccountMFUCanStatus");

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
};

MFUService.UpdateClientAccountImageUploadStatus = async (data, imageUploadResult) => {
    var errorMessage = "Error while updating account mfu image upload status...";

    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("ClientAccountId", cryptoEngine.ParamDecrypt(data.ClientAccountId, true))
            .input("ClientKycProfileId", cryptoEngine.ParamDecrypt(data.ClientKycProfileId, true))
            .input("ImageRefNo", imageUploadResult.imageRefNo)
            .input("Name", data.Name);

        const result = await request.execute("InsertClientAccountMFUDocument");

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
};

MFUService.UpdateClientAccountMandateMFURegistration = async (data, resultData) => {
    var errorMessage = "Error while updating mandate mfu registration...";

    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("Id", cryptoEngine.ParamDecrypt(data.ClientAccountMandateId, true))
            .input("MMRN", resultData.addResp.mmrn)
            .input("MFUUniqueRefNo", resultData.addResp.uniqueRefNo)
            .input("MFUApproveLink", resultData.addResp.approveLink)
            .input("MFUStartDate", data.StartDate)
            .input("MFUEndDate", data.EndDate);

        const result = await request.execute("UpdateClientAccountMandateMFURegistration");

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
};

MFUService.UpdateClientAccountMandateMFUStatus = async (data, resultData) => {
    var errorMessage = "Error while updating mandate mfu status...";

    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("Id", cryptoEngine.ParamDecrypt(data.Id, true))
            .input("MFUPRN", resultData.epayStatusResponse[0].prn)
            .input("MMRNRegStatus", resultData.epayStatusResponse[0].mmrnRegStatus)
            .input("MMRNAggrStatus", resultData.epayStatusResponse[0].mmrnAggrStatus);

        const result = await request.execute("UpdateClientAccountMandateMFUStatus");

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
};

MFUService.CreateMFULog = async (ClientAccountId, ClientKycProfileId, CommunicationType, MFUUID, MFUStatus, MFURemark, MFUResponse) => {
    var errorMessage = "Error while creating mfu log...";

    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("ClientAccountId", ClientAccountId)
            .input("ClientKycProfileId", ClientKycProfileId)
            .input("CommunicationType", CommunicationType)
            .input("MFUUID", MFUUID)
            .input("MFUStatus", MFUStatus)
            .input("MFURemark", MFURemark)
            .input("MFUResponse", MFUResponse);

        const result = await request.execute("InsertClientAccountMFULog");

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

module.exports = MFUService;