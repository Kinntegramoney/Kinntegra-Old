module.exports = app => {
    const exportdata = require("../controllers/exportdata.controller");

    var router = require("express").Router();

    router.get("/client/:StartDate/:EndDate", exportdata.ExportClient);
    router.get("/exportclientholdings/:UCC", exportdata.ExportClientHoldings);

    app.use("/api/exportdata", router);
};
