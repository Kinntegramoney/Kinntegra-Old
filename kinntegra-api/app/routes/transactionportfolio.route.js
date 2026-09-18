module.exports = app => {
  const transactionportfolio = require("../controllers/transactionportfolio.controller");
  const auth = require("../middlewares/auth");

  var router = require("express").Router();

  router.post("/savetransactionportfolio", auth, transactionportfolio.SaveTransactionPortfolio);
  router.post("/savetransactionportfoliowealthequitydebt", auth, transactionportfolio.SaveTransactionPortfolioWealthEquityDebt);
  router.post("/savetransactionportfolioshortterm", auth, transactionportfolio.SaveTransactionPortfolioShortTerm);
  router.post("/savetransactionportfoliotax", auth, transactionportfolio.SaveTransactionPortfolioTax);
  router.post("/savetransactionportfoliocommodities", auth, transactionportfolio.SaveTransactionPortfolioCommodities);
  router.post("/savetransactionportfolioother", auth, transactionportfolio.SaveTransactionPortfolioOther);
  router.post("/gettransactionportfoliodatabydate", auth, transactionportfolio.GetTransactionPortfolioDataByDate);
  router.get("/gettransactionportfolios", auth, transactionportfolio.GetTransactionPortfolios);
  router.get("/getportfoliodatetype/:PortfolioTypeId/:WefDate", auth, transactionportfolio.GetTransactionPortfolioByTypeDate);
  router.get("/getportfoliodatesbytype/:PortfolioTypeId", auth, transactionportfolio.GetTransactionPortfolioDatesByType);

  app.use("/api/transactionportfolio", router);
};