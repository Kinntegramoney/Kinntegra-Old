module.exports = app => {
    const dashboard = require("../controllers/dashboard.controller");
    const auth = require("../middlewares/auth");

    var router = require("express").Router();

    router.get("/clientcount", auth, dashboard.GetClientCountData);
    router.get("/clientchartdatacount", auth, dashboard.GetClientChartDataCount);
    router.get("/tradelogstatuschartdatacount", auth, dashboard.GetTradeLogStatusChartDataCount);

    app.use("/api/dashboard", router);
};