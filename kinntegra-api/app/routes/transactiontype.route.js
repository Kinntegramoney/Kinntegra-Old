module.exports = app => {
    const transactiontype = require("../controllers/transactiontype.controller");
    const auth = require("../middlewares/auth");
  
    var router = require("express").Router();
  
    router.get("/gettransactiontypelist",auth, transactiontype.GetTransactionTypeList);
    router.get("/getfeedtransactiontypelist",auth, transactiontype.GetFeedTransactionTypeList);
  
    app.use("/api/transactiontype", router);
  };