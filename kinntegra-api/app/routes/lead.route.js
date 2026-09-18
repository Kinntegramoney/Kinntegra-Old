module.exports = app => {
  const lead = require("../controllers/lead.controller");
  const auth = require("../middlewares/auth");

  var router = require("express").Router();

  router.get("/leadlist", auth, lead.GetLeadList);
  router.get("/leadintroductionlist", auth, lead.GetLeadIntroductionList);
  router.get("/leadcomprehensivelist", auth, lead.GetLeadComprehensiveList);
  router.get("/leadaccountlist", auth, lead.GetLeadAccountList);
  router.get("/leadbyid/:Id", auth, lead.GetLeadById);
  router.post("/savelead", auth, lead.SaveLead);
  router.post("/deletelead", auth, lead.DeleteLead);

  app.use("/api/lead", router);
};