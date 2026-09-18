module.exports = app => {
    const termsconditions = require("../controllers/termsconditions.controller");
       const auth = require("../middlewares/auth");

    var router = require("express").Router();

    router.get("/getrermsconditionslist",auth, termsconditions.GetTermsConditionsList);
    router.get("/getrermsconditionsbyid/:Id",auth, termsconditions.GetTermsConditionsById);
    router.post("/savetermsconditions",auth, termsconditions.SaveTermsConditions);
    app.use("/api/termsconditions", router);
};