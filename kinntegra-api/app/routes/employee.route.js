module.exports = app => {
    const employee = require("../controllers/employee.controller");
    const auth = require("../middlewares/auth");

    var router = require("express").Router();

    router.get("/employeelist", auth, employee.GetEmployeeList);

    router.post("/saveemployee", auth, employee.SaveEmployee);
    router.post("/saveemployeedetails", auth, employee.SaveEmployeeDetails);
    router.post("/saveemployeephotodetails", auth, employee.SaveEmployeePhotoDetails);
    router.post("/saveemployeeaddressdetails", auth, employee.SaveEmployeeAddressDetails);
    router.post("/saveemployeebankdetails", auth, employee.SaveEmployeeBankDetails);
    router.post("/saveemployeecertificatedetails", auth, employee.SaveEmployeeCertificateDetails);
    router.post("/saveemployeeuploaddetails", auth, employee.SaveEmployeeUploadDetails);
    router.post("/saveemployeetermsconditios", auth, employee.SaveEmployeeTermsConditions);
    router.post("/saveemployeerejection", auth, employee.SaveEmployeeRejection);
    router.get("/getemployeebyassociate/:AssociateId", auth, employee.GetEmployeeByAssociate);
    router.get("/getemployeebyassociate/:AssociateId/:DesignationId", auth, employee.GetSuperviseByAssociateByDesignation);
    router.get("/getemployeegeneralinfobyid/:EmployeeId", auth, employee.GetEmployeeGeneralInfoById);
    router.get("/getemployeedetailsbyid/:EmployeeId", auth, employee.GetEmployeeDetailsById);
    router.get("/getemployeephotoiddetailsbyid/:EmployeeId", auth, employee.GetEmployeePhotoIdDetailsById);
    router.get("/getemployeeaddressdetailsbyid/:EmployeeId", auth, employee.GetEmployeeAddressDetailsById);
    router.get("/getemployeebankdetailsbyid/:EmployeeId", auth, employee.GetEmployeeBankDetailsById);
    router.get("/getemployeecertificatedetailsbyid/:EmployeeId", auth, employee.GetEmployeeCertificateDetailsById);
    router.get("/getemployeeuploaddetailsbyid/:EmployeeId", auth, employee.GetEmployeeUploadDetailsById);
    router.get("/gettermscondtionbyemployee", auth, employee.GetTermsCondtionByEmployee);
    router.get("/getmenuoptions/:EmployeeId", auth, employee.GetMenuOptions);
    router.get("/getemployeeviewlogbyid/:EmployeeId", auth, employee.GetEmployeeViewLogById);
    router.get("/getnotification", auth, employee.GetNotification);
    router.get("/getemployeeexceldata", auth, employee.GetEmployeeExcelData);
    router.get("/getdocument/:EmployeeId/:Name/:FileName", auth, employee.GetEmployeeDocument);
    router.post("/saveemployeerights", auth, employee.SaveEmployeeRights);
    router.post("/sendnotificationsupervisor", auth, employee.SendNotificationSupervisor);
    router.post("/sendselfnotificationsupervisor", auth, employee.SendSelfNotificationSupervisor);
    router.post("/sendselfrejectionnotification", auth, employee.SendSelfRejectedNotification);
    router.post("/sendemployeeresetpasswordlink", auth, employee.SendEmployeeResetPasswordLink);
    router.post("/sendemployeeresendverificationemail", auth, employee.SendEmployeeResendVerificationEmail);
    router.post("/updatesupervisorverification", auth, employee.UpdateAdminVerification);
    router.get("/getemployeeprogress/:Id", auth, employee.GetEmployeeProgress);

    app.use("/api/employee", router);
};