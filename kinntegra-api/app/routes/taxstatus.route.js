module.exports = app => {
    const taxstatus = require("../controllers/taxstatus.controller");
       const auth = require("../middlewares/auth");

    var router = require("express").Router();

    router.get("/taxstatuslist",auth, taxstatus.GetTaxStatusList);
    router.get("/taxstatusbyid/:Id",auth, taxstatus.GetTaxStatusById);
    router.post("/savetaxstatus",auth, taxstatus.SaveTaxStatus);
    router.post("/deletetaxstatus",auth, taxstatus.DeleteTaxStatus);
    router.get("/taxstatusbytype/:Type",auth, taxstatus.GetTaxStatusListByType);

    app.use("/api/taxstatus", router);
};