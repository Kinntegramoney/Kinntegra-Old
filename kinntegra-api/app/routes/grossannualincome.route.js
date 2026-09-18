module.exports = app => {
    const grossannualincome = require("../controllers/grossannualincome.controller");
    const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
 
     router.get("/grossannualincomelist",auth, grossannualincome.GetGrossAnnualIncomeList);
     router.get("/grossannualincomebyid/:Id",auth, grossannualincome.GetGrossAnnualIncomeById);
     router.post("/savegrossannualincome",auth, grossannualincome.SaveGrossAnnualIncome);
     router.post("/deletegrossannualincome",auth, grossannualincome.DeleteGrossAnnualIncome);
 
     app.use("/api/grossannualincome", router);
 };