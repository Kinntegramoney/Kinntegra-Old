module.exports = app => {
    const transactionmaster= require("../controllers/transactionmaster.controller");
    const auth = require("../middlewares/auth");
  
    var router = require("express").Router();

    router.get("/gettransactionmasters", auth, transactionmaster.GetTransactionMasters);
  
    app.use("/api/transactionmaster", router);
  };