module.exports = app => {
    const state = require("../controllers/state.controller");
    const auth = require("../middlewares/auth");
  
    var router = require("express").Router();
  
    router.get("/statelist",auth, state.GetStateList);
    router.get("/statebyid/:Id",auth, state.GetStateById);
    router.post("/savestate",auth, state.SaveState);
    router.post("/deletestate",auth, state.DeleteState);
    router.get("/getstatebycountry/:CountryId",auth, state.GetStateByCountry);
  
    app.use("/api/state", router);
  };