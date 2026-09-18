module.exports = app => {
    const bloodgroup = require("../controllers/bloodgroup.controller");
 //    const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
 
     router.get("/bloodgrouplist", bloodgroup.GetBloodGroups);
    //  router.get("/addresstypebyid/:Id", bloodgroup.GetAddressTypeById);
    //  router.post("/saveaddresstype", bloodgroup.SaveAddressType);
    //  router.post("/deleteaddresstype", bloodgroup.DeleteAddressType);
 
     app.use("/api/bloodgroup", router);
 };