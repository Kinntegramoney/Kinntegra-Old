module.exports = app => {
    const employeefilter = require("../controllers/employeefilter.controller");
        const auth = require("../middlewares/auth");

    var router = require("express").Router();

    router.get("/getemployeefilterstates", auth, employeefilter.GetEmployeeFilterStates);
    router.get("/getemployeefiltercities", auth, employeefilter.GetEmployeeFilterCities);
    router.get("/getemployeefilterassociate", auth, employeefilter.GetEmployeeFilterAssociate);
    router.get("/getemployeefilterdepartment", auth, employeefilter.GetEmployeeFilterDepartment);
    router.get("/getemployeefiltergrade", auth, employeefilter.GetEmployeeFilterGrade);
    router.get("/getemployeefilteremployeename", auth, employeefilter.GetEmployeeFilterEmployeeName);
    router.get("/getemployeefilterstatus", auth, employeefilter.GetEmployeeFilterStatus);

    app.use("/api/employeefilter", router);
};