module.exports = app => {
    const importdata = require("../controllers/importdata.controller");

    var router = require("express").Router();

    router.get("/associate", importdata.ImportAssociate);
    router.get("/client", importdata.ImportClient);
    router.get("/state", importdata.ImportState);
    router.get("/bank", importdata.ImportBank);
    router.get("/unitledger", importdata.ImportTransactionUnitLedger);
    router.get("/datewiseunitledger", importdata.ImportDateWiseTransactionUnitLedger);
    router.get("/amficodes", importdata.ImportBSESchemeAmfi);
    router.post("/oldunitledger", importdata.ImportDailyTransactionUnitLedger);
    router.get("/updatemandatebank", importdata.ImportMandateBank);
    router.get("/uploademandate", importdata.ImportEMandate);
    router.get("/uploadsip", importdata.ImportSIP);
    router.get("/uploadexitload", importdata.ImportExitLoad);
    router.get("/uploadswp", importdata.ImportSWP);
    router.get("/uploadorderstatus", importdata.ImportBSEOrderStatusReport);
    router.get("/uploadsipcancel", importdata.ImportSIPCancel);
    router.get("/uploadsipautocancel", importdata.ImportSIPAutoCancel);
    router.get("/uploadswpcancel", importdata.ImportSWPCancel);
    router.get("/uploadswpautocancel", importdata.ImportSWPAutoCancel);
    router.get("/uploadsell", importdata.ImportBSEOrderSell);
    router.get("/camstransactiontype", importdata.ImportCamsTransactionType);
    router.get("/karvytransactiontype", importdata.ImportKarvyTransactionType);

    app.use("/api/importdata", router);
};
