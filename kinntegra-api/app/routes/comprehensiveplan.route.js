module.exports = app => {
    const comprehensiveplan = require("../controllers/comprehensiveplan.controller");
    const auth = require("../middlewares/auth");

    var router = require("express").Router();

    
    
    router.post("/savecomprehensiveincome", auth, comprehensiveplan.SaveComprehensivePlanIncome);
    router.post("/savecomprehensiveplanotherincome", auth, comprehensiveplan.SaveComprehensivePlanOtherIncome);
    router.post("/savecomprehensiveplanfixedassetincome", auth, comprehensiveplan.SaveComprehensivePlanFixedAssetIncome);
    router.post("/savecomprehensiveplanwealthsustainabilityasset", auth, comprehensiveplan.SaveComprehensivePlanWealthSustainabilityAsset);
    router.post("/savecomprehensiveplanwealthcreationasset", auth, comprehensiveplan.SaveComprehensivePlanWealthCreationAsset);
    router.post("/savecomprehensiveplanhouseholdexpense", auth, comprehensiveplan.SaveComprehensivePlanHouseHoldExpense);
    router.post("/savecomprehensiveplanlifestyleexpense", auth, comprehensiveplan.SaveComprehensivePlanLifeStyleExpense);
    router.post("/savecomprehensiveplandependentexpense", auth, comprehensiveplan.SaveComprehensivePlanDependentExpense);
    router.post("/savecomprehensiveplaninsurancepremimumexpense", auth, comprehensiveplan.SaveComprehensivePlanInsurancePremimumExpense);
    router.post("/savecomprehensiveplaninsurance", auth, comprehensiveplan.SaveComprehensivePlanInsurance);
    router.post("/savecomprehensiveplangoal", auth, comprehensiveplan.SaveComprehensivePlanGoal);
    router.post("/savecomprehensiveplanliability", auth, comprehensiveplan.SaveComprehensivePlanLiability);
    router.get("/getcomprehensiveplanotherincome/:ClientId", auth, comprehensiveplan.GetComprehensivePlanOtherIncome);
    router.get("/getcomprehensiveplanincome/:ClientId", auth, comprehensiveplan.GetComprehensivePlanIncome);
    router.get("/getcomprehensiveplanfixedassetincome/:ClientId", auth, comprehensiveplan.GetComprehensivePlanFixedAssetIncome);
    router.get("/getcomprehensiveplanwealthsustainabilityasset/:ClientId", auth, comprehensiveplan.GetComprehensivePlanWealthSustainabilityAsset);
    router.get("/getcomprehensiveplanwealthcreationasset/:ClientId", auth, comprehensiveplan.GetComprehensivePlanWealthCreationAsset);
    router.get("/getcomprehensiveplanhouseholdexpense/:ClientId", auth, comprehensiveplan.GetComprehensivePlanHouseHoldExpense);
    router.get("/getcomprehensiveplanlifestyleexpense/:ClientId", auth, comprehensiveplan.GetComprehensivePlanLifeStyleExpense);
    router.get("/getcomprehensiveplandependenexpense/:ClientId", auth, comprehensiveplan.GetComprehensivePlanDependentExpense);
    router.get("/getcomprehensiveplaninsurancepremimumexpense/:ClientId", auth, comprehensiveplan.GetComprehensivePlanInsurancePremimumExpense);
    router.get("/getcomprehensiveplanliability/:ClientId", auth, comprehensiveplan.GetComprehensivePlanLiability);
    router.get("/getcomprehensiveplaninsurance/:ClientId", auth, comprehensiveplan.GetComprehensivePlanInsurance);
    router.get("/getcomprehensiveplangoal/:ClientId", auth, comprehensiveplan.GetComprehensivePlanGoal);

    app.use("/api/comprehensiveplan", router);
};