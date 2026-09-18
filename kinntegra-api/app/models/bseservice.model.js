const date = require('date-and-time');
const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");
const appPool = require("../models/db.model");
const xml2json = require('xml2js');
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');
const commonFunction = require('../models/commonfunction.model');

const BSEService = function () { }

BSEService.GetPassword = async () => {
    var bseConfig = await BSEService.GetBSEConfig();

    return new Promise(async (resolve, reject) => {
        let inputData = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://www.bsestarmf.in/2016/01/">        
        <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
            <wsa:Action>http://www.bsestarmf.in/2016/01/IStarMFWebService/getPassword</wsa:Action>
            <wsa:To>https://${process.env.BSE_API_LINK}/StarMFWebService/StarMFWebService.svc/Secure</wsa:To>
        </soap:Header>        
        <soap:Body>
           <ns:getPassword>
              <ns:UserId>${bseConfig.UserId}</ns:UserId>
              <ns:MemberId>${bseConfig.MemberId}</ns:MemberId>
              <ns:Password>${bseConfig.Password}</ns:Password>
              <ns:PassKey>${bseConfig.PassKey}</ns:PassKey>
           </ns:getPassword>
        </soap:Body>
     </soap:Envelope>`;

        var headers = {
            'Content-Type': 'application/soap+xml;charset=UTF-8',
            'Accept-Encoding': 'gzip,deflate',
            'action': "http://www.bsestarmf.in/2016/01/IStarMFWebService/getPassword"
        };
        var options = {
            host: process.env.BSE_API_LINK,
            path: '/StarMFWebService/StarMFWebService.svc/Secure',
            method: 'POST',
            headers: headers,
            timeout: 30000,
        };

        try {
            var responseData = await commonFunction.SendRequest(options, inputData);
            const resultData = responseData.toString();

            const xmlData = new DOMParser().parseFromString(resultData, 'text/xml');

            // console.log(xmlData);

            var parser = new xml2json.Parser();
            parser.parseString(xmlData, (err, result) => {
                // console.log(JSON.stringify(result));
                // console.log(err);
                var encryptedPassword = '';
                var getPasswordResult = result["s:Envelope"]["s:Body"][0]["getPasswordResponse"][0]["getPasswordResult"][0];

                var passwordResult = getPasswordResult.toString().split('|');
                if (passwordResult[0].toString() == "100") {
                    encryptedPassword = passwordResult[1];
                    resolve(encryptedPassword);
                }
                else {
                    reject(new Error(passwordResult[1].toString()));
                }
                console.log(encryptedPassword);
            });
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

BSEService.GetPasswordFileUpload = async () => {
    var bseConfig = await BSEService.GetBSEConfig();

    return new Promise(async (resolve, reject) => {
        let inputData = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/" xmlns:star="http://schemas.datacontract.org/2004/07/StarMFFileUploadService">
        <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
            <wsa:Action>http://tempuri.org/IStarMFFileUploadService/GetPassword</wsa:Action>
            <wsa:To>https://${process.env.BSE_API_LINK}/StarMFFileUploadService/StarMFFileUploadService.svc/Secure</wsa:To>
        </soap:Header>
        <soap:Body>
           <tem:GetPassword>
              <tem:Param>
                 <star:MemberId>${bseConfig.MemberId}</star:MemberId>
                 <star:Password>${bseConfig.Password}</star:Password>
                 <star:UserId>${bseConfig.UserId}</star:UserId>
              </tem:Param>
           </tem:GetPassword>
        </soap:Body>
     </soap:Envelope>`;

        var headers = {
            'Content-Type': 'application/soap+xml;charset=UTF-8',
            'Accept-Encoding': 'gzip,deflate',
            'action': "http://tempuri.org/IStarMFFileUploadService/GetPassword"
        };
        var options = {
            host: process.env.BSE_API_LINK,
            path: '/StarMFFileUploadService/StarMFFileUploadService.svc/Secure',
            method: 'POST',
            headers: headers,
            timeout: 30000,
        };

        try {
            var responseData = await commonFunction.SendRequest(options, inputData);

            const resultData = responseData.toString();

            const xmlData = new DOMParser().parseFromString(resultData, 'text/xml');

            // console.log(xmlData);

            var parser = new xml2json.Parser();
            parser.parseString(xmlData, (err, result) => {
                // console.log(JSON.stringify(result));
                // console.log(err);
                var encryptedPassword = '';
                var getPasswordResult = result["s:Envelope"]["s:Body"][0]["GetPasswordResponse"][0]["GetPasswordResult"][0];

                var passwordResult = getPasswordResult;
                if (passwordResult["b:Status"][0].toString() == "100") {
                    encryptedPassword = passwordResult["b:ResponseString"][0];
                    resolve(encryptedPassword);
                }
                else {
                    reject(new Error(passwordResult["b:ResponseString"][0].toString()));
                }
                // console.log(encryptedPassword);
            });
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

BSEService.GetPasswordOrderEntry = async () => {
    var bseConfig = await BSEService.GetBSEConfig();

    return new Promise(async (resolve, reject) => {
        let inputData = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:bses="http://bsestarmf.in/">
        <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
            <wsa:Action>http://bsestarmf.in/MFOrderEntry/getPassword</wsa:Action>
            <wsa:To>https://${process.env.BSE_API_LINK}/MFOrderEntry/MFOrder.svc/Secure</wsa:To>
        </soap:Header>
        <soap:Body>
            <bses:getPassword>
                <bses:UserId>${bseConfig.UserId}</bses:UserId>
                <bses:Password>${bseConfig.Password}</bses:Password>
                <bses:PassKey>${bseConfig.PassKey}</bses:PassKey>
            </bses:getPassword>
        </soap:Body>
    </soap:Envelope>`;

        var headers = {
            'Content-Type': 'application/soap+xml;charset=UTF-8',
            'Accept-Encoding': 'gzip,deflate',
            'action': "http://bsestarmf.in/MFOrderEntry/getPassword"
        };
        var options = {
            host: process.env.BSE_API_LINK,
            path: '/MFOrderEntry/MFOrder.svc/Secure',
            method: 'POST',
            headers: headers,
            timeout: 30000,
        };

        try {
            var responseData = await commonFunction.SendRequest(options, inputData);

            const resultData = responseData.toString();

            const xmlData = new DOMParser().parseFromString(resultData, 'text/xml');

            // console.log(xmlData);

            var parser = new xml2json.Parser();
            parser.parseString(xmlData, (err, result) => {
                // console.log(JSON.stringify(result));
                // console.log(err);
                var encryptedPassword = '';
                var getPasswordResult = result["s:Envelope"]["s:Body"][0]["getPasswordResponse"][0]["getPasswordResult"][0];

                var passwordResult = getPasswordResult.toString().split('|');
                if (passwordResult[0].toString() == "100") {
                    encryptedPassword = passwordResult[1];
                    resolve(encryptedPassword);
                }
                else {
                    reject(new Error(passwordResult[1].toString()));
                }
                // console.log(encryptedPassword);
            });
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

BSEService.GetPasswordForChildOrder = async () => {
    var bseConfig = await BSEService.GetBSEConfig();

    return new Promise(async (resolve, reject) => {
        let inputData = {
            "MemberId": bseConfig.MemberId,
            "PassKey": bseConfig.PassKey,
            "Password": bseConfig.Password,
            "RequestType": 'CHILDORDER',
            "UserId": bseConfig.UserId
        };

        var headers = { 'Accept': 'application/json', 'Content-type': 'application/json', 'APIKEY': 'VmxST1UyRkhUbkpOVldNOQ==' };

        var options = {
            host: process.env.BSE_API_LINK,
            path: '/StarMFWebService/StarMFWebService.svc/GetPasswordForChildOrder',
            method: 'POST',
            headers: headers,
            timeout: 30000,
        };

        try {
            var responseData = await commonFunction.SendRequest(options, JSON.stringify(inputData));

            var result = JSON.parse(responseData);

            if (result.Status == 100 && !result.ResponseString.includes(' ')) {
                var encryptedPassword = result.ResponseString;
                resolve(encryptedPassword);
            }
            else {
                reject(new Error(result.ResponseString));
            }
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    });

};

BSEService.UploadClientMFD = async (data) => {
    try {
        var bseConfig = await BSEService.GetBSEConfig();

        var param = await BSEService.PrepareClientMFDParam(data);

        // console.log(param);

        return new Promise(async (resolve, reject) => {
            let inputData = {
                'UserId': bseConfig.UserId,
                'Password': bseConfig.Password,
                'MemberCode': bseConfig.MemberId,
                'RegnType': (data.IsAccountCreatedAtBSE == true) ? 'MOD' : 'NEW',
                'Param': param,
                'Filler1': "",
                'Filler2': ""
            };

            // path: '/StarMFCommonAPI/ClientMaster/Registration',//131
            // path: '/BSEMFWEBAPI/api/ClientRegistration/Registration',//146
            var headers = { 'Accept': 'application/json', 'Content-type': 'application/json' };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/BSEMFWEBAPI/UCCAPI/UCCRegistrationV183',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, JSON.stringify(inputData));

                var result = JSON.parse(responseData);

                await BSEService.CreateBSELog(cryptoEngine.ParamDecrypt(data.Id, true), 0, 'Account Creation', result.Status, result.Remarks);

                if (result.Status == 0) {
                    await BSEService.UpdateClientAccountStatus(data);

                    resolve({ Status: result.Status, Remarks: result.Remarks });
                }
                else {
                    resolve({ Status: result.Status, Remarks: result.Remarks });
                }
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.PrepareClientMFDParam = async (data) => {
    var param = "{1}|{2}|{3}|{4}|{5}|{6}|{7}|{8}|{9}|{10}|{11}|{12}|{13}|{14}|{15}|{16}|{17}|{18}|{19}|{20}|{21}|{22}|{23}|{24}|{25}|{26}|{27}|{28}|{29}|{30}|{31}|{32}|{33}|{34}|{35}|{36}|{37}|{38}|{39}|{40}|{41}|{42}|{43}|{44}|{45}|{46}|{47}|{48}|{49}|{50}|{51}|{52}|{53}|{54}|{55}|{56}|{57}|{58}|{59}|{60}|{61}|{62}|{63}|{64}|{65}|{66}|{67}|{68}|{69}|{70}|{71}|{72}|{73}|{74}|{75}|{76}|{77}|{78}|{79}|{80}|{81}|{82}|{83}|{84}|{85}|{86}|{87}|{88}|{89}|{90}|{91}|{92}|{93}|{94}|{95}|{96}|{97}|{98}|{99}|{100}|{101}|{102}|{103}|{104}|{105}|{106}|{107}|{108}|{109}|{110}|{111}|{112}|{113}|{114}|{115}|{116}|{117}|{118}|{119}|{120}|{121}|{122}|{123}|{124}|{125}|{126}|{127}|{128}|{129}|{130}|{131}|{132}|{133}|{134}|{135}|{136}|{137}|{138}|{139}|{140}|{141}|{142}|{143}|{144}|{145}|{146}|{147}|{148}|{149}|{150}|{151}|{152}|{153}|{154}|{155}|{156}|{157}|{158}|{159}|{160}|{161}|{162}|{163}|{164}|{165}|{166}|{167}|{168}|{169}|{170}|{171}|{172}|{173}|{174}|{175}|{176}|{177}|{178}|{179}|{180}|{181}|{182}|{183}";

    // 1   Client Code (UCC)
    param = param.replace('{1}', data.UCC);

    var firstHolder = data.AccountHolders.find(x => x.SerialNumber === 1);
    if (firstHolder != null) {
        // 2   Primary Holder First Name
        param = param.replace('{2}', firstHolder.ProfileDetails.Name);
        // 3   Primary Holder Middle Name
        param = param.replace('{3}', '');
        // 4   Primary Holder Last Name
        param = param.replace('{4}', '');
        // 5   Tax Status
        param = param.replace('{5}', firstHolder.ProfileDetails.TaxStatusCode);
        // 6   Gender
        if (data.AccountProfileType == 'C') {
            param = param.replace('{6}', '');
        }
        else {
            param = param.replace('{6}', firstHolder.ProfileDetails.GenderCode);
        }
        // 7   Primary Holder DOB/Incorporation
        param = param.replace('{7}', date.format(firstHolder.ProfileDetails.DateOfBirth, 'DD/MM/YYYY'));
        // 8   Occupation Code
        param = param.replace('{8}', firstHolder.ProfileDetails.OccupationCode);
        if ((firstHolder.ProfileDetails.Age >= 18 && data.AccountProfileType == 'F') || (data.AccountProfileType == 'C')) {
            //22	Primary Holder PAN Exempt
            param = param.replace('{22}', 'N');
            //26	Primary Holder PAN
            param = param.replace('{26}', firstHolder.ProfileDetails.PANCardNumber);
        }
        else {
            param = param.replace('{22}', '');
            param = param.replace('{26}', '');
            // param = param.replace('{22}', 'N');
            // param = param.replace('{26}', firstHolder.ProfileDetails.PANCardNumber);
        }
        if (firstHolder.ProfileDetails.CKYCNumber != "") {
            param = param.replace('{94}', 'C');
            param = param.replace('{95}', firstHolder.ProfileDetails.CKYCNumber);
        }
        else {
            if (firstHolder.ProfileType == 'C') {
                param = param.replace('{94}', 'K');
            }
            else {
                if (firstHolder.ProfileDetails.Age >= 18) {
                    param = param.replace('{94}', 'K');
                }
                else {
                    param = param.replace('{94}', '');
                }
            }

            param = param.replace('{95}', '');
        }
        param = param.replace('{102}', '');
        param = param.replace('{106}', (firstHolder.ProfileDetails.AadharCardNumber != '') ? 'Y' : 'N');
        param = param.replace('{111}', firstHolder.ProfileDetails.MobileSelfDeclarationCode);
        param = param.replace('{112}', firstHolder.ProfileDetails.EmailSelfDeclarationCode);
        if ((firstHolder.ProfileDetails.TaxStatusCode == '02' || firstHolder.ProfileDetails.TaxStatusCode == '26' || firstHolder.ProfileDetails.TaxStatusCode == '28' || firstHolder.ProfileDetails.TaxStatusCode == '61' || firstHolder.ProfileDetails.TaxStatusCode == '62' || firstHolder.ProfileDetails.TaxStatusCode == '70' || firstHolder.ProfileDetails.TaxStatusCode == '77' || firstHolder.ProfileDetails.TaxStatusCode == '78') && firstHolder.GuardianDetails.ProfileDetails.Name != '') {
            //18	Guardian First Name
            param = param.replace('{18}', firstHolder.GuardianDetails.ProfileDetails.Name);
            //19	Guardian Middle Name
            param = param.replace('{19}', '');
            //20	Guardian Last Name
            param = param.replace('{20}', '');
            //21	Guardian DOB
            param = param.replace('{21}', date.format(firstHolder.GuardianDetails.ProfileDetails.DateOfBirth, 'DD/MM/YYYY'));
            //25	Guardian PAN Exempt
            param = param.replace('{25}', 'N');
            //29	Guardian PAN
            param = param.replace('{29}', firstHolder.GuardianDetails.ProfileDetails.PANCardNumber);
            //33	Guardian Exempt Category
            param = param.replace('{33}', '');
            if (firstHolder.GuardianDetails.ProfileDetails.CKYCNumber != "") {
                param = param.replace('{100}', 'C');
                param = param.replace('{101}', firstHolder.GuardianDetails.ProfileDetails.CKYCNumber);
            }
            else {
                param = param.replace('{100}', 'K');
                param = param.replace('{101}', '');
            }
            param = param.replace('{105}', '');
            param = param.replace('{121}', firstHolder.GuardianDetails.ProfileDetails.GuardianRelationBSECode);
        }
        else {
            param = param.replace('{18}', '');
            param = param.replace('{19}', '');
            param = param.replace('{20}', '');
            param = param.replace('{21}', '');
            param = param.replace('{25}', '');
            param = param.replace('{29}', '');
            param = param.replace('{33}', '');
            param = param.replace('{100}', '');
            param = param.replace('{101}', '');
            param = param.replace('{105}', '');
            param = param.replace('{121}', '');
        }
        // 67  Cheque name
        param = param.replace('{67}', firstHolder.ProfileDetails.Name.substring(0, 35));
        // 69  Address 1
        // 70  Address 2
        // 71   Address 3
        // 72   City
        // 73   State
        // 74   Pincode
        // 75   Country
        // 76   Resi. Phone
        // 77   Resi. Fax
        // 78   Office Phone
        // 79   Office Fax
        param = param.replace('{69}', firstHolder.CommincationDetails.LocalAddress1);
        param = param.replace('{70}', firstHolder.CommincationDetails.LocalAddress2);
        param = param.replace('{71}', firstHolder.CommincationDetails.LocalAddress3);
        param = param.replace('{72}', firstHolder.CommincationDetails.LocalCity);
        param = param.replace('{73}', firstHolder.CommincationDetails.LocalStateCode);
        param = param.replace('{74}', firstHolder.CommincationDetails.LocalPinCode);
        param = param.replace('{75}', firstHolder.CommincationDetails.LocalCountryName);
        param = param.replace('{76}', '');
        param = param.replace('{77}', '');
        param = param.replace('{78}', '');
        param = param.replace('{79}', '');
        // 80   Email
        param = param.replace('{80}', firstHolder.ProfileDetails.Email);
        // 82   Foreign Address 1
        // 83   Foreign Address 2
        // 84   Foreign Address 3
        // 85   Foreign Address City
        // 86   Foreign Address Pincode
        // 87   Foreign Address State
        // 88   Foreign Address Country
        // 89   Foreign Address Resi Phone
        // 90   Foreign Address Fax
        // 91   Foreign Address Off. Phone
        // 92   Foreign Address Off. Fax
        if (firstHolder.ProfileDetails.TaxStatusCode == '21' || firstHolder.ProfileDetails.TaxStatusCode == '24' || firstHolder.ProfileDetails.TaxStatusCode == '26' || firstHolder.ProfileDetails.TaxStatusCode == '28' || firstHolder.ProfileDetails.TaxStatusCode == '61' || firstHolder.ProfileDetails.TaxStatusCode == '62' || firstHolder.ProfileDetails.TaxStatusCode == '70' || firstHolder.ProfileDetails.TaxStatusCode == '77' || firstHolder.ProfileDetails.TaxStatusCode == '78') {
            param = param.replace('{82}', firstHolder.CommincationDetails.ForeignAddress1);
            param = param.replace('{83}', firstHolder.CommincationDetails.ForeignAddress2);
            param = param.replace('{84}', firstHolder.CommincationDetails.ForeignAddress3);
            param = param.replace('{85}', firstHolder.CommincationDetails.ForeignCity);
            param = param.replace('{86}', firstHolder.CommincationDetails.ForeignPinCode);
            param = param.replace('{87}', firstHolder.CommincationDetails.ForeignStateName);
            param = param.replace('{88}', firstHolder.CommincationDetails.ForeignCountryCode);
            param = param.replace('{89}', '');
            param = param.replace('{90}', '');
            param = param.replace('{91}', '');
            param = param.replace('{92}', '');
        }
        else {
            param = param.replace('{82}', '');
            param = param.replace('{83}', '');
            param = param.replace('{84}', '');
            param = param.replace('{85}', '');
            param = param.replace('{86}', '');
            param = param.replace('{87}', '');
            param = param.replace('{88}', '');
            param = param.replace('{89}', '');
            param = param.replace('{90}', '');
            param = param.replace('{91}', '');
            param = param.replace('{92}', '');
        }
        param = param.replace('{93}', firstHolder.ProfileDetails.MobileNumber);
    }

    var secondHolder = data.AccountHolders.find(x => x.SerialNumber === 2);
    if (secondHolder != null) {
        //10	Second Holder First Name
        param = param.replace('{10}', secondHolder.ProfileDetails.Name);
        //11	Second Holder Middle Name
        param = param.replace('{11}', '');
        //12	Second Holder Last Name
        param = param.replace('{12}', '');
        //16	Second Holder DOB
        param = param.replace('{16}', date.format(secondHolder.ProfileDetails.DateOfBirth, 'DD/MM/YYYY'));
        //23	Second Holder PAN Exempt
        param = param.replace('{23}', 'N');
        //27	Second Holder PAN
        param = param.replace('{27}', secondHolder.ProfileDetails.PANCardNumber);
        //31	Second Holder- Exempt Category
        param = param.replace('{31}', '');
        if (secondHolder.ProfileDetails.CKYCNumber != "") {
            param = param.replace('{96}', 'C');
            param = param.replace('{97}', secondHolder.ProfileDetails.CKYCNumber);
        }
        else {
            param = param.replace('{96}', 'K');
            param = param.replace('{97}', '');
        }
        param = param.replace('{103}', '');
        param = param.replace('{113}', secondHolder.ProfileDetails.Email);
        param = param.replace('{114}', secondHolder.ProfileDetails.EmailSelfDeclarationCode);
        param = param.replace('{115}', secondHolder.ProfileDetails.MobileNumber);
        param = param.replace('{116}', secondHolder.ProfileDetails.MobileSelfDeclarationCode);
    }
    else {
        param = param.replace('{10}', '');
        param = param.replace('{11}', '');
        param = param.replace('{12}', '');
        param = param.replace('{16}', '');
        param = param.replace('{23}', '');
        param = param.replace('{27}', '');
        param = param.replace('{31}', '');
        param = param.replace('{96}', '');
        param = param.replace('{97}', '');
        param = param.replace('{103}', '');
        param = param.replace('{113}', '');
        param = param.replace('{114}', '');
        param = param.replace('{115}', '');
        param = param.replace('{116}', '');
    }

    var thirdHolder = data.AccountHolders.find(x => x.SerialNumber === 3);
    if (thirdHolder != null) {
        //13	Third Holder First Name
        param = param.replace('{13}', thirdHolder.ProfileDetails.Name);
        //14	Third Holder Middle Name
        param = param.replace('{14}', '');
        //15	Third Holder Last Name
        param = param.replace('{15}', '');
        //17	Third Holder DOB
        param = param.replace('{17}', date.format(secondHolder.ProfileDetails.DateOfBirth, 'DD/MM/YYYY'));
        //24	Third Holder PAN Exempt
        param = param.replace('{24}', 'N');
        //28	Third Holder PAN
        param = param.replace('{28}', thirdHolder.ProfileDetails.PANCardNumber);
        //32	Third Holder- Exempt Category
        param = param.replace('{32}', '');
        if (thirdHolder.ProfileDetails.CKYCNumber != "") {
            param = param.replace('{116', 'C');
            param = param.replace('{99}', thirdHolder.ProfileDetails.CKYCNumber);
        }
        else {
            param = param.replace('{98}', 'K');
            param = param.replace('{99}', '');
        }
        param = param.replace('{104}', '');
        param = param.replace('{117}', thirdHolder.ProfileDetails.Email);
        param = param.replace('{118}', thirdHolder.ProfileDetails.EmailSelfDeclarationCode);
        param = param.replace('{119}', thirdHolder.ProfileDetails.MobileNumber);
        param = param.replace('{120}', thirdHolder.ProfileDetails.MobileSelfDeclarationCode);
    }
    else {
        param = param.replace('{13}', '');
        param = param.replace('{14}', '');
        param = param.replace('{15}', '');
        param = param.replace('{17}', '');
        param = param.replace('{24}', '');
        param = param.replace('{28}', '');
        param = param.replace('{32}', '');
        param = param.replace('{98}', '');
        param = param.replace('{99}', '');
        param = param.replace('{104}', '');
        param = param.replace('{117}', '');
        param = param.replace('{118}', '');
        param = param.replace('{119}', '');
        param = param.replace('{120}', '');
    }

    // 9   Holding Nature
    param = param.replace('{9}', data.AccountTypeCode);
    //30	Primary Holder- Exempt Category
    param = param.replace('{30}', '');
    // 34  Client Type
    param = param.replace('{34}', BSEService.GetBseClientTypeCode(process.env.BSE_CLIENT_TYPE));
    // 35  PMS
    param = param.replace('{35}', '');
    // 36  Default DP
    param = param.replace('{36}', '');
    // 37  CDSL DPID
    param = param.replace('{37}', '');
    // 38  CDSLCLTID
    param = param.replace('{38}', '');
    // 39  CMBP Id
    param = param.replace('{39}', '');
    // 40  NSDLDPID
    param = param.replace('{40}', '');
    // 41  NSDLCLTID
    param = param.replace('{41}', '');

    var defaultBank = data.AccountBanks.find(x => x.IsDefault === true);
    if (defaultBank != null) {
        //42	Account Type 1
        param = param.replace('{42}', defaultBank.BankAccountTypeCode);
        //43	Account No 1
        param = param.replace('{43}', defaultBank.AccountNumber);
        //44	MICR No 1
        param = param.replace('{44}', defaultBank.MICR);
        //45	IFSC Code 1
        param = param.replace('{45}', defaultBank.IFSC);
        //46	Default Bank Flag
        param = param.replace('{46}', 'Y');
    }
    else {
        param = param.replace('{42}', '');
        param = param.replace('{43}', '');
        param = param.replace('{44}', '');
        param = param.replace('{45}', '');
        param = param.replace('{46}', '');
    }

    var banks = data.AccountBanks.filter(x => x.IsDefault === false);
    // 47  Account Type 2
    // 48  Account No 2
    // 49  MICR No 2
    // 50  IFSC Code 2
    // 51  Default Bank Flag
    if (banks.length > 0) {
        //47	Account Type 2
        param = param.replace('{47}', banks[0].BankAccountTypeCode);
        //48	Account No 2
        param = param.replace('{48}', banks[0].AccountNumber);
        //49	MICR No 2
        param = param.replace('{49}', banks[0].MICR);
        //50	IFSC Code 2
        param = param.replace('{50}', banks[0].IFSC);
        //51	Default Bank Flag
        param = param.replace('{51}', 'N');
    }
    else {
        param = param.replace('{47}', '');
        param = param.replace('{48}', '');
        param = param.replace('{49}', '');
        param = param.replace('{50}', '');
        param = param.replace('{51}', '');
    }
    // 52  Account type 3
    // 53  Account No 3
    // 54  MICR No 3
    // 55  IFSC Code 3
    // 56  Default Bank Flag
    if (banks.length > 1) {
        param = param.replace('{52}', banks[1].BankAccountTypeCode);
        param = param.replace('{53}', banks[1].AccountNumber);
        param = param.replace('{54}', banks[1].MICR);
        param = param.replace('{55}', banks[1].IFSC);
        param = param.replace('{56}', 'N');
    }
    else {
        param = param.replace('{52}', '');
        param = param.replace('{53}', '');
        param = param.replace('{54}', '');
        param = param.replace('{55}', '');
        param = param.replace('{56}', '');
    }
    // 57  Account type 4
    // 58  Account No 4
    // 59  MICR No 4
    // 60  IFSC Code 4
    // 61  Default Bank Flag
    if (banks.length > 2) {
        param = param.replace('{57}', banks[2].BankAccountTypeCode);
        param = param.replace('{58}', banks[2].AccountNumber);
        param = param.replace('{59}', banks[2].MICR);
        param = param.replace('{60}', banks[2].IFSC);
        param = param.replace('{61}', 'N');
    }
    else {
        param = param.replace('{57}', '');
        param = param.replace('{58}', '');
        param = param.replace('{59}', '');
        param = param.replace('{60}', '');
        param = param.replace('{61}', '');
    }
    // 62  Account type 5
    // 63  Account No 5
    // 64  MICR No 5
    // 65  IFSC Code 5
    // 66  Default Bank Flag
    if (banks.length > 3) {
        param = param.replace('{62}', banks[3].BankAccountTypeCode);
        param = param.replace('{63}', banks[3].AccountNumber);
        param = param.replace('{64}', banks[3].MICR);
        param = param.replace('{65}', banks[3].IFSC);
        param = param.replace('{66}', 'N');
    }
    else {
        param = param.replace('{62}', '');
        param = param.replace('{63}', '');
        param = param.replace('{64}', '');
        param = param.replace('{65}', '');
        param = param.replace('{66}', '');
    }
    // 68  Div pay mode
    param = param.replace('{68}', BSEService.GetBseDividendPayModeCode(process.env.BSE_DIVIDEND_PAY_MODE));
    param = param.replace('{81}', BSEService.GetBseCommunicatioModeCode(process.env.BSE_CLIENT_COMMUNICATION));

    if (data.AccountNominees.length > 0) {
        param = param.replace('{122}', 'Y');
        param = param.replace('{123}', 'O');
    }
    else {
        if (data.AccountProfileType == 'C') {
            param = param.replace('{122}', 'N');
            param = param.replace('{123}', 'O');
        }
        else if (firstHolder.ProfileDetails.Age < 18) {
            param = param.replace('{122}', '');
            param = param.replace('{123}', '');
        }
        else {
            param = param.replace('{122}', 'N');
            param = param.replace('{123}', 'O');
        }
    }

    if (data.AccountNominees.length > 0) {
        // 94   Nominee 1 Name
        // 95   Nominee 1 Relationship
        // 96   Nominee 1 Applicable(%)
        // 97   Nominee 1 Minor Flag
        // 98   Nominee 1 DOB
        // 99   Nominee 1 Guardian

        param = param.replace('{124}', data.AccountNominees[0].NomineeName);

        param = param.replace('{125}', data.AccountNominees[0].RelationBSECode);
        param = param.replace('{126}', data.AccountNominees[0].Shares);
        if (data.AccountNominees[0].IsMinorProfile == true) {
            param = param.replace('{127}', 'Y');
            param = param.replace('{128}', date.format(data.AccountNominees[0].DateOfBirth, 'DD/MM/YYYY'));
            param = param.replace('{131}', '2');
            param = param.replace('{132}', (data.AccountNominees[0].AadharCardNumber == '') ? data.AccountNominees[0].GuardianAadharCardNumber.toString().slice(-4) : data.AccountNominees[0].AadharCardNumber.toString().slice(-4));
        }
        else {
            param = param.replace('{127}', 'N');
            param = param.replace('{128}', '');
            param = param.replace('{131}', '1');
            param = param.replace('{132}', data.AccountNominees[0].PANCardNumber);
        }
        param = param.replace('{129}', data.AccountNominees[0].GuardianName);
        param = param.replace('{130}', '');
        param = param.replace('{133}', data.AccountNominees[0].Email);
        param = param.replace('{134}', data.AccountNominees[0].MobileNumber);
        param = param.replace('{135}', data.AccountNominees[0].Address1);
        param = param.replace('{136}', data.AccountNominees[0].Address2);
        param = param.replace('{137}', data.AccountNominees[0].Address3);
        param = param.replace('{138}', data.AccountNominees[0].City);
        param = param.replace('{139}', data.AccountNominees[0].PinCode);
        param = param.replace('{140}', data.AccountNominees[0].CountryName);
    }
    else {
        param = param.replace('{124}', '');
        param = param.replace('{125}', '');
        param = param.replace('{126}', '');
        param = param.replace('{127}', '');
        param = param.replace('{128}', '');
        param = param.replace('{129}', '');
        param = param.replace('{130}', '');
        param = param.replace('{131}', '');
        param = param.replace('{132}', '');
        param = param.replace('{133}', '');
        param = param.replace('{134}', '');
        param = param.replace('{135}', '');
        param = param.replace('{136}', '');
        param = param.replace('{137}', '');
        param = param.replace('{138}', '');
        param = param.replace('{139}', '');
        param = param.replace('{140}', '');
    }

    if (data.AccountNominees.length > 1) {
        // 100  Nominee 2 Name
        // 101  Nominee 2 Relationship
        // 102  Nominee 2 Applicable(%)
        // 103  Nominee 2 DOB
        // 104  Nominee 2 Minor Flag
        // 105  Nominee 2 Guardian

        param = param.replace('{141}', data.AccountNominees[1].NomineeName);

        param = param.replace('{142}', data.AccountNominees[1].RelationBSECode);
        param = param.replace('{143}', data.AccountNominees[1].Shares);
        if (data.AccountNominees[1].IsMinorProfile == true) {
            param = param.replace('{144}', 'Y');
            param = param.replace('{145}', date.format(data.AccountNominees[1].DateOfBirth, 'DD/MM/YYYY'));
            param = param.replace('{148}', '2');
            param = param.replace('{149}', (data.AccountNominees[1].AadharCardNumber == '') ? data.AccountNominees[1].GuardianAadharCardNumber.toString().slice(-4) : data.AccountNominees[1].AadharCardNumber.toString().slice(-4));
        }
        else {
            param = param.replace('{144}', 'N');
            param = param.replace('{145}', '');
            param = param.replace('{148}', '1');
            param = param.replace('{149}', data.AccountNominees[1].PANCardNumber);
        }
        param = param.replace('{146}', data.AccountNominees[1].GuardianName);
        param = param.replace('{147}', '');
        param = param.replace('{150}', data.AccountNominees[1].Email);
        param = param.replace('{151}', data.AccountNominees[1].MobileNumber);
        param = param.replace('{152}', data.AccountNominees[1].Address1);
        param = param.replace('{153}', data.AccountNominees[1].Address2);
        param = param.replace('{154}', data.AccountNominees[1].Address3);
        param = param.replace('{155}', data.AccountNominees[1].City);
        param = param.replace('{156}', data.AccountNominees[1].PinCode);
        param = param.replace('{157}', data.AccountNominees[1].CountryName);
    }
    else {
        param = param.replace('{141}', '');
        param = param.replace('{142}', '');
        param = param.replace('{143}', '');
        param = param.replace('{144}', '');
        param = param.replace('{145}', '');
        param = param.replace('{146}', '');
        param = param.replace('{147}', '');
        param = param.replace('{148}', '');
        param = param.replace('{149}', '');
        param = param.replace('{150}', '');
        param = param.replace('{151}', '');
        param = param.replace('{152}', '');
        param = param.replace('{153}', '');
        param = param.replace('{154}', '');
        param = param.replace('{155}', '');
        param = param.replace('{156}', '');
        param = param.replace('{157}', '');
    }

    if (data.AccountNominees.length > 2) {
        // 106  Nominee 3 Name
        // 107  Nominee 3 Relationship
        // 108  Nominee 3 Applicable(%)
        // 109  Nominee 3 DOB
        // 110  Nominee3 Minor Flag
        // 111  Nominee3 Guardian

        param = param.replace('{158}', data.AccountNominees[2].NomineeName);

        param = param.replace('{159}', data.AccountNominees[2].RelationBSECode);
        param = param.replace('{160}', data.AccountNominees[2].Shares);
        if (data.AccountNominees[2].IsMinorProfile == true) {
            param = param.replace('{161}', 'Y');
            param = param.replace('{162}', date.format(data.AccountNominees[2].DateOfBirth, 'DD/MM/YYYY'));
            param = param.replace('{165}', '2');
            param = param.replace('{166}', (data.AccountNominees[2].AadharCardNumber == '') ? data.AccountNominees[2].GuardianAadharCardNumber.toString().slice(-4) : data.AccountNominees[2].AadharCardNumber.toString().slice(-4));
        }
        else {
            param = param.replace('{161}', 'N');
            param = param.replace('{162}', '');
            param = param.replace('{165}', '1');
            param = param.replace('{166}', data.AccountNominees[2].PANCardNumber);
        }
        param = param.replace('{163}', data.AccountNominees[2].GuardianName);
        param = param.replace('{164}', '');
        param = param.replace('{167}', data.AccountNominees[2].Email);
        param = param.replace('{168}', data.AccountNominees[2].MobileNumber);
        param = param.replace('{169}', data.AccountNominees[2].Address1);
        param = param.replace('{170}', data.AccountNominees[2].Address2);
        param = param.replace('{171}', data.AccountNominees[2].Address3);
        param = param.replace('{172}', data.AccountNominees[2].City);
        param = param.replace('{173}', data.AccountNominees[2].PinCode);
        param = param.replace('{174}', data.AccountNominees[2].CountryName);
    }
    else {
        param = param.replace('{158}', '');
        param = param.replace('{159}', '');
        param = param.replace('{160}', '');
        param = param.replace('{161}', '');
        param = param.replace('{162}', '');
        param = param.replace('{164}', '');
        param = param.replace('{163}', '');
        param = param.replace('{165}', '');
        param = param.replace('{166}', '');
        param = param.replace('{167}', '');
        param = param.replace('{168}', '');
        param = param.replace('{169}', '');
        param = param.replace('{170}', '');
        param = param.replace('{171}', '');
        param = param.replace('{172}', '');
        param = param.replace('{173}', '');
        param = param.replace('{174}', '');
    }

    if (data.AccountNominees.length > 0) {
        param = param.replace('{175}', 'Y');
    }
    else {
        param = param.replace('{175}', '');
    }

    // 125  Mapin Id.
    param = param.replace('{107}', '');
    // 126  Paperless_flag
    param = param.replace('{108}', 'P');
    // 127  LEI No
    param = param.replace('{109}', '');
    // 128  LEI Validity
    param = param.replace('{110}', '');
    // 148  Filler 1
    param = param.replace('{148}', '');
    // 149  Filler 2
    param = param.replace('{149}', '');
    // 150  Filler 3
    param = param.replace('{150}', '');
    param = param.replace('{176}', '');
    param = param.replace('{177}', '');
    param = param.replace('{178}', '');
    param = param.replace('{179}', '');
    param = param.replace('{180}', '');
    param = param.replace('{181}', '');
    param = param.replace('{182}', '');
    param = param.replace('{183}', '');

    // console.log(param);

    return param;
};

BSEService.UploadClientFATCA = async (data) => {
    try {
        var bseConfig = await BSEService.GetBSEConfig();
        var encryptedPassword = await BSEService.GetPassword();
        var param = await BSEService.PrepareClientFATCAParam(data);

        return new Promise(async (resolve, reject) => {
            let inputData = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://www.bsestarmf.in/2016/01/">
            <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
                <wsa:Action>http://www.bsestarmf.in/2016/01/IStarMFWebService/MFAPI</wsa:Action>
                <wsa:To>https://${process.env.BSE_API_LINK}/StarMFWebService/StarMFWebService.svc/Secure</wsa:To></soap:Header>
            <soap:Body>
               <ns:MFAPI>
                  <ns:Flag>01</ns:Flag>
                  <ns:UserId>${bseConfig.UserId}</ns:UserId>
                  <ns:EncryptedPassword>${encryptedPassword}</ns:EncryptedPassword>
                  <ns:param>${param}</ns:param>
               </ns:MFAPI>
            </soap:Body>
         </soap:Envelope>`;

            var headers = {
                'Content-Type': 'application/soap+xml;charset=UTF-8',
                'Accept-Encoding': 'gzip,deflate',
                'action': "http://www.bsestarmf.in/2016/01/IStarMFWebService/MFAPI"
            };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/StarMFWebService/StarMFWebService.svc/Secure',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, inputData);

                const resultData = responseData.toString();

                const xmlData = new DOMParser().parseFromString(resultData, 'text/xml');

                // console.log(xmlData);

                var parser = new xml2json.Parser();
                parser.parseString(xmlData, async (err, result) => {
                    // console.log(JSON.stringify(result));
                    // console.log(err);
                    var MFAPIResultMessage = '';
                    var MFAPIResponse = result["s:Envelope"]["s:Body"][0]["MFAPIResponse"][0]["MFAPIResult"][0];

                    var MFAPIResult = MFAPIResponse.toString().split('|');

                    await BSEService.CreateBSELog(cryptoEngine.ParamDecrypt(data.ClientAccountId, true), cryptoEngine.ParamDecrypt(data.ClientKycProfileId, true), 'FATCA Upload', MFAPIResult[0].toString(), MFAPIResult[1].toString());

                    if (MFAPIResult[0].toString() == "100") {
                        MFAPIResultMessage = MFAPIResult[1];

                        await BSEService.UpdateClientProfileFATCAStatus(data);

                        resolve(MFAPIResultMessage);
                    }
                    else {
                        resolve(MFAPIResult[1].toString());
                    }
                    // console.log(encryptedPassword);
                });
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.PrepareClientFATCAParam = async (data) => {
    //        1   PAN_RP  *
    //        2   PEKRN
    //        3   INV_NAME    *
    //        4   DOB
    //        5   FR_NAME
    //        6   SP_NAME
    //        7   TAX_STATUS  *
    //        8   DATA_SRC    *
    //        9   ADDR_TYPE   *
    //        10  PO_BIR_INC  *
    //        11  CO_BIR_INC  *
    //        12  TAX_RES1    *
    //        13  TPIN1   *
    //        14  ID1_TYPE    *
    //        15  TAX_RES2
    //        16  TPIN2
    //        17  ID2_TYPE
    //        18  TAX_RES3
    //        19  TPIN3
    //        20  ID3_TYPE
    //        21  TAX_RES4
    //        22  TPIN4
    //        23  ID4_TYPE
    //        24  SRCE_WEALT  *
    //        25  CORP_SERVS
    //        26  INC_SLAB    *
    //        27  NET_WORTH
    //        28  NW_DATE
    //        29  PEP_FLAG    *
    //        30  OCC_CODE    *
    //        31  OCC_TYPE    *
    //        32  EXEMP_CODE
    //        33  FFI_DRNFE
    //        34  GIIN_NO
    //        35  SPR_ENTITY
    //        36  GIIN_NA
    //        37  GIIN_EXEMC
    //        38  NFFE_CATG
    //        39  ACT_NFE_SC
    //        40  NATURE_BUS
    //        41  REL_LISTED
    //        42  EXCH_NAME   *
    //        43  UBO_APPL    *
    //        44  UBO_COUNT
    //        45  UBO_NAME
    //        46  UBO_PAN
    //        47  UBO_NATION
    //        48  UBO_ADD1
    //        49  UBO_ADD2
    //        50  UBO_ADD3
    //        51  UBO_CITY
    //        52  UBO_PIN
    //        53  UBO_STATE
    //        54  UBO_CNTRY
    //        55  UBO_ADD_TY
    //        56  UBO_CTR
    //        57  UBO_TIN
    //        58  UBO_ID_TY
    //        59  UBO_COB
    //        60  UBO_DOB
    //        61  UBO_GENDER
    //        62  UBO_FR_NAM
    //        63  UBO_OCC
    //        64  UBO_OCC_TY
    //        65  UBO_TEL
    //        66  UBO_MOBILE
    //        67  UBO_CODE
    //        68  UBO_HOL_PC
    //        69  SDF_FLAG    *
    //        70  UBO_DF  *
    //        71  AADHAAR_RP
    //        72  NEW_CHANGE  *
    //        73  LOG_NAME    *
    //        74  FILLER1
    //        75  FILLER2        

    param = "{1}|{2}|{3}|{4}|{5}|{6}|{7}|{8}|{9}|{10}|{11}|{12}|{13}|{14}|{15}|{16}|{17}|{18}|{19}|{20}|{21}|{22}|{23}|{24}|{25}|{26}|{27}|{28}|{29}|{30}|{31}|{32}|{33}|{34}|{35}|{36}|{37}|{38}|{39}|{40}|{41}|{42}|{43}|{44}|{45}|{46}|{47}|{48}|{49}|{50}|{51}|{52}|{53}|{54}|{55}|{56}|{57}|{58}|{59}|{60}|{61}|{62}|{63}|{64}|{65}|{66}|{67}|{68}|{69}|{70}|{71}|{72}|{73}|{74}|{75}";

    param = param.replace('{1}', data.ProfileDetails.PANCardNumber);
    param = param.replace('{2}', '');
    param = param.replace('{3}', data.ProfileDetails.Name);
    param = param.replace('{4}', '');
    param = param.replace('{5}', '');
    param = param.replace('{6}', '');
    param = param.replace('{7}', data.ProfileDetails.TaxStatusCode);
    param = param.replace('{8}', 'E');
    param = param.replace('{9}', data.CommincationDetails.LocalAddressTypeCode);
    param = param.replace('{10}', (data.ProfileType == 'C') ? data.ProfileDetails.PlaceOfIncorporation : data.ProfileDetails.PlaceOfBirth);
    param = param.replace('{11}', (data.ProfileType == 'C') ? data.ProfileDetails.CountryOfIncorporationFATCACode : data.ProfileDetails.CountryOfBirthFATCACode);
    param = param.replace('{12}', data.CommincationDetails.LocalCountryFATCACode);
    param = param.replace('{13}', data.ProfileDetails.PANCardNumber);
    param = param.replace('{14}', 'D');
    param = param.replace('{15}', '');
    param = param.replace('{16}', '');
    param = param.replace('{17}', '');
    param = param.replace('{18}', '');
    param = param.replace('{19}', '');
    param = param.replace('{20}', '');
    param = param.replace('{21}', '');
    param = param.replace('{22}', '');
    param = param.replace('{23}', '');
    param = param.replace('{24}', data.ProfileDetails.WealthSourceCode);
    param = param.replace('{25}', (data.ProfileType == 'C') ? '04' : '');
    param = param.replace('{26}', data.ProfileDetails.GrossAnnualIncomeCode);
    param = param.replace('{27}', (data.ProfileType == 'C') ? data.ProfileDetails.NetWorth : '');
    param = param.replace('{28}', (data.ProfileType == 'C') ? date.format(data.ProfileDetails.NetWorthDate, 'DD/MM/YYYY') : '');
    param = param.replace('{29}', (data.IsPoliticallyExposed == true) ? 'Y' : 'N');
    param = param.replace('{30}', data.ProfileDetails.OccupationCode);
    param = param.replace('{31}', data.ProfileDetails.OccupationType);
    param = param.replace('{32}', (data.ProfileType == 'C') ? 'N' : '');
    param = param.replace('{33}', (data.ProfileType == 'C') ? 'NA' : '');
    param = param.replace('{34}', (data.ProfileType == 'C') ? 'NA' : '');
    param = param.replace('{35}', '');
    param = param.replace('{36}', '');
    param = param.replace('{37}', '');
    param = param.replace('{38}', '');
    param = param.replace('{39}', '');
    param = param.replace('{40}', (data.ProfileType == 'C') ? 'P' : '');
    param = param.replace('{41}', '');
    param = param.replace('{42}', 'B');
    param = param.replace('{43}', (data.ProfileType == 'C') ? 'Y' : 'N');
    param = param.replace('{44}', (data.ProfileType == 'C') ? '1' : '');//param = param.replace('{44}', (data.ProfileType == 'C')?data.UBODetails.length:'');
    param = param.replace('{45}', (data.ProfileType == 'C') ? data.UBODetails[0].Name : '');
    param = param.replace('{46}', (data.ProfileType == 'C') ? data.UBODetails[0].PANCardNumber : '');
    param = param.replace('{47}', (data.ProfileType == 'C') ? data.UBODetails[0].CountryFATCACode : '');
    param = param.replace('{48}', (data.ProfileType == 'C') ? data.UBODetails[0].Address1.replace(',', '') : '');
    param = param.replace('{49}', (data.ProfileType == 'C') ? data.UBODetails[0].Address2.replace(',', '') : '');
    param = param.replace('{50}', (data.ProfileType == 'C') ? data.UBODetails[0].Address3.replace(',', '') : '');
    param = param.replace('{51}', (data.ProfileType == 'C') ? data.UBODetails[0].City : '');
    param = param.replace('{52}', (data.ProfileType == 'C') ? data.UBODetails[0].PinCode : '');
    param = param.replace('{53}', '');//(data.ProfileType == 'C') ? data.UBODetails[0].StateCode : ''
    param = param.replace('{54}', (data.ProfileType == 'C') ? data.UBODetails[0].CountryFATCACode : '');
    param = param.replace('{55}', (data.ProfileType == 'C') ? data.UBODetails[0].AddressTypeCode : '');
    param = param.replace('{56}', (data.ProfileType == 'C') ? data.UBODetails[0].CountryFATCACode : '');
    param = param.replace('{57}', '');
    param = param.replace('{58}', (data.ProfileType == 'C') ? 'C' : '');
    param = param.replace('{59}', (data.ProfileType == 'C') ? data.UBODetails[0].CountryFATCACode : '');
    param = param.replace('{60}', '');
    param = param.replace('{61}', '');
    param = param.replace('{62}', '');
    param = param.replace('{63}', '');
    param = param.replace('{64}', '');
    param = param.replace('{65}', '');
    param = param.replace('{66}', '');
    param = param.replace('{67}', (data.ProfileType == 'C') ? 'C14' : '');
    param = param.replace('{68}', '');
    param = param.replace('{69}', (data.ProfileType == 'C') ? 'Y' : '');
    param = param.replace('{70}', (data.ProfileType == 'C') ? 'Y' : 'N');
    param = param.replace('{71}', '');
    param = param.replace('{72}', (data.IsFATCAUploaded == true) ? 'C' : 'N');
    param = param.replace('{73}', data.ProfileDetails.PANCardNumber);
    param = param.replace('{74}', '');
    param = param.replace('{75}', '');

    // console.log(param);

    return param;
};

BSEService.UploadMandateMFD = async (data) => {
    try {
        var bseConfig = await BSEService.GetBSEConfig();
        var encryptedPassword = await BSEService.GetPassword();
        var param = await BSEService.PrepareMandateMFDParam(data);

        return new Promise(async (resolve, reject) => {
            let inputData = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://www.bsestarmf.in/2016/01/">
            <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
                <wsa:Action>http://www.bsestarmf.in/2016/01/IStarMFWebService/MFAPI</wsa:Action>
                <wsa:To>https://${process.env.BSE_API_LINK}/StarMFWebService/StarMFWebService.svc/Secure</wsa:To></soap:Header>
            <soap:Body>
               <ns:MFAPI>
                  <ns:Flag>06</ns:Flag>
                  <ns:UserId>${bseConfig.UserId}</ns:UserId>
                  <ns:EncryptedPassword>${encryptedPassword}</ns:EncryptedPassword>
                  <ns:param>${param}</ns:param>
               </ns:MFAPI>
            </soap:Body>
         </soap:Envelope>`;

            var headers = {
                'Content-Type': 'application/soap+xml;charset=UTF-8',
                'Accept-Encoding': 'gzip,deflate',
                'action': "http://www.bsestarmf.in/2016/01/IStarMFWebService/MFAPI"
            };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/StarMFWebService/StarMFWebService.svc/Secure',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, inputData);

                const resultData = responseData.toString();

                const xmlData = new DOMParser().parseFromString(resultData, 'text/xml');

                // console.log(xmlData);

                var parser = new xml2json.Parser();
                parser.parseString(xmlData, async (err, result) => {
                    // console.log(JSON.stringify(result));
                    // console.log(err);
                    var MFAPIResultMessage = '';
                    var BSEMandateId = '';
                    var MFAPIResponse = result["s:Envelope"]["s:Body"][0]["MFAPIResponse"][0]["MFAPIResult"][0];

                    var MFAPIResult = MFAPIResponse.toString().split('|');
                    if (MFAPIResult[0].toString() == "100") {
                        MFAPIResultMessage = MFAPIResult[1];
                        BSEMandateId = MFAPIResult[2];

                        await BSEService.CreateBSELog(cryptoEngine.ParamDecrypt(data.ClientAccountId, true), cryptoEngine.ParamDecrypt(data.AccountMandate.Id, true), 'Mandate Upload', MFAPIResult[0].toString(), MFAPIResult[1].toString() + "|" + BSEMandateId);

                        await BSEService.UpdateClientAccountMandateBSEStatus(data, BSEMandateId);

                        resolve(MFAPIResult[1].toString() + "|" + BSEMandateId);
                    }
                    else {
                        // console.log(param);
                        await BSEService.CreateBSELog(cryptoEngine.ParamDecrypt(data.ClientAccountId, true), cryptoEngine.ParamDecrypt(data.AccountMandate.Id, true), 'Mandate Upload', MFAPIResult[0].toString(), MFAPIResult[1].toString());
                        resolve(MFAPIResult[1].toString());
                    }
                    // console.log(encryptedPassword);
                });
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.PrepareMandateMFDParam = async (data) => {
    //        0   CLIENT CODE
    //        1   AMOUNT
    //        2   Mandate Type
    //        3   ACCOUNT NO.
    //        4   A/C TYPE
    //        5   IFSC CODE
    //        6   MICR CODE
    //        7   START DATE
    //        8   END DATE

    let param = data.UCC + "|" +
        data.AccountMandate.Amount + "|" +
        data.AccountMandate.MandateTypeCode + "|" +
        data.AccountMandate.AccountNumber + "|" +
        data.AccountMandate.BankAccountTypeCode + "|" +
        data.AccountMandate.IFSC + "|" + "|" +
        date.format(data.StartDate, "DD/MM/YYYY") + "|" +
        date.format(data.EndDate, "DD/MM/YYYY");

    return param;
};

BSEService.UploadClientAOF = async (data) => {
    try {
        var bseConfig = await BSEService.GetBSEConfig();
        var encryptedPassword = await BSEService.GetPasswordFileUpload();

        return new Promise(async (resolve, reject) => {
            let inputData = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/" xmlns:star="http://schemas.datacontract.org/2004/07/StarMFFileUploadService">
        <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
            <wsa:Action>http://tempuri.org/IStarMFFileUploadService/UploadFile</wsa:Action>
            <wsa:To>https://${process.env.BSE_API_LINK}/StarMFFileUploadService/StarMFFileUploadService.svc/Secure</wsa:To>
        </soap:Header>
        <soap:Body>
           <tem:UploadFile>
              <tem:data>
                 <star:ClientCode>${data.UCC}</star:ClientCode>
                 <star:DocumentType>NRM</star:DocumentType>
                 <star:EncryptedPassword>${encryptedPassword}</star:EncryptedPassword>
                 <star:FileName>${data.FileName}</star:FileName>
                 <star:Filler1></star:Filler1>
                 <star:Filler2></star:Filler2>
                 <star:Flag>UCC</star:Flag>
                 <star:MemberCode>${bseConfig.MemberId}</star:MemberCode>
                 <star:UserId>${bseConfig.UserId}</star:UserId>
                 <star:pFileBytes>${data.FileContent}</star:pFileBytes>
              </tem:data>
           </tem:UploadFile>
        </soap:Body>
     </soap:Envelope>`;

            var headers = {
                'Content-Type': 'application/soap+xml;charset=UTF-8',
                'Accept-Encoding': 'gzip,deflate',
                'action': "http://tempuri.org/IStarMFFileUploadService/UploadFile"
            };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/StarMFFileUploadService/StarMFFileUploadService.svc/Secure',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, inputData);

                const resultData = responseData.toString();

                const xmlData = new DOMParser().parseFromString(resultData, 'text/xml');

                // console.log(xmlData);

                var parser = new xml2json.Parser();
                parser.parseString(xmlData, async (err, result) => {
                    // console.log(JSON.stringify(result));
                    // console.log(err);
                    var UploadFileResultMessage = '';
                    var UploadFileResponse = result["s:Envelope"]["s:Body"][0]["UploadFileResponse"][0]["UploadFileResult"][0];

                    var UploadFileResult = UploadFileResponse;

                    await BSEService.CreateBSELog(cryptoEngine.ParamDecrypt(data.ClientAccountId, true), 0, 'AOF Image Upload', UploadFileResult['b:Status'][0].toString(), UploadFileResult['b:ResponseString'][0].toString());

                    if (UploadFileResult['b:Status'][0].toString() == "100") {
                        UploadFileResultMessage = UploadFileResult['b:ResponseString'][0];

                        await BSEService.UpdateClientAOFImageUploadStatus(data);

                        resolve(UploadFileResultMessage);
                    }
                    else {
                        resolve(UploadFileResult['b:ResponseString'][0].toString());
                    }
                });
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.UploadMandateScanFile = async (data) => {
    try {
        var bseConfig = await BSEService.GetBSEConfig();

        var encryptedPassword = await BSEService.GetPasswordFileUpload();

        return new Promise(async (resolve, reject) => {
            let inputData = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/" xmlns:star="http://schemas.datacontract.org/2004/07/StarMFFileUploadService">
            <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
                <wsa:Action>http://tempuri.org/IStarMFFileUploadService/UploadMandateScanFile</wsa:Action>
                <wsa:To>https://${process.env.BSE_API_LINK}/StarMFFileUploadService/StarMFFileUploadService.svc/Secure</wsa:To></soap:Header>
            <soap:Body>
               <tem:UploadMandateScanFile>
                  <tem:Data>
                     <star:ClientCode>${data.UCC}</star:ClientCode>
                     <star:EncryptedPassword>${encryptedPassword}</star:EncryptedPassword>
                     <star:Filler1>YESB00709000028661</star:Filler1>
                     <star:Filler2>FINLOGIC</star:Filler2>
                     <star:Flag>SCAN_MANDATE</star:Flag>
                     <star:ImageName>${data.FileName}</star:ImageName>
                     <star:ImageType>${data.FileContentType}</star:ImageType>
                     <star:MandateId>${data.BSEMandateId}</star:MandateId>
                     <star:MandateType>XSP</star:MandateType>
                     <star:MemberCode>${bseConfig.MemberId}</star:MemberCode>
                     <star:pFileBytes>${data.FileContent}</star:pFileBytes>
                  </tem:Data>
               </tem:UploadMandateScanFile>
            </soap:Body>
         </soap:Envelope>`;

            var headers = {
                'Content-Type': 'application/soap+xml;charset=UTF-8',
                'Accept-Encoding': 'gzip,deflate',
                'action': "http://tempuri.org/IStarMFFileUploadService/UploadMandateScanFile"
            };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/StarMFFileUploadService/StarMFFileUploadService.svc/Secure',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, inputData);

                const resultData = responseData.toString();

                const xmlData = new DOMParser().parseFromString(resultData, 'text/xml');

                // console.log(xmlData);

                var parser = new xml2json.Parser();
                parser.parseString(xmlData, async (err, result) => {
                    // console.log(JSON.stringify(result));
                    // console.log(err);
                    var UploadFileResultMessage = '';
                    var UploadFileResponse = result["s:Envelope"]["s:Body"][0]["UploadMandateScanFileResponse"][0]["UploadMandateScanFileResult"][0];

                    var UploadFileResult = UploadFileResponse;

                    await BSEService.CreateBSELog(cryptoEngine.ParamDecrypt(data.ClientAccountId, true), cryptoEngine.ParamDecrypt(data.ClientAccountMandateId, true), 'Mandate Image Upload', UploadFileResult['b:Status'][0].toString(), UploadFileResult['b:ResponseString'][0].toString());

                    if (UploadFileResult['b:Status'][0].toString() == "100" && !(UploadFileResult['b:ResponseString'][0].includes('SOME ERROR OCCURED'))) {
                        UploadFileResultMessage = UploadFileResult['b:ResponseString'][0];

                        await BSEService.UpdateClientMandateImageUploadStatus(data);

                        resolve(UploadFileResultMessage);
                    }
                    else {
                        resolve(UploadFileResult['b:ResponseString'][0].toString());
                    }
                });
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.GetAccessTokenSMFWS = async (requestType) => {
    try {
        var bseConfig = await BSEService.GetBSEConfig();

        return new Promise(async (resolve, reject) => {
            let inputData = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://www.bsestarmf.in/2016/01/" xmlns:star="http://schemas.datacontract.org/2004/07/StarMFWebService">
            <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
                <wsa:Action>http://www.bsestarmf.in/2016/01/IStarMFWebService/GetAccessToken</wsa:Action>
                <wsa:To>https://${process.env.BSE_API_LINK}/StarMFWebService/StarMFWebService.svc/Secure</wsa:To>
            </soap:Header>
            <soap:Body>
               <ns:GetAccessToken>
                  <ns:Param>
                     <star:MemberId>${bseConfig.MemberId}</star:MemberId>
                     <star:PassKey>${bseConfig.PassKey}</star:PassKey>
                     <star:Password>${bseConfig.Password}</star:Password>
                     <star:RequestType>${requestType}</star:RequestType>
                     <star:UserId>${bseConfig.UserId}</star:UserId>
                  </ns:Param>
               </ns:GetAccessToken>
            </soap:Body>
         </soap:Envelope>`;

            var headers = {
                'Content-Type': 'application/soap+xml;charset=UTF-8',
                'Accept-Encoding': 'gzip,deflate',
                'action': "http://www.bsestarmf.in/2016/01/IStarMFWebService/GetAccessToken"
            };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/StarMFWebService/StarMFWebService.svc/Secure',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, inputData);

                const resultData = responseData.toString();

                const xmlData = new DOMParser().parseFromString(resultData, 'text/xml');

                // console.log(xmlData);

                var parser = new xml2json.Parser();
                parser.parseString(xmlData, async (err, result) => {
                    // console.log(JSON.stringify(result));
                    // console.log(err);
                    var GetAccessTokenResultMessage = '';
                    var GetAccessTokenResponse = result["s:Envelope"]["s:Body"][0]["GetAccessTokenResponse"][0]["GetAccessTokenResult"][0];

                    var GetAccessTokenResult = GetAccessTokenResponse;

                    if (GetAccessTokenResult['b:Status'][0].toString() == "100") {
                        GetAccessTokenResultMessage = GetAccessTokenResult['b:ResponseString'][0];

                        resolve(GetAccessTokenResultMessage);
                    }
                    else {
                        reject(new Error(GetAccessTokenResult['b:ResponseString'][0].toString()));
                    }
                    // console.log(encryptedPassword);
                });
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.GetMandateStatus = async (req, res, data) => {
    try {
        var bseConfig = await BSEService.GetBSEConfig();

        var encryptedPassword = await BSEService.GetAccessTokenSMFWS('MANDATE');

        return new Promise(async (resolve, reject) => {
            let inputData = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://www.bsestarmf.in/2016/01/" xmlns:star="http://schemas.datacontract.org/2004/07/StarMFWebService">
            <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
                <wsa:Action>http://www.bsestarmf.in/2016/01/IStarMFWebService/MandateDetails</wsa:Action>
                <wsa:To>https://${process.env.BSE_API_LINK}/StarMFWebService/StarMFWebService.svc/Secure</wsa:To>
            </soap:Header>
            <soap:Body>
               <ns:MandateDetails>
                  <ns:Param>
                     <star:ClientCode>${data.UCC}</star:ClientCode>
                     <star:EncryptedPassword>${encryptedPassword}</star:EncryptedPassword>
                     <star:FromDate>${data.FromDate}</star:FromDate>
                     <star:MandateId>${data.BSEMandateId}</star:MandateId>
                     <star:MemberCode>${bseConfig.MemberId}</star:MemberCode>
                     <star:ToDate>${data.ToDate}</star:ToDate>
                  </ns:Param>
               </ns:MandateDetails>
            </soap:Body>
         </soap:Envelope>`;

            var headers = {
                'Content-Type': 'application/soap+xml;charset=UTF-8',
                'Accept-Encoding': 'gzip,deflate',
                'action': "http://www.bsestarmf.in/2016/01/IStarMFWebService/MandateDetails"
            };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/StarMFWebService/StarMFWebService.svc/Secure',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, inputData);

                const resultData = responseData.toString();

                const xmlData = new DOMParser().parseFromString(resultData, 'text/xml');

                // console.log(xmlData);

                var parser = new xml2json.Parser();
                parser.parseString(xmlData, async (err, result) => {
                    // console.log(JSON.stringify(result));
                    // console.log(err);
                    var MandateDetailsResultMessage = '';
                    var MandateDetailsResultRemarks = '';
                    var MandateDetailsResponse = result["s:Envelope"]["s:Body"][0]["MandateDetailsResponse"][0]["MandateDetailsResult"][0];

                    var MandateDetailsResult = MandateDetailsResponse;

                    if (MandateDetailsResult['b:Status'][0].toString() == "100") {
                        MandateDetailsResultMessage = MandateDetailsResult['b:MandateDetails'][0]['b:MandateDetails'][0]['b:Status'][0];
                        MandateDetailsResultRemarks = MandateDetailsResult['b:MandateDetails'][0]['b:MandateDetails'][0]['b:Remarks'][0];

                        await BSEService.CreateBSELog(cryptoEngine.ParamDecrypt(data.ClientAccountId, true), cryptoEngine.ParamDecrypt(data.Id, true), 'Mandate Status', MandateDetailsResult['b:Status'][0].toString(), MandateDetailsResultMessage);

                        await BSEService.UpdateClientAccountMandateStatus(data, MandateDetailsResultMessage, MandateDetailsResultRemarks);

                        resolve({ Message: MandateDetailsResultMessage });
                    }
                    else {
                        await BSEService.CreateBSELog(cryptoEngine.ParamDecrypt(data.ClientAccountId, true), cryptoEngine.ParamDecrypt(data.Id, true), 'Mandate Status', MandateDetailsResult['b:Status'][0].toString(), MandateDetailsResult['b:Message'][0].toString());
                        resolve({ Message: MandateDetailsResult['b:Message'][0].toString() });
                    }
                    // console.log(encryptedPassword);
                });
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.PushBuyTransaction = async (data) => {
    try {
        var bseConfig = await BSEService.GetBSEConfig();
        var encryptedPassword = await BSEService.GetPasswordOrderEntry();
        var utn = await BSEService.GetTempBSEURN();
        // console.log('SchemeName:'+data.SchemeName);
        // console.log('ISIN:'+data.ISIN);
        // console.log('Amount:'+data.Amount);
        var schemeDetails;
        var currentDate = new Date();
        var transNo = bseConfig.UserId + '' + currentDate.getFullYear() + '' + commonFunction.padLeft((currentDate.getMonth() + 1).toString(), '0', 2) + '' + commonFunction.padLeft(currentDate.getDate().toString(), '0', 2) + '' + utn;

        if (data.FolioNumber == '' || data.FolioNumber == 'New Folio') {
            schemeDetails = await BSEService.GetBSESchemeByISINAmount(data.SchemeName, data.ISIN, data.Amount);
        }
        else {
            schemeDetails = await BSEService.GetBSESchemeAdditionalByISINAmount(data.SchemeName, data.ISIN, data.Amount);
        }

        //TODO: need to handle null schemeDetails

        return new Promise(async (resolve, reject) => {
            let inputData = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:bses="http://bsestarmf.in/">
            <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
                <wsa:Action>http://bsestarmf.in/MFOrderEntry/orderEntryParam</wsa:Action>
                <wsa:To>https://${process.env.BSE_API_LINK}/MFOrderEntry/MFOrder.svc/Secure</wsa:To>
            </soap:Header>
            <soap:Body>
                <bses:orderEntryParam>
                    <bses:TransCode>NEW</bses:TransCode>
                    <bses:TransNo>${transNo}</bses:TransNo>
                    <bses:OrderId>0</bses:OrderId>
                    <bses:UserID>${bseConfig.UserId}</bses:UserID>
                    <bses:MemberId>${bseConfig.MemberId}</bses:MemberId>
                    <bses:ClientCode>${data.UCC}</bses:ClientCode>
                    <bses:SchemeCd>${schemeDetails.SchemeCode}</bses:SchemeCd>
                    <bses:BuySell>P</bses:BuySell>
                    <bses:BuySellType>${(data.FolioNumber == '' || data.FolioNumber == 'New Folio') ? 'FRESH' : 'ADDITIONAL'}</bses:BuySellType>
                    <bses:DPTxn>${(schemeDetails.PurchaseTransactionMode == 'DP') ? 'P' : schemeDetails.PurchaseTransactionMode}</bses:DPTxn>
                    <bses:OrderVal>${data.Amount}</bses:OrderVal>
                    <bses:Qty>0</bses:Qty>
                    <bses:AllRedeem>N</bses:AllRedeem>
                    <bses:FolioNo>${(data.FolioNumber == '' || data.FolioNumber == 'New Folio') ? '' : data.FolioNumber}</bses:FolioNo>
                    <bses:Remarks/>
                    <bses:KYCStatus>Y</bses:KYCStatus>
                    <bses:RefNo>P${data.Id}</bses:RefNo>
                    <bses:SubBrCode>${(data.AssociateCode == '01') ? '' : bseConfig.MemberId.toString() + data.AssociateCode}</bses:SubBrCode>
                    <bses:EUIN>E${data.EUIN}</bses:EUIN>
                    <bses:EUINVal>Y</bses:EUINVal>
                    <bses:MinRedeem>N</bses:MinRedeem>
                    <bses:DPC>${(data.SchemeName.toLowerCase().includes('insured')) ? 'Y' : 'N'}</bses:DPC>
                    <bses:IPAdd>120.0.0.1</bses:IPAdd>
                    <bses:Password>${encryptedPassword}</bses:Password>
                    <bses:PassKey>${bseConfig.PassKey}</bses:PassKey>
                    <bses:Parma1>${(data.AssociateCode == '01') ? '' : ((data.ARN == '') ? '' : 'ARN-' + data.ARN)}</bses:Parma1>
                    <bses:Param2/>
                    <bses:Param3/>
                    <bses:MobileNo>${data.MobileNumber}</bses:MobileNo>
                    <bses:EmailID>${data.Email}</bses:EmailID>
                    <bses:MandateID/>
                    <bses:Filler1/>
                    <bses:Filler2/>
                    <bses:Filler3/>
                    <bses:Filler4/>
                    <bses:Filler5/>
                    <bses:Filler6/>
                </bses:orderEntryParam>
            </soap:Body>
        </soap:Envelope>`;

            // console.log(inputData);

            var headers = {
                'Content-Type': 'application/soap+xml;charset=UTF-8',
                'Accept-Encoding': 'gzip,deflate',
                'action': "http://bsestarmf.in/MFOrderEntry/orderEntryParam"
            };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/MFOrderEntry/MFOrder.svc/Secure',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, inputData);

                const resultData = responseData.toString();

                const xmlData = new DOMParser().parseFromString(resultData, 'text/xml');

                // console.log(xmlData);

                var parser = new xml2json.Parser();
                parser.parseString(xmlData, (err, result) => {
                    // console.log(JSON.stringify(result));
                    // console.log(err);
                    var transactionCode = '';
                    var transactionNumber = '';
                    var orderId = '';
                    var loginUserId = '';
                    var loginMemberId = '';
                    var ucc = '';
                    var responseData = '';
                    var responseCode = '';
                    var status = false;

                    var orderEntryParamResult = result["s:Envelope"]["s:Body"][0]["orderEntryParamResponse"][0]["orderEntryParamResult"][0];

                    var orderEntryResult = orderEntryParamResult.toString().split('|');

                    transactionCode = orderEntryResult[0];
                    transactionNumber = orderEntryResult[1];
                    orderId = orderEntryResult[2];
                    loginUserId = orderEntryResult[3];
                    loginMemberId = orderEntryResult[4];
                    ucc = orderEntryResult[5];
                    responseData = orderEntryResult[6];
                    responseCode = orderEntryResult[7];

                    if (responseCode.toString() == "0") {
                        status = true;
                    }
                    else {
                        status = false;
                    }

                    // console.log({ Status: status, TransactionCode: transactionCode, TransactionNumber: transactionNumber, OrderId: orderId, LoginUserId: loginUserId, LoginMemberId: loginMemberId, UCC: ucc, ResponseData: responseData, ResponseCode: responseCode });

                    resolve({ Status: status, TransactionCode: transactionCode, TransactionNumber: transactionNumber, OrderId: orderId, LoginUserId: loginUserId, LoginMemberId: loginMemberId, UCC: ucc, ResponseData: responseData, ResponseCode: responseCode });
                });
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.PushXSIPTransaction = async (data) => {
    try {
        var bseConfig = await BSEService.GetBSEConfig();
        var encryptedPassword = await BSEService.GetPasswordOrderEntry();
        var utn = await BSEService.GetTempBSEURN();
        // console.log('SchemeName:'+data.SchemeName);
        // console.log('ISIN:'+data.ISIN);
        // console.log('Amount:'+data.Amount);
        var schemeDetails;
        var currentDate = new Date();
        var transNo = bseConfig.UserId + '' + currentDate.getFullYear() + '' + commonFunction.padLeft((currentDate.getMonth() + 1).toString(), '0', 2) + '' + commonFunction.padLeft(currentDate.getDate().toString(), '0', 2) + '' + utn;

        schemeDetails = await BSEService.GetBSESIPSchemeByISINAmountFrequency(data.SchemeName, data.ISIN, data.Amount, data.SIPFrequency);

        return new Promise(async (resolve, reject) => {
            let inputData = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:bses="http://bsestarmf.in/">
                <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
                    <wsa:Action>http://bsestarmf.in/MFOrderEntry/xsipOrderEntryParam</wsa:Action>
                    <wsa:To>https://${process.env.BSE_API_LINK}/MFOrderEntry/MFOrder.svc/Secure</wsa:To>
                </soap:Header>
                <soap:Body>
                    <bses:xsipOrderEntryParam>
                        <bses:TransactionCode>NEW</bses:TransactionCode>
                        <bses:UniqueRefNo>${transNo}</bses:UniqueRefNo>
                        <bses:SchemeCode>${schemeDetails.SchemeCode}</bses:SchemeCode>
                        <bses:MemberCode>${bseConfig.MemberId}</bses:MemberCode>
                        <bses:ClientCode>${data.UCC}</bses:ClientCode>
                        <bses:UserId>${bseConfig.UserId}</bses:UserId>
                        <bses:InternalRefNo>SIP${data.Id}</bses:InternalRefNo>
                        <bses:TransMode>${(schemeDetails.SIPTransactionMode == 'DP') ? 'P' : schemeDetails.SIPTransactionMode}</bses:TransMode>
                        <bses:DpTxnMode>P</bses:DpTxnMode>
                        <bses:StartDate>${data.SIPStartDate}</bses:StartDate>
                        <bses:FrequencyType>${data.SIPFrequency}</bses:FrequencyType>
                        <bses:FrequencyAllowed>1</bses:FrequencyAllowed>
                        <bses:InstallmentAmount>${data.Amount}</bses:InstallmentAmount>
                        <bses:NoOfInstallment>${data.SIPTenure}</bses:NoOfInstallment>
                        <bses:Remarks></bses:Remarks>
                        <bses:FolioNo>${(data.FolioNumber == '' || data.FolioNumber == 'New Folio') ? '' : data.FolioNumber}</bses:FolioNo>
                        <bses:FirstOrderFlag>${data.IsFirstOrderToday}</bses:FirstOrderFlag>
                        <bses:Brokerage></bses:Brokerage>
                        <bses:MandateID>${data.BSEMandateId}</bses:MandateID>
                        <bses:SubberCode>${(data.AssociateCode == '01') ? '' : bseConfig.MemberId.toString() + data.AssociateCode}</bses:SubberCode>
                        <bses:Euin>E${data.EUIN}</bses:Euin>
                        <bses:EuinVal>Y</bses:EuinVal>
                        <bses:DPC>${(data.SchemeName.toLowerCase().includes('insured')) ? 'Y' : 'N'}</bses:DPC>
                        <bses:XsipRegID>${data.BSEOrderId}</bses:XsipRegID>
                        <bses:IPAdd>120.0.0.1</bses:IPAdd>
                        <bses:Password>${encryptedPassword}</bses:Password>
                        <bses:PassKey>${bseConfig.PassKey}</bses:PassKey>
                        <bses:Param1>${(data.AssociateCode == '01') ? '' : ((data.ARN == '') ? '' : 'ARN-' + data.ARN)}</bses:Param1>
                        <bses:Param2></bses:Param2>
                        <bses:Param3>${(data.SIPFrequency == 'Daily') ? data.SIPEndDate : ''}</bses:Param3>
                        <bses:Filler1>${data.MobileNumber}</bses:Filler1>
                        <bses:Filler2>${data.Email}</bses:Filler2>
                        <bses:Filler3></bses:Filler3>
                        <bses:Filler4></bses:Filler4>
                        <bses:Filler5></bses:Filler5>
                        <bses:Filler6></bses:Filler6>
                    </bses:xsipOrderEntryParam>
                </soap:Body>
            </soap:Envelope>`;

            // console.log(inputData);

            var headers = {
                'Content-Type': 'application/soap+xml;charset=UTF-8',
                'Accept-Encoding': 'gzip,deflate',
                'action': "http://bsestarmf.in/MFOrderEntry/xsipOrderEntryParam"
            };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/MFOrderEntry/MFOrder.svc/Secure',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, inputData);

                const resultData = responseData.toString();

                const xmlData = new DOMParser().parseFromString(resultData, 'text/xml');

                // console.log(xmlData);

                var parser = new xml2json.Parser();
                parser.parseString(xmlData, (err, result) => {
                    // console.log(JSON.stringify(result));
                    // console.log(err);
                    var transactionCode = '';
                    var transactionNumber = '';
                    var loginMemberId = '';
                    var ucc = '';
                    var loginUserId = '';
                    var sipRegId = '';
                    var responseData = '';
                    var responseCode = '';
                    var firstOrderTodayOrderNumber = '';
                    var status = false;

                    var xsipOrderEntryParamResult = result["s:Envelope"]["s:Body"][0]["xsipOrderEntryParamResponse"][0]["xsipOrderEntryParamResult"][0];

                    var xsipOrderEntryResult = xsipOrderEntryParamResult.toString().split('|');

                    transactionCode = xsipOrderEntryResult[0];
                    transactionNumber = xsipOrderEntryResult[1];
                    loginMemberId = xsipOrderEntryResult[2];
                    ucc = xsipOrderEntryResult[3];
                    loginUserId = xsipOrderEntryResult[4];
                    sipRegId = xsipOrderEntryResult[5];
                    responseData = xsipOrderEntryResult[6];
                    responseCode = xsipOrderEntryResult[7];
                    firstOrderTodayOrderNumber = xsipOrderEntryResult[8];

                    if (responseCode.toString() == "0") {
                        status = true;
                    }
                    else {
                        status = false;
                    }

                    // console.log({ Status: status, TransactionCode: transactionCode, TransactionNumber: transactionNumber, OrderId: orderId, LoginUserId: loginUserId, LoginMemberId: loginMemberId, UCC: ucc, ResponseData: responseData, ResponseCode: responseCode });

                    resolve({ Status: status, TransactionCode: transactionCode, TransactionNumber: transactionNumber, SIPRegistrationId: sipRegId, LoginUserId: loginUserId, LoginMemberId: loginMemberId, UCC: ucc, FirstOrderTodayOrderNumber: firstOrderTodayOrderNumber, ResponseData: responseData, ResponseCode: responseCode });
                });
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.PrepareSWPMFDParam = async (data) => {
    // 1	Client Code
    // 2	Bse Scheme Code
    // 3	Transaction Mode
    // 4	Folio Number
    // 5	Internal Ref Number
    // 6	Start Date
    // 7	Number Of Withdrawls
    // 8	Frequency Type
    // 9	Installment Amount
    // 10	Installment Units
    // 11	First Order Today
    // 12	Sub Broker Code
    // 13	EUIN Declaration
    // 15	EUIN Number
    // 15	Remarks
    // 16	Sub Broker - ARN
    // 17	Mobile No.
    // 18	Email Id
    // 19	Bank Account No.

    var bseConfig = await BSEService.GetBSEConfig();

    var folioNumberSplit = data.FolioNumber.split('/');

    let param = data.UCC + "|" +
        data.SchemeCode + "|" +
        data.BSETransactionMode + "|" +
        folioNumberSplit[0] + "|" +
        data.InternalRefNumber + "|" +
        date.format(data.StartDate, "DD/MM/YYYY") + "|" +
        data.SWPMonths + "|" +
        data.SWPFrequency + "|" +
        data.SWPInstallmentAmount + "|" +
        "0" + "|" +
        "N" + "|" +
        ((data.AssociateCode == '01') ? '' : bseConfig.MemberId.toString() + data.AssociateCode) + "|" +
        "Y" + "|" +
        "E" + data.EUIN + "|" +
        "" + "|" +
        ((data.AssociateCode == '01') ? '' : ((data.ARN == '') ? '' : 'ARN-' + data.ARN)) + "|" +
        data.MobileNumber + "|" +
        data.Email + "|" +
        data.BankAccountNumber;

    return param;
};

BSEService.PrepareSWPMFDCancelParam = async (data) => {
    // 1	SWP registration no
    // 2	client code
    // 3	remarks

    let param = data.BSEOrderId + "|" +
        data.UCC + "|" +
        data.Remarks;

    return param;
};

BSEService.PushSWPTransaction = async (data) => {
    try {
        var bseConfig = await BSEService.GetBSEConfig();
        var encryptedPassword = await BSEService.GetPassword();
        var utn = await BSEService.GetTempBSEURN();
        var schemeDetails;
        var currentDate = new Date();
        var transNo = bseConfig.UserId + '' + currentDate.getFullYear() + '' + commonFunction.padLeft((currentDate.getMonth() + 1).toString(), '0', 2) + '' + commonFunction.padLeft(currentDate.getDate().toString(), '0', 2) + '' + utn;

        schemeDetails = await BSEService.GetBSESWPSchemeByISINAmountFrequency(data.SchemeName, data.ISIN, data.SWPInstallmentAmount, data.SWPFrequency);

        data.SchemeCode = schemeDetails.BSESchemeCode;
        data.BSETransactionMode = (schemeDetails.ASWPTransactionMode == 'DP') ? 'P' : schemeDetails.ASWPTransactionMode;
        data.InternalRefNumber = transNo;

        var param = await BSEService.PrepareSWPMFDParam(data);

        return new Promise(async (resolve, reject) => {
            let inputData = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://www.bsestarmf.in/2016/01/">
            <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
                <wsa:Action>http://www.bsestarmf.in/2016/01/IStarMFWebService/MFAPI</wsa:Action>
                <wsa:To>https://${process.env.BSE_API_LINK}/StarMFWebService/StarMFWebService.svc/Secure</wsa:To></soap:Header>
            <soap:Body>
               <ns:MFAPI>
                  <ns:Flag>08</ns:Flag>
                  <ns:UserId>${bseConfig.UserId}</ns:UserId>
                  <ns:EncryptedPassword>${encryptedPassword}</ns:EncryptedPassword>
                  <ns:param>${param}</ns:param>
               </ns:MFAPI>
            </soap:Body>
         </soap:Envelope>`;

            // console.log(inputData);

            var headers = {
                'Content-Type': 'application/soap+xml;charset=UTF-8',
                'Accept-Encoding': 'gzip,deflate',
                'action': "http://www.bsestarmf.in/2016/01/IStarMFWebService/MFAPI"
            };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/StarMFWebService/StarMFWebService.svc/Secure',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, inputData);

                const resultData = responseData.toString();

                const xmlData = new DOMParser().parseFromString(resultData, 'text/xml');

                // console.log(xmlData);

                var parser = new xml2json.Parser();
                parser.parseString(xmlData, async (err, result) => {
                    // console.log(JSON.stringify(result));
                    // console.log(err);
                    var status = false;
                    var MFAPIResultMessage = '';
                    var SWPRegistrationId = '';
                    var responseCode = '';
                    var MFAPIResponse = result["s:Envelope"]["s:Body"][0]["MFAPIResponse"][0]["MFAPIResult"][0];

                    var MFAPIResult = MFAPIResponse.toString().split('|');
                    responseCode = MFAPIResult[0].toString();

                    if (MFAPIResult[0].toString() == "100") {
                        status = true;
                        MFAPIResultMessage = MFAPIResult[1];
                        SWPRegistrationId = MFAPIResult[2];
                    }
                    else {
                        MFAPIResultMessage = MFAPIResult[1];
                    }

                    resolve({ Status: status, TransactionNumber: transNo, SWPRegistrationId: SWPRegistrationId, ResponseData: MFAPIResultMessage, ResponseCode: responseCode });
                    // console.log(encryptedPassword);
                });
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.CancelSWPTransaction = async (data) => {
    try {
        var bseConfig = await BSEService.GetBSEConfig();
        var encryptedPassword = await BSEService.GetPassword();

        var param = await BSEService.PrepareSWPMFDCancelParam(data);

        return new Promise(async (resolve, reject) => {
            let inputData = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://www.bsestarmf.in/2016/01/">
            <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
                <wsa:Action>http://www.bsestarmf.in/2016/01/IStarMFWebService/MFAPI</wsa:Action>
                <wsa:To>https://${process.env.BSE_API_LINK}/StarMFWebService/StarMFWebService.svc/Secure</wsa:To></soap:Header>
            <soap:Body>
               <ns:MFAPI>
                  <ns:Flag>10</ns:Flag>
                  <ns:UserId>${bseConfig.UserId}</ns:UserId>
                  <ns:EncryptedPassword>${encryptedPassword}</ns:EncryptedPassword>
                  <ns:param>${param}</ns:param>
               </ns:MFAPI>
            </soap:Body>
         </soap:Envelope>`;

            // console.log(inputData);

            var headers = {
                'Content-Type': 'application/soap+xml;charset=UTF-8',
                'Accept-Encoding': 'gzip,deflate',
                'action': "http://www.bsestarmf.in/2016/01/IStarMFWebService/MFAPI"
            };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/StarMFWebService/StarMFWebService.svc/Secure',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, inputData);

                const resultData = responseData.toString();

                const xmlData = new DOMParser().parseFromString(resultData, 'text/xml');

                // console.log(xmlData);

                var parser = new xml2json.Parser();
                parser.parseString(xmlData, async (err, result) => {
                    // console.log(JSON.stringify(result));
                    // console.log(err);
                    var status = false;
                    var MFAPIResultMessage = '';
                    var SWPRegistrationId = '';
                    var responseCode = '';
                    var MFAPIResponse = result["s:Envelope"]["s:Body"][0]["MFAPIResponse"][0]["MFAPIResult"][0];

                    var MFAPIResult = MFAPIResponse.toString().split('|');
                    responseCode = MFAPIResult[0].toString();

                    if (MFAPIResult[0].toString() == "100") {
                        status = true;
                        MFAPIResultMessage = MFAPIResult[1];
                        SWPRegistrationId = MFAPIResult[2];
                    }
                    else {
                        MFAPIResultMessage = MFAPIResult[1];

                        if (MFAPIResultMessage.toLowerCase().includes('already cancelled')) {
                            status = true;
                        }
                    }

                    resolve({ Status: status, SWPRegistrationId: SWPRegistrationId, ResponseData: MFAPIResultMessage, ResponseCode: responseCode });
                    // console.log(encryptedPassword);
                });
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.CancelXSIPTransaction = async (data) => {
    try {
        var bseConfig = await BSEService.GetBSEConfig();

        return new Promise(async (resolve, reject) => {
            let inputData = {
                "LoginId": bseConfig.UserId,
                "MemberCode": bseConfig.MemberId,
                "Password": bseConfig.Password,
                "ClientCode": data.UCC,
                "RegnNo": data.SIPRegistrationId,
                "IntRefNo": 'CSIP' + data.Id,
                "CeaseBseCode": data.BSESIPCeaseCode,
                "Remarks": data.SIPCeaseRemark
            };

            // console.log(inputData);

            var headers = { 'Accept': 'application/json', 'Content-type': 'application/json', 'APIKEY': 'VmxST1UyRkhUbkpOVldNOQ==' };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/StarMFAPI/api/XSIP/XSIPCancellation',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, JSON.stringify(inputData));

                var result = JSON.parse(responseData);

                if (result.SuccessFlag == 0) {
                    resolve({ Status: true, Remarks: result.BSERemarks, SIPRegId: result.SIPRegId, IntRefNo: result.IntRefNo });
                }
                else {
                    if (result.BSERemarks.toLowerCase().includes('already cancelled')) {
                        resolve({ Status: true, Remarks: result.BSERemarks, SIPRegId: result.SIPRegId, IntRefNo: result.IntRefNo });
                    }
                    else {
                        resolve({ Status: false, Remarks: result.BSERemarks, SIPRegId: result.SIPRegId, IntRefNo: result.IntRefNo });
                    }
                }
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.GetChildOrderDetails = async (data) => {
    try {
        var encryptedPassword = await BSEService.GetPasswordForChildOrder();
        var bseConfig = await BSEService.GetBSEConfig();

        return new Promise(async (resolve, reject) => {
            let inputData = {
                "ClientCode": data.UCC,
                "Date": data.OrderDate,
                "EncryptedPassword": encryptedPassword,
                "MemberCode": bseConfig.MemberId,
                "RegnNo": data.SIPRegistrationId,
                "SystematicPlanType": 'XSIP'
            };

            // console.log(inputData);

            var headers = { 'Accept': 'application/json', 'Content-type': 'application/json', 'APIKEY': 'VmxST1UyRkhUbkpOVldNOQ==' };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/StarMFWebService/StarMFWebService.svc/ChildOrderDetails',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, JSON.stringify(inputData));

                var result = JSON.parse(responseData);

                if (result.Status == 100) {
                    var childOrderDetails = result.ChildOrderDetails[0];

                    if (childOrderDetails != null) {
                        var orderData = {
                            RecordDate: data.RecordDate,
                            ClientAccountId: data.ClientAccountId,
                            BSESchemeId: data.BSESchemeId,
                            ISIN: data.ISIN,
                            SIPRegistrationId: data.SIPRegistrationId,
                            BSEOrderId: childOrderDetails.OrderNumber,
                            FolioNumber: childOrderDetails.FolioNo,
                            FundAmount: childOrderDetails.Amount,
                            BSEResponse: result.Message
                        };

                        await BSEService.UpdateClientTransactionSIPOrder(orderData);
                    }
                    resolve({ Status: true, Message: result.Message, ChildOrderDetails: result.ChildOrderDetails[0], SIPRegistrationId: data.SIPRegistrationId });
                }
                else {
                    resolve({ Status: false, Message: result.Message, ChildOrderDetails: null, SIPRegistrationId: data.SIPRegistrationId });
                }
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.InitiateOTMPayment = async (data) => {
    // console.log(data);
    try {
        var bseConfig = await BSEService.GetBSEConfig();

        return new Promise(async (resolve, reject) => {
            let inputData = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://www.bsestarmf.in/OTM/2018/08/31" xmlns:star="http://schemas.datacontract.org/2004/07/StarMFOTMPaymentService">
            <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
                <wsa:Action>http://www.bsestarmf.in/OTM/2018/08/31/IStarMFOTMPayment/OTMPaymentInitiate</wsa:Action>
                <wsa:To>https://${process.env.BSE_API_LINK}/StarMFOTMPaymentService/StarMFOTMPayment.svc/Secure</wsa:To>
            </soap:Header>
            <soap:Body>
                <ns:OTMPaymentInitiate>
                    <ns:Param>
                        <star:MandateId>${data.BSEMandateId}</star:MandateId>
                        <star:MemberCode>${bseConfig.MemberId}</star:MemberCode>
                        <star:OrderDetails>`;
            for (let i = 0; i < data.Orders.length; i++) {
                inputData += `<star:OrdersRequest>
                                <star:OrderNo>${data.Orders[i].BSEOrderId}</star:OrderNo>
                                <star:Segment>BSEMF</star:Segment>
                            </star:OrdersRequest>`;
            }
            inputData += `</star:OrderDetails>
            <star:Password>${bseConfig.Password}</star:Password>
                        <star:UserId>${bseConfig.UserId}</star:UserId>
                    </ns:Param>
                </ns:OTMPaymentInitiate>
            </soap:Body>
        </soap:Envelope>`;

            // console.log(inputData);

            var headers = {
                'Content-Type': 'application/soap+xml;charset=UTF-8',
                'Accept-Encoding': 'gzip,deflate',
                'action': "http://www.bsestarmf.in/OTM/2018/08/31/IStarMFOTMPayment/OTMPaymentInitiate"
            };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/StarMFOTMPaymentService/StarMFOTMPayment.svc/Secure',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, inputData);

                const resultData = responseData.toString();

                const xmlData = new DOMParser().parseFromString(resultData, 'text/xml');

                // console.log(xmlData);

                var parser = new xml2json.Parser();
                parser.parseString(xmlData, (err, result) => {
                    // console.log(JSON.stringify(result));
                    // console.log(err);
                    var status = false;
                    var BSERemarks = '';
                    var MandateId = '';
                    var OrderDetails = '';
                    var responseCode = '';

                    var OTMPaymentInitiateResult = result["s:Envelope"]["s:Body"][0]["OTMPaymentInitiateResponse"][0]["OTMPaymentInitiateResult"][0];

                    BSERemarks = OTMPaymentInitiateResult["b:BSERemarks"][0];
                    MandateId = OTMPaymentInitiateResult["b:MandateId"][0];
                    OrderDetails = OTMPaymentInitiateResult["b:OrderDetails"][0];
                    responseCode = OTMPaymentInitiateResult["b:Status"][0];

                    if (responseCode.toString() == "100") {
                        status = true;
                    }
                    else {
                        status = false;
                    }

                    resolve({ Status: status, BSERemarks: BSERemarks, MandateId: MandateId, OrderDetails: OrderDetails, ResponseCode: responseCode });
                });
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.InitiateSinglePayment = async (data) => {
    try {
        // console.log(data);

        var bseConfig = await BSEService.GetBSEConfig();
        var utn = await BSEService.GetTempBSEURN();
        var currentDate = new Date();
        var BSEURN = bseConfig.UserId + '' + currentDate.getFullYear() + '' + commonFunction.padLeft((currentDate.getMonth() + 1).toString(), '0', 2) + '' + commonFunction.padLeft(currentDate.getDate().toString(), '0', 2) + '' + utn;


        return new Promise(async (resolve, reject) => {
            let inputData = {
                'LoginId': bseConfig.UserId,
                'Password': bseConfig.Password,
                'MemberCode': bseConfig.MemberId,
                'clientcode': data.UCC,
                'modeofpayment': data.PaymentMode,
                'bankid': data.BankBSECode,
                'accountnumber': data.AccountNumber,
                'ifsc': data.IFSC,
                'ordernumber': data.Orders,
                'totalamount': data.TotalAmount,
                'internalrefno': BSEURN,
                'NEFTreference': data.NEFTReferance,
                'mandateid': '',
                'vpaid': data.UPIId,
                'loopbackURL': process.env.WEB_APP_LINK + '/' + data.ReturnUrlParam,
                'allowloopBack': '',
                'filler1': '',
                'filler2': '',
                'filler3': '',
                'filler4': '',
                'filler5': ''
            };

            // console.log(inputData);

            var headers = { 'Accept': 'application/json', 'Content-type': 'application/json' };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/StarMFSinglePaymentAPI/Single/Payment',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, JSON.stringify(inputData));

                const resultData = responseData.toString();

                // console.log(resultData);

                var result = JSON.parse(resultData);

                if (result.statuscode == 100) {
                    resolve({ Status: true, BSERemarks: result.responsestring, BSEURN: BSEURN, ResponseCode: result.statuscode });
                }
                else {
                    resolve({ Status: false, BSERemarks: result.responsestring, BSEURN: BSEURN, ResponseCode: result.statuscode });
                }
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.InitiateChequeCollectionOrder = async (data) => {
    try {
        var bseConfig = await BSEService.GetBSEConfig();
        var utn = await BSEService.GetTempBSEURN();
        var currentDate = new Date();
        var BSEURN = bseConfig.UserId + '' + currentDate.getFullYear() + '' + commonFunction.padLeft((currentDate.getMonth() + 1).toString(), '0', 2) + '' + commonFunction.padLeft(currentDate.getDate().toString(), '0', 2) + '' + utn;

        return new Promise(async (resolve, reject) => {
            let inputData = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/" xmlns:star="http://schemas.datacontract.org/2004/07/StarMFChequeCollectionServcie" xmlns:arr="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
            <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
                <wsa:Action>http://tempuri.org/IService/ChequeCollectionOrderInitiate</wsa:Action>
                <wsa:To>https://${process.env.BSE_API_LINK}/StarMFChequeCollection/Service.svc/Secure</wsa:To>
            </soap:Header>
            <soap:Body>
                <tem:ChequeCollectionOrderInitiate>
                    <tem:ChequeInitiate>
                        <star:AccNo>${data.AccountNumber}</star:AccNo>
                        <star:ChequeAmount>${data.ChequeAmount}</star:ChequeAmount>
                        <star:ChequeDate>${data.ChequeDate}</star:ChequeDate>
                        <star:ChequeNo>${data.ChequeNumber}</star:ChequeNo>
                        <star:ClientCode>${data.UCC}</star:ClientCode>
                        <star:DepositBank>hdfc bank</star:DepositBank>
                        <star:Filler1>${data.PickupPoint}</star:Filler1>
                        <star:Filler2>${data.City}</star:Filler2>
                        <star:Filler3>${(data.IsCooperative == true) ? 'Y' : 'N'}</star:Filler3>
                        <star:IFSCCode>${data.IFSC}</star:IFSCCode>
                        <star:MemberId>${bseConfig.MemberId}</star:MemberId>
                        <star:OrderNo>`;
            for (let i = 0; i < data.Orders.length; i++) {
                inputData += `<arr:string>${data.Orders[i].BSEOrderId}</arr:string>`;
            }
            inputData += `</star:OrderNo>
                        <star:Password>${bseConfig.Password}</star:Password>
                        <star:TotalAmount>${data.TotalAmount}</star:TotalAmount>
                        <star:UniqueId>${BSEURN}</star:UniqueId>
                        <star:UserId>${bseConfig.UserId}</star:UserId>
                    </tem:ChequeInitiate>
                </tem:ChequeCollectionOrderInitiate>
            </soap:Body>
        </soap:Envelope>`;

            var headers = {
                'Content-Type': 'application/soap+xml;charset=UTF-8',
                'Accept-Encoding': 'gzip,deflate',
                'action': "http://tempuri.org/IService/ChequeCollectionOrderInitiate"
            };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/StarMFChequeCollection/Service.svc/Secure',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, inputData);

                const resultData = responseData.toString();

                const xmlData = new DOMParser().parseFromString(resultData, 'text/xml');

                // console.log(xmlData);

                var parser = new xml2json.Parser();
                parser.parseString(xmlData, (err, result) => {
                    // console.log(JSON.stringify(result));
                    // console.log(err);
                    var status = false;
                    var BSERemarks = '';
                    var GroupId = '';
                    var responseCode = '';

                    var ChequeCollectionOrderInitiateResult = result["s:Envelope"]["s:Body"][0]["ChequeCollectionOrderInitiateResponse"][0]["ChequeCollectionOrderInitiateResult"][0];

                    BSERemarks = ChequeCollectionOrderInitiateResult["b:BseRemarks"][0];
                    GroupId = ChequeCollectionOrderInitiateResult["b:GroupId"][0];
                    responseCode = ChequeCollectionOrderInitiateResult["b:Status"][0];

                    if (responseCode.toString() == "0") {
                        status = true;
                    }
                    else {
                        status = false;
                    }

                    resolve({ Status: status, BSERemarks: BSERemarks, GroupId: GroupId, ResponseCode: responseCode, BSEURN: BSEURN });
                });
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.InitiateChequeCollectionGroupId = async (data) => {
    try {
        var bseConfig = await BSEService.GetBSEConfig();

        return new Promise(async (resolve, reject) => {
            let inputData = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/" xmlns:star="http://schemas.datacontract.org/2004/07/StarMFChequeCollectionServcie" xmlns:arr="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
            <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
                <wsa:Action>http://tempuri.org/IService/ChequeCollectionGroupIdInitiate</wsa:Action>
                <wsa:To>https://${process.env.BSE_API_LINK}/StarMFChequeCollection/Service.svc/Secure</wsa:To>
            </soap:Header>
            <soap:Body>
                <tem:ChequeCollectionGroupIdInitiate>
                    <tem:GroupInitiate>
                        <star:GroupId>
                            <arr:string>${data.GroupId}</arr:string>
                        </star:GroupId>
                        <star:MemberId>${bseConfig.MemberId}</star:MemberId>
                        <star:Password>${bseConfig.Password}</star:Password>
                        <star:UniqueId>${data.UniqueId}</star:UniqueId>
                        <star:UserId>${bseConfig.UserId}</star:UserId>
                    </tem:GroupInitiate>
                </tem:ChequeCollectionGroupIdInitiate>
            </soap:Body>
        </soap:Envelope>`;

            var headers = {
                'Content-Type': 'application/soap+xml;charset=UTF-8',
                'Accept-Encoding': 'gzip,deflate',
                'action': "http://tempuri.org/IService/ChequeCollectionGroupIdInitiate"
            };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/StarMFChequeCollection/Service.svc/Secure',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, inputData);

                const resultData = responseData.toString();

                const xmlData = new DOMParser().parseFromString(resultData, 'text/xml');

                // console.log(xmlData);

                var parser = new xml2json.Parser();
                parser.parseString(xmlData, (err, result) => {
                    // console.log(JSON.stringify(result));
                    // console.log(err);
                    var status = false;
                    var BSERemarks = '';
                    var DepositChallanNo = '';
                    var responseCode = '';

                    var ChequeCollectionGroupIdInitiateResult = result["s:Envelope"]["s:Body"][0]["ChequeCollectionGroupIdInitiateResponse"][0]["ChequeCollectionGroupIdInitiateResult"][0];

                    BSERemarks = ChequeCollectionGroupIdInitiateResult["b:BseRemarks"][0];
                    DepositChallanNo = ChequeCollectionGroupIdInitiateResult["b:DepositChallanNo"][0]["c:string"][0];
                    responseCode = ChequeCollectionGroupIdInitiateResult["b:Status"][0];

                    if (responseCode.toString() == "0") {
                        status = true;
                    }
                    else {
                        status = false;
                    }

                    resolve({ Status: status, BSERemarks: BSERemarks, DepositChallanNo: DepositChallanNo, ResponseCode: responseCode });
                });
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.InitiateChequeCollectionDepositChallan = async (data) => {
    try {
        var bseConfig = await BSEService.GetBSEConfig();

        return new Promise(async (resolve, reject) => {
            let inputData = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/" xmlns:star="http://schemas.datacontract.org/2004/07/StarMFChequeCollectionServcie">
            <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
                <wsa:Action>http://tempuri.org/IService/ChequeCollectionDepositChallan</wsa:Action>
                <wsa:To>https://${process.env.BSE_API_LINK}/StarMFChequeCollection/Service.svc/Secure</wsa:To>
            </soap:Header>
            <soap:Body>
                <tem:ChequeCollectionDepositChallan>
                    <tem:DepositChallan>
                        <star:DepositChallanNo>${data.DepositChallanNo}</star:DepositChallanNo>
                        <star:MemberId>${bseConfig.MemberId}</star:MemberId>
                        <star:Password>${bseConfig.Password}</star:Password>
                        <star:UniqueId>${data.UniqueId}</star:UniqueId>
                        <star:UserId>${bseConfig.UserId}</star:UserId>
                    </tem:DepositChallan>
                </tem:ChequeCollectionDepositChallan>
            </soap:Body>
        </soap:Envelope>`;

            var headers = {
                'Content-Type': 'application/soap+xml;charset=UTF-8',
                'Accept-Encoding': 'gzip,deflate',
                'action': "http://tempuri.org/IService/ChequeCollectionDepositChallan"
            };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/StarMFChequeCollection/Service.svc/Secure',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, inputData);

                const resultData = responseData.toString();

                const xmlData = new DOMParser().parseFromString(resultData, 'text/xml');

                // console.log(xmlData);

                var parser = new xml2json.Parser();
                parser.parseString(xmlData, (err, result) => {
                    // console.log(JSON.stringify(result));
                    // console.log(err);
                    var status = false;
                    var BSERemarks = '';
                    var PDFFileContent = '';
                    var responseCode = '';

                    var ChequeCollectionDepositChallanResult = result["s:Envelope"]["s:Body"][0]["ChequeCollectionDepositChallanResponse"][0]["ChequeCollectionDepositChallanResult"][0];

                    BSERemarks = ChequeCollectionDepositChallanResult["b:BseRemarks"][0];
                    PDFFileContent = ChequeCollectionDepositChallanResult["b:PDF"][0];
                    responseCode = ChequeCollectionDepositChallanResult["b:Status"][0];

                    if (responseCode.toString() == "0") {
                        status = true;
                    }
                    else {
                        status = false;
                    }

                    resolve({ Status: status, BSERemarks: BSERemarks, PDFFileContent: PDFFileContent, ResponseCode: responseCode });
                });
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.GetOrderStatus = async (data) => {
    try {
        var bseConfig = await BSEService.GetBSEConfig();

        return new Promise(async (resolve, reject) => {
            let inputData = {
                "ClientCode": data.UCC,
                "Filler1": "",
                "Filler2": "",
                "Filler3": "",
                "FromDate": data.FromDate,
                "MemberCode": bseConfig.MemberId,
                "OrderNo": data.BSEOrderId,
                "OrderStatus": "All",
                "OrderType": "All",
                "Password": bseConfig.Password,
                "SettType": "ALL",
                "SubOrderType": "all",
                "ToDate": data.ToDate,
                "TransType": data.TransactionType,
                "UserId": bseConfig.UserId
            };

            // console.log(inputData);

            var headers = { 'Accept': 'application/json', 'Content-type': 'application/json', 'APIKEY': 'VmxST1UyRkhUbkpOVldNOQ==' };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/StarMFWebService/StarMFWebService.svc/OrderStatus',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, JSON.stringify(inputData));

                var result = JSON.parse(responseData);

                if (result.Status == 100) {
                    var orderDetails = result.OrderDetails[0];

                    if (orderDetails != null) {
                        var orderData = {
                            BSEOrderId: orderDetails.OrderNumber,
                            ALLUnits: orderDetails.ALLUnits,
                            Amount: orderDetails.Amount,
                            BuySell: orderDetails.BuySell,
                            BuySellType: orderDetails.BuySellType,
                            ClientCode: orderDetails.ClientCode,
                            ClientName: orderDetails.ClientName,
                            DPC: orderDetails.DPC,
                            DPFolioNo: orderDetails.DPFolioNo,
                            DPTrans: orderDetails.DPTrans,
                            Date: orderDetails.Date,
                            EUIN: orderDetails.EUIN,
                            EUINDecl: orderDetails.EUINDecl,
                            EntryBy: orderDetails.EntryBy,
                            FirstOrder: orderDetails.FirstOrder,
                            FolioNo: orderDetails.FolioNo,
                            ISIN: orderDetails.ISIN,
                            InternalRefNo: orderDetails.InternalRefNo,
                            KYCFlag: orderDetails.KYCFlag,
                            MINRedeemFlag: orderDetails.MINRedeemFlag,
                            MemberCode: orderDetails.MemberCode,
                            MemberRemarks: orderDetails.MemberRemarks,
                            OrderRemarks: orderDetails.OrderRemarks,
                            OrderStatus: orderDetails.OrderStatus,
                            OrderType: orderDetails.OrderType,
                            SIPRegnDate: orderDetails.SIPRegnDate,
                            SIPRegnNo: orderDetails.SIPRegnNo,
                            SchemeCode: orderDetails.SchemeCode,
                            SchemeName: orderDetails.SchemeName,
                            SettNo: orderDetails.SettNo,
                            SettType: orderDetails.SettType,
                            SubBrCode: orderDetails.SubBrCode,
                            SubBrokerARNCode: orderDetails.SubBrokerARNCode,
                            SubOrderType: orderDetails.SubOrderType,
                            Time: orderDetails.Time,
                            Units: orderDetails.Units
                        };

                        await BSEService.UpdateClientTransactionBSEOrderStatus(orderData);
                    }
                    resolve({ Status: true, Message: result.Message, ChildOrderDetails: result.OrderDetails[0], BSEOrderId: data.BSEOrderId });
                }
                else {
                    resolve({ Status: false, Message: result.Message, ChildOrderDetails: null, BSEOrderId: data.BSEOrderId });
                }
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.PushSellTransaction = async (data) => {
    try {
        var bseConfig = await BSEService.GetBSEConfig();
        var encryptedPassword = await BSEService.GetPasswordOrderEntry();
        var utn = await BSEService.GetTempBSEURN();
        // console.log('SchemeName:'+data.SchemeName);
        // console.log('ISIN:'+data.ISIN);
        // console.log('Amount:'+data.Amount);
        var schemeDetails;
        var currentDate = new Date();
        var transNo = bseConfig.UserId + '' + currentDate.getFullYear() + '' + commonFunction.padLeft((currentDate.getMonth() + 1).toString(), '0', 2) + '' + commonFunction.padLeft(currentDate.getDate().toString(), '0', 2) + '' + utn;

        schemeDetails = await BSEService.GetBSESchemeRedemptionByISIN(data.SchemeName, data.ISIN);

        return new Promise(async (resolve, reject) => {
            let inputData = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:bses="http://bsestarmf.in/">
            <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
                <wsa:Action>http://bsestarmf.in/MFOrderEntry/orderEntryParam</wsa:Action>
                <wsa:To>https://${process.env.BSE_API_LINK}/MFOrderEntry/MFOrder.svc/Secure</wsa:To>
            </soap:Header>
            <soap:Body>
                <bses:orderEntryParam>
                    <bses:TransCode>NEW</bses:TransCode>
                    <bses:TransNo>${transNo}</bses:TransNo>
                    <bses:OrderId>0</bses:OrderId>
                    <bses:UserID>${bseConfig.UserId}</bses:UserID>
                    <bses:MemberId>${bseConfig.MemberId}</bses:MemberId>
                    <bses:ClientCode>${data.UCC}</bses:ClientCode>
                    <bses:SchemeCd>${schemeDetails.SchemeCode}</bses:SchemeCd>
                    <bses:BuySell>R</bses:BuySell>
                    <bses:BuySellType>${(data.FolioNumber == '' || data.FolioNumber == 'New Folio') ? 'FRESH' : 'ADDITIONAL'}</bses:BuySellType>
                    <bses:DPTxn>${(schemeDetails.RedemptionTransactionMode == 'DP') ? 'P' : schemeDetails.RedemptionTransactionMode}</bses:DPTxn>
                    <bses:OrderVal>${(data.SellAll == false) ? data.Amount : 0}</bses:OrderVal>
                    <bses:Qty>0</bses:Qty>
                    <bses:AllRedeem>${(data.SellAll == true) ? 'Y' : 'N'}</bses:AllRedeem>
                    <bses:FolioNo>${(data.FolioNumber == '' || data.FolioNumber == 'New Folio') ? '' : data.FolioNumber}</bses:FolioNo>
                    <bses:Remarks/>
                    <bses:KYCStatus>Y</bses:KYCStatus>
                    <bses:RefNo>P${data.Id}</bses:RefNo>
                    <bses:SubBrCode>${(data.AssociateCode == '01') ? '' : bseConfig.MemberId.toString() + data.AssociateCode}</bses:SubBrCode>
                    <bses:EUIN>E${data.EUIN}</bses:EUIN>
                    <bses:EUINVal>Y</bses:EUINVal>
                    <bses:MinRedeem>N</bses:MinRedeem>
                    <bses:DPC>${(data.SchemeName.toLowerCase().includes('insured')) ? 'Y' : 'N'}</bses:DPC>
                    <bses:IPAdd>120.0.0.1</bses:IPAdd>
                    <bses:Password>${encryptedPassword}</bses:Password>
                    <bses:PassKey>${bseConfig.PassKey}</bses:PassKey>
                    <bses:Parma1>${(data.AssociateCode == '01') ? '' : ((data.ARN == '') ? '' : 'ARN-' + data.ARN)}</bses:Parma1>
                    <bses:Param2/>
                    <bses:Param3/>
                    <bses:MobileNo>${data.MobileNumber}</bses:MobileNo>
                    <bses:EmailID>${data.Email}</bses:EmailID>
                    <bses:MandateID/>
                    <bses:Filler1/>
                    <bses:Filler2/>
                    <bses:Filler3/>
                    <bses:Filler4/>
                    <bses:Filler5/>
                    <bses:Filler6/>
                </bses:orderEntryParam>
            </soap:Body>
        </soap:Envelope>`;

            // console.log(inputData);

            var headers = {
                'Content-Type': 'application/soap+xml;charset=UTF-8',
                'Accept-Encoding': 'gzip,deflate',
                'action': "http://bsestarmf.in/MFOrderEntry/orderEntryParam"
            };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/MFOrderEntry/MFOrder.svc/Secure',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, inputData);

                const resultData = responseData.toString();

                const xmlData = new DOMParser().parseFromString(resultData, 'text/xml');

                // console.log(xmlData);

                var parser = new xml2json.Parser();
                parser.parseString(xmlData, (err, result) => {
                    // console.log(JSON.stringify(result));
                    // console.log(err);
                    var transactionCode = '';
                    var transactionNumber = '';
                    var orderId = '';
                    var loginUserId = '';
                    var loginMemberId = '';
                    var ucc = '';
                    var responseData = '';
                    var responseCode = '';
                    var status = false;

                    var orderEntryParamResult = result["s:Envelope"]["s:Body"][0]["orderEntryParamResponse"][0]["orderEntryParamResult"][0];

                    var orderEntryResult = orderEntryParamResult.toString().split('|');

                    transactionCode = orderEntryResult[0];
                    transactionNumber = orderEntryResult[1];
                    orderId = orderEntryResult[2];
                    loginUserId = orderEntryResult[3];
                    loginMemberId = orderEntryResult[4];
                    ucc = orderEntryResult[5];
                    responseData = orderEntryResult[6];
                    responseCode = orderEntryResult[7];

                    if (responseCode.toString() == "0") {
                        status = true;
                    }
                    else {
                        status = false;
                    }

                    // console.log({ Status: status, TransactionCode: transactionCode, TransactionNumber: transactionNumber, OrderId: orderId, LoginUserId: loginUserId, LoginMemberId: loginMemberId, UCC: ucc, ResponseData: responseData, ResponseCode: responseCode });

                    resolve({ Status: status, TransactionCode: transactionCode, TransactionNumber: transactionNumber, OrderId: orderId, LoginUserId: loginUserId, LoginMemberId: loginMemberId, UCC: ucc, ResponseData: responseData, ResponseCode: responseCode });
                });
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.PushSwitchTransaction = async (data) => {
    try {
        var bseConfig = await BSEService.GetBSEConfig();
        var encryptedPassword = await BSEService.GetPasswordOrderEntry();
        var utn = await BSEService.GetTempBSEURN();
        // console.log('SchemeName:'+data.SchemeName);
        // console.log('ISIN:'+data.ISIN);
        // console.log('Amount:'+data.Amount);
        var schemeDetailsSwitchFrom;
        var schemeDetailsSwitchTo;
        var currentDate = new Date();
        var transNo = bseConfig.UserId + '' + currentDate.getFullYear() + '' + commonFunction.padLeft((currentDate.getMonth() + 1).toString(), '0', 2) + '' + commonFunction.padLeft(currentDate.getDate().toString(), '0', 2) + '' + utn;

        schemeDetailsSwitchFrom = await BSEService.GetBSESchemeByProductCode(data.ProductCodeSwitchFrom);
        schemeDetailsSwitchTo = await BSEService.GetBSESchemeByProductCode(data.ProductCodeSwitchTo);

        return new Promise(async (resolve, reject) => {
            let inputData = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:bses="http://bsestarmf.in/">
                <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
                    <wsa:Action>http://bsestarmf.in/MFOrderEntry/switchOrderEntryParam</wsa:Action>
                    <wsa:To>https://${process.env.BSE_API_LINK}/MFOrderEntry/MFOrder.svc/Secure</wsa:To>
                </soap:Header>
                <soap:Body>
                    <bses:switchOrderEntryParam>
                        <bses:TransCode>NEW</bses:TransCode>
                        <bses:TransNo>${transNo}</bses:TransNo>
                        <bses:OrderId>0</bses:OrderId>
                        <bses:UserId>${bseConfig.UserId}</bses:UserId>
                        <bses:MemberId>${bseConfig.MemberId}</bses:MemberId>
                        <bses:ClientCode>${data.UCC}</bses:ClientCode>
                        <bses:FromSchemeCd>${schemeDetailsSwitchFrom.SchemeCode}</bses:FromSchemeCd>
                        <bses:ToSchemeCd>${schemeDetailsSwitchTo.SchemeCode}</bses:ToSchemeCd>
                        <bses:BuySell>SO</bses:BuySell>
                        <bses:BuySellType>${(data.FolioNumber == '' || data.FolioNumber == 'New Folio') ? 'FRESH' : 'ADDITIONAL'}</bses:BuySellType>
                        <bses:DPTxn>${(schemeDetailsSwitchFrom.RedemptionTransactionMode == 'DP') ? 'P' : schemeDetailsSwitchFrom.RedemptionTransactionMode}</bses:DPTxn>
                        <bses:OrderVal>${data.Amount}</bses:OrderVal>
                        <bses:SwitchUnits>${data.Units}</bses:SwitchUnits>
                        <bses:AllUnitsFlag>N</bses:AllUnitsFlag>
                        <bses:FolioNo>${(data.FolioNumber == '' || data.FolioNumber == 'New Folio') ? '' : data.FolioNumber}</bses:FolioNo>
                        <bses:Remarks></bses:Remarks>
                        <bses:KYCStatus>Y</bses:KYCStatus>
                        <bses:SubBrCode>${(data.AssociateCode == '01') ? '' : bseConfig.MemberId.toString() + data.AssociateCode}</bses:SubBrCode>
                        <bses:EUIN>E${data.EUIN}</bses:EUIN>
                        <bses:EUINVal>Y</bses:EUINVal>
                        <bses:MinRedeem>N</bses:MinRedeem>
                        <bses:IPAdd>120.0.0.1</bses:IPAdd>
                        <bses:Password>${encryptedPassword}</bses:Password>
                        <bses:PassKey>${bseConfig.PassKey}</bses:PassKey>
                        <bses:Parma1>${(data.AssociateCode == '01') ? '' : ((data.ARN == '') ? '' : 'ARN-' + data.ARN)}</bses:Parma1>
                        <bses:Param2></bses:Param2>
                        <bses:Param3></bses:Param3>
                        <bses:Filler1/>
                        <bses:Filler2/>
                        <bses:Filler3/>
                        <bses:Filler4/>
                        <bses:Filler5/>
                        <bses:Filler6/>
                    </bses:switchOrderEntryParam>
                </soap:Body>
            </soap:Envelope>`;

            // console.log(inputData);

            var headers = {
                'Content-Type': 'application/soap+xml;charset=UTF-8',
                'Accept-Encoding': 'gzip,deflate',
                'action': "http://bsestarmf.in/MFOrderEntry/switchOrderEntryParam"
            };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/MFOrderEntry/MFOrder.svc/Secure',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, inputData);

                const resultData = responseData.toString();

                const xmlData = new DOMParser().parseFromString(resultData, 'text/xml');

                // console.log(xmlData);

                var parser = new xml2json.Parser();
                parser.parseString(xmlData, (err, result) => {
                    // console.log(JSON.stringify(result));
                    // console.log(err);
                    var transactionCode = '';
                    var transactionNumber = '';
                    var orderId = '';
                    var loginUserId = '';
                    var loginMemberId = '';
                    var ucc = '';
                    var responseData = '';
                    var responseCode = '';
                    var status = false;

                    var orderEntryParamResult = result["s:Envelope"]["s:Body"][0]["switchOrderEntryParamResponse"][0]["switchOrderEntryParamResult"][0];

                    var orderEntryResult = orderEntryParamResult.toString().split('|');

                    transactionCode = orderEntryResult[0];
                    transactionNumber = orderEntryResult[1];
                    orderId = orderEntryResult[2];
                    loginUserId = orderEntryResult[3];
                    loginMemberId = orderEntryResult[4];
                    ucc = orderEntryResult[5];
                    responseData = orderEntryResult[6];
                    responseCode = orderEntryResult[7];

                    if (responseCode.toString() == "0") {
                        status = true;
                    }
                    else {
                        status = false;
                    }

                    // console.log({ Status: status, TransactionCode: transactionCode, TransactionNumber: transactionNumber, OrderId: orderId, LoginUserId: loginUserId, LoginMemberId: loginMemberId, UCC: ucc, ResponseData: responseData, ResponseCode: responseCode });

                    resolve({ Status: status, TransactionCode: transactionCode, TransactionNumber: transactionNumber, OrderId: orderId, LoginUserId: loginUserId, LoginMemberId: loginMemberId, UCC: ucc, ResponseData: responseData, ResponseCode: responseCode });
                });
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.PushSTPTransaction = async (data) => {
    try {
        var bseConfig = await BSEService.GetBSEConfig();
        var utn = await BSEService.GetTempBSEURN();
        var schemeDetailsSwitchFrom;
        var schemeDetailsSwitchTo;
        var currentDate = new Date();
        var folioNumberSplit = data.FolioNumber.split('/');
        var dataFolioNumber = (folioNumberSplit.length > 0) ? folioNumberSplit[0] : '';
        var transNo = bseConfig.UserId + '' + currentDate.getFullYear() + '' + commonFunction.padLeft((currentDate.getMonth() + 1).toString(), '0', 2) + '' + commonFunction.padLeft(currentDate.getDate().toString(), '0', 2) + '' + utn;

        schemeDetailsSwitchFrom = await BSEService.GetBSESchemeByProductCode(data.ProductCodeSwitchFrom);
        schemeDetailsSwitchTo = await BSEService.GetBSESchemeByProductCode(data.ProductCodeSwitchTo);

        return new Promise(async (resolve, reject) => {
            let inputData = {
                "LoginId": bseConfig.UserId,
                "MemberCode": bseConfig.MemberId,
                "Password": bseConfig.Password,
                "TransType": 'NEW',
                "STPType": 'AMC',
                "ClientCode": data.UCC,
                "FromBSESchemeCode": schemeDetailsSwitchFrom.SchemeCode,
                "ToBSESchemeCode": schemeDetailsSwitchTo.SchemeCode,
                "BuySellType": 'Fresh',
                "TransactionMode": (schemeDetailsSwitchFrom.RedemptionTransactionMode == 'DP') ? 'P' : schemeDetailsSwitchFrom.RedemptionTransactionMode,
                "FolioNo": (dataFolioNumber == '' || dataFolioNumber == 'New Folio') ? '' : dataFolioNumber,
                "STPRegNo": '',
                "IntRefNo": 'NSTP' + data.Id,
                "StartDate": data.StartDate,
                "FrequencyType": data.Frequency,
                "NoOfTransfers": (data.Frequency == 'DAILY') ? 0 : data.Installments,
                "InstAmount": data.Amount,
                "InstUnit": data.Units,
                "FirstOrderToday": (data.IsStartToday == true) ? 'Y' : 'N',
                "SubBrokerCode": (data.AssociateCode == '01') ? '' : bseConfig.MemberId.toString() + data.AssociateCode,
                "EUINDeclaration": 'Y',
                "EUINNumber": 'E' + data.EUIN,
                "Remarks": '',
                "EndDate": (data.Frequency == 'DAILY') ? data.EndDate : '',
                "SubBrokerARN": (data.AssociateCode == '01') ? '' : ((data.ARN == '') ? '' : 'ARN-' + data.ARN),
                "Filler1": '',
                "Filler2": '',
                "Filler3": '',
                "Filler4": '',
                "Filler5": ''
            };

            // console.log(inputData);

            var headers = { 'Accept': 'application/json', 'Content-type': 'application/json', 'APIKEY': 'VmxST1UyRkhUbkpOVldNOQ==' };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/StarMFAPI/api/stp/stpregistration',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, JSON.stringify(inputData));

                var result = JSON.parse(responseData);

                if (result.SuccessFlag == 0) {
                    resolve({ Status: true, Remarks: result.BSERemarks, STPRegNo: result.STPRegNo, IntRefNo: result.IntRefNo, TransactionCode: result.TransactionCode, FromOrderNo: result.FromOrderNo, ToOrderNo: result.ToOrderNo });
                }
                else {
                    resolve({ Status: false, Remarks: result.BSERemarks, STPRegNo: result.STPRegNo, IntRefNo: result.IntRefNo, TransactionCode: result.TransactionCode, FromOrderNo: result.FromOrderNo, ToOrderNo: result.ToOrderNo });
                }
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.CancelSTPTransaction = async (data) => {
    try {
        var bseConfig = await BSEService.GetBSEConfig();
        var utn = await BSEService.GetTempBSEURN();
        var schemeDetailsSwitchFrom;
        var schemeDetailsSwitchTo;
        var currentDate = new Date();
        var folioNumberSplit = data.FolioNumber.split('/');
        var dataFolioNumber = (folioNumberSplit.length > 0) ? folioNumberSplit[0] : '';
        var transNo = bseConfig.UserId + '' + currentDate.getFullYear() + '' + commonFunction.padLeft((currentDate.getMonth() + 1).toString(), '0', 2) + '' + commonFunction.padLeft(currentDate.getDate().toString(), '0', 2) + '' + utn;

        schemeDetailsSwitchFrom = await BSEService.GetBSESchemeByProductCode(data.ProductCodeSwitchFrom);
        schemeDetailsSwitchTo = await BSEService.GetBSESchemeByProductCode(data.ProductCodeSwitchTo);

        return new Promise(async (resolve, reject) => {
            let inputData = {
                "LoginId": bseConfig.UserId,
                "MemberCode": bseConfig.MemberId,
                "Password": bseConfig.Password,
                "TransType": 'CXL',
                "STPType": 'AMC',
                "ClientCode": data.UCC,
                "FromBSESchemeCode": schemeDetailsSwitchFrom.SchemeCode,
                "ToBSESchemeCode": schemeDetailsSwitchTo.SchemeCode,
                "BuySellType": 'Fresh',
                "TransactionMode": (schemeDetailsSwitchFrom.RedemptionTransactionMode == 'DP') ? 'P' : schemeDetailsSwitchFrom.RedemptionTransactionMode,
                "FolioNo": (dataFolioNumber == '' || dataFolioNumber == 'New Folio') ? '' : dataFolioNumber,
                "STPRegNo": data.BSEOrderId,
                "IntRefNo": 'NSTP' + data.Id,
                "StartDate": data.StartDate,
                "FrequencyType": data.Frequency,
                "NoOfTransfers": (data.Frequency == 'DAILY') ? 0 : data.Installments,
                "InstAmount": data.Amount,
                "InstUnit": data.Units,
                "FirstOrderToday": (data.IsStartToday == true) ? 'Y' : 'N',
                "SubBrokerCode": (data.AssociateCode == '01') ? '' : bseConfig.MemberId.toString() + data.AssociateCode,
                "EUINDeclaration": 'Y',
                "EUINNumber": 'E' + data.EUIN,
                "Remarks": '',
                "EndDate": (data.Frequency == 'DAILY') ? data.EndDate : '',
                "SubBrokerARN": (data.AssociateCode == '01') ? '' : ((data.ARN == '') ? '' : 'ARN-' + data.ARN),
                "Filler1": '',
                "Filler2": '',
                "Filler3": '',
                "Filler4": '',
                "Filler5": ''
            };

            // console.log(inputData);

            var headers = { 'Accept': 'application/json', 'Content-type': 'application/json', 'APIKEY': 'VmxST1UyRkhUbkpOVldNOQ==' };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/StarMFAPI/api/stp/stpregistration',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, JSON.stringify(inputData));

                var result = JSON.parse(responseData);

                if (result.SuccessFlag == 0) {
                    resolve({ Status: true, Remarks: result.BSERemarks, STPRegNo: result.STPRegNo, IntRefNo: result.IntRefNo, TransactionCode: result.TransactionCode, FromOrderNo: result.FromOrderNo, ToOrderNo: result.ToOrderNo });
                }
                else {
                    if (result.BSERemarks.toLowerCase().includes('already cancelled')) {
                        resolve({ Status: true, Remarks: result.BSERemarks, STPRegNo: result.STPRegNo, IntRefNo: result.IntRefNo, TransactionCode: result.TransactionCode, FromOrderNo: result.FromOrderNo, ToOrderNo: result.ToOrderNo });
                    }
                    else {
                        resolve({ Status: false, Remarks: result.BSERemarks, STPRegNo: result.STPRegNo, IntRefNo: result.IntRefNo, TransactionCode: result.TransactionCode, FromOrderNo: result.FromOrderNo, ToOrderNo: result.ToOrderNo });
                    }
                }
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.ChangePasswordMFD = async (data) => {
    try {
        var bseConfig = await BSEService.GetBSEConfig();
        var encryptedPassword = await BSEService.GetPassword();
        var param = await BSEService.PrepareChangePasswordMFDParam(data);

        return new Promise(async (resolve, reject) => {
            let inputData = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://www.bsestarmf.in/2016/01/">
            <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
                <wsa:Action>http://www.bsestarmf.in/2016/01/IStarMFWebService/MFAPI</wsa:Action>
                <wsa:To>https://${process.env.BSE_API_LINK}/StarMFWebService/StarMFWebService.svc/Secure</wsa:To></soap:Header>
            <soap:Body>
               <ns:MFAPI>
                  <ns:Flag>04</ns:Flag>
                  <ns:UserId>${bseConfig.UserId}</ns:UserId>
                  <ns:EncryptedPassword>${encryptedPassword}</ns:EncryptedPassword>
                  <ns:param>${param}</ns:param>
               </ns:MFAPI>
            </soap:Body>
         </soap:Envelope>`;

            var headers = {
                'Content-Type': 'application/soap+xml;charset=UTF-8',
                'Accept-Encoding': 'gzip,deflate',
                'action': "http://www.bsestarmf.in/2016/01/IStarMFWebService/MFAPI"
            };

            var options = {
                host: process.env.BSE_API_LINK,
                path: '/StarMFWebService/StarMFWebService.svc/Secure',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, inputData);

                const resultData = responseData.toString();

                const xmlData = new DOMParser().parseFromString(resultData, 'text/xml');

                // console.log(xmlData);

                var parser = new xml2json.Parser();
                parser.parseString(xmlData, async (err, result) => {
                    // console.log(JSON.stringify(result));
                    // console.log(err);
                    var MFAPIResultMessage = '';
                    // var BSEMandateId = '';
                    var MFAPIResponse = result["s:Envelope"]["s:Body"][0]["MFAPIResponse"][0]["MFAPIResult"][0];

                    var MFAPIResult = MFAPIResponse.toString().split('|');
                    if (MFAPIResult[0].toString() == "100") {
                        MFAPIResultMessage = MFAPIResult[1];

                        await BSEService.UpdateBSELoginPassword(data.NewPassword);

                        resolve({ Status: true, Message: MFAPIResult[1].toString() });
                    }
                    else {
                        // console.log(param);
                        resolve({ Status: false, Message: MFAPIResult[1].toString() });
                    }
                    // console.log(encryptedPassword);
                });
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

BSEService.PrepareChangePasswordMFDParam = async (data) => {
    //        0   Old Password
    //        1   New Password
    //        2   Conf Password

    let param = data.OldPassword + "|" +
        data.NewPassword + "|" +
        data.ConfirmPassword;

    return param;
};

//BSE Codes

BSEService.GetBseClientTypeCode = (name) => {
    switch (name.toLowerCase()) {
        case 'physical':
            return 'P';
        case 'demat':
            return 'D';
    }
};

BSEService.GetBseDividendPayModeCode = (name) => {
    switch (name.toLowerCase()) {
        case 'cheque':
            return '01';
        case 'direct credit':
            return '02';
        case 'ecs':
            return '03';
        case 'neft':
            return '04';
        case 'rtgs':
            return '05';
    }
};

BSEService.GetBseCommunicatioModeCode = (name) => {
    switch (name.toLowerCase()) {
        case 'physical':
            return 'P';
        case 'electronic':
            return 'E';
        case 'mobile':
            return 'M';
    }
};

//Database activity functions

BSEService.GetBSEConfig = async () => {
    var bseConfig = null;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    const readResult = await readRequest.execute("GetBSELogin");
    if (readResult.recordset.length > 0) {
        bseConfig = readResult.recordset[0];
    }

    return bseConfig;
};

BSEService.UpdateClientAccountStatus = async (data) => {
    var errorMessage = "Error while updating account bse status...";

    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("Id", cryptoEngine.ParamDecrypt(data.Id, true))
            .input("IsAccountCreatedAtBSE", true);

        const result = await request.execute("UpdateClientAccountBSEStatus");

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

BSEService.UpdateClientProfileFATCAStatus = async (data) => {
    var errorMessage = "Error while updating profile FATCA status...";

    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("Id", cryptoEngine.ParamDecrypt(data.ClientKycProfileId, true))
            .input("IsFATCAUploaded", true);

        const result = await request.execute("UpdateClientProfileFATCAStatus");

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

BSEService.UpdateClientAccountMandateBSEStatus = async (data, BSEMandateId) => {
    var errorMessage = "Error while updating mandate status...";

    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("Id", cryptoEngine.ParamDecrypt(data.AccountMandate.Id, true))
            .input("BSEMandateId", BSEMandateId)
            .input("StartDate", date.format(data.StartDate, "YYYY-MM-DD"))
            .input("EndDate", date.format(data.EndDate, "YYYY-MM-DD"))
            .input("IsMandateCreatedAtBSE", true);

        const result = await request.execute("UpdateClientAccountMandateBSEStatus");

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

BSEService.UpdateClientAccountMandateStatus = async (data, status, remarks) => {
    var errorMessage = "Error while updating mandate status...";

    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("Id", cryptoEngine.ParamDecrypt(data.Id, true))
            .input("Status", status)
            .input("BSERemarks", remarks);

        const result = await request.execute("UpdateClientAccountMandateStatus");

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

BSEService.UpdateClientAOFImageUploadStatus = async (data) => {
    var errorMessage = "Error while updating aof image upload status...";

    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("Id", cryptoEngine.ParamDecrypt(data.ClientAccountId, true))
            .input("ISAOFFileUploadedToBSE", true);

        const result = await request.execute("UpdateClientAccountAOFImageUploadStatus");

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

BSEService.UpdateClientMandateImageUploadStatus = async (data) => {
    var errorMessage = "Error while updating mandate image upload status...";

    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("Id", cryptoEngine.ParamDecrypt(data.ClientAccountMandateId, true))
            .input("IsMandateScanUploadedToBSE", true);

        const result = await request.execute("UpdateClientAccountMandateImageUploadStatus");

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

BSEService.CreateBSELog = async (ClientAccountId, ClientKycProfileId, CommunicationType, BSEStatus, BSERemark) => {
    var errorMessage = "Error while creating bse log...";

    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("ClientAccountId", ClientAccountId)
            .input("ClientKycProfileId", ClientKycProfileId)
            .input("CommunicationType", CommunicationType)
            .input("BSEStatus", BSEStatus)
            .input("BSERemark", BSERemark);

        const result = await request.execute("InsertClientAccountBSELog");

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

BSEService.GetTempBSEURN = async () => {
    var cnt = 0;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("TransactionDate", date.format(new Date(), 'YYYYMMDD'));
    const readResult = await readRequest.execute("GetTempBSEURN");
    if (readResult.recordset.length > 0) {
        cnt = readResult.recordset[0].DailyCount;
    }

    return cnt;
};

BSEService.GetBSESchemeByISINAmount = async (SchemeName, ISIN, Amount) => {
    var schemeDetails = null;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("SchemeName", SchemeName)
        .input("ISIN", ISIN)
        .input("Amount", Amount);
    const readResult = await readRequest.execute("GetBSESchemeByISINAmount");
    if (readResult.recordset.length > 0) {
        schemeDetails = readResult.recordset[0];
    }

    return schemeDetails;
};

BSEService.GetBSESchemeAdditionalByISINAmount = async (SchemeName, ISIN, Amount) => {
    var schemeDetails = null;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("SchemeName", SchemeName)
        .input("ISIN", ISIN)
        .input("Amount", Amount);
    const readResult = await readRequest.execute("GetBSESchemeAdditionalByISINAmount");
    if (readResult.recordset.length > 0) {
        schemeDetails = readResult.recordset[0];
    }

    return schemeDetails;
};

BSEService.GetBSESIPSchemeByISINAmountFrequency = async (SchemeName, ISIN, Amount, SIPFrequency) => {
    var schemeDetails = null;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("SchemeName", SchemeName)
        .input("ISIN", ISIN)
        .input("Amount", Amount)
        .input("SIPFrequency", SIPFrequency);
    const readResult = await readRequest.execute("GetBSESIPSchemeByISINAmountFrequency");
    if (readResult.recordset.length > 0) {
        schemeDetails = readResult.recordset[0];
    }

    return schemeDetails;
};

BSEService.GetBSESWPSchemeByISINAmountFrequency = async (SchemeName, ISIN, Amount, SWPFrequency) => {
    var schemeDetails = null;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("SchemeName", SchemeName)
        .input("ISIN", ISIN)
        .input("Amount", Amount)
        .input("SWPFrequency", SWPFrequency);
    const readResult = await readRequest.execute("GetBSESWPSchemeByISINAmountFrequency");
    if (readResult.recordset.length > 0) {
        schemeDetails = readResult.recordset[0];
    }

    return schemeDetails;
};

BSEService.GetBSESchemeRedemptionByISIN = async (SchemeName, ISIN) => {
    var schemeDetails = null;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("SchemeName", SchemeName)
        .input("ISIN", ISIN);
    const readResult = await readRequest.execute("GetBSESchemeRedemptionByISIN");
    if (readResult.recordset.length > 0) {
        schemeDetails = readResult.recordset[0];
    }

    return schemeDetails;
};

BSEService.GetBSESchemeByProductCode = async (ProductCode) => {
    var schemeDetails = null;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("ProductCode", ProductCode);
    const readResult = await readRequest.execute("GetBSESchemeByProductCode");
    if (readResult.recordset.length > 0) {
        schemeDetails = readResult.recordset[0];
    }

    return schemeDetails;
};

BSEService.UpdateClientTransactionSIPOrder = async (data) => {
    var errorMessage = "Error while updating child order...";
    var units = 0;
    var nav = 0;

    let pool = await appPool.connect();

    try {
        const readNavRequest = pool.request();
        readNavRequest.input("NAVDate", data.RecordDate.toFormat('yyyy-MM-dd'))
            .input("ISIN", data.ISIN);
        const readNavResult = await readNavRequest.execute("GetNetAssetValueByDateISIN");
        if (readNavResult.recordset.length > 0) {
            var navData = readNavResult.recordset[0];

            nav = navData.NAV;
            units = data.FundAmount / navData.NAV;
        }
    }
    catch (err) {
        console.log(err);
    }

    const transaction = pool.transaction();
    try {
        await transaction.begin();

        const request = transaction.request();

        request.input("SIPRegistrationId", data.SIPRegistrationId)
            .input("BSESchemeId", cryptoEngine.ParamDecrypt(data.BSESchemeId, true))
            .input("ISIN", data.ISIN)
            .input("FolioNumber", data.FolioNumber)
            .input("FundAmount", data.FundAmount)
            .input("BSETradeOn", data.RecordDate.toFormat('yyyy-MM-dd'))
            .input("BSEURN", '')
            .input("BSEOrderId", data.BSEOrderId)
            .input("BSEResponse", data.BSEResponse)
            .input("BSEOrderStatus", 'VALID')
            .input("TradeStatus", 'InProcess');

        const result = await request.execute("InsertClientTransactionSIPOrder");

        const requestUnitLedger = transaction.request();
        requestUnitLedger.input("ClientAccountId", cryptoEngine.ParamDecrypt(data.ClientAccountId, true))
            .input("TransactionType", 'P')
            .input("TransactionDate", data.RecordDate.toFormat('yyyy-MM-dd'))
            .input("BSEOrderId", data.BSEOrderId)
            .input("OrderDate", data.RecordDate.toFormat('yyyy-MM-dd'))
            .input("BSESchemeId", cryptoEngine.ParamDecrypt(data.BSESchemeId, true))
            .input("FolioNumber", data.FolioNumber)
            .input("Amount", data.FundAmount)
            .input("ProvisionalUnits", units)
            .input("ProvisionalNAV", nav)
            .input("ProvisionalAmount", data.FundAmount)
            .input("ProvisionalBalanceUnits", units)
            .input("ProvisionalBalanceAmount", data.FundAmount)
            .input("TradeType", 'SIP');
        const resultUnitLedger = await requestUnitLedger.execute("InsertClientTransactionUnitLedger");

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

BSEService.UpdateClientTransactionBSEOrderStatus = async (data) => {
    var errorMessage = "Error while updating order...";

    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();

        const request = transaction.request();

        request.input("BSEOrderId", data.BSEOrderId)
            .input("BSEOrderStatus", data.OrderStatus);

        const result = await request.execute("UpdateClientTransactionAllocationBSEOrderStatus");

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

BSEService.UpdateBSELoginPassword = async (NewPassword) => {
    var errorMessage = "Error while updating bse login password...";

    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("Password", NewPassword);

        const result = await request.execute("UpdateBSELoginPassword");

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


module.exports = BSEService;