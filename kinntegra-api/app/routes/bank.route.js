module.exports = app => {
    const bank = require("../controllers/bank.controller");
    const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
 
     router.get("/banklist",auth, bank.GetBankList);
     router.get("/bankbyid/:Id",auth, bank.GetBankById);
     router.get("/bankbyifsc/:Ifsc",auth, bank.GetBankByIfsc);
     router.post("/savebank",auth, bank.SaveBank);
     router.post("/deletebank",auth, bank.DeleteBank);
     router.post("/uploadexcel", bank.UploadExcel);

 
     app.use("/api/bank", router);
 };