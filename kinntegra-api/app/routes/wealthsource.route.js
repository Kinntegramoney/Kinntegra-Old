module.exports = app => {
    const wealthsource = require("../controllers/wealthsource.controller");
    const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
 
     router.get("/wealthsourcelist",auth, wealthsource.GetWealthSourceList);
     router.get("/wealthsourcebyid/:Id",auth, wealthsource.GetWealthSourceById);
     router.post("/savewealthsource",auth, wealthsource.SaveWealthSource);
     router.post("/deletewealthsource",auth, wealthsource.DeleteWealthSource);
 
     app.use("/api/wealthsource", router);
 };