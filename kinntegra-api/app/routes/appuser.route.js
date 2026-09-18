module.exports = app => {
    const appUser = require("../controllers/appuser.controller");
    const auth = require("../middlewares/auth");

    var router = require("express").Router();

    router.post("/authenticateuser", appUser.AuthenticateAppUser);
    router.post("/authenticateuserpin", appUser.AuthenticateAppUserPin);
    router.get("/getuserlist", appUser.GetAppUsers);
    router.post("/validateassociate", appUser.AuthenticateAppUserAssociate);
    router.post("/validateemployee", appUser.AuthenticateAppUserEmployee);
    router.post("/validateclient", appUser.AuthenticateAppUserClient);
    router.post("/sendpasswordrequest", appUser.SendForgotPasswordRequest);
    router.post("/sendclientpasswordrequest", auth, appUser.SendClientForgotPasswordRequest);
    router.post("/resetcredentials", appUser.ResetPassword);
    router.get("/getmenuoptions/:AppUserId/:AppUserType", auth, appUser.GetAppUserMenuOptions);
    router.post("/validatetransactionclient", appUser.AuthenticateTransactionAppUserClient);
    router.post("/resetclienttransactioncredentials", appUser.ResetClientTransactionPassword);

    app.use("/api/appuser", router);
};