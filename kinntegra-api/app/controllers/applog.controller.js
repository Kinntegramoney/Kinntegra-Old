const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");
const excelEngine = require("../models/excelengine.model");
const fileSystem = require("fs");
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

exports.GetTradeLog = async (req, res) => {
    const associateId = req.params.AssociateId;
    const fromDate = req.params.FromDate;
    const toDate = req.params.ToDate;
    const PANCardNumber = (req.params.PANCardNumber != null && req.params.PANCardNumber != undefined) ? req.params.PANCardNumber : '';

    var errorMessage = "Error while fetching trade log...";

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true))
            .input("FromDate", fromDate)
            .input("ToDate", toDate)
            .input("PANCardNumber", PANCardNumber);
        const readResult = await readRequest.execute("GetClientTransactionList");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset.map(item => {
                const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                const ClientAccountId = cryptoEngine.ParamEncrypt(item.ClientAccountId, true);
                const TransactionTypeId = cryptoEngine.ParamEncrypt(item.TransactionTypeId, true);
                const TransactionPlanId = cryptoEngine.ParamEncrypt(item.TransactionPlanId, true);
                const EmployeeId = cryptoEngine.ParamEncrypt(item.EmployeeId, true);

                return { ...item, Id, ClientAccountId, TransactionTypeId, TransactionPlanId, EmployeeId };
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

exports.GetTradeLogFilterData = async (req, res) => {
    const associateId = req.params.AssociateId;
    const fromDate = req.params.FromDate;
    const toDate = req.params.ToDate;
    const panCardNumber = req.params.PANCardNumber;
    const tradeTypes = req.params.TradeTypes;

    var errorMessage = "Error while fetching trade log...";

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true))
            .input("FromDate", fromDate)
            .input("ToDate", toDate)
            .input("PANCardNumber", panCardNumber)
            .input("TradeTypes", tradeTypes);
        const readResult = await readRequest.execute("GetTradeLogFilterData");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset.map(item => {
                const Id = cryptoEngine.ParamEncrypt(item.Id, true);
                const ClientAccountId = cryptoEngine.ParamEncrypt(item.ClientAccountId, true);
                const TransactionTypeId = cryptoEngine.ParamEncrypt(item.TransactionTypeId, true);
                const TransactionPlanId = cryptoEngine.ParamEncrypt(item.TransactionPlanId, true);
                const EmployeeId = cryptoEngine.ParamEncrypt(item.EmployeeId, true);

                return { ...item, Id, ClientAccountId, TransactionTypeId, TransactionPlanId, EmployeeId };
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

exports.GetChequePaymentChallanLog = async (req, res) => {
    const associateId = req.params.AssociateId;
    var errorMessage = "Error while fetching challan log...";

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true));
        const readResult = await readRequest.execute("GetClientTransactionPaymentChequeDetails");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset.map(x => {
                const ClientTransactionId = cryptoEngine.ParamEncrypt(x.ClientTransactionId, true);
                const ClientTransactionPaymentId = cryptoEngine.ParamEncrypt(x.ClientTransactionPaymentId, true);
                const ClientTransactionPaymentChequeId = cryptoEngine.ParamEncrypt(x.ClientTransactionPaymentChequeId, true);
                const ClientAccountId = cryptoEngine.ParamEncrypt(x.ClientAccountId, true);
                const ClientId = cryptoEngine.ParamEncrypt(x.ClientId, true);
                const ClientKycBankId = cryptoEngine.ParamEncrypt(x.ClientKycBankId, true);
                const EmployeeId = cryptoEngine.ParamEncrypt(x.EmployeeId, true);

                return { ...x, ClientTransactionId, ClientTransactionPaymentId, ClientTransactionPaymentChequeId, ClientAccountId, ClientId, ClientKycBankId, EmployeeId };
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

exports.GetChequePaymentChallanDocument = async (req, res) => {
    const Id = req.params.Id;
    var errorMessage = "Error while fetching challan document...";

    try {
        var data;

        const readRequest = req.app.locals.db.request();
        readRequest.input("Id", cryptoEngine.ParamDecrypt(Id, true));
        const readResult = await readRequest.execute("GetClientTransactionPaymentChequeChallan");
        if (readResult.recordset.length > 0) {
            data = readResult.recordset[0];
        }

        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.ProcessTradeStatus = async (req, res) => {
    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        const requestStatus = transaction.request();
        const resultStatus = await requestStatus.execute("ProcessTradeStatus");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while processing trade status...');
    }
};

exports.DownloadTradeLogExcel = async (req, res) => {
    var { TradeLog } = req.body;

    let TradeLogData = JSON.parse(TradeLog);

    var errorMessage = 'Error while creating trade log excel...';

    try {
        var excelData = [];

        for (let i = 0; i < TradeLogData.length; i++) {
            var tradeLogItem = TradeLogData[i];

            // console.log(tradeLogItem.RecordType+': ' + i);

            if (tradeLogItem.RecordType == 'S') {
                var tradeLogRecords = await getTradeLogRecord(req, tradeLogItem);

                // console.log(tradeLogItem.RecordType+'|' + tradeLogItem.Id+'|'+tradeLogRecords.length);
                if (tradeLogRecords.length > 0) {
                    for (let j = 0; j < tradeLogRecords.length; j++) {
                        excelData.push(tradeLogRecords[j]);
                    }
                }
            }
            else {
                // console.log(tradeLogItem.RecordType+'|' + tradeLogItem.Id+'|1');
                excelData.push({
                    FolioNumber: tradeLogItem.FolioNumber,
                    SchemeName: tradeLogItem.SchemeName,
                    InvestorName: tradeLogItem.ClientName,
                    PAN: tradeLogItem.PANCardNumber,
                    AdvisorName: tradeLogItem.AssociateName,
                    TransactionInitiationDate: new Date(tradeLogItem.TransactionDate),
                    TransactionType: tradeLogItem.TradeType,
                    TransactionId: tradeLogItem.TransactionId,
                    NAV: tradeLogItem.NAV,
                    Units: tradeLogItem.Units,
                    Amount: tradeLogItem.Amount,
                    TransactionCompletedDate: (tradeLogItem.TransactionCompletedDate != null) ? new Date(tradeLogItem.TransactionCompletedDate) : null,
                    Status: tradeLogItem.TradeStatus
                });
            }
        }

        // console.log(excelData.length);

        var reportPathData = await excelEngine.CreateTradeLogReport(excelData);
        // var reportPathData = { ExcelFilePath: '', FileName: '' };

        // let tryCount = 1;
        // while (!fileSystem.existsSync(reportPathData.ExcelFilePath)) {
        //     await snooze(5000);

        //     if (tryCount == 3) {
        //         throw new Error('Error while generating report...')
        //     }

        //     tryCount += 1;
        // }

        res.status(200).send({ Status: true, Message: "", Data: process.env.WEB_API_LINK + '/doc/report/' + reportPathData.FileName });
    }
    catch (err) {
        console.log(err);

        res.status(500).send(errorMessage);
    }
};

exports.GetAutoTradeLog = async (req, res) => {
    const associateId = req.params.AssociateId;
    const tradeDate = req.params.TradeDate;

    var errorMessage = "Error while fetching trade log...";

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AssociateId", cryptoEngine.ParamDecrypt(associateId, true))
            .input("TradeDate", tradeDate);
        const readResult = await readRequest.execute("GetAutoTradeLog");
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

async function getTradeLogRecord(req, tradeLogItem) {
    var data;

    const readRequest = req.app.locals.db.request();
    readRequest.input("TransactionId", cryptoEngine.ParamDecrypt(tradeLogItem.Id, true))
        .input("RecordType", tradeLogItem.RecordType)
        .input("TradeType", tradeLogItem.TradeType);
    const readResult = await readRequest.execute("GetTradeLogDownloadRecord");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset.map(item => {
            const InvestorName = tradeLogItem.ClientName;
            const PAN = tradeLogItem.PANCardNumber;
            const AdvisorName = tradeLogItem.AssociateName;

            return { ...item, InvestorName, PAN, AdvisorName };
        });
    }

    return data;
}
