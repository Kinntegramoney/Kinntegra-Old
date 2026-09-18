const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");
const xlsx = require('xlsx');
const pdfEngine = require("../models/pdfengine.model");
const base64img = require('base64-img');
const fs = require('fs');
const path = require('path');
const yauzl = require('yauzl');
const util = require('util');
const emailEngine = require("../models/emailengine.model");
const commonFunction = require('../models/commonfunction.model');
// const activityLogController = require('../controllers/appuseractivitylog.controller');

// AMC
// Cost Inflation Indices
// Gross Annual Income
// Wealth Source
// Address Type
// Bank Account Type
// Other Income Category
// Exit Load
// Tax Status
// Country & State
// Occupations
// Department
// Designation
// Kyc Status
// Tax Slab
// 
exports.UploadCommercialExcel = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    const workBook = xlsx.read(req.files.documentFile.data);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();
        for (const row of jsonData) {
            const name = row['Name'];
            const filedName = row['FieldName'];
            if (![name, filedName].every(Boolean)) {
                continue;
            }
            else {
                const insertBankRequest = transaction.request();
                insertBankRequest.output("Id", msSql.BigInt)
                    .input("Name", name)
                    .input("FieldName", filedName)
                const insertBankResult = await insertBankRequest.execute("InsertCommercial");
            }
        }
        await transaction.commit();
        res.status(200).send({
            Status: true,
            Message: "File Uploaded successfully.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            Message: errorMessage,
        });
    }
};

exports.UploadAMCExcel = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    const workBook = xlsx.read(req.files.documentFile.data);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();
        for (const row of jsonData) {
            const name = row['Name'];
            const bse_code = row['BseCode'];
            const igst = row['IsIGSTApplicable'];

            // if (![name,bse_code,igst].every(Boolean)) {
            //     continue; 
            // } 
            // else {

            const insertBankRequest = transaction.request();
            insertBankRequest.output("Id", msSql.BigInt)
                .input("Name", name)
                .input("BseCode", bse_code)
                .input("IsIGSTApplicable", igst)
            const insertBankResult = await insertBankRequest.execute("InsertAmc");

            // }
        }
        await transaction.commit();
        res.status(200).send({
            Status: true,
            Message: "File Uploaded successfully.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            Message: errorMessage,
        });
    }
};

exports.UploadCostInflationIndicesExcel = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    const workBook = xlsx.read(req.files.documentFile.data);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();
        for (const row of jsonData) {

            const financial_year = row['financial_year'];
            const start_date = row['start_date'];
            const end_date = row['end_date'];
            const index_value = row['index_value'];


            // const { id, exists } = await checkIfscExists(transaction, ifsc);

            if (![financial_year, start_date, end_date, index_value].every(Boolean)) {
                continue;
            }
            else {
                // if (exists) {
                //     const updateBankRequest = transaction.request();
                //     updateBankRequest.input("Id", msSql.BigInt, id)
                //         .input("FinancialYear", financial_year)
                //         .input("StartDate", start_date)
                //         .input("EndDate", end_date)
                //         .input("IndexValue", index_value)

                //     const updateBankResult = await updateBankRequest.execute("UpdateCostInflationIndex");
                // } else {
                const insertBankRequest = transaction.request();
                insertBankRequest.output("Id", msSql.BigInt)
                    .input("FinancialYear", financial_year)
                    .input("StartDate", start_date)
                    .input("EndDate", end_date)
                    .input("IndexValue", index_value)
                const insertBankResult = await insertBankRequest.execute("InsertCostInflationIndex");
                // }
            }
        }
        await transaction.commit();
        res.status(200).send({
            Status: true,
            Message: "File Uploaded successfully.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            Message: errorMessage,
        });
    }
};

exports.UploadIncomeCategoryExcel = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    const workBook = xlsx.read(req.files.documentFile.data);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();
        for (const row of jsonData) {
            const name = row['name'];

            if (![name].every(Boolean)) {
                continue;
            }
            else {

                const insertBankRequest = transaction.request();
                insertBankRequest.output("Id", msSql.BigInt)
                    .input("Name", name)
                const insertBankResult = await insertBankRequest.execute("InsertIncomeCategory");

            }
        }
        await transaction.commit();
        res.status(200).send({
            Status: true,
            Message: "File Uploaded successfully.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            Message: errorMessage,
        });
    }
};

exports.UploadAnnualIncomeExcel = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    const workBook = xlsx.read(req.files.documentFile.data);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();
        for (const row of jsonData) {
            const name = row['name'];
            const code = row['code'];
            if (![name, code].every(Boolean)) {
                continue;
            }
            else {

                const insertBankRequest = transaction.request();
                insertBankRequest.output("Id", msSql.BigInt)
                    .input("Name", name)
                    .input("Code", code)
                const insertBankResult = await insertBankRequest.execute("InsertGrossAnnualIncome");

            }
        }
        await transaction.commit();
        res.status(200).send({
            Status: true,
            Message: "File Uploaded successfully.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            Message: errorMessage,
        });
    }
};

exports.AssociatePdf = async (req, res) => {

    var errorMessage = "Error while generating Pdf...";

    try {
        let fileName = '';
        
        //     let data ={
        //         LogoImagePath: base64img.base64Sync(path.join('app', 'assets', 'images', 'mandate-check.png'))
        //        // LogoImagePath: path.join('app', 'assets', 'images', 'logo-green.svg')
        //    }

        // emailTo = "deephshah212000@gmail.com",
        // link = "www.youtube.com",
        // IpAddress = '192.168.0.15 ', 
        // device = 'Webkit, Windows' , 
        // browser = ' Chrome', 
        // time =" 07-05-24 12:51:44"
        // img = data.LogoImagePath

        // emailEngine.SendRestPasswordEmailLink(emailTo,link,img,IpAddress,device,browser,time);
        // let fileName = 'associateempanelmentform'+ '.pdf';
        //  let fileName = 'aofform'+ commonFunction.GetUniqueId() +'.pdf';

        // let fileName = 'aofform'+ commonFunction.GetUniqueId() +'.pdf';

        //  let fileName = 'associateempanelmentform'+ commonFunction.GetUniqueId() +'.pdf';

        //    let fileName1 = 'mandate'+ commonFunction.GetUniqueId() +'.pdf';
        //      var reportPath = await pdfEngine.GenerateA4LandscapePdf("mandate.template.hbs", data,fileName1, 'reports');

        //    var reportPath = await pdfEngine.GenerateA4PortraitPdf("engagementletter.template.hbs", data,fileNam
        //let fileName = 'mandate'+ commonFunction.GetUniqueId() +'.pdf';
        // let fileName = 'test'+ commonFunction.GetUniqueId() +'.pdf';

        // let data = {
        //     BSELogoImagePath: base64img.base64Sync(path.join('app', 'assets', 'images', 'bse-logo.png')),
        //     EmptyCheckboxImagePath: base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')),
        //     PartialCheckboxImagePath: base64img.base64Sync(path.join('app', 'assets', 'images', 'partial-checkbox.png')),
        //     EmptyRadioImagePath: base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-radiobutton.png')),
        //     SelectedRadioImagePath: base64img.base64Sync(path.join('app', 'assets', 'images', 'selected-radiobutton.png')),
        // }
        // let fileName = 'clientnonindividualfatca' + commonFunction.GetUniqueId() + '.pdf';
        // var reportPath = await pdfEngine.GenerateA4PortraitFATCAPdf("clientnonindividualfatca.template.hbs", data, fileName, 'reports');


        // var reportPath = await pdfEngine.GenerateA4PortraitPdf("associateceploiagreement.template.hbs", data,fileName, 'reports');
        // console.log(fileName);
        res.status(200).send(fileName);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }


};

exports.UploadCountriesExcel = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    const workBook = xlsx.read(req.files.documentFile.data);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();
        for (const row of jsonData) {
            const name = row['name'];
            const code = row['code'];
            const fatalCode = row['fatca_code'];
            if (![name, code, fatalCode].every(Boolean)) {
                continue;
            } else {
                // Check if a record with the same name already exists
                const checkIfExistsRequest = transaction.request();
                checkIfExistsRequest.input("Name", name);
                const checkIfExistsResult = await checkIfExistsRequest.execute('GetCountryByName');

                if (checkIfExistsResult.recordset.length > 0) {
                    // If record with the same name exists, update it
                    const countryId = checkIfExistsResult.recordset[0].Id;
                    const updateRequest = transaction.request();
                    updateRequest.input("Id", countryId)
                    updateRequest.input("Name", name);
                    updateRequest.input("Code", code);
                    updateRequest.input('FATCACode', fatalCode);
                    const updateResult = await updateRequest.execute("UpdateCountry");
                } else {
                    // If record with the same name doesn't exist, insert a new one
                    const insertRequest = transaction.request();
                    insertRequest.output("Id", msSql.BigInt)
                        .input("Name", name)
                        .input("Code", code)
                        .input('FATCACode', fatalCode);
                    const insertResult = await insertRequest.execute("InsertCountry");
                }
            }
        }
        await transaction.commit();
        res.status(200).send({
            Status: true,
            Message: "File Uploaded successfully.",
        });
    } catch (error) {
        console.log(error);
        await transaction.rollback(); // Rollback transaction in case of error
        res.status(500).send({
            Message: errorMessage,
        });
    }
};

exports.UploadStatesExcel = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    const workBook = xlsx.read(req.files.documentFile.data);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();
        for (const row of jsonData) {
            // const id = row['id'];
            const stateName = row['Name'];
            const code = row['code'];
            const countryName = row['countryName'];

            const findCountryIdRequest = transaction.request();
            findCountryIdRequest.input("Name", countryName);
            const findCountryIdResult = await findCountryIdRequest.execute('GetCountryIdByCountryName');
            let countryId = 0;
            if (findCountryIdResult.recordset.length > 0) {
                var dataItem = findCountryIdResult.recordset[0];
                countryId = dataItem.Id;
            }

            const updateStateRequest = transaction.request();
            updateStateRequest.input("CountryId", countryId);
            updateStateRequest.input("Name", stateName);
            updateStateRequest.input("Code", code);
            const updateStateResult = await updateStateRequest.execute("UploadState");



        }
        await transaction.commit();
        res.status(200).send({
            Status: true,
            Message: "File Uploaded successfully.",
        });
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        res.status(500).send({
            Message: errorMessage,
        });
    }
};


// exports.UploadGrossAnnualIncomeExcel = async (req, res) => {
//     const errorMessage = 'Error while uploading...';
//     const workBook = xlsx.read(req.files.documentFile.data);
//     const workSheet = workBook.Sheets[workBook.SheetNames[0]];
//     const jsonData = xlsx.utils.sheet_to_json(workSheet);
//     const transaction = req.app.locals.db.transaction();
//     try {
//         await transaction.begin();
//         for (const row of jsonData) {
//             const bankName = row['BANK'];
//             const ifsc = row['IFSC'];
//             const micr_code = '';
//             const branchName = row['BRANCH'];
//             const address = row['ADDRESS'];
//             const city = row['CITY1'];
//             const district = row['CITY2'];
//             const state = row['STATE'];
//             const stdCode = row['STD CODE'].toString();
//             const phone = row['PHONE'].toString();
//             const bse_mode = '';
//             const bse_code = '';
//             // Assuming no need for BSEMode and BSECode in this context

//             const { id, exists } = await checkIfscExists(transaction, ifsc);

//             if (![bankName, ifsc, micr_code,branchName, address, city, district, state, stdCode, phone,bse_mode,bse_code].every(Boolean)) {
//                 continue;
//             }
//             else {
//                 if (exists) {
//                     const updateBankRequest = transaction.request();
//                     updateBankRequest.input("Id", msSql.BigInt, id)
//                         .input("Name", bankName)
//                         .input("IFSC", ifsc)
//                         .input("MICRCode", micr_code)
//                         .input("Branch", branchName)
//                         .input("Address", address)
//                         .input("Contact", stdCode + '-' + phone)
//                         .input("City", city)
//                         .input("District", district)
//                         .input("State", state)
//                         .input("BSEMode", bse_mode)
//                         .input("BSECode", bse_code);
//                     const updateBankResult = await updateBankRequest.execute("UpdateBank");
//                 } else {
//                     const insertBankRequest = transaction.request();
//                     insertBankRequest.output("Id", msSql.BigInt)
//                         .input("Name", bankName)
//                         .input("IFSC", ifsc)
//                         .input("MICRCode", micr_code)
//                         .input("Branch", branchName)
//                         .input("Address", address)
//                         .input("Contact", stdCode + '-' + phone)
//                         .input("City", city)
//                         .input("District", district)
//                         .input("State", state)
//                         .input("BSEMode", bse_mode)
//                         .input("BSECode", bse_code);
//                     const insertBankResult = await insertBankRequest.execute("InsertBank");
//                 }
//             }
//         }
//         await transaction.commit();
//         res.status(200).send({
//             Status: true,
//             Message: "File Uploaded successfully.",
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             Message: errorMessage,
//         });
//     }
// };

