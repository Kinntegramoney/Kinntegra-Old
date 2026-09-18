const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");
const luxon = require('luxon');

exports.GetBseSchemeList = async (req, res) => {
    var errorMessage = "Error while getting bse scheme list";
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetBseSchemes");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    SchemeName: dataList[i].SchemeName
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

exports.GetBseSchemePortfolioList = async (req, res) => {
    var Portfolio = req.params.Portfolio;
    var PortfolioType = req.params.PortfolioType;

    PortfolioType = (PortfolioType == 'NA') ? '' : PortfolioType;

    var errorMessage = "Error while getting bse scheme list";
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("Portfolio", Portfolio)
            .input("PortfolioType", PortfolioType);
        const readResult = await readRequest.execute("GetBseSchemesByPortfolio");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            data = dataList.map(x => {
                const Id = cryptoEngine.ParamEncrypt(x.Id, true);

                return { ...x, Id };
            });
        }

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetBseSipCancelReasonList = async (req, res) => {
    var errorMessage = "Error while getting bse scheme list";
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetBSESIPCancelReason");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = dataList.map(x => {
            const Id = cryptoEngine.ParamEncrypt(x.Id, true);

            return { ...x, Id };
        });

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetBseHoliday = async (req, res) => {
    var errorMessage = "Error while getting bse holiday";
    try {
        var data = [];

        var currentDate = luxon.DateTime.now().setZone('Asia/Kolkata');

        const readRequest = req.app.locals.db.request();
        readRequest.input("Year", currentDate.year);
        const readResult = await readRequest.execute("GetBSEHolidayByYear");
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
