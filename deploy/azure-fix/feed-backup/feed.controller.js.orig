var https = require('https');
const fileSystem = require("fs");
const path = require('path');
const zip = require('node-7z');
const zipLib = require('7zip-bin');
const dbfFile = require('dbffile');
const xlsx = require('xlsx');
const date = require('date-and-time');
const imapFlow = require('imapflow');
const appPool = require("../models/db.model");
const CommonFunction = require('../models/commonfunction.model');
const clientConrtroller = require('../controllers/client.controller');
const cryptoEngine = require('../models/cryptoengine.model');
const importDataService = require("../models/importdataservice.model");
const luxon = require('luxon');
const xirr = require('node-irr');
const benchmarkdataController = require('../controllers/benchmarkdata.controller');

exports.ProcessCamsWbr9 = async (req, res) => {
    var recordDate = date.format(new Date(), 'YYYY-MM-DD');
    var recordSession = CommonFunction.GetUniqueId();
    var fileName = CommonFunction.GetUniqueId() + '.zip';

    console.log(`ProcessCamsWbr9: Step Read Email | ${new Date()} | Start`);
    var camsWbr9EmailResult = await readCamsWbr9Email(recordDate, recordSession);
    console.log(`ProcessCamsWbr9: Step Read Email | ${new Date()} | End`);

    if (camsWbr9EmailResult.Status == true) {
        console.log(`ProcessCamsWbr9: Step Read File | ${new Date()} | Start`);
        var readCamsWbr9FileResult = await readCamsWbr9File(fileName, camsWbr9EmailResult.Link, recordDate, recordSession);
        console.log(`ProcessCamsWbr9: Step Read File | ${new Date()} | End`);

        if (readCamsWbr9FileResult.Status == true) {
            console.log(`ProcessCamsWbr9: Step 1 | ${new Date()} | Start`);
            var updateFeedCamsTransactionUccFolioResult = await updateFeedCamsTransactionUccFolio(recordSession);
            console.log(`ProcessCamsWbr9: Step 1 | ${new Date()} | End`);

            console.log(`ProcessCamsWbr9: Step 2 | ${new Date()} | Start`);
            var rearrageTransactionUccFolioResult = await rearrageTransactionUccFolioList(recordSession, req, res);
            console.log(`ProcessCamsWbr9: Step 2 | ${new Date()} | End`);

            console.log(`ProcessCamsWbr9: Step 3 | ${new Date()} | Start`);
            var transactionUCCMissingPanResult = await transactionUCCMissingPan(recordSession);
            console.log(`ProcessCamsWbr9: Step 3 | ${new Date()} | End`);

            console.log(`ProcessCamsWbr9: Step 4 | ${new Date()} | Start`);
            var setUniqueandMismatchedPanResult = await setUniqueAndMismatchedPan(recordSession);
            console.log(`ProcessCamsWbr9: Step 4 | ${new Date()} | End`);

            console.log(`ProcessCamsWbr9: Step 5 | ${new Date()} | Start`);
            var setUniqueandMismatchedNameResult = await setUniqueAndMismatchedName(recordSession);
            console.log(`ProcessCamsWbr9: Step 5 | ${new Date()} | End`);

            console.log(`ProcessCamsWbr9: Step 6 | ${new Date()} | Start`);
            var setOtherInPendingListAllResult = await setOtherInPendingListAll(recordSession);
            console.log(`ProcessCamsWbr9: Step 6 | ${new Date()} | End`);

            console.log(`ProcessCamsWbr9: Step 7 | ${new Date()} | Start`);
            var finalArrarngeFolioInFolioListResult = await finalArrarngeFolioInFolioList(recordSession);
            console.log(`ProcessCamsWbr9: Step 7 | ${new Date()} | End`);

            console.log(`ProcessCamsWbr9: Step 8 | ${new Date()} | Start`);
            var transactionFolioListTaggingResult = await transactionFolioListTagging(recordSession);
            console.log(`ProcessCamsWbr9: Step 8 | ${new Date()} | End`);

            console.log(`ProcessCamsWbr9: Step 9 | ${new Date()} | Start`);
            var updateFeedUccResult = await updateFeedUcc();
            console.log(`ProcessCamsWbr9: Step 9 | ${new Date()} | End`);

            console.log(`ProcessCamsWbr9: Step 10 | ${new Date()} | Start`);
            var updateFeedDailyHoldingUccResult = await updateFeedDailyHoldingUcc();
            console.log(`ProcessCamsWbr9: Step 10 | ${new Date()} | End`);

            console.log(`ProcessCamsWbr9: Step 11 | ${new Date()} | Start`);
            var updateFeedTransactionUccResult = await updateFeedTransactionUcc();
            console.log(`ProcessCamsWbr9: Step 11 | ${new Date()} | End`);
        }
    }
};

//211
exports.ProcessKarvy311 = async (req, res) => {
    var recordDate = date.format(new Date(), 'YYYY-MM-DD');
    var recordSession = CommonFunction.GetUniqueId();
    var fileName = CommonFunction.GetUniqueId() + '.zip';

    console.log(`ProcessKarvy311: Step Read Email | ${new Date()} | Start`);
    var karvy311EmailResult = await readkarvy311Email(recordDate, recordSession);
    console.log(`ProcessKarvy311: Step Read Email | ${new Date()} | End`);

    if (karvy311EmailResult.Status == true) {
        console.log(`ProcessKarvy311: Step Read File | ${new Date()} | Start`);
        var readKarvy311FileResult = await readKarvy311File(fileName, karvy311EmailResult.Link, recordDate, recordSession);
        console.log(`ProcessKarvy311: Step Read File | ${new Date()} | End`);

        if (readKarvy311FileResult.Status == true) {
            console.log(`ProcessKarvy311: Step 1 | ${new Date()} | Start`);
            var updateFeedKarvyTransactionUccFolioResult = await updateFeedKarvyTransactionUccFolio(recordSession);
            console.log(`ProcessKarvy311: Step 1 | ${new Date()} | End`);

            console.log(`ProcessKarvy311: Step 2 | ${new Date()} | Start`);
            var rearrageTransactionUccFolioResult = await rearrageTransactionUccFolioList(recordSession, req, res);
            console.log(`ProcessKarvy311: Step 2 | ${new Date()} | End`);

            console.log(`ProcessKarvy311: Step 3 | ${new Date()} | Start`);
            var transactionUCCMissingPanResult = await transactionUCCMissingPan(recordSession);
            console.log(`ProcessKarvy311: Step 3 | ${new Date()} | End`);

            console.log(`ProcessKarvy311: Step 4 | ${new Date()} | Start`);
            var setUniqueandMismatchedPanResult = await setUniqueAndMismatchedPan(recordSession);
            console.log(`ProcessKarvy311: Step 4 | ${new Date()} | End`);

            console.log(`ProcessKarvy311: Step 5 | ${new Date()} | Start`);
            var setUniqueandMismatchedNameResult = await setUniqueAndMismatchedName(recordSession);
            console.log(`ProcessKarvy311: Step 5 | ${new Date()} | End`);

            console.log(`ProcessKarvy311: Step 6 | ${new Date()} | Start`);
            var setOtherInPendingListAllResult = await setOtherInPendingListAll(recordSession);
            console.log(`ProcessKarvy311: Step 6 | ${new Date()} | End`);

            console.log(`ProcessKarvy311: Step 7 | ${new Date()} | Start`);
            var finalArrarngeFolioInFolioListResult = await finalArrarngeFolioInFolioList(recordSession);
            console.log(`ProcessKarvy311: Step 7 | ${new Date()} | End`);

            console.log(`ProcessKarvy311: Step 8 | ${new Date()} | Start`);
            var transactionFolioListTaggingResult = await transactionFolioListTagging(recordSession);
            console.log(`ProcessKarvy311: Step 8 | ${new Date()} | End`);

            console.log(`ProcessKarvy311: Step 9 | ${new Date()} | Start`);
            var updateFeedUccResult = await updateFeedUcc();
            console.log(`ProcessKarvy311: Step 9 | ${new Date()} | End`);

            console.log(`ProcessKarvy311: Step 10 | ${new Date()} | Start`);
            var updateFeedTransactionUccResult = await updateFeedTransactionUcc();
            console.log(`ProcessKarvy311: Step 10 | ${new Date()} | End`);
        }
    }
};

exports.ProcessAmfiNav = async (req, res) => {
    var amfiCodeList = await getAmfiCodes();

    // amfiCodeList = amfiCodeList.filter(x => x.Code == 100669);

    for (let i = 0; i < amfiCodeList.length; i++) {
        var item = amfiCodeList[i];

        // console.log(item);

        var startDate = luxon.DateTime.fromObject({ year: 2025, month: 3, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 }, { zone: 'Asia/Kolkata' });

        if (item['NAVDate'] != null) {
            var sysNavDate = luxon.DateTime.fromISO(item['NAVDate'].toISOString(), { zone: 'Asia/Kolkata' });
            startDate = luxon.DateTime.fromObject({ year: sysNavDate.year, month: sysNavDate.month, day: sysNavDate.day, hour: 0, minute: 0, second: 0, millisecond: 0 }, { zone: 'Asia/Kolkata' });
            startDate = startDate.plus({ days: 1 });
        }

        var endDate = luxon.DateTime.now().setZone('Asia/Kolkata');

        try {
            var amfiData = await importDataService.GetAmfiNav(item['Code']);

            var data = amfiData.data;
            if (data != null) {
                for (let j = 0; j < data.length; j++) {
                    var navDate = luxon.DateTime.fromISO(data[j].date, { zone: 'Asia/Kolkata' });
                    if (navDate >= startDate && navDate <= endDate) {
                        await saveAmfiNav(navDate, amfiData.meta.scheme_code, amfiData.meta.scheme_name, '', '', item['ISIN'], data[j].nav, '');
                    }
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return amfiCodeList.length;
};

// exports.ProcessCamsWbr22 = async (req, res) => {
//     var fileName = CommonFunction.GetUniqueId() + '.zip';

//     console.log(`ProcessCamsWbr22: Step Read Email | ${new Date()} | Start`);
//     var camsWbr22EmailResult = await readCamsWbr22Email();
//     console.log(`ProcessCamsWbr22: Step Read Email | ${new Date()} | End`);

//     if (camsWbr22EmailResult.Status == true) {
//         console.log(`ProcessCamsWbr22: Step Read File | ${new Date()} | Start`);
//         var readCamsWbr22FileResult = await readCamsWbr22File(fileName, camsWbr22EmailResult.Link);
//         console.log(`ProcessCamsWbr22: Step Read File | ${new Date()} | End`);
//     }
// };

exports.ProcessKarvy203 = async (req, res) => {
    var fileName = CommonFunction.GetUniqueId() + '.zip';

    console.log(`ProcessKarvy203: Step Read Email | ${new Date()} | Start`);
    var karvy203EmailResult = await readkarvy203Email();
    console.log(`ProcessKarvy203: Step Read Email | ${new Date()} | End`);

    if (karvy203EmailResult.Status == true) {
        console.log(`ProcessKarvy203: Step Read File | ${new Date()} | Start`);
        var readKarvy203FileResult = await readKarvy203File(fileName, karvy203EmailResult.Link);
        console.log(`ProcessKarvy203: Step Read File | ${new Date()} | End`);

        console.log(`ProcessKarvy203: Step 1 | ${new Date()} | Start`);
        var updateFeedUccResult = await updateFeedUcc();
        console.log(`ProcessKarvy203: Step 1 | ${new Date()} | End`);

        console.log(`ProcessKarvy203: Step 2 | ${new Date()} | Start`);
        var updateFeedDailyHoldingUccResult = await updateFeedDailyHoldingUcc();
        console.log(`ProcessKarvy203: Step 2 | ${new Date()} | End`);
    }
};

//201
exports.ProcessKarvy307 = async (req, res) => {
    var recordDate = luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd');
    var recordSession = CommonFunction.GetUniqueId();
    var fileName = CommonFunction.GetUniqueId() + '.zip';

    console.log(`ProcessKarvy307: Step Read Email | ${new Date()} | Start`);
    var karvy307EmailResult = await readkarvy307Email(recordDate, recordSession);
    console.log(`ProcessKarvy307: Step Read Email | ${new Date()} | End`);

    if (karvy307EmailResult.Status == true) {
        console.log(`ProcessKarvy307: Step Read File | ${new Date()} | Start`);
        var readKarvy307FileResult = await readKarvy307File(fileName, karvy307EmailResult.Link, recordDate, recordSession);
        console.log(`ProcessKarvy307: Step Read File | ${new Date()} | End`);

        console.log(`ProcessKarvy307: Step 1 | ${new Date()} | Start`);
        var updateKarvyClientTransactionFolioUnitResult = await updateKarvyClientTransactionFolioUnit(recordSession);
        console.log(`ProcessKarvy307: Step 1 | ${new Date()} | End`);

        console.log(`ProcessKarvy307: Step 2 | ${new Date()} | Start`);
        var updateFeedUccResult = await updateFeedUcc();
        console.log(`ProcessKarvy307: Step 2 | ${new Date()} | End`);

        console.log(`ProcessKarvy307: Step 3 | ${new Date()} | Start`);
        var updateFeedTransactionUccResult = await updateFeedTransactionUcc();
        console.log(`ProcessKarvy307: Step 3 | ${new Date()} | End`);
    }
};

exports.ProcessCamsWbr2 = async (req, res) => {
    var recordDate = luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd');
    var recordSession = CommonFunction.GetUniqueId();
    var fileName = CommonFunction.GetUniqueId() + '.zip';

    console.log(`ProcessCamsWbr2: Step Read Email | ${new Date()} | Start`);
    var camsWbr2EmailResult = await readCamsWbr2Email(recordDate, recordSession);
    console.log(`ProcessCamsWbr2: Step Read Email | ${new Date()} | End`);

    if (camsWbr2EmailResult.Status == true) {
        console.log(`ProcessCamsWbr2: Step Read File | ${new Date()} | Start`);
        var readCamsWbr2FileResult = await readCamsWbr2File(fileName, camsWbr2EmailResult.Link, recordDate, recordSession);
        console.log(`ProcessCamsWbr2: Step Read File | ${new Date()} | End`);

        console.log(`ProcessCamsWbr2: Step 1 | ${new Date()} | Start`);
        var updateCamsClientTransactionFolioUnitResult = await updateCamsClientTransactionFolioUnit(recordSession);
        console.log(`ProcessCamsWbr2: Step 1 | ${new Date()} | End`);

        console.log(`ProcessCamsWbr2: Step 2 | ${new Date()} | Start`);
        var updateFeedTransactionUccResult = await updateFeedTransactionUcc();
        console.log(`ProcessCamsWbr2: Step 2 | ${new Date()} | End`);
    }
};

exports.ProcessCamsWbr2Manual = async (req, res, requestId) => {
    var recordDate = luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd');
    var recordSession = CommonFunction.GetUniqueId();
    var fileName = CommonFunction.GetUniqueId() + '.zip';

    console.log(`ProcessCamsWbr2: Step Read Email | ${new Date()} | Start`);
    var camsWbr2EmailResult = await readCamsWbr2EmailManual(recordDate, recordSession, requestId);
    console.log(`ProcessCamsWbr2: Step Read Email | ${new Date()} | End`);

    if (camsWbr2EmailResult.Status == true) {
        console.log(`ProcessCamsWbr2: Step Read File | ${new Date()} | Start`);
        var readCamsWbr2FileResult = await readCamsWbr2FileManual(fileName, camsWbr2EmailResult.Link, recordDate, recordSession);
        console.log(`ProcessCamsWbr2: Step Read File | ${new Date()} | End`);

        // console.log(`ProcessCamsWbr2: Step 1 | ${new Date()} | Start`);
        // var updateCamsClientTransactionFolioUnitResult = await updateCamsClientTransactionFolioUnit(recordSession);
        // console.log(`ProcessCamsWbr2: Step 1 | ${new Date()} | End`);

        // console.log(`ProcessCamsWbr2: Step 2 | ${new Date()} | Start`);
        // var updateFeedTransactionUccResult = await updateFeedTransactionUcc();
        // console.log(`ProcessCamsWbr2: Step 2 | ${new Date()} | End`);
    }
};

exports.ProcessCamsWbr2A = async (req, res) => {
    var recordDate = luxon.DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd');
    var recordSession = CommonFunction.GetUniqueId();
    var folderName = 'wbr2a';

    var wbr2aFolderPath = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'cams', folderName);

    var fileList = await listFiles(wbr2aFolderPath);

    var completedFiles = [];

    for (let a = 0; a < fileList.length; a++) {
        var dataFileName = fileList[a];
        var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'cams', 'wbr2a', dataFileName);

        var data = await readDataFile(dataFilePath);

        recordCount = data.length;

        for (let i = 0; i < recordCount; i++) {
            var row = data[i];

            // console.log(row);
            // break;

            // console.log('dataFileName: ' + dataFileName);

            var traddate = null;
            var postdate = null;
            var rep_date = null;
            var ticob_post = null;
            var sys_regn_d = null;
            var ca_initiat = null;

            if (row['TRADDATE'] != null && row['TRADDATE'] != undefined) {
                traddate = date.format(row['TRADDATE'], 'YYYY-MM-DD');
            }
            if (row['POSTDATE'] != null && row['POSTDATE'] != undefined) {
                postdate = date.format(row['POSTDATE'], 'YYYY-MM-DD');
            }
            if (row['REP_DATE'] != null && row['REP_DATE'] != undefined) {
                rep_date = date.format(row['REP_DATE'], 'YYYY-MM-DD');
            }

            if (row['TICOB_POST'] != null && row['TICOB_POST'] != undefined) {
                ticob_post = (row['TICOB_POST'].trim() == '') ? null : date.format(row['TICOB_POST'], 'YYYY-MM-DD');
                if (ticob_post != null && ticob_post.includes('Na')) {
                    ticob_post = null;
                }
            }
            if (row['SYS_REGN_D'] != null && row['SYS_REGN_D'] != undefined) {
                sys_regn_d = date.format(row['SYS_REGN_D'], 'YYYY-MM-DD');
                if (sys_regn_d.includes('Na')) {
                    sys_regn_d = null;
                }
            }
            if (row['CA_INITIAT'] != null && row['CA_INITIAT'] != undefined) {
                ca_initiat = date.format(row['CA_INITIAT'], 'YYYY-MM-DD');
                if (ca_initiat.includes('Na')) {
                    ca_initiat = null;
                }
            }

            var dataItem = {
                recno: row['RECNO'] || 0,
                amc_code: row['AMC_CODE'] || '',
                folio_no: row['FOLIO_NO'] || '',
                prodcode: row['PRODCODE'] || '',
                scheme: row['SCHEME'] || '',
                inv_name: row['INV_NAME'] || '',
                trxntype: row['TRXNTYPE'] || '',
                trxnno: row['TRXNNO'] || '',
                trxnmode: row['TRXNMODE'] || '',
                trxnstat: row['TRXNSTAT'] || '',
                usercode: row['USERCODE'] || '',
                usrtrxno: row['USRTRXNO'] || '',
                traddate: traddate,
                postdate: postdate,
                purprice: row['PURPRICE'] || 0,
                units: row['UNITS'] || 0,
                amount: row['AMOUNT'] || 0,
                brokcode: row['BROKCODE'] || '',
                subbrok: row['SUBBROK'] || '',
                brokperc: row['BROKPERC'] || 0,
                brokcomm: row['BROKCOMM'] || 0,
                altfolio: row['ALTFOLIO'] || '',
                rep_date: rep_date,
                time1: row['TIME1'] || '',
                trxnsubtyp: row['TRXNSUBTYP'] || '',
                applicatio: row['APPLICATIO'] || '',
                trxn_natur: row['TRXN_NATUR'] || '',
                tax: row['TAX'] || 0,
                total_tax: row['TOTAL_TAX'] || 0,
                te_15h: row['TE_15H'] || '',
                micr_no: row['MICR_NO'] || '',
                remarks: row['REMARKS'] || '',
                swflag: row['SWFLAG'] || '',
                old_folio: row['OLD_FOLIO'] || '',
                seq_no: row['SEQ_NO'] || '',
                reinvest_f: row['REINVEST_F'] || '',
                mult_brok: row['MULT_BROK'] || '',
                stt: row['STT'] || 0,
                location: row['LOCATION'] || '',
                scheme_typ: row['SCHEME_TYP'] || '',
                tax_status: row['TAX_STATUS'] || '',
                eload: row['LOAD'] || 0,
                scanrefno: row['SCANREFNO'] || '',
                pan: row['PAN'] || '',
                inv_iin: row['INV_IIN'] || 0,
                targ_src_s: row['TARG_SRC_S'] || '',
                trxn_type: row['TRXN_TYPE_'] || '',
                ticob_trty: row['TICOB_TRTY'] || '',
                ticob_trno: row['TICOB_TRNO'] || '',
                ticob_post: ticob_post,
                dp_id: row['DP_ID'] || '',
                trxn_charg: row['TRXN_CHARG'] || 0,
                eligib_amt: row['ELIGIB_AMT'] || 0,
                src_of_txn: row['SRC_OF_TXN'] || '',
                trxn_suffi: row['TRXN_SUFFI'] || '',
                siptrxnno: row['SIPTRXNNO'] || '',
                ter_locati: row['TER_LOCATI'] || '',
                euin: row['EUIN'] || '',
                euin_valid: row['EUIN_VALID'] || '',
                euin_opted: row['EUIN_OPTED'] || '',
                sub_brk_ar: row['SUB_BRK_AR'] || '',
                exch_dc_fl: row['EXCH_DC_FL'] || '',
                src_brk_co: row['SRC_BRK_CO'] || '',
                sys_regn_d: sys_regn_d,
                ac_no: row['AC_NO'] || '',
                bank_name: row['BANK_NAME'] || '',
                reversal_c: row['REVERSAL_C'] || 0,
                exchange_f: row['EXCHANGE_F'] || '',
                ca_initiat: ca_initiat,
                gst_state: row['GST_STATE_'] || '',
                igst_amoun: row['IGST_AMOUN'] || 0,
                cgst_amoun: row['CGST_AMOUN'] || 0,
                sgst_amoun: row['SGST_AMOUN'] || 0,
                rev_remark: row['REV_REMARK'] || '',
                original_t: row['ORIGINAL_T'] || '',
                stamp_duty: row['STAMP_DUTY'] || 0,
                folio_old: row['FOLIO_OLD'] || '',
                scheme_fol: row['SCHEME_FOL'] || '',
                amc_ref_no: row['AMC_REF_NO'] || '',
                request_re: row['REQUEST_RE'] || '',
                RecordDate: recordDate,
                RecordSession: recordSession,
            };

            // console.log(dataItem);
            await saveCamsWbr2aRecord(dataItem);

            var transactionType = '';
            if (dataItem["trxn_type"] == null) {
                transactionType = (dataItem["trxntype"] == null) ? '' : dataItem["trxntype"];
            }
            else {
                transactionType = dataItem["trxn_type"];

                if (transactionType == '') {
                    transactionType = (dataItem["trxntype"] == null) ? '' : dataItem["trxntype"];
                }
            }

            var recordItem = {
                FolioNumber: (dataItem["folio_no"] == null) ? '' : dataItem["folio_no"],
                ProductCode: (dataItem["prodcode"] == null) ? '' : dataItem["prodcode"],
                TradeDate: (dataItem["traddate"] == null) ? '' : dataItem["traddate"],
                TransactionNumber: (dataItem["scanrefno"] == null) ? '' : dataItem["scanrefno"],
                TransactionType: transactionType,
                AMCTransactionNumber: (dataItem["trxnno"] == null) ? '' : 'CAMS-' + dataItem["trxnno"],
                Units: (dataItem["units"] == null) ? '' : dataItem["units"],
                NAV: (dataItem["purprice"] == null) ? '' : dataItem["purprice"],
                Amount: (dataItem["amount"] == null) ? '' : dataItem["amount"],
                UniqueRefNo: 'C2-' + ((dataItem["trxnmode"] == null) ? '' : dataItem["trxnmode"].toString().trim()) + '-' + ((dataItem["trxnno"] == null) ? '' : dataItem["trxnno"].toString().trim()) + '-' + ((dataItem["usrtrxno"] == null) ? '' : dataItem["usrtrxno"].toString().trim()) + '-' + ((dataItem["seq_no"] == null) ? '' : dataItem["seq_no"].toString().trim())
            };

            // console.log(recordItem);

            await saveFeedTransaction(recordItem);

            // break;
        }

        completedFiles.push(dataFileName);

        // console.log(completedFiles);
        // break;
    }
};

exports.ProcessFeedTransaction = async (req, res) => {
    //Step 1: update purchaseredemptiontype 
    await updateFeedTransactionsPurchaseRedemptionType();
    console.log('Step 1: update purchaseredemptiontype completed');

    //Step 2: update days 
    await updateFeedTransactionDaysCount();
    console.log('Step 2: update days completed');

    //Step 3: update reverse entires
    await updateFeedTransactionReverseEntries();
    console.log('Step 3: update reverse entires completed');

    //Step 4: update unit reconciliation
    await updateFeedTransactionUnitReconciliation();
    console.log('Step 4: update unit reconciliation completed');

    //Step 5: update transfer out balance
    await updateFeedDailyHoldingTransferOutBalance();
    console.log('Step 5: update transfer out balance completed');

    //Step 6: update exit load
    await updateFeedTransactionExitLoad();
    console.log('Step 6: update exit load completed');

    //Step 7: update XIRR
    await updateFeedTransactionXIRR();
    await updateFeedTransactionXIRRNonAccount();
    console.log('Step 7: update XIRR completed');

    //Step 8: Process mismatch units
    await processFeedTransactionMismatchUnits();
    console.log('Step 8: mismatch unit process completed');

    //Step 9: Process benchmark data
    await processFeedTransactionBenchmarkData(req, res);
    console.log('Step 9: benchmark data process completed');
};

exports.ProcessAmfiIndiaNav = async (req, res) => {
    var recordDate = date.format(new Date(), 'YYYY-MM-DD');
    var recordSession = CommonFunction.GetUniqueId();
    var fileName = CommonFunction.GetUniqueId() + '.xlsx';

    var link = 'https://www.amfiindia.com/api/download-excel/latest-nav';

    console.log(`ProcessAmfiIndiaNav: Step Read File | ${new Date()} | Start`);
    var readAmfiIndiaNavFileResult = await readAmfiIndiaNavFile(fileName, link, recordDate, recordSession);
    console.log(`ProcessAmfiIndiaNav: Step Read File | ${new Date()} | End`);

    return readAmfiIndiaNavFileResult;
};

async function readCamsWbr9Email(recordDate, recordSession) {
    var link = '';

    const client = new imapFlow.ImapFlow({
        host: process.env.IMAP_HOST,
        port: 993,
        secure: true,
        auth: {
            user: process.env.IMAP_USER,
            pass: process.env.IMAP_PASSWORD
        }
    });

    await client.connect();

    let lock = await client.getMailboxLock('INBOX');

    try {
        // let message = await client.fetchOne(client.mailbox.exists, { source: true });
        // console.log(message.source.toString());

        let messageList = await client.search({
            seen: false, or: [
                { subject: 'WBR9. Investor Static details feed - CRMS Format, Request Id:185561564R9' }
            ]
        }, { uid: false });

        if (messageList.length > 0) {
            // console.log(messageList[0].toString());
            let message = await client.fetchOne(messageList[0].toString(), { uid: false, source: true });
            // console.log(message.source.toString());
            // const pdfFilePath = path.join(__dirname.replace("app", "public"), '..', 'documents', CommonFunction.GetUniqueId()+'.txt');
            // fileSystem.writeFileSync(pdfFilePath,message.source.toString().trim().replaceAll('=\r\n',''));

            var downloadUrlBreak = message.source.toString('utf8').trim().replaceAll('=\r\n', '').split('DownloadURL');
            if (downloadUrlBreak.length > 0) {
                var anchorBreak = downloadUrlBreak[1].split("href=3D'");

                if (anchorBreak.length > 0) {
                    var anchorBreakEnd = anchorBreak[1].split("'>");

                    if (anchorBreakEnd.length > 0) {
                        link = anchorBreakEnd[0].trim();
                    }
                }
            }

            if (link != '') {
                var messages = [];
                messages.push(messageList[0]);

                await client.messageFlagsAdd(messages, ['\\Seen'], { uid: false });
            }
        }
    }
    catch (err) {
        console.log(err);
    }
    finally {
        lock.release();
    }

    await client.logout();

    return { Status: (link != ''), Link: link };
};

async function readkarvy311Email(recordDate, recordSession) {
    var link = '';

    const client = new imapFlow.ImapFlow({
        host: process.env.IMAP_HOST,
        port: 993,
        secure: true,
        auth: {
            user: process.env.IMAP_USER,
            pass: process.env.IMAP_PASSWORD
        }
    });

    await client.connect();

    let lock = await client.getMailboxLock('INBOX');

    try {
        // let message = await client.fetchOne(client.mailbox.exists, { source: true });
        // console.log(message.source.toString());

        let messageList = await client.search({
            seen: false, or: [
                { subject: 'Subscribed Master AUM/Investor Master Details Report for Ref. No. : WBMST3980681' }
            ]
        }, { uid: false });

        if (messageList.length > 0) {
            // console.log(messageList[0].toString());
            let message = await client.fetchOne(messageList[0].toString(), { uid: false, source: true });
            // console.log(message.source.toString());
            // const pdfFilePath = path.join(__dirname.replace("app", "public"), '..', 'documents', CommonFunction.GetUniqueId()+'.txt');
            // fileSystem.writeFileSync(pdfFilePath,message.source.toString().trim().replaceAll('=\r\n', ''));

            var downloadUrlBreak = message.source.toString('utf8').trim().replaceAll('=\r\n', '').split('mfs.kfintech.com</a>.');
            if (downloadUrlBreak.length > 0) {
                // console.log(downloadUrlBreak[1]);
                var anchorBreak = downloadUrlBreak[1].split('href=3D"');

                if (anchorBreak.length > 0) {
                    // console.log(anchorBreak[1].trim());

                    var anchorBreakEnd = anchorBreak[1].trim().split('" target');

                    if (anchorBreakEnd.length > 0) {
                        link = anchorBreakEnd[0].trim().replaceAll('3D', '');
                        // console.log(link);
                    }
                }
            }

            if (link != '') {
                var messages = [];
                messages.push(messageList[0]);

                await client.messageFlagsAdd(messages, ['\\Seen'], { uid: false });
            }
        }
    }
    catch (err) {
        console.log(err);
    }
    finally {
        lock.release();
    }

    await client.logout();

    return { Status: (link != ''), Link: link };
};

async function readCamsWbr9File(fileName, link, recordDate, recordSession) {
    var filePath = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'cams', fileName);
    var wbrFolder = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'cams', 'wbr9');
    var recordCount = 0

    var downloadFileResult = await downloadCamsWbr9File(link, filePath);

    if (downloadFileResult.Status == true) {
        var extractFileResult = await extractCamsWbr9ZipFile(filePath, wbrFolder);
        var resetResult = await resetCamsWbr9();

        if (extractFileResult.DataFileName != '' && resetResult.Status == true) {
            var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'cams', 'wbr9', extractFileResult.DataFileName);

            var data = await readDataFile(dataFilePath);

            recordCount = data.length;

            for (let i = 0; i < recordCount; i++) {
                // console.log(data[i]);

                await saveCamsWbr9Record(data[i], recordDate, recordSession);
                await saveCamsClientAUMRecord(data[i]);
            }
        }
    }

    return { Status: (recordCount != 0), RecordCount: recordCount };
};

async function readKarvy311File(fileName, link, recordDate, recordSession) {
    var filePath = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'karvy', fileName);
    var mfsdFolder = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'karvy', 'mfsd311');
    var recordCount = 0

    var downloadFileResult = await downloadKarvy311File(link, filePath);

    if (downloadFileResult.Status == true) {
        var extractFileResult = await extractKarvy311ZipFile(filePath, mfsdFolder);
        var resetResult = await resetKarvy311();

        if (extractFileResult.DataFileName != '' && resetResult.Status == true && extractFileResult.DataFileName.includes('.dbf')) {
            var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'karvy', 'mfsd311', extractFileResult.DataFileName);

            var data = await readDataFile(dataFilePath);

            recordCount = data.length;

            for (let i = 0; i < recordCount; i++) {
                await saveKarvy311Record(data[i], recordDate, recordSession);
            }
        }
        else if (extractFileResult.DataFileName != '' && resetResult.Status == true && extractFileResult.DataFileName.includes('.csv')) {
            var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'karvy', 'mfsd311', extractFileResult.DataFileName);

            const workBook = xlsx.readFile(dataFilePath);
            const workSheet = workBook.Sheets[workBook.SheetNames[0]];
            const jsonData = xlsx.utils.sheet_to_json(workSheet);

            recordCount = jsonData.length;

            for (const row of jsonData) {
                var dataItem = {
                    PRCODE: row['Product Code'] || '',
                    FUND: row['Fund'] || '',
                    ACNO: row['Folio'] || '',
                    FUNDDESC: row['Fund Description'] || '',
                    INVNAME: row['Investor Name'] || '',
                    JTNAME1: row['Joint Name 1'] || '',
                    JTNAME2: row['Joint Name 2'] || '',
                    ADD1: row['Address #1'] || '',
                    ADD2: row['Address #2'] || '',
                    ADD3: row['Address #3'] || '',
                    CITY: row['City'] || '',
                    PIN: row['Pincode'] || '',
                    STATE: row['State'] || '',
                    COUNTRY: row['Country'] || '',
                    TPIN: row['TPIN'] || '',
                    DOB: (row['Date of Birth'] != null && row['Date of Birth'] != undefined) ? CommonFunction.ConvertDateDMYToYMD(row['Date of Birth'], '-') : null,
                    FNAME: row['F Name'] || '',
                    MNAME: row['M Name'] || '',
                    RPHONE: row['Phone Residence'] || '',
                    PH_RES1: row['Phone Res#1'] || '',
                    PH_RES2: row['Phone Res#2'] || '',
                    OPHONE: row['Phone Office'] || '',
                    PH_OFF1: row['Phone Off#1'] || '',
                    PH_OFF2: row['Phone Off#2'] || '',
                    FAX: row['Fax Residence'] || '',
                    FAX_OFF: row['Fax Office'] || '',
                    STATUS: row['Tax Status'] || '',
                    OCCPN: row['Occ Code'] || '',
                    EMAIL: row['Email'] || '',
                    BNKACNO: row['BankAccno'] || '',
                    BNAME: row['Bank Name'] || '',
                    BNKACTYPE: row['Account Type'] || '',
                    BRANCH: row['Branch'] || '',
                    BADD1: row['Bank Address #1'] || '',
                    BADD2: row['Bank Address #2'] || '',
                    BADD3: row['Bank Address #3'] || '',
                    BCITY: row['Bank City'] || '',
                    BPHONE: row['Bank Phone'] || '',
                    BSTATE: row['Bank State'] || '',
                    BCOUNTRY: row['Bank Country'] || '',
                    INV_ID: row['Investor ID'] || '',
                    BROKCODE: row['Broker Code'] || '',
                    CRDATE: (row['Report Date'] != null && row['Report Date'] != undefined) ? CommonFunction.ConvertDateDMYToYMD(row['Report Date'], '-') : null,
                    CRTIME: row['Report Time'] || '',
                    PANGNO: row['PAN Number'] || '',
                    MOBILE: row['Mobile Number'] || '',
                    DIVOPT: row['Dividend Option'] || '',
                    OCCP_DESC: row['Occupation Description'] || '',
                    MODEOFHOLD: row['Mode of Holding Description'] || '',
                    MAPIN: row['Mapin Id'] || '',
                    PAN2: row['PAN2'] || '',
                    PAN3: row['PAN3'] || '',
                    IMCATEGORY: row['Category'] || '',
                    GUARDIANN0: row['GuardianName'] || '',
                    NOMINEE: row['Nominee'] || '',
                    CLIENTID: row['Client ID'] || '',
                    DPID: row['DPID'] || '',
                    CATEGORYD1: row['CategoryDesc'] || '',
                    STATUSDESC: row['StatusDesc'] || '',
                    IFSC: row['IFSC Code'] || '',
                    NOMINEE2: row['Nominee2'] || '',
                    NOMINEE3: row['Nominee3'] || '',
                    KYC1FLAG: row['Kyc1Flag'] || '',
                    KYC2FLAG: row['Kyc2Flag'] || '',
                    KYC3FLAG: row['Kyc3Flag'] || '',
                    GUARDPANNO: row['GuardPanNo'] || '',
                    LASTUPDAT2: (row['LastUpdatedDate'] != null && row['LastUpdatedDate'] != undefined) ? CommonFunction.ConvertDateDMYToYMD(row['LastUpdatedDate'], '-') : null,
                    CAN: row['CommonAccNo'] || '',
                    NOMINEEREL: row['Nominee Relation'] || '',
                    NOMINEE2R3: row['Nominee2 Relation'] || '',
                    NOMINEE3R4: row['Nominee3 Relation'] || '',
                    NOMINEERA5: row['Nominee Ratio'] || '',
                    NOMINEE2R6: row['Nominee2 Ratio'] || '',
                    NOMINEE3R7: row['Nominee3 Ratio'] || '',
                    ADRH1INFO: row['Holder 1 Aadhaar info'] || '',
                    ADRH2INFO: row['Holder 2 Aadhaar info'] || '',
                    ADRH3NFO: row['Holder 3 Aadhaar info'] || '',
                    ADRGINFO: row['Guardian Aadhaar info'] || '',
                    NOMINEE_A8: row['Nominee Address1'] || '',
                    NOMINEE_A9: row['Nominee Address2'] || '',
                    NOMINEEG10: row['Nominee Address3'] || '',
                    NOMINEE_11: row['Nominee City'] || '',
                    NOMINEE_12: row['Nominee State'] || '',
                    NOMINEE_13: row['Nominee Pin code'] || '',
                    NOMINEE_14: row['Nominee phone residence'] || '',
                    NOMINEE_15: row['Nominee Email'] || '',
                    NOMINEE_16: row['Nominee2 Address1'] || '',
                    NOMINEE217: row['Nominee2 Address2'] || '',
                    NOMINEE218: row['Nominee2 Address3'] || '',
                    NOMINEE219: row['Nominee2 City'] || '',
                    NOMINEE220: row['Nominee2 State'] || '',
                    NOMINEE221: row['Nominee2 Pin code'] || '',
                    NOMINEE222: row['Nominee2 phone residence'] || '',
                    NOMINEE223: row['Nominee2 Email'] || '',
                    NOMINEE224: row['Nominee3 Address1'] || '',
                    NOMINEE325: row['Nominee3 Address2'] || '',
                    NOMINEE326: row['Nominee3 Address3'] || '',
                    NOMINEE327: row['Nominee3 City'] || '',
                    NOMINEE328: row['Nominee3 State'] || '',
                    NOMINEE329: row['Nominee3 Pin code'] || '',
                    NOMINEE330: row['Nominee3 phone residence'] || '',
                    NOMINEE331: row['Nominee3 Email'] || '',
                    CKYC_NO: row['CKYC NO'] || '',
                    JH1_CKYC: row['JH1 CKYC'] || '',
                    JH2_CKYC: row['JH2 CKYC'] || '',
                    GUARDIAN33: row['Guardian CKYC NO'] || '',
                    JOINT_HO34: row['Joint Holder 1st Resi Phone No'] || '',
                    JOINT_HO35: row['Joint Holder 2nd Resi Phone No'] || '',
                    INVESTOR36: row['Investors Resi FaxNo'] || '',
                    KYCGFLAG: row['KycGFlag'] || ''
                };
                await saveKarvy311Record(dataItem, recordDate, recordSession);
            }
        }
    }

    return { Status: (recordCount != 0), RecordCount: recordCount };
};

async function downloadCamsWbr9File(link, filePath) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

    return new Promise((resolve, reject) => {
        var file = fileSystem.createWriteStream(filePath);
        var request = https.get(link, function (response) {
            response.pipe(file);

            file.on('finish', async function () {
                file.close();

                resolve({ Status: true, Message: 'File is created at ' + filePath });
            });
        }).on('error', function (err) {
            fileSystem.unlink(filePath, (err) => { });
            reject(err.message);
        });
    });
};

async function downloadKarvy311File(link, filePath) {
    // console.log(link);
    return new Promise((resolve, reject) => {
        var file = fileSystem.createWriteStream(filePath);
        var request = https.get(link, function (response) {
            if (response.statusCode == 302) {
                let downloadLink = response.headers.location;
                // console.log(downloadLink);
                var request1 = https.get(downloadLink, function (res) {
                    // console.log(res.statusCode);
                    // console.log(res.headers);
                    let downloadLink1 = res.headers.location;
                    var request2 = https.get(downloadLink1, function (res1) {
                        // console.log(res1.statusCode);
                        // console.log(res1.headers);
                        res1.pipe(file);

                        file.on('finish', async function () {
                            file.close();

                            resolve({ Status: true, Message: 'File is created at ' + filePath });
                        });
                    }).on('error', function (err) {
                        fileSystem.unlink(filePath, (err) => { });
                        reject(err.message);
                    });

                }).on('error', function (err) {
                    fileSystem.unlink(filePath, (err) => { });
                    reject(err.message);
                });
            }
            // console.log(response.headers);
        }).on('error', function (err) {
            fileSystem.unlink(filePath, (err) => { });
            reject(err.message);
        });
    });
};

async function extractCamsWbr9ZipFile(filePath, wbrFolder) {
    return new Promise((resolve, reject) => {
        var dbfFileName = '';

        const zipStream = zip.extractFull(filePath, wbrFolder, {
            password: 'Punit@0516',
            $bin: zipLib.path7za
        });

        zipStream.on('data', function (data) {
            if (data.status == 'extracted') {
                dbfFileName = data.file;
            }
        });

        zipStream.on('end', () => {
            // Do stuff with unzipped content
            resolve({ Status: true, Message: 'File is extracted at ' + wbrFolder, DataFileName: dbfFileName });
        });

        zipStream.on('error', (err) => {
            reject(err);
        });
    });
};

async function extractKarvy311ZipFile(filePath, mfsdFolder) {
    return new Promise((resolve, reject) => {
        var dbfFileName = '';

        const zipStream = zip.extractFull(filePath, mfsdFolder, {
            password: 'Laksh@0802',
            $bin: zipLib.path7za
        });
        // const zipStream = zip.extractFull(filePath, mfsdFolder, {
        //     password: 'Punit@0516',
        //     $bin: zipLib.path7za
        // });

        zipStream.on('data', function (data) {
            if (data.status == 'extracted') {
                dbfFileName = data.file;
            }
        });

        zipStream.on('end', () => {
            // Do stuff with unzipped content
            resolve({ Status: true, Message: 'File is extracted at ' + mfsdFolder, DataFileName: dbfFileName });
        });

        zipStream.on('error', (err) => {
            reject(err);
        });
    });
};

async function resetCamsWbr9() {
    var errorMessage = "Error while resetting cams wbr9...";

    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        const result = await request.execute("DeleteFeedCamsWbr9");

        await transaction.commit();

        return { Status: true, Message: 'Cams Wbr9 reset successful...' };
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        return { Status: false, Message: 'Cams Wbr9 reset failed...' };
    }
};

async function resetKarvy311() {
    var errorMessage = "Error while resetting karvy311...";

    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        const result = await request.execute("DeleteFeedKarvy311");

        await transaction.commit();

        return { Status: true, Message: 'Karvy311 reset successful...' };
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        return { Status: false, Message: 'Karvy311 reset failed...' };
    }
};

async function readDataFile(dataFileName) {
    var data = [];

    let dbf = await dbfFile.DBFFile.open(dataFileName);

    for await (const record of dbf) data.push(record);

    return data;
};

async function saveCamsWbr9Record(record, recordDate, recordSession) {
    let pool = await appPool.connect();

    var rep_date = null;
    var inv_dob = null;
    var folio_date = null;
    var jh1_dob = null;
    var jh2_dob = null;
    var guardian_d = null;

    if (record["REP_DATE"] != null && record["REP_DATE"] != undefined) {
        rep_date = date.format(record["REP_DATE"], 'YYYY-MM-DD');
    }
    if (record["INV_DOB"] != null && record["INV_DOB"] != undefined) {
        inv_dob = date.format(record["INV_DOB"], 'YYYY-MM-DD');
    }
    if (record["FOLIO_DATE"] != null && record["FOLIO_DATE"] != undefined) {
        folio_date = date.format(record["FOLIO_DATE"], 'YYYY-MM-DD');
    }
    if (record["JH1_DOB"] != null && record["JH1_DOB"] != undefined) {
        jh1_dob = date.format(record["JH1_DOB"], 'YYYY-MM-DD');
    }
    if (record["JH2_DOB"] != null && record["JH2_DOB"] != undefined) {
        jh2_dob = date.format(record["JH2_DOB"], 'YYYY-MM-DD');
    }
    if (record["GUARDIAN_D"] != null && record["GUARDIAN_D"] != undefined) {
        guardian_d = date.format(record["GUARDIAN_D"], 'YYYY-MM-DD');
    }

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("AssociateId", 0)
            .input("refer_id", '')
            .input("foliochk", record["FOLIOCHK"])
            .input("inv_name", record["INV_NAME"])
            .input("address1", record["ADDRESS1"])
            .input("address2", record["ADDRESS2"])
            .input("address3", record["ADDRESS3"])
            .input("city", record["CITY"])
            .input("pincode", record["PINCODE"])
            .input("product", record["PRODUCT"])
            .input("sch_name", record["SCH_NAME"])
            .input("rep_date", rep_date)
            .input("clos_bal", (record["CLOS_BAL"] == null) ? 0 : record["CLOS_BAL"])
            .input("rupee_bal", (record["RUPEE_BAL"] == null) ? 0 : record["RUPEE_BAL"])
            .input("jnt_name1", record["JNT_NAME1"])
            .input("jnt_name2", record["JNT_NAME2"])
            .input("phone_off", record["PHONE_OFF"])
            .input("phone_res", record["PHONE_RES"])
            .input("email", record["EMAIL"])
            .input("holding_na", record["HOLDING_NA"])
            .input("uin_no", record["UIN_NO"])
            .input("pan_no", record["PAN_NO"])
            .input("joint1_pan", record["JOINT1_PAN"])
            .input("joint2_pan", record["JOINT2_PAN"])
            .input("guard_pan", record["GUARD_PAN"])
            .input("tax_status", record["TAX_STATUS"])
            .input("broker_cod", record["BROKER_COD"])
            .input("subbroker", record["SUBBROKER"])
            .input("reinv_flag", record["REINV_FLAG"])
            .input("bank_name", record["BANK_NAME"])
            .input("branch", record["BRANCH"])
            .input("ac_type", record["AC_TYPE"])
            .input("ac_no", record["AC_NO"])
            .input("b_address1", record["B_ADDRESS1"])
            .input("b_address2", record["B_ADDRESS2"])
            .input("b_address3", record["B_ADDRESS3"])
            .input("b_city", record["B_CITY"])
            .input("b_pincode", record["B_PINCODE"])
            .input("inv_dob", inv_dob)
            .input("mobile_no", record["MOBILE_NO"])
            .input("occupation", record["OCCUPATION"])
            .input("inv_iin", record["INV_IIN"])
            .input("nom_name", record["NOM_NAME"])
            .input("relation", record["RELATION"])
            .input("nom_addr1", record["NOM_ADDR1"])
            .input("nom_addr2", record["NOM_ADDR2"])
            .input("nom_addr3", record["NOM_ADDR3"])
            .input("nom_city", record["NOM_CITY"])
            .input("nom_state", record["NOM_STATE"])
            .input("nom_pincod", record["NOM_PINCOD"])
            .input("nom_ph_off", record["NOM_PH_OFF"])
            .input("nom_ph_res", record["NOM_PH_RES"])
            .input("nom_email", record["NOM_EMAIL"])
            .input("nom_percen", (record["NOM_PERCEN"] == null) ? 0 : record["NOM_PERCEN"])
            .input("nom2_name", record["NOM2_NAME"])
            .input("nom2_relat", record["NOM2_RELAT"])
            .input("nom2_addr1", record["NOM2_ADDR1"])
            .input("nom2_addr2", record["NOM2_ADDR2"])
            .input("nom2_addr3", record["NOM2_ADDR3"])
            .input("nom2_city", record["NOM2_CITY"])
            .input("nom2_state", record["NOM2_STATE"])
            .input("nom2_pinco", record["NOM2_PINCO"])
            .input("nom2_ph_of", record["NOM2_PH_OF"])
            .input("nom2_ph_re", record["NOM2_PH_RE"])
            .input("nom2_email", record["NOM2_EMAIL"])
            .input("nom2_perce", (record["NOM2_PERCE"] == null) ? 0 : record["NOM2_PERCE"])
            .input("nom3_name", record["NOM3_NAME"])
            .input("nom3_relat", record["NOM3_RELAT"])
            .input("nom3_addr1", record["NOM3_ADDR1"])
            .input("nom3_addr2", record["NOM3_ADDR2"])
            .input("nom3_addr3", record["NOM3_ADDR3"])
            .input("nom3_city", record["NOM3_CITY"])
            .input("nom3_state", record["NOM3_STATE"])
            .input("nom3_pinco", record["NOM3_PINCO"])
            .input("nom3_ph_of", record["NOM3_PH_OF"])
            .input("nom3_ph_re", record["NOM3_PH_RE"])
            .input("nom3_email", record["NOM3_EMAIL"])
            .input("nom3_perce", (record["NOM3_PERCE"] == null) ? 0 : record["NOM3_PERCE"])
            .input("ifsc_code", record["IFSC_CODE"])
            .input("dp_id", record["DP_ID"])
            .input("demat", record["DEMAT"])
            .input("guard_name", record["GUARD_NAME"])
            .input("brokcode", record["BROKCODE"])
            .input("subborker", '')
            .input("folio_date", folio_date)
            .input("aadhaar", record["AADHAAR"])
            .input("tpa_linked", record["TPA_LINKED"])
            .input("fh_ckyc_no", record["FH_CKYC_NO"])
            .input("jh1_ckyc", record["JH1_CKYC"])
            .input("jh2_ckyc", record["JH2_CKYC"])
            .input("g_ckyc_no", record["G_CKYC_NO"])
            .input("jh1_dob", jh1_dob)
            .input("jh2_dob", jh2_dob)
            .input("guardian_d", guardian_d)
            .input("amc_code", record["AMC_CODE"])
            .input("gst_state", record["GST_STATE_"])
            .input("folio_old", record["FOLIO_OLD"])
            .input("scheme_fol", record["SCHEME_FOL"])
            .input("RecordDate", recordDate)
            .input("RecordSession", recordSession);

        const result = await request.execute("InsertFeedCamsWbr9");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while saving cams wbr9 record...');
    }
};

async function saveKarvy311Record(record, recordDate, recordSession) {
    let pool = await appPool.connect();

    var date_of_birth = null;
    var report_date = null;
    var lastupdateddate = null;

    if (record["DOB"] != null && record["DOB"] != undefined) {
        date_of_birth = date.format(new Date(record["DOB"]), 'YYYY-MM-DD');
    }
    if (record["CRDATE"] != null && record["CRDATE"] != undefined) {
        report_date = date.format(new Date(record["CRDATE"]), 'YYYY-MM-DD');
    }
    if (record["LASTUPDAT2"] != null && record["LASTUPDAT2"] != undefined) {
        lastupdateddate = date.format(new Date(record["LASTUPDAT2"]), 'YYYY-MM-DD');
    }

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("AssociateId", 0)
            .input("refer_id", '')
            .input("product_code", (record["PRCODE"] == null) ? '' : record["PRCODE"])
            .input("fund", (record["FUND"] == null) ? '' : record["FUND"])
            .input("folio", (record["ACNO"] == null) ? '' : record["ACNO"])
            .input("code", '')
            .input("fund_description", (record["FUNDDESC"] == null) ? '' : record["FUNDDESC"])
            .input("investor_name", (record["INVNAME"] == null) ? '' : record["INVNAME"])
            .input("joint_name_1", (record["JTNAME1"] == null) ? '' : record["JTNAME1"])
            .input("joint_name_2", (record["JTNAME2"] == null) ? '' : record["JTNAME2"])
            .input("address1", (record["ADD1"] == null) ? '' : record["ADD1"])
            .input("address2", (record["ADD2"] == null) ? '' : record["ADD2"])
            .input("address3", (record["ADD3"] == null) ? '' : record["ADD3"])
            .input("city", (record["CITY"] == null) ? '' : record["CITY"])
            .input("pincode", (record["PIN"] == null) ? '' : record["PIN"])
            .input("state", (record["STATE"] == null) ? '' : record["STATE"])
            .input("country", (record["COUNTRY"] == null) ? '' : record["COUNTRY"])
            .input("tpin", (record["TPIN"] == null) ? '' : record["TPIN"])
            .input("date_of_birth", date_of_birth)
            .input("f_name", (record["FNAME"] == null) ? '' : record["FNAME"])
            .input("m_name", (record["MNAME"] == null) ? '' : record["MNAME"])
            .input("phone_residence", (record["RPHONE"] == null) ? '' : record["RPHONE"])
            .input("phone_res1", (record["PH_RES1"] == null) ? '' : record["PH_RES1"])
            .input("phone_res2", (record["PH_RES2"] == null) ? '' : record["PH_RES2"])
            .input("phone_office", (record["OPHONE"] == null) ? '' : record["OPHONE"])
            .input("phone_off1", (record["PH_OFF1"] == null) ? '' : record["PH_OFF1"])
            .input("phone_off2", (record["PH_OFF2"] == null) ? '' : record["PH_OFF2"])
            .input("fax_residence", (record["FAX"] == null) ? '' : record["FAX"])
            .input("fax_office", (record["FAX_OFF"] == null) ? '' : record["FAX_OFF"])
            .input("tax_status", (record["STATUS"] == null) ? '' : record["STATUS"])
            .input("occ_code", (record["OCCPN"] == '' || record["OCCPN"] == null) ? 0 : record["OCCPN"])
            .input("email", (record["EMAIL"] == null) ? '' : record["EMAIL"])
            .input("bankaccno", (record["BNKACNO"] == null) ? '' : record["BNKACNO"])
            .input("bank_name", (record["BNAME"] == null) ? '' : record["BNAME"])
            .input("account_type", (record["BNKACTYPE"] == null) ? '' : record["BNKACTYPE"])
            .input("branch", (record["BRANCH"] == null) ? '' : record["BRANCH"])
            .input("bank_address1", (record["BADD1"] == null) ? '' : record["BADD1"])
            .input("bank_address2", (record["BADD2"] == null) ? '' : record["BADD2"])
            .input("bank_address3", (record["BADD3"] == null) ? '' : record["BADD3"])
            .input("bank_city", (record["BCITY"] == null) ? '' : record["BCITY"])
            .input("bank_phone", (record["BPHONE"] == null) ? '' : record["BPHONE"])
            .input("bank_state", (record["BSTATE"] == null) ? '' : record["BSTATE"])
            .input("bank_country", (record["BCOUNTRY"] == null) ? '' : record["BCOUNTRY"])
            .input("investor_id", (record["INV_ID"] == null) ? '' : record["INV_ID"])
            .input("broker_code", (record["BROKCODE"] == null) ? '' : record["BROKCODE"])
            .input("report_date", report_date)
            .input("report_time", (record["CRTIME"] == null) ? '' : record["CRTIME"])
            .input("pan_number", (record["PANGNO"] == null) ? '' : record["PANGNO"])
            .input("mobile_number", (record["MOBILE"] == null) ? '' : record["MOBILE"])
            .input("dividend_option", (record["DIVOPT"] == null) ? '' : record["DIVOPT"])
            .input("occupation_description", (record["OCCP_DESC"] == null) ? '' : record["OCCP_DESC"])
            .input("mode_of_holding_description", (record["MODEOFHOLD"] == null) ? '' : record["MODEOFHOLD"])
            .input("mapin_id", (record["MAPIN"] == null) ? '' : record["MAPIN"])
            .input("pan2", (record["PAN2"] == null) ? '' : record["PAN2"])
            .input("pan3", (record["PAN3"] == null) ? '' : record["PAN3"])
            .input("category", (record["IMCATEGORY"] == '' || record["IMCATEGORY"] == null) ? 0 : record["IMCATEGORY"])
            .input("guardianname", (record["GUARDIANN0"] == null) ? '' : record["GUARDIANN0"])
            .input("nominee", (record["NOMINEE"] == null) ? '' : record["NOMINEE"])
            .input("client_id", (record["CLIENTID"] == null) ? '' : record["CLIENTID"])
            .input("dpid", (record["DPID"] == null) ? '' : record["DPID"])
            .input("categorydesc", (record["CATEGORYD1"] == null) ? '' : record["CATEGORYD1"])
            .input("statusdesc", (record["STATUSDESC"] == null) ? '' : record["STATUSDESC"])
            .input("ifsc_code", (record["IFSC"] == null) ? '' : record["IFSC"])
            .input("nominee2", (record["NOMINEE2"] == null) ? '' : record["NOMINEE2"])
            .input("nominee3", (record["NOMINEE3"] == null) ? '' : record["NOMINEE3"])
            .input("kyc1flag", (record["KYC1FLAG"] == null) ? '' : record["KYC1FLAG"])
            .input("kyc2flag", (record["KYC2FLAG"] == null) ? '' : record["KYC2FLAG"])
            .input("kyc3flag", (record["KYC3FLAG"] == null) ? '' : record["KYC3FLAG"])
            .input("guardpanno", (record["GUARDPANNO"] == null) ? '' : record["GUARDPANNO"])
            .input("lastupdateddate", lastupdateddate)
            .input("commonaccno", (record["CAN"] == null) ? '' : record["CAN"])
            .input("nominee_relation", (record["NOMINEEREL"] == null) ? '' : record["NOMINEEREL"])
            .input("nominee2_relation", (record["NOMINEE2R3"] == null) ? '' : record["NOMINEE2R3"])
            .input("nominee3_relation", (record["NOMINEE3R4"] == null) ? '' : record["NOMINEE3R4"])
            .input("nominee_ratio", (record["NOMINEERA5"] == '' || record["NOMINEERA5"] == null) ? 0 : record["NOMINEERA5"])
            .input("nominee2_ratio", (record["NOMINEE2R6"] == '' || record["NOMINEE2R6"] == null) ? 0 : record["NOMINEE2R6"])
            .input("nominee3_ratio", (record["NOMINEE3R7"] == '' || record["NOMINEE3R7"] == null) ? 0 : record["NOMINEE3R7"])
            .input("holder1_adhaar_info", (record["ADRH1INFO"] == null) ? '' : record["ADRH1INFO"])
            .input("holder2_aadhaar_info", (record["ADRH2INFO"] == null) ? '' : record["ADRH2INFO"])
            .input("holder3_aadhaar_info", (record["ADRH3NFO"] == null) ? '' : record["ADRH3NFO"])
            .input("guardian_aadhaar_info", (record["ADRGINFO"] == null) ? '' : record["ADRGINFO"])
            .input("nominee_address1", (record["NOMINEE_A8"] == null) ? '' : record["NOMINEE_A8"])
            .input("nominee_address2", (record["NOMINEE_A9"] == null) ? '' : record["NOMINEE_A9"])
            .input("nominee_address3", (record["NOMINEEG10"] == null) ? '' : record["NOMINEEG10"])
            .input("nominee_city", (record["NOMINEE_11"] == null) ? '' : record["NOMINEE_11"])
            .input("nominee_state", (record["NOMINEE_12"] == null) ? '' : record["NOMINEE_12"])
            .input("nominee_pincode", (record["NOMINEE_13"] == null) ? '' : record["NOMINEE_13"])
            .input("nominee_phone_residence", (record["NOMINEE_14"] == null) ? '' : record["NOMINEE_14"])
            .input("nominee_email", (record["NOMINEE_15"] == null) ? '' : record["NOMINEE_15"])
            .input("nominee2_address1", (record["NOMINEE_16"] == null) ? '' : record["NOMINEE_16"])
            .input("nominee2_address2", (record["NOMINEE217"] == null) ? '' : record["NOMINEE217"])
            .input("nominee2_address3", (record["NOMINEE218"] == null) ? '' : record["NOMINEE218"])
            .input("nominee2_city", (record["NOMINEE219"] == null) ? '' : record["NOMINEE219"])
            .input("nominee2_state", (record["NOMINEE220"] == null) ? '' : record["NOMINEE220"])
            .input("nominee2_pincode", (record["NOMINEE221"] == null) ? '' : record["NOMINEE221"])
            .input("nominee2_phone_residence", (record["NOMINEE222"] == null) ? '' : record["NOMINEE222"])
            .input("nominee2_email", (record["NOMINEE223"] == null) ? '' : record["NOMINEE223"])
            .input("nominee3_address1", (record["NOMINEE224"] == null) ? '' : record["NOMINEE224"])
            .input("nominee3_address2", (record["NOMINEE325"] == null) ? '' : record["NOMINEE325"])
            .input("nominee3_address3", (record["NOMINEE326"] == null) ? '' : record["NOMINEE326"])
            .input("nominee3_city", (record["NOMINEE327"] == null) ? '' : record["NOMINEE327"])
            .input("nominee3_state", (record["NOMINEE328"] == null) ? '' : record["NOMINEE328"])
            .input("nominee3_pincode", (record["NOMINEE329"] == null) ? '' : record["NOMINEE329"])
            .input("nominee3_phone_residence", (record["NOMINEE330"] == null) ? '' : record["NOMINEE330"])
            .input("nominee3_email", (record["NOMINEE331"] == null) ? '' : record["NOMINEE331"])
            .input("ckyc_no", (record["CKYC_NO"] == null) ? '' : record["CKYC_NO"])
            .input("jh1_ckyc", (record["JH1_CKYC"] == null) ? '' : record["JH1_CKYC"])
            .input("jh2_ckyc", (record["JH2_CKYC"] == null) ? '' : record["JH2_CKYC"])
            .input("guardian_ckyc_no", (record["GUARDIAN33"] == null) ? '' : record["GUARDIAN33"])
            .input("joint_holder_1st_resi_phone_no", (record["JOINT_HO34"] == null) ? '' : record["JOINT_HO34"])
            .input("joint_holder_2nd_resi_phone_no", (record["JOINT_HO35"] == null) ? '' : record["JOINT_HO35"])
            .input("investors_resi_faxno", (record["INVESTOR36"] == null) ? '' : record["INVESTOR36"])
            .input("kycgflag", (record["KYCGFLAG"] == null) ? '' : record["KYCGFLAG"])
            .input("RecordDate", recordDate)
            .input("RecordSession", recordSession);

        const result = await request.execute("InsertFeedKarvy311");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while saving karvy 311 record...');
    }
};

async function updateFeedCamsTransactionUccFolio(recordSession) {
    var data = await getCamswbr9Records(recordSession);

    if (data != null) {
        var recordCount = data.length;

        for (let i = 0; i < recordCount; i++) {
            var dataItem = data[i];

            var productFolio = dataItem.product + '_' + dataItem.foliochk;
            var taxStatus = await getTaxStatus(dataItem.tax_status);
            var holdingType = await getHoldingType(dataItem.holding_na);

            await saveFeedCamsTransactionUccFolio(dataItem, recordSession, productFolio, taxStatus, holdingType);
        }
    }
};

async function updateFeedKarvyTransactionUccFolio(recordSession) {
    var data = await getKarvy311Records(recordSession);

    if (data != null) {
        var recordCount = data.length;

        for (let i = 0; i < recordCount; i++) {
            var dataItem = data[i];

            var productFolio = dataItem.product_code + '_' + dataItem.folio;
            var taxStatus = await getKarvyTaxStatus(dataItem.tax_status);
            var holdingType = await getKarvyHoldingType(dataItem.mode_of_holding_description);

            await saveFeedKarvyTransactionUccFolio(dataItem, recordSession, productFolio, taxStatus, holdingType);
        }
    }
}

async function rearrageTransactionUccFolioList(recordSession, req, res) {
    var feedData = await getFeedCamsTransactionUccFolioBySession(recordSession);

    var data = feedData.filter(x => x.ShowInList === 0 && x.CaseCode === 0);

    var recordCount = data.length;
    for (let i = 0; i < recordCount; i++) {
        var dataItem = data[i];

        //First Holder
        var invFirstHolderPan = dataItem["FirstHolderPan"].trim();
        if (!/^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]?$/.test(invFirstHolderPan)) {
            invFirstHolderPan = '';
        }
        dataItem["FirstHolderPan"] = invFirstHolderPan.toUpperCase();

        dataItem["FirstHolderName"] = dataItem["FirstHolderName"].trim();

        if (invFirstHolderPan != '') {
            var firstHolderName = dataItem["FirstHolderName"];
            var first1Name = '';
            var secondLastArray = '';
            var middle1Name = '';
            var middleArray = [];
            var last1Name = '';
            var tax1Status = dataItem["TaxStatus"];

            firstHolderName = firstHolderName.replace(/[\(\)]/g, '');
            let explodeFirstName = firstHolderName.split(' ')
                .map(name => name.trim())
                .filter(name => name.length > 0);

            if (explodeFirstName[0]) {
                first1Name = explodeFirstName[0].toLowerCase();

                let explodeLastName = explodeFirstName;
                let lastArray = explodeLastName.pop();

                if (lastArray.trim() != '') {
                    if (lastArray.toLowerCase() == 'huf') {
                        secondLastArray = explodeFirstName[explodeFirstName.length - 2];
                        last1Name = secondLastArray + ' ' + lastArray;
                    }
                    else {
                        last1Name = lastArray;
                    }

                    last1Name = last1Name.toLowerCase();
                }

                explodeFirstName.forEach(exfname => {
                    if (![first1Name, last1Name].includes(exfname.toLowerCase())) {
                        middleArray.push(exfname);
                    }
                });

                middle1Name = middleArray.join(' ');
            }

            let implodeFirstName = dataItem["FirstHolderName"];//explodeFirstName.join(" ");
            implodeFirstName = implodeFirstName.toLowerCase();
            dataItem["FirstHolderName"] = implodeFirstName.charAt(0).toUpperCase() + implodeFirstName.slice(1);

            dataItem["KarvyFName"] = first1Name;
            dataItem["KarvyMName"] = middle1Name.toLowerCase();
            dataItem["KarvyLName"] = last1Name;

            let checkProfile = await getClientKycProfileByPANCardNumber(invFirstHolderPan);
            if (checkProfile != null) {
                dataItem["IsProfileOnKinntegra"] = true;
            }
        }

        //Second Holder
        var invSecondHolderPan = dataItem["SecondHolderPan"].trim();
        if (!/^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]?$/.test(invSecondHolderPan)) {
            invSecondHolderPan = '';
        }
        dataItem["SecondHolderPan"] = invSecondHolderPan.toUpperCase();

        dataItem["SecondHolderName"] = dataItem["SecondHolderName"].trim();

        if (invSecondHolderPan != '') {
            let checkProfile = await getClientKycProfileByPANCardNumber(invSecondHolderPan);
            if (checkProfile != null) {
                dataItem["IsProfileOnKinntegra"] = true;
            }

            let secondHolderName = dataItem["SecondHolderName"];
            let first2Name = '';
            let last2Name = '';
            let tax2Status = dataItem["TaxStatus"];

            secondHolderName = secondHolderName.replace(/[\(\)]/g, '');

            let explodeSecondName = secondHolderName.split(' ')
                .map(name => name.trim())
                .filter(name => name.length > 0);

            if (explodeSecondName[0]) {
                first2Name = explodeSecondName[0].toLowerCase();
                let explodeLastName = explodeSecondName;
                let lastArray = explodeLastName.pop();

                if (lastArray.trim() != '') {
                    if (lastArray.toLowerCase() == 'huf') {
                        let secondLastArray = explodeSecondName[explodeSecondName.length - 2];
                        last2Name = secondLastArray + ' ' + lastArray;
                    } else {
                        last2Name = lastArray;
                    }
                    last2Name = last2Name.toLowerCase();
                }
            }

            let implodeSecondName = dataItem["SecondHolderName"];//explodeSecondName.join(" ");
            implodeSecondName = implodeSecondName.toLowerCase();
            dataItem["SecondHolderName"] = implodeSecondName.charAt(0).toUpperCase() + implodeSecondName.slice(1);
        }

        //Third Holder
        var invThirdHolderPan = dataItem["ThirdHolderPan"].trim();
        if (!/^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]?$/.test(invThirdHolderPan)) {
            invThirdHolderPan = '';
        }
        dataItem["ThirdHolderPan"] = invThirdHolderPan.toUpperCase();

        dataItem["ThirdHolderName"] = dataItem["ThirdHolderName"].trim();

        if (invThirdHolderPan != '') {
            let checkProfile = await getClientKycProfileByPANCardNumber(invThirdHolderPan);
            if (checkProfile != null) {
                dataItem["IsProfileOnKinntegra"] = true;
            }

            let thirdHolderName = dataItem["ThirdHolderName"];
            let first3Name = '';
            let last3Name = '';
            let tax3Status = dataItem["TaxStatus"];

            thirdHolderName = thirdHolderName.replace(/[\(\)]/g, '');

            let explodeThirdName = thirdHolderName.split(' ')
                .map(name => name.trim())
                .filter(name => name.length > 0);

            if (explodeThirdName[0]) {
                first3Name = explodeThirdName[0].toLowerCase();
                let explodeLastName = explodeThirdName;
                let lastArray = explodeLastName.pop();

                if (lastArray.trim() != '') {
                    if (lastArray.toLowerCase() == 'huf') {
                        let secondLastArray = explodeThirdName[explodeThirdName.length - 2];
                        last3Name = secondLastArray + ' ' + lastArray;
                    } else {
                        last3Name = lastArray;
                    }
                    last3Name = last3Name.toLowerCase();
                }
            }

            let implodeThirdName = dataItem["ThirdHolderName"];//explodeThirdName.join(" ");
            implodeThirdName = implodeThirdName.toLowerCase();
            dataItem["ThirdHolderName"] = implodeThirdName.charAt(0).toUpperCase() + implodeThirdName.slice(1);
        }

        //Guardian
        let invGuardianPan = dataItem["GuardianPan"].trim();
        if (!/^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]?$/.test(invGuardianPan)) {
            invGuardianPan = '';
        }
        dataItem["GuardianPan"] = invGuardianPan.toUpperCase();

        dataItem["GuardianName"] = dataItem["GuardianName"].trim();

        if (invGuardianPan != '') {
            let checkProfile = await getClientKycProfileByPANCardNumber(invGuardianPan);
            if (checkProfile != null) {
                dataItem["IsProfileOnKinntegra"] = true;
            }

            let guardianName = dataItem["GuardianName"];
            let first4Name = '';
            let last4Name = '';
            let tax4Status = dataItem["TaxStatus"];

            guardianName = guardianName.replace(/[\(\)]/g, '');

            let explodeGuardianName = guardianName.split(' ')
                .map(name => name.trim())
                .filter(name => name.length > 0);

            if (explodeGuardianName[0]) {
                first4Name = explodeGuardianName[0].toLowerCase();
                let explodeLastName = explodeGuardianName;
                let lastArray = explodeLastName.pop();

                if (lastArray.trim() != '') {
                    if (lastArray.toLowerCase() == 'huf') {
                        let secondLastArray = explodeGuardianName[explodeGuardianName.length - 2];
                        last4Name = secondLastArray + ' ' + lastArray;
                    } else {
                        last4Name = lastArray;
                    }
                    last4Name = last4Name.toLowerCase();
                }
            }

            let implodeGuardianName = dataItem["GuardianName"];//explodeGuardianName.join(" ");
            implodeGuardianName = implodeGuardianName.toLowerCase();
            dataItem["GuardianName"] = implodeGuardianName.charAt(0).toUpperCase() + implodeGuardianName.slice(1);
        }

        dataItem["Mobile"] = (dataItem["Mobile"].trim() != '') ? formatMobileNumber(dataItem["Mobile"]) : '';

        //Nominee 1
        let nomName = dataItem["NomineeName"];
        if (nomName.trim() != '') {
            let nomNameSplit = nomName.trim().split(' ');
            nomName = nomNameSplit[0].toLowerCase();
            dataItem["NomineeFName"] = nomName;
        }

        //Nominee 2
        let nom2Name = dataItem["Nominee2Name"];
        if (nom2Name.trim() != '') {
            let nom2NameSplit = nom2Name.trim().split(' ');
            nom2Name = nom2NameSplit[0].toLowerCase();
            dataItem["Nominee2FName"] = nom2Name;
        }

        //Nominee 3
        let nom3Name = dataItem["Nominee3Name"];
        if (nom3Name.trim() != '') {
            let nom3NameSplit = nom3Name.trim().split(' ');
            nom3Name = nom3NameSplit[0].toLowerCase();
            dataItem["Nominee3FName"] = nom3Name;
        }

        let folioPanArray = [
            dataItem["FirstHolderPan"],
            dataItem["SecondHolderPan"],
            dataItem["ThirdHolderPan"],
            dataItem["GuardianPan"]
        ];
        folioPanArray = folioPanArray.filter(pan => pan);
        folioPanArray = [...new Set(folioPanArray)];

        if (dataItem["IsProfileOnKinntegra"] == true) {
            var checkTransaction = await getFeedCamsTransactionUccFolioExisting(dataItem["Id"], dataItem["FirstHolderPan"], dataItem["SecondHolderPan"], dataItem["ThirdHolderPan"], dataItem["GuardianPan"], dataItem["KarvyFName"], dataItem["NomineeFName"], dataItem["Nominee2FName"], dataItem["Nominee3FName"]);
            let clientProfiles = await getClientKycProfileSubBroker(folioPanArray.join(','));

            if (checkTransaction != null) {
                dataItem["SubBrokerCode"] = checkTransaction["SubBrokerCode"];
                dataItem["Ucc"] = checkTransaction["Ucc"];
            }
            else {
                let subBrokerCode = await getFeedTransactionUccFolioSubBroker(folioPanArray.join(','));
                if (subBrokerCode != '') {
                    dataItem["SubBrokerCode"] = subBrokerCode;
                }
                else {
                    if (clientProfiles != null) {
                        dataItem["SubBrokerCode"] = process.env.BSE_MEMBER_ID + '' + clientProfiles[0].AssociateCode;
                    }
                }

                let otherCombination = dataItem["FirstHolderPan"] + '|' + dataItem["SecondHolderPan"] + '|' + dataItem["ThirdHolderPan"] + '|' + dataItem["GuardianPan"] + '|' + dataItem["NomineeFName"] + '|' + dataItem["Nominee2FName"] + '|' + dataItem["Nominee3FName"];

                if (clientProfiles != null) {
                    let clientIds = clientProfiles.map(profile => profile.ClientId);

                    let clientCount = clientIds.length;

                    for (let c = 0; c < clientCount; c++) {
                        var clientAccounts = await getClientAccounts(clientIds[c]);

                        // console.log(clientAccounts);

                        let clientAccountCount = clientAccounts.length;

                        for (let a = 0; a < clientAccountCount; a++) {
                            var clientAccount = await clientConrtroller.GetClientAccountInfo(req, res, cryptoEngine.ParamEncrypt(clientAccounts[a].Id, true));

                            let firstHolderName = '';
                            let firstHolderPan = '';
                            let secondHolderName = '';
                            let secondHolderPan = '';
                            let thirdHolderName = '';
                            let thirdHolderPan = '';
                            let guardianName = '';
                            let guardianPan = '';
                            let isMinor = false;
                            let uniqueCombination = '';

                            let firstHolder = clientAccount.AccountHolders.find(x => x.SerialNumber == 1);
                            if (firstHolder != null) {
                                let firstHolderNameArray = firstHolder.ProfileDetails.Name.split(' ');
                                firstHolderName = firstHolderNameArray[0];
                                firstHolderPan = firstHolder.ProfileDetails.PANCardNumber;

                                if (firstHolder.ProfileDetails.GuardianName != '') {
                                    isMinor = firstHolder.ProfileDetails.IsMinorProfile;
                                    guardianName = firstHolder.GuardianDetails.ProfileDetails.Name;
                                    guardianPan = firstHolder.GuardianDetails.ProfileDetails.PANCardNumber;
                                }
                            }

                            if (dataItem["FirstHolderPan"] == '') {
                                firstHolderPan = '';
                            }

                            let secondHolder = clientAccount.AccountHolders.find(x => x.SerialNumber == 2);
                            if (secondHolder != null) {
                                secondHolderName = secondHolder.ProfileDetails.Name;
                                secondHolderPan = secondHolder.ProfileDetails.PANCardNumber;
                            }

                            let thirdHolder = clientAccount.AccountHolders.find(x => x.SerialNumber == 3);
                            if (thirdHolder != null) {
                                thirdHolderName = thirdHolder.ProfileDetails.Name;
                                thirdHolderPan = thirdHolder.ProfileDetails.PANCardNumber;
                            }

                            let nominee1 = '';
                            let nominee2 = '';
                            let nominee3 = '';

                            let nomineeCount = clientAccount.AccountNominees.length;
                            for (let n = 0; n < nomineeCount; n++) {
                                if (n == 0) {
                                    nominee1 = clientAccount.AccountNominees[n].NomineeName.split(' ')[0];
                                }
                                if (n == 1) {
                                    nominee2 = clientAccount.AccountNominees[n].NomineeName.split(' ')[0];
                                }
                                if (n == 2) {
                                    nominee3 = clientAccount.AccountNominees[n].NomineeName.split(' ')[0];
                                }
                            }

                            uniqueCombination = firstHolderPan + '|' + secondHolderPan + '|' + thirdHolderPan + '|' + guardianPan + '|' + nominee1 + '|' + nominee2 + '|' + nominee3;
                            if (otherCombination.toLowerCase() == uniqueCombination.toLowerCase()) {
                                dataItem["Ucc"] = clientAccount.UCC;
                                dataItem["KarvyTPin"] = '0';
                            }
                            else {
                                let ledgerData = await getClientTransactionUnitLedgerUcc(dataItem["FolioNumber"]);

                                if (ledgerData != null) {
                                    dataItem["Ucc"] = ledgerData.Ucc;
                                    dataItem["KarvyTPin"] = '0';
                                }
                            }
                        }
                    }
                }
            }
        }

        if (dataItem["IsProfileOnKinntegra"] == false) {
            if (folioPanArray.length > 0) {
                var checkTransaction = await getFeedCamsTransactionUccFolioExisting(dataItem["Id"], dataItem["FirstHolderPan"], dataItem["SecondHolderPan"], dataItem["ThirdHolderPan"], dataItem["GuardianPan"], dataItem["KarvyFName"], dataItem["NomineeFName"], dataItem["Nominee2FName"], dataItem["Nominee3FName"]);
                if (checkTransaction != null) {
                    dataItem["SubBrokerCode"] = checkTransaction["SubBrokerCode"];
                    dataItem["Ucc"] = checkTransaction["Ucc"];
                }
                else {
                    let subBrokerCode = await getFeedTransactionUccFolioSubBroker(folioPanArray.join(','));
                    if (subBrokerCode != '') {
                        dataItem["SubBrokerCode"] = subBrokerCode;
                        dataItem["KarvyTPin"] = '0';
                    }
                }
            }
        }

        //Save feed data
        await updateCamsFeedTransactionUccFolio(dataItem);
    }
};

async function transactionUCCMissingPan(recordSession) {
    var data = await getFeedCamsTransactionUccFolioBySession(recordSession);

    if (data != null) {
        let recordCount = data.length;
        for (let i = 0; i < recordCount; i++) {
            let folioPattern = data[i];

            var nameCount = 0;
            var panCount = 0;
            var namePanComparison = 0;

            if (folioPattern["FirstHolderName"].trim() != '') { nameCount++ }
            if (folioPattern["SecondHolderName"].trim() != '') { nameCount++ }
            if (folioPattern["ThirdHolderName"].trim() != '') { nameCount++ }
            if (folioPattern["GuardianName"].trim() != '') { nameCount++ }

            folioPattern["NameCount"] = nameCount;

            if (folioPattern["FirstHolderPan"].trim() != '') { panCount++ }
            if (folioPattern["SecondHolderPan"].trim() != '') { panCount++ }
            if (folioPattern["ThirdHolderPan"].trim() != '') { panCount++ }
            if (folioPattern["GuardianPan"].trim() != '') { panCount++ }

            folioPattern["PanCount"] = panCount;

            if (folioPattern["GuardianPan"].trim() != '') {
                nameCount = nameCount - 1;
            }

            namePanComparison = panCount - nameCount;

            if (folioPattern["ShowInList"] == 1 && folioPattern["CaseCode"] == 3) {
                folioPattern["ShowInList"] = 0;
                folioPattern["CaseCode"] = 0;
            }
            if (namePanComparison < 0) {
                folioPattern["ShowInList"] = 1;
                folioPattern["CaseCode"] = 3;
            }

            folioPattern["NamePanComparison"] = namePanComparison;

            await updateCamsFeedTransactionUccFolio(folioPattern);
        }
    }
};

async function setUniqueAndMismatchedPan(recordSession) {
    var allFoliosSetUniquePan = await getFeedCamsTransactionUccFolioBySession(recordSession);
    var panFolios = allFoliosSetUniquePan;

    if (allFoliosSetUniquePan != null) {
        let recordCount = allFoliosSetUniquePan.length;
        for (let i = 0; i < recordCount; i++) {
            let uniquePan = allFoliosSetUniquePan[i];

            let allFolios = [];
            if (uniquePan["FirstHolderPan"].trim() != '') {
                let firstArray = panFolios.filter(x => x.FirstHolderPan === uniquePan["FirstHolderPan"] ||
                    x.SecondHolderPan === uniquePan["FirstHolderPan"] ||
                    x.ThirdHolderPan === uniquePan["FirstHolderPan"] ||
                    x.GuardianPan === uniquePan["FirstHolderPan"]);
                let secondArray = panFolios.filter(x => x.FirstHolderPan === uniquePan["SecondHolderPan"] ||
                    x.SecondHolderPan === uniquePan["SecondHolderPan"] ||
                    x.ThirdHolderPan === uniquePan["SecondHolderPan"] ||
                    x.GuardianPan === uniquePan["SecondHolderPan"]);
                let thirdArray = panFolios.filter(x => x.FirstHolderPan === uniquePan["ThirdHolderPan"] ||
                    x.SecondHolderPan === uniquePan["ThirdHolderPan"] ||
                    x.ThirdHolderPan === uniquePan["ThirdHolderPan"] ||
                    x.GuardianPan === uniquePan["ThirdHolderPan"]);
                let guardianArray = panFolios.filter(x => x.FirstHolderPan === uniquePan["GuardianPan"] ||
                    x.SecondHolderPan === uniquePan["GuardianPan"] ||
                    x.ThirdHolderPan === uniquePan["GuardianPan"] ||
                    x.GuardianPan === uniquePan["GuardianPan"]);

                // const map = new Map([...firstArray, ...secondArray, ...thirdArray, ...guardianArray]
                //     .map(obj => [obj.Id, obj]));

                // allFolios = Array.from(map.values());

                allFolios = [...new Set([...firstArray, ...secondArray, ...thirdArray, ...guardianArray])];
            }
            else {
                allFolios = panFolios.filter(x => x.GuardianPan === uniquePan["FirstHolderPan"] ||
                    x.GuardianPan === uniquePan["SecondHolderPan"] ||
                    x.GuardianPan === uniquePan["ThirdHolderPan"] ||
                    x.GuardianPan === uniquePan["GuardianPan"]);
            }

            for (let j = 0; j < allFolios.length; j++) {
                let tfolio = allFolios[j];

                if (tfolio["ShowInList"] == 1 && (tfolio["CaseCode"] == 1 || tfolio["CaseCode"] == 2)) {
                    tfolio["ShowInList"] = 0;
                    tfolio["CaseCode"] = 0;
                    await updateCamsFeedTransactionUccFolio(tfolio);
                }
            }

            if (uniquePan["FirstHolderPan"].trim() != '') {
                await saveFeedTransactionPan(uniquePan["SubBrokerCode"], uniquePan["FirstHolderPan"], uniquePan["FirstHolderName"], 'pan', 0, '', '', '', uniquePan["PinCode"], recordSession);
            }
            if (uniquePan["SecondHolderPan"].trim() != '') {
                await saveFeedTransactionPan(uniquePan["SubBrokerCode"], uniquePan["SecondHolderPan"], uniquePan["SecondHolderName"], 'pan', 0, '', '', '', uniquePan["PinCode"], recordSession);
            }
            if (uniquePan["ThirdHolderPan"].trim() != '') {
                await saveFeedTransactionPan(uniquePan["SubBrokerCode"], uniquePan["ThirdHolderPan"], uniquePan["ThirdHolderName"], 'pan', 0, '', '', '', uniquePan["PinCode"], recordSession);
            }
            if (uniquePan["GuardianPan"].trim() != '') {
                await saveFeedTransactionPan(uniquePan["SubBrokerCode"], uniquePan["GuardianPan"], uniquePan["GuardianName"], 'pan', 0, '', '', '', uniquePan["PinCode"], recordSession);
            }
        }
    }

    var data = await getFeedTransactionPanByRecordSession(recordSession);
    if (data != null) {
        let mismatchedPan = data.filter(x => x.RecordType.toLowerCase() === 'pan' && (x.IsDuplicate == 0 || x.IsDuplicate == 1 || x.IsDuplicate == 2));

        let mismatchedPanCount = mismatchedPan.length;
        for (let i = 0; i < mismatchedPanCount; i++) {
            let misPan = mismatchedPan[i];

            await updateFeedTransactionPanDuplicate(misPan["Id"], 0, recordSession);

            let pendingData = await getFeedTransactionPanByRecordType('pan');
            if (pendingData != null) {
                let checkPendings = pendingData.filter(x => x.Id != misPan["Id"]);
                for (let j = 0; j < checkPendings.length; j++) {
                    let check = checkPendings[j];

                    if (misPan["Name"].toLowerCase() == check["Name"].toLowerCase() && misPan["PinCode"] == check["PinCode"]) {
                        await updateFeedTransactionPanDuplicate(misPan["Id"], 2, recordSession);

                        await updateFeedTransactionPanDuplicate(check["Id"], 2, recordSession);
                    }

                    let similarity = await calculateSimilarity(misPan["Pan"], check["Pan"]);
                    if (similarity == 90) {
                        await updateFeedTransactionPanDuplicate(misPan["Id"], 1, recordSession);

                        await updateFeedTransactionPanDuplicate(check["Id"], 1, recordSession);
                    }
                }
            }
        }
    }

    var data1 = await getFeedTransactionPanByRecordSession(recordSession);
    if (data1 != null) {
        let mismatchedFiltered1Pan = data.filter(x => x.RecordType.toLowerCase() === 'pan' && x.IsDuplicate == 2);

        let mismatchedFiltered1PanCount = mismatchedFiltered1Pan.length;
        for (let i = 0; i < mismatchedFiltered1PanCount; i++) {
            let filter1pan = mismatchedFiltered1Pan[i];

            let dateOfBirth1 = '';
            let mobile1 = '';
            let email1 = '';
            let taxStatus1 = '';
            let similar = 0;

            var folioData = await getFeedCamsTransactionUccFolioBySession(recordSession);

            let tempData1 = folioData.find(x => x.FirstHolderPan == filter1pan["Pan"] ||
                x.SecondHolderPan == filter1pan["Pan"] ||
                x.ThirdHolderPan == filter1pan["Pan"] ||
                x.GuardianPan == filter1pan["Pan"]);
            if (tempData1 != null) {
                dateOfBirth1 = tempData1["DateOfBirth"];
                mobile1 = tempData1["Mobile"].trim().slice(-10);
                email1 = tempData1["Email"];
                taxStatus1 = tempData1["TaxStatus"].toLowerCase();
            }

            let dateOfBirth2 = '';
            let mobile2 = '';
            let email2 = '';
            let taxStatus2 = '';
            let isTaxStatus = 0;

            let pendingData = await getFeedTransactionPanByRecordType('pan');

            let otherName = pendingData.find(x => x.IsDuplicate == 2 &&
                x.Name.toLowerCase() == filter1pan["Name"].toLowerCase() &&
                x.Id != filter1pan["Id"] &&
                (x.FirstHolderPan == filter1pan["Pan"] ||
                    x.SecondHolderPan == filter1pan["Pan"] ||
                    x.ThirdHolderPan == filter1pan["Pan"] ||
                    x.GuardianPan == filter1pan["Pan"]));
            if (otherName != null) {
                var folioData2 = await getFeedCamsTransactionUccFolioBySession(recordSession);
                let tempData2 = folioData2.find(x => x.ShowInList == 0 && x.CaseCode == 0);
                if (tempData2 != null) {
                    dateOfBirth2 = tempData2["DateOfBirth"];
                    mobile2 = tempData2["Mobile"].trim().slice(-10);
                    email2 = tempData2["Email"];
                    taxStatus2 = tempData2["TaxStatus"].toLowerCase();
                }

                if (dateOfBirth1 == dateOfBirth2) {
                    similar++;
                }

                if (mobile1 == mobile2) {
                    similar++;
                }

                if (email1 == email2) {
                    similar++;
                }

                if (taxStatus1.toLowerCase() == 'huf' || taxStatus1.toLowerCase() == 'on behalf of minor' || taxStatus2.toLowerCase() == 'huf' || taxStatus2.toLowerCase() == 'on behalf of minor') {
                    isTaxStatus++;
                }
            }

            if (similar > 0 && isTaxStatus == 0) {
                await updateFeedTransactionPanDuplicate(filter1pan["Id"], 2, recordSession);

                await updateFeedTransactionPanDuplicate(otherName["Id"], 2, recordSession);
            } else {
                await updateFeedTransactionPanDuplicate(filter1pan["Id"], 0, recordSession);

                if (otherName != null) {
                    await updateFeedTransactionPanDuplicate(otherName["Id"], 0, recordSession);
                }
            }
        }
    }

    var data2 = await getFeedTransactionPanByRecordSession(recordSession);
    if (data2 != null) {
        let mismatchedFilteredPan = data.filter(x => x.RecordType.toLowerCase() === 'pan' && (x.IsDuplicate == 1 || x.IsDuplicate == 2));

        let mismatchedFilteredPanCount = mismatchedFilteredPan.length;
        for (let i = 0; i < mismatchedFilteredPanCount; i++) {
            let filterpan = mismatchedFilteredPan[i];

            let getfilterpanno = filterpan["Pan"];

            let uftData1 = await getFeedCamsTransactionUccFolioBySession(recordSession);

            let setallfirstpattern = uftData1.filter(x => x.FirstHolderPan === getfilterpanno);
            for (let j = 0; j < setallfirstpattern.length; j++) {
                let firstpattern = setallfirstpattern[j];
                firstpattern["ShowInList"] = 1;
                firstpattern["CaseCode"] = filterpan["IsDuplicate"];
                firstpattern["FirstHolderPanMismatched"] = 1;

                let folioLists = uftData1.filter(x => x.Ucc.toLowerCase() === firstpattern["Ucc"].toLowerCase() &&
                    x.FirstHolderPan === firstpattern["FirstHolderPan"] &&
                    x.SecondHolderPan === firstpattern["SecondHolderPan"] &&
                    x.ThirdHolderPan === firstpattern["ThirdHolderPan"] &&
                    x.GuardianPan === firstpattern["GuardianPan"]);

                let folioListsArray = folioLists.map(item => {
                    const FolioNumber = `${item.FolioNumber}`;
                    const FundDescription = `${item.FundDescription}`;
                    return { FolioNumber, FundDescription };
                });

                let folioListsArr = [... new Set(folioListsArray)];

                firstpattern["FolioLists"] = JSON.stringify(folioListsArr);

                await updateCamsFeedTransactionUccFolio(firstpattern);
            }

            let setallsecondpattern = uftData1.filter(x => x.SecondHolderPan === getfilterpanno);
            for (let j = 0; j < setallsecondpattern.length; j++) {
                let secondpattern = setallsecondpattern[j];
                secondpattern["ShowInList"] = 1;
                secondpattern["CaseCode"] = filterpan["IsDuplicate"];
                secondpattern["SecondHolderPanMismatched"] = 1;

                let folioLists = uftData1.filter(x => x.Ucc.toLowerCase() === secondpattern["Ucc"].toLowerCase() &&
                    x.FirstHolderPan === secondpattern["FirstHolderPan"] &&
                    x.SecondHolderPan === secondpattern["SecondHolderPan"] &&
                    x.ThirdHolderPan === secondpattern["ThirdHolderPan"] &&
                    x.GuardianPan === secondpattern["GuardianPan"]);

                let folioListsArray = folioLists.map(item => {
                    const FolioNumber = `${item.FolioNumber}`;
                    const FundDescription = `${item.FundDescription}`;
                    return { FolioNumber, FundDescription };
                });

                let folioListsArr = [... new Set(folioListsArray)];

                secondpattern["FolioLists"] = JSON.stringify(folioListsArr);

                await updateCamsFeedTransactionUccFolio(secondpattern);
            }

            let setallthirdpattern = uftData1.filter(x => x.ThirdHolderPan === getfilterpanno);
            for (let j = 0; j < setallthirdpattern.length; j++) {
                let thirdpattern = setallthirdpattern[j];
                thirdpattern["ShowInList"] = 1;
                thirdpattern["CaseCode"] = filterpan["IsDuplicate"];
                thirdpattern["ThirdHolderPanMismatched"] = 1;

                let folioLists = uftData1.filter(x => x.Ucc.toLowerCase() === thirdpattern["Ucc"].toLowerCase() &&
                    x.FirstHolderPan === thirdpattern["FirstHolderPan"] &&
                    x.SecondHolderPan === thirdpattern["SecondHolderPan"] &&
                    x.ThirdHolderPan === thirdpattern["ThirdHolderPan"] &&
                    x.GuardianPan === thirdpattern["GuardianPan"]);

                let folioListsArray = folioLists.map(item => {
                    const FolioNumber = `${item.FolioNumber}`;
                    const FundDescription = `${item.FundDescription}`;
                    return { FolioNumber, FundDescription };
                });

                let folioListsArr = [... new Set(folioListsArray)];

                thirdpattern["FolioLists"] = JSON.stringify(folioListsArr);

                await updateCamsFeedTransactionUccFolio(thirdpattern);
            }

            let setallguardianpattern = uftData1.filter(x => x.GuardianPan === getfilterpanno);
            for (let j = 0; j < setallguardianpattern.length; j++) {
                let guardianpattern = setallguardianpattern[j];
                guardianpattern["ShowInList"] = 1;
                guardianpattern["CaseCode"] = filterpan["IsDuplicate"];
                guardianpattern["GuardianPanMismatched"] = 1;

                let folioLists = uftData1.filter(x => x.Ucc.toLowerCase() === guardianpattern["Ucc"].toLowerCase() &&
                    x.FirstHolderPan === guardianpattern["FirstHolderPan"] &&
                    x.SecondHolderPan === guardianpattern["SecondHolderPan"] &&
                    x.ThirdHolderPan === guardianpattern["ThirdHolderPan"] &&
                    x.GuardianPan === guardianpattern["GuardianPan"]);

                let folioListsArray = folioLists.map(item => {
                    const FolioNumber = `${item.FolioNumber}`;
                    const FundDescription = `${item.FundDescription}`;
                    return { FolioNumber, FundDescription };
                });

                let folioListsArr = [... new Set(folioListsArray)];

                guardianpattern["FolioLists"] = JSON.stringify(folioListsArr);

                await updateCamsFeedTransactionUccFolio(guardianpattern);
            }
        }
    }
};

async function setUniqueAndMismatchedName(recordSession) {
    let allFoliosSetUniqueName = await getFeedCamsTransactionUccFolioBySession(recordSession);

    let allFoliosSetUniqueNameCount = allFoliosSetUniqueName.length;
    for (let i = 0; i < allFoliosSetUniqueNameCount; i++) {
        let uniqueName = allFoliosSetUniqueName[i];

        if (uniqueName["FirstHolderPan"].trim() != '') {
            let firstHolderName = uniqueName["FirstHolderName"];
            let first1Name = '';
            let last1Name = '';
            let tax1Status = uniqueName["TaxStatus"];

            firstHolderName = firstHolderName.trim();
            firstHolderName = firstHolderName.replace(/[\(\)]/g, '');

            let explodeFirstName = firstHolderName.split(' ').map(name => name.trim()).filter(name => name != '');

            if (explodeFirstName[0]) {
                first1Name = explodeFirstName[0].toLowerCase();
                let explodeLastName = [...explodeFirstName];
                let lastArray = explodeLastName.pop();

                if (lastArray) {
                    if (lastArray.toLowerCase() === 'huf') {
                        const secondLastArray = explodeFirstName[explodeFirstName.length - 2];
                        last1Name = `${secondLastArray} ${lastArray}`;
                    } else {
                        last1Name = lastArray;
                    }
                    last1Name = last1Name.toLowerCase();
                }
            }

            let implodeFirstName = explodeFirstName.join(' ').toLowerCase();

            await saveFeedTransactionName(uniqueName["SubBrokerCode"], uniqueName["FirstHolderPan"], implodeFirstName, 'name', 0, first1Name, last1Name, tax1Status, uniqueName["PinCode"], recordSession);
        }

        if (uniqueName["SecondHolderPan"].trim() != '') {
            let secondHolderName = uniqueName["SecondHolderName"];
            let first2Name = '';
            let last2Name = '';
            let tax2Status = uniqueName["TaxStatus"];

            secondHolderName = secondHolderName.trim();
            secondHolderName = secondHolderName.replace(/[\(\)]/g, '');

            let explodeFirstName = secondHolderName.split(' ').map(name => name.trim()).filter(name => name != '');

            if (explodeFirstName[0]) {
                first2Name = explodeFirstName[0].toLowerCase();
                let explodeLastName = [...explodeFirstName];
                let lastArray = explodeLastName.pop();

                if (lastArray) {
                    if (lastArray.toLowerCase() === 'huf') {
                        const secondLastArray = explodeFirstName[explodeFirstName.length - 2];
                        last2Name = `${secondLastArray} ${lastArray}`;
                    } else {
                        last2Name = lastArray;
                    }
                    last2Name = last2Name.toLowerCase();
                }
            }

            let implodeFirstName = explodeFirstName.join(' ').toLowerCase();

            await saveFeedTransactionName(uniqueName["SubBrokerCode"], uniqueName["SecondHolderPan"], implodeFirstName, 'name', 0, first2Name, last2Name, tax2Status, uniqueName["PinCode"], recordSession);
        }

        if (uniqueName["ThirdHolderPan"].trim() != '') {
            let thirdHolderName = uniqueName["ThirdHolderName"];
            let first3Name = '';
            let last3Name = '';
            let tax3Status = uniqueName["TaxStatus"];

            thirdHolderName = thirdHolderName.trim();
            thirdHolderName = thirdHolderName.replace(/[\(\)]/g, '');

            let explodeFirstName = thirdHolderName.split(' ').map(name => name.trim()).filter(name => name != '');

            if (explodeFirstName[0]) {
                first3Name = explodeFirstName[0].toLowerCase();
                let explodeLastName = [...explodeFirstName];
                let lastArray = explodeLastName.pop();

                if (lastArray) {
                    if (lastArray.toLowerCase() === 'huf') {
                        const secondLastArray = explodeFirstName[explodeFirstName.length - 2];
                        last3Name = `${secondLastArray} ${lastArray}`;
                    } else {
                        last3Name = lastArray;
                    }
                    last3Name = last3Name.toLowerCase();
                }
            }

            let implodeFirstName = explodeFirstName.join(' ').toLowerCase();

            await saveFeedTransactionName(uniqueName["SubBrokerCode"], uniqueName["ThirdHolderPan"], implodeFirstName, 'name', 0, first3Name, last3Name, tax3Status, uniqueName["PinCode"], recordSession);
        }

        if (uniqueName["GuardianPan"].trim() != '') {
            let guardianName = uniqueName["GuardianName"];
            let first4Name = '';
            let last4Name = '';
            let tax4Status = uniqueName["TaxStatus"];

            guardianName = guardianName.trim();
            guardianName = guardianName.replace(/[\(\)]/g, '');

            let explodeFirstName = guardianName.split(' ').map(name => name.trim()).filter(name => name != '');

            if (explodeFirstName[0]) {
                first4Name = explodeFirstName[0].toLowerCase();
                let explodeLastName = [...explodeFirstName];
                let lastArray = explodeLastName.pop();

                if (lastArray) {
                    if (lastArray.toLowerCase() === 'huf') {
                        const secondLastArray = explodeFirstName[explodeFirstName.length - 2];
                        last4Name = `${secondLastArray} ${lastArray}`;
                    } else {
                        last4Name = lastArray;
                    }
                    last4Name = last4Name.toLowerCase();
                }
            }

            let implodeFirstName = explodeFirstName.join(' ').toLowerCase();

            await saveFeedTransactionName(uniqueName["SubBrokerCode"], uniqueName["GuardianPan"], implodeFirstName, 'name', 0, first4Name, last4Name, tax4Status, uniqueName["PinCode"], recordSession);
        }

        if (uniqueName["ShowInList"] == 1 && (uniqueName["CaseCode"] == 4 || uniqueName["CaseCode"] == 5 || uniqueName["CaseCode"] == 6)) {
            uniqueName["ShowInList"] = 0;
            uniqueName["CaseCode"] = 0;

            await updateFeedTransactionUccFolioListCode(uniqueName["Id"], uniqueName["ShowInList"], uniqueName["CaseCode"]);
        }
    }

    let mismatchedName = await getFeedTransactionPanUniquePanByCaseCode('name', recordSession, '0,1,2,3,4,5,6');
    for (let i = 0; i < mismatchedName.length; i++) {
        let misname = mismatchedName[i];

        misname["IsDuplicate"] = 0;
        await updateFeedTransactionPanDuplicate(misname["Id"], 0, recordSession);

        let pendingData = await getFeedTransactionPanByRecordType('name');
        let checkPendings = pendingData.filter(x => x.Id != misname["Id"] && x.Pan.toLowerCase() === misname["Pan"].toLowerCase());
        for (let j = 0; j < checkPendings.length; j++) {
            let check = checkPendings[j];
            await updateFeedTransactionPanDuplicate(check["Id"], 0, check["RecordSession"]);

            if (misname["Pan"].toLowerCase() == check["Pan"].toLowerCase()) {
                if (misname["FirstName"].toLowerCase() == check["FirstName"].toLowerCase() && misname["LastName"].toLowerCase() == check["LastName"].toLowerCase()) {
                    await updateFeedTransactionPanDuplicate(misname["Id"], 4, recordSession);
                    await updateFeedTransactionPanDuplicate(check["Id"], 4, check["RecordSession"]);
                } else {
                    await updateFeedTransactionPanDuplicate(misname["Id"], 5, recordSession);
                    await updateFeedTransactionPanDuplicate(check["Id"], 5, check["RecordSession"]);
                }
            }
        }
    }

    let mismatchedfilteredPan = await getFeedTransactionPanUniquePanByCaseCode('name', recordSession, '5');
    for (let i = 0; i < mismatchedfilteredPan.length; i++) {
        filterpan = mismatchedfilteredPan[i];

        let feed1 = await getFeedCamsTransactionUccFolio();
        let feed2 = feed1.filter(x => x.FirstHolderPan === filterpan["Pan"] || x.SecondHolderPan === filterpan["Pan"] || x.ThirdHolderPan === filterpan["Pan"])
            .map(obj => {
                const FirstHolderPan = `${obj.FirstHolderPan}`;
                const FirstHolderName = `${obj.FirstHolderName}`;
                const SecondHolderPan = `${obj.SecondHolderPan}`;
                const SecondHolderName = `${obj.SecondHolderName}`;
                const ThirdHolderPan = `${obj.ThirdHolderPan}`;
                const ThirdHolderName = `${obj.ThirdHolderName}`;
                const TaxStatus = `${obj.TaxStatus}`;
                return { FirstHolderPan, FirstHolderName, SecondHolderPan, SecondHolderName, ThirdHolderPan, ThirdHolderName, TaxStatus }
            });
        let getStatus = [...new Set(feed2)];
        if (getStatus.length > 1) {
            const getTaxStatus1 = getStatus.map(status => status.TaxStatus);
            for (let j = 0; j < getTaxStatus1.length; j++) {
                let taxSts = getTaxStatus1[j];
                if (['Sole Proprietor', 'Sole Proprietorship'].includes(taxSts)) {
                    let data21 = await getFeedTransactionPanByRecordType('name');
                    let mismatchedPanName = data21.filter(x => x.IsDuplicate === 5 && x.Pan.toLowerCase() === filterpan["Pan"].toLowerCase());
                    if (mismatchedPanName.length == 2) {
                        for (let k = 0; k < mismatchedPanName.length; k++) {
                            await updateFeedTransactionPanDuplicate(mismatchedPanName[k]["Id"], 6, recordSession);
                        }
                    }
                }
            }
        }
    }

    let mismatchedfilteredPan1 = await getFeedTransactionPanUniquePanByCaseCodeCount('name', recordSession, '4,5,6');
    for (let i = 0; i < mismatchedfilteredPan1.length; i++) {
        let singlepan = mismatchedfilteredPan1[i];

        if (singlepan["Total"] == 1) {
            let data31 = await getFeedTransactionPanUniquePanByCaseCodePan('name', recordSession, '4,5,6', singlepan["Id"], singlepan["Pan"]);
            let getstatus = (data31.length > 0) ? data31[0] : null;
            if (getstatus != null) {
                await updateFeedTransactionPanDuplicate(singlepan["Id"], getstatus["IsDuplicate"], recordSession);
            }
        }
    }

    let mismatchedfilteredPan2 = await getFeedTransactionPanUniquePanByCaseCode('name', recordSession, '4,5,6');
    for (let i = 0; i < mismatchedfilteredPan2.length; i++) {
        let filterpan = mismatchedfilteredPan2[i];

        let getfilterpanno = filterpan["Pan"];
        let getfiltername = filterpan["Name"];

        filterpan["TaxStatus"] = 'done';
        await updateFeedTransactionPanRecord(filterpan);

        let feed1 = await getFeedCamsTransactionUccFolioBySession(recordSession);
        let setallfirstpattern = feed1.filter(x => x.FirstHolderPan === getfilterpanno);
        for (let j = 0; j < setallfirstpattern.length; j++) {
            let firstpattern = setallfirstpattern[j];

            firstpattern["ShowInList"] = 1;
            firstpattern["CaseCode"] = filterpan["IsDuplicate"];
            firstpattern["FirstHolderPanMismatched"] = 1;

            let otherFeed1 = await getFeedCamsTransactionUccFolioBySession(recordSession);

            let folioLists = otherFeed1.filter(x => x.FirstHolderPan === firstpattern["FirstHolderPan"] &&
                x.SecondHolderPan === firstpattern["SecondHolderPan"] &&
                x.ThirdHolderPan === firstpattern["ThirdHolderPan"] &&
                x.GuardianPan === firstpattern["GuardianPan"] &&
                x.NomineeFName.toLowerCase() === firstpattern["NomineeFName"].toLowerCase() &&
                x.Nominee2FName.toLowerCase() === firstpattern["Nominee2FName"].toLowerCase() &&
                x.Nominee3FName.toLowerCase() === firstpattern["Nominee3FName"].toLowerCase());
            for (let k = 0; k < folioLists.length; k++) {
                let alist = folioLists[k];
                alist["ShowInList"] = 1;
                alist["CaseCode"] = filterpan["IsDuplicate"];
                await updateCamsFeedTransactionUccFolio(alist);
            }

            await updateCamsFeedTransactionUccFolio(firstpattern);
        }

        let feed2 = await getFeedCamsTransactionUccFolioBySession(recordSession);
        let setallsecondpattern = feed2.filter(x => x.SecondHolderPan === getfilterpanno);
        for (let j = 0; j < setallsecondpattern.length; j++) {
            let secondpattern = setallsecondpattern[j];

            secondpattern["ShowInList"] = 1;
            secondpattern["CaseCode"] = filterpan["IsDuplicate"];
            secondpattern["SecondHolderPanMismatched"] = 1;

            let otherFeed1 = await getFeedCamsTransactionUccFolioBySession(recordSession);

            let folioLists = otherFeed1.filter(x => x.FirstHolderPan === secondpattern["FirstHolderPan"] &&
                x.SecondHolderPan === secondpattern["SecondHolderPan"] &&
                x.ThirdHolderPan === secondpattern["ThirdHolderPan"] &&
                x.GuardianPan === secondpattern["GuardianPan"] &&
                x.NomineeFName.toLowerCase() === secondpattern["NomineeFName"].toLowerCase() &&
                x.Nominee2FName.toLowerCase() === secondpattern["Nominee2FName"].toLowerCase() &&
                x.Nominee3FName.toLowerCase() === secondpattern["Nominee3FName"].toLowerCase());
            for (let k = 0; k < folioLists.length; k++) {
                let alist = folioLists[k];
                alist["ShowInList"] = 1;
                alist["CaseCode"] = filterpan["IsDuplicate"];
                await updateCamsFeedTransactionUccFolio(alist);
            }

            await updateCamsFeedTransactionUccFolio(secondpattern);
        }

        let feed3 = await getFeedCamsTransactionUccFolioBySession(recordSession);
        let setallThirdpattern = feed3.filter(x => x.ThirdHolderPan === getfilterpanno);
        for (let j = 0; j < setallThirdpattern.length; j++) {
            let thirdpattern = setallThirdpattern[j];

            thirdpattern["ShowInList"] = 1;
            thirdpattern["CaseCode"] = filterpan["IsDuplicate"];
            thirdpattern["ThirdHolderPanMismatched"] = 1;

            let otherFeed1 = await getFeedCamsTransactionUccFolioBySession(recordSession);

            let folioLists = otherFeed1.filter(x => x.FirstHolderPan === thirdpattern["FirstHolderPan"] &&
                x.SecondHolderPan === thirdpattern["SecondHolderPan"] &&
                x.ThirdHolderPan === thirdpattern["ThirdHolderPan"] &&
                x.GuardianPan === thirdpattern["GuardianPan"] &&
                x.NomineeFName.toLowerCase() === thirdpattern["NomineeFName"].toLowerCase() &&
                x.Nominee2FName.toLowerCase() === thirdpattern["Nominee2FName"].toLowerCase() &&
                x.Nominee3FName.toLowerCase() === thirdpattern["Nominee3FName"].toLowerCase());
            for (let k = 0; k < folioLists.length; k++) {
                let alist = folioLists[k];
                alist["ShowInList"] = 1;
                alist["CaseCode"] = filterpan["IsDuplicate"];
                await updateCamsFeedTransactionUccFolio(alist);
            }

            await updateCamsFeedTransactionUccFolio(thirdpattern);
        }

        let feed4 = await getFeedCamsTransactionUccFolioBySession(recordSession);
        let setallGuardianpattern = feed4.filter(x => x.GuardianPan === getfilterpanno);
        for (let j = 0; j < setallGuardianpattern.length; j++) {
            let gaurdianpattern = setallGuardianpattern[j];

            gaurdianpattern["ShowInList"] = 1;
            gaurdianpattern["CaseCode"] = filterpan["IsDuplicate"];
            gaurdianpattern["GuradianPanMismatched"] = 1;

            let otherFeed1 = await getFeedCamsTransactionUccFolioBySession(recordSession);

            let folioLists = otherFeed1.filter(x => x.FirstHolderPan === gaurdianpattern["FirstHolderPan"] &&
                x.SecondHolderPan === gaurdianpattern["SecondHolderPan"] &&
                x.ThirdHolderPan === gaurdianpattern["ThirdHolderPan"] &&
                x.GuardianPan === gaurdianpattern["GuardianPan"] &&
                x.NomineeFName.toLowerCase() === gaurdianpattern["NomineeFName"].toLowerCase() &&
                x.Nominee2FName.toLowerCase() === gaurdianpattern["Nominee2FName"].toLowerCase() &&
                x.Nominee3FName.toLowerCase() === gaurdianpattern["Nominee3FName"].toLowerCase());
            for (let k = 0; k < folioLists.length; k++) {
                let alist = folioLists[k];
                alist["ShowInList"] = 1;
                alist["CaseCode"] = filterpan["IsDuplicate"];
                await updateCamsFeedTransactionUccFolio(alist);
            }

            await updateCamsFeedTransactionUccFolio(gaurdianpattern);
        }
    }
};

async function setOtherInPendingListAll(recordSession) {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        const result = await request.execute("UpdateFeedTransactionUccFolioOther");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while updating feed transaction pan record...');
    }

};

async function finalArrarngeFolioInFolioList(recordSession) {
    let allFeed = await getFeedCamsTransactionUccFolio();

    let pendingFolios = await getFeedCamsTransactionUccFolioBySession(recordSession);

    for (let i = 0; i < pendingFolios.length; i++) {
        let folio = pendingFolios[i];

        let folioLists = allFeed.filter(x => x.Ucc.toLowerCase() === folio["Ucc"].toLowerCase() &&
            x.FirstHolderName.toLowerCase() === folio["FirstHolderName"].toLowerCase() &&
            x.SecondHolderName.toLowerCase() === folio["SecondHolderName"].toLowerCase() &&
            x.ThirdHolderName.toLowerCase() === folio["ThirdHolderName"].toLowerCase() &&
            x.FirstHolderPan === folio["FirstHolderPan"] &&
            x.SecondHolderPan === folio["SecondHolderPan"] &&
            x.ThirdHolderPan === folio["ThirdHolderPan"] &&
            x.GuardianPan === folio["GuardianPan"] &&
            x.KarvyFName.toLowerCase() === folio["KarvyFName"].toLowerCase() &&
            x.NomineeFName.toLowerCase() === folio["NomineeFName"].toLowerCase() &&
            x.Nominee2FName.toLowerCase() === folio["Nominee2FName"].toLowerCase() &&
            x.Nominee3FName.toLowerCase() === folio["Nominee3FName"].toLowerCase());

        let folioListsArray = folioLists.map(item => {
            const FolioNumber = `${item.FolioNumber}`;
            const FundDescription = `${item.FundDescription}`;
            return { FolioNumber, FundDescription };
        });

        let folioListsArr = [... new Set(folioListsArray)];

        for (let j = 0; j < folioLists.length; j++) {
            let flist = folioLists[j];
            flist["FolioLists"] = JSON.stringify(folioListsArr);

            await updateCamsFeedTransactionUccFolio(flist);
        }
    }
};

async function transactionFolioListTagging(recordSession) {
    let allFeed = await getFeedCamsTransactionUccFolio();

    let pendingFolios = allFeed.filter(x => x.FolioLists === '');

    for (let i = 0; i < pendingFolios.length; i++) {
        let folio = pendingFolios[i];

        let folioLists = allFeed.filter(x => x.Ucc.toLowerCase() === folio["Ucc"].toLowerCase() &&
            x.FirstHolderName.toLowerCase() === folio["FirstHolderName"].toLowerCase() &&
            x.FirstHolderPan === folio["FirstHolderPan"] &&
            x.SecondHolderPan === folio["SecondHolderPan"] &&
            x.ThirdHolderPan === folio["ThirdHolderPan"] &&
            x.GuardianPan === folio["GuardianPan"] &&
            x.GuardianName.toLowerCase() === folio["GuardianName"].toLowerCase() &&
            x.KarvyFName.toLowerCase() === folio["KarvyFName"].toLowerCase() &&
            x.NomineeFName.toLowerCase() === folio["NomineeFName"].toLowerCase());

        let folioListsArray = folioLists.map(item => {
            const FolioNumber = `${item.FolioNumber}`;
            const FundDescription = `${item.FundDescription}`;
            return { FolioNumber, FundDescription };
        });

        let folioListsArr = [... new Set(folioListsArray)];

        for (let j = 0; j < folioLists.length; j++) {
            let flist = folioLists[j];
            flist["FolioLists"] = JSON.stringify(folioListsArr);

            await updateCamsFeedTransactionUccFolio(flist);
        }
    }
};

// async function readCamsWbr22Email() {
//     var link = '';

//     const client = new imapFlow.ImapFlow({
//         host: process.env.IMAP_HOST,
//         port: 993,
//         secure: true,
//         auth: {
//             user: process.env.IMAP_USER,
//             pass: process.env.IMAP_PASSWORD
//         }
//     });

//     await client.connect();

//     let lock = await client.getMailboxLock('INBOX');

//     try {
//         // let message = await client.fetchOne(client.mailbox.exists, { source: true });
//         // console.log(message.source.toString());

//         let messageList = await client.search({
//             seen: false, or: [
//                 { subject: 'WBR22. AuM on a specific date by Scheme by Investor, Request Id' }
//             ]
//         }, { uid: false });

//         if (messageList.length > 0) {
//             // console.log(messageList[0].toString());
//             let message = await client.fetchOne(messageList[0].toString(), { uid: false, source: true });
//             // console.log(message.source.toString());
//             // const pdfFilePath = path.join(__dirname.replace("app", "public"), '..', 'documents', CommonFunction.GetUniqueId()+'.txt');
//             // fileSystem.writeFileSync(pdfFilePath,message.source.toString().trim().replaceAll('=\r\n',''));

//             var downloadUrlBreak = message.source.toString('utf8').trim().replaceAll('=\r\n', '').split('DownloadURL');
//             if (downloadUrlBreak.length > 0) {
//                 var anchorBreak = downloadUrlBreak[1].split("href=3D'");

//                 if (anchorBreak.length > 0) {
//                     var anchorBreakEnd = anchorBreak[1].split("'>");

//                     if (anchorBreakEnd.length > 0) {
//                         link = anchorBreakEnd[0].trim();
//                     }
//                 }
//             }

//             if (link != '') {
//                 var messages = [];
//                 messages.push(messageList[0]);

//                 await client.messageFlagsAdd(messages, ['\\Seen'], { uid: false });
//             }
//         }
//     }
//     catch (err) {
//         console.log(err);
//     }
//     finally {
//         lock.release();
//     }

//     await client.logout();

//     return { Status: (link != ''), Link: link };
// };

// async function readCamsWbr22File(fileName, link) {
//     var filePath = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'cams', fileName);
//     var wbrFolder = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'cams', 'wbr22');
//     var recordCount = 0

//     var downloadFileResult = await downloadCamsWbr22File(link, filePath);

//     if (downloadFileResult.Status == true) {
//         var extractFileResult = await extractCamsWbr22ZipFile(filePath, wbrFolder);

//         if (extractFileResult.DataFileName != '') {
//             var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'cams', 'wbr22', extractFileResult.DataFileName);

//             var data = await readDataFile(dataFilePath);

//             recordCount = data.length;

//             for (let i = 0; i < recordCount; i++) {
//                 await saveCamsWbr22Record(data[i]);
//             }
//         }
//     }

//     return { Status: (recordCount != 0), RecordCount: recordCount };
// };

// async function downloadCamsWbr22File(link, filePath) {
//     return new Promise((resolve, reject) => {
//         var file = fileSystem.createWriteStream(filePath);
//         var request = https.get(link, function (response) {
//             response.pipe(file);

//             file.on('finish', async function () {
//                 file.close();

//                 resolve({ Status: true, Message: 'File is created at ' + filePath });
//             });
//         }).on('error', function (err) {
//             fileSystem.unlink(filePath, (err) => { });
//             reject(err.message);
//         });
//     });
// };

// async function extractCamsWbr22ZipFile(filePath, wbrFolder) {
//     return new Promise((resolve, reject) => {
//         var dbfFileName = '';

//         const zipStream = zip.extractFull(filePath, wbrFolder, {
//             password: 'Punit@0516',
//             $bin: zipLib.path7za
//         });

//         zipStream.on('data', function (data) {
//             if (data.status == 'extracted') {
//                 dbfFileName = data.file;
//             }
//         });

//         zipStream.on('end', () => {
//             // Do stuff with unzipped content
//             resolve({ Status: true, Message: 'File is extracted at ' + wbrFolder, DataFileName: dbfFileName });
//         });

//         zipStream.on('error', (err) => {
//             reject(err);
//         });
//     });
// };

// async function saveCamsWbr22Record(record) {
//     let pool = await appPool.connect();

//     var asset_date = null;
//     var Ucc = '';

//     if (record["asset_date"] != null && record["asset_date"] != undefined) {
//         asset_date = CommonFunction.ConvertDateDMYToYMD(record["asset_date"], '-');
//     }

//     let ledgerData = await getClientTransactionUnitLedgerUcc(record["folio"].trim());

//     if (ledgerData != null) {
//         Ucc = ledgerData.Ucc;
//     }

//     const transaction = pool.transaction();
//     try {
//         await transaction.begin();
//         const request = transaction.request();

//         request.input("Ucc", Ucc)
//             .input("ProductCode", (record["product"] == null) ? '' : record["product"].trim())
//             .input("Fund", '')
//             .input("FolioNumber", (record["folio"] == null) ? '' : record["folio"].trim())
//             .input("SchemeCode", '')
//             .input("FundDescription", (record["scheme_nam"] == null) ? '' : record["scheme_nam"].trim())
//             .input("AssetDate", asset_date)
//             .input("Units", (record["units"] == null) ? 0 : record["units"])
//             .input("NAV", (record["nav"] == null) ? 0 : record["nav"])
//             .input("AUM", (record["closing_as"] == null) ? 0 : record["closing_as"])
//             .input("Pledged", 0)
//             .input("TransactionDate", null)
//             .input("TransactionType", '')
//             .input("HoldingMode", '')
//             .input("AgentCode", (record["brok_dlr_c"] == null) ? '' : record["brok_dlr_c"].trim())
//             .input("BrokerCode", (record["ae_code"] == null) ? '' : record["ae_code"].trim())
//             .input("POutCode", '')
//             .input("InvestorId", '')
//             .input("InvestorName", (record["inv_name"] == null) ? '' : record["inv_name"].trim())
//             .input("Address1", '')
//             .input("Address2", '')
//             .input("Address3", '')
//             .input("City", (record["city"] == null) ? '' : record["city"].trim())
//             .input("Pincode", '')
//             .input("PhoneResidence", '')
//             .input("PhoneOffice", '')
//             .input("Fax", '')
//             .input("Email", '')
//             .input("ReportTime", '')
//             .input("DividentOption", '')
//             .input("PledgedBank", '')
//             .input("PanNumber", '')
//             .input("PlanType", '')
//             .input("ISIN", '')
//             .input("ClientId", '')
//             .input("DPId", '')
//             .input("ToDate", asset_date)
//             .input("MobileNumber", '')
//             .input("TaxStatus", (record["tax_status"] == null) ? '' : record["tax_status"].trim())
//             .input("InvIin", (record["inv_iin"] == null) ? '' : record["inv_iin"].trim())
//             .input("FolioOld", (record["folio_old"] == null) ? '' : record["folio_old"].trim())
//             .input("SchemeFolio", (record["scheme_fol"] == null) ? '' : record["scheme_fol"].trim());

//         const result = await request.execute("InsertFeedDailyHolding");

//         await transaction.commit();
//     }
//     catch (err) {
//         console.log(err);
//         try {
//             await transaction.rollback();
//         } catch (sqlerr) {
//             console.log(sqlerr);
//         }

//         throw new Error('Error while saving cams wbr22 record...');
//     }
// };

async function saveCamsClientAUMRecord(record) {
    // console.log(record);
    let pool = await appPool.connect();

    var asset_date = null;
    var Ucc = '';
    var nav = 0;
    var isin = '';

    if (record["REP_DATE"] != null && record["REP_DATE"] != undefined) {
        asset_date = date.format(record["REP_DATE"], 'YYYY-MM-DD');
    }
    // if (record["REP_DATE"] != null && record["REP_DATE"] != undefined) {
    //     asset_date = CommonFunction.ConvertDateDMYToYMD(record["REP_DATE"], '-');
    // }

    let ledgerData = await getClientTransactionUnitLedgerUcc(record["FOLIOCHK"]);
    if (ledgerData != null) {
        Ucc = ledgerData.Ucc;
    }

    let schemeData = await getBSESchemeByChannelPartnerCode(record["PRODUCT"]);
    if (schemeData != null) {
        isin = schemeData.ISIN;
    }

    if (record["RUPEE_BAL"] != null && record["CLOS_BAL"] != null) {
        if (record["RUPEE_BAL"] != 0 && record["CLOS_BAL"] != 0) {
            nav = record["RUPEE_BAL"] / record["CLOS_BAL"];
        }
        else {
            nav = 0;
        }
    }
    else {
        nav = 0;
    }

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("Ucc", Ucc)
            .input("ProductCode", (record["PRODUCT"] == null) ? '' : record["PRODUCT"])
            .input("Fund", '')
            .input("FolioNumber", (record["FOLIOCHK"] == null) ? '' : record["FOLIOCHK"])
            .input("SchemeCode", '')
            .input("FundDescription", (record["SCH_NAME"] == null) ? '' : record["SCH_NAME"])
            .input("AssetDate", asset_date)
            .input("Units", (record["CLOS_BAL"] == null) ? 0 : record["CLOS_BAL"])
            .input("NAV", nav)
            .input("AUM", (record["RUPEE_BAL"] == null) ? 0 : record["RUPEE_BAL"])
            .input("Pledged", 0)
            .input("TransactionDate", null)
            .input("TransactionType", '')
            .input("HoldingMode", (record["HOLDING_NA"] == null) ? '' : record["HOLDING_NA"])
            .input("AgentCode", (record["BROKER_COD"] == null) ? '' : record["BROKER_COD"])
            .input("BrokerCode", (record["SUBBROKER"] == null) ? '' : record["SUBBROKER"])
            .input("POutCode", '')
            .input("InvestorId", '')
            .input("InvestorName", (record["INV_NAME"] == null) ? '' : record["INV_NAME"])
            .input("Address1", (record["ADDRESS1"] == null) ? '' : record["ADDRESS1"])
            .input("Address2", (record["ADDRESS2"] == null) ? '' : record["ADDRESS2"])
            .input("Address3", (record["ADDRESS3"] == null) ? '' : record["ADDRESS3"])
            .input("City", (record["CITY"] == null) ? '' : record["CITY"])
            .input("Pincode", (record["PINCODE"] == null) ? '' : record["PINCODE"])
            .input("PhoneResidence", (record["PHONE_RES"] == null) ? '' : record["PHONE_RES"])
            .input("PhoneOffice", (record["PHONE_OFF"] == null) ? '' : record["PHONE_OFF"])
            .input("Fax", '')
            .input("Email", (record["EMAIL"] == null) ? '' : record["EMAIL"])
            .input("ReportTime", '')
            .input("DividentOption", '')
            .input("PledgedBank", '')
            .input("PanNumber", (record["PAN_NO"] == null) ? '' : record["PAN_NO"])
            .input("PlanType", '')
            .input("ISIN", isin)
            .input("ClientId", '')
            .input("DPId", (record["DP_ID"] == null) ? '' : record["DP_ID"])
            .input("ToDate", null)
            .input("MobileNumber", (record["MOBILE_NO"] == null) ? '' : record["MOBILE_NO"])
            .input("TaxStatus", (record["TAX_STATUS"] == null) ? '' : record["TAX_STATUS"])
            .input("InvIin", (record["INV_IIN"] == null) ? 0 : record["INV_IIN"])
            .input("FolioOld", (record["FOLIO_OLD"] == null) ? '' : record["FOLIO_OLD"])
            .input("SchemeFolio", (record["SCHEME_FOL"] == null) ? '' : record["SCHEME_FOL"]);

        const result = await request.execute("InsertFeedDailyHolding");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while saving cams wbr22 record...');
    }
};

async function readkarvy203Email() {
    var link = '';

    const client = new imapFlow.ImapFlow({
        host: process.env.IMAP_HOST,
        port: 993,
        secure: true,
        auth: {
            user: process.env.IMAP_USER,
            pass: process.env.IMAP_PASSWORD
        }
    });

    await client.connect();

    let lock = await client.getMailboxLock('INBOX');

    try {
        // let message = await client.fetchOne(client.mailbox.exists, { source: true });
        // console.log(message.source.toString());

        let messageList = await client.search({
            seen: false, or: [
                { subject: 'Subscribed ClientWise AUM Report for Ref. No. : WBCUM21248914' }
            ]
        }, { uid: false });

        if (messageList.length > 0) {
            // console.log(messageList[0].toString());
            let message = await client.fetchOne(messageList[0].toString(), { uid: false, source: true });
            // console.log(message.source.toString());
            // const pdfFilePath = path.join(__dirname.replace("app", "public"), '..', 'documents', CommonFunction.GetUniqueId()+'.txt');
            // fileSystem.writeFileSync(pdfFilePath,message.source.toString().trim().replaceAll('=\r\n', ''));

            var downloadUrlBreak = message.source.toString('utf8').trim().replaceAll('=\r\n', '').split('mfs.kfintech.com</a>.');
            if (downloadUrlBreak.length > 0) {
                // console.log(downloadUrlBreak[1]);
                var anchorBreak = downloadUrlBreak[1].split('href=3D"');

                if (anchorBreak.length > 0) {
                    // console.log(anchorBreak[1].trim());

                    var anchorBreakEnd = anchorBreak[1].trim().split('" target');

                    if (anchorBreakEnd.length > 0) {
                        link = anchorBreakEnd[0].trim().replaceAll('3D', '');
                        // console.log(link);
                    }
                }
            }

            if (link != '') {
                var messages = [];
                messages.push(messageList[0]);

                await client.messageFlagsAdd(messages, ['\\Seen'], { uid: false });
            }
        }
    }
    catch (err) {
        console.log(err);
    }
    finally {
        lock.release();
    }

    await client.logout();

    return { Status: (link != ''), Link: link };
};

async function readKarvy203File(fileName, link) {
    var filePath = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'karvy', fileName);
    var mfsdFolder = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'karvy', 'mfsd203');
    var recordCount = 0;

    // console.log('link: '+link);

    var downloadFileResult = await downloadKarvy203File(link, filePath);

    if (downloadFileResult.Status == true) {
        var extractFileResult = await extractKarvy203ZipFile(filePath, mfsdFolder);

        if (extractFileResult.DataFileName != '' && extractFileResult.DataFileName.includes('.dbf')) {
            var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'karvy', 'mfsd203', extractFileResult.DataFileName);

            var data = await readDataFile(dataFilePath);

            recordCount = data.length;

            for (let i = 0; i < recordCount; i++) {
                var row = data[i];

                var transactionDate = null;
                var reportDate = null;
                var toDate = null;

                if (row['TRDATE'] != null && row['TRDATE'] != undefined) {
                    transactionDate = CommonFunction.ConvertDateDMYToYMD(row["TRDATE"], '/');
                }
                if (row['CRDATE'] != null && row['CRDATE'] != undefined) {
                    reportDate = CommonFunction.ConvertDateDMYToYMD(row["CRDATE"], '/');
                }
                if (row['TODATE'] != null && row['TODATE'] != undefined) {
                    toDate = CommonFunction.ConvertDateDMYToYMD(row["TODATE"], '/');
                }

                var dataItem = {
                    ProductCode: row['PRCODE'] || '',
                    Fund: row['FUND'] || '',
                    FolioNumber: row['ACNO'] || '',
                    SchemeCode: row['SCHEME'] || '',
                    FundDescription: row['FUNDDESC'] || '',
                    Balance: row['BALUNITS'] || 0,
                    Pledged: row['PLDG'] || 0,
                    TransactionDate: transactionDate,
                    TransactionType: row['TRDESC'] || '',
                    HoldMode: row['MOH'] || '',
                    AgentCode: row['BROKCODE'] || '',
                    BrokerCode: row['SBCODE'] || '',
                    POutCode: row['POUT'] || '',
                    InvestorId: row['INV_ID'] || '',
                    InvestorName: row['INVNAME'] || '',
                    Address1: row['ADD1'] || '',
                    Address2: row['ADD2'] || '',
                    Address3: row['ADD3'] || '',
                    City: row['CITY'] || '',
                    Pincode: row['INV_PIN'] || '',
                    PhoneResidence: row['RPHONE'] || '',
                    PhoneOffice: row['OPHONE'] || '',
                    Fax: row['FAX'] || '',
                    Email: row['EMAIL'] || '',
                    AUM: row['VALINV'] || 0,
                    NAV: row['LNAV'] || 0,
                    ReportDate: reportDate,
                    ReportTime: row['CRTIME'] || '',
                    DividendOption: row['DIVOPT'] || '',
                    PldgBank: row['PLDGBANK'] || '',
                    PAN: row['PAN'] || '',
                    Plan: row['PLN'] || '',
                    SchemeISIN: row['SCHEMEISIN'] || '',
                    ClientId: row['CLIENT_ID'] || '',
                    DPId: row['DP_ID'] || '',
                    ToDate: toDate,
                    MobileNo: row['MOBILE'] || ''
                };

                await saveKarvy203Record(dataItem);
            }
        }
        else if (extractFileResult.DataFileName != '' && extractFileResult.DataFileName.includes('.csv')) {
            var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'karvy', 'mfsd203', extractFileResult.DataFileName);

            const workBook = xlsx.readFile(dataFilePath);
            const workSheet = workBook.Sheets[workBook.SheetNames[0]];
            const jsonData = xlsx.utils.sheet_to_json(workSheet);

            recordCount = jsonData.length;

            for (const row of jsonData) {
                var transactionDate = null;
                var reportDate = null;
                var toDate = null;

                if (row['Transaction Date'] != null && row['Transaction Date'] != undefined) {
                    if (row['Transaction Date'].toString().includes('/')) {
                        transactionDate = CommonFunction.ConvertDateDMYToYMD(row['Transaction Date'], '/');
                    }
                    else {
                        transactionDate = date.format(CommonFunction.ExcelDateToJSDate(row['Transaction Date']), 'YYYY-MM-DD');
                    }
                }
                if (row['Report Date'] != null && row['Report Date'] != undefined) {
                    if (row['Report Date'].toString().includes('/')) {
                        reportDate = CommonFunction.ConvertDateDMYToYMD(row['Report Date'], '/');
                    }
                    else {
                        reportDate = date.format(CommonFunction.ExcelDateToJSDate(row['Report Date']), 'YYYY-MM-DD');
                    }
                }
                if (row['To Date'] != null && row['To Date'] != undefined) {
                    if (row['To Date'].toString().includes('/')) {
                        toDate = CommonFunction.ConvertDateDMYToYMD(row['To Date'], '/');
                    }
                    else {
                        toDate = date.format(CommonFunction.ExcelDateToJSDate(row['To Date']), 'YYYY-MM-DD');
                    }
                }
                var dataItem = {
                    ProductCode: row['Product Code'] || '',
                    Fund: row['Fund'] || '',
                    FolioNumber: row['Folio Number'] || '',
                    SchemeCode: row['Scheme Code'] || '',
                    FundDescription: row['Fund Description'] || '',
                    Balance: row['Balance'] || 0,
                    Pledged: row['Pledged'] || 0,
                    TransactionDate: transactionDate,
                    TransactionType: row['Transaction Type'] || '',
                    HoldMode: row['Hold Mode'] || '',
                    AgentCode: row['Agent Code'] || '',
                    BrokerCode: row['Broker Code'] || '',
                    POutCode: row['P-OUT Code'] || '',
                    InvestorId: row['Investor ID'] || '',
                    InvestorName: row['Investor Name'] || '',
                    Address1: row['Address #1'] || '',
                    Address2: row['Address #2'] || '',
                    Address3: row['Address #3'] || '',
                    City: row['City'] || '',
                    Pincode: row['Pincode'] || '',
                    PhoneResidence: row['Phone Residence'] || '',
                    PhoneOffice: row['Phone Office'] || '',
                    Fax: row['Fax'] || '',
                    Email: row['Email'] || '',
                    AUM: row['AUM'] || 0,
                    NAV: row['NAV'] || 0,
                    ReportDate: reportDate,
                    ReportTime: row['Report Time'] || '',
                    DividendOption: row['Dividend Option'] || '',
                    PldgBank: row['PldgBank'] || '',
                    PAN: row['PAN'] || '',
                    Plan: row['Plan'] || '',
                    SchemeISIN: row['SchemeISIN'] || '',
                    ClientId: row['ClientID'] || '',
                    DPId: row['DPID'] || '',
                    ToDate: toDate,
                    MobileNo: row['Mobile No'] || ''
                };
                await saveKarvy203Record(dataItem);
            }
        }
        else if (extractFileResult.DataFileName != '' && extractFileResult.DataFileName.includes('.txt')) {
            var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'karvy', 'mfsd203', extractFileResult.DataFileName);

            const workBook = xlsx.readFile(dataFilePath, { FS: "~", raw: true });
            const workSheet = workBook.Sheets[workBook.SheetNames[0]];
            const jsonData = xlsx.utils.sheet_to_json(workSheet);

            recordCount = jsonData.length;

            for (const row of jsonData) {
                var transactionDate = null;
                var reportDate = null;
                var toDate = null;

                // console.log(row);
                // break;

                if (row['Transaction Date'] != null && row['Transaction Date'] != undefined) {
                    transactionDate = CommonFunction.ConvertDateDMYToYMD(row['Transaction Date'], '/');
                }
                if (row['Report Date'] != null && row['Report Date'] != undefined) {
                    reportDate = CommonFunction.ConvertDateDMYToYMD(row['Report Date'], '/');
                }
                if (row['To Date'] != null && row['To Date'] != undefined) {
                    toDate = CommonFunction.ConvertDateDMYToYMD(row['To Date'], '/');
                }
                var dataItem = {
                    ProductCode: row['Product Code'] || '',
                    Fund: row['Fund'] || '',
                    FolioNumber: row['Folio Number'] || '',
                    SchemeCode: row['Scheme Code'] || '',
                    FundDescription: row['Fund Description'] || '',
                    Balance: row['Balance'] || 0,
                    Pledged: row['Pledged'] || 0,
                    TransactionDate: transactionDate,
                    TransactionType: row['Transaction Type'] || '',
                    HoldMode: row['Hold Mode'] || '',
                    AgentCode: row['Agent Code'] || '',
                    BrokerCode: row['Broker Code'] || '',
                    POutCode: row['P-OUT Code'] || '',
                    InvestorId: row['Investor ID'] || '',
                    InvestorName: row['Investor Name'] || '',
                    Address1: row['Address #1'] || '',
                    Address2: row['Address #2'] || '',
                    Address3: row['Address #3'] || '',
                    City: row['City'] || '',
                    Pincode: row['Pincode'] || '',
                    PhoneResidence: row['Phone Residence'] || '',
                    PhoneOffice: row['Phone Office'] || '',
                    Fax: row['Fax'] || '',
                    Email: row['Email'] || '',
                    AUM: row['AUM'] || 0,
                    NAV: row['NAV'] || 0,
                    ReportDate: reportDate,
                    ReportTime: row['Report Time'] || '',
                    DividendOption: row['Dividend Option'] || '',
                    PldgBank: row['PldgBank'] || '',
                    PAN: row['PAN'] || '',
                    Plan: row['Plan'] || '',
                    SchemeISIN: row['SchemeISIN'] || '',
                    ClientId: row['ClientID'] || '',
                    DPId: row['DPID'] || '',
                    ToDate: toDate,
                    MobileNo: row['Mobile No'] || ''
                };

                // console.log(dataItem);

                await saveKarvy203Record(dataItem);
                // break;
            }
        }
    }

    return { Status: (recordCount != 0), RecordCount: recordCount };
};

async function downloadKarvy203File(link, filePath) {
    // console.log(link);
    return new Promise((resolve, reject) => {
        var file = fileSystem.createWriteStream(filePath);
        var request = https.get(link, function (response) {
            if (response.statusCode == 302) {
                let downloadLink = response.headers.location;
                // console.log(downloadLink);
                var request1 = https.get(downloadLink, function (res) {
                    // console.log(res.statusCode);
                    // console.log(res.headers);
                    let downloadLink1 = res.headers.location;
                    var request2 = https.get(downloadLink1, function (res1) {
                        // console.log(res1.statusCode);
                        // console.log(res1.headers);
                        res1.pipe(file);

                        file.on('finish', async function () {
                            file.close();

                            resolve({ Status: true, Message: 'File is created at ' + filePath });
                        });
                    }).on('error', function (err) {
                        fileSystem.unlink(filePath, (err) => { });
                        reject(err.message);
                    });

                }).on('error', function (err) {
                    fileSystem.unlink(filePath, (err) => { });
                    reject(err.message);
                });
            }
            // console.log(response.headers);
        }).on('error', function (err) {
            fileSystem.unlink(filePath, (err) => { });
            reject(err.message);
        });
    });
};

async function extractKarvy203ZipFile(filePath, mfsdFolder) {
    return new Promise((resolve, reject) => {
        var dbfFileName = '';

        const zipStream = zip.extractFull(filePath, mfsdFolder, {
            password: 'Laksh@0208',
            $bin: zipLib.path7za
        });
        // const zipStream = zip.extractFull(filePath, mfsdFolder, {
        //     password: 'PuKu@1602',
        //     $bin: zipLib.path7za
        // });

        zipStream.on('data', function (data) {
            if (data.status == 'extracted') {
                dbfFileName = data.file;
            }
        });

        zipStream.on('end', () => {
            // Do stuff with unzipped content
            resolve({ Status: true, Message: 'File is extracted at ' + mfsdFolder, DataFileName: dbfFileName });
        });

        zipStream.on('error', (err) => {
            reject(err);
        });
    });
};

async function saveKarvy203Record(record) {
    let pool = await appPool.connect();

    var Ucc = '';
    var isin = '';

    let ledgerData = await getClientTransactionUnitLedgerUcc(record["FolioNumber"]);
    if (ledgerData != null) {
        Ucc = ledgerData.Ucc;
    }

    let schemeData = await getBSESchemeByChannelPartnerCode(record["ProductCode"]);
    if (schemeData != null) {
        isin = schemeData.ISIN;
    }

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("Ucc", Ucc)
            .input("ProductCode", (record["ProductCode"] == null) ? '' : record["ProductCode"])
            .input("Fund", (record["Fund"] == null) ? '' : record["Fund"])
            .input("FolioNumber", (record["FolioNumber"] == null) ? '' : record["FolioNumber"])
            .input("SchemeCode", (record["SchemeCode"] == null) ? '' : record["SchemeCode"])
            .input("FundDescription", (record["FundDescription"] == null) ? '' : record["FundDescription"])
            .input("AssetDate", record["ReportDate"])
            .input("Units", (record["Balance"] == null) ? 0 : record["Balance"])
            .input("NAV", (record["NAV"] == null) ? 0 : record["NAV"])
            .input("AUM", (record["AUM"] == null) ? 0 : record["AUM"])
            .input("Pledged", (record["Pledged"] == null) ? 0 : record["Pledged"])
            .input("TransactionDate", record["TransactionDate"])
            .input("TransactionType", (record["TransactionType"] == null) ? '' : record["TransactionType"])
            .input("HoldingMode", (record["HoldMode"] == null) ? '' : record["HoldMode"])
            .input("AgentCode", (record["AgentCode"] == null) ? '' : record["AgentCode"])
            .input("BrokerCode", (record["BrokerCode"] == null) ? '' : record["BrokerCode"])
            .input("POutCode", (record["POutCode"] == null) ? '' : record["POutCode"])
            .input("InvestorId", (record["InvestorId"] == null) ? '' : record["InvestorId"])
            .input("InvestorName", (record["InvestorName"] == null) ? '' : record["InvestorName"])
            .input("Address1", (record["Address1"] == null) ? '' : record["Address1"])
            .input("Address2", (record["Address2"] == null) ? '' : record["Address2"])
            .input("Address3", (record["Address3"] == null) ? '' : record["Address3"])
            .input("City", (record["City"] == null) ? '' : record["City"])
            .input("Pincode", (record["Pincode"] == null) ? '' : record["Pincode"])
            .input("PhoneResidence", (record["PhoneResidence"] == null) ? '' : record["PhoneResidence"])
            .input("PhoneOffice", (record["PhoneOffice"] == null) ? '' : record["PhoneOffice"])
            .input("Fax", (record["Fax"] == null) ? '' : record["Fax"])
            .input("Email", (record["Email"] == null) ? '' : record["Email"])
            .input("ReportTime", (record["ReportTime"] == null) ? '' : record["ReportTime"])
            .input("DividentOption", (record["DividendOption"] == null) ? '' : record["DividendOption"])
            .input("PledgedBank", (record["PldgBank"] == null) ? '' : record["PldgBank"])
            .input("PanNumber", (record["PAN"] == null) ? '' : record["PAN"])
            .input("PlanType", (record["Plan"] == null) ? '' : record["Plan"])
            .input("ISIN", isin)
            .input("ClientId", (record["ClientId"] == null) ? '' : record["ClientId"])
            .input("DPId", (record["DPId"] == null) ? '' : record["DPId"])
            .input("ToDate", record["ToDate"])
            .input("MobileNumber", (record["MobileNo"] == null) ? '' : record["MobileNo"])
            .input("TaxStatus", '')
            .input("InvIin", '')
            .input("FolioOld", '')
            .input("SchemeFolio", '');

        const result = await request.execute("InsertFeedDailyHolding");

        await transaction.commit();
    }
    catch (err) {
        // console.log(record);
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while saving karvy 203 record...');
    }
};

async function getCamswbr9Records(recordSession) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("RecordSession", recordSession);
    const readResult = await readRequest.execute("GetFeedCamsWbr9ByRecordSession");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function getKarvy311Records(recordSession) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("RecordSession", recordSession);
    const readResult = await readRequest.execute("GetFeedKarvy311ByRecordSession");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function getTaxStatus(taxStatusName) {
    var taxStatus = taxStatusName;

    if (taxStatusName == 'Individual' || taxStatusName == 'Resident Individual') {
        taxStatus = 'Individual';
    }
    else if (taxStatusName.includes('NRI')) {
        if (taxStatusName.includes('Minor')) {
            taxStatus = 'NRI Child';
        } else {
            taxStatus = 'NRI';
        }
    }
    else if (taxStatusName == 'On behalf of minor' || taxStatusName == 'On Behalf Of Minor') {
        taxStatus = 'On behalf of minor';
    }
    else if (taxStatusName == 'Sole Proprietor' || taxStatusName == 'SOLE PROPRIETORSHIP') {
        taxStatus = 'Sole Proprietorship';
    }

    return taxStatus;
};

async function getKarvyTaxStatus(taxStatusName) {
    var taxStatus = taxStatusName;

    if (taxStatusName == 'I') { taxStatus = 'Individual'; }
    else if (taxStatusName == 'B') { taxStatus = 'Body Corporate'; }
    else if (taxStatusName == 'N') { taxStatus = 'NRI'; }
    else if (taxStatusName == 'H') { taxStatus = 'HUF'; }
    else if (taxStatusName == 'M') { taxStatus = 'On behalf of minor'; }
    else if (taxStatusName == 'P') { taxStatus = 'Partnership Firm'; }
    else if (taxStatusName == 'L') { taxStatus = 'Sole Proprietorship'; }
    else if (taxStatusName == 'C') { taxStatus = 'Company'; }
    else if (taxStatusName == 'T') { taxStatus = 'Trust'; }
    else if (taxStatusName == 'O') { taxStatus = 'Company'; }
    else if (taxStatusName == 'W') { taxStatus = 'Sole Proprietorship'; }
    else if (taxStatusName == '1') { taxStatus = 'Individual'; }
    else if (taxStatusName == '2') { taxStatus = 'On behalf of minor'; }
    else if (taxStatusName == '3') { taxStatus = 'HUF'; }
    else if (taxStatusName == '4') { taxStatus = 'Company'; }
    else if (taxStatusName == '5') { taxStatus = 'AOP/BOI'; }
    else if (taxStatusName == '7') { taxStatus = 'Body Corporate'; }

    return taxStatus;
};

async function getHoldingType(holdingCode) {
    var holdingType = '';

    if (holdingCode == 'AS') { holdingType = 'ANYONE OR SURVIVOR'; }
    else if (holdingCode == 'ES') { holdingType = 'ANYONE OR SURVIVOR'; }
    else if (holdingCode == 'SI') { holdingType = 'SINGLE'; }
    else if (holdingCode == 'JO') { holdingType = 'JOINT'; }

    return holdingType
};

async function getKarvyHoldingType(holdingCode) {
    var holdingType = '';

    if (holdingCode == 'ANYONE OR SURVIVOR') { holdingType = 'ANYONE OR SURVIVOR'; }
    else if (holdingCode == 'EITHER OR SURVIVOR') { holdingType = 'ANYONE OR SURVIVOR'; }
    else if (holdingCode == 'SINGLE') { holdingType = 'SINGLE'; }
    else if (holdingCode == 'JOINTLY') { holdingType = 'JOINT'; }
    else if (holdingCode == 'JOINT') { holdingType = 'JOINT'; }

    return holdingType
};

async function saveFeedCamsTransactionUccFolio(record, recordSession, productFolio, taxStatus, holdingType) {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("Ucc", '')
            .input("IsProfileOnKinntegra", false)
            .input("ShowInList", 0)
            .input("CaseCode", 0)
            .input("FolioNumber", record["foliochk"])
            .input("ProductCode", record["product"])
            .input("Fund", record["sch_name"])
            .input("FundDescription", record["sch_name"])
            .input("ProductFolio", productFolio)
            .input("FirstHolderName", record["inv_name"])
            .input("SecondHolderName", record["jnt_name1"])
            .input("ThirdHolderName", record["jnt_name2"])
            .input("GuardianName", record["guard_name"])
            .input("NameCount", 0)
            .input("Address1", record["address1"])
            .input("Address2", record["address2"])
            .input("Address3", record["address3"])
            .input("City", record["city"])
            .input("State", '')
            .input("Country", '')
            .input("PinCode", record["pincode"])
            .input("PhoneRes", record["phone_res"])
            .input("PhoneRes1", '')
            .input("PhoneRes2", '')
            .input("PhoneOff", record["phone_off"])
            .input("PhoneOff1", '')
            .input("PhoneOff2", '')
            .input("FirstHolderPan", record["pan_no"])
            .input("SecondHolderPan", record["joint1_pan"])
            .input("ThirdHolderPan", record["joint2_pan"])
            .input("GuardianPan", record["guard_pan"])
            .input("PanCount", 0)
            .input("NamePanComparison", 0)
            .input("IsFirstHolderPanAvailable", false)
            .input("IsSecondHolderPanAvailable", false)
            .input("IsThirdHolderPanAvailable", false)
            .input("IsGuardianPanAvailable", false)
            .input("FirstHolderPanMismatched", 0)
            .input("SecondHolderPanMismatched", 0)
            .input("ThirdHolderPanMismatched", 0)
            .input("GuardianPanMismatched", 0)
            .input("FirstHolderFamilyList", '')
            .input("SecondHolderFamilyList", '')
            .input("ThirdHolderFamilyList", '')
            .input("GuardianFamilyList", '')
            .input("FirstHolderFamilyCount", 0)
            .input("SecondHolderFamilyCount", 0)
            .input("ThirdHolderFamilyCount", 0)
            .input("GuardianFamilyCount", 0)
            .input("DateOfBirth", record["inv_dob"])
            .input("Mobile", record["mobile_no"])
            .input("Email", record["email"])
            .input("Occupation", record["occupation"])
            .input("HoldingNature", holdingType)
            .input("TaxStatus", taxStatus)
            .input("FirstHolderAadharNo", record["aadhaar"])
            .input("SecondHolderAadharNo", '')
            .input("ThirdHolderAadharNo", '')
            .input("GuardianAadharNo", '')
            .input("BankIFSCCode", record["ifsc_code"])
            .input("BankName", record["bank_name"])
            .input("BankBranch", record["branch"])
            .input("AccountType", record["ac_type"])
            .input("AccountNo", record["ac_no"])
            .input("BankAddress1", record["b_address1"])
            .input("BankAddress2", record["b_address2"])
            .input("BankAddress3", record["b_address3"])
            .input("BankCity", record["b_city"])
            .input("BankState", '')
            .input("BankCountry", '')
            .input("BankPincode", record["b_pincode"])
            .input("NomineeName", record["nom_name"])
            .input("NomineeFName", '')
            .input("NomineeRelation", record["relation"])
            .input("NomineeAddress1", record["nom_addr1"])
            .input("NomineeAddress2", record["nom_addr2"])
            .input("NomineeAddress3", record["nom_addr3"])
            .input("NomineeCity", record["nom_city"])
            .input("NomineeState", record["nom_state"])
            .input("NomineePincode", record["nom_pincod"])
            .input("NomineePhoneOff", record["nom_ph_off"])
            .input("NomineePhoneRes", record["nom_ph_res"])
            .input("NomineeEmail", record["nom_email"])
            .input("NomineePercentage", record["nom_percen"])
            .input("Nominee2Name", record["nom2_name"])
            .input("Nominee2FName", '')
            .input("Nominee2Relation", record["nom2_relat"])
            .input("Nominee2Address1", record["nom2_addr1"])
            .input("Nominee2Address2", record["nom2_addr2"])
            .input("Nominee2Address3", record["nom2_addr3"])
            .input("Nominee2City", record["nom2_city"])
            .input("Nominee2State", record["nom2_state"])
            .input("Nominee2Pincode", record["nom2_pinco"])
            .input("Nominee2PhoneOff", record["nom2_ph_of"])
            .input("Nominee2PhoneRes", record["nom2_ph_re"])
            .input("Nominee2Email", record["nom2_email"])
            .input("Nominee2Percentage", record["nom2_perce"])
            .input("Nominee3Name", record["nom3_name"])
            .input("Nominee3FName", '')
            .input("Nominee3Relation", record["nom3_relat"])
            .input("Nominee3Address1", record["nom3_addr1"])
            .input("Nominee3Address2", record["nom3_addr2"])
            .input("Nominee3Address3", record["nom3_addr3"])
            .input("Nominee3City", record["nom3_city"])
            .input("Nominee3State", record["nom3_state"])
            .input("Nominee3Pincode", record["nom3_pinco"])
            .input("Nominee3PhoneOff", record["nom3_ph_of"])
            .input("Nominee3PhoneRes", record["nom3_ph_re"])
            .input("Nominee3Email", record["nom3_email"])
            .input("Nominee3Percentage", record["nom3_perce"])
            .input("FirstHolderCkycNo", record["fh_ckyc_no"])
            .input("SecondHolderCkycNo", record["jh1_ckyc"])
            .input("ThirdHolderCkycNo", record["jh2_ckyc"])
            .input("GuardianHolderCkycNo", record["g_ckyc_no"])
            .input("FirstHolderKyclFlag", '')
            .input("SecondHolderKyclFlag", '')
            .input("ThirdHolderKyclFlag", '')
            .input("GuardianHolderKyclFlag", '')
            .input("SecondHolderDob", record["jh1_dob"])
            .input("ThirdHolderDob", record["jh2_dob"])
            .input("GuardianHolderDob", record["guardian_d"])
            .input("KarvyTPin", '')
            .input("KarvyFName", '')
            .input("KarvyMName", '')
            .input("KarvyLName", '')
            .input("KarvyInvestorId", '')
            .input("CamsInvIin", record["inv_iin"])
            .input("CamsUniNo", record["uin_no"])
            .input("CamsRepDate", record["rep_date"])
            .input("CamsCloseBal", record["clos_bal"])
            .input("CamsRupeeBal", record["rupee_bal"])
            .input("BrokerCode", record["brokcode"])
            .input("SubBrokerCode", '')
            .input("SubBrokerCode1", '')
            .input("CamsReinvFlag", record["reinv_flag"])
            .input("KarvyCommonAccNo", '')
            .input("KarvyInvestorResiFaxiNo", '')
            .input("CamsAmcCode", record["amc_code"])
            .input("CamsGstState", record["gst_state"])
            .input("KarvyCategory", '')
            .input("KarvyCategoryDesc", '')
            .input("KarvyStatusDesc", '')
            .input("DpId", record["dp_id"])
            .input("KarvyClientId", '')
            .input("KarvyMapinId", '')
            .input("KarvyDividendOption", '')
            .input("KarvyOccupationDescription", '')
            .input("CamsDemat", record["demat"])
            .input("CamsFolioDate", record["folio_date"])
            .input("CamsTpaLinked", record["tpa_linked"])
            .input("CamsFolioOld", record["folio_old"])
            .input("CamsSchemeFolio", record["scheme_fol"])
            .input("StampDuty", 0)
            .input("FolioLists", '')
            .input("Rta", 'CAMS_WBR9')
            .input("RecordSession", recordSession)
            .input("IsVerifiedByAdmin", false)
            .input("SubBrokerTagged", false)
            .input("SubBrokerTemp", '')
            .input("UccTemp", '');

        const result = await request.execute("InsertUpdateCamsFeedTransactionUccFolio");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while saving cams feed transaction ucc folio record...');
    }
};

async function saveFeedKarvyTransactionUccFolio(record, recordSession, productFolio, taxStatus, holdingType) {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("Ucc", '')
            .input("IsProfileOnKinntegra", false)
            .input("ShowInList", 0)
            .input("CaseCode", 0)
            .input("FolioNumber", record["folio"])
            .input("ProductCode", record["product_code"])
            .input("Fund", record["fund"])
            .input("FundDescription", record["fund_description"])
            .input("ProductFolio", productFolio)
            .input("FirstHolderName", record["investor_name"])
            .input("SecondHolderName", record["joint_name_1"])
            .input("ThirdHolderName", record["joint_name_2"])
            .input("GuardianName", record["guardianname"])
            .input("NameCount", 0)
            .input("Address1", record["address1"])
            .input("Address2", record["address2"])
            .input("Address3", record["address3"])
            .input("City", record["city"])
            .input("State", record["state"])
            .input("Country", '')
            .input("PinCode", record["pincode"])
            .input("PhoneRes", record["phone_residence"])
            .input("PhoneRes1", record["phone_res1"])
            .input("PhoneRes2", record["phone_res2"])
            .input("PhoneOff", record["phone_office"])
            .input("PhoneOff1", record["phone_off1"])
            .input("PhoneOff2", record["phone_off2"])
            .input("FirstHolderPan", record["pan_number"])
            .input("SecondHolderPan", record["pan2"])
            .input("ThirdHolderPan", record["pan3"])
            .input("GuardianPan", record["guardpanno"])
            .input("PanCount", 0)
            .input("NamePanComparison", 0)
            .input("IsFirstHolderPanAvailable", false)
            .input("IsSecondHolderPanAvailable", false)
            .input("IsThirdHolderPanAvailable", false)
            .input("IsGuardianPanAvailable", false)
            .input("FirstHolderPanMismatched", 0)
            .input("SecondHolderPanMismatched", 0)
            .input("ThirdHolderPanMismatched", 0)
            .input("GuardianPanMismatched", 0)
            .input("FirstHolderFamilyList", '')
            .input("SecondHolderFamilyList", '')
            .input("ThirdHolderFamilyList", '')
            .input("GuardianFamilyList", '')
            .input("FirstHolderFamilyCount", 0)
            .input("SecondHolderFamilyCount", 0)
            .input("ThirdHolderFamilyCount", 0)
            .input("GuardianFamilyCount", 0)
            .input("DateOfBirth", record["date_of_birth"])
            .input("Mobile", record["mobile_number"])
            .input("Email", record["email"])
            .input("Occupation", record["occ_code"])
            .input("HoldingNature", holdingType)
            .input("TaxStatus", taxStatus)
            .input("FirstHolderAadharNo", record["holder1_adhaar_info"])
            .input("SecondHolderAadharNo", record["holder2_aadhaar_info"])
            .input("ThirdHolderAadharNo", record["holder3_aadhaar_info"])
            .input("GuardianAadharNo", record["guardian_aadhaar_info"])
            .input("BankIFSCCode", record["ifsc_code"])
            .input("BankName", record["bank_name"])
            .input("BankBranch", record["branch"])
            .input("AccountType", record["account_type"])
            .input("AccountNo", record["bankaccno"])
            .input("BankAddress1", record["bank_address1"])
            .input("BankAddress2", record["bank_address2"])
            .input("BankAddress3", record["bank_address3"])
            .input("BankCity", record["bank_city"])
            .input("BankState", record["bank_state"])
            .input("BankCountry", '')
            .input("BankPincode", '')
            .input("NomineeName", record["nominee"])
            .input("NomineeFName", '')
            .input("NomineeRelation", record["nominee_relation"])
            .input("NomineeAddress1", record["nominee_address1"])
            .input("NomineeAddress2", record["nominee_address2"])
            .input("NomineeAddress3", record["nominee_address3"])
            .input("NomineeCity", record["nominee_city"])
            .input("NomineeState", record["nominee_state"])
            .input("NomineePincode", record["nominee_pincode"])
            .input("NomineePhoneOff", '')
            .input("NomineePhoneRes", record["nominee_phone_residence"])
            .input("NomineeEmail", record["nominee_email"])
            .input("NomineePercentage", record["nominee_ratio"])
            .input("Nominee2Name", record["nominee2"])
            .input("Nominee2FName", '')
            .input("Nominee2Relation", record["nominee2_relation"])
            .input("Nominee2Address1", record["nominee2_address1"])
            .input("Nominee2Address2", record["nominee2_address2"])
            .input("Nominee2Address3", record["nominee2_address3"])
            .input("Nominee2City", record["nominee2_city"])
            .input("Nominee2State", record["nominee2_state"])
            .input("Nominee2Pincode", record["nominee2_pincode"])
            .input("Nominee2PhoneOff", '')
            .input("Nominee2PhoneRes", record["nominee2_phone_residence"])
            .input("Nominee2Email", record["nominee2_email"])
            .input("Nominee2Percentage", record["nominee2_ratio"])
            .input("Nominee3Name", record["nominee3"])
            .input("Nominee3FName", '')
            .input("Nominee3Relation", record["nominee3_relation"])
            .input("Nominee3Address1", record["nominee3_address1"])
            .input("Nominee3Address2", record["nominee3_address2"])
            .input("Nominee3Address3", record["nominee3_address3"])
            .input("Nominee3City", record["nominee3_city"])
            .input("Nominee3State", record["nominee3_state"])
            .input("Nominee3Pincode", record["nominee3_pincode"])
            .input("Nominee3PhoneOff", '')
            .input("Nominee3PhoneRes", record["nominee3_phone_residence"])
            .input("Nominee3Email", record["nominee3_email"])
            .input("Nominee3Percentage", record["nominee3_ratio"])
            .input("FirstHolderCkycNo", record["ckyc_no"])
            .input("SecondHolderCkycNo", record["jh1_ckyc"])
            .input("ThirdHolderCkycNo", record["jh2_ckyc"])
            .input("GuardianHolderCkycNo", record["guardian_ckyc_no"])
            .input("FirstHolderKyclFlag", record["kyc1flag"])
            .input("SecondHolderKyclFlag", record["kyc2flag"])
            .input("ThirdHolderKyclFlag", record["kyc3flag"])
            .input("GuardianHolderKyclFlag", record["kycgflag"])
            .input("SecondHolderDob", null)
            .input("ThirdHolderDob", null)
            .input("GuardianHolderDob", null)
            .input("KarvyTPin", record["tpin"])
            .input("KarvyFName", record["f_name"])
            .input("KarvyMName", record["m_name"])
            .input("KarvyLName", '')
            .input("KarvyInvestorId", record["investor_id"])
            .input("CamsInvIin", '')
            .input("CamsUniNo", '')
            .input("CamsRepDate", null)
            .input("CamsCloseBal", 0)
            .input("CamsRupeeBal", 0)
            .input("BrokerCode", record["broker_code"])
            .input("SubBrokerCode", '')
            .input("SubBrokerCode1", '')
            .input("CamsReinvFlag", '')
            .input("KarvyCommonAccNo", record["commonaccno"])
            .input("KarvyInvestorResiFaxiNo", record["investors_resi_faxno"])
            .input("CamsAmcCode", '')
            .input("CamsGstState", '')
            .input("KarvyCategory", record["category"])
            .input("KarvyCategoryDesc", record["categorydesc"])
            .input("KarvyStatusDesc", record["statusdesc"])
            .input("DpId", record["dpid"])
            .input("KarvyClientId", record["client_id"])
            .input("KarvyMapinId", record["mapin_id"])
            .input("KarvyDividendOption", record["dividend_option"])
            .input("KarvyOccupationDescription", record["occupation_description"])
            .input("CamsDemat", '')
            .input("CamsFolioDate", null)
            .input("CamsTpaLinked", '')
            .input("CamsFolioOld", '')
            .input("CamsSchemeFolio", '')
            .input("StampDuty", 0)
            .input("FolioLists", '')
            .input("Rta", 'KARVY_311')
            .input("RecordSession", recordSession)
            .input("IsVerifiedByAdmin", false)
            .input("SubBrokerTagged", false)
            .input("SubBrokerTemp", '')
            .input("UccTemp", '');

        const result = await request.execute("InsertUpdateKarvyFeedTransactionUccFolio");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while saving karvy feed transaction ucc folio record...');
    }
};

async function getFeedCamsTransactionUccFolioBySession(recordSession) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("RecordSession", recordSession);
    const readResult = await readRequest.execute("GetFeedTransactionUccFolioByRecordSession");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function getFeedCamsTransactionUccFolio() {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    const readResult = await readRequest.execute("GetFeedTransactionUccFolio");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function getClientKycProfileByPANCardNumber(panCardNumber) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("PANCardNumber", panCardNumber);
    const readResult = await readRequest.execute("GetClientKycProfileByPANCardNumber");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

function formatMobileNumber(mobileNumber) {
    return mobileNumber.slice(-10);
}

async function getFeedCamsTransactionUccFolioExisting(id, firstHolderPan, secondHolderPan, thirdHolderPan, guardianPan, karvyFName, nomineeFName, nominee2FName, nominee3FName) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("Id", id)
        .input("FirstHolderPan", firstHolderPan)
        .input("SecondHolderPan", secondHolderPan)
        .input("ThirdHolderPan", thirdHolderPan)
        .input("GuardianPan", guardianPan)
        .input("KarvyFName", karvyFName)
        .input("NomineeFName", nomineeFName)
        .input("Nominee2FName", nominee2FName)
        .input("Nominee3FName", nominee3FName);
    const readResult = await readRequest.execute("GetFeedTransactionUccFolioExisting");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function getFeedTransactionUccFolioSubBroker(panNumbers) {
    var data = '';

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("PanNumbers", panNumbers);
    const readResult = await readRequest.execute("GetFeedTransactionUccFolioSubBroker");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0].SubBrokerCode;
    }

    return data;
};

async function getClientKycProfileSubBroker(panNumbers) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("PanNumbers", panNumbers);
    const readResult = await readRequest.execute("GetClientKycProfileSubBroker");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function getClientAccounts(clientId) {
    var data = [];

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("ClientId", clientId);
    const readResult = await readRequest.execute("GetClientAccounts");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function getClientTransactionUnitLedgerUcc(folioNumber) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("FolioNumber", folioNumber);
    const readResult = await readRequest.execute("GetClientTransactionUnitLedgerUcc");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function getBSESchemeByChannelPartnerCode(code) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("ChannelPartnerCode", code);
    const readResult = await readRequest.execute("GetBSESchemeByChannelPartnerCode");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function updateCamsFeedTransactionUccFolio(record) {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("Id", record["Id"])
            .input("Ucc", record["Ucc"])
            .input("IsProfileOnKinntegra", record["IsProfileOnKinntegra"])
            .input("ShowInList", record["ShowInList"])
            .input("CaseCode", record["CaseCode"])
            .input("FolioNumber", record["FolioNumber"])
            .input("ProductCode", record["ProductCode"])
            .input("Fund", record["Fund"])
            .input("FundDescription", record["FundDescription"])
            .input("ProductFolio", record["ProductFolio"])
            .input("FirstHolderName", record["FirstHolderName"])
            .input("SecondHolderName", record["SecondHolderName"])
            .input("ThirdHolderName", record["ThirdHolderName"])
            .input("GuardianName", record["GuardianName"])
            .input("NameCount", record["NameCount"])
            .input("Address1", record["Address1"])
            .input("Address2", record["Address2"])
            .input("Address3", record["Address3"])
            .input("City", record["City"])
            .input("State", record["State"])
            .input("Country", record["Country"])
            .input("PinCode", record["PinCode"])
            .input("PhoneRes", record["PhoneRes"])
            .input("PhoneRes1", record["PhoneRes1"])
            .input("PhoneRes2", record["PhoneRes2"])
            .input("PhoneOff", record["PhoneOff"])
            .input("PhoneOff1", record["PhoneOff1"])
            .input("PhoneOff2", record["PhoneOff2"])
            .input("FirstHolderPan", record["FirstHolderPan"])
            .input("SecondHolderPan", record["SecondHolderPan"])
            .input("ThirdHolderPan", record["ThirdHolderPan"])
            .input("GuardianPan", record["GuardianPan"])
            .input("PanCount", record["PanCount"])
            .input("NamePanComparison", record["NamePanComparison"])
            .input("IsFirstHolderPanAvailable", record["IsFirstHolderPanAvailable"])
            .input("IsSecondHolderPanAvailable", record["IsSecondHolderPanAvailable"])
            .input("IsThirdHolderPanAvailable", record["IsThirdHolderPanAvailable"])
            .input("IsGuardianPanAvailable", record["IsGuardianPanAvailable"])
            .input("FirstHolderPanMismatched", record["FirstHolderPanMismatched"])
            .input("SecondHolderPanMismatched", record["SecondHolderPanMismatched"])
            .input("ThirdHolderPanMismatched", record["ThirdHolderPanMismatched"])
            .input("GuardianPanMismatched", record["GuardianPanMismatched"])
            .input("FirstHolderFamilyList", record["FirstHolderFamilyList"])
            .input("SecondHolderFamilyList", record["SecondHolderFamilyList"])
            .input("ThirdHolderFamilyList", record["ThirdHolderFamilyList"])
            .input("GuardianFamilyList", record["GuardianFamilyList"])
            .input("FirstHolderFamilyCount", record["FirstHolderFamilyCount"])
            .input("SecondHolderFamilyCount", record["SecondHolderFamilyCount"])
            .input("ThirdHolderFamilyCount", record["ThirdHolderFamilyCount"])
            .input("GuardianFamilyCount", record["GuardianFamilyCount"])
            .input("DateOfBirth", record["DateOfBirth"])
            .input("Mobile", record["Mobile"])
            .input("Email", record["Email"])
            .input("Occupation", record["Occupation"])
            .input("HoldingNature", record["HoldingNature"])
            .input("TaxStatus", record["TaxStatus"])
            .input("FirstHolderAadharNo", record["FirstHolderAadharNo"])
            .input("SecondHolderAadharNo", record["SecondHolderAadharNo"])
            .input("ThirdHolderAadharNo", record["ThirdHolderAadharNo"])
            .input("GuardianAadharNo", record["GuardianAadharNo"])
            .input("BankIFSCCode", record["BankIFSCCode"])
            .input("BankName", record["BankName"])
            .input("BankBranch", record["BankBranch"])
            .input("AccountType", record["AccountType"])
            .input("AccountNo", record["AccountNo"])
            .input("BankAddress1", record["BankAddress1"])
            .input("BankAddress2", record["BankAddress2"])
            .input("BankAddress3", record["BankAddress3"])
            .input("BankCity", record["BankCity"])
            .input("BankState", record["BankState"])
            .input("BankCountry", record["BankCountry"])
            .input("BankPincode", record["BankPincode"])
            .input("NomineeName", record["NomineeName"])
            .input("NomineeFName", record["NomineeFName"])
            .input("NomineeRelation", record["NomineeRelation"])
            .input("NomineeAddress1", record["NomineeAddress1"])
            .input("NomineeAddress2", record["NomineeAddress2"])
            .input("NomineeAddress3", record["NomineeAddress3"])
            .input("NomineeCity", record["NomineeCity"])
            .input("NomineeState", record["NomineeState"])
            .input("NomineePincode", record["NomineePincode"])
            .input("NomineePhoneOff", record["NomineePhoneOff"])
            .input("NomineePhoneRes", record["NomineePhoneRes"])
            .input("NomineeEmail", record["NomineeEmail"])
            .input("NomineePercentage", record["NomineePercentage"])
            .input("Nominee2Name", record["Nominee2Name"])
            .input("Nominee2FName", record["Nominee2FName"])
            .input("Nominee2Relation", record["Nominee2Relation"])
            .input("Nominee2Address1", record["Nominee2Address1"])
            .input("Nominee2Address2", record["Nominee2Address2"])
            .input("Nominee2Address3", record["Nominee2Address3"])
            .input("Nominee2City", record["Nominee2City"])
            .input("Nominee2State", record["Nominee2State"])
            .input("Nominee2Pincode", record["Nominee2Pincode"])
            .input("Nominee2PhoneOff", record["Nominee2PhoneOff"])
            .input("Nominee2PhoneRes", record["Nominee2PhoneRes"])
            .input("Nominee2Email", record["Nominee2Email"])
            .input("Nominee2Percentage", record["Nominee2Percentage"])
            .input("Nominee3Name", record["Nominee3Name"])
            .input("Nominee3FName", record["Nominee3FName"])
            .input("Nominee3Relation", record["Nominee3Relation"])
            .input("Nominee3Address1", record["Nominee3Address1"])
            .input("Nominee3Address2", record["Nominee3Address2"])
            .input("Nominee3Address3", record["Nominee3Address3"])
            .input("Nominee3City", record["Nominee3City"])
            .input("Nominee3State", record["Nominee3State"])
            .input("Nominee3Pincode", record["Nominee3Pincode"])
            .input("Nominee3PhoneOff", record["Nominee3PhoneOff"])
            .input("Nominee3PhoneRes", record["Nominee3PhoneRes"])
            .input("Nominee3Email", record["Nominee3Email"])
            .input("Nominee3Percentage", record["Nominee3Percentage"])
            .input("FirstHolderCkycNo", record["FirstHolderCkycNo"])
            .input("SecondHolderCkycNo", record["SecondHolderCkycNo"])
            .input("ThirdHolderCkycNo", record["ThirdHolderCkycNo"])
            .input("GuardianHolderCkycNo", record["GuardianHolderCkycNo"])
            .input("FirstHolderKyclFlag", record["FirstHolderKyclFlag"])
            .input("SecondHolderKyclFlag", record["SecondHolderKyclFlag"])
            .input("ThirdHolderKyclFlag", record["ThirdHolderKyclFlag"])
            .input("GuardianHolderKyclFlag", record["GuardianHolderKyclFlag"])
            .input("SecondHolderDob", record["SecondHolderDob"])
            .input("ThirdHolderDob", record["ThirdHolderDob"])
            .input("GuardianHolderDob", record["GuardianHolderDob"])
            .input("KarvyTPin", record["KarvyTPin"])
            .input("KarvyFName", record["KarvyFName"])
            .input("KarvyMName", record["KarvyMName"])
            .input("KarvyLName", record["KarvyLName"])
            .input("KarvyInvestorId", record["KarvyInvestorId"])
            .input("CamsInvIin", record["CamsInvIin"])
            .input("CamsUniNo", record["CamsUniNo"])
            .input("CamsRepDate", record["CamsRepDate"])
            .input("CamsCloseBal", record["CamsCloseBal"])
            .input("CamsRupeeBal", record["CamsRupeeBal"])
            .input("BrokerCode", record["BrokerCode"])
            .input("SubBrokerCode", record["SubBrokerCode"])
            .input("SubBrokerCode1", record["SubBrokerCode1"])
            .input("CamsReinvFlag", record["CamsReinvFlag"])
            .input("KarvyCommonAccNo", record["KarvyCommonAccNo"])
            .input("KarvyInvestorResiFaxiNo", record["KarvyInvestorResiFaxiNo"])
            .input("CamsAmcCode", record["CamsAmcCode"])
            .input("CamsGstState", record["CamsGstState"])
            .input("KarvyCategory", record["KarvyCategory"])
            .input("KarvyCategoryDesc", record["KarvyCategoryDesc"])
            .input("KarvyStatusDesc", record["KarvyStatusDesc"])
            .input("DpId", record["DpId"])
            .input("KarvyClientId", record["KarvyClientId"])
            .input("KarvyMapinId", record["KarvyMapinId"])
            .input("KarvyDividendOption", record["KarvyDividendOption"])
            .input("KarvyOccupationDescription", record["KarvyOccupationDescription"])
            .input("CamsDemat", record["CamsDemat"])
            .input("CamsFolioDate", record["CamsFolioDate"])
            .input("CamsTpaLinked", record["CamsTpaLinked"])
            .input("CamsFolioOld", record["CamsFolioOld"])
            .input("CamsSchemeFolio", record["CamsSchemeFolio"])
            .input("StampDuty", record["StampDuty"])
            .input("FolioLists", record["FolioLists"])
            .input("Rta", record["Rta"])
            .input("RecordSession", record["RecordSession"])
            .input("IsVerifiedByAdmin", record["IsVerifiedByAdmin"])
            .input("SubBrokerTagged", record["SubBrokerTagged"])
            .input("SubBrokerTemp", record["SubBrokerTemp"])
            .input("UccTemp", record["UccTemp"]);

        const result = await request.execute("UpdateCamsFeedTransactionUccFolio");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while updating cams feed transaction ucc folio record...');
    }
};

async function saveFeedTransactionPan(subBrokerCode, pan, name, recordType, isDuplicate, firstName, lastName, taxStatus, pinCode, recordSession) {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("SubBrokerCode", subBrokerCode)
            .input("Pan", pan)
            .input("Name", name)
            .input("RecordType", recordType)
            .input("IsDuplicate", isDuplicate)
            .input("FirstName", firstName)
            .input("LastName", lastName)
            .input("TaxStatus", taxStatus)
            .input("PinCode", pinCode)
            .input("RecordSession", recordSession);

        const result = await request.execute("InsertFeedTransactionPan");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while updating feed transaction pan record...');
    }
};

async function getFeedTransactionPanByRecordSession(recordSession) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("RecordSession", recordSession);
    const readResult = await readRequest.execute("GetFeedTransactionPanByRecordSession");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function updateFeedTransactionPanDuplicate(id, isDuplicate, recordSession) {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("Id", id)
            .input("IsDuplicate", isDuplicate)
            .input("RecordSession", recordSession);

        const result = await request.execute("UpdateFeedTransactionPanDuplicate");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while updating feed transaction pan record...');
    }
};

async function getFeedTransactionPanByRecordType(recordType) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("RecordType", recordType);
    const readResult = await readRequest.execute("GetFeedTransactionPanByRecordType");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function getFeedTransactionPanUniquePan(recordType, recordSession) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("RecordType", recordType)
        .input("RecordSession", recordSession);
    const readResult = await readRequest.execute("GetFeedTransactionPanUniquePan");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function getFeedTransactionPanUniquePanByCaseCode(recordType, recordSession, caseCode) {
    var data = [];

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("RecordType", recordType)
        .input("RecordSession", recordSession)
        .input("IsDuplicate", caseCode);
    const readResult = await readRequest.execute("GetFeedTransactionPanUniquePanByCaseCode");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function getFeedTransactionPanUniquePanByCaseCodeCount(recordType, recordSession, caseCode) {
    var data = [];

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("RecordType", recordType)
        .input("RecordSession", recordSession)
        .input("IsDuplicate", caseCode);
    const readResult = await readRequest.execute("GetFeedTransactionPanUniquePanByCaseCodeCount");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function getFeedTransactionPanUniquePanByCaseCodePan(recordType, recordSession, caseCode, id, pan) {
    var data = [];

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("RecordType", recordType)
        .input("RecordSession", recordSession)
        .input("IsDuplicate", caseCode)
        .input("Pan", pan)
        .input("Id", id);
    const readResult = await readRequest.execute("GetFeedTransactionPanUniquePanByCaseCodePan");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function calculateSimilarity(pan1, pan2) {
    pan1 = pan1.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    pan2 = pan2.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    const distance = CommonFunction.Levenshtein(pan1, pan2);

    let similarity;
    if (distance > 0) {
        similarity = 100 - (distance / Math.max(pan1.length, pan2.length)) * 100;
    } else {
        similarity = 0;
    }

    return similarity;
};

async function saveFeedTransactionName(subBrokerCode, pan, name, recordType, isDuplicate, firstName, lastName, taxStatus, pinCode, recordSession) {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("SubBrokerCode", subBrokerCode)
            .input("Pan", pan)
            .input("Name", name)
            .input("RecordType", recordType)
            .input("IsDuplicate", isDuplicate)
            .input("FirstName", firstName)
            .input("LastName", lastName)
            .input("TaxStatus", taxStatus)
            .input("PinCode", pinCode)
            .input("RecordSession", recordSession);

        const result = await request.execute("InsertFeedTransactionName");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while updating feed transaction pan record...');
    }
};

async function updateFeedTransactionPanRecord(record) {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("Id", record["Id"])
            .input("SubBrokerCode", record["SubBrokerCode"])
            .input("Pan", record["Pan"])
            .input("Name", record["Name"])
            .input("RecordType", record["RecordType"])
            .input("IsDuplicate", record["IsDuplicate"])
            .input("FirstName", record["FirstName"])
            .input("LastName", record["LastName"])
            .input("TaxStatus", record["TaxStatus"])
            .input("PinCode", record["PinCode"])
            .input("RecordSession", record["RecordSession"]);

        const result = await request.execute("UpdateFeedTransactionPan");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while updating feed transaction pan record...');
    }
};

async function updateFeedTransactionUccFolioListCode(id, showInList, caseCode) {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("Id", id)
            .input("ShowInList", showInList)
            .input("CaseCode", caseCode);

        const result = await request.execute("UpdateFeedTransactionUccFolioListCode");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while updating feed transaction record...');
    }
};

async function getAmfiCodes() {
    var data = [];

    let pool = await appPool.connect();

    const readRequest = pool.request();
    const readResult = await readRequest.execute("GetBSESchemeAmfiNAV");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function saveAmfiNav(navDate, schemeCode, schemeName, rtaSchemeCode, divReInvestFlag, isin, nav, rtaCode) {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("NAVDate", navDate.toFormat('yyyy-MM-dd'))
            .input("SchemeCode", schemeCode)
            .input("SchemeName", schemeName)
            .input("RTASchemeCode", rtaSchemeCode)
            .input("DivReInvestFlag", divReInvestFlag)
            .input("ISIN", isin)
            .input("NAV", nav)
            .input("RTACode", rtaCode);

        const result = await request.execute("InsertNetAssetValue");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while amfi nav record...');
    }
};

async function updateFeedUcc() {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        const result = await request.execute("UpdateFeedUcc");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while updating feed transaction ucc record...');
    }
};

async function updateFeedDailyHoldingUcc() {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        const result = await request.execute("UpdateFeedDailyHoldingUcc");

        await transaction.commit();
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while updating feed transaction ucc record...');
    }
};

async function readkarvy307Email(recordDate, recordSession) {
    var link = '';

    const client = new imapFlow.ImapFlow({
        host: process.env.IMAP_HOST,
        port: 993,
        secure: true,
        auth: {
            user: process.env.IMAP_USER,
            pass: process.env.IMAP_PASSWORD
        }
    });

    await client.connect();

    let lock = await client.getMailboxLock('INBOX');

    try {
        // let message = await client.fetchOne(client.mailbox.exists, { source: true });
        // console.log(message.source.toString());

        let messageList = await client.search({
            seen: false, or: [
                { subject: 'Subscribed Transaction Feeds Report for Ref. No. : WBTRN4089755' }
            ]
        }, { uid: false });

        if (messageList.length > 0) {
            // console.log(messageList[0].toString());
            let message = await client.fetchOne(messageList[0].toString(), { uid: false, source: true });
            // console.log(message.source.toString());
            const pdfFilePath = path.join(__dirname.replace("app", "public"), '..', 'documents', CommonFunction.GetUniqueId() + '.txt');
            fileSystem.writeFileSync(pdfFilePath, message.source.toString().trim().replaceAll('=\r\n', ''));

            var downloadUrlBreak = message.source.toString('utf8').trim().replaceAll('=\r\n', '').split('mfs.kfintech.com</a>.');
            if (downloadUrlBreak.length > 0) {
                // console.log(downloadUrlBreak[1]);
                var anchorBreak = downloadUrlBreak[1].split('href=3D"');

                if (anchorBreak.length > 0) {
                    // console.log(anchorBreak[1].trim());

                    var anchorBreakEnd = anchorBreak[1].trim().split('" target');

                    if (anchorBreakEnd.length > 0) {
                        link = anchorBreakEnd[0].trim().replaceAll('3D', '');
                        // console.log(link);
                    }
                }
            }

            if (link != '') {
                var messages = [];
                messages.push(messageList[0]);

                await client.messageFlagsAdd(messages, ['\\Seen'], { uid: false });
            }
        }
    }
    catch (err) {
        console.log(err);
    }
    finally {
        lock.release();
    }

    await client.logout();

    return { Status: (link != ''), Link: link };
};

async function readKarvy307File(fileName, link, recordDate, recordSession) {
    var filePath = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'karvy', fileName);
    var mfsdFolder = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'karvy', 'mfsd307');
    var recordCount = 0;

    // console.log('link: '+link);

    var downloadFileResult = await downloadKarvy307File(link, filePath);

    if (downloadFileResult.Status == true) {
        var extractFileResult = await extractKarvy307ZipFile(filePath, mfsdFolder);

        if (extractFileResult.DataFileName != '' && extractFileResult.DataFileName.includes('.dbf')) {
            var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'karvy', 'mfsd307', extractFileResult.DataFileName);

            var data = await readDataFile(dataFilePath);

            recordCount = data.length;

            for (let i = 0; i < recordCount; i++) {
                var row = data[i];

                // console.log(row);
                // break;

                var td_trdt = null;
                var td_prdt = null;
                var crdate = null;
                var navdate = null;
                var portdt = null;
                var chqdate = null;
                var brok_entdt = null;
                var sipregdt = null;

                if (row['TD_TRDT'] != null && row['TD_TRDT'] != undefined) {
                    td_trdt = date.format(row['TD_TRDT'], 'YYYY-MM-DD');
                }
                if (row['TD_PRDT'] != null && row['TD_PRDT'] != undefined) {
                    td_prdt = date.format(row['TD_PRDT'], 'YYYY-MM-DD');
                }
                if (row['CRDATE'] != null && row['CRDATE'] != undefined) {
                    crdate = date.format(row['CRDATE'], 'YYYY-MM-DD');
                }

                if (row['NAVDATE'] != null && row['NAVDATE'] != undefined) {
                    navdate = date.format(row['NAVDATE'], 'YYYY-MM-DD');
                }
                if (row['PORTDT'] != null && row['PORTDT'] != undefined) {
                    portdt = date.format(row['PORTDT'], 'YYYY-MM-DD');
                }
                if (row['CHQDATE'] != null && row['CHQDATE'] != undefined) {
                    chqdate = date.format(row['CHQDATE'], 'YYYY-MM-DD');
                }
                if (row['BROK_ENTDT'] != null && row['BROK_ENTDT'] != undefined) {
                    brok_entdt = date.format(row['BROK_ENTDT'], 'YYYY-MM-DD');
                }
                if (row['SIPREGDT'] != null && row['SIPREGDT'] != undefined) {
                    sipregdt = date.format(row['SIPREGDT'], 'YYYY-MM-DD');
                }

                var dataItem = {
                    recno: row['RECNO'] || 0,
                    fmcode: row['FMCODE'] || '',
                    td_fund: row['TD_FUND'] || '',
                    td_scheme: row['TD_SCHEME'] || '',
                    td_plan: row['TD_PLAN'] || '',
                    td_acno: row['TD_ACNO'] || '',
                    schpln: row['SCHPLN'] || '',
                    divopt: row['DIVOPT'] || '',
                    funddesc: row['FUNDDESC'] || '',
                    td_purred: row['TD_PURRED'] || '',
                    td_trno: row['TD_TRNO'] || '',
                    smcode: row['SMCODE'] || '',
                    chqno: row['CHQNO'] || '',
                    invname: row['INVNAME'] || '',
                    trnmode: row['TRNMODE'] || '',
                    trnstat: row['TRNSTAT'] || '',
                    td_branch: row['TD_BRANCH'] || '',
                    isctrno: row['ISCTRNO'] || '',
                    td_trdt: td_trdt,
                    td_prdt: td_prdt,
                    td_units: row['TD_UNITS'] || 0,
                    td_amt: row['TD_AMT'] || 0,
                    td_agent: row['TD_AGENT'] || '',
                    td_broker: row['TD_BROKER'] || '',
                    brokper: row['BROKPER'] || '',
                    brokcomm: row['BROKCOMM'] || '',
                    invid: row['INVID'] || '',
                    crdate: crdate,
                    crtime: row['CRTIME'] || '',
                    trnsub: row['TRNSUB'] || '',
                    td_appno: row['TD_APPNO'] || '',
                    unqno: row['UNQNO'] || '',
                    trdesc: row['TRDESC'] || '',
                    td_trtype: row['TD_TRTYPE'] || '',
                    navdate: navdate,
                    portdt: portdt,
                    assettype: row['ASSETTYPE'] || '',
                    subtrtype: row['SUBTRTYPE'] || '',
                    citycateg0: row['CITYCATEG0'] || '',
                    euin: row['EUIN'] || '',
                    trcharges: row['TRCHARGES'] || '',
                    clientid: row['CLIENTID'] || '',
                    dpid: row['DPID'] || '',
                    stt: row['STT'] || '',
                    ihno: row['ihno'] || '',
                    branchcode: row['BRANCHCODE'] || '',
                    inwardnum1: row['INWARDNUM1'] || '',
                    pan1: row['PAN1'] || '',
                    pan2: row['PAN2'] || '',
                    pan3: row['PAN3'] || '',
                    tdsamount: row['TDSAMOUNT'] || 0,
                    chqdate: chqdate,
                    chqbank: row['CHQBANK'] || '',
                    trflag: row['TRFLAG'] || '',
                    load1: row['LOAD1'] || 0,
                    brok_entdt: brok_entdt,
                    nctremarks: row['NCTREMARKS'] || '',
                    prcode1: row['PRCODE1'] || '',
                    status: row['STATUS'] || '',
                    schemeisin: row['SCHEMEISIN'] || '',
                    td_nav: row['TD_NAV'] || 0,
                    insamount: row['INSAMOUNT'] || 0,
                    rejtrnoor2: row['REJTRNOOR2'] || 0,
                    evalid: row['EVALID'] || '',
                    edeclflag: row['EDECLFLAG'] || '',
                    subarncode: row['SUBARNCODE'] || '',
                    atmcardre3: row['ATMCARDRE3'] || '',
                    atmcardst4: row['ATMCARDST4'] || '',
                    sch1: row['SCH1'] || '',
                    pln1: row['PLN1'] || '',
                    td_trxnmo5: row['TD_TRXNMO5'] || '',
                    newunqno: row['NEWUNQNO'] || '',
                    sipregdt: sipregdt,
                    divper: row['DIVPER'] || 0,
                    td_pop: row['TD_POP'] || 0,
                    electrxnf6: row['ELECTRXNF6'] || '',
                    stampduty: row['STAMPDUTY'] || 0,
                    RecordDate: recordDate,
                    RecordSession: recordSession
                };

                await saveKarvy307Record(dataItem);

                var recordItem = {
                    FolioNumber: (dataItem["td_acno"] == null) ? '' : dataItem["td_acno"],
                    ProductCode: (dataItem["fmcode"] == null) ? '' : dataItem["fmcode"],
                    TradeDate: (dataItem["td_trdt"] == null) ? '' : dataItem["td_trdt"],
                    TransactionNumber: (dataItem["inwardnum1"] == null) ? '' : dataItem["inwardnum1"],
                    TransactionType: (dataItem["trflag"] == 'TO') ? 'TO' : ((dataItem["trdesc"] == null) ? '' : dataItem["trdesc"]),
                    AMCTransactionNumber: (dataItem["td_trno"] == null) ? '' : 'KARVY-' + dataItem["td_trno"],
                    Units: (dataItem["td_units"] == null) ? '' : dataItem["td_units"],
                    NAV: (dataItem["td_nav"] == null) ? '' : dataItem["td_nav"],
                    Amount: (dataItem["td_amt"] == null) ? '' : dataItem["td_amt"],
                    UniqueRefNo: 'K-' + ((dataItem["unqno"] == null) ? '' : dataItem["unqno"].toString().trim()) + '-' + ((dataItem["trflag"] == null) ? '' : dataItem["trflag"].toString().trim())
                };

                await saveFeedTransaction(recordItem);
            }
        }
        else if (extractFileResult.DataFileName != '' && extractFileResult.DataFileName.includes('.csv')) {
            var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'karvy', 'mfsd307', extractFileResult.DataFileName);

            const workBook = xlsx.readFile(dataFilePath);
            const workSheet = workBook.Sheets[workBook.SheetNames[0]];
            const jsonData = xlsx.utils.sheet_to_json(workSheet);

            recordCount = jsonData.length;

            let i = 0;
            for (const row of jsonData) {
                i += 1;

                var td_trdt = null;
                var td_prdt = null;
                var crdate = null;
                var navdate = null;
                var portdt = null;
                var chqdate = null;
                var brok_entdt = null;
                var sipregdt = null;

                if (row['Transaction Date'] != null && row['Transaction Date'] != undefined) {
                    if (row['Transaction Date'].toString().includes('/')) {
                        td_trdt = CommonFunction.ConvertDateDMYToYMD(row['Transaction Date'], '/');
                    }
                    else {
                        td_trdt = date.format(CommonFunction.ExcelDateToJSDate(row['Transaction Date']), 'YYYY-MM-DD');
                    }
                }
                if (row['Process Date'] != null && row['Process Date'] != undefined) {
                    if (row['Process Date'].toString().includes('/')) {
                        td_prdt = CommonFunction.ConvertDateDMYToYMD(row['Process Date'], '/');
                    }
                    else {
                        td_prdt = date.format(CommonFunction.ExcelDateToJSDate(row['Process Date']), 'YYYY-MM-DD');
                    }
                }
                if (row['Report Date'] != null && row['Report Date'] != undefined) {
                    if (row['Report Date'].toString().includes('/')) {
                        crdate = CommonFunction.ConvertDateDMYToYMD(row['Report Date'], '/');
                    }
                    else {
                        crdate = date.format(CommonFunction.ExcelDateToJSDate(row['Report Date']), 'YYYY-MM-DD');
                    }
                }
                if (row['Nav Date'] != null && row['Nav Date'] != undefined) {
                    if (row['Nav Date'].toString().includes('/')) {
                        navdate = CommonFunction.ConvertDateDMYToYMD(row['Nav Date'], '/');
                    }
                    else {
                        navdate = date.format(CommonFunction.ExcelDateToJSDate(row['Nav Date']), 'YYYY-MM-DD');
                    }
                }
                if (row['PortDate'] != null && row['PortDate'] != undefined) {
                    if (row['PortDate'].toString().includes('/')) {
                        portdt = CommonFunction.ConvertDateDMYToYMD(row['PortDate'], '/');
                    }
                    else {
                        portdt = date.format(CommonFunction.ExcelDateToJSDate(row['PortDate']), 'YYYY-MM-DD');
                    }
                }
                if (row['Instrument Date'] != null && row['Instrument Date'] != undefined) {
                    if (row['Instrument Date'].toString().includes('/')) {
                        chqdate = CommonFunction.ConvertDateDMYToYMD(row['Instrument Date'], '/');
                    }
                    else {
                        chqdate = date.format(CommonFunction.ExcelDateToJSDate(row['Instrument Date']), 'YYYY-MM-DD');
                    }
                }
                if (row['NCT Change Date'] != null && row['NCT Change Date'] != undefined) {
                    if (row['NCT Change Date'].toString().includes('/')) {
                        brok_entdt = CommonFunction.ConvertDateDMYToYMD(row['NCT Change Date'], '/');
                    }
                    else {
                        brok_entdt = date.format(CommonFunction.ExcelDateToJSDate(row['NCT Change Date']), 'YYYY-MM-DD');
                    }
                }
                if (row['SIP Regn Date'] != null && row['SIP Regn Date'] != undefined) {
                    if (row['SIP Regn Date'].toString().includes('/')) {
                        sipregdt = CommonFunction.ConvertDateDMYToYMD(row['SIP Regn Date'], '/');
                    }
                    else {
                        sipregdt = date.format(CommonFunction.ExcelDateToJSDate(row['SIP Regn Date']), 'YYYY-MM-DD');
                    }
                }

                var dataItem = {
                    recno: row['RECNO'] || 0,
                    fmcode: row['Product Code'] || '',
                    td_fund: row['Fund'] || '',
                    td_scheme: row['Scheme'] || '',
                    td_plan: row['Plan'] || '',
                    td_acno: row['Folio Number'] || '',
                    schpln: row['Scheme Code'] || '',
                    divopt: row['Dividend Option'] || '',
                    funddesc: row['Fund Description'] || '',
                    td_purred: row['Transaction Head'] || '',
                    td_trno: row['Transaction Number'] || '',
                    smcode: row['Switch_Ref. No.'] || '',
                    chqno: row['Instrument Number'] || '',
                    invname: row['Investor Name'] || '',
                    trnmode: row['Transaction Mode'] || '',
                    trnstat: row['Transaction Status'] || '',
                    td_branch: row['Branch Name'] || '',
                    isctrno: row['Branch Transaction No'] || '',
                    td_trdt: td_trdt,
                    td_prdt: td_prdt,
                    td_units: row['Units'] || 0,
                    td_amt: row['Amount'] || 0,
                    td_agent: row['Agent Code'] || '',
                    td_broker: row['Sub-Broker Code'] || '',
                    brokper: row['Brokerage Percentage'] || '',
                    brokcomm: row['Commission'] || '',
                    invid: row['Investor ID'] || '',
                    crdate: crdate,
                    crtime: row['Report Time'] || '',
                    trnsub: row['Transaction Sub'] || '',
                    td_appno: row['Application Number'].toString() || '',
                    unqno: row['Transaction ID'] || '',
                    trdesc: row['Transaction Description'] || '',
                    td_trtype: row['Transaction Type'] || '',
                    navdate: navdate,
                    portdt: portdt,
                    assettype: row['AssetType'] || '',
                    subtrtype: row['SubTranType'] || '',
                    citycateg0: row['CityCategory'] || '',
                    euin: row['EUIN'] || '',
                    trcharges: row['TrCharges'] || '',
                    clientid: row['ClientId'] || '',
                    dpid: row['DpId'] || '',
                    stt: row['STT'] || '',
                    ihno: row['Ihno'] || '',
                    branchcode: row['Branch Code'] || '',
                    inwardnum1: row['Inward Number'] || '',
                    pan1: row['PAN1'] || '',
                    pan2: row['PAN2'] || '',
                    pan3: row['PAN3'] || '',
                    tdsamount: row['TDSAmount'] || 0,
                    chqdate: chqdate,
                    chqbank: row['Instrument Bank'] || '',
                    trflag: row['Transaction Flag'] || '',
                    load1: row['Load Amount'] || 0,
                    brok_entdt: brok_entdt,
                    nctremarks: row['Remarks'] || '',
                    prcode1: row['ToProductCode'] || '',
                    status: row['Status'] || '',
                    schemeisin: row['ISIN'] || '',
                    td_nav: row['Nav'] || 0,
                    insamount: row['InsAmount'] || 0,
                    rejtrnoor2: row['RejTrnoOrgNo'] || 0,
                    evalid: row['EUIN Valid Indicator'] || '',
                    edeclflag: row['EUIN Declaration Indicator'] || '',
                    subarncode: row['Sub Broker ARN Code'] || '',
                    atmcardre3: row['ATMCardRemarks'] || '',
                    atmcardst4: row['ATMCardStatus'] || '',
                    sch1: row['Sch1'] || '',
                    pln1: row['Pln1'] || '',
                    td_trxnmo5: row['td_trxnmode'] || '',
                    newunqno: row['NewUnqno'] || '',
                    sipregdt: sipregdt,
                    divper: row['DivPer'] || 0,
                    td_pop: row['Price'] || 0,
                    electrxnf6: row['Electronic transaction Flag'] || '',
                    stampduty: row['Stamp Duty Charges'] || 0,
                    RecordDate: recordDate,
                    RecordSession: recordSession
                };

                console.log(i.toString() + '/' + recordCount + ' | ' + dataItem['unqno']);

                await saveKarvy307Record(dataItem);

                var recordItem = {
                    FolioNumber: (dataItem["td_acno"] == null) ? '' : dataItem["td_acno"],
                    ProductCode: (dataItem["fmcode"] == null) ? '' : dataItem["fmcode"],
                    TradeDate: (dataItem["td_trdt"] == null) ? '' : dataItem["td_trdt"],
                    TransactionNumber: (dataItem["inwardnum1"] == null) ? '' : dataItem["inwardnum1"],
                    TransactionType: (dataItem["trflag"] == 'TO') ? 'TO' : ((dataItem["trdesc"] == null) ? '' : dataItem["trdesc"]),
                    AMCTransactionNumber: (dataItem["td_trno"] == null) ? '' : 'KARVY-' + dataItem["td_trno"],
                    Units: (dataItem["td_units"] == null) ? '' : dataItem["td_units"],
                    NAV: (dataItem["td_nav"] == null) ? '' : dataItem["td_nav"],
                    Amount: (dataItem["td_amt"] == null) ? '' : dataItem["td_amt"],
                    UniqueRefNo: 'K-' + ((dataItem["unqno"] == null) ? '' : dataItem["unqno"].toString().trim()) + '-' + ((dataItem["trflag"] == null) ? '' : dataItem["trflag"].toString().trim())
                };

                await saveFeedTransaction(recordItem);
            }
        }
    }

    return { Status: (recordCount != 0), RecordCount: recordCount };
};

async function downloadKarvy307File(link, filePath) {
    // console.log(link);
    return new Promise((resolve, reject) => {
        var file = fileSystem.createWriteStream(filePath);
        var request = https.get(link, function (response) {
            if (response.statusCode == 302) {
                let downloadLink = response.headers.location;
                // console.log(downloadLink);
                var request1 = https.get(downloadLink, function (res) {
                    // console.log(res.statusCode);
                    // console.log(res.headers);
                    let downloadLink1 = res.headers.location;
                    var request2 = https.get(downloadLink1, function (res1) {
                        // console.log(res1.statusCode);
                        // console.log(res1.headers);
                        res1.pipe(file);

                        file.on('finish', async function () {
                            file.close();

                            resolve({ Status: true, Message: 'File is created at ' + filePath });
                        });
                    }).on('error', function (err) {
                        fileSystem.unlink(filePath, (err) => { });
                        reject(err.message);
                    });

                }).on('error', function (err) {
                    fileSystem.unlink(filePath, (err) => { });
                    reject(err.message);
                });
            }
            // console.log(response.headers);
        }).on('error', function (err) {
            fileSystem.unlink(filePath, (err) => { });
            reject(err.message);
        });
    });
};

async function extractKarvy307ZipFile(filePath, mfsdFolder) {
    return new Promise((resolve, reject) => {
        var dbfFileName = '';

        const zipStream = zip.extractFull(filePath, mfsdFolder, {
            password: 'Laksh@0802',
            $bin: zipLib.path7za
        });
        // const zipStream = zip.extractFull(filePath, mfsdFolder, {
        //     password: 'Punit@0516',
        //     $bin: zipLib.path7za
        // });

        zipStream.on('data', function (data) {
            if (data.status == 'extracted') {
                dbfFileName = data.file;
            }
        });

        zipStream.on('end', () => {
            // Do stuff with unzipped content
            resolve({ Status: true, Message: 'File is extracted at ' + mfsdFolder, DataFileName: dbfFileName });
        });

        zipStream.on('error', (err) => {
            reject(err);
        });
    });
};

async function saveKarvy307Record(record) {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("recno", (record["recno"] == null) ? 0 : record["recno"])
            .input("fmcode", (record["fmcode"] == null) ? '' : record["fmcode"])
            .input("td_fund", (record["td_fund"] == null) ? '' : record["td_fund"])
            .input("td_scheme", (record["td_scheme"] == null) ? '' : record["td_scheme"])
            .input("td_plan", (record["td_plan"] == null) ? '' : record["td_plan"])
            .input("td_acno", (record["td_acno"] == null) ? '' : record["td_acno"])
            .input("schpln", (record["schpln"] == null) ? '' : record["schpln"])
            .input("divopt", (record["divopt"] == null) ? '' : record["divopt"])
            .input("funddesc", (record["funddesc"] == null) ? '' : record["funddesc"])
            .input("td_purred", (record["td_purred"] == null) ? '' : record["td_purred"])
            .input("td_trno", (record["td_trno"] == null) ? '' : record["td_trno"])
            .input("smcode", (record["smcode"] == null) ? '' : record["smcode"])
            .input("chqno", (record["chqno"] == null) ? '' : record["chqno"])
            .input("invname", (record["invname"] == null) ? '' : record["invname"])
            .input("trnmode", (record["trnmode"] == null) ? '' : record["trnmode"])
            .input("trnstat", (record["trnstat"] == null) ? '' : record["trnstat"])
            .input("td_branch", (record["td_branch"] == null) ? '' : record["td_branch"])
            .input("isctrno", (record["isctrno"] == null) ? '' : record["isctrno"])
            .input("td_trdt", record["td_trdt"])
            .input("td_prdt", (record["td_prdt"] == null) ? record["td_trdt"] : record["td_prdt"])
            .input("td_units", (record["td_units"] == null) ? 0 : record["td_units"])
            .input("td_amt", (record["td_amt"] == null) ? 0 : record["td_amt"])
            .input("td_agent", (record["td_agent"] == null) ? '' : record["td_agent"])
            .input("td_broker", (record["td_broker"] == null) ? '' : record["td_broker"])
            .input("brokper", (record["brokper"] == null) ? '' : record["brokper"])
            .input("brokcomm", (record["brokcomm"] == null) ? '' : record["brokcomm"])
            .input("invid", (record["invid"] == null) ? '' : record["invid"])
            .input("crdate", record["crdate"])
            .input("crtime", (record["crtime"] == null) ? '' : record["crtime"])
            .input("trnsub", (record["trnsub"] == null) ? '' : record["trnsub"])
            .input("td_appno", (record["td_appno"] == null) ? '' : record["td_appno"])
            .input("unqno", (record["unqno"] == null) ? '' : record["unqno"])
            .input("trdesc", (record["trdesc"] == null) ? '' : record["trdesc"])
            .input("td_trtype", (record["td_trtype"] == null) ? '' : record["td_trtype"])
            .input("navdate", record["navdate"])
            .input("portdt", record["portdt"])
            .input("assettype", (record["assettype"] == null) ? '' : record["assettype"])
            .input("subtrtype", (record["subtrtype"] == null) ? '' : record["subtrtype"])
            .input("citycateg0", (record["citycateg0"] == null) ? '' : record["citycateg0"])
            .input("euin", (record["euin"] == null) ? '' : record["euin"])
            .input("trcharges", (record["trcharges"] == null) ? '' : record["trcharges"])
            .input("clientid", (record["clientid"] == null) ? '' : record["clientid"])
            .input("dpid", (record["dpid"] == null) ? '' : record["dpid"])
            .input("stt", (record["stt"] == null) ? '' : record["stt"])
            .input("ihno", (record["ihno"] == null) ? '' : record["ihno"])
            .input("branchcode", (record["branchcode"] == null) ? '' : record["branchcode"])
            .input("inwardnum1", (record["inwardnum1"] == null) ? '' : record["inwardnum1"])
            .input("pan1", (record["pan1"] == null) ? '' : record["pan1"])
            .input("pan2", (record["pan2"] == null) ? '' : record["pan2"])
            .input("pan3", (record["pan3"] == null) ? '' : record["pan3"])
            .input("tdsamount", (record["tdsamount"] == null) ? 0 : record["tdsamount"])
            .input("chqdate", record["chqdate"])
            .input("chqbank", (record["chqbank"] == null) ? '' : record["chqbank"])
            .input("trflag", (record["trflag"] == null) ? '' : record["trflag"])
            .input("load1", (record["load1"] == null) ? 0 : record["load1"])
            .input("brok_entdt", record["brok_entdt"])
            .input("nctremarks", (record["nctremarks"] == null) ? '' : record["nctremarks"])
            .input("prcode1", (record["prcode1"] == null) ? '' : record["prcode1"])
            .input("status", (record["status"] == null) ? '' : record["status"])
            .input("schemeisin", (record["schemeisin"] == null) ? '' : record["schemeisin"])
            .input("td_nav", (record["td_nav"] == null) ? '' : record["td_nav"])
            .input("insamount", (record["insamount"] == null) ? 0 : record["insamount"])
            .input("rejtrnoor2", (record["rejtrnoor2"] == null) ? 0 : record["rejtrnoor2"])
            .input("evalid", (record["evalid"] == null) ? '' : record["evalid"])
            .input("edeclflag", (record["edeclflag"] == null) ? '' : record["edeclflag"])
            .input("subarncode", (record["subarncode"] == null) ? '' : record["subarncode"])
            .input("atmcardre3", (record["atmcardre3"] == null) ? '' : record["atmcardre3"])
            .input("atmcardst4", (record["atmcardst4"] == null) ? '' : record["atmcardst4"])
            .input("sch1", (record["sch1"] == null) ? '' : record["sch1"])
            .input("pln1", (record["pln1"] == null) ? '' : record["pln1"])
            .input("td_trxnmo5", (record["td_trxnmo5"] == null) ? '' : record["td_trxnmo5"])
            .input("newunqno", (record["newunqno"] == null) ? '' : record["newunqno"])
            .input("sipregdt", record["sipregdt"])
            .input("sipregslno", (record["sipregslno"] == null) ? '' : record["sipregslno"])
            .input("divper", (record["divper"] == null) ? 0 : record["divper"])
            .input("td_pop", (record["td_pop"] == null) ? 0 : record["td_pop"])
            .input("electrxnf6", (record["electrxnf6"] == null) ? '' : record["electrxnf6"])
            .input("stampduty", (record["stampduty"] == null) ? 0 : record["stampduty"])
            .input("RecordDate", record["RecordDate"])
            .input("RecordSession", (record["RecordSession"] == null) ? '' : record["RecordSession"])
            .input("unique_ref_no", 'K-' + ((record["unqno"] == null) ? '' : record["unqno"].toString().trim()) + '-' + ((record["trflag"] == null) ? '' : record["trflag"].toString().trim()));

        const result = await request.execute("InsertFeedKarvy307");

        await transaction.commit();
    }
    catch (err) {
        // console.log(record);
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while saving karvy 307 record...');
    }
};

async function updateKarvyClientTransactionFolioUnit(recordSession) {
    try {
        var data = [];

        let pool = await appPool.connect();

        const readRequest = pool.request();
        readRequest.input("RecordSession", recordSession);
        const readResult = await readRequest.execute("GetFeedKarvy307ByRecordSession");
        if (readResult.recordset.length > 0) {
            data = readResult.recordset;
        }

        for (let i = 0; i < data.length; i++) {
            let inputData = {
                FolioNumber: data[i].td_acno,
                Units: data[i].td_units,
                NAV: data[i].td_nav,
                BSEOrderId: data[i].inwardnum1
            };

            await updateClientTransactionFolioUnit(inputData);

            //TODO: update trade log
        }
    }
    catch (err) {
        console.log(err);

        throw new Error('Error while updating karvy ledger unit folio record...');
    }
};

async function updateClientTransactionFolioUnit(inputData) {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input("FolioNumber", inputData.FolioNumber)
            .input("Units", inputData.Units)
            .input("NAV", inputData.NAV)
            .input("BSEOrderId", inputData.BSEOrderId);

        const result = await request.execute("UpdateClientTransactionFolioUnit");

        await transaction.commit();
    }
    catch (err) {
        // console.log(inputData);
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while updating ledger unit folio record...');
    }
};

async function readCamsWbr2Email(recordDate, recordSession) {
    var link = '';

    const client = new imapFlow.ImapFlow({
        host: process.env.IMAP_HOST,
        port: 993,
        secure: true,
        auth: {
            user: process.env.IMAP_USER,
            pass: process.env.IMAP_PASSWORD
        }
    });

    await client.connect();

    let lock = await client.getMailboxLock('INBOX');

    try {
        // let message = await client.fetchOne(client.mailbox.exists, { source: true });
        // console.log(message.source.toString());

        let messageList = await client.search({
            seen: false, or: [
                { subject: 'WBR2. Investor Transactions for a Period, Request Id:180356975R2' }
            ]
        }, { uid: false });

        if (messageList.length > 0) {
            // console.log(messageList[0].toString());
            let message = await client.fetchOne(messageList[0].toString(), { uid: false, source: true });
            // console.log(message.source.toString());
            // const pdfFilePath = path.join(__dirname.replace("app", "public"), '..', 'documents', CommonFunction.GetUniqueId()+'.txt');
            // fileSystem.writeFileSync(pdfFilePath,message.source.toString().trim().replaceAll('=\r\n',''));

            var downloadUrlBreak = message.source.toString('utf8').trim().replaceAll('=\r\n', '').split('DownloadURL');
            if (downloadUrlBreak.length > 0) {
                var anchorBreak = downloadUrlBreak[1].split("href=3D'");

                if (anchorBreak.length > 0) {
                    var anchorBreakEnd = anchorBreak[1].split("'>");

                    if (anchorBreakEnd.length > 0) {
                        link = anchorBreakEnd[0].trim();
                    }
                }
            }

            if (link != '') {
                var messages = [];
                messages.push(messageList[0]);

                await client.messageFlagsAdd(messages, ['\\Seen'], { uid: false });
            }
        }
    }
    catch (err) {
        console.log(err);
    }
    finally {
        lock.release();
    }

    await client.logout();

    return { Status: (link != ''), Link: link };
};

async function readCamsWbr2EmailManual(recordDate, recordSession, requestId) {
    var link = '';

    const client = new imapFlow.ImapFlow({
        host: process.env.IMAP_HOST,
        port: 993,
        secure: true,
        auth: {
            user: process.env.IMAP_USER,
            pass: process.env.IMAP_PASSWORD
        }
    });

    await client.connect();

    let lock = await client.getMailboxLock('INBOX');

    try {
        // let message = await client.fetchOne(client.mailbox.exists, { source: true });
        // console.log(message.source.toString());

        let messageList = await client.search({
            seen: false, or: [
                { subject: 'WBR2. Investor Transactions for a Period, Request Id:' + requestId }
            ]
        }, { uid: false });

        if (messageList.length > 0) {
            // console.log(messageList[0].toString());
            let message = await client.fetchOne(messageList[0].toString(), { uid: false, source: true });
            // console.log(message.source.toString());
            // const pdfFilePath = path.join(__dirname.replace("app", "public"), '..', 'documents', CommonFunction.GetUniqueId()+'.txt');
            // fileSystem.writeFileSync(pdfFilePath,message.source.toString().trim().replaceAll('=\r\n',''));

            var downloadUrlBreak = message.source.toString('utf8').trim().replaceAll('=\r\n', '').split('DownloadURL');
            if (downloadUrlBreak.length > 0) {
                var anchorBreak = downloadUrlBreak[1].split("href=3D'");

                if (anchorBreak.length > 0) {
                    var anchorBreakEnd = anchorBreak[1].split("'>");

                    if (anchorBreakEnd.length > 0) {
                        link = anchorBreakEnd[0].trim();
                    }
                }
            }

            if (link != '') {
                var messages = [];
                messages.push(messageList[0]);

                await client.messageFlagsAdd(messages, ['\\Seen'], { uid: false });
            }
        }
    }
    catch (err) {
        console.log(err);
    }
    finally {
        lock.release();
    }

    await client.logout();

    return { Status: (link != ''), Link: link };
};

async function readCamsWbr2File(fileName, link, recordDate, recordSession) {
    var filePath = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'cams', fileName);
    var wbrFolder = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'cams', 'wbr2');
    var recordCount = 0

    var downloadFileResult = await downloadCamsWbr2File(link, filePath);

    if (downloadFileResult.Status == true) {
        var extractFileResult = await extractCamsWbr2ZipFile(filePath, wbrFolder);

        if (extractFileResult.DataFileName != '') {
            var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'cams', 'wbr2', extractFileResult.DataFileName);

            var data = await readDataFile(dataFilePath);

            recordCount = data.length;

            for (let i = 0; i < recordCount; i++) {
                var row = data[i];

                // console.log(row);
                // break;

                var traddate = null;
                var postdate = null;
                var rep_date = null;
                var ticob_post = null;
                var sys_regn_d = null;
                var ca_initiat = null;

                if (row['TRADDATE'] != null && row['TRADDATE'] != undefined) {
                    traddate = date.format(row['TRADDATE'], 'YYYY-MM-DD');
                }
                if (row['POSTDATE'] != null && row['POSTDATE'] != undefined) {
                    postdate = date.format(row['POSTDATE'], 'YYYY-MM-DD');
                }
                if (row['REP_DATE'] != null && row['REP_DATE'] != undefined) {
                    rep_date = date.format(row['REP_DATE'], 'YYYY-MM-DD');
                }

                if (row['TICOB_POST'] != null && row['TICOB_POST'] != undefined) {
                    ticob_post = (row['TICOB_POST'].trim() == '') ? null : date.format(row['TICOB_POST'], 'YYYY-MM-DD');
                }
                if (row['SYS_REGN_D'] != null && row['SYS_REGN_D'] != undefined) {
                    sys_regn_d = date.format(row['SYS_REGN_D'], 'YYYY-MM-DD');
                }
                if (row['CA_INITIAT'] != null && row['CA_INITIAT'] != undefined) {
                    ca_initiat = date.format(row['CA_INITIAT'], 'YYYY-MM-DD');
                }

                var dataItem = {
                    recno: row['RECNO'] || 0,
                    amc_code: row['AMC_CODE'] || '',
                    folio_no: row['FOLIO_NO'] || '',
                    prodcode: row['PRODCODE'] || '',
                    scheme: row['SCHEME'] || '',
                    inv_name: row['INV_NAME'] || '',
                    trxntype: row['TRXNTYPE'] || '',
                    trxnno: row['TRXNNO'] || '',
                    trxnmode: row['TRXNMODE'] || '',
                    trxnstat: row['TRXNSTAT'] || '',
                    usercode: row['USERCODE'] || '',
                    usrtrxno: row['USRTRXNO'] || '',
                    traddate: traddate,
                    postdate: postdate,
                    purprice: row['PURPRICE'] || 0,
                    units: row['UNITS'] || 0,
                    amount: row['AMOUNT'] || 0,
                    brokcode: row['BROKCODE'] || '',
                    subbrok: row['SUBBROK'] || '',
                    brokperc: row['BROKPERC'] || 0,
                    brokcomm: row['BROKCOMM'] || 0,
                    altfolio: row['ALTFOLIO'] || '',
                    rep_date: rep_date,
                    time1: row['TIME1'] || '',
                    trxnsubtyp: row['TRXNSUBTYP'] || '',
                    applicatio: row['APPLICATIO'] || '',
                    trxn_natur: row['TRXN_NATUR'] || '',
                    tax: row['TAX'] || 0,
                    total_tax: row['TOTAL_TAX'] || 0,
                    te_15h: row['TE_15H'] || '',
                    micr_no: row['MICR_NO'] || '',
                    remarks: row['REMARKS'] || '',
                    swflag: row['SWFLAG'] || '',
                    old_folio: row['OLD_FOLIO'] || '',
                    seq_no: row['SEQ_NO'] || '',
                    reinvest_f: row['REINVEST_F'] || '',
                    mult_brok: row['MULT_BROK'] || '',
                    stt: row['STT'] || 0,
                    location: row['LOCATION'] || '',
                    scheme_typ: row['SCHEME_TYP'] || '',
                    tax_status: row['TAX_STATUS'] || '',
                    eload: row['LOAD'] || 0,
                    scanrefno: row['SCANREFNO'] || '',
                    pan: row['PAN'] || '',
                    inv_iin: row['INV_IIN'] || 0,
                    targ_src_s: row['TARG_SRC_S'] || '',
                    trxn_type: row['TRXN_TYPE_'] || '',
                    ticob_trty: row['TICOB_TRTY'] || '',
                    ticob_trno: row['TICOB_TRNO'] || '',
                    ticob_post: ticob_post,
                    dp_id: row['DP_ID'] || '',
                    trxn_charg: row['TRXN_CHARG'] || 0,
                    eligib_amt: row['ELIGIB_AMT'] || 0,
                    src_of_txn: row['SRC_OF_TXN'] || '',
                    trxn_suffi: row['TRXN_SUFFI'] || '',
                    siptrxnno: row['SIPTRXNNO'] || '',
                    ter_locati: row['TER_LOCATI'] || '',
                    euin: row['EUIN'] || '',
                    euin_valid: row['EUIN_VALID'] || '',
                    euin_opted: row['EUIN_OPTED'] || '',
                    sub_brk_ar: row['SUB_BRK_AR'] || '',
                    exch_dc_fl: row['EXCH_DC_FL'] || '',
                    src_brk_co: row['SRC_BRK_CO'] || '',
                    sys_regn_d: sys_regn_d,
                    ac_no: row['AC_NO'] || '',
                    bank_name: row['BANK_NAME'] || '',
                    reversal_c: row['REVERSAL_C'] || 0,
                    exchange_f: row['EXCHANGE_F'] || '',
                    ca_initiat: ca_initiat,
                    gst_state: row['GST_STATE_'] || '',
                    igst_amoun: row['IGST_AMOUN'] || 0,
                    cgst_amoun: row['CGST_AMOUN'] || 0,
                    sgst_amoun: row['SGST_AMOUN'] || 0,
                    rev_remark: row['REV_REMARK'] || '',
                    original_t: row['ORIGINAL_T'] || '',
                    stamp_duty: row['STAMP_DUTY'] || 0,
                    folio_old: row['FOLIO_OLD'] || '',
                    scheme_fol: row['SCHEME_FOL'] || '',
                    amc_ref_no: row['AMC_REF_NO'] || '',
                    request_re: row['REQUEST_RE'] || '',
                    RecordDate: recordDate,
                    RecordSession: recordSession,
                };

                console.log(dataItem['trxnno']);

                await saveCamsWbr2Record(dataItem);

                var transactionType = '';
                if (dataItem["trxn_type"] == null) {
                    transactionType = (dataItem["trxntype"] == null) ? '' : dataItem["trxntype"];
                }
                else {
                    transactionType = dataItem["trxn_type"];

                    if (transactionType == '') {
                        transactionType = (dataItem["trxntype"] == null) ? '' : dataItem["trxntype"];
                    }
                }

                var recordItem = {
                    FolioNumber: (dataItem["folio_no"] == null) ? '' : dataItem["folio_no"],
                    ProductCode: (dataItem["prodcode"] == null) ? '' : dataItem["prodcode"],
                    TradeDate: (dataItem["traddate"] == null) ? '' : dataItem["traddate"],
                    TransactionNumber: (dataItem["scanrefno"] == null) ? '' : dataItem["scanrefno"],
                    TransactionType: transactionType,
                    AMCTransactionNumber: (dataItem["trxnno"] == null) ? '' : 'CAMS-' + dataItem["trxnno"],
                    Units: (dataItem["units"] == null) ? '' : dataItem["units"],
                    NAV: (dataItem["purprice"] == null) ? '' : dataItem["purprice"],
                    Amount: (dataItem["amount"] == null) ? '' : dataItem["amount"],
                    UniqueRefNo: 'C-' + ((dataItem["trxnmode"] == null) ? '' : dataItem["trxnmode"].toString().trim()) + '-' + ((dataItem["trxnno"] == null) ? '' : dataItem["trxnno"].toString().trim()) + '-' + ((dataItem["usrtrxno"] == null) ? '' : dataItem["usrtrxno"].toString().trim()) + '-' + ((dataItem["seq_no"] == null) ? '' : dataItem["seq_no"].toString().trim())
                };

                await saveFeedTransaction(recordItem);
            }
        }
    }

    return { Status: (recordCount != 0), RecordCount: recordCount };
};

async function readCamsWbr2FileManual(fileName, link, recordDate, recordSession) {
    var filePath = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'cams', fileName);
    var wbrFolder = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'cams', 'wbr2');
    var recordCount = 0

    var downloadFileResult = await downloadCamsWbr2File(link, filePath);

    if (downloadFileResult.Status == true) {
        var extractFileResult = await extractCamsWbr2ZipFile(filePath, wbrFolder);

        if (extractFileResult.DataFileName != '') {
            var dataFilePath = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'cams', 'wbr2', extractFileResult.DataFileName);

            var data = await readDataFile(dataFilePath);

            recordCount = data.length;

            for (let i = 0; i < recordCount; i++) {
                var row = data[i];

                // console.log(row);
                // break;

                var traddate = null;
                var postdate = null;
                var rep_date = null;
                var ticob_post = null;
                var sys_regn_d = null;
                var ca_initiat = null;

                if (row['TRADDATE'] != null && row['TRADDATE'] != undefined) {
                    traddate = date.format(row['TRADDATE'], 'YYYY-MM-DD');
                }
                if (row['POSTDATE'] != null && row['POSTDATE'] != undefined) {
                    postdate = date.format(row['POSTDATE'], 'YYYY-MM-DD');
                }
                if (row['REP_DATE'] != null && row['REP_DATE'] != undefined) {
                    rep_date = date.format(row['REP_DATE'], 'YYYY-MM-DD');
                }

                if (row['TICOB_POST'] != null && row['TICOB_POST'] != undefined) {
                    ticob_post = (row['TICOB_POST'].trim() == '') ? null : date.format(row['TICOB_POST'], 'YYYY-MM-DD');
                }
                if (row['SYS_REGN_D'] != null && row['SYS_REGN_D'] != undefined) {
                    sys_regn_d = date.format(row['SYS_REGN_D'], 'YYYY-MM-DD');
                }
                if (row['CA_INITIAT'] != null && row['CA_INITIAT'] != undefined) {
                    ca_initiat = date.format(row['CA_INITIAT'], 'YYYY-MM-DD');
                }

                var dataItem = {
                    recno: row['RECNO'] || 0,
                    amc_code: row['AMC_CODE'] || '',
                    folio_no: row['FOLIO_NO'] || '',
                    prodcode: row['PRODCODE'] || '',
                    scheme: row['SCHEME'] || '',
                    inv_name: row['INV_NAME'] || '',
                    trxntype: row['TRXNTYPE'] || '',
                    trxnno: row['TRXNNO'] || '',
                    trxnmode: row['TRXNMODE'] || '',
                    trxnstat: row['TRXNSTAT'] || '',
                    usercode: row['USERCODE'] || '',
                    usrtrxno: row['USRTRXNO'] || '',
                    traddate: traddate,
                    postdate: postdate,
                    purprice: row['PURPRICE'] || 0,
                    units: row['UNITS'] || 0,
                    amount: row['AMOUNT'] || 0,
                    brokcode: row['BROKCODE'] || '',
                    subbrok: row['SUBBROK'] || '',
                    brokperc: row['BROKPERC'] || 0,
                    brokcomm: row['BROKCOMM'] || 0,
                    altfolio: row['ALTFOLIO'] || '',
                    rep_date: rep_date,
                    time1: row['TIME1'] || '',
                    trxnsubtyp: row['TRXNSUBTYP'] || '',
                    applicatio: row['APPLICATIO'] || '',
                    trxn_natur: row['TRXN_NATUR'] || '',
                    tax: row['TAX'] || 0,
                    total_tax: row['TOTAL_TAX'] || 0,
                    te_15h: row['TE_15H'] || '',
                    micr_no: row['MICR_NO'] || '',
                    remarks: row['REMARKS'] || '',
                    swflag: row['SWFLAG'] || '',
                    old_folio: row['OLD_FOLIO'] || '',
                    seq_no: row['SEQ_NO'] || '',
                    reinvest_f: row['REINVEST_F'] || '',
                    mult_brok: row['MULT_BROK'] || '',
                    stt: row['STT'] || 0,
                    location: row['LOCATION'] || '',
                    scheme_typ: row['SCHEME_TYP'] || '',
                    tax_status: row['TAX_STATUS'] || '',
                    eload: row['LOAD'] || 0,
                    scanrefno: row['SCANREFNO'] || '',
                    pan: row['PAN'] || '',
                    inv_iin: row['INV_IIN'] || 0,
                    targ_src_s: row['TARG_SRC_S'] || '',
                    trxn_type: row['TRXN_TYPE_'] || '',
                    ticob_trty: row['TICOB_TRTY'] || '',
                    ticob_trno: row['TICOB_TRNO'] || '',
                    ticob_post: ticob_post,
                    dp_id: row['DP_ID'] || '',
                    trxn_charg: row['TRXN_CHARG'] || 0,
                    eligib_amt: row['ELIGIB_AMT'] || 0,
                    src_of_txn: row['SRC_OF_TXN'] || '',
                    trxn_suffi: row['TRXN_SUFFI'] || '',
                    siptrxnno: row['SIPTRXNNO'] || '',
                    ter_locati: row['TER_LOCATI'] || '',
                    euin: row['EUIN'] || '',
                    euin_valid: row['EUIN_VALID'] || '',
                    euin_opted: row['EUIN_OPTED'] || '',
                    sub_brk_ar: row['SUB_BRK_AR'] || '',
                    exch_dc_fl: row['EXCH_DC_FL'] || '',
                    src_brk_co: row['SRC_BRK_CO'] || '',
                    sys_regn_d: sys_regn_d,
                    ac_no: row['AC_NO'] || '',
                    bank_name: row['BANK_NAME'] || '',
                    reversal_c: row['REVERSAL_C'] || 0,
                    exchange_f: row['EXCHANGE_F'] || '',
                    ca_initiat: ca_initiat,
                    gst_state: row['GST_STATE_'] || '',
                    igst_amoun: row['IGST_AMOUN'] || 0,
                    cgst_amoun: row['CGST_AMOUN'] || 0,
                    sgst_amoun: row['SGST_AMOUN'] || 0,
                    rev_remark: row['REV_REMARK'] || '',
                    original_t: row['ORIGINAL_T'] || '',
                    stamp_duty: row['STAMP_DUTY'] || 0,
                    folio_old: row['FOLIO_OLD'] || '',
                    scheme_fol: row['SCHEME_FOL'] || '',
                    amc_ref_no: row['AMC_REF_NO'] || '',
                    request_re: row['REQUEST_RE'] || '',
                    RecordDate: recordDate,
                    RecordSession: recordSession,
                };

                // console.log(dataItem['trxnno']);

                await saveCamsWbr2Record(dataItem);

                // var transactionType = '';
                // if (dataItem["trxn_type"] == null) {
                //     transactionType = (dataItem["trxntype"] == null) ? '' : dataItem["trxntype"];
                // }
                // else {
                //     transactionType = dataItem["trxn_type"];

                //     if (transactionType == '') {
                //         transactionType = (dataItem["trxntype"] == null) ? '' : dataItem["trxntype"];
                //     }
                // }

                // var recordItem = {
                //     FolioNumber: (dataItem["folio_no"] == null) ? '' : dataItem["folio_no"],
                //     ProductCode: (dataItem["prodcode"] == null) ? '' : dataItem["prodcode"],
                //     TradeDate: (dataItem["traddate"] == null) ? '' : dataItem["traddate"],
                //     TransactionNumber: (dataItem["scanrefno"] == null) ? '' : dataItem["scanrefno"],
                //     TransactionType: transactionType,
                //     AMCTransactionNumber: (dataItem["trxnno"] == null) ? '' : 'CAMS-' + dataItem["trxnno"],
                //     Units: (dataItem["units"] == null) ? '' : dataItem["units"],
                //     NAV: (dataItem["purprice"] == null) ? '' : dataItem["purprice"],
                //     Amount: (dataItem["amount"] == null) ? '' : dataItem["amount"],
                // };

                // await saveFeedTransaction(recordItem);
            }
        }
    }

    return { Status: (recordCount != 0), RecordCount: recordCount };
};

async function downloadCamsWbr2File(link, filePath) {
    return new Promise((resolve, reject) => {
        var file = fileSystem.createWriteStream(filePath);
        var request = https.get(link, function (response) {
            response.pipe(file);

            file.on('finish', async function () {
                file.close();

                resolve({ Status: true, Message: 'File is created at ' + filePath });
            });
        }).on('error', function (err) {
            fileSystem.unlink(filePath, (err) => { });
            reject(err.message);
        });
    });
};

async function extractCamsWbr2ZipFile(filePath, wbrFolder) {
    return new Promise((resolve, reject) => {
        var dbfFileName = '';

        const zipStream = zip.extractFull(filePath, wbrFolder, {
            password: 'Punit@0516',
            $bin: zipLib.path7za
        });

        zipStream.on('data', function (data) {
            if (data.status == 'extracted') {
                dbfFileName = data.file;
            }
        });

        zipStream.on('end', () => {
            // Do stuff with unzipped content
            resolve({ Status: true, Message: 'File is extracted at ' + wbrFolder, DataFileName: dbfFileName });
        });

        zipStream.on('error', (err) => {
            reject(err);
        });
    });
};

async function saveCamsWbr2Record(record) {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        var trxn_natur_new = await getNewTransactionNature((record["trxn_natur"] == null) ? '' : record["trxn_natur"].trim(), (record["trxntype"] == null) ? '' : record["trxntype"].trim());

        request.input("recno", (record["recno"] == null) ? '' : record["recno"])
            .input("amc_code", (record["amc_code"] == null) ? '' : record["amc_code"])
            .input("folio_no", (record["folio_no"] == null) ? '' : record["folio_no"])
            .input("prodcode", (record["prodcode"] == null) ? '' : record["prodcode"])
            .input("scheme", (record["scheme"] == null) ? '' : record["scheme"])
            .input("inv_name", (record["inv_name"] == null) ? '' : record["inv_name"])
            .input("trxntype", (record["trxntype"] == null) ? '' : record["trxntype"])
            .input("trxnno", (record["trxnno"] == null) ? '' : record["trxnno"])
            .input("trxnmode", (record["trxnmode"] == null) ? '' : record["trxnmode"])
            .input("trxnstat", (record["trxnstat"] == null) ? '' : record["trxnstat"])
            .input("usercode", (record["usercode"] == null) ? '' : record["usercode"])
            .input("usrtrxno", (record["usrtrxno"] == null) ? '' : record["usrtrxno"])
            .input("traddate", (record["traddate"] == null) ? '' : record["traddate"])
            .input("postdate", (record["postdate"] == null) ? '' : record["postdate"])
            .input("purprice", (record["purprice"] == null) ? '' : record["purprice"])
            .input("units", (record["units"] == null) ? '' : record["units"])
            .input("amount", (record["amount"] == null) ? '' : record["amount"])
            .input("brokcode", (record["brokcode"] == null) ? '' : record["brokcode"])
            .input("subbrok", (record["subbrok"] == null) ? '' : record["subbrok"])
            .input("brokperc", (record["brokperc"] == null) ? '' : record["brokperc"])
            .input("brokcomm", (record["brokcomm"] == null) ? '' : record["brokcomm"])
            .input("altfolio", (record["altfolio"] == null) ? '' : record["altfolio"])
            .input("rep_date", (record["rep_date"] == null) ? '' : record["rep_date"])
            .input("time1", (record["time1"] == null) ? '' : record["time1"])
            .input("trxnsubtyp", (record["trxnsubtyp"] == null) ? '' : record["trxnsubtyp"])
            .input("applicatio", (record["applicatio"] == null) ? '' : record["applicatio"])
            .input("trxn_natur", (record["trxn_natur"] == null) ? '' : record["trxn_natur"])
            .input("tax", (record["tax"] == null) ? '' : record["tax"])
            .input("total_tax", (record["total_tax"] == null) ? '' : record["total_tax"])
            .input("te_15h", (record["te_15h"] == null) ? '' : record["te_15h"])
            .input("micr_no", (record["micr_no"] == null) ? '' : record["micr_no"])
            .input("remarks", (record["remarks"] == null) ? '' : record["remarks"])
            .input("swflag", (record["swflag"] == null) ? '' : record["swflag"])
            .input("old_folio", (record["old_folio"] == null) ? '' : record["old_folio"])
            .input("seq_no", (record["seq_no"] == null) ? '' : record["seq_no"])
            .input("reinvest_f", (record["reinvest_f"] == null) ? '' : record["reinvest_f"])
            .input("mult_brok", (record["mult_brok"] == null) ? '' : record["mult_brok"])
            .input("stt", (record["stt"] == null) ? '' : record["stt"])
            .input("location", (record["location"] == null) ? '' : record["location"])
            .input("scheme_typ", (record["scheme_typ"] == null) ? '' : record["scheme_typ"])
            .input("tax_status", (record["tax_status"] == null) ? '' : record["tax_status"])
            .input("eload", (record["eload"] == null) ? '' : record["eload"])
            .input("scanrefno", (record["scanrefno"] == null) ? '' : record["scanrefno"])
            .input("pan", (record["pan"] == null) ? '' : record["pan"])
            .input("inv_iin", (record["inv_iin"] == null) ? '' : record["inv_iin"])
            .input("targ_src_s", (record["targ_src_s"] == null) ? '' : record["targ_src_s"])
            .input("trxn_type", (record["trxn_type"] == null) ? '' : record["trxn_type"])
            .input("ticob_trty", (record["ticob_trty"] == null) ? '' : record["ticob_trty"])
            .input("ticob_trno", (record["ticob_trno"] == null) ? '' : record["ticob_trno"])
            .input("ticob_post", (record["ticob_post"] == null) ? '' : record["ticob_post"])
            .input("dp_id", (record["dp_id"] == null) ? '' : record["dp_id"])
            .input("trxn_charg", (record["trxn_charg"] == null) ? '' : record["trxn_charg"])
            .input("eligib_amt", (record["eligib_amt"] == null) ? '' : record["eligib_amt"])
            .input("src_of_txn", (record["src_of_txn"] == null) ? '' : record["src_of_txn"])
            .input("trxn_suffi", (record["trxn_suffi"] == null) ? '' : record["trxn_suffi"])
            .input("siptrxnno", (record["siptrxnno"] == null) ? '' : record["siptrxnno"])
            .input("ter_locati", (record["ter_locati"] == null) ? '' : record["ter_locati"])
            .input("euin", (record["euin"] == null) ? '' : record["euin"])
            .input("euin_valid", (record["euin_valid"] == null) ? '' : record["euin_valid"])
            .input("euin_opted", (record["euin_opted"] == null) ? '' : record["euin_opted"])
            .input("sub_brk_ar", (record["sub_brk_ar"] == null) ? '' : record["sub_brk_ar"])
            .input("exch_dc_fl", (record["exch_dc_fl"] == null) ? '' : record["exch_dc_fl"])
            .input("src_brk_co", (record["src_brk_co"] == null) ? '' : record["src_brk_co"])
            .input("sys_regn_d", (record["sys_regn_d"] == null) ? '' : record["sys_regn_d"])
            .input("ac_no", (record["ac_no"] == null) ? '' : record["ac_no"])
            .input("bank_name", (record["bank_name"] == null) ? '' : record["bank_name"])
            .input("reversal_c", (record["reversal_c"] == null) ? '' : record["reversal_c"])
            .input("exchange_f", (record["exchange_f"] == null) ? '' : record["exchange_f"])
            .input("ca_initiat", (record["ca_initiat"] == null) ? '' : record["ca_initiat"])
            .input("gst_state", (record["gst_state"] == null) ? '' : record["gst_state"])
            .input("igst_amoun", (record["igst_amoun"] == null) ? '' : record["igst_amoun"])
            .input("cgst_amoun", (record["cgst_amoun"] == null) ? '' : record["cgst_amoun"])
            .input("sgst_amoun", (record["sgst_amoun"] == null) ? '' : record["sgst_amoun"])
            .input("rev_remark", (record["rev_remark"] == null) ? '' : record["rev_remark"])
            .input("original_t", (record["original_t"] == null) ? '' : record["original_t"])
            .input("stamp_duty", (record["stamp_duty"] == null) ? '' : record["stamp_duty"])
            .input("folio_old", (record["folio_old"] == null) ? '' : record["folio_old"])
            .input("scheme_fol", (record["scheme_fol"] == null) ? '' : record["scheme_fol"])
            .input("amc_ref_no", (record["amc_ref_no"] == null) ? '' : record["amc_ref_no"])
            .input("request_re", (record["request_re"] == null) ? '' : record["request_re"])
            .input("RecordDate", (record["RecordDate"] == null) ? '' : record["RecordDate"])
            .input("RecordSession", (record["RecordSession"] == null) ? '' : record["RecordSession"])
            .input("trxn_natur_new", trxn_natur_new)
            .input("unique_ref_no", 'C-' + ((record["trxnmode"] == null) ? '' : record["trxnmode"].toString().trim()) + '-' + ((record["trxnno"] == null) ? '' : record["trxnno"].toString().trim()) + '-' + ((record["usrtrxno"] == null) ? '' : record["usrtrxno"].toString().trim()) + '-' + ((record["seq_no"] == null) ? '' : record["seq_no"].toString().trim()));

        const result = await request.execute("InsertFeedCamsWbr2");

        await transaction.commit();
    }
    catch (err) {
        // console.log(record);
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while saving cams wbr2 record...');
    }
};

async function saveCamsWbr2aRecord(record) {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        var trxn_natur_new = await getNewTransactionNature((record["trxn_natur"] == null) ? '' : record["trxn_natur"].trim(), (record["trxntype"] == null) ? '' : record["trxntype"].trim());

        request.input("recno", (record["recno"] == null) ? '' : record["recno"])
            .input("amc_code", (record["amc_code"] == null) ? '' : record["amc_code"])
            .input("folio_no", (record["folio_no"] == null) ? '' : record["folio_no"])
            .input("prodcode", (record["prodcode"] == null) ? '' : record["prodcode"])
            .input("scheme", (record["scheme"] == null) ? '' : record["scheme"])
            .input("inv_name", (record["inv_name"] == null) ? '' : record["inv_name"])
            .input("trxntype", (record["trxntype"] == null) ? '' : record["trxntype"])
            .input("trxnno", (record["trxnno"] == null) ? '' : record["trxnno"])
            .input("trxnmode", (record["trxnmode"] == null) ? '' : record["trxnmode"])
            .input("trxnstat", (record["trxnstat"] == null) ? '' : record["trxnstat"])
            .input("usercode", (record["usercode"] == null) ? '' : record["usercode"])
            .input("usrtrxno", (record["usrtrxno"] == null) ? '' : record["usrtrxno"])
            .input("traddate", (record["traddate"] == null) ? '' : record["traddate"])
            .input("postdate", (record["postdate"] == null) ? '' : record["postdate"])
            .input("purprice", (record["purprice"] == null) ? '' : record["purprice"])
            .input("units", (record["units"] == null) ? '' : record["units"])
            .input("amount", (record["amount"] == null) ? '' : record["amount"])
            .input("brokcode", (record["brokcode"] == null) ? '' : record["brokcode"])
            .input("subbrok", (record["subbrok"] == null) ? '' : record["subbrok"])
            .input("brokperc", (record["brokperc"] == null) ? '' : record["brokperc"])
            .input("brokcomm", (record["brokcomm"] == null) ? '' : record["brokcomm"])
            .input("altfolio", (record["altfolio"] == null) ? '' : record["altfolio"])
            .input("rep_date", (record["rep_date"] == null) ? '' : record["rep_date"])
            .input("time1", (record["time1"] == null) ? '' : record["time1"])
            .input("trxnsubtyp", (record["trxnsubtyp"] == null) ? '' : record["trxnsubtyp"])
            .input("applicatio", (record["applicatio"] == null) ? '' : record["applicatio"])
            .input("trxn_natur", (record["trxn_natur"] == null) ? '' : record["trxn_natur"])
            .input("tax", (record["tax"] == null) ? '' : record["tax"])
            .input("total_tax", (record["total_tax"] == null) ? '' : record["total_tax"])
            .input("te_15h", (record["te_15h"] == null) ? '' : record["te_15h"])
            .input("micr_no", (record["micr_no"] == null) ? '' : record["micr_no"])
            .input("remarks", (record["remarks"] == null) ? '' : record["remarks"])
            .input("swflag", (record["swflag"] == null) ? '' : record["swflag"])
            .input("old_folio", (record["old_folio"] == null) ? '' : record["old_folio"])
            .input("seq_no", (record["seq_no"] == null) ? '' : record["seq_no"])
            .input("reinvest_f", (record["reinvest_f"] == null) ? '' : record["reinvest_f"])
            .input("mult_brok", (record["mult_brok"] == null) ? '' : record["mult_brok"])
            .input("stt", (record["stt"] == null) ? '' : record["stt"])
            .input("location", (record["location"] == null) ? '' : record["location"])
            .input("scheme_typ", (record["scheme_typ"] == null) ? '' : record["scheme_typ"])
            .input("tax_status", (record["tax_status"] == null) ? '' : record["tax_status"])
            .input("eload", (record["eload"] == null) ? '' : record["eload"])
            .input("scanrefno", (record["scanrefno"] == null) ? '' : record["scanrefno"])
            .input("pan", (record["pan"] == null) ? '' : record["pan"])
            .input("inv_iin", (record["inv_iin"] == null) ? '' : record["inv_iin"])
            .input("targ_src_s", (record["targ_src_s"] == null) ? '' : record["targ_src_s"])
            .input("trxn_type", (record["trxn_type"] == null) ? '' : record["trxn_type"])
            .input("ticob_trty", (record["ticob_trty"] == null) ? '' : record["ticob_trty"])
            .input("ticob_trno", (record["ticob_trno"] == null) ? '' : record["ticob_trno"])
            .input("ticob_post", (record["ticob_post"] == null) ? '' : record["ticob_post"])
            .input("dp_id", (record["dp_id"] == null) ? '' : record["dp_id"])
            .input("trxn_charg", (record["trxn_charg"] == null) ? '' : record["trxn_charg"])
            .input("eligib_amt", (record["eligib_amt"] == null) ? '' : record["eligib_amt"])
            .input("src_of_txn", (record["src_of_txn"] == null) ? '' : record["src_of_txn"])
            .input("trxn_suffi", (record["trxn_suffi"] == null) ? '' : record["trxn_suffi"])
            .input("siptrxnno", (record["siptrxnno"] == null) ? '' : record["siptrxnno"])
            .input("ter_locati", (record["ter_locati"] == null) ? '' : record["ter_locati"])
            .input("euin", (record["euin"] == null) ? '' : record["euin"])
            .input("euin_valid", (record["euin_valid"] == null) ? '' : record["euin_valid"])
            .input("euin_opted", (record["euin_opted"] == null) ? '' : record["euin_opted"])
            .input("sub_brk_ar", (record["sub_brk_ar"] == null) ? '' : record["sub_brk_ar"])
            .input("exch_dc_fl", (record["exch_dc_fl"] == null) ? '' : record["exch_dc_fl"])
            .input("src_brk_co", (record["src_brk_co"] == null) ? '' : record["src_brk_co"])
            .input("sys_regn_d", (record["sys_regn_d"] == null) ? '' : record["sys_regn_d"])
            .input("ac_no", (record["ac_no"] == null) ? '' : record["ac_no"])
            .input("bank_name", (record["bank_name"] == null) ? '' : record["bank_name"])
            .input("reversal_c", (record["reversal_c"] == null) ? '' : record["reversal_c"])
            .input("exchange_f", (record["exchange_f"] == null) ? '' : record["exchange_f"])
            .input("ca_initiat", (record["ca_initiat"] == null) ? '' : record["ca_initiat"])
            .input("gst_state", (record["gst_state"] == null) ? '' : record["gst_state"])
            .input("igst_amoun", (record["igst_amoun"] == null) ? '' : record["igst_amoun"])
            .input("cgst_amoun", (record["cgst_amoun"] == null) ? '' : record["cgst_amoun"])
            .input("sgst_amoun", (record["sgst_amoun"] == null) ? '' : record["sgst_amoun"])
            .input("rev_remark", (record["rev_remark"] == null) ? '' : record["rev_remark"])
            .input("original_t", (record["original_t"] == null) ? '' : record["original_t"])
            .input("stamp_duty", (record["stamp_duty"] == null) ? '' : record["stamp_duty"])
            .input("folio_old", (record["folio_old"] == null) ? '' : record["folio_old"])
            .input("scheme_fol", (record["scheme_fol"] == null) ? '' : record["scheme_fol"])
            .input("amc_ref_no", (record["amc_ref_no"] == null) ? '' : record["amc_ref_no"])
            .input("request_re", (record["request_re"] == null) ? '' : record["request_re"])
            .input("RecordDate", (record["RecordDate"] == null) ? '' : record["RecordDate"])
            .input("RecordSession", (record["RecordSession"] == null) ? '' : record["RecordSession"])
            .input("trxn_natur_new", trxn_natur_new)
            .input("unique_ref_no", 'C2-' + ((record["trxnmode"] == null) ? '' : record["trxnmode"].toString().trim()) + '-' + ((record["trxnno"] == null) ? '' : record["trxnno"].toString().trim()) + '-' + ((record["usrtrxno"] == null) ? '' : record["usrtrxno"].toString().trim()) + '-' + ((record["seq_no"] == null) ? '' : record["seq_no"].toString().trim()));

        const result = await request.execute("InsertFeedCamsWbr2a");

        await transaction.commit();
    }
    catch (err) {
        // console.log(record);
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while saving cams wbr2 record...');
    }
};

async function getNewTransactionNature(transactionNature, transactionType) {
    var newTransactionNature = transactionNature;

    if (transactionType.startsWith('P') == true && transactionNature.toLowerCase().includes('systematic') && (
        transactionNature.toLowerCase().includes('reversal') ||
        transactionNature.toLowerCase().includes('not found') ||
        transactionNature.toLowerCase().includes('rej') ||
        transactionNature.toLowerCase().includes('reversed') ||
        transactionNature.toLowerCase().includes('blocked') ||
        transactionNature.toLowerCase().includes('rejection') ||
        transactionNature.toLowerCase().includes('insufficient') ||
        transactionNature.toLowerCase().includes('incorrect') ||
        transactionNature.toLowerCase().includes('date is before') ||
        transactionNature.toLowerCase().includes('pending') ||
        transactionNature.toLowerCase().includes('expired') ||
        transactionNature.toLowerCase().includes('invalid') ||
        transactionNature.toLowerCase().includes('not received') ||
        transactionNature.toLowerCase().includes('dp not av') ||
        transactionNature.toLowerCase().includes('balance is less') ||
        transactionNature.toLowerCase().includes('dishonoured') ||
        transactionNature.toLowerCase().includes('edit') ||
        transactionNature.toLowerCase().includes('rejected') ||
        transactionNature.toLowerCase().includes('miscellaneous') ||
        transactionNature.toLowerCase().includes('rectification') ||
        transactionNature.toLowerCase().includes('mismatch') ||
        transactionNature.toLowerCase().includes('no funds') ||
        transactionNature.toLowerCase().includes('not available') ||
        transactionNature.toLowerCase().includes('failed') ||
        transactionNature.toLowerCase().includes('failure')
    )) {
        newTransactionNature = 'SIP Reversal';
    }
    else if (transactionType.startsWith('P') == true && (
        transactionNature.toLowerCase().includes('sip reversal') ||
        (transactionNature.toLowerCase().includes('systematic') && transactionNature.includes('ER')) ||
        (transactionNature.toLowerCase().includes('systematic') && transactionNature.toLowerCase().includes('date is after'))
    )) {
        newTransactionNature = 'SIP Reversal';
    }
    else if (transactionType.startsWith('P') == true && transactionNature.toLowerCase() == 'systematic') {
        newTransactionNature = 'SIP';
    }
    else if (transactionType.startsWith('P') == true && (transactionNature.toLowerCase().startsWith('systematic-bse -') == true ||
        transactionNature.toLowerCase().startsWith('systematic instalment no -') == true ||
        transactionNature.toLowerCase().startsWith('systematic - via') == true ||
        transactionNature.toLowerCase().startsWith('systematic- for') == true ||
        transactionNature.toLowerCase().startsWith('systematic appln') == true ||
        transactionNature.toLowerCase().startsWith('systematic-nse -') == true ||
        transactionNature.toLowerCase().startsWith('systematic-normal') == true ||
        transactionNature.toLowerCase().startsWith('systematic (ecs)') == true ||
        transactionNature.toLowerCase().startsWith('systematic (pdc)') == true ||
        transactionNature.toLowerCase().startsWith('systematic - cton') == true ||
        transactionNature.toLowerCase().startsWith('systematic - ifast-online') == true ||
        transactionNature.toLowerCase().startsWith('systematic - konline') == true ||
        transactionNature.toLowerCase().startsWith('systematic - multi') == true ||
        transactionNature.toLowerCase().startsWith('systematic  - instalment') == true ||
        transactionNature.toLowerCase().startsWith('systematic - instalment 1') == true ||
        transactionNature.toLowerCase().startsWith('systematic - instalment') == true ||
        transactionNature.toLowerCase().startsWith('systematic - instament') == true ||
        transactionNature.toLowerCase().startsWith('systematic physical - instalment') == true ||
        transactionNature.toLowerCase().startsWith('systematic physical') == true ||
        transactionNature.toLowerCase().startsWith('systematicinstalment') == true ||
        transactionNature.toLowerCase().startsWith('systematicothers. - instalment no') == true ||
        transactionNature.toLowerCase().startsWith('systematic sfolio') == true ||
        transactionNature.toLowerCase().startsWith('systematic - w') == true ||
        transactionNature.toLowerCase().startsWith('systematic  - arn-') == true ||
        transactionNature.toLowerCase().startsWith('systematic - arn-') == true ||
        transactionNature.toLowerCase().startsWith('systematic (hdfc si)') == true)
    ) {
        newTransactionNature = 'SIP';
    }
    else if (transactionType.startsWith('P') == true && (/^systematic - \d+\/\d+.*$/.test(transactionNature.toLowerCase()) == true ||
        /^systematic  \d+\/\d+$/.test(transactionNature.toLowerCase()) == true ||
        /^systematic - \d$/.test(transactionNature.toLowerCase()) == true ||
        /^systematic  \d+.*\/$/.test(transactionNature.toLowerCase()) == true ||
        /^systematic \d.*$/.test(transactionNature.toLowerCase()) == true ||
        /^systematic  \d.*$/.test(transactionNature.toLowerCase()) == true ||
        /^systematic - \d.*$/.test(transactionNature.toLowerCase()) == true)
    ) {
        newTransactionNature = 'SIP';
    }
    else if (transactionType.startsWith('S') == true && (transactionNature.toLowerCase().startsWith('systematic - instalment') == true ||
        transactionNature.toLowerCase().startsWith('systematic - to') == true)
    ) {
        newTransactionNature = 'Switch Out';
    }
    else if (transactionType.startsWith('R') == true && (transactionNature.toLowerCase().startsWith('systematic -') == true ||
        transactionNature.toLowerCase().startsWith('systematic systematic withdrawal') == true ||
        transactionNature.toLowerCase().startsWith('systematic(') == true ||
        transactionNature.toLowerCase().startsWith('systematic less stt') == true ||
        transactionNature.toLowerCase().startsWith('systematicautomatic withdrawal') == true ||
        transactionNature.toLowerCase().startsWith('systematic-bse') == true)
    ) {
        newTransactionNature = 'SWP';
    }
    else if (transactionType.startsWith('R') == true && (
        (transactionNature.toLowerCase().includes('systematic') && transactionNature.toLowerCase().includes('reversal')) ||
        (transactionNature.toLowerCase().includes('systematic') && transactionNature.toLowerCase().includes('reversed')) ||
        (transactionNature.toLowerCase().includes('systematic') && transactionNature.toLowerCase().includes('bank updated')) ||
        (transactionNature.toLowerCase().includes('systematic') && transactionNature.toLowerCase().includes('rectification')) ||
        (transactionNature.toLowerCase().includes('systematic') && transactionNature.toLowerCase().includes('rectified'))
    )) {
        newTransactionNature = 'SWP Reversal';
    }
    else if (transactionType.startsWith('SO') == true && (transactionNature.toLowerCase().startsWith('systematicpe stp - switch out') == true ||
        transactionNature.toLowerCase().startsWith('systematic less stt  - to') == true ||
        transactionNature.toLowerCase().startsWith('systematiccode vi') == true ||
        transactionNature.toLowerCase().startsWith('systematic fti') == true)
    ) {
        newTransactionNature = 'STP Out';
    }
    else if (transactionType.startsWith('SO') == true && (
        (transactionNature.toLowerCase().includes('systematic') && transactionNature.toLowerCase().includes('rectified')) ||
        (transactionNature.toLowerCase().includes('systematic') && transactionNature.toLowerCase().includes('reversal')) ||
        (transactionNature.toLowerCase().includes('systematic') && transactionNature.toLowerCase().includes('rectification')) ||
        (transactionNature.toLowerCase().includes('systematic') && transactionNature.toLowerCase().includes('reversed'))
    )
    ) {
        newTransactionNature = 'STP Out Rejection';
    }
    else if (transactionType.startsWith('SI') == true && (transactionNature.toLowerCase().startsWith('systematic - from') == true ||
        transactionNature.toLowerCase().startsWith('systematic from') == true ||
        transactionNature.toLowerCase().startsWith('systematicpe stp - switched in') == true ||
        transactionNature.toLowerCase().startsWith('systematic fti') == true)
    ) {
        newTransactionNature = 'STP In';
    }
    else if (transactionType.startsWith('SI') == true && (
        transactionNature.toLowerCase().startsWith('systematiccode vi') == true ||
        (transactionNature.toLowerCase().includes('systematic') && transactionNature.toLowerCase().includes('rectified')) ||
        (transactionNature.toLowerCase().includes('systematic') && transactionNature.toLowerCase().includes('reversal')) ||
        (transactionNature.toLowerCase().includes('systematic') && transactionNature.toLowerCase().includes('rectification')) ||
        (transactionNature.toLowerCase().includes('systematic') && transactionNature.toLowerCase().includes('reversed'))
    )
    ) {
        newTransactionNature = 'STP In Reversal';
    }

    return newTransactionNature;
};

async function updateCamsClientTransactionFolioUnit(recordSession) {
    try {
        var data = [];

        let pool = await appPool.connect();

        const readRequest = pool.request();
        readRequest.input("RecordSession", recordSession);
        const readResult = await readRequest.execute("GetFeedCamsWbr2ByRecordSession");
        if (readResult.recordset.length > 0) {
            data = readResult.recordset;
        }

        for (let i = 0; i < data.length; i++) {
            let inputData = {
                FolioNumber: data[i].folio_no,
                Units: data[i].units,
                NAV: data[i].purprice,
                BSEOrderId: data[i].scanrefno
            };

            await updateClientTransactionFolioUnit(inputData);

            //TODO: update trade log
        }
    }
    catch (err) {
        console.log(err);

        throw new Error('Error while updating cams ledger unit folio record...');
    }
};

async function saveFeedTransaction(record) {
    var purchaseRedemptionType = await getFeedTransactionPurchaseRedemptionType(record.TransactionType);

    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        // const request = transaction.request();

        // request.input("FolioNumber", record.FolioNumber)
        //     .input("ProductCode", record.ProductCode)
        //     .input("TradeDate", record.TradeDate)
        //     .input("TransactionNumber", record.TransactionNumber)
        //     .input("TransactionType", record.TransactionType)
        //     .input("AMCTransactionNumber", record.AMCTransactionNumber)
        //     .input("Units", record.Units)
        //     .input("NAV", record.NAV)
        //     .input("Amount", record.Amount)
        //     .input("PurchaseRedemptionType", (purchaseRedemptionType != null) ? purchaseRedemptionType.Code : '');

        // const result = await request.execute("InsertFeedTransaction");

        const requestFeed = transaction.request();

        requestFeed.input("FolioNumber", record.FolioNumber)
            .input("ProductCode", record.ProductCode)
            .input("TradeDate", record.TradeDate)
            .input("Units", record.Units)
            .input("NAV", record.NAV)
            .input("Amount", record.Amount)
            .input("UniqueRefNo", record.UniqueRefNo);

        const resultFeed = await requestFeed.execute("InsertFeedTransactions");

        await transaction.commit();
    }
    catch (err) {
        // console.log(record);
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while saving feed transaction record...');
    }
};

async function updateFeedTransactionUcc() {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();
        const result = await request.execute("UpdateFeedTransactionUCC");

        await transaction.commit();
    }
    catch (err) {
        // console.log(record);
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while saving feed transaction record...');
    }
};

async function getFeedTransactions() {
    var data = [];

    let pool = await appPool.connect();

    const readRequest = pool.request();
    const readResult = await readRequest.execute("GetFeedTransaction");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function updateFeedTransactionsPurchaseRedemptionType() {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        const result = await request.execute("UpdateFeedTransactionsPurchaseRedemptionType");

        await transaction.commit();
    }
    catch (err) {
        // console.log(record);
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while update feed transaction purchaseredemptiontype...');
    }
};

async function updateFeedTransactionDaysCount() {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        const result = await request.execute("UpdateFeedTransactionDaysCount");

        await transaction.commit();
    }
    catch (err) {
        // console.log(record);
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while update feed transaction days count...');
    }
};

async function updateFeedTransactionReverseEntries() {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();
        const result = await request.execute("UpdateFeedTransactionReverseEntries");

        const requestNonAccount = transaction.request();
        const resultNonAccount = await requestNonAccount.execute("UpdateFeedTransactionReverseEntriesNonAccount");

        await transaction.commit();
    }
    catch (err) {
        // console.log(record);
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while update feed transaction reverse entries...');
    }
};

async function updateFeedTransactionUnitReconciliation() {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();

        const request = transaction.request();
        const result = await request.execute("UpdateFeedTransactionUnitReconciliation");

        const requestNonAccount = transaction.request();
        const resultNonAccount = await requestNonAccount.execute("UpdateFeedTransactionUnitReconciliationNonAccount");

        await transaction.commit();
    }
    catch (err) {
        // console.log(record);
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while update feed transaction unit reconciliation...');
    }
};

async function updateFeedDailyHoldingTransferOutBalance() {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();

        const request = transaction.request();
        const result = await request.execute("UpdateFeedDailyHoldingTransferOutBalance");

        await transaction.commit();
    }
    catch (err) {
        // console.log(record);
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while update feed daily holding transfer out balance...');
    }
};

async function updateFeedTransactionExitLoad() {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();

        const request = transaction.request();
        const result = await request.execute("UpdateFeedTransactionExitLoad");

        const requestNonAccount = transaction.request();
        const resultNonAccount = await requestNonAccount.execute("UpdateFeedTransactionExitLoadNonAccount");

        await transaction.commit();
    }
    catch (err) {
        // console.log(record);
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while update feed transaction exit load...');
    }
};

async function updateFeedTransactionXIRR() {
    let pool = await appPool.connect();

    var uccData = [];

    const readRequest = pool.request();
    const readResult = await readRequest.execute("GetFeedTransactionPurchaseBalanceUcc");
    if (readResult.recordset.length > 0) {
        uccData = readResult.recordset;
    }

    var uccDataCount = uccData.length;
    for (let i = 0; i < uccDataCount; i++) {
        var ucc = uccData[i].UCC;
        console.log('ucc: ' + ucc);

        var data = [];

        const readTransactionRequest = pool.request();
        readTransactionRequest.input('UCC', ucc);
        const readTransactionResult = await readTransactionRequest.execute("GetFeedTransactionPurchaseBalance");
        if (readTransactionResult.recordset.length > 0) {
            data = readTransactionResult.recordset;
        }

        var dataCount = data.length;
        for (let j = 0; j < dataCount; j++) {
            var dataItem = data[j];

            var balanceAmount = dataItem.BalanceUnits * dataItem.NAV;
            var purchaseDate = luxon.DateTime.fromISO(dataItem.TradeDate.toISOString(), { zone: 'Asia/Kolkata' });
            var currentAmount = dataItem.CurrentAmount;
            var currentDate = luxon.DateTime.now().setZone('Asia/Kolkata');

            if (currentAmount > 0) {
                const inputData = [
                    { amount: balanceAmount, date: purchaseDate.toFormat('yyyyMMdd') },
                    { amount: (0 - currentAmount), date: currentDate.toFormat('yyyyMMdd') }
                ];

                var xirrData = xirr.xirr(inputData);
                var XIRR = xirr.convertRate(xirrData.rate, xirr.RateInterval.Year);

                console.log({ Id: dataItem.Id, XIRR: (XIRR * 100) });

                await updateFeedTransactionXIRRData(dataItem.Id, (XIRR * 100))
            }
        }
    }
};

async function updateFeedTransactionXIRRNonAccount() {
    let pool = await appPool.connect();

    var uccData = [];

    const readRequest = pool.request();
    const readResult = await readRequest.execute("GetFeedTransactionPurchaseBalanceUccNonAccount");
    if (readResult.recordset.length > 0) {
        uccData = readResult.recordset;
    }

    var uccDataCount = uccData.length;
    for (let i = 0; i < uccDataCount; i++) {
        var FirstHolderPan = uccData[i].FirstHolderPan;
        var SecondHolderPan = uccData[i].SecondHolderPan;
        var ThirdHolderPan = uccData[i].ThirdHolderPan;
        var GuardianPan = uccData[i].GuardianPan;
        var Nominee1Name = uccData[i].Nominee1Name;
        var Nominee2Name = uccData[i].Nominee2Name;
        var Nominee3Name = uccData[i].Nominee3Name;

        console.log(uccData[i]);

        var data = [];

        const readTransactionRequest = pool.request();
        readTransactionRequest.input('FirstHolderPan', FirstHolderPan)
            .input('SecondHolderPan', SecondHolderPan)
            .input('ThirdHolderPan', ThirdHolderPan)
            .input('GuardianPan', GuardianPan)
            .input('Nominee1Name', Nominee1Name)
            .input('Nominee2Name', Nominee2Name)
            .input('Nominee3Name', Nominee3Name);
        const readTransactionResult = await readTransactionRequest.execute("GetFeedTransactionPurchaseBalanceNonAccount");
        if (readTransactionResult.recordset.length > 0) {
            data = readTransactionResult.recordset;
        }

        var dataCount = data.length;
        for (let j = 0; j < dataCount; j++) {
            var dataItem = data[j];

            var balanceAmount = dataItem.BalanceUnits * dataItem.NAV;
            var purchaseDate = luxon.DateTime.fromISO(dataItem.TradeDate.toISOString(), { zone: 'Asia/Kolkata' });
            var currentAmount = dataItem.CurrentAmount;
            var currentDate = luxon.DateTime.now().setZone('Asia/Kolkata');

            if (currentAmount > 0) {
                const inputData = [
                    { amount: balanceAmount, date: purchaseDate.toFormat('yyyyMMdd') },
                    { amount: (0 - currentAmount), date: currentDate.toFormat('yyyyMMdd') }
                ];

                var xirrData = xirr.xirr(inputData);
                var XIRR = xirr.convertRate(xirrData.rate, xirr.RateInterval.Year);

                console.log({ Id: dataItem.Id, XIRR: (XIRR * 100) });

                await updateFeedTransactionXIRRData(dataItem.Id, (XIRR * 100))
            }
        }
    }
};

async function updateFeedTransactionXIRRData(id, xirr) {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();
        const request = transaction.request();

        request.input('Id', id)
            .input('XIRR', xirr);

        const result = await request.execute("UpdateFeedTransactionXIRR");

        await transaction.commit();
    }
    catch (err) {
        // console.log({ id: id, xirr: xirr });
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        throw new Error('Error while update feed transaction XIRR data...');
    }
};

async function processFeedTransactionMismatchUnits() {
    let pool = await appPool.connect();

    var dataList = [];

    const readRequest = pool.request();
    const readResult = await readRequest.execute("GetFeedTransactionMismatchUnits");
    if (readResult.recordset.length > 0) {
        dataList = readResult.recordset.filter(x => x.IsMultiBroker == false);
    }

    for (let i = 0; i < dataList.length; i++) {
        var item = dataList[i];

        console.log(item.NewFolioNumber + '_' + item.ProductCode);

        const transaction = pool.transaction();
        try {
            await transaction.begin();

            const requestReset = transaction.request();
            requestReset.input("NewFolioNumber", item.NewFolioNumber)
                .input("ProductCode", item.ProductCode);
            const resultReset = await requestReset.execute("ResetFeedTransactionUnits");

            const requestResetDays = transaction.request();
            requestResetDays.input("NewFolioNumber", item.NewFolioNumber)
                .input("ProductCode", item.ProductCode);
            const resultResetDays = await requestResetDays.execute("ResetFeedTransactionDaysCount");

            const requestReverse = transaction.request();
            requestReverse.input("NewFolioNumber", item.NewFolioNumber)
                .input("ProductCode", item.ProductCode);
            const resultReverse = await requestReverse.execute("ResetFeedTransactionReverseEntries");

            const requestReconciliation = transaction.request();
            requestReconciliation.input("NewFolioNumber", item.NewFolioNumber)
                .input("ProductCode", item.ProductCode);
            const resultReconciliation = await requestReconciliation.execute("ResetFeedTransactionUnitReconciliation");

            const requestTransferOut = transaction.request();
            requestTransferOut.input("NewFolioNumber", item.NewFolioNumber)
                .input("ProductCode", item.ProductCode);
            const resultTransferOut = await requestTransferOut.execute("ResetFeedDailyHoldingTransferOutBalance");

            const requestExitLoad = transaction.request();
            requestExitLoad.input("NewFolioNumber", item.NewFolioNumber)
                .input("ProductCode", item.ProductCode);
            const resultExitLoad = await requestExitLoad.execute("ResetFeedTransactionExitLoad");

            const requestExitLoadNonAccount = transaction.request();
            requestExitLoadNonAccount.input("NewFolioNumber", item.NewFolioNumber)
                .input("ProductCode", item.ProductCode);
            const resultExitLoadNonAccount = await requestExitLoadNonAccount.execute("ResetFeedTransactionExitLoadNonAccount");

            await transaction.commit();
        }
        catch (err) {
            // console.log(record);
            console.log(err);
            try {
                await transaction.rollback();
            } catch (sqlerr) {
                console.log(sqlerr);
            }

            throw new Error('Error while reset feed transaction...');
        }


        var data = [];

        const readTransactionRequest = pool.request();
        readTransactionRequest.input('NewFolioNumber', item.NewFolioNumber)
            .input('ProductCode', item.ProductCode);
        const readTransactionResult = await readTransactionRequest.execute("GetFeedTransactionPurchaseBalanceByFolioProduct");
        if (readTransactionResult.recordset.length > 0) {
            data = readTransactionResult.recordset;
        }

        var dataCount = data.length;
        for (let j = 0; j < dataCount; j++) {
            var dataItem = data[j];

            var balanceAmount = dataItem.BalanceUnits * dataItem.NAV;
            var purchaseDate = luxon.DateTime.fromISO(dataItem.TradeDate.toISOString(), { zone: 'Asia/Kolkata' });
            var currentAmount = dataItem.CurrentAmount;
            var currentDate = luxon.DateTime.now().setZone('Asia/Kolkata');

            if (currentAmount > 0) {
                const inputData = [
                    { amount: balanceAmount, date: purchaseDate.toFormat('yyyyMMdd') },
                    { amount: (0 - currentAmount), date: currentDate.toFormat('yyyyMMdd') }
                ];

                var xirrData = xirr.xirr(inputData);
                var XIRR = xirr.convertRate(xirrData.rate, xirr.RateInterval.Year);

                console.log({ Id: dataItem.Id, XIRR: (XIRR * 100) });

                await updateFeedTransactionXIRRData(dataItem.Id, (XIRR * 100))
            }
        }
    }
};

async function processFeedTransactionBenchmarkData(req, res) {
    let pool = await appPool.connect();

    const transaction = pool.transaction();
    try {
        await transaction.begin();

        const requestUpdate = transaction.request();
        const resultUpdate = await requestUpdate.execute("UpdateFeedTransactionsBenchmarkNAV");

        await transaction.commit();
    }
    catch (err) {
        // console.log(record);
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        // throw new Error('Error while processing bulk benchmark transaction...');
    }

    // var dataList = [];

    // const readRequest = pool.request();
    // const readResult = await readRequest.execute("GetFeedTransactionsBenchmarkPending");
    // if (readResult.recordset.length > 0) {
    //     dataList = readResult.recordset.map(item => {
    //         const Id = cryptoEngine.ParamEncrypt(item.Id, true);

    //         return { ...item, Id };
    //     });
    // }

    // for (let i = 0; i < dataList.length; i++) {
    //     var item = dataList[i];

    //     var benchmarkData = await getBenchmarkDataByProductCodeTradeDate(item.ProductCode, item.TradeDate);

    //     if (benchmarkData == null) {
    //         var result = await benchmarkdataController.ProcessPulseLabsBenchmarkData(req, res, luxon.DateTime.fromISO(item.TradeDate.toISOString(), { zone: 'Asia/Kolkata' }));

    //         benchmarkData = await getBenchmarkDataByProductCodeTradeDate(item.ProductCode, item.TradeDate);
    //     }

    //     if (benchmarkData != null) {
    //         if (benchmarkData.FinalBenchmarkCode != '' && benchmarkData.BenchmarkValue != 0) {
    //             try {
    //                 await transaction.begin();

    //                 const requestUpdateBenchmark = transaction.request();
    //                 requestUpdateBenchmark.input("Id", cryptoEngine.ParamDecrypt(item.Id, true))
    //                     .input("PurchaseAmount", item.PurchaseAmount)
    //                     .input("BenchmarkNAV", benchmarkData.BenchmarkValue)
    //                     .input("FinalBenchmarkCode", benchmarkData.FinalBenchmarkCode);
    //                 const resultUpdateBenchmark = await requestUpdateBenchmark.execute("UpdateFeedTransactionsBenchmarkData");

    //                 await transaction.commit();
    //             }
    //             catch (err) {
    //                 // console.log(record);
    //                 console.log(err);
    //                 try {
    //                     await transaction.rollback();
    //                 } catch (sqlerr) {
    //                     console.log(sqlerr);
    //                 }

    //                 // throw new Error('Error while processing bulk benchmark transaction...');
    //             }
    //         }
    //     }
    // }

    try {
        await transaction.begin();

        const requestUpdateCurrent = transaction.request();
        const resultUpdateCurrent = await requestUpdateCurrent.execute("UpdateFeedTransactionsBenchmarkCurrent");

        await transaction.commit();
    }
    catch (err) {
        // console.log(record);
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        // throw new Error('Error while processing bulk benchmark transaction...');
    }
}

async function getBenchmarkDataByProductCodeTradeDate(productCode, tradeDate) {
    let pool = await appPool.connect();

    var benchmarkData;

    const readBenchmarkDataRequest = pool.request();
    readBenchmarkDataRequest.input("ProductCode", productCode)
        .input("TradeDate", tradeDate);
    const readBenchmarkDataResult = await readBenchmarkDataRequest.execute("GetBenchmarkDataByProductCodeTradeDate");
    if (readBenchmarkDataResult.recordset.length > 0) {
        benchmarkData = readBenchmarkDataResult.recordset[0];
    }

    return benchmarkData;
}

async function getFeedTransactionPurchaseRedemptionType(name) {
    var dataList = [
        { Name: 'Additional Purchase', Code: 'P' },
        { Name: 'Additional Purchase Pre-Rejection', Code: 'P' },
        { Name: 'Additional Purchase Systematic', Code: 'P' },
        { Name: 'AP', Code: 'P' },
        { Name: 'APN', Code: 'P' },
        { Name: 'BONUS', Code: 'P' },
        { Name: 'Consolidation In', Code: 'P' },
        { Name: 'Consolidation Out', Code: 'R' },
        { Name: 'Div. Reinvestment', Code: 'P' },
        { Name: 'Dividend Payout', Code: 'R' },
        { Name: 'Dividend Reinvest', Code: 'P' },
        { Name: 'Dividend Sweep In', Code: 'P' },
        { Name: 'Dividend Sweep Out', Code: 'R' },
        { Name: 'Dividend Sweep Out Rej.', Code: 'R' },
        { Name: 'DRO', Code: 'P' },
        { Name: 'Fresh Purchase', Code: 'P' },
        { Name: 'Fresh Purchase Systematic', Code: 'P' },
        { Name: 'Full Redemption', Code: 'R' },
        { Name: 'Full Switch Out', Code: 'R' },
        { Name: 'Gross Dividend', Code: 'R' },
        { Name: 'Gross Dividend Rejection', Code: 'P' },
        { Name: 'Initial Allotment', Code: 'P' },
        { Name: 'Lat. Shift Out Rej.', Code: 'P' },
        { Name: 'Lateral Shift In', Code: 'P' },
        { Name: 'Lateral Shift Out', Code: 'R' },
        { Name: 'Lateral Shift OutPre rejection', Code: 'R' },
        { Name: 'NFO FP', Code: 'P' },
        { Name: 'NFO SI', Code: 'P' },
        { Name: 'NFOAP', Code: 'P' },
        { Name: 'NFOAS', Code: 'P' },
        { Name: 'NFOFS', Code: 'P' },
        { Name: 'Partial Redemption', Code: 'R' },
        { Name: 'Partial Switch Out', Code: 'R' },
        { Name: 'Pledging', Code: 'L' },
        { Name: 'Purchase', Code: 'P' },
        { Name: 'Purchase Rejection', Code: 'R' },
        { Name: 'Redemption', Code: 'R' },
        { Name: 'Redemption Pre rejection', Code: 'R' },
        { Name: 'Redemption Rejection', Code: 'P' },
        { Name: 'Refund', Code: 'R' },
        { Name: 'ReInvestment Rejection', Code: 'R' },
        { Name: 'S T P In', Code: 'P' },
        { Name: 'S T P Out', Code: 'R' },
        { Name: 'SIP Rejection', Code: 'R' },
        { Name: 'SO', Code: 'R' },
        { Name: 'Switch In', Code: 'P' },
        { Name: 'Switch Over In', Code: 'P' },
        { Name: 'Switch Over Out', Code: 'R' },
        { Name: 'Systematic Investment', Code: 'P' },
        { Name: 'Systematic Investment Pre-Rejection', Code: 'P' },
        { Name: 'Systematic Withdrawal', Code: 'R' },
        { Name: 'TI into existing Folio', Code: 'P' },
        { Name: 'TI into New Folio', Code: 'P' },
        { Name: 'TICOB', Code: 'P' },
        { Name: 'TOCOB', Code: 'R' },
        { Name: 'TO', Code: 'R' },
        { Name: 'TOXT', Code: 'R' },
        { Name: 'Transfer Out', Code: 'R' },
        { Name: 'Transmission In', Code: 'P' },
        { Name: 'Transmission Out', Code: 'R' },
        { Name: 'Unpledging', Code: 'U' },
        { Name: 'FP', Code: 'P' },
        { Name: 'IPO Rejection', Code: 'R' },
        { Name: 'Lat. Shift In Rej.', Code: 'R' },
        { Name: 'R', Code: 'R' },
        { Name: 'S T P In Rej', Code: 'R' },
        { Name: 'S T P Out Rej', Code: 'P' },
        { Name: 'Swit. Over Out Rej.', Code: 'P' },
        { Name: 'Systematic Withdrawal Pre rejection', Code: 'P' },
        { Name: 'TIXT', Code: 'P' },
        { Name: 'P1', Code: 'P' },
        { Name: 'P1IFLS', Code: 'P' },
        { Name: 'P1SRSF', Code: 'P' },
        { Name: 'P23E', Code: 'P' },
        { Name: 'P27ES', Code: 'P' },
        { Name: 'P27U', Code: 'P' },
        { Name: 'P2E', Code: 'P' },
        { Name: 'P2L', Code: 'P' },
        { Name: 'P3E', Code: 'P' },
        { Name: 'P4ES', Code: 'P' },
        { Name: 'P5ES', Code: 'P' },
        { Name: 'P5L', Code: 'P' },
        { Name: 'P5SY', Code: 'P' },
        { Name: 'P6ES', Code: 'P' },
        { Name: 'P8B', Code: 'P' },
        { Name: 'P8H', Code: 'P' },
        { Name: 'P8L', Code: 'P' },
        { Name: 'PB1', Code: 'P' },
        { Name: 'PF11', Code: 'P' },
        { Name: 'PF2', Code: 'P' },
        { Name: 'PI1', Code: 'P' },
        { Name: 'PJAN6S', Code: 'P' },
        { Name: 'PJUL7S', Code: 'P' },
        { Name: 'PJUN7S', Code: 'P' },
        { Name: 'PJUNE6S', Code: 'P' },
        { Name: 'PSEP6LS', Code: 'P' },
        { Name: 'PSI', Code: 'P' },
        { Name: 'PSIP2', Code: 'P' },
        { Name: 'PSIP3', Code: 'P' },
        { Name: 'PSIP6', Code: 'P' },
        { Name: 'PSL1', Code: 'P' },
        { Name: 'PTGL', Code: 'P' },
        { Name: 'SIF2', Code: 'P' },
        { Name: 'SO1', Code: 'R' },
        { Name: 'R1', Code: 'R' },
        { Name: 'RSO', Code: 'R' },
        { Name: 'Bonus Units', Code: 'P' },
        { Name: 'Demat Transfer In', Code: 'P' },
        { Name: 'Segregated Units', Code: 'P' },
        { Name: 'STRIP In', Code: 'P' },
        { Name: 'Bonus Rejection', Code: 'R' },
        { Name: 'Consolidation In Rejection', Code: 'R' },
        { Name: 'Dematerialized', Code: 'T' },
        { Name: 'Dividend Sweep In Rej.', Code: 'R' },
        { Name: 'Initial Purchase Pre-Rejection', Code: 'R' },
        { Name: 'Lateral Shift In Pre rejection', Code: 'R' },
        { Name: 'New Purchase Pre-Rejection', Code: 'R' },
        { Name: 'Refund Rejection', Code: 'R' },
        { Name: 'S T P Out Pre rejection', Code: 'R' },
        { Name: 'Segregated Units Rejection', Code: 'R' },
        { Name: 'STRIP Out', Code: 'R' },
        { Name: 'Swit. Over In Rej.', Code: 'R' },
        { Name: 'SWP Rejection', Code: 'R' },
        { Name: 'Transmission In Rejection', Code: 'R' },
        { Name: 'Transmission Out Rejection', Code: 'R' },
        { Name: 'Unpledging Rejection', Code: 'U' },
    ];

    var data = dataList.find(x => x.Name.toLowerCase() === name.toLowerCase());

    return data;
}

async function listFiles(folderPath) {
    try {
        const files = fileSystem.readdirSync(folderPath);
        const fileList = [];

        for (const file of files) {
            const fullPath = path.join(folderPath, file);
            const stat = fileSystem.statSync(fullPath);
            if (stat.isFile()) {
                fileList.push(file);
            }
        }

        return fileList;

    } catch (err) {
        console.error('Error reading directory:', err);
    }
}

async function readAmfiIndiaNavFile(fileName, link, recordDate, recordSession) {
    var filePath = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'amfi', fileName);
    // var wbrFolder = path.join(__dirname.replace("app", "public"), '..', 'downloads', 'amfi', 'nav');
    var recordCount = 0

    var downloadFileResult = await downloadAmfiIndiaNavFile(link, filePath);

    if (downloadFileResult.Status == true) {
        const workBook = xlsx.readFile(filePath);
        const workSheet = workBook.Sheets[workBook.SheetNames[0]];
        const jsonData = xlsx.utils.sheet_to_json(workSheet);

        // console.log(jsonData);

        for (const row of jsonData) {
            if (row['Net Asset Value'] != undefined && row['Net Asset Value'] != null) {
                recordCount += 1;
                var navDate = luxon.DateTime.fromISO(CommonFunction.ExcelDateToJSDate(row['Date']).toISOString(), { zone: 'Asia/Kolkata' });
                var isin = (row['ISIN Div Payout / ISIN Growth'] == undefined || row['ISIN Div Payout / ISIN Growth'] == null || row['ISIN Div Payout / ISIN Growth'] == '') ? row['ISIN Div Reinvestment\t'] : row['ISIN Div Payout / ISIN Growth'];
                var nav = (row['Net Asset Value'] == '') ? 0 : Number(row['Net Asset Value']);

                // console.log(row);
                if (nav != 0) {
                    await saveAmfiNav(navDate, row['Scheme Code'], row['Scheme NAV Name'], '', '', isin, nav, '');
                }
            }
        }

        // const transaction = req.app.locals.db.transaction();
        // for (const row of jsonData) {
        //     const amc = row['amc'];
        //     const code = row['code'];
        //     const scheme_name = row['scheme_name'];
        //     const scheme_type = row['scheme_type'];
        //     const scheme_category = row['scheme_category'];
        //     const scheme_nav_name = row['scheme_nav_name'];
        //     const scheme_minimum_amount = row['scheme_minimum_amount'];
        //     const launch_date = row['launch_date'];
        //     const closure_date = row['closure_date'];
        //     const isin = row['isin'];
        //     const portfolio = row['portfolio'];
        //     const channel_partner_code = row['channel_partner_code'];
        //     const purchase_allowed = row['purchase_allowed'];
        //     const redemption_allowed = row['redemption_allowed'];
        //     const sip_flag = row['sip_flag'];
        //     const stp_flag = row['stp_flag'];
        //     const swp_flag = row['swp_flag'];
        //     const switch_flag = row['switch_flag'];

        //     var launchDate = null;
        //     var closureDate = null;
        //     var portfolioName = '';
        //     var portfolioType = '';

        //     // console.log(launch_date);
        //     if (launch_date != null && launch_date != undefined && launch_date != '' && launch_date != 'NULL') {
        //         launchDate = date.format(commonFunction.ExcelDateToJSDate(launch_date), 'YYYY-MM-DD');
        //     }

        //     if (closure_date != null && closure_date != undefined && closure_date != '' && closure_date != 'NULL') {
        //         closureDate = date.format(commonFunction.ExcelDateToJSDate(closure_date), 'YYYY-MM-DD');
        //     }

        //     if (portfolio != undefined) {
        //         var portfolioList = portfolio.split('-');

        //         portfolioName = portfolioList[0].trim();
        //         if (portfolioList.length > 1) {
        //             portfolioType = portfolioList[1].trim();
        //         }
        //     }

        //     // console.log('Code: ' + code);
        //     // console.log('ISIN: ' + isin);

        //     try {
        //         await transaction.begin();

        //         const insertRequest = transaction.request();
        //         insertRequest.input("AMC", (amc == undefined) ? '' : amc)
        //             .input("Code", (code == undefined) ? '' : code)
        //             .input("SchemeName", (scheme_name == undefined) ? '' : scheme_name)
        //             .input("SchemeType", (scheme_type == undefined) ? '' : scheme_type)
        //             .input("SchemeCategory", (scheme_category == undefined) ? '' : scheme_category)
        //             .input("SchemeNavName", (scheme_nav_name == undefined) ? '' : scheme_nav_name)
        //             .input("SchemeMinimumAmount", (scheme_minimum_amount == undefined) ? '' : scheme_minimum_amount)
        //             .input("LaunchDate", launchDate)
        //             .input("ClosureDate", closureDate)
        //             .input("ISIN", (isin == undefined) ? '' : isin)
        //             .input("Portfolio", portfolioName)
        //             .input("PortfolioType", portfolioType)
        //             .input("ChannelPartnerCode", (channel_partner_code == undefined) ? '' : channel_partner_code)
        //             .input("PurchaseAllowed", (purchase_allowed == undefined) ? '' : purchase_allowed)
        //             .input("RedemptionAllowed", (redemption_allowed == undefined) ? '' : redemption_allowed)
        //             .input("SIPFlag", (sip_flag == undefined) ? '' : sip_flag)
        //             .input("STPFlag", (stp_flag == undefined) ? '' : stp_flag)
        //             .input("SWPFlag", (swp_flag == undefined) ? '' : swp_flag)
        //             .input("SwitchFlag", (switch_flag == undefined) ? '' : switch_flag);
        //         const result = await insertRequest.execute("SaveBSESchemeAmfi");

        //         await transaction.commit();
        //     }
        //     catch (error) {
        //         console.log(error);
        //         await transaction.rollback();
        //     }
        // }
    }

    return { Status: (recordCount != 0), RecordCount: recordCount };
};

async function downloadAmfiIndiaNavFile(link, filePath) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

    return new Promise((resolve, reject) => {
        var file = fileSystem.createWriteStream(filePath);
        var request = https.get(link, function (response) {
            response.pipe(file);

            file.on('finish', async function () {
                file.close();

                resolve({ Status: true, Message: 'File is created at ' + filePath });
            });
        }).on('error', function (err) {
            fileSystem.unlink(filePath, (err) => { });
            reject(err.message);
        });
    });
};
