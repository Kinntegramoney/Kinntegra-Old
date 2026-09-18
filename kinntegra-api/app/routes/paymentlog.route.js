module.exports = app => {
    const paymentlog = require("../controllers/paymentlog.controller");
    const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
 
     router.get("/paymentloglist",auth, paymentlog.GetPaymentLogList);
     router.get("/paymentlogbyid/:Id",auth, paymentlog.GetPaymentLogById);
     router.post("/savepaymentlog",auth, paymentlog.SavePaymentLog);
     router.post("/deletepaymentlog",auth, paymentlog.DeletePaymentLog);
 
     app.use("/api/paymentlog", router);
 };