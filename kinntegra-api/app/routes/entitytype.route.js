module.exports = app => {
    const entitytype = require("../controllers/entitytype.controller");
 //    const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
 
     router.get("/entitytypelist", entitytype.GetEntityTypeList);
 
     app.use("/api/entitytype", router);
 };