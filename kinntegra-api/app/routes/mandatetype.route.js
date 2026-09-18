module.exports = app => {
    const mandatetype = require("../controllers/mandatetype.controller");
 //    const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
 
     router.get("/mandatetypelist", mandatetype.GetMandateTypeList);
     router.get("/mandatetypebyid/:Id", mandatetype.GetMandateTypeById);
     router.post("/savemandatetype", mandatetype.SaveMandateType);
     router.post("/deletemandatetype", mandatetype.DeleteMandateType);
 
     app.use("/api/mandatetype", router);
 };