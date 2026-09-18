module.exports = app => {
  const transactionportfoliotype = require("../controllers/transactionportfoliotype.controller");
  const auth = require("../middlewares/auth");

  var router = require("express").Router();

  router.get("/gettransactionportfoliotypes", auth, transactionportfoliotype.GetTransactionPortfolioTypes);
  router.get("/gettransactionportfoliotypelist", auth, transactionportfoliotype.GetTransactionPortfolioTypeList);
  router.get("/getlistbyaccount/:ClientAccountId", auth, transactionportfoliotype.GetTransactionPortfolioTypeList);
  router.post("/getselllistbyaccount", auth, transactionportfoliotype.GetTransactionPortfolioTypeSellList);

  app.use("/api/transactionportfoliotype", router);
};