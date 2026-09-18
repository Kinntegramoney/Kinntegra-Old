const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");
// const activityLogController = require('../controllers/appuseractivitylog.controller');


exports.GetStateList = async (req, res) => {
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetStates");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    CountryId: cryptoEngine.ParamEncrypt(dataList[i].CountryId,true),
                    Name: dataList[i].Name,
                    Code: dataList[i].Code,
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

exports.GetStateById = async (req, res) => {
    const Id = req.params.Id;

    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("Id", cryptoEngine.ParamDecrypt(Id, true));
        const readResult = await readRequest.execute("GetStateById");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                CountryId: cryptoEngine.ParamEncrypt(dataItem.CountryId, true),
                Name: dataItem.Name,
                Code: dataItem.Code,
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

exports.GetStateByCountry = async(req, res) => {
    const CountryId = req.params.CountryId;

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("CountryId", cryptoEngine.ParamDecrypt(CountryId, true))
        const readResult = await readRequest.execute("GetStateByCountry");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    CountryId: cryptoEngine.ParamEncrypt(dataList[i].CountryId,true),
                    Name: dataList[i].Name,
                    Code: dataList[i].Code,
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

exports.SaveState = async (req, res) => {
    var { Id, CountryId, Name, Code, MFUCode } = req.body;
    // console.log(req.body);
    var errorMessage = "Error while saving state data...";
    
    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';
    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();
        if (cryptoEngine.ParamDecrypt(Id, true) == 0) {
            const request = transaction.request();

            request.output("Id", msSql.BigInt)
                .input("CountryId", cryptoEngine.ParamDecrypt(CountryId, true))
                .input("Name", Name)
                .input("Code", Code)
                .input("MFUCode", MFUCode);
            const result = await request.execute("InsertState");
            Id = cryptoEngine.ParamEncrypt(result.output.Id, true);
        }
        else {
            const request = transaction.request();
            request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                .input("CountryId", cryptoEngine.ParamDecrypt(CountryId, true))
                .input("Name", Name)
                .input("Code", Code)
                .input("MFUCode", MFUCode);
            const result = await request.execute("UpdateState");
        }
        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'State',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);

        res.status(200).send({ Status: true, Message: "State Saved Successfully.", Data: { Id: Id } });
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

exports.DeleteState = async (req, res) => {
    var { Id } = req.body;

    var errorMessage = "Error while deleting state data...";

    // let TransactionMode = 'Delete';

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const request = transaction.request();

        request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
        const result = await request.execute("DeleteState");
        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'State',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);

        res.status(200).send({ Status: true, Message: "State Deleted Successfully.", Data: {} });
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