var https = require('https');
const lendboxConfig = require("../configs/lendbox.config");
const date = require('date-and-time');
const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");
const appPool = require("../models/db.model");
const xml2json = require('xml2js');
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');
const moment = require('moment');
const commonFunction = require('./commonfunction.model');
const path = require('path');
const fileSystem = require("fs");
const pdfjsLib = require('pdfjs-dist');
const pdfJSWorker = require('pdfjs-dist/build/pdf.worker');
const canvas = require('canvas');
const joinImages = require('join-images-updated');
const Jimp = require("jimp");
const formData = require('form-data');

const LendboxService = function () { }

LendboxService.InvestorRegistration = async (data) => {
    try {
        return new Promise((resolve, reject) => {
            var firstHolder = data.AccountHolders.find(x => x.SerialNumber === 1);
            var defaultBank = data.AccountBanks.find(x => x.IsDefault === true);

            let inputData = {
                "email": firstHolder.ProfileDetails.Email,
                "title": LendboxService.GetSalutation(firstHolder.ProfileDetails.GenderCode),
                "firstName": LendboxService.GetFirstName(firstHolder.ProfileDetails.Name),
                "lastName": LendboxService.GetLastName(firstHolder.ProfileDetails.Name),
                "mobile": firstHolder.ProfileDetails.MobileNumber,
                "street1": firstHolder.CommincationDetails.LocalAddress1 + ' ' + firstHolder.CommincationDetails.LocalAddress2,
                "street2": firstHolder.CommincationDetails.LocalAddress3,
                "city": firstHolder.CommincationDetails.LocalCity,
                "pin": firstHolder.CommincationDetails.LocalPinCode,
                "pan": firstHolder.ProfileDetails.PANCardNumber,
                "dob": moment(date.format(firstHolder.ProfileDetails.DateOfBirth, 'YYYY-MM-DD'), 'YYYY-MM-DD').valueOf(),
                "fathersName": firstHolder.ProfileDetails.FatherName,
                "accountType": LendboxService.GetBankAccountType(defaultBank.BankAccountTypeCode),
                "holderName": firstHolder.ProfileDetails.Name,
                "accountNumber": defaultBank.AccountNumber,
                "ifsc": defaultBank.IFSC,
                "aadhar": firstHolder.ProfileDetails.AadharCardNumber,
                "ip": "192.168.1.1",
                "ua": "Postman",
                "timestamp": moment().valueOf()
            };

            var headers = {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(inputData)),
                'x-api-key': lendboxConfig.APIKey,
                'x-api-code': lendboxConfig.APICode
            };
            var options = {
                host: process.env.LENDBOX_API_LINK,
                path: '/v1/partners/investor-signup',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            var request = https.request(options, function (response) {
                response.setEncoding('utf8');

                response.on('data', async function (message) {
                    // console.log(message);

                    var result = JSON.parse(message);

                    await LendboxService.CreateLBLog(cryptoEngine.ParamDecrypt(data.Id, true), 0, 'Account Creation', result.success, result.msg, JSON.stringify(result));

                    if (result.success == true) {
                        await LendboxService.UpdateClientAccountLBStatus(data, result);

                        resolve({ Status: result.Status, Remarks: result.Remarks });
                    }
                    else {
                        resolve({ Status: result.Status, Remarks: result.Remarks });
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

            request.write(JSON.stringify(inputData));

            request.end();
        });
    }
    catch (err) {
        console.log(err);
    }
};

LendboxService.UploadImage = async (data) => {
    try {
        var imageFilePath = await LendboxService.PrepareUploadImage(data);

        return new Promise((resolve, reject) => {

            var headers = {
                'Accept': '*/*', 
                'Content-Type': 'multipart/form-data',
                'x-api-key': lendboxConfig.APIKey,
                'x-api-code': lendboxConfig.APICode
            };

            var inputForm = new formData();

            if(data.Name == 'Member PAN Card')
            {
                inputForm.append('PAN', fileSystem.createReadStream(imageFilePath));
            }
            else if (data.Name == 'Local Address')
            {
                inputForm.append('AADHAR', fileSystem.createReadStream(imageFilePath));
            }
            // inputForm.append('password', "");

            // console.log(inputForm);

            var options = {
                host: process.env.LENDBOX_API_LINK,
                path: '/v1/partners/upload/docs?lbUserId=' + data.LBUserId,
                method: 'POST',
                headers: inputForm.getHeaders(),
                timeout: 30000,
            };

            var request = https.request(options);

            // request.appendHeader('Content-Type', 'multipart/form-data; boundary=' + inputForm.getBoundary());
            request.appendHeader('x-api-key', lendboxConfig.APIKey);
            request.appendHeader('x-api-code', lendboxConfig.APICode);

            inputForm.pipe(request);

            request.on('response', function (response) {
                response.setEncoding('utf8');

                response.on('data', async function (message) {
                    // console.log(message);

                    var result = JSON.parse(message);

                    await LendboxService.CreateLBLog(
                        cryptoEngine.ParamDecrypt(data.ClientAccountId, true),
                        cryptoEngine.ParamDecrypt(data.ClientKycProfileId, true),
                        'Image Upload',
                        result.success,
                        result.msg,
                        JSON.stringify(result));

                    if (result.success == true) {
                        await LendboxService.UpdateClientAccountImageUploadStatus(data);

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

LendboxService.PrepareUploadImage = async (data) => {
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

// Lendbox Codes
LendboxService.GetSalutation = (name) => {
    switch (name.toLowerCase()) {
        case 'm':
            return 'Mr.';
        case 'f':
            return 'Ms.';
        case 'o':
            return 'Mr.';
    }
};

LendboxService.GetFirstName = (name) => {
    let nameDataList = name.split(' ');

    return nameDataList[0];
};

LendboxService.GetLastName = (name) => {
    let nameDataList = name.split(' ');

    return nameDataList[nameDataList.length - 1];
};

LendboxService.GetBankAccountType = (name) => {
    switch (name.toLowerCase()) {
        case 'sb':
            return 'SAVINGS';
        case 'cb':
            return 'CURRENT';
    }
};

//Database activity functions
LendboxService.UpdateClientAccountLBStatus = async (data, lbresult) => {
    var errorMessage = "Error while updating account lb status...";

    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("Id", cryptoEngine.ParamDecrypt(data.Id, true))
            .input("LBUserId", lbresult.data.lbUserId)
            .input("IsAccountCreatedAtLB", true);

        const result = await request.execute("UpdateClientAccountLBStatus");

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

LendboxService.UpdateClientAccountImageUploadStatus = async (data) => {
    var errorMessage = "Error while updating account lendbox image upload status...";

    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("ClientAccountId", cryptoEngine.ParamDecrypt(data.ClientAccountId, true))
            .input("ClientKycProfileId", cryptoEngine.ParamDecrypt(data.ClientKycProfileId, true))
            .input("Name", data.Name);

        const result = await request.execute("InsertClientAccountLBDocument");

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

LendboxService.CreateLBLog = async (ClientAccountId, ClientKycProfileId, CommunicationType, LBStatus, LBRemark, LBResponse) => {
    var errorMessage = "Error while creating lb log...";

    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("ClientAccountId", ClientAccountId)
            .input("ClientKycProfileId", ClientKycProfileId)
            .input("CommunicationType", CommunicationType)
            .input("LBStatus", LBStatus)
            .input("LBRemark", LBRemark)
            .input("LBResponse", LBResponse);

        const result = await request.execute("InsertClientAccountLBLog");

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

module.exports = LendboxService;