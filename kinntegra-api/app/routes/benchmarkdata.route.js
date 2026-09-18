module.exports = app => {
    const benchmarkdata = require("../controllers/benchmarkdata.controller");
    const auth = require("../middlewares/auth");

    var router = require("express").Router();

    router.post("/uploadexcel", auth, benchmarkdata.UploadBenchmarkData);
    router.post("/uploadisinexcel", auth, benchmarkdata.UploadBenchmarkDataISIN);

    app.use("/api/benchmarkdata", router);
};