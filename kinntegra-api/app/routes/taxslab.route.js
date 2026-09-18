module.exports = app => {
    const taxslab = require("../controllers/taxslab.controller");
       const auth = require("../middlewares/auth");

    var router = require("express").Router();

    router.get("/taxslablist",auth, taxslab.GetTaxSlabList);
    router.get("/taxslabbyid/:Id",auth, taxslab.GetTaxSlabById);
    router.post("/savetaxslab",auth, taxslab.SaveTaxSlab);
    router.post("/deletetaxslab",auth, taxslab.DeleteTaxSlab);
    router.get("/taxslabbytype/:Type",auth, taxslab.GetTaxSlabListByType);

    app.use("/api/taxslab", router);
};