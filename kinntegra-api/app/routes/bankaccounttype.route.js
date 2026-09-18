module.exports = app => {
    const bankaccounttype = require("../controllers/bankaccounttype.controller");
    const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
 
     router.get("/bankaccounttypelist",auth, bankaccounttype.GetBankAccountTypeList);
     router.get("/bankaccounttypebyid/:Id",auth, bankaccounttype.GetBankAccountTypeById);
     router.post("/savebankaccounttype",auth, bankaccounttype.SaveBankAccountType);
     router.post("/deletebankaccounttype",auth, bankaccounttype.DeleteBankAccountType);
 
     app.use("/api/bankaccounttype", router);
 };