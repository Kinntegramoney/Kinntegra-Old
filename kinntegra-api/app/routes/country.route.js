module.exports = app => {
    const country = require("../controllers/country.controller");
    const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
 
     router.get("/countrylist",auth, country.GetCountryList);
     router.get("/countrybyid/:Id",auth, country.GetCountryById);
     router.post("/savecountry",auth, country.SaveCountry);
     router.post("/deletecountry",auth, country.DeleteCountry);
 
     app.use("/api/country", router);
 };