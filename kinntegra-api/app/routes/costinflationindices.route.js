module.exports = app => {
    const costinflationindices = require("../controllers/costinflationindices.controller");
 //    const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
 
     router.get("/costinflationindiceslist", costinflationindices.GetCostInflationIndexlList);
     router.get("/costinflationindicesbyid/:Id", costinflationindices.GetCostInflationIndexById);
     router.post("/savecostinflationindices", costinflationindices.SaveCostInflationIndex);
     router.post("/deletecostinflationindices", costinflationindices.DeleteCostInflationIndex);
 
     app.use("/api/costinflationindices", router);
 };