module.exports = app => {
    const subdepartment = require("../controllers/subdepartment.controller");
    const auth = require("../middlewares/auth");
 
     var router = require("express").Router();
 
     router.get("/subdepartmentlist",auth, subdepartment.GetSubDepartmentList);
     router.get("/subdepartmentbyid/:Id",auth, subdepartment.GetSubDepartmentById);
      router.get("/subdepartmentbydepartmentid/:departmentId",auth, subdepartment.GetSubDepartmentByDepartmentId);
   //  router.post("/subdepartmentbydepartmentid",auth, subdepartment.GetSubDepartmentByDepartmentId);
     router.post("/savesubdepartment",auth, subdepartment.SaveSubDepartment);
     router.post("/deletesubdepartment",auth, subdepartment.DeleteSubDepartment);
 
     app.use("/api/subdepartment", router);
 };