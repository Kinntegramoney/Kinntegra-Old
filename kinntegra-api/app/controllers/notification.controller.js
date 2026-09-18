const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");
// const activityLogController = require('../controllers/appuseractivitylog.controller');
const io = require('socket.io-client');

exports.GetNotificationList = async (req, res) => {
    const RecordType = req.params.RecordType;
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);

    var errorMessage = "Error while fetching notification list.";

    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("RecordType", RecordType);
        readRequest.input("AppUserId", UserId);
        const readResult = await readRequest.execute("GetNotificationsByType");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    FromAppUserId: cryptoEngine.ParamEncrypt(dataList[i].FromAppUserId, true),
                    ToAppUserId: cryptoEngine.ParamEncrypt(dataList[i].ToAppUserId, true),
                    RecordDate: dataList[i].RecordDate,
                    Title: dataList[i].Title,
                    Description: dataList[i].Description,
                    Link: dataList[i].Link,
                    RecordType: dataList[i].RecordType,
                    IsRead: dataList[i].IsRead,
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

exports.GetUnReadNotificationCount = async (req, res) => {
    const UserId = cryptoEngine.ParamDecrypt(req.User.user_id, true);

    var errorMessage = "Error while fetching un-read notification count.";

    try {
        var count = 0;

        const readRequest = req.app.locals.db.request();
        readRequest.input("AppUserId", UserId);
        const readResult = await readRequest.execute("GetUnReadNotificationCount");
        if (readResult.recordset.length > 0) {
            let dataList = readResult.recordset[0];

            count = dataList.NotificationCount;
        }

        res.status(200).send({ Status: true, Message: "", Data: { UnReadNotificationCount: count } });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.UpdateNotificationStatus = async (req, res) => {
    var { Id, IsRead } = req.body;

    var errorMessage = "Error while updating notification data...";

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const request = transaction.request();
        request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
            .input("IsRead", IsRead);
        const result = await request.execute("UpdateNotificationStatus");
        await transaction.commit();

        res.status(200).send({ Status: true, Message: "Notification status updated Successfully.", Data: { Id: Id } });
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

exports.CreateNotification = async (req, res, Id, FromAppUserId, ToAppUserId, Title, Description, Link, RecordType) => {
    var errorMessage = "Error while saving notification data...";

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const request = transaction.request();

        request.output("Id", msSql.BigInt)
            .input("FromAppUserId", cryptoEngine.ParamDecrypt(FromAppUserId, true))
            .input("ToAppUserId", cryptoEngine.ParamDecrypt(ToAppUserId, true))
            .input("Title", Title)
            .input("Description", Description)
            .input("Link", Link)
            .input("RecordType", RecordType)
            .input("IsRead", false);
        const result = await request.execute("InsertNotification");

        Id = cryptoEngine.ParamEncrypt(result.output.Id, true);

        await transaction.commit();

        return Id;
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        }
        catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) {
            errorMessage = "Duplicate record. Record already exists.";
        }

        res.status(500).send(errorMessage);
    }
};

exports.SendNotification = async (req, res) => {
    const Message = req.params.Message;

    const socket = io.connect(process.env.REAL_COMM_LINK, {
        reconnection: true,
        autoConnect: true
    });

    socket.on('connection', function () {
        // console.log('connected to real communication socket');
    });

    // socket.connect();

    var notificationData = {
        SenderId: cryptoEngine.ParamEncrypt("1", true),
        ReceiverId: cryptoEngine.ParamEncrypt("1", true),
        Title: Message,
        Description: '',
        Link: '',
        RecordType: 'General'
    };

    socket.emit('sendmessage', JSON.stringify(notificationData));

    socket.on('receivemessage', (msg) => {
        // console.log('receivemessage: ' + msg);
    });

    res.status(200).send({ Status: true, Message: notificationData });
};