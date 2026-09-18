const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");
const mime = require("mime-types");
const emailEngine = require("../models/emailengine.model");
// const activityLogController = require('../controllers/appuseractivitylog.controller');
const appuserController = require('../controllers/appuser.controller');
const notificationController = require('../controllers/notification.controller');

exports.GetEmployeeFilterStates = async (req, res) => {
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetEmployeeFilterState");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].CStateId, true),
                    Name: dataList[i].StateName,

                };
                data.push(dataItem);
            }
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetEmployeeFilterCities = async (req, res) => {
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetEmployeeFilterCity");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    // Id: cryptoEngine.ParamEncrypt(dataList[i].CStateId, true),
                    Name: dataList[i].CityName,

                };
                data.push(dataItem);
            }
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetEmployeeFilterAssociate = async (req, res) => {
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetEmployeeFilterAssociate");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    Name: dataList[i].AssociateName,

                };
                data.push(dataItem);
            }
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};


exports.GetEmployeeFilterDepartment = async (req, res) => {
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetEmployeeFilterDepartment");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    Name: dataList[i].DepartmentName,

                };
                data.push(dataItem);
            }
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};


exports.GetEmployeeFilterGrade = async (req, res) => {
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetEmployeeFilterGrade");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    Name: dataList[i].DesignationName,

                };
                data.push(dataItem);
            }
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};


exports.GetEmployeeFilterEmployeeName = async (req, res) => {
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetEmployeeFilterEmployeeName");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    Name: dataList[i].EmployeeName,

                };
                data.push(dataItem);
            }
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};


exports.GetEmployeeFilterStatus = async (req, res) => {
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetEmployeeFilterStatus");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    // Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    Name: dataList[i].Status,

                };
                data.push(dataItem);
            }
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    } catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};