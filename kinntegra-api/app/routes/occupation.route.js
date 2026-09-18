module.exports = app => {
    const occupation = require("../controllers/occupation.controller");
    const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
 
     router.get("/occupationlist",auth, occupation.GetOccupationList);
     router.get("/occupationbyid/:Id",auth, occupation.GetOccupationById);
     router.post("/saveoccupation",auth, occupation.SaveOccupation);
     router.post("/deleteoccupation",auth, occupation.DeleteOccupation);
 
     app.use("/api/occupation", router);
 };