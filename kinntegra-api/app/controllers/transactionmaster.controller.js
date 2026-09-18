const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");

exports.GetTransactionMasters = async (req, res) => {
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetTransactionMasters");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    SchemeCategory: dataList[i].SchemeCategory,
                    SchemeType: dataList[i].SchemeType,
                    BuyType: dataList[i].BuyType,
                    SellType: dataList[i].SellType,
                    Portfolio: dataList[i].Portfolio,
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