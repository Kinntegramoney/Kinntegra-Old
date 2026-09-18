const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");

exports.GetTransactionTypeList = async (req, res) => {
    try {
        var data = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetTransactionType");
        if (readResult.recordset.length > 0) {
            data = readResult.recordset.map(x => {
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

exports.GetFeedTransactionTypeList = async (req, res) => {
    try {
        var data = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetFeedTransactionType");
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