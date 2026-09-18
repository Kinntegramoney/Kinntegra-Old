module.exports = app => {
    const applog = require("../controllers/applog.controller");
    const auth = require("../middlewares/auth");

    var router = require("express").Router();

    router.get("/gettradelog/:AssociateId/:FromDate/:ToDate", auth, applog.GetTradeLog);
    router.get("/getclienttradelog/:AssociateId/:FromDate/:ToDate/:PANCardNumber", auth, applog.GetTradeLog);
    router.get("/gettradelogfilter/:AssociateId/:FromDate/:ToDate/:PANCardNumber/:TradeTypes", auth, applog.GetTradeLogFilterData);
    router.post("/gettradelogexcel", auth, applog.DownloadTradeLogExcel);
    router.get("/getchallanlog/:AssociateId", auth, applog.GetChequePaymentChallanLog);
    router.get("/getchallandocument/:Id", auth, applog.GetChequePaymentChallanDocument);
    router.get("/getautotradelog/:AssociateId/:TradeDate", auth, applog.GetAutoTradeLog);

    app.use("/api/log", router);
};