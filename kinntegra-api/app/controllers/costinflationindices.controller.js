const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");
// const activityLogController = require('../controllers/appuseractivitylog.controller');

exports.GetCostInflationIndexlList = async (req, res) => {
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetCostInflationIndex");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    FinancialYear : dataList[i].FinancialYear,
                    StartDate : dataList[i].StartDate,
                    EndDate: dataList[i].EndDate,
                    IndexValue: dataList[i].IndexValue,
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

exports.GetCostInflationIndexById = async (req, res) => {
    const Id = req.params.Id;

    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("Id", cryptoEngine.ParamDecrypt(Id, true));
        const readResult = await readRequest.execute("GetCostInflationIndexById");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                FinancialYear: dataItem.FinancialYear,
                StartDate: dataItem.StartDate,
                EndDate: dataItem.EndDate,
                IndexValue: dataItem.IndexValue,
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
};

exports.SaveCostInflationIndex = async (req, res) => {
    var { Id, FinancialYear,StartDate,EndDate, IndexValue} = req.body;

    var errorMessage = "Error while saving bank account type data...";

    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';


    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(Id, true) == 0) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                    .input("FinancialYear", FinancialYear)
                    .input("StartDate", StartDate)
                    .input("EndDate", EndDate)
                    .input("IndexValue",IndexValue)
            const result = await request.execute("InsertCostInflationIndex");
            Id = cryptoEngine.ParamEncrypt(result.output.Id, true);
        }
        else {
            const request = transaction.request();
            request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
            .input("FinancialYear", FinancialYear)
            .input("StartDate", StartDate)
            .input("EndDate", EndDate)
            .input("IndexValue",IndexValue)
            const result = await request.execute("UpdateCostInflationIndex");
        }
        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'CostInflationIndex',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);
        res.status(200).send({ Status: true, Message: "Bank Account Type Saved Successfully.", Data: { Id: Id } });
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

exports.DeleteCostInflationIndex = async (req, res) => {
    var { Id } = req.body;


    var errorMessage = "Error while deleting bank account type data...";

    // let TransactionMode = 'Delete';

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        const request = transaction.request();

        request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
        const result = await request.execute("DeleteCostInflationIndex");
        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'CostInflationIndex',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);

        res.status(200).send({ Status: true, Message: "Bank Account Type Deleted Successfully.", Data: {} });
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("FK_")) { errorMessage = "Reference exists. Cannot delete record."; }

        // console.log(errorMessage);

        res.status(500).send(errorMessage);
    }
};
