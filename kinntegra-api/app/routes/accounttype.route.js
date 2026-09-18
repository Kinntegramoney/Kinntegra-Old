module.exports = app => {
    const accountType = require("../controllers/accounttype.controller");
       const auth = require("../middlewares/auth");

    var router = require("express").Router();

    router.get("/accounttypelist",auth, accountType.GetAccountTypeList);

    app.use("/api/accounttype", router);
};