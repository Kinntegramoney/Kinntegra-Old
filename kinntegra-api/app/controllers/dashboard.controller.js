const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");
const luxon = require('luxon');

exports.GetClientCountData = async (req, res) => {
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);

    try {
        var data = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AppUserId", UserId);
        const readResult = await readRequest.execute("GetDashboardClientCount");
        if (readResult.recordset.length > 0) {
            data = readResult.recordset;
        }

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetClientChartDataCount = async (req, res) => {
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);

    try {
        var data = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("AppUserId", UserId);
        const readResult = await readRequest.execute("GetDashboardClientChartDataCount");
        if (readResult.recordset.length > 0) {
            data = readResult.recordset;
        }

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetTradeLogStatusChartDataCount = async (req, res) => {
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);

    try {
        var data = [];

        var currentDate = luxon.DateTime.now().setZone('Asia/Kolkata');

        const readRequest = req.app.locals.db.request();
        readRequest.input("AppUserId", UserId)
            .input("AsOnDate", currentDate.toFormat('yyyy-MM-dd'));
        const readResult = await readRequest.execute("GetDashboardTradeLogStatusChartDataCount");
        if (readResult.recordset.length > 0) {
            data = readResult.recordset;
        }

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};