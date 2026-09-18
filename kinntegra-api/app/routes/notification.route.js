module.exports = app => {
    const notification = require("../controllers/notification.controller");
    const auth = require("../middlewares/auth");

    var router = require("express").Router();

    router.get("/notificationlist/:RecordType", auth, notification.GetNotificationList);
    router.get("/unreadnotificationcount", auth, notification.GetUnReadNotificationCount);
    router.post("/updatestatus", auth, notification.UpdateNotificationStatus);
    router.get("/send/:Message", notification.SendNotification);

    app.use("/api/notification", router);
};