module.exports = app => {
    const importassociate = require("../controllers/importassociate.controller");
    // const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
    // router.post("/uploadimportassociateexcel", importassociate.UploadImportAssociateExcel);
     // router.post("/uploadimportemployeeexcel", importassociate.UploadImportEmployeeExcel);
    router.post("/uploadimportassociatedocumentexcel", importassociate.UploadImportAssociateDocumentExcel);
    router.post("/uploadimportrmployeedocumentexcel", importassociate.UploadImportEmployeeDocumentExcel);
     app.use("/api/importassociate", router);
 };
