module.exports = app => {
    const mismatchCases = require("../controllers/mismatchcases.controller");
    const auth = require("../middlewares/auth");

    var router = require("express").Router();

    router.get("/getbycasecode/:CaseCode", auth, mismatchCases.GetFeedMismatchedCasesByCaseCode);
    router.get("/getassociatetag", auth, mismatchCases.GetFeedTransactionUccFolioAssociateTag);
    router.post("/updateassociatecode", auth, mismatchCases.UpdateFeedTransactionUccFolioSubBrokerCode);
    router.get("/getfamilytag", auth, mismatchCases.GetFeedTransactionUccFolioFamilyTag);
    router.get("/getnewfamilylist/:FeedId", auth, mismatchCases.GetNewFamilyList);
    router.get("/getfamilymembers/:FeedId/:ClientId", auth, mismatchCases.GetFeedTransactionUccFolioFamilyMemberList);
    router.post("/updatefamilyucc", auth, mismatchCases.UpdateFeedTransactionUccFolioFamilyTag);
    router.get("/getfoliotransfer", auth, mismatchCases.GetFeedTransactionUccFolioTransfer);
    router.get("/getfeed/:Id", auth, mismatchCases.GetFeedTransactionUccFolio);
    router.get("/gettransferaccounts/:Id", auth, mismatchCases.GetClientAccountTransfer);
    router.post("/savefoliotransfer", auth, mismatchCases.SaveClientFolioTransfer);
    router.get("/mismatchunits", auth, mismatchCases.GetFeedTransactionMismatchUnits);
    router.post("/savemultibroker", auth, mismatchCases.SaveFeedTransactionMultiBroker);

    app.use("/api/mismatchcases", router);
};