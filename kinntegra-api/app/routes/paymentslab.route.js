module.exports = app => {
    const paymentslab = require("../controllers/paymentslab.controller");
    const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
 
     router.get("/paymentslablist",auth, paymentslab.GetPaymentSlabList);
     router.get("/paymentslabbyid/:Id",auth, paymentslab.GetPaymentSlabById);
     router.post("/savepaymentslab",auth, paymentslab.SavePaymentSlab);
     router.post("/deletepaymentslab",auth, paymentslab.DeletePaymentSlab);
 
     app.use("/api/paymentslab", router);
 };