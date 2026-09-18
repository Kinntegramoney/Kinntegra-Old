module.exports = app => {
    const upload = require("../controllers/dataupload.controller");
    const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
     router.post("/amcexcel",auth, upload.UploadAMCExcel);
     router.post("/costinflationindices",auth, upload.UploadCostInflationIndicesExcel);
     router.post("/incomecategory",auth, upload.UploadIncomeCategoryExcel);
     router.post("/annualincome",auth, upload.UploadAnnualIncomeExcel);
     router.post("/countries",auth, upload.UploadCountriesExcel);
     router.post("/states",auth, upload.UploadStatesExcel);
    //  router.post("/commercialexcel",auth, upload.UploadCommercialExcel);
    //  router.post("/commercialexcel",auth, upload.UploadCommercialExcel);
    //  router.post("/commercialexcel",auth, upload.UploadCommercialExcel);
    //  router.post("/commercialexcel",auth, upload.UploadCommercialExcel);
    //  router.post("/commercialexcel",auth, upload.UploadCommercialExcel);
    //  router.post("/commercialexcel",auth, upload.UploadCommercialExcel);
    //  router.post("/commercialexcel",auth, upload.UploadCommercialExcel);
     router.post("/commercialexcel",auth, upload.UploadCommercialExcel);
     router.get("/associatepdf", upload.AssociatePdf);

     app.use("/api/upload", router);
 };