module.exports = app => {
    const gender = require("../controllers/gender.controller");
    //    const auth = require("../middlewares/auth");

    var router = require("express").Router();

    router.get("/genderlist", gender.GetGenderist);
    app.use("/api/gender", router);
};