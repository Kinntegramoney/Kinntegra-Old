module.exports = app => {
    const otherincomecategory = require("../controllers/otherincomecategory.controller");
    const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
 
     router.get("/incomecategorylist",auth, otherincomecategory.GetIncomeCategoryList);
     router.get("/incomecategorybyid/:Id",auth, otherincomecategory.GetIncomeCategoryById);
     router.post("/saveincomecategory",auth, otherincomecategory.SaveIncomeCategory);
     router.post("/deleteincomecategory",auth, otherincomecategory.DeleteIncomeCategory);
 
     app.use("/api/incomecategory", router);
 };