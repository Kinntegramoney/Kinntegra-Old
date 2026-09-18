module.exports = app => {
    const profession = require("../controllers/relation.controller");
    // const auth = require("../middlewares/auth");

    var router = require("express").Router();

    router.get("/relationlist", profession.GetRelationList);
    router.get("/nomineerelationlist", profession.GetNomineeRelationList);
    router.get("/guardianrelationlist", profession.GetGuardianRelationList);

    app.use("/api/relation", router);
};