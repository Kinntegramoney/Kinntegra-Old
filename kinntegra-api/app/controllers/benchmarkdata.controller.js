const msSql = require("mssql");
const xlsx = require('xlsx');
const date = require('date-and-time');
const cryptoEngine = require("../models/cryptoengine.model");
const commonFunction = require('../models/commonfunction.model');
const pulseLabsConfig = require('../configs/pulselabs.config');
const luxon = require('luxon');
const appPool = require("../models/db.model");

exports.UploadBenchmarkData = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    const workBook = xlsx.read(req.files.documentFile.data);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        for (const row of jsonData) {
            // console.log(row);

            let BenchmarkName = row['benchmark'] || '';
            let BenchmarkCode = row['benchmark_code'] || '';
            let BenchmarkValue = row['benchmark_value'] || 0;
            let AltBenchmarkName = row['alt_benchmark'] || '';
            let AltBenchmarkCode = row['alt_benchmark_code'] || '';
            let AsOnDate = null;
            let FinalBenchmarkCode = row['final_benchmark'] || '';

            if (row['as_on_date'] != null && row['as_on_date'] != undefined) {
                AsOnDate = date.format(commonFunction.ExcelDateToJSDate(row['as_on_date']), 'YYYY-MM-DD');
            }

            console.log(BenchmarkCode + ' | ' + AsOnDate);

            try {
                await transaction.begin();

                const request = transaction.request();
                request.input("BenchmarkName", BenchmarkName)
                    .input("BenchmarkCode", BenchmarkCode)
                    .input("BenchmarkValue", BenchmarkValue)
                    .input("AltBenchmarkName", AltBenchmarkName)
                    .input("AltBenchmarkCode", AltBenchmarkCode)
                    .input("AsOnDate", AsOnDate)
                    .input("FinalBenchmarkCode", FinalBenchmarkCode);
                const result = await request.execute("InsertBenchmarkData");

                await transaction.commit();
            }
            catch (err) {
                console.log(err);
                try {
                    await transaction.rollback();
                } catch (sqlerr) {
                    console.log(sqlerr);
                }

                if (err.message.includes("UK_")) {
                    errorMessage = "Duplicate record. Record already exists.";
                }
            }
        }
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

exports.UploadBenchmarkDataISIN = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    const workBook = xlsx.read(req.files.documentFile.data);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        for (const row of jsonData) {
            // console.log(row);

            let SchemeCode = row['SCHEME CODE'] || '';
            let ISINDividend = row['ISINDIVIDEND'] || '';
            let ISINReinvest = row['ISINREINVEST'] || '';
            let Benchmark = row['BENCHMARK'] || '';
            let FinalBenchmarkCode = row['FINAL BENCHMARK CODE'] || '';

            console.log(SchemeCode + ' | ' + FinalBenchmarkCode);

            try {
                await transaction.begin();

                const request = transaction.request();
                request.input("SchemeCode", (SchemeCode == null) ? '' : SchemeCode)
                    .input("ISINDividend", (ISINDividend == null) ? '' : ISINDividend)
                    .input("ISINReinvest", (ISINReinvest == null) ? '' : ISINReinvest)
                    .input("Benchmark", (Benchmark == null) ? '' : Benchmark)
                    .input("FinalBenchmarkCode", (FinalBenchmarkCode == null) ? '' : FinalBenchmarkCode);
                const result = await request.execute("InsertBenchmarkDataISIN");

                await transaction.commit();
            }
            catch (err) {
                console.log(err);
                try {
                    await transaction.rollback();
                } catch (sqlerr) {
                    console.log(sqlerr);
                }

                if (err.message.includes("UK_")) {
                    errorMessage = "Duplicate record. Record already exists.";
                }
            }
        }
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

exports.ProcessPulseLabsBenchmarkData = async (req, res, recordDate) => {
    var currentDate = luxon.DateTime.now().setZone('Asia/Kolkata').minus({days: 2});

    if(recordDate != null)
    {
        currentDate = recordDate;
    }

    let authInputData = {
        partner: pulseLabsConfig.partner,
        key: pulseLabsConfig.key
    };

    var authHeaders = { 'Accept': 'application/json', 'Content-type': 'application/json' };

    var authOptions = {
        host: process.env.PULSELABS_API_LINK,
        path: '/rest/api/v1/partner_login',
        method: 'POST',
        headers: authHeaders,
        timeout: 30000,
    };

    try {
        var responseDataAuth = await commonFunction.SendRequest(authOptions, JSON.stringify(authInputData));

        var resultAuth = JSON.parse(responseDataAuth);
        // console.log(resultAuth);

        if (resultAuth.status.code == 200) {
            var authToken = resultAuth.data.auth;

            let inputData = {
                auth: authToken,
                date: currentDate.toFormat('yyyy-MM-dd')
            };

            var headers = { 'Accept': 'application/json', 'Content-type': 'application/json' };

            var options = {
                host: process.env.PULSELABS_API_LINK,
                path: '/rest/api/v1/mf/bm_data',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            try {
                var responseData = await commonFunction.SendRequest(options, JSON.stringify(inputData));

                var result = JSON.parse(responseData);
                console.log(result);

                if (result.status.code == 200) {
                    var data = result.data;

                    for (let i = 0; i < data.length; i++) {
                        var FinalBenchmarkCode = data[i].final_benchmark;
                        var BenchmarkValue = data[i].benchmark_value;
                        var AsOnDate = currentDate.toFormat('yyyy-MM-dd');

                        await savePulseLabsBenchmarkData(FinalBenchmarkCode, BenchmarkValue, AsOnDate);
                    }
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    }
    catch (err) {
        console.log(err);
    }
};

async function savePulseLabsBenchmarkData(FinalBenchmarkCode, BenchmarkValue, AsOnDate) {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input('FinalBenchmarkCode', FinalBenchmarkCode)
            .input('BenchmarkValue', BenchmarkValue)
            .input('AsOnDate', AsOnDate);

        const result = await request.execute("InsertPulseLabsBenchmarkData");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while saving pulse labs benchmark data...');
    }
};
