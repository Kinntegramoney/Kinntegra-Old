module.exports = app => {
    const amc = require("../controllers/amctype.controller");
    const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
 
     router.get("/getamctypelist",auth, amc.GetAmcList);
     router.get("/getamctypebyid/:Id",auth, amc.GetAmcById);
     router.post("/saveamctype",auth, amc.SaveAmc);
     router.post("/deleteamctype",auth, amc.DeleteAmc);
 
     app.use("/api/amctype", router);
 };