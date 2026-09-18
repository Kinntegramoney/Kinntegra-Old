module.exports = app => {
    const commercial = require("../controllers/commercial.controller");
    const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
 
     router.get("/commerciallist",auth,  commercial.GetCommercialList);
     router.get("/commercialbyid/:Id",auth,  commercial.GetCommercialById);
     router.post("/savecommercial",auth,  commercial.SaveCommercial);
     router.post("/deletecommercial",auth,  commercial.DeleteCommercial);
 
     app.use("/api/commercial", router);
 };