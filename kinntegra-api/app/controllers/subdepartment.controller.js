const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");
// const activityLogController = require('../controllers/appuseractivitylog.controller');


exports.GetSubDepartmentList = async (req, res) => {
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetSubDepartments");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    DepartmentId: cryptoEngine.ParamEncrypt(dataList[i].DepartmentId,true),
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

exports.GetSubDepartmentById = async (req, res) => {
    const Id = req.params.Id;

    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("Id", cryptoEngine.ParamDecrypt(Id, true));
        const readResult = await readRequest.execute("GetSubDepartmentById");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                DepartmentId: cryptoEngine.ParamEncrypt(dataItem.DepartmentId, true),
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


exports.GetSubDepartmentByDepartmentId = async (req, res) => {
    const DepartmentId = req.params.departmentId;
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("DepartmentId", cryptoEngine.ParamDecrypt(DepartmentId, true));
        const readResult = await readRequest.execute("GetSubDepartmentsByDepartmentId");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    DepartmentId: cryptoEngine.ParamEncrypt(dataList[i].DepartmentId,true),
                    Name: dataList[i].Name,
                    DepartmentName: dataList[i].DepartmentName,
                    SubDepartmentName: dataList[i].SubDepartmentName,
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

exports.SaveSubDepartment = async (req, res) => {
    var { Id, DepartmentId, Name, Code } = req.body;
    
    var errorMessage = "Error while saving sub department data...";
    
    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';
    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();
        if (cryptoEngine.ParamDecrypt(Id, true) == 0) {
            const request = transaction.request();

            request.output("Id", msSql.BigInt)
                .input("DepartmentId", cryptoEngine.ParamDecrypt(DepartmentId, true))
                .input("Name", Name)
                .input("Code", Code)

            const result = await request.execute("InsertSubDepartment");
            Id = cryptoEngine.ParamEncrypt(result.output.Id, true);
        }
        else {
            const request = transaction.request();
            request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                .input("DepartmentId", cryptoEngine.ParamDecrypt(DepartmentId, true))
                .input("Name", Name)
                .input("Code", Code)
            const result = await request.execute("UpdateSubDepartment");
        }
        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'SubDepartment',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);

        res.status(200).send({ Status: true, Message: "Sub Department Saved Successfully.", Data: { Id: Id } });
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

exports.DeleteSubDepartment = async (req, res) => {
    var { Id } = req.body;

    var errorMessage = "Error while deleting sub department data...";

    // let TransactionMode = 'Delete';

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const request = transaction.request();

        request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
        const result = await request.execute("DeleteSubDepartment");
        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'SubDepartment',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);

        res.status(200).send({ Status: true, Message: "Sub Department Deleted Successfully.", Data: {} });
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