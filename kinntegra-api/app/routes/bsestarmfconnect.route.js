module.exports = app => {
    const bseStarMFConnect = require("../controllers/bsestarmfconnect.controller");
    const auth = require("../middlewares/auth");

    var router = require("express").Router();

    router.post("/connect", bseStarMFConnect.BSEConnect);

    app.use("/api/bse", router);
};