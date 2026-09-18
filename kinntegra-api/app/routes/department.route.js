module.exports = app => {
    const department = require("../controllers/department.controller");
    const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
 
     router.get("/departmentlist",auth, department.GetDepartmentList);
     router.get("/departmentbyid/:Id",auth, department.GetDepartmentById);
     router.post("/savedepartment",auth, department.SaveDepartment);
     router.post("/deletedepartment",auth, department.DeleteDepartment);
 
     app.use("/api/department", router);
 };