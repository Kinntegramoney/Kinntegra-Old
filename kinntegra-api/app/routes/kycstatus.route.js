module.exports = app => {
    const kycStatus = require("../controllers/kycstatus.controller");
    // const auth = require("../middlewares/auth");

    var router = require("express").Router();

    router.get("/getkycstatus", kycStatus.GetKycStatus);
    router.get("/getkycstatusbyid/:Id", kycStatus.GetKycStatusById);
    router.post("/savekycstatus", kycStatus.SaveKycStatus);
    router.post("/deletekycstatus", kycStatus.DeleteKycStatus); 

    app.use("/api/kycstatus", router);
};