module.exports = app => {
   const addresstype = require("../controllers/addresstype.controller");
   const auth = require("../middlewares/auth");

    var router = require("express").Router();

    router.get("/addresstypelist",auth, addresstype.GetAddressTypeList);
    router.get("/addresstypebyid/:Id",auth, addresstype.GetAddressTypeById);
    router.post("/saveaddresstype",auth, addresstype.SaveAddressType);
    router.post("/deleteaddresstype",auth, addresstype.DeleteAddressType);

    app.use("/api/addresstype", router);
};