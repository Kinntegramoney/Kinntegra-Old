module.exports = app => {
    const expectedreturn = require("../controllers/expectedreturn.controller");
     const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
 
     router.post("/saveexpectedreturn",auth, expectedreturn.SaveExpectedReturn);
     router.get("/getexpectedreturn",auth, expectedreturn.GetExpectedReturn);
 
     app.use("/api/expectedreturn", router);
 };