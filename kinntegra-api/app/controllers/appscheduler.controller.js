const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");
const bseService = require("../models/bseservice.model");
const mfuService = require("../models/mfuservice.model");
const date = require('date-and-time');
const clientController = require('../controllers/client.controller');
const reports = require('../models/reports.model');
const emailEngine = require("../models/emailengine.model");
const feedController = require('../controllers/feed.controller');
const transactionController = require('../controllers/transaction.controller');
const applogController = require('../controllers/applog.controller');
const luxon = require('luxon');
const appPool = require("../models/db.model");
const benchmarkdataController = require('../controllers/benchmarkdata.controller');

exports.ProcessMandateStatus = async (req, res) => {
    var bseMandateId = '';
    try {
        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetClientAccountMandateBSEStatusProcess");
        if (readResult.recordset.length > 0) {
            let dataList = readResult.recordset;

            for (let i = 0; i < dataList.length; i++) {
                let data = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    ClientAccountId: cryptoEngine.ParamEncrypt(dataList[i].ClientAccountId, true),
                    UCC: dataList[i].UCC,
                    FromDate: date.format(dataList[i].StartDate, 'DD/MM/YYYY'),
                    BSEMandateId: dataList[i].BSEMandateId,
                    ToDate: date.format(new Date(), 'DD/MM/YYYY')
                };

                bseMandateId = dataList[i].BSEMandateId;

                try {
                    var bseResult = await bseService.GetMandateStatus(req, res, data);

                    await transactionController.ProcessApprovedMandateSIP(req, res, bseMandateId, bseResult.Message.toUpperCase());
                }
                catch (err) {
                    console.log(err);
                }
            }
        }

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessMandateStatus',
            ProcessMessage: 'Schedule run successfully: ProcessMandateStatus',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessMandateStatus", Data: null });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessMandateStatus | ' + bseMandateId);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessMandateStatus',
            ProcessMessage: 'Error while running schedule: ProcessMandateStatus | ' + bseMandateId,
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessMandateStatus | ' + bseMandateId);
    }
};

exports.ProcessMFUCANStatus = async (req, res) => {
    var mfuCAN = '';
    try {
        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetClientAccountMFUCanStatusProcess");
        if (readResult.recordset.length > 0) {
            let dataList = readResult.recordset;

            for (let i = 0; i < dataList.length; i++) {
                let data = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    MFUCAN: dataList[i].MFUCAN,
                };

                mfuCAN = dataList[i].MFUCAN;

                try {
                    var mfuResult = await mfuService.GetCANDataStatus(data);

                    // var accountData = await clientController.GetClientAccountInfo(req, res, cryptoEngine.ParamEncrypt(dataList[i].Id, true));

                    // await clientController.ProcessMFUMandate(req, res, accountData);
                }
                catch (err) {
                    console.log(err);
                }
            }
        }

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessMFUCANStatus',
            ProcessMessage: 'Schedule run successfully: ProcessMFUCANStatus',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessMFUCANStatus", Data: null });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessMFUCANStatus | ' + mfuCAN);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessMFUCANStatus',
            ProcessMessage: 'Error while running schedule: ProcessMFUCANStatus | ' + mfuCAN,
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessMFUCANStatus | ' + mfuCAN);
    }
};

exports.ProcessMFUMandate = async (req, res) => {
    var mfuCAN = '';
    try {
        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetClientAccountMFUMandateProcess");
        if (readResult.recordset.length > 0) {
            let dataList = readResult.recordset;

            for (let i = 0; i < dataList.length; i++) {
                let data = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    MFUCAN: dataList[i].MFUCAN,
                };

                mfuCAN = dataList[i].MFUCAN;

                try {
                    var accountData = await clientController.GetClientAccountInfo(req, res, cryptoEngine.ParamEncrypt(dataList[i].Id, true));

                    await clientController.ProcessMFUMandate(req, res, accountData);
                }
                catch (err) {
                    console.log(err);
                }
            }
        }

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessMFUMandate',
            ProcessMessage: 'Schedule run successfully: ProcessMFUMandate',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessMFUMandate", Data: null });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessMFUMandate | ' + mfuCAN);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessMFUMandate',
            ProcessMessage: 'Error while running schedule: ProcessMFUMandate | ' + mfuCAN,
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessMFUMandate | ' + mfuCAN);
    }
};

exports.ProcessMFUMandateStatus = async (req, res) => {
    var MMRN = '';
    try {
        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetClientAccountMandateMFUStatusProcess");
        if (readResult.recordset.length > 0) {
            let dataList = readResult.recordset;

            for (let i = 0; i < dataList.length; i++) {
                let data = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    ClientAccountId: cryptoEngine.ParamEncrypt(dataList[i].ClientAccountId, true),
                    MFUCAN: dataList[i].MFUCAN,
                    MMRN: dataList[i].MMRN,
                };

                MMRN = dataList[i].MMRN;

                try {
                    var mfuResult = await mfuService.ePayEezzStatus(data);
                }
                catch (err) {
                    console.log(err);
                }
            }
        }

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessMFUMandateStatus',
            ProcessMessage: 'Schedule run successfully: ProcessMFUMandateStatus',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessMFUMandateStatus", Data: null });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessMFUMandateStatus | ' + MMRN);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessMFUMandateStatus',
            ProcessMessage: 'Error while running schedule: ProcessMFUMandateStatus | ' + MMRN,
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessMFUMandateStatus | ' + MMRN);
    }
};

exports.ProcessUploadMandate = async (req, res) => {
    var ucc = '';
    try {
        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetClientAccountMinor");
        if (readResult.recordset.length > 0) {
            let dataList = readResult.recordset;

            for (let i = 0; i < dataList.length; i++) {
                var ClientAccountId = cryptoEngine.ParamEncrypt(dataList[i].Id, true);

                var accountData = await clientController.GetClientAccountInfo(req, res, ClientAccountId);

                ucc = accountData.UCC;

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

                    try {
                        var bseResult = await bseService.UploadMandateMFD(mandateItem);
                    }
                    catch (err) {
                        console.log(err);
                    }
                }

                accountData = await clientController.GetClientAccountInfo(req, res, ClientAccountId);
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
                    var mandateResult = await clientController.SaveClientAccountDocument(req, res, mandateItem.ClientAccountId, mandatePdfDataList[m].Id, 'Mandate', mandateReportData.FileName, mandateReportData.ReportBuffer, 'application/pdf', 'D');
                }
            }
        }

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessUploadMandate',
            ProcessMessage: 'Schedule run successfully: ProcessUploadMandate',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessUploadMandate", Data: null });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessUploadMandate | ' + ucc);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessUploadMandate',
            ProcessMessage: 'Error while running schedule: ProcessUploadMandate | ' + ucc,
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessUploadMandate | ' + ucc);
    }
};

exports.ProcessAssociateCredentialEmail = async (req, res) => {
    var AssociateId = '';
    try {
        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetAssociates");
        if (readResult.recordset.length > 0) {
            let dataList = readResult.recordset;

            for (let i = 0; i < dataList.length; i++) {
                AssociateId = cryptoEngine.ParamEncrypt(dataList[i].Id, true);

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
                const readEmailRequest = req.app.locals.db.request();
                readEmailRequest.input("AssociateId", cryptoEngine.ParamDecrypt(AssociateId, true));
                const readEmailResult = await readEmailRequest.execute("GetAssociatesEmailByAssociateId");

                if (readEmailResult.recordset.length > 0) {
                    createdByData = readEmailResult.recordset[0];
                }

                var link = process.env.WEB_APP_LINK + '/signin';
                emailEngine.SendAssociateCredentials(createdByData.Email, photoIdData.Name, link, pin);

                // console.log('SrNo: ' + (i+1)+'|AssociateId: ' + dataList[i].Id);
            }
        }

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessAssociateCredentialEmail',
            ProcessMessage: 'Schedule run successfully: ProcessAssociateCredentialEmail',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessAssociateCredentialEmail", Data: null });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessAssociateCredentialEmail | ' + AssociateId);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessAssociateCredentialEmail',
            ProcessMessage: 'Error while running schedule: ProcessAssociateCredentialEmail | ' + AssociateId,
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessAssociateCredentialEmail | ' + AssociateId);
    }
};

exports.ProcessCamsWbr9 = async (req, res) => {
    try {
        var result = await feedController.ProcessCamsWbr9(req, res);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessCamsWbr9',
            ProcessMessage: 'Schedule run successfully: ProcessCamsWbr9',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessCamsWbr9", Data: null });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessCamsWbr9');

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessCamsWbr9',
            ProcessMessage: 'Error while running schedule: ProcessCamsWbr9',
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessCamsWbr9');
    }
};

exports.ProcessKarvy311 = async (req, res) => {
    try {
        var result = await feedController.ProcessKarvy311(req, res);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessKarvy311',
            ProcessMessage: 'Schedule run successfully: ProcessKarvy311',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessKarvy311", Data: null });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessKarvy311');

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessKarvy311',
            ProcessMessage: 'Error while running schedule: ProcessKarvy311',
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessKarvy311');
    }
};

exports.ProcessAmfiNav = async (req, res) => {
    try {
        var result = await feedController.ProcessAmfiNav(req, res);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessAmfiNav',
            ProcessMessage: 'Schedule run successfully: ProcessAmfiNav',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessAmfiNav", Data: result });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessAmfiNav');

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessAmfiNav',
            ProcessMessage: 'Error while running schedule: ProcessAmfiNav',
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessAmfiNav');
    }
};

// exports.ProcessCamsWbr22 = async (req, res) => {
//     try {
//         var result = await feedController.ProcessCamsWbr9(req, res);

//         res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessCamsWbr22", Data: null });
//     }
//     catch (err) {
//         console.log(err);
//         console.log('Error while running schedule: ProcessCamsWbr22');
//         res.status(500).send('Error while running schedule: ProcessCamsWbr22');
//     }
// };

exports.ProcessKarvy203 = async (req, res) => {
    try {
        var result = await feedController.ProcessKarvy203(req, res);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessKarvy203',
            ProcessMessage: 'Schedule run successfully: ProcessKarvy203',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessKarvy203", Data: null });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessKarvy203');

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessKarvy203',
            ProcessMessage: 'Error while running schedule: ProcessKarvy203',
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessKarvy203');
    }
};

exports.ProcessChildOrderDetails = async (req, res) => {
    var SIPRegistrationId = '';
    try {
        var orderDate = luxon.DateTime.now().setZone('Asia/Kolkata');

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetActiveSIPRegistration");
        if (readResult.recordset.length > 0) {
            let dataList = readResult.recordset;

            for (let i = 0; i < dataList.length; i++) {
                let data = {
                    ClientAccountId: cryptoEngine.ParamEncrypt(dataList[i].ClientAccountId, true),
                    UCC: dataList[i].UCC,
                    OrderDate: orderDate.toFormat('dd LLL yyyy'),
                    SIPRegistrationId: dataList[i].BSEOrderId,
                    BSESchemeId: cryptoEngine.ParamEncrypt(dataList[i].BSESchemeId, true),
                    ISIN: dataList[i].ISIN,
                    RecordDate: orderDate
                };

                SIPRegistrationId = dataList[i].BSEOrderId;

                try {
                    var bseResult = await bseService.GetChildOrderDetails(data);
                }
                catch (err) {
                    console.log(err);
                }
            }
        }

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessChildOrderDetails',
            ProcessMessage: 'Schedule run successfully: ProcessChildOrderDetails',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessChildOrderDetails", Data: null });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessChildOrderDetails | ' + SIPRegistrationId);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessChildOrderDetails',
            ProcessMessage: 'Error while running schedule: ProcessChildOrderDetails | ' + SIPRegistrationId,
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessChildOrderDetails | ' + SIPRegistrationId);
    }
};

exports.ProcessKarvy307 = async (req, res) => {
    try {
        var result = await feedController.ProcessKarvy307(req, res);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessKarvy307',
            ProcessMessage: 'Schedule run successfully: ProcessKarvy307',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessKarvy307", Data: null });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessKarvy307');

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessKarvy307',
            ProcessMessage: 'Error while running schedule: ProcessKarvy307',
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessKarvy307');
    }
};

exports.ProcessCamsWbr2 = async (req, res) => {
    try {
        var result = await feedController.ProcessCamsWbr2(req, res);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessCamsWbr2',
            ProcessMessage: 'Schedule run successfully: ProcessCamsWbr2',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessCamsWbr2", Data: null });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessCamsWbr2');

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessCamsWbr2',
            ProcessMessage: 'Error while running schedule: ProcessCamsWbr2',
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessCamsWbr2');
    }
};

exports.ProcessCamsWbr2Manual = async (req, res) => {
    try {
        var requestId = req.params.RequestId;

        var result = await feedController.ProcessCamsWbr2Manual(req, res, requestId);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessCamsWbr2',
            ProcessMessage: 'Schedule run successfully: ProcessCamsWbr2',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessCamsWbr2", Data: null });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessCamsWbr2');

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessCamsWbr2',
            ProcessMessage: 'Error while running schedule: ProcessCamsWbr2',
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessCamsWbr2');
    }
};

exports.ProcessOrderStatus = async (req, res) => {
    var BSEOrderId = '';
    try {
        var toDate = luxon.DateTime.now().setZone('Asia/Kolkata');

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetClientTransactionAllocationInProcessOrder");
        if (readResult.recordset.length > 0) {
            let dataList = readResult.recordset;

            for (let i = 0; i < dataList.length; i++) {
                let data = {
                    UCC: dataList[i].UCC,
                    FromDate: date.format(dataList[i].TransactionDate, 'DD/MM/YYYY'),
                    BSEOrderId: dataList[i].BSEOrderId,
                    ToDate: toDate.toFormat('dd/MM/yyyy'),
                    TransactionType: dataList[i].TransactionType
                };

                BSEOrderId = dataList[i].BSEOrderId;

                try {
                    var bseResult = await bseService.GetOrderStatus(data);
                }
                catch (err) {
                    console.log(err);
                }
            }
        }

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessOrderStatus',
            ProcessMessage: 'Schedule run successfully: ProcessOrderStatus',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessOrderStatus", Data: null });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessOrderStatus | ' + BSEOrderId);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessOrderStatus',
            ProcessMessage: 'Error while running schedule: ProcessOrderStatus | ' + BSEOrderId,
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessOrderStatus | ' + BSEOrderId);
    }
};

exports.ProcessCamsWbr2A = async (req, res) => {
    try {
        var result = await feedController.ProcessCamsWbr2A(req, res);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessCamsWbr2A',
            ProcessMessage: 'Schedule run successfully: ProcessCamsWbr2A',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessCamsWbr2A", Data: null });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessCamsWbr2A');

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessCamsWbr2A',
            ProcessMessage: 'Error while running schedule: ProcessCamsWbr2A',
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessCamsWbr2A');
    }
};

exports.ProcessFeedTransaction = async (req, res) => {
    try {
        var result = await feedController.ProcessFeedTransaction(req, res);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessFeedTransaction',
            ProcessMessage: 'Schedule run successfully: ProcessFeedTransaction',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessFeedTransaction", Data: null });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessFeedTransaction');

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessFeedTransaction',
            ProcessMessage: 'Error while running schedule: ProcessFeedTransaction',
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessFeedTransaction');
    }
};

exports.ProcessSWPRegistration = async (req, res) => {
    try {
        var result = await transactionController.ProcessSWPRegistration(req, res);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessSWPRegistration',
            ProcessMessage: 'Schedule run successfully: ProcessSWPRegistration',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessSWPRegistration", Data: null });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessSWPRegistration');

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessSWPRegistration',
            ProcessMessage: 'Error while running schedule: ProcessSWPRegistration',
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessSWPRegistration');
    }
};

exports.ProcessFlexiSWP = async (req, res) => {
    try {
        var result = await transactionController.ProcessFlexiSWP(req, res);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessFlexiSWP',
            ProcessMessage: 'Schedule run successfully: ProcessFlexiSWP',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessFlexiSWP", Data: null });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessFlexiSWP');

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessFlexiSWP',
            ProcessMessage: 'Error while running schedule: ProcessFlexiSWP',
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessFlexiSWP');
    }
};

exports.ProcessTradeStatus = async (req, res) => {
    try {
        var result = await applogController.ProcessTradeStatus(req, res);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessTradeStatus',
            ProcessMessage: 'Schedule run successfully: ProcessTradeStatus',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessTradeStatus", Data: null });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessTradeStatus');

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessTradeStatus',
            ProcessMessage: 'Error while running schedule: ProcessTradeStatus',
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessTradeStatus');
    }
};

exports.ProcessBuySchedule = async (req, res) => {
    try {
        var result = await transactionController.ProcessBuySchedule(req, res);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessBuySchedule',
            ProcessMessage: 'Schedule run successfully: ProcessBuySchedule',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessBuySchedule", Data: null });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessBuySchedule');

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessBuySchedule',
            ProcessMessage: 'Error while running schedule: ProcessBuySchedule',
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessBuySchedule');
    }
};

exports.ProcessAmfiIndiaNav = async (req, res) => {
    try {
        var result = await feedController.ProcessAmfiIndiaNav(req, res);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessAmfiIndiaNav',
            ProcessMessage: 'Schedule run successfully: ProcessAmfiIndiaNav',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessAmfiIndiaNav", Data: result });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessAmfiIndiaNav');

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessAmfiIndiaNav',
            ProcessMessage: 'Error while running schedule: ProcessAmfiIndiaNav',
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessAmfiIndiaNav');
    }
};

exports.ProcessChangeBSEPassword = async (req, res) => {
    var newBSEPassword = '';
    var oldBSEPassword = '';
    try {
        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetBSELogin");
        if (readResult.recordset.length > 0) {
            let dataList = readResult.recordset[0];

            oldBSEPassword = dataList.Password;
            newBSEPassword = (oldBSEPassword == 'PuKu@1602') ? 'KuPu@0216' : 'PuKu@1602';

            var data = {
                OldPassword: oldBSEPassword,
                NewPassword: newBSEPassword,
                ConfirmPassword: newBSEPassword
            }

            try {
                var bseResult = await bseService.ChangePasswordMFD(data);

                if (bseResult.Status == true) {
                    emailEngine.SendBSEPasswordChangedEmail('info@kinntegra.co.in', newBSEPassword);
                }
            }
            catch (err) {
                console.log(err);
            }
        }

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessChangeBSEPassword',
            ProcessMessage: 'Schedule run successfully: ProcessChangeBSEPassword',
            ErrorDescription: ''
        }

        await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessChangeBSEPassword", Data: null });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessChangeBSEPassword');

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessChangeBSEPassword',
            ProcessMessage: 'Error while running schedule: ProcessChangeBSEPassword',
            ErrorDescription: err
        }

        await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessChangeBSEPassword');
    }
};

exports.ProcessPulseLabsBenchmarkData = async (req, res) => {
    try {
        var result = await benchmarkdataController.ProcessPulseLabsBenchmarkData(req, res, null);

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessPulseLabsBenchmarkData',
            ProcessMessage: 'Schedule run successfully: ProcessPulseLabsBenchmarkData',
            ErrorDescription: ''
        }

        // await saveAppSchedulerLog(logData);

        res.status(200).send({ Status: true, Message: "Schedule run successfully: ProcessPulseLabsBenchmarkData", Data: null });
    }
    catch (err) {
        console.log(err);
        console.log('Error while running schedule: ProcessPulseLabsBenchmarkData');

        var logData = {
            ProcessDate: luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd'),
            ProcessName: 'ProcessPulseLabsBenchmarkData',
            ProcessMessage: 'Error while running schedule: ProcessPulseLabsBenchmarkData',
            ErrorDescription: err
        }

        // await saveAppSchedulerLog(logData);

        res.status(500).send('Error while running schedule: ProcessPulseLabsBenchmarkData');
    }
};


async function saveAppSchedulerLog(record) {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("ProcessDate", record.ProcessDate)
            .input("ProcessName", record.ProcessName)
            .input("ProcessMessage", record.ProcessMessage)
            .input("ErrorDescription", record.ErrorDescription);

        const result = await request.execute("InsertAppSchedulerLog");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while saving app scheduler log...');
    }
};

exports.TestFunction = async (req, res) => {
    var transactionNature = 'Systematic 13/50';

    var newTransactionNature = await getNewTransactionNature(transactionNature);

    res.status(200).send({ Status: true, Data: newTransactionNature });
};

async function getNewTransactionNature(transactionNature) {
    var newTransactionNature = transactionNature;

    if (transactionNature.toLowerCase().includes('systematic') && (
        transactionNature.toLowerCase().includes('reversal') ||
        transactionNature.toLowerCase().includes('not found') ||
        transactionNature.toLowerCase().includes('rej') ||
        transactionNature.toLowerCase().includes('reversed') ||
        transactionNature.toLowerCase().includes('blocked') ||
        transactionNature.toLowerCase().includes('rejection') ||
        transactionNature.toLowerCase().includes('insufficient') ||
        transactionNature.toLowerCase().includes('incorrect') ||
        transactionNature.toLowerCase().includes('date is before') ||
        transactionNature.toLowerCase().includes('pending') ||
        transactionNature.toLowerCase().includes('expired') ||
        transactionNature.toLowerCase().includes('invalid') ||
        transactionNature.toLowerCase().includes('not received') ||
        transactionNature.toLowerCase().includes('dp not av') ||
        transactionNature.toLowerCase().includes('balance is less') ||
        transactionNature.toLowerCase().includes('dishonoured') ||
        transactionNature.toLowerCase().includes('edit') ||
        transactionNature.toLowerCase().includes('rejected') ||
        transactionNature.toLowerCase().includes('miscellaneous') ||
        transactionNature.toLowerCase().includes('rectification') ||
        transactionNature.toLowerCase().includes('mismatch') ||
        transactionNature.toLowerCase().includes('no funds') ||
        transactionNature.toLowerCase().includes('not available') ||
        transactionNature.toLowerCase().includes('failed') ||
        transactionNature.toLowerCase().includes('failure')
    )) {
        newTransactionNature = 'SIP Reversal';
    }
    else if (transactionNature.toLowerCase() == 'systematic') {
        newTransactionNature = 'SIP';
    }
    else if (transactionNature.toLowerCase().startsWith('systematic-bse -') == true ||
        transactionNature.toLowerCase().startsWith('systematic instalment no -') == true ||
        transactionNature.toLowerCase().startsWith('systematic - via') == true ||
        transactionNature.toLowerCase().startsWith('systematic- for') == true ||
        transactionNature.toLowerCase().startsWith('systematic appln') == true ||
        transactionNature.toLowerCase().startsWith('systematic-nse -') == true ||
        transactionNature.toLowerCase().startsWith('systematic-normal') == true ||
        transactionNature.toLowerCase().startsWith('systematic (ecs)') == true ||
        transactionNature.toLowerCase().startsWith('systematic (pdc)') == true ||
        transactionNature.toLowerCase().startsWith('systematic - cton') == true ||
        transactionNature.toLowerCase().startsWith('systematic - ifast-online') == true ||
        transactionNature.toLowerCase().startsWith('systematic - konline') == true ||
        transactionNature.toLowerCase().startsWith('systematic - multi') == true ||
        transactionNature.toLowerCase().startsWith('systematic  - instalment') == true ||
        transactionNature.toLowerCase().startsWith('systematic - instalment 1') == true ||
        transactionNature.toLowerCase().startsWith('systematicinstalment') == true ||
        transactionNature.toLowerCase().startsWith('systematicothers. - instalment no') == true ||
        transactionNature.toLowerCase().startsWith('systematic sfolio') == true ||
        transactionNature.toLowerCase().startsWith('systematic - w') == true ||
        transactionNature.toLowerCase().startsWith('systematic  - arn-') == true ||
        transactionNature.toLowerCase().startsWith('systematic - arn-') == true
    ) {
        newTransactionNature = 'SIP';
    }
    else if (/^systematic - \d+\/\d+$/.test(transactionNature.toLowerCase()) == true ||
        /^systematic  \d+\/\d+$/.test(transactionNature.toLowerCase()) == true ||
        /^systematic - \d$/.test(transactionNature.toLowerCase()) == true ||
        /^systematic  \d+.*\/$/.test(transactionNature.toLowerCase()) == true ||
        /^systematic \d.*$/.test(transactionNature.toLowerCase()) == true
    ) {
        newTransactionNature = 'SIP';
    }

    return newTransactionNature;
};