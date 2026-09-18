module.exports = app => {
    const selfDeclaration = require("../controllers/selfdeclaration.controller");
    // const auth = require("../middlewares/auth");

    var router = require("express").Router();

    router.get("/getselfdeclarations", selfDeclaration.GetSelfDeclarations);

    app.use("/api/selfdeclaration", router);
};