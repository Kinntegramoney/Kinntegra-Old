module.exports = app => {
    const transactionplan = require("../controllers/transactionplan.controller");
    const auth = require("../middlewares/auth");
  
    var router = require("express").Router();
  
    router.get("/gettransactionplanbytransactiontypename/:Type",auth, transactionplan.GetTransactionPlanByTransactionTypeName);
    router.get("/gettransactionplans",auth, transactionplan.GetTransactionPlanList);

    app.use("/api/transactionplan", router);
  };


