const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");

exports.GetTransactionPlanByTransactionTypeName = async (req, res) => {
    const TransactionType = req.params.Type;

    var errorMessage = "Error while getting client account data";
    try {

        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("TransactionType", TransactionType);
        const readResult = await readRequest.execute("GetTransactionPlansByTransactionType");
        if (readResult.recordset.length > 0) {

            dataList = readResult.recordset;
        }


        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].PlanId, true),
                    Name: dataList[i].PlanName,
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

exports.GetTransactionPlanList = async (req, res) => {
    var errorMessage = "Error while getting transaction plans";

    try {
        var data = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetTransactionPlanList");
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