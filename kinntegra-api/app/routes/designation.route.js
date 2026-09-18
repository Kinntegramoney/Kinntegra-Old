module.exports = app => {
    const designation = require("../controllers/designation.controller");
    const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
 
     router.get("/designationlist",auth,designation.GetDesignationList);
     router.get("/designationbyid/:Id",auth,designation.GetDesignationById);
     router.post("/savedesignation",auth,designation.SaveDesignation);
     router.post("/deletedesignation",auth,designation.DeleteDesignation);
 
     app.use("/api/designation", router);
 };