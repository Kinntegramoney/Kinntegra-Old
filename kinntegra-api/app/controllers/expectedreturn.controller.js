const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");


exports.SaveExpectedReturn = async (req, res) => {
    var { Id, EquityFixedRatio, DebtFixedRatio,TotalInvestmentValue } = req.body;

    var errorMessage = "Error while saving expected return data...";

    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';


    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        // if (cryptoEngine.ParamDecrypt(Id, true) == 0) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("EquityRatio", 0)
                .input("DebtRatio", 0)
                .input("EquityFixedRatio", EquityFixedRatio)
                .input("DebtFixedRatio", DebtFixedRatio)
                .input("EquityReturn",0)
                .input("DebtReturn", 0)
                .input("TotalReturn", 0)
                .input("TotalInvestmentValue", TotalInvestmentValue)
                .input("YearlyInvestmentValue", 0)
                .input("MonthlyInvestmentValue", 0)
            const result = await request.execute("InsertExpectedReturn");
            Id = cryptoEngine.ParamEncrypt(result.output.Id, true);
        //}
        // else {
        //     const request = transaction.request();
        //     request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
        //         .input("Name", Name)
        //         .input("Code", Code)
        //     const result = await request.execute("UpdateDesignation");
        // }
        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'Designation',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);
        res.status(200).send({ Status: true, Message: "Expected Return Saved Successfully.", Data: { Id: Id } });
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        res.status(500).send(errorMessage);
    }
};

exports.GetExpectedReturn = async (req, res) => {

try {
    var dataItem;

    const readRequest = req.app.locals.db.request();
  
    const readResult = await readRequest.execute("GetExpectedReturn");
    if (readResult.recordset.length > 0) {
        dataItem = readResult.recordset[0];
    }

    var data;
    if (dataItem != null) {
        data = {
            Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
            EquityFixedRatio: dataItem.EquityFixedRatio,
            DebtFixedRatio: dataItem.DebtFixedRatio,
            TotalInvestmentValue: dataItem.TotalInvestmentValue,
            Created: dataItem.Created,
            Modified: dataItem.Modified
        };
    }
    res.status(200).send({ Status: true, Message: "", Data: data });
}
catch (err) {
    console.log(err);
    res.status(500).send(errorMessage);
}
}