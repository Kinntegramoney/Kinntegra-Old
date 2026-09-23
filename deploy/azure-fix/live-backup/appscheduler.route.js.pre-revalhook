module.exports = app => {
    const appScheduler = require("../controllers/appscheduler.controller");

    var router = require("express").Router();

    router.post("/mandatestatus", appScheduler.ProcessMandateStatus);
    router.post("/mfucanstatus", appScheduler.ProcessMFUCANStatus);
    router.post("/mfumandate", appScheduler.ProcessMFUMandate);
    router.post("/mfumandatestatus", appScheduler.ProcessMFUMandateStatus);
    router.post("/uploadmandate", appScheduler.ProcessUploadMandate);
    router.post("/associateloginemail", appScheduler.ProcessAssociateCredentialEmail);
    router.post("/camswbr9", appScheduler.ProcessCamsWbr9);
    router.post("/karvy311", appScheduler.ProcessKarvy311);
    router.post("/amfinav", appScheduler.ProcessAmfiNav);
    // router.post("/camswbr22", appScheduler.ProcessCamsWbr22);
    router.post("/karvy203", appScheduler.ProcessKarvy203);
    router.post("/childorder", appScheduler.ProcessChildOrderDetails);
    router.post("/karvy307", appScheduler.ProcessKarvy307);
    router.post("/camswbr2", appScheduler.ProcessCamsWbr2);
    router.post("/orderstatus", appScheduler.ProcessOrderStatus);
    router.post("/camswbr2a", appScheduler.ProcessCamsWbr2A);
    router.post("/feedtransaction", appScheduler.ProcessFeedTransaction);
    router.post("/swpregistration", appScheduler.ProcessSWPRegistration);
    router.post("/flexiswp", appScheduler.ProcessFlexiSWP);
    router.post("/tradestatus", appScheduler.ProcessTradeStatus);
    router.get("/camswbr2Manual/:RequestId", appScheduler.ProcessCamsWbr2Manual);
    router.post("/buy", appScheduler.ProcessBuySchedule);
    router.post("/amfiindianav", appScheduler.ProcessAmfiIndiaNav);
    router.post("/changebsepassword", appScheduler.ProcessChangeBSEPassword);
    router.post("/pulselabsbenchmarkdata", appScheduler.ProcessPulseLabsBenchmarkData);

    router.get("/test", appScheduler.TestFunction);

    app.use("/api/appscheduler", router);
};