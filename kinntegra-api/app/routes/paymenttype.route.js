module.exports = app => {
    const paymenttype = require("../controllers/paymenttype.controller");
    const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
 
     router.get("/paymenttypelist",auth, paymenttype.GetPaymentTypeList);
     router.get("/paymenttypebyid/:Id",auth, paymenttype.GetPaymentTypeById);
     router.post("/savepaymenttype",auth, paymenttype.SavePaymentType);
     router.post("/deletepaymenttype",auth, paymenttype.DeletePaymentType);
 
     app.use("/api/paymenttype", router);
 };