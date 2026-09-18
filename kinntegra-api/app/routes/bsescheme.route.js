module.exports = app => {
    const bsescheme = require("../controllers/bsescheme.controller");
    const auth = require("../middlewares/auth");

    var router = require("express").Router();

    router.get("/getbseschemelist", auth, bsescheme.GetBseSchemeList);
    router.get("/getbseschemeportfoliolist/:Portfolio/:PortfolioType", auth, bsescheme.GetBseSchemePortfolioList);
    router.get("/getbsesipcancelreasons", auth, bsescheme.GetBseSipCancelReasonList);
    router.get("/getbseholiday", auth, bsescheme.GetBseHoliday);

    app.use("/api/bsescheme", router);
};