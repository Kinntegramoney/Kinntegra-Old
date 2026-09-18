const fileSystem = require("fs");
const path = require("path");
const excel = require("excel4node");
const luxon = require('luxon');
const commonFunction = require("../models/commonfunction.model");

const ExcelEngine = function () { };


ExcelEngine.CreateEmployeeReport = async (data, fileName, reportType) => {
    var workbook = new excel.Workbook();

    var worksheet = workbook.addWorksheet("Sheet 1");

    var headerStyle = workbook.createStyle({
        font: {
            color: "#000000",
            size: 16,
            bold: true,
        },
        alignment: {
            horizontal: ["center"],
        },
        // numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    var captionStyle = workbook.createStyle({
        font: {
            color: "#000000",
            size: 12,
            bold: true,
        },
        // numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    var captionCenterAlignStyle = workbook.createStyle({
        alignment: { horizontal: "center" },
        font: {
            color: "#000000",
            size: 12,
            bold: true,
        },
        // numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    var dataStyle = workbook.createStyle({
        font: {
            color: "#000000",
            size: 10,
        },
        // numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    var tableHeaderStyle = workbook.createStyle({
        font: {
            color: "#000000",
            size: 12,
            bold: true,
        },
        border: {
            left: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            right: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            top: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            bottom: {
                style: ["thin"],
                color: "#C4C4C4",
            },
        },
        // numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    var tableDataStyle = workbook.createStyle({
        font: {
            color: "#000000",
            size: 10,
        },
        border: {
            left: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            right: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            top: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            bottom: {
                style: ["thin"],
                color: "#C4C4C4",
            },
        },
        // numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    var tableDataRightAlignStyle = workbook.createStyle({
        alignment: { horizontal: 'right' },
        font: {
            color: "#000000",
            size: 10,
        },
        border: {
            left: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            right: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            top: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            bottom: {
                style: ["thin"],
                color: "#C4C4C4",
            },
        },
        // numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    var tableFooterStyle = workbook.createStyle({
        font: {
            color: "#000000",
            size: 12,
            bold: true,
        },
        border: {
            left: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            right: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            top: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            bottom: {
                style: ["thin"],
                color: "#C4C4C4",
            },
        },
        // numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    var tableFooterRightAlignStyle = workbook.createStyle({
        alignment: { horizontal: 'right' },
        font: {
            color: "#000000",
            size: 12,
            bold: true,
        },
        border: {
            left: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            right: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            top: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            bottom: {
                style: ["thin"],
                color: "#C4C4C4",
            },
        },
        // numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    worksheet.cell(1, 1, 1, 46, true).string("Employee").style(headerStyle);
    worksheet.cell(2, 1).string("Associate Name").style(tableHeaderStyle);
    worksheet.cell(2, 2).string("Employee Name").style(tableHeaderStyle);
    worksheet.cell(2, 3).string("Department Name").style(tableHeaderStyle);
    worksheet.cell(2, 4).string("SubDepartment Name").style(tableHeaderStyle);
    worksheet.cell(2, 5).string("Grade").style(tableHeaderStyle);
    worksheet.cell(2, 6).string("Supervisor Name").style(tableHeaderStyle);
    worksheet.cell(2, 7).string("Mobile Number").style(tableHeaderStyle);
    worksheet.cell(2, 8).string("Telephone Number").style(tableHeaderStyle);
    worksheet.cell(2, 9).string("Email").style(tableHeaderStyle);
    worksheet.cell(2, 10).string("Blood Group Name").style(tableHeaderStyle);
    worksheet.cell(2, 11).string("Health Issues").style(tableHeaderStyle);
    worksheet.cell(2, 12).string("Emergency Contact Name1").style(tableHeaderStyle);
    worksheet.cell(2, 13).string("Emergency Mobile Number1").style(tableHeaderStyle);
    worksheet.cell(2, 14).string("Emergency Email1").style(tableHeaderStyle);
    worksheet.cell(2, 15).string("Emergency Contact Name2").style(tableHeaderStyle);
    worksheet.cell(2, 16).string("Emergency Email2").style(tableHeaderStyle);
    worksheet.cell(2, 17).string("PAN Card Number").style(tableHeaderStyle);
    worksheet.cell(2, 18).string("Aadhar Card Number").style(tableHeaderStyle);
    worksheet.cell(2, 19).string("Date Of Birth").style(tableHeaderStyle);
    worksheet.cell(2, 20).string("Date Of Anniversary").style(tableHeaderStyle);
    worksheet.cell(2, 21).string("Correspondence Address1").style(tableHeaderStyle);
    worksheet.cell(2, 22).string("Correspondence Address2").style(tableHeaderStyle);
    worksheet.cell(2, 23).string("Correspondence Address3").style(tableHeaderStyle);
    worksheet.cell(2, 24).string("Correspondence city Name").style(tableHeaderStyle);
    worksheet.cell(2, 25).string("Correspondence Country Name").style(tableHeaderStyle);
    worksheet.cell(2, 26).string("Correspondence State Name").style(tableHeaderStyle);
    worksheet.cell(2, 27).string("Correspondence PinCode").style(tableHeaderStyle);
    worksheet.cell(2, 28).string("IFSC Code").style(tableHeaderStyle);
    worksheet.cell(2, 29).string("Bank Name").style(tableHeaderStyle);
    worksheet.cell(2, 30).string("Branch Name:").style(tableHeaderStyle);
    worksheet.cell(2, 31).string("MICR Code").style(tableHeaderStyle);
    worksheet.cell(2, 32).string("Bank Account Type Name").style(tableHeaderStyle);
    worksheet.cell(2, 33).string("Account Number").style(tableHeaderStyle);
    worksheet.cell(2, 34).string("NismVa Number").style(tableHeaderStyle);
    worksheet.cell(2, 35).string("NismVa ValidDate").style(tableHeaderStyle);
    worksheet.cell(2, 36).string("EUIN Holder Name").style(tableHeaderStyle);
    worksheet.cell(2, 37).string("EUIN").style(tableHeaderStyle);
    worksheet.cell(2, 38).string("EUIN ValidDate").style(tableHeaderStyle);
    worksheet.cell(2, 39).string("CA Number").style(tableHeaderStyle);
    worksheet.cell(2, 40).string("CA ValidDate").style(tableHeaderStyle);
    worksheet.cell(2, 41).string("CS Number").style(tableHeaderStyle);
    worksheet.cell(2, 42).string("CS ValidDate").style(tableHeaderStyle);
    worksheet.cell(2, 43).string("Degree Name").style(tableHeaderStyle);
    worksheet.cell(2, 44).string("Degree Number").style(tableHeaderStyle);
    worksheet.cell(2, 45).string("Degree ValidDate").style(tableHeaderStyle);
    worksheet.cell(2, 46).string("Certification Type").style(tableHeaderStyle);


    let cellRow = 2;

    for (let i = 0; i < data.EmployeeExcelReportData.length; i++) {
        cellRow += 1;

        let item = data.EmployeeExcelReportData[i];

        worksheet.cell(cellRow, 1).string(item.AssociateName).style(tableDataStyle);
        worksheet.cell(cellRow, 2).string(item.EmployeeName).style(tableDataStyle);
        worksheet.cell(cellRow, 3).string(item.DepartmentName).style(tableDataStyle);
        worksheet.cell(cellRow, 4).string(item.SubDepartmentName).style(tableDataStyle);
        worksheet.cell(cellRow, 5).string(item.Grade).style(tableDataStyle);
        worksheet.cell(cellRow, 6).string(item.SupervisorName).style(tableDataStyle);
        worksheet.cell(cellRow, 7).string(item.MobileNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 8).string(item.TelephoneNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 9).string(item.Email).style(tableDataStyle);
        worksheet.cell(cellRow, 10).string(item.BloodGroupName).style(tableDataStyle);
        worksheet.cell(cellRow, 11).string(item.HealthIssues).style(tableDataStyle);
        worksheet.cell(cellRow, 12).string(item.EmergencyContactName1).style(tableDataStyle);
        worksheet.cell(cellRow, 13).string(item.EmergencyMobileNumber1).style(tableDataStyle);
        worksheet.cell(cellRow, 14).string(item.EmergencyEmail1).style(tableDataStyle);
        worksheet.cell(cellRow, 15).string(item.EmergencyContactName2).style(tableDataStyle);
        worksheet.cell(cellRow, 16).string(item.EmergencyEmail2).style(tableDataStyle);
        worksheet.cell(cellRow, 17).string(item.PANCardNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 18).string(item.AadharCardNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 19).string(item.DateOfBirth).style(tableDataStyle);
        worksheet.cell(cellRow, 20).string(item.DateOfAnniversary).style(tableDataStyle);
        worksheet.cell(cellRow, 21).string(item.CAddress1).style(tableDataStyle);
        worksheet.cell(cellRow, 22).string(item.CAddress2).style(tableDataStyle);
        worksheet.cell(cellRow, 23).string(item.CAddress3).style(tableDataStyle);
        worksheet.cell(cellRow, 24).string(item.CityName).style(tableDataStyle);
        worksheet.cell(cellRow, 25).string(item.CountryName).style(tableDataStyle);
        worksheet.cell(cellRow, 26).string(item.StateName).style(tableDataStyle);
        worksheet.cell(cellRow, 27).string(item.CPinCode).style(tableDataStyle);
        worksheet.cell(cellRow, 28).string(item.IFSC).style(tableDataStyle);
        worksheet.cell(cellRow, 29).string(item.BankName).style(tableDataStyle);
        worksheet.cell(cellRow, 30).string(item.Branch).style(tableDataStyle);
        worksheet.cell(cellRow, 31).string(item.MICR).style(tableDataStyle);
        worksheet.cell(cellRow, 32).string(item.BankAccountTypeName).style(tableDataStyle);
        worksheet.cell(cellRow, 33).string(item.AccountNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 34).string(item.NismVaNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 35).string(item.NismVaValidDate).style(tableDataStyle);
        worksheet.cell(cellRow, 36).string(item.EUINHolderName).style(tableDataStyle);
        worksheet.cell(cellRow, 37).string(item.EUIN).style(tableDataStyle);
        worksheet.cell(cellRow, 38).string(item.EUINValidDate).style(tableDataStyle);
        worksheet.cell(cellRow, 39).string(item.CANumber).style(tableDataStyle);
        worksheet.cell(cellRow, 40).string(item.CAValidDate).style(tableDataStyle);
        worksheet.cell(cellRow, 41).string(item.CSNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 42).string(item.CSValidDate).style(tableDataStyle);
        worksheet.cell(cellRow, 43).string(item.DegreeNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 44).string(item.DegreeNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 45).string(item.DegreeValidDate).style(tableDataStyle);
        worksheet.cell(cellRow, 46).string(item.CertificationType).style(tableDataStyle);
    }

    worksheet.column(1).setWidth(25);
    worksheet.column(2).setWidth(25);
    worksheet.column(3).setWidth(25);
    worksheet.column(4).setWidth(25);
    worksheet.column(5).setWidth(25);
    worksheet.column(6).setWidth(25);
    worksheet.column(7).setWidth(25);
    worksheet.column(8).setWidth(25);
    worksheet.column(9).setWidth(25);
    worksheet.column(10).setWidth(25);
    worksheet.column(11).setWidth(25);
    worksheet.column(12).setWidth(25);
    worksheet.column(13).setWidth(25);
    worksheet.column(14).setWidth(25);
    worksheet.column(15).setWidth(25);
    worksheet.column(16).setWidth(25);
    worksheet.column(17).setWidth(25);
    worksheet.column(18).setWidth(25);
    worksheet.column(19).setWidth(25);
    worksheet.column(20).setWidth(25);
    worksheet.column(21).setWidth(25);
    worksheet.column(22).setWidth(25);
    worksheet.column(23).setWidth(25);
    worksheet.column(24).setWidth(25);
    worksheet.column(25).setWidth(28);
    worksheet.column(26).setWidth(25);
    worksheet.column(27).setWidth(25);
    worksheet.column(28).setWidth(25);
    worksheet.column(29).setWidth(30);
    worksheet.column(30).setWidth(25);
    worksheet.column(31).setWidth(25);
    worksheet.column(32).setWidth(25);
    worksheet.column(33).setWidth(25);
    worksheet.column(34).setWidth(25);
    worksheet.column(35).setWidth(25);
    worksheet.column(36).setWidth(25);
    worksheet.column(37).setWidth(25);
    worksheet.column(38).setWidth(25);
    worksheet.column(39).setWidth(25);
    worksheet.column(40).setWidth(25);
    worksheet.column(41).setWidth(25);
    worksheet.column(42).setWidth(25);
    worksheet.column(43).setWidth(25);
    worksheet.column(44).setWidth(25);
    worksheet.column(45).setWidth(25);
    worksheet.column(46).setWidth(25);




    const excelFilePath = path.join(
        __dirname.replace("app", "public"),
        "..",
        "documents",
        reportType,
        fileName
    );

    await workbook.write(excelFilePath);

    return excelFilePath;



};

ExcelEngine.CreateAssociateReport = async (data, fileName, reportType) => {
    var workbook = new excel.Workbook();

    var worksheet = workbook.addWorksheet("Associate");

    var headerStyle = workbook.createStyle({
        font: {
            color: "#000000",
            size: 16,
            bold: true,
        },
        alignment: {
            horizontal: ["center"],
        },
        // numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    var captionStyle = workbook.createStyle({
        font: {
            color: "#000000",
            size: 12,
            bold: true,
        },
        // numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    var captionCenterAlignStyle = workbook.createStyle({
        alignment: { horizontal: "center" },
        font: {
            color: "#000000",
            size: 12,
            bold: true,
        },
        // numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    var dataStyle = workbook.createStyle({
        font: {
            color: "#000000",
            size: 10,
        },
        // numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    var tableHeaderStyle = workbook.createStyle({
        font: {
            color: "#000000",
            size: 12,
            bold: true,
        },
        border: {
            left: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            right: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            top: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            bottom: {
                style: ["thin"],
                color: "#C4C4C4",
            },
        },
        // numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    var tableDataStyle = workbook.createStyle({
        font: {
            color: "#000000",
            size: 10,
        },
        border: {
            left: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            right: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            top: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            bottom: {
                style: ["thin"],
                color: "#C4C4C4",
            },
        },
        // numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    var tableDataRightAlignStyle = workbook.createStyle({
        alignment: { horizontal: 'right' },
        font: {
            color: "#000000",
            size: 10,
        },
        border: {
            left: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            right: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            top: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            bottom: {
                style: ["thin"],
                color: "#C4C4C4",
            },
        },
        // numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    var tableFooterStyle = workbook.createStyle({
        font: {
            color: "#000000",
            size: 12,
            bold: true,
        },
        border: {
            left: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            right: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            top: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            bottom: {
                style: ["thin"],
                color: "#C4C4C4",
            },
        },
        // numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    var tableFooterRightAlignStyle = workbook.createStyle({
        alignment: { horizontal: 'right' },
        font: {
            color: "#000000",
            size: 12,
            bold: true,
        },
        border: {
            left: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            right: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            top: {
                style: ["thin"],
                color: "#C4C4C4",
            },
            bottom: {
                style: ["thin"],
                color: "#C4C4C4",
            },
        },
        // numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    worksheet.cell(1, 1, 1, 101, true).string("Associate").style(headerStyle);
    worksheet.cell(2, 1).string("Associate Name").style(tableHeaderStyle);
    worksheet.cell(2, 2).string("Employee Name").style(tableHeaderStyle);
    worksheet.cell(2, 3).string("Profession").style(tableHeaderStyle);
    worksheet.cell(2, 4).string("Entity Name").style(tableHeaderStyle);
    worksheet.cell(2, 5).string("Authorised Person1").style(tableHeaderStyle);
    worksheet.cell(2, 6).string("Email1").style(tableHeaderStyle);
    worksheet.cell(2, 7).string("Mobile1").style(tableHeaderStyle);
    worksheet.cell(2, 8).string("PAN1").style(tableHeaderStyle);
    worksheet.cell(2, 9).string("Authorised Person2").style(tableHeaderStyle);
    worksheet.cell(2, 10).string("Email2").style(tableHeaderStyle);
    worksheet.cell(2, 11).string("Mobile2").style(tableHeaderStyle);
    worksheet.cell(2, 12).string("PAN2").style(tableHeaderStyle);
    worksheet.cell(2, 13).string("AuthorisedPerson3").style(tableHeaderStyle);
    worksheet.cell(2, 14).string("Email3").style(tableHeaderStyle);
    worksheet.cell(2, 15).string("Mobile3").style(tableHeaderStyle);
    worksheet.cell(2, 16).string("PAN3").style(tableHeaderStyle);
    worksheet.cell(2, 17).string("PAN Card Number").style(tableHeaderStyle);
    worksheet.cell(2, 18).string("Aadhar Card Number").style(tableHeaderStyle);
    worksheet.cell(2, 19).string("Date Of Birth").style(tableHeaderStyle);
    worksheet.cell(2, 20).string("Date Of Incorporation").style(tableHeaderStyle);
    worksheet.cell(2, 21).string("GSTIN").style(tableHeaderStyle);
    worksheet.cell(2, 22).string("GSTIN Valid Date").style(tableHeaderStyle);
    worksheet.cell(2, 23).string("Shop Certificate Valid Date").style(tableHeaderStyle);
    worksheet.cell(2, 24).string("TAN").style(tableHeaderStyle);
    worksheet.cell(2, 25).string("Primary Color").style(tableHeaderStyle);
    worksheet.cell(2, 26).string("Secondary Color").style(tableHeaderStyle);
    worksheet.cell(2, 27).string("ARN Holder Name").style(tableHeaderStyle);
    worksheet.cell(2, 28).string("ARN").style(tableHeaderStyle);
    worksheet.cell(2, 29).string("ARN Valid Date").style(tableHeaderStyle);
    worksheet.cell(2, 30).string("EUIN Holder Name").style(tableHeaderStyle);
    worksheet.cell(2, 31).string("EUIN").style(tableHeaderStyle);
    worksheet.cell(2, 32).string("EUIN Valid Date").style(tableHeaderStyle);
    worksheet.cell(2, 33).string("RIA Name").style(tableHeaderStyle);
    worksheet.cell(2, 34).string("RIA Number").style(tableHeaderStyle);
    worksheet.cell(2, 35).string("RIA Valid Date").style(tableHeaderStyle);
    worksheet.cell(2, 36).string("Associate Code").style(tableHeaderStyle);
    worksheet.cell(2, 37).string("BSE Password").style(tableHeaderStyle);
    worksheet.cell(2, 38).string("Address1").style(tableHeaderStyle);
    worksheet.cell(2, 39).string("Address2").style(tableHeaderStyle);
    worksheet.cell(2, 40).string("Address3").style(tableHeaderStyle);
    worksheet.cell(2, 41).string("City").style(tableHeaderStyle);
    worksheet.cell(2, 42).string("State").style(tableHeaderStyle);
    worksheet.cell(2, 43).string("Country").style(tableHeaderStyle);
    worksheet.cell(2, 44).string("PinCode").style(tableHeaderStyle);
    worksheet.cell(2, 45).string("Mobile Number").style(tableHeaderStyle);
    worksheet.cell(2, 46).string("Telephone Number").style(tableHeaderStyle);
    worksheet.cell(2, 47).string("Email").style(tableHeaderStyle);
    worksheet.cell(2, 48).string("Entity Type").style(tableHeaderStyle);
    worksheet.cell(2, 49).string("Nominee Name").style(tableHeaderStyle);
    worksheet.cell(2, 50).string("Nominee Date Of Birth").style(tableHeaderStyle);
    worksheet.cell(2, 51).string("Nominee Address1").style(tableHeaderStyle);
    worksheet.cell(2, 52).string("Nominee Address2").style(tableHeaderStyle);
    worksheet.cell(2, 53).string("Nominee Address3").style(tableHeaderStyle);
    worksheet.cell(2, 54).string("Nominee City").style(tableHeaderStyle);
    worksheet.cell(2, 55).string("Nominee State").style(tableHeaderStyle);
    worksheet.cell(2, 56).string("Nominee Country").style(tableHeaderStyle);
    worksheet.cell(2, 57).string("Nominee PinCode").style(tableHeaderStyle);
    worksheet.cell(2, 58).string("Nominee Mobile Number").style(tableHeaderStyle);
    worksheet.cell(2, 59).string("Nominee Email").style(tableHeaderStyle);
    worksheet.cell(2, 60).string("Gaurdian Name").style(tableHeaderStyle);
    worksheet.cell(2, 61).string("Guardian Relation").style(tableHeaderStyle);
    worksheet.cell(2, 62).string("Gaurdian Address1").style(tableHeaderStyle);
    worksheet.cell(2, 63).string("Gaurdian Address2").style(tableHeaderStyle);
    worksheet.cell(2, 64).string("Gaurdian Address3").style(tableHeaderStyle);
    worksheet.cell(2, 65).string("Gaurdian City").style(tableHeaderStyle);
    worksheet.cell(2, 66).string("Gaurdian State").style(tableHeaderStyle);
    worksheet.cell(2, 67).string("Gaurdian Country").style(tableHeaderStyle);
    worksheet.cell(2, 68).string("Gaurdian PinCode").style(tableHeaderStyle);
    worksheet.cell(2, 69).string("Gaurdian Mobile Number").style(tableHeaderStyle);
    worksheet.cell(2, 70).string("Gaurdian Email").style(tableHeaderStyle);
    worksheet.cell(2, 71).string("Certification Type").style(tableHeaderStyle);
    worksheet.cell(2, 72).string("Nism VA Number").style(tableHeaderStyle);
    worksheet.cell(2, 73).string("Nism VA Valid Date").style(tableHeaderStyle);
    worksheet.cell(2, 74).string("GSTIN Valid Date").style(tableHeaderStyle);
    worksheet.cell(2, 75).string("Nism XA Number").style(tableHeaderStyle);
    worksheet.cell(2, 76).string("Nism XA Valid Date").style(tableHeaderStyle);
    worksheet.cell(2, 77).string("Nism XB Number").style(tableHeaderStyle);
    worksheet.cell(2, 78).string("Nism XB Valid Date").style(tableHeaderStyle);
    worksheet.cell(2, 79).string("CFP Number").style(tableHeaderStyle);
    worksheet.cell(2, 80).string("CFP Valid Date").style(tableHeaderStyle);
    worksheet.cell(2, 81).string("CWM Number").style(tableHeaderStyle);
    worksheet.cell(2, 82).string("CWM Valid Date").style(tableHeaderStyle);
    worksheet.cell(2, 83).string("CA Number").style(tableHeaderStyle);
    worksheet.cell(2, 84).string("CA Valid Date").style(tableHeaderStyle);
    worksheet.cell(2, 85).string("CS Number").style(tableHeaderStyle);
    worksheet.cell(2, 86).string("CS Valid Date").style(tableHeaderStyle);
    worksheet.cell(2, 88).string("Course Name").style(tableHeaderStyle);
    worksheet.cell(2, 87).string("Course Number").style(tableHeaderStyle);
    worksheet.cell(2, 89).string("Course Valid Date").style(tableHeaderStyle);
    worksheet.cell(2, 90).string("IFSC").style(tableHeaderStyle);
    worksheet.cell(2, 91).string("BankName").style(tableHeaderStyle);
    worksheet.cell(2, 92).string("Branch").style(tableHeaderStyle);
    worksheet.cell(2, 93).string("MICR").style(tableHeaderStyle);
    worksheet.cell(2, 94).string("Bank Account Type").style(tableHeaderStyle);
    worksheet.cell(2, 95).string("Account Number").style(tableHeaderStyle);
    worksheet.cell(2, 96).string("RIA IFSC").style(tableHeaderStyle);
    worksheet.cell(2, 97).string("RIA Bank Name").style(tableHeaderStyle);
    worksheet.cell(2, 98).string("RIA Branch").style(tableHeaderStyle);
    worksheet.cell(2, 99).string("RIA MICR").style(tableHeaderStyle);
    worksheet.cell(2, 100).string("RIA Bank Account Type").style(tableHeaderStyle);
    worksheet.cell(2, 101).string("RIA Account Number").style(tableHeaderStyle);

    let cellRow = 2;

    for (let i = 0; i < data.AssociateExcelReportData.length; i++) {
        cellRow += 1;

        let item = data.AssociateExcelReportData[i];

        worksheet.cell(cellRow, 1).string(item.AssociateName).style(tableDataStyle);
        worksheet.cell(cellRow, 2).string(item.EmployeeName).style(tableDataStyle);
        worksheet.cell(cellRow, 3).string(item.Profession).style(tableDataStyle);
        worksheet.cell(cellRow, 4).string(item.EntityName).style(tableDataStyle);
        worksheet.cell(cellRow, 5).string(item.AuthorisedPerson1).style(tableDataStyle);
        worksheet.cell(cellRow, 6).string(item.Email1).style(tableDataStyle);
        worksheet.cell(cellRow, 7).string(item.Mobile1).style(tableDataStyle);
        worksheet.cell(cellRow, 8).string(item.PAN1).style(tableDataStyle);
        worksheet.cell(cellRow, 9).string(item.AuthorisedPerson2).style(tableDataStyle);
        worksheet.cell(cellRow, 10).string(item.Email2).style(tableDataStyle);
        worksheet.cell(cellRow, 11).string(item.Mobile2).style(tableDataStyle);
        worksheet.cell(cellRow, 12).string(item.PAN2).style(tableDataStyle);
        worksheet.cell(cellRow, 13).string(item.AuthorisedPerson3).style(tableDataStyle);
        worksheet.cell(cellRow, 14).string(item.Email3).style(tableDataStyle);
        worksheet.cell(cellRow, 15).string(item.Mobile3).style(tableDataStyle);
        worksheet.cell(cellRow, 16).string(item.PAN3).style(tableDataStyle);
        worksheet.cell(cellRow, 17).string(item.PANCardNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 18).string(item.AadharCardNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 19).string(item.DateOfBirth).style(tableDataStyle);
        worksheet.cell(cellRow, 20).string(item.DateOfIncorporation).style(tableDataStyle);
        worksheet.cell(cellRow, 21).string(item.GSTIN).style(tableDataStyle);
        worksheet.cell(cellRow, 22).string(item.GSTINValidDate).style(tableDataStyle);
        worksheet.cell(cellRow, 23).string(item.ShopCertificateValidDate).style(tableDataStyle);
        worksheet.cell(cellRow, 24).string(item.TAN).style(tableDataStyle);
        worksheet.cell(cellRow, 25).string(item.PrimaryColor).style(tableDataStyle);
        worksheet.cell(cellRow, 26).string(item.SecondaryColor).style(tableDataStyle);
        worksheet.cell(cellRow, 27).string(item.ARNHolderName).style(tableDataStyle);
        worksheet.cell(cellRow, 28).string(item.ARN).style(tableDataStyle);
        worksheet.cell(cellRow, 29).string(item.ARNValidDate).style(tableDataStyle);
        worksheet.cell(cellRow, 30).string(item.EUINHolderName).style(tableDataStyle);
        worksheet.cell(cellRow, 31).string(item.EUIN).style(tableDataStyle);
        worksheet.cell(cellRow, 32).string(item.EUINValidDate).style(tableDataStyle);
        worksheet.cell(cellRow, 33).string(item.RIAName).style(tableDataStyle);
        worksheet.cell(cellRow, 34).string(item.RIANumber).style(tableDataStyle);
        worksheet.cell(cellRow, 35).string(item.RIAValidDate).style(tableDataStyle);
        worksheet.cell(cellRow, 36).string(item.AssociateCode).style(tableDataStyle);
        worksheet.cell(cellRow, 37).string(item.BSEPassword).style(tableDataStyle);
        worksheet.cell(cellRow, 38).string(item.Address1).style(tableDataStyle);
        worksheet.cell(cellRow, 39).string(item.Address2).style(tableDataStyle);
        worksheet.cell(cellRow, 40).string(item.Address3).style(tableDataStyle);
        worksheet.cell(cellRow, 41).string(item.City).style(tableDataStyle);
        worksheet.cell(cellRow, 42).string(item.State).style(tableDataStyle);
        worksheet.cell(cellRow, 43).string(item.Country).style(tableDataStyle);
        worksheet.cell(cellRow, 44).string(item.PinCode).style(tableDataStyle);
        worksheet.cell(cellRow, 45).string(item.MobileNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 46).string(item.TelephoneNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 47).string(item.Email).style(tableDataStyle);
        worksheet.cell(cellRow, 48).string(item.EntityType).style(tableDataStyle);
        worksheet.cell(cellRow, 49).string(item.NomineeName).style(tableDataStyle);
        worksheet.cell(cellRow, 50).string(item.NomineeDateOfBirth).style(tableDataStyle);
        worksheet.cell(cellRow, 51).string(item.NomineeAddress1).style(tableDataStyle);
        worksheet.cell(cellRow, 52).string(item.NomineeAddress2).style(tableDataStyle);
        worksheet.cell(cellRow, 53).string(item.NomineeAddress3).style(tableDataStyle);
        worksheet.cell(cellRow, 54).string(item.NomineeCity).style(tableDataStyle);
        worksheet.cell(cellRow, 55).string(item.NomineeState).style(tableDataStyle);
        worksheet.cell(cellRow, 56).string(item.NomineeCountry).style(tableDataStyle);
        worksheet.cell(cellRow, 57).string(item.NomineePinCode).style(tableDataStyle);
        worksheet.cell(cellRow, 58).string(item.NomineeMobileNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 59).string(item.NomineeEmail).style(tableDataStyle);
        worksheet.cell(cellRow, 60).string(item.GaurdianName).style(tableDataStyle);
        worksheet.cell(cellRow, 61).string(item.GuardianRelation).style(tableDataStyle);
        worksheet.cell(cellRow, 62).string(item.GaurdianAddress1).style(tableDataStyle);
        worksheet.cell(cellRow, 63).string(item.GaurdianAddress2).style(tableDataStyle);
        worksheet.cell(cellRow, 64).string(item.GaurdianAddress3).style(tableDataStyle);
        worksheet.cell(cellRow, 65).string(item.GaurdianCity).style(tableDataStyle);
        worksheet.cell(cellRow, 66).string(item.GaurdianState).style(tableDataStyle);
        worksheet.cell(cellRow, 67).string(item.GaurdianCountry).style(tableDataStyle);
        worksheet.cell(cellRow, 68).string(item.GaurdianPinCode).style(tableDataStyle);
        worksheet.cell(cellRow, 69).string(item.GaurdianMobileNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 70).string(item.GaurdianEmail).style(tableDataStyle);
        worksheet.cell(cellRow, 71).string(item.CertificationType).style(tableDataStyle);
        worksheet.cell(cellRow, 72).string(item.NismVaNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 73).string(item.NismVaValidDate).style(tableDataStyle);
        worksheet.cell(cellRow, 74).string(item.GSTINValidDate).style(tableDataStyle);
        worksheet.cell(cellRow, 75).string(item.NismXaNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 76).string(item.NismXaValidDate).style(tableDataStyle);
        worksheet.cell(cellRow, 77).string(item.NismXbNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 78).string(item.NismXbValidDate).style(tableDataStyle);
        worksheet.cell(cellRow, 79).string(item.CfpNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 80).string(item.CfpValidDate).style(tableDataStyle);
        worksheet.cell(cellRow, 81).string(item.CwmNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 82).string(item.CwmValidDate).style(tableDataStyle);
        worksheet.cell(cellRow, 83).string(item.CaNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 84).string(item.CaValidDate).style(tableDataStyle);
        worksheet.cell(cellRow, 85).string(item.CsNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 86).string(item.CsValidDate).style(tableDataStyle);
        worksheet.cell(cellRow, 87).string(item.CourseName).style(tableDataStyle);
        worksheet.cell(cellRow, 88).string(item.CourseNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 89).string(item.CourseValidDate).style(tableDataStyle);
        worksheet.cell(cellRow, 90).string(item.IFSC).style(tableDataStyle);
        worksheet.cell(cellRow, 91).string(item.BankName).style(tableDataStyle);
        worksheet.cell(cellRow, 92).string(item.Branch).style(tableDataStyle);
        worksheet.cell(cellRow, 93).string(item.MICR).style(tableDataStyle);
        worksheet.cell(cellRow, 94).string(item.BankAccountType).style(tableDataStyle);
        worksheet.cell(cellRow, 95).string(item.AccountNumber).style(tableDataStyle);
        worksheet.cell(cellRow, 96).string(item.RIAIFSC).style(tableDataStyle);
        worksheet.cell(cellRow, 97).string(item.RIABankName).style(tableDataStyle);
        worksheet.cell(cellRow, 98).string(item.RIABranch).style(tableDataStyle);
        worksheet.cell(cellRow, 99).string(item.RIAMICR).style(tableDataStyle);
        worksheet.cell(cellRow, 100).string(item.RIABankAccountType).style(tableDataStyle);
        worksheet.cell(cellRow, 101).string(item.RIAAccountNumber).style(tableDataStyle);
    }

    worksheet.column(1).setWidth(25);
    worksheet.column(2).setWidth(25);
    worksheet.column(3).setWidth(25);
    worksheet.column(4).setWidth(25);
    worksheet.column(5).setWidth(25);
    worksheet.column(6).setWidth(25);
    worksheet.column(7).setWidth(25);
    worksheet.column(8).setWidth(25);
    worksheet.column(9).setWidth(25);
    worksheet.column(10).setWidth(25);
    worksheet.column(11).setWidth(25);
    worksheet.column(12).setWidth(25);
    worksheet.column(13).setWidth(25);
    worksheet.column(14).setWidth(25);
    worksheet.column(15).setWidth(25);
    worksheet.column(16).setWidth(25);
    worksheet.column(17).setWidth(25);
    worksheet.column(18).setWidth(25);
    worksheet.column(19).setWidth(25);
    worksheet.column(20).setWidth(25);
    worksheet.column(21).setWidth(25);
    worksheet.column(22).setWidth(25);
    worksheet.column(23).setWidth(25);
    worksheet.column(24).setWidth(25);
    worksheet.column(25).setWidth(25);
    worksheet.column(26).setWidth(25);
    worksheet.column(27).setWidth(25);
    worksheet.column(28).setWidth(25);
    worksheet.column(29).setWidth(30);
    worksheet.column(30).setWidth(25);
    worksheet.column(31).setWidth(25);
    worksheet.column(32).setWidth(25);
    worksheet.column(33).setWidth(25);
    worksheet.column(34).setWidth(25);
    worksheet.column(35).setWidth(25);
    worksheet.column(36).setWidth(25);
    worksheet.column(37).setWidth(25);
    worksheet.column(38).setWidth(25);
    worksheet.column(39).setWidth(25);
    worksheet.column(40).setWidth(25);
    worksheet.column(41).setWidth(25);
    worksheet.column(42).setWidth(25);
    worksheet.column(43).setWidth(25);
    worksheet.column(44).setWidth(25);
    worksheet.column(45).setWidth(25);
    worksheet.column(46).setWidth(25);
    worksheet.column(47).setWidth(25);
    worksheet.column(48).setWidth(25);
    worksheet.column(49).setWidth(25);
    worksheet.column(50).setWidth(25);
    worksheet.column(51).setWidth(25);
    worksheet.column(52).setWidth(25);
    worksheet.column(53).setWidth(25);
    worksheet.column(54).setWidth(25);
    worksheet.column(55).setWidth(25);
    worksheet.column(56).setWidth(25);
    worksheet.column(57).setWidth(25);
    worksheet.column(58).setWidth(25);
    worksheet.column(59).setWidth(25);
    worksheet.column(60).setWidth(25);
    worksheet.column(61).setWidth(25);
    worksheet.column(62).setWidth(25);
    worksheet.column(63).setWidth(25);
    worksheet.column(64).setWidth(25);
    worksheet.column(65).setWidth(25);
    worksheet.column(66).setWidth(25);
    worksheet.column(67).setWidth(25);
    worksheet.column(68).setWidth(25);
    worksheet.column(69).setWidth(25);
    worksheet.column(70).setWidth(25);
    worksheet.column(71).setWidth(25);
    worksheet.column(72).setWidth(25);
    worksheet.column(73).setWidth(25);
    worksheet.column(74).setWidth(25);
    worksheet.column(75).setWidth(25);
    worksheet.column(76).setWidth(25);
    worksheet.column(77).setWidth(25);
    worksheet.column(78).setWidth(25);
    worksheet.column(79).setWidth(25);
    worksheet.column(80).setWidth(25);
    worksheet.column(81).setWidth(25);
    worksheet.column(82).setWidth(25);
    worksheet.column(83).setWidth(25);
    worksheet.column(84).setWidth(25);
    worksheet.column(85).setWidth(25);
    worksheet.column(86).setWidth(25);
    worksheet.column(87).setWidth(25);
    worksheet.column(88).setWidth(25);
    worksheet.column(89).setWidth(25);
    worksheet.column(90).setWidth(25);
    worksheet.column(91).setWidth(25);
    worksheet.column(92).setWidth(25);
    worksheet.column(93).setWidth(25);
    worksheet.column(94).setWidth(25);
    worksheet.column(95).setWidth(25);
    worksheet.column(96).setWidth(25);
    worksheet.column(97).setWidth(25);
    worksheet.column(98).setWidth(25);
    worksheet.column(99).setWidth(25);
    worksheet.column(100).setWidth(25);
    worksheet.column(101).setWidth(25);

    const excelFilePath = path.join(
        __dirname.replace("app", "public"),
        "..",
        "documents",
        reportType,
        fileName
    );

    await workbook.write(excelFilePath);

    return excelFilePath;
};

ExcelEngine.CreateTradeLogReport = async (data) => {
    return new Promise((resolve, reject) => {
        var workbook = new excel.Workbook();

        var headerStyle = workbook.createStyle({
            font: {
                color: "#000000",
                size: 16,
                bold: true,
            },
            alignment: {
                horizontal: ["center"],
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        var captionStyle = workbook.createStyle({
            font: {
                color: "#000000",
                size: 12,
                bold: true,
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        var captionCenterAlignStyle = workbook.createStyle({
            alignment: { horizontal: "center" },
            font: {
                color: "#000000",
                size: 12,
                bold: true,
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        var dataStyle = workbook.createStyle({
            font: {
                color: "#000000",
                size: 10,
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        var tableHeaderStyle = workbook.createStyle({
            font: {
                color: "#000000",
                size: 12,
                bold: true,
            },
            border: {
                left: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                right: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                top: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                bottom: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        var tableDataStyle = workbook.createStyle({
            font: {
                color: "#000000",
                size: 10,
            },
            border: {
                left: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                right: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                top: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                bottom: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        var tableDataRightAlignStyle = workbook.createStyle({
            alignment: { horizontal: 'right' },
            font: {
                color: "#000000",
                size: 10,
            },
            border: {
                left: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                right: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                top: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                bottom: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        var tableFooterStyle = workbook.createStyle({
            font: {
                color: "#000000",
                size: 12,
                bold: true,
            },
            border: {
                left: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                right: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                top: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                bottom: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        var tableFooterRightAlignStyle = workbook.createStyle({
            alignment: { horizontal: 'right' },
            font: {
                color: "#000000",
                size: 12,
                bold: true,
            },
            border: {
                left: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                right: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                top: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                bottom: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        var worksheet = workbook.addWorksheet("Sheet 1");

        worksheet.cell(1, 1).string("Folio Number").style(tableHeaderStyle);
        worksheet.cell(1, 2).string("Scheme Name").style(tableHeaderStyle);
        worksheet.cell(1, 3).string("Investor Name").style(tableHeaderStyle);
        worksheet.cell(1, 4).string("PAN").style(tableHeaderStyle);
        worksheet.cell(1, 5).string("Advisor Name").style(tableHeaderStyle);
        worksheet.cell(1, 6).string("Transaction Initiation Date").style(tableHeaderStyle);
        worksheet.cell(1, 7).string("Transaction Type").style(tableHeaderStyle);
        worksheet.cell(1, 8).string("Transaction ID").style(tableHeaderStyle);
        worksheet.cell(1, 9).string("NAV (Rs.)").style(tableHeaderStyle);
        worksheet.cell(1, 10).string("Units").style(tableHeaderStyle);
        worksheet.cell(1, 11).string("Amount (Rs.)").style(tableHeaderStyle);
        worksheet.cell(1, 12).string("Transaction Completed Date").style(tableHeaderStyle);
        worksheet.cell(1, 13).string("Status").style(tableHeaderStyle);

        let cellRow = 1;
        for (let i = 0; i < data.length; i++) {
            cellRow += 1;

            let item = data[i];
            // console.log(item.TransactionInitiationDate);

            worksheet.cell(cellRow, 1).string(((item.FolioNumber == null) ? '' : item.FolioNumber)).style(tableDataStyle);
            worksheet.cell(cellRow, 2).string(((item.SchemeName == null) ? '' : item.SchemeName)).style(tableDataStyle);
            worksheet.cell(cellRow, 3).string(((item.InvestorName == null) ? '' : item.InvestorName)).style(tableDataStyle);
            worksheet.cell(cellRow, 4).string(((item.PAN == null) ? '' : item.PAN)).style(tableDataStyle);
            worksheet.cell(cellRow, 5).string(((item.AdvisorName == null) ? '' : item.AdvisorName)).style(tableDataStyle);
            worksheet.cell(cellRow, 6).string(((item.TransactionInitiationDate != null) ? luxon.DateTime.fromISO(item.TransactionInitiationDate.toISOString(), { zone: 'Asia/Kolkata' }).toFormat('dd-MM-yyyy') : '')).style(tableDataStyle);
            worksheet.cell(cellRow, 7).string(((item.TransactionType == null) ? '' : item.TransactionType)).style(tableDataStyle);
            worksheet.cell(cellRow, 8).string(((item.TransactionId == null) ? '' : item.TransactionId)).style(tableDataStyle);
            worksheet.cell(cellRow, 9).number(((item.NAV == null) ? 0 : item.NAV)).style(tableDataStyle);
            worksheet.cell(cellRow, 10).number(((item.Units == null) ? 0 : item.Units)).style(tableDataStyle);
            worksheet.cell(cellRow, 11).number(((item.Amount == null) ? 0 : item.Amount)).style(tableDataStyle);
            worksheet.cell(cellRow, 12).string(((item.TransactionCompletedDate != null) ? luxon.DateTime.fromISO(item.TransactionCompletedDate.toISOString(), { zone: 'Asia/Kolkata' }).toFormat('dd-MM-yyyy') : '')).style(tableDataStyle);
            worksheet.cell(cellRow, 13).string(((item.Status == null) ? '' : item.Status)).style(tableDataStyle);
        }

        worksheet.column(1).setWidth(25);
        worksheet.column(2).setWidth(25);
        worksheet.column(3).setWidth(25);
        worksheet.column(4).setWidth(25);
        worksheet.column(5).setWidth(25);
        worksheet.column(6).setWidth(25);
        worksheet.column(7).setWidth(25);
        worksheet.column(8).setWidth(25);
        worksheet.column(9).setWidth(25);
        worksheet.column(10).setWidth(25);
        worksheet.column(11).setWidth(25);
        worksheet.column(12).setWidth(25);
        worksheet.column(13).setWidth(25);

        var currentDate = luxon.DateTime.now().setZone('Asia/Kolkata');
        var fileName = 'trade-log-' + commonFunction.GetUniqueId() + '.xlsx';

        const excelFilePath = path.join(
            __dirname.replace("app", "public"),
            "..",
            "documents",
            'reports',
            fileName
        );

        if (fileSystem.existsSync(excelFilePath)) {
            fileSystem.unlinkSync(excelFilePath);
        }

        // console.log('path: ' + excelFilePath);
        workbook.write(excelFilePath, function (err, stats) {
            if (err) {
                reject('Error while writing excel file...');
            }
            else {
                resolve({ ExcelFilePath: excelFilePath, FileName: fileName });
            }
        });
    });
};

ExcelEngine.CreateClientHoldingReport = async (ucc, clientAccountData, cashflowData, performanceData, purchaseData, redemptionData) => {
    return new Promise((resolve, reject) => {
        var currentDate = luxon.DateTime.now().setZone('Asia/Kolkata');

        var workbook = new excel.Workbook();

        var headerStyle = workbook.createStyle({
            font: {
                color: "#000000",
                size: 16,
                bold: true,
            },
            alignment: {
                horizontal: ["center"],
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        var captionStyle = workbook.createStyle({
            font: {
                color: "#000000",
                size: 12,
                bold: true,
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        var captionCenterAlignStyle = workbook.createStyle({
            alignment: { horizontal: "center" },
            font: {
                color: "#000000",
                size: 12,
                bold: true,
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        var dataStyle = workbook.createStyle({
            font: {
                color: "#000000",
                size: 10,
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        var tableHeaderStyle = workbook.createStyle({
            font: {
                color: "#000000",
                size: 12,
                bold: true,
            },
            border: {
                left: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                right: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                top: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                bottom: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        var tableDataStyle = workbook.createStyle({
            font: {
                color: "#000000",
                size: 10,
            },
            border: {
                left: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                right: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                top: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                bottom: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        var tableDataBoldStyle = workbook.createStyle({
            font: {
                color: "#000000",
                size: 10,
                bold: true,
            },
            border: {
                left: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                right: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                top: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                bottom: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        var tableDataRightAlignStyle = workbook.createStyle({
            alignment: { horizontal: 'right' },
            font: {
                color: "#000000",
                size: 10,
            },
            border: {
                left: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                right: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                top: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                bottom: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        var tableFooterStyle = workbook.createStyle({
            font: {
                color: "#000000",
                size: 12,
                bold: true,
            },
            border: {
                left: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                right: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                top: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                bottom: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        var tableFooterRightAlignStyle = workbook.createStyle({
            alignment: { horizontal: 'right' },
            font: {
                color: "#000000",
                size: 12,
                bold: true,
            },
            border: {
                left: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                right: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                top: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
                bottom: {
                    style: ["thin"],
                    color: "#C4C4C4",
                },
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        var firstHolder = clientAccountData.AccountHolders.find(x => x.SerialNumber == 1);

        // //Summary
        // var worksheet1 = workbook.addWorksheet("Summary");

        // worksheet1.cell(1, 1, 1, 2, true).string("PORTFOLIO SUMMARY").style(headerStyle);

        // worksheet1.cell(2, 1).string("");

        // worksheet1.cell(3, 1).string("Metric").style(tableHeaderStyle);
        // worksheet1.cell(3, 2).string("Value").style(tableHeaderStyle);

        // worksheet1.cell(4, 1).string("Total Amount Invested").style(tableDataStyle);
        // worksheet1.cell(4, 2).number(((cashflowData.PurchaseAmount == null) ? 0 : cashflowData.PurchaseAmount)).style(tableDataStyle);

        // worksheet1.cell(5, 1).string("Total Amount Withdrawn").style(tableDataStyle);
        // worksheet1.cell(5, 2).number(((cashflowData.WithdrawalAmount == null) ? 0 : cashflowData.WithdrawalAmount)).style(tableDataStyle);

        // worksheet1.cell(6, 1).string("Current Portfolio Value").style(tableDataStyle);
        // worksheet1.cell(6, 2).number(((cashflowData.CurrentAmount == null) ? 0 : cashflowData.CurrentAmount)).style(tableDataStyle);

        // worksheet1.cell(7, 1).string("Absolute Gain/Loss").style(tableDataStyle);
        // worksheet1.cell(7, 2).number(((cashflowData.ProfitLoss == null) ? 0 : cashflowData.ProfitLoss)).style(tableDataStyle);

        // worksheet1.column(1).setWidth(25);
        // worksheet1.column(2).setWidth(25);

        //Cash Flow
        var worksheet1 = workbook.addWorksheet("Summary");

        worksheet1.cell(1, 1, 1, 5, true).string(clientAccountData.AssociateName).style({
            font: {
                color: "#000000",
                size: 16,
                bold: true,
            },
            alignment: {
                horizontal: ["right"],
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        worksheet1.cell(2, 1, 2, 5, true).string('AMFI Registered Mutual Fund Distributor').style({
            font: {
                color: "#000000",
                size: 10,
            },
            alignment: {
                horizontal: ["right"],
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        worksheet1.cell(4, 1, 4, 5, true).string('Email ID: info@kinntegra.co.in').style({
            font: {
                color: "#000000",
                size: 10,
            },
            alignment: {
                horizontal: ["right"],
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        worksheet1.cell(5, 1, 5, 3, true).string(firstHolder.ProfileDetails.Name + ' (' + firstHolder.ProfileDetails.PANCardNumber + ')').style({
            font: {
                color: "#000000",
                size: 16,
                bold: true,
            },
            alignment: {
                horizontal: ["left"],
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        worksheet1.cell(5, 4, 5, 5, true).string('Mobile no.: ' + clientAccountData.Mobile1).style({
            font: {
                color: "#000000",
                size: 10,
            },
            alignment: {
                horizontal: ["right"],
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        worksheet1.cell(6, 1, 6, 3, true).string('Mobile no.: ' + firstHolder.ProfileDetails.MobileNumber).style(dataStyle);
        worksheet1.cell(6, 4, 6, 5, true).string('Report as on: ' + currentDate.toFormat('dd-MM-yyyy')).style({
            font: {
                color: "#000000",
                size: 12,
                bold: true,
            },
            alignment: {
                horizontal: ["right"],
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        worksheet1.cell(7, 1, 7, 3, true).string('Email ID: ' + firstHolder.ProfileDetails.Email).style(dataStyle);
        worksheet1.cell(7, 4, 7, 5, true).string('MF Cash-flow Report').style({
            font: {
                color: "#000000",
                size: 16,
                bold: true,
            },
            alignment: {
                horizontal: ["right"],
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        worksheet1.cell(9, 1).string("").style(tableHeaderStyle);
        worksheet1.cell(9, 2).string("Equity").style(tableHeaderStyle);
        worksheet1.cell(9, 3).string("Debt").style(tableHeaderStyle);
        worksheet1.cell(9, 4).string("Commodity").style(tableHeaderStyle);
        worksheet1.cell(9, 5).string("Total").style(tableHeaderStyle);

        worksheet1.cell(10, 1).string("Cash Inflow (a+b)").style(tableDataBoldStyle);
        worksheet1.cell(10, 2).number(cashflowData.CashInFlowEquity).style(tableDataBoldStyle);
        worksheet1.cell(10, 3).number(cashflowData.CashInFlowDebt).style(tableDataBoldStyle);
        worksheet1.cell(10, 4).number(cashflowData.CashInFlowCommodities).style(tableDataBoldStyle);
        worksheet1.cell(10, 5).number(cashflowData.CashInFlowTotal).style(tableDataBoldStyle);

        worksheet1.cell(11, 1).string("a. Investment").style(tableDataStyle);
        worksheet1.cell(11, 2).number(cashflowData.InvestmentEquity).style(tableDataStyle);
        worksheet1.cell(11, 3).number(cashflowData.InvestmentDebt).style(tableDataStyle);
        worksheet1.cell(11, 4).number(cashflowData.InvestmentCommodities).style(tableDataStyle);
        worksheet1.cell(11, 5).number(cashflowData.InvestmentTotal).style(tableDataStyle);

        worksheet1.cell(12, 1).string("b. Switch In").style(tableDataStyle);
        worksheet1.cell(12, 2).number(cashflowData.SwitchInEquity).style(tableDataStyle);
        worksheet1.cell(12, 3).number(cashflowData.SwitchInDebt).style(tableDataStyle);
        worksheet1.cell(12, 4).number(cashflowData.SwitchInCommodities).style(tableDataStyle);
        worksheet1.cell(12, 5).number(cashflowData.SwitchInTotal).style(tableDataStyle);

        worksheet1.cell(13, 1).string("Cash Outflow (c+d+e)").style(tableDataBoldStyle);
        worksheet1.cell(13, 2).number(cashflowData.CashOutFlowEquity).style(tableDataBoldStyle);
        worksheet1.cell(13, 3).number(cashflowData.CashOutFlowDebt).style(tableDataBoldStyle);
        worksheet1.cell(13, 4).number(cashflowData.CashOutFlowCommodities).style(tableDataBoldStyle);
        worksheet1.cell(13, 5).number(cashflowData.CashOutFlowTotal).style(tableDataBoldStyle);

        worksheet1.cell(14, 1).string("c. Switch Out").style(tableDataStyle);
        worksheet1.cell(14, 2).number(cashflowData.SwitchOutEquity).style(tableDataStyle);
        worksheet1.cell(14, 3).number(cashflowData.SwitchOutDebt).style(tableDataStyle);
        worksheet1.cell(14, 4).number(cashflowData.SwitchOutCommodities).style(tableDataStyle);
        worksheet1.cell(14, 5).number(cashflowData.SwitchOutTotal).style(tableDataStyle);

        worksheet1.cell(15, 1).string("d. Redemption").style(tableDataStyle);
        worksheet1.cell(15, 2).number(cashflowData.RedemptionEquity).style(tableDataStyle);
        worksheet1.cell(15, 3).number(cashflowData.RedemptionDebt).style(tableDataStyle);
        worksheet1.cell(15, 4).number(cashflowData.RedemptionCommodities).style(tableDataStyle);
        worksheet1.cell(15, 5).number(cashflowData.RedemptionTotal).style(tableDataStyle);

        worksheet1.cell(16, 1).string("e. Dividend Payout").style(tableDataStyle);
        worksheet1.cell(16, 2).number(cashflowData.DividendPayoutEquity).style(tableDataStyle);
        worksheet1.cell(16, 3).number(cashflowData.DividendPayoutDebt).style(tableDataStyle);
        worksheet1.cell(16, 4).number(cashflowData.DividendPayoutCommodities).style(tableDataStyle);
        worksheet1.cell(16, 5).number(cashflowData.DividendPayoutTotal).style(tableDataStyle);

        worksheet1.cell(17, 1).string("f. Net Investment (a+b-c-d-e)").style(tableDataBoldStyle);
        worksheet1.cell(17, 2).number(cashflowData.NetInvestmentEquity).style(tableDataBoldStyle);
        worksheet1.cell(17, 3).number(cashflowData.NetInvestmentDebt).style(tableDataBoldStyle);
        worksheet1.cell(17, 4).number(cashflowData.NetInvestmentCommodities).style(tableDataBoldStyle);
        worksheet1.cell(17, 5).number(cashflowData.NetInvestmentTotal).style(tableDataBoldStyle);

        worksheet1.cell(18, 1).string("g. Market value").style(tableDataBoldStyle);
        worksheet1.cell(18, 2).number(cashflowData.CurrentAmountEquity).style(tableDataBoldStyle);
        worksheet1.cell(18, 3).number(cashflowData.CurrentAmountDebt).style(tableDataBoldStyle);
        worksheet1.cell(18, 4).number(cashflowData.CurrentAmountCommodities).style(tableDataBoldStyle);
        worksheet1.cell(18, 5).number(cashflowData.CurrentAmountTotal).style(tableDataBoldStyle);

        worksheet1.cell(19, 1).string("h. Net Gain (g-f)").style(tableDataBoldStyle);
        worksheet1.cell(19, 2).number(cashflowData.NetGainEquity).style(tableDataBoldStyle);
        worksheet1.cell(19, 3).number(cashflowData.NetGainDebt).style(tableDataBoldStyle);
        worksheet1.cell(19, 4).number(cashflowData.NetGainCommodities).style(tableDataBoldStyle);
        worksheet1.cell(19, 5).number(cashflowData.NetGainTotal).style(tableDataBoldStyle);

        worksheet1.cell(20, 1).string("Realised Gain / Loss").style(tableDataStyle);
        worksheet1.cell(20, 2).number(cashflowData.RealisedGainLossEquity).style(tableDataStyle);
        worksheet1.cell(20, 3).number(cashflowData.RealisedGainLossDebt).style(tableDataStyle);
        worksheet1.cell(20, 4).number(cashflowData.RealisedGainLossCommodities).style(tableDataStyle);
        worksheet1.cell(20, 5).number(cashflowData.RealisedGainLossTotal).style(tableDataStyle);

        worksheet1.cell(21, 1).string("Unrealised Gain / Loss").style(tableDataStyle);
        worksheet1.cell(21, 2).number(cashflowData.UnrealisedGainLossEquity).style(tableDataStyle);
        worksheet1.cell(21, 3).number(cashflowData.UnrealisedGainLossDebt).style(tableDataStyle);
        worksheet1.cell(21, 4).number(cashflowData.UnrealisedGainLossCommodities).style(tableDataStyle);
        worksheet1.cell(21, 5).number(cashflowData.UnrealisedGainLossTotal).style(tableDataStyle);

        worksheet1.cell(22, 1).string("i. Lifetime XIRR (All Transactions)").style(tableDataBoldStyle);
        worksheet1.cell(22, 2).number(cashflowData.XIRREquity).style(tableDataBoldStyle);
        worksheet1.cell(22, 3).number(cashflowData.XIRRDebt).style(tableDataBoldStyle);
        worksheet1.cell(22, 4).number(cashflowData.XIRRCommodities).style(tableDataBoldStyle);
        worksheet1.cell(22, 5).number(cashflowData.XIRRTotal).style(tableDataBoldStyle);

        worksheet1.column(1).setWidth(25);
        worksheet1.column(2).setWidth(25);
        worksheet1.column(3).setWidth(25);
        worksheet1.column(4).setWidth(25);
        worksheet1.column(5).setWidth(25);

        //Portfolio Performance
        var worksheet2 = workbook.addWorksheet("Portfolio Performance");
        worksheet2.cell(1, 1).string("Folio Number").style(tableHeaderStyle);
        worksheet2.cell(1, 2).string("Scheme Name").style(tableHeaderStyle);
        worksheet2.cell(1, 3).string("Balance Units").style(tableHeaderStyle);
        worksheet2.cell(1, 4).string("Purchase Amount").style(tableHeaderStyle);
        worksheet2.cell(1, 5).string("Purchase NAV").style(tableHeaderStyle);
        worksheet2.cell(1, 6).string("Current NAV").style(tableHeaderStyle);
        worksheet2.cell(1, 7).string("Cash Withdrawal").style(tableHeaderStyle);
        worksheet2.cell(1, 8).string("Dividend Paid").style(tableHeaderStyle);
        worksheet2.cell(1, 9).string("Current Amount").style(tableHeaderStyle);
        worksheet2.cell(1, 10).string("Profit and Loss").style(tableHeaderStyle);
        worksheet2.cell(1, 11).string("Profit and Loss %").style(tableHeaderStyle);
        worksheet2.cell(1, 12).string("XIRR").style(tableHeaderStyle);

        var sheet2Row = 1;
        for (let i = 0; i < performanceData.length; i++) {
            sheet2Row += 1;

            var performanceDataItem = performanceData[i];

            worksheet2.cell(sheet2Row, 1).string(((performanceDataItem.NewFolioNumber == null) ? '' : performanceDataItem.NewFolioNumber)).style(tableDataStyle);
            worksheet2.cell(sheet2Row, 2).string(((performanceDataItem.SchemeName == null) ? '' : performanceDataItem.SchemeName)).style(tableDataStyle);
            worksheet2.cell(sheet2Row, 3).number(((performanceDataItem.BalanceUnits == null) ? 0 : performanceDataItem.BalanceUnits)).style(tableDataStyle);
            worksheet2.cell(sheet2Row, 4).number(((performanceDataItem.PurchaseAmount == null) ? 0 : performanceDataItem.PurchaseAmount)).style(tableDataStyle);
            worksheet2.cell(sheet2Row, 5).number(((performanceDataItem.PurchaseNAV == null) ? 0 : performanceDataItem.PurchaseNAV)).style(tableDataStyle);
            worksheet2.cell(sheet2Row, 6).number(((performanceDataItem.CurrentNAV == null) ? 0 : performanceDataItem.CurrentNAV)).style(tableDataStyle);
            worksheet2.cell(sheet2Row, 7).number(((performanceDataItem.RedemptionAmount == null) ? 0 : performanceDataItem.RedemptionAmount)).style(tableDataStyle);
            worksheet2.cell(sheet2Row, 8).number(((performanceDataItem.DividendPayoutAmount == null) ? 0 : performanceDataItem.DividendPayoutAmount)).style(tableDataStyle);
            worksheet2.cell(sheet2Row, 9).number(((performanceDataItem.CurrentAmount == null) ? 0 : performanceDataItem.CurrentAmount)).style(tableDataStyle);
            worksheet2.cell(sheet2Row, 10).number(((performanceDataItem.ProfitLoss == null) ? 0 : performanceDataItem.ProfitLoss)).style(tableDataStyle);
            worksheet2.cell(sheet2Row, 11).number(((performanceDataItem.ProfitLossPercentage == null || Number.isNaN(performanceDataItem.ProfitLossPercentage)) ? 0 : performanceDataItem.ProfitLossPercentage)).style(tableDataStyle);
            worksheet2.cell(sheet2Row, 12).number(((performanceDataItem.XIRR == null) ? 0 : performanceDataItem.XIRR)).style(tableDataStyle);
        }

        worksheet2.column(1).setWidth(25);
        worksheet2.column(2).setWidth(25);
        worksheet2.column(3).setWidth(25);
        worksheet2.column(4).setWidth(25);
        worksheet2.column(5).setWidth(25);
        worksheet2.column(6).setWidth(25);
        worksheet2.column(7).setWidth(25);
        worksheet2.column(8).setWidth(25);
        worksheet2.column(9).setWidth(25);
        worksheet2.column(10).setWidth(25);
        worksheet2.column(11).setWidth(25);
        worksheet2.column(12).setWidth(25);

        //MF Transactions
        var worksheet3 = workbook.addWorksheet("MF Transactions");
        worksheet3.cell(1, 1).string("Folio Number").style(tableHeaderStyle);
        worksheet3.cell(1, 2).string("Scheme Name").style(tableHeaderStyle);
        worksheet3.cell(1, 3).string("ISIN").style(tableHeaderStyle);
        worksheet3.cell(1, 4).string("Transaction Date").style(tableHeaderStyle);
        worksheet3.cell(1, 5).string("Transaction Type").style(tableHeaderStyle);
        worksheet3.cell(1, 6).string("Units").style(tableHeaderStyle);
        worksheet3.cell(1, 7).string("Purchase NAV").style(tableHeaderStyle);
        worksheet3.cell(1, 8).string("Purchase Amount").style(tableHeaderStyle);
        worksheet3.cell(1, 9).string("Balance Units").style(tableHeaderStyle);
        worksheet3.cell(1, 10).string("Current NAV").style(tableHeaderStyle);
        worksheet3.cell(1, 11).string("Current Amount").style(tableHeaderStyle);
        worksheet3.cell(1, 12).string("Ageing").style(tableHeaderStyle);
        worksheet3.cell(1, 13).string("Profit and Loss").style(tableHeaderStyle);
        worksheet3.cell(1, 14).string("XIRR").style(tableHeaderStyle);

        var sheet3Row = 1;
        for (let i = 0; i < purchaseData.length; i++) {
            sheet3Row += 1;

            var purchaseDataItem = purchaseData[i];

            worksheet3.cell(sheet3Row, 1).string(((purchaseDataItem.NewFolioNumber == null) ? '' : purchaseDataItem.NewFolioNumber)).style(tableDataStyle);
            worksheet3.cell(sheet3Row, 2).string(((purchaseDataItem.SchemeName == null) ? '' : purchaseDataItem.SchemeName)).style(tableDataStyle);
            worksheet3.cell(sheet3Row, 3).string(((purchaseDataItem.ISIN == null) ? '' : purchaseDataItem.ISIN)).style(tableDataStyle);
            worksheet3.cell(sheet3Row, 4).string(((purchaseDataItem.TradeDate != null) ? luxon.DateTime.fromISO(purchaseDataItem.TradeDate.toISOString(), { zone: 'Asia/Kolkata' }).toFormat('dd-MM-yyyy') : '')).style(tableDataStyle);
            worksheet3.cell(sheet3Row, 5).string(((purchaseDataItem.TransactionType == null) ? '' : purchaseDataItem.TransactionType)).style(tableDataStyle);
            worksheet3.cell(sheet3Row, 6).number(((purchaseDataItem.Units == null) ? 0 : purchaseDataItem.Units)).style(tableDataStyle);
            worksheet3.cell(sheet3Row, 7).number(((purchaseDataItem.PurchaseNAV == null) ? 0 : purchaseDataItem.PurchaseNAV)).style(tableDataStyle);
            worksheet3.cell(sheet3Row, 8).number(((purchaseDataItem.PurchaseAmount == null) ? 0 : purchaseDataItem.PurchaseAmount)).style(tableDataStyle);
            worksheet3.cell(sheet3Row, 9).number(((purchaseDataItem.BalanceUnits == null) ? 0 : purchaseDataItem.BalanceUnits)).style(tableDataStyle);
            worksheet3.cell(sheet3Row, 10).number(((purchaseDataItem.CurrentNAV == null) ? 0 : purchaseDataItem.CurrentNAV)).style(tableDataStyle);
            worksheet3.cell(sheet3Row, 11).number(((purchaseDataItem.CurrentAmount == null) ? 0 : purchaseDataItem.CurrentAmount)).style(tableDataStyle);
            worksheet3.cell(sheet3Row, 12).number(((purchaseDataItem.DaysCount == null) ? 0 : purchaseDataItem.DaysCount)).style(tableDataStyle);
            worksheet3.cell(sheet3Row, 13).number(((purchaseDataItem.ProfitLoss == null) ? 0 : purchaseDataItem.ProfitLoss)).style(tableDataStyle);
            worksheet3.cell(sheet3Row, 14).number(((purchaseDataItem.XIRR == null) ? 0 : purchaseDataItem.XIRR)).style(tableDataStyle);
        }

        worksheet3.column(1).setWidth(25);
        worksheet3.column(2).setWidth(25);
        worksheet3.column(3).setWidth(25);
        worksheet3.column(4).setWidth(25);
        worksheet3.column(5).setWidth(25);
        worksheet3.column(6).setWidth(25);
        worksheet3.column(7).setWidth(25);
        worksheet3.column(8).setWidth(25);
        worksheet3.column(9).setWidth(25);
        worksheet3.column(10).setWidth(25);
        worksheet3.column(11).setWidth(25);
        worksheet3.column(12).setWidth(25);
        worksheet3.column(13).setWidth(25);
        worksheet3.column(14).setWidth(25);

        //Sold Units
        var worksheet4 = workbook.addWorksheet("Sold Units");
        worksheet4.cell(1, 1).string("Folio Number").style(tableHeaderStyle);
        worksheet4.cell(1, 2).string("Scheme Name").style(tableHeaderStyle);
        worksheet4.cell(1, 3).string("ISIN").style(tableHeaderStyle);
        worksheet4.cell(1, 4).string("Purchase Date").style(tableHeaderStyle);
        worksheet4.cell(1, 5).string("Purchase Units").style(tableHeaderStyle);
        worksheet4.cell(1, 6).string("Purchase NAV").style(tableHeaderStyle);
        worksheet4.cell(1, 7).string("Purchase Amount").style(tableHeaderStyle);
        worksheet4.cell(1, 8).string("Sale Date").style(tableHeaderStyle);
        worksheet4.cell(1, 9).string("Sale Units").style(tableHeaderStyle);
        worksheet4.cell(1, 10).string("Sale NAV").style(tableHeaderStyle);
        worksheet4.cell(1, 11).string("Sale Amount").style(tableHeaderStyle);
        worksheet4.cell(1, 12).string("Ageing").style(tableHeaderStyle);
        worksheet4.cell(1, 13).string("Profit and Loss").style(tableHeaderStyle);
        worksheet4.cell(1, 14).string("Capital Gain Treatment").style(tableHeaderStyle);

        var sheet4Row = 1;
        for (let i = 0; i < redemptionData.length; i++) {
            sheet4Row += 1;

            var redemptionDataItem = redemptionData[i];

            worksheet4.cell(sheet4Row, 1).string(((redemptionDataItem.NewFolioNumber == null) ? '' : redemptionDataItem.NewFolioNumber)).style(tableDataStyle);
            worksheet4.cell(sheet4Row, 2).string(((redemptionDataItem.SchemeName == null) ? '' : redemptionDataItem.SchemeName)).style(tableDataStyle);
            worksheet4.cell(sheet4Row, 3).string(((redemptionDataItem.ISIN == null) ? '' : redemptionDataItem.ISIN)).style(tableDataStyle);
            worksheet4.cell(sheet4Row, 4).string(((redemptionDataItem.PurchaseDate != null) ? luxon.DateTime.fromISO(redemptionDataItem.PurchaseDate.toISOString(), { zone: 'Asia/Kolkata' }).toFormat('dd-MM-yyyy') : '')).style(tableDataStyle);
            worksheet4.cell(sheet4Row, 5).number(((redemptionDataItem.PurchaseUnits == null) ? 0 : redemptionDataItem.PurchaseUnits)).style(tableDataStyle);
            worksheet4.cell(sheet4Row, 6).number(((redemptionDataItem.PurchaseNAV == null) ? 0 : redemptionDataItem.PurchaseNAV)).style(tableDataStyle);
            worksheet4.cell(sheet4Row, 7).number(((redemptionDataItem.PurchaseAmount == null) ? 0 : redemptionDataItem.PurchaseAmount)).style(tableDataStyle);
            worksheet4.cell(sheet4Row, 8).string(((redemptionDataItem.RedemptionDate != null) ? luxon.DateTime.fromISO(redemptionDataItem.RedemptionDate.toISOString(), { zone: 'Asia/Kolkata' }).toFormat('dd-MM-yyyy') : '')).style(tableDataStyle);
            worksheet4.cell(sheet4Row, 9).number(((redemptionDataItem.RedemptionUnits == null) ? 0 : redemptionDataItem.RedemptionUnits)).style(tableDataStyle);
            worksheet4.cell(sheet4Row, 10).number(((redemptionDataItem.RedemptionDateNAV == null) ? 0 : redemptionDataItem.RedemptionDateNAV)).style(tableDataStyle);
            worksheet4.cell(sheet4Row, 11).number(((redemptionDataItem.RedemptionAmount == null) ? 0 : redemptionDataItem.RedemptionAmount)).style(tableDataStyle);
            worksheet4.cell(sheet4Row, 12).number(((redemptionDataItem.HoldingDays == null) ? 0 : redemptionDataItem.HoldingDays)).style(tableDataStyle);
            worksheet4.cell(sheet4Row, 13).number(((redemptionDataItem.Profit == null) ? 0 : redemptionDataItem.Profit)).style(tableDataStyle);
            worksheet4.cell(sheet4Row, 14).string(((redemptionDataItem.CapitalGainTreatment == null) ? '' : redemptionDataItem.CapitalGainTreatment)).style(tableDataStyle);
        }

        worksheet4.column(1).setWidth(25);
        worksheet4.column(2).setWidth(25);
        worksheet4.column(3).setWidth(25);
        worksheet4.column(4).setWidth(25);
        worksheet4.column(5).setWidth(25);
        worksheet4.column(6).setWidth(25);
        worksheet4.column(7).setWidth(25);
        worksheet4.column(8).setWidth(25);
        worksheet4.column(9).setWidth(25);
        worksheet4.column(10).setWidth(25);
        worksheet4.column(11).setWidth(25);
        worksheet4.column(12).setWidth(25);
        worksheet4.column(13).setWidth(25);
        worksheet4.column(14).setWidth(25);

        var fileName = 'holding-report-' + ucc + '-' + currentDate.toFormat('ddMMyyyy') + '-' + commonFunction.GetUniqueId() + '.xlsx';

        const excelFilePath = path.join(
            __dirname.replace("app", "public"),
            "..",
            "documents",
            'reports',
            fileName
        );

        if (fileSystem.existsSync(excelFilePath)) {
            fileSystem.unlinkSync(excelFilePath);
        }

        // console.log('path: ' + excelFilePath);
        workbook.write(excelFilePath, function (err, stats) {
            if (err) {
                reject('Error while writing excel file...');
            }
            else {
                resolve({ ExcelFilePath: excelFilePath, FileName: fileName });
            }
        });
    });
};

module.exports = ExcelEngine;