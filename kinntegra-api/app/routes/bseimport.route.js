module.exports = app => {
    const bseimport = require("../controllers/bseimport.controller");
    const auth = require("../middlewares/auth");

    var router = require("express").Router();

    router.post("/uploadschemeexcel", bseimport.UploadSchemeExcel);
    router.post("/uploadsipschemeexcel", bseimport.UploadSIPSchemeExcel);
    router.post("/uploadsWpschemeexcel", bseimport.UploadSWPSchemeExcel);
    router.post("/uploadstpschemeexcel", bseimport.UploadSTPSchemeExcel);
    router.post("/uploadholidayexcel", bseimport.UploadHolidayExcel);

    app.use("/api/bseimport", router);
};