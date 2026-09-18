module.exports = app => {
    const profession = require("../controllers/profession.controller");
 //    const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
 
     router.get("/professionlist", profession.GetProfessionList);
 
     app.use("/api/profession", router);
 };