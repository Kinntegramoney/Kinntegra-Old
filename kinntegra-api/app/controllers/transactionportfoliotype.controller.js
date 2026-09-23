const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");
const transactionController = require('../controllers/transaction.controller');
const luxon = require('luxon');

exports.GetTransactionPortfolioTypes = async (req, res) => {
    var errorMessage = 'Error while fetching portfolio data...';

    try {
        var data = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetTransactionPortfolioType");
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

exports.GetTransactionPortfolioTypeList = async (req, res) => {
    const ClientAccountId = req.params.ClientAccountId;

    var errorMessage = 'Error while fetching portfolio data...';

    try {
        var dataList = [];
        var currentDate = luxon.DateTime.now().setZone('Asia/Kolkata');

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetTransactionPortfolioType");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                var marketValue = 0;
                var sipAmount = 0;

                if (ClientAccountId != undefined && ClientAccountId != null && dataList[i].Code != 'A') {
                    var portfolioData = await transactionController.GetPortfolioTypeHolding(req, currentDate.toFormat('yyyy-MM-dd'), dataList[i].Code, ClientAccountId);
                    marketValue = portfolioData.HoldingAmount;

                    var sipPortfolioData = await transactionController.GetSIPPortfolioTypeHolding(req, cryptoEngine.ParamEncrypt(dataList[i].Id, true), ClientAccountId);

                    sipAmount = sipPortfolioData.HoldingAmount;
                }

                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    Name: dataList[i].Name,
                    Code: dataList[i].Code,
                    RecordOrder: dataList[i].RecordOrder,
                    MarketValue: marketValue,
                    SIPAmount: sipAmount,
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

exports.GetTransactionPortfolioTypeSellList = async (req, res) => {
    var { ClientAccounts } = req.body;

    // console.log(ClientAccounts);

    let ClientAccountsData = JSON.parse(ClientAccounts);

    var errorMessage = 'Error while fetching portfolio data...';

    try {
        var dataList = [];
        var currentDate = luxon.DateTime.now().setZone('Asia/Kolkata');

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetTransactionPortfolioType");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                var marketValue = 0;
                var longTermValue = 0;
                var shortTermValue = 0;
                var sipAmount = 0;
                var exitFreeValue = 0;
                var lockFreeValue = 0;

                if (dataList[i].Code != 'A' && dataList[i].Code != 'O') {
                    var systemClientAccounts = ClientAccountsData.filter(x => x.UCC != '');
                    for (let j = 0; j < systemClientAccounts.length; j++) {
                        var ClientAccountId = systemClientAccounts[j].Id;

                        var portfolioData = await transactionController.GetPortfolioTypeHolding(req, currentDate.toFormat('yyyy-MM-dd'), dataList[i].Code, ClientAccountId);
                        marketValue += portfolioData.HoldingAmount;

                        var portfolioSellData = await transactionController.GetPortfolioTypeSellHolding(req, currentDate.toFormat('yyyy-MM-dd'), dataList[i].Code, ClientAccountId);
                        longTermValue += portfolioSellData.LongTermAmount;
                        shortTermValue += portfolioSellData.ShortTermAmount;
                        exitFreeValue += portfolioSellData.ExitFreeAmount;
                        lockFreeValue += portfolioSellData.LockFreeAmount;

                        var sipPortfolioData = await transactionController.GetSIPPortfolioTypeHolding(req, cryptoEngine.ParamEncrypt(dataList[i].Id, true), ClientAccountId);

                        sipAmount += sipPortfolioData.HoldingAmount;
                    }

                    var nonSystemClientAccounts = ClientAccountsData.filter(x => x.UCC == '');
                    for (let j = 0; j < nonSystemClientAccounts.length; j++) {
                        var FirstHolderName = nonSystemClientAccounts[j].FirstHolderName;
                        var SecondHolderName = nonSystemClientAccounts[j].SecondHolderName;
                        var ThirdHolderName = nonSystemClientAccounts[j].ThirdHolderName;
                        var FirstNomineeName = nonSystemClientAccounts[j].FirstNomineeName;
                        var SecondNomineeName = nonSystemClientAccounts[j].SecondNomineeName;
                        var ThirdNomineeName = nonSystemClientAccounts[j].ThirdNomineeName;
                        var GuardianName = nonSystemClientAccounts[j].GuardianName;

                        var portfolioSellData = await transactionController.GetPortfolioTypeSellHoldingNonAccount(req, currentDate.toFormat('yyyy-MM-dd'), dataList[i].Code, FirstHolderName, SecondHolderName, ThirdHolderName, FirstNomineeName, SecondNomineeName, ThirdNomineeName, GuardianName);
                        marketValue += portfolioSellData.CurrentAmount;
                        longTermValue += portfolioSellData.LongTermAmount;
                        shortTermValue += portfolioSellData.ShortTermAmount;
                        exitFreeValue += portfolioSellData.ExitFreeAmount;
                        lockFreeValue += portfolioSellData.LockFreeAmount;
                    }
                }

                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    Name: dataList[i].Name,
                    Code: dataList[i].Code,
                    RecordOrder: dataList[i].RecordOrder,
                    MarketValue: marketValue,
                    LongTermValue: longTermValue,
                    ShortTermValue: shortTermValue,
                    ExitFreeValue: exitFreeValue,
                    LockFreeValue: lockFreeValue,
                    SIPAmount: sipAmount,
                    Created: dataList[i].Created,
                    Modified: dataList[i].Modified
                };
                data.push(dataItem)
            }
        }
        // console.log(data);
        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};