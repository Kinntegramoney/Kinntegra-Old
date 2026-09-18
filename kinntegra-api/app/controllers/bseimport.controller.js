const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");
const xlsx = require('xlsx');
const date = require('date-and-time');
const CommonFunction = require('../models/commonfunction.model');

exports.UploadSchemeExcel = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    const workBook = xlsx.read(req.files.documentFile.data);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        for (const row of jsonData) {
            await transaction.begin();

            let UniqueNo = row['Unique No'];
            let SchemeCode = row['Scheme Code'];
            let RTASchemeCode = row['RTA Scheme Code'];
            let AMCSchemeCode = row['AMC Scheme Code'];
            let ISIN = row['ISIN'];;
            let AMCCode = row['AMC Code'];
            let SchemeType = row['Scheme Type'];
            let SchemePlan = row['Scheme Plan'];
            let SchemeName = row['Scheme Name'];
            let PurchaseAllowed = row['Purchase Allowed'];
            let PurchaseTransactionMode = row['Purchase Transaction mode'];
            let MinimumPurchaseAmount = row['Minimum Purchase Amount'];
            let AdditionalPurchaseAmount = row['Additional Purchase Amount'];
            let MaximumPurchaseAmount = row['Maximum Purchase Amount'];
            let PurchaseAmountMultiplier = row['Purchase Amount Multiplier'];
            let PurchaseCutoffTime = row['Purchase Cutoff Time'];
            let RedemptionAllowed = row['Redemption Allowed'];;
            let RedemptionTransactionMode = row['Redemption Transaction Mode'];
            let MinimumRedemptionQty = row['Minimum Redemption Qty'];
            let RedemptionQtyMultiplier = row['Redemption Qty Multiplier'];
            let MaximumRedemptionQty = row['Maximum Redemption Qty'];
            let MinimumRedemptionAmount = row['Redemption Amount - Minimum'];
            let MaximumRedemptionAmount = row['Redemption Amount – Maximum'];
            let RedemptionAmountMultiplier = row['Redemption Amount Multiple'];
            let RedemptionCutoffTime = row['Redemption Cut off Time'];
            let RTAAgentCode = row['RTA Agent Code'];
            let AMCActiveFlag = row['AMC Active Flag'];
            let DividentReinvestmentFlag = row['Dividend Reinvestment Flag'];
            let SIPFlag = row['SIP FLAG'];
            let STPFlag = row['STP FLAG'];;
            let SWPFlag = row['SWP FLAG'];
            let SwitchFlag = row['Switch FLAG'];
            let SettlementType = row['SETTLEMENT TYPE'];
            let AMCInd = row['AMC_Ind'];
            let FaceValue = row['Face Value'];
            let StartDate = row['Start Date'];
            let EndDate = row['End Date'];
            let ExitLoadFlag = row['Exit Load Flag'];
            let ExitLoad = row['Exit Load'];
            let LockInPeriodFlag = row['Lock-in Period Flag'];
            let LockInPeriod = row['Lock-in Period'];
            let ChannelPartnerCode = row['Channel Partner Code'];;
            let ReOpeningDate = row['ReOpening Date'];
            let OpenCloseEndedScheme = row['Open/Close Ended Scheme'];

            const PurchaseCutoffTimeHHMMSS = convertFractionalTimeToHHMMSS(PurchaseCutoffTime);
            const RedemptionCutoffTimeHHMMSS = convertFractionalTimeToHHMMSS(RedemptionCutoffTime);

            if (UniqueNo == undefined) {
                UniqueNo = '';
            }
            if (SchemeCode == undefined) {
                SchemeCode = '';
            }
            if (RTASchemeCode == undefined) {
                RTASchemeCode = '';
            }
            if (AMCSchemeCode == undefined) {
                AMCSchemeCode = '';
            }
            if (ISIN == undefined) {
                ISIN = '';
            }
            if (AMCCode == undefined) {
                AMCCode = '';
            }
            if (SchemeType == undefined) {
                SchemeType = '';
            }
            if (SchemePlan == undefined) {
                SchemePlan = '';
            }
            if (SchemeName == undefined) {
                SchemeName = '';
            }
            if (PurchaseAllowed == undefined) {
                PurchaseAllowed = '';
            }
            if (PurchaseTransactionMode == undefined) {
                PurchaseTransactionMode = '';
            }
            if (MinimumPurchaseAmount == undefined) {
                MinimumPurchaseAmount = 0;
            }
            if (AdditionalPurchaseAmount == undefined) {
                AdditionalPurchaseAmount = 0;
            }
            if (MaximumPurchaseAmount == undefined) {
                MaximumPurchaseAmount = 0;
            }
            if (PurchaseAmountMultiplier == undefined) {
                PurchaseAmountMultiplier = 0;
            }
            if (PurchaseCutoffTime == undefined) {
                PurchaseCutoffTime = null;
            }
            if (RedemptionAllowed == undefined) {
                RedemptionAllowed = '';
            }
            if (RedemptionTransactionMode == undefined) {
                RedemptionTransactionMode = '';
            }
            if (MinimumRedemptionQty == undefined) {
                MinimumRedemptionQty = 0;
            }
            if (RedemptionQtyMultiplier == undefined) {
                RedemptionQtyMultiplier = 0;
            }
            if (MaximumRedemptionQty == undefined) {
                MaximumRedemptionQty = 0;
            }
            if (MinimumRedemptionAmount == undefined) {
                MinimumRedemptionAmount = 0;
            }
            if (MaximumRedemptionAmount == undefined) {
                MaximumRedemptionAmount = 0;
            }
            if (RedemptionAmountMultiplier == undefined) {
                RedemptionAmountMultiplier = 0;
            }
            if (RedemptionCutoffTime == undefined) {
                RedemptionCutoffTime = null;
            }
            if (RTAAgentCode == undefined) {
                RTAAgentCode = '';
            }
            if (AMCActiveFlag == undefined) {
                AMCActiveFlag = '';
            }
            if (DividentReinvestmentFlag == undefined) {
                DividentReinvestmentFlag = '';
            }
            if (SIPFlag == undefined) {
                SIPFlag = '';
            }
            if (STPFlag == undefined) {
                STPFlag = '';
            }
            if (SWPFlag == undefined) {
                SWPFlag = '';
            }
            if (SwitchFlag == undefined) {
                SwitchFlag = '';
            }
            if (SettlementType == undefined) {
                SettlementType = '';
            }
            if (AMCInd == undefined) {
                AMCInd = '';
            }
            if (FaceValue == undefined) {
                FaceValue = 0;
            }
            if (StartDate == undefined) {
                StartDate = null;
            }
            if (EndDate == undefined) {
                EndDate = null;
            }
            if (ExitLoadFlag == undefined) {
                ExitLoadFlag = '';
            }
            if (ExitLoad == undefined) {
                ExitLoad = 0;
            }
            if (LockInPeriodFlag == undefined) {
                LockInPeriodFlag = '';
            }
            if (LockInPeriod == undefined) {
                LockInPeriod = 0;
            }
            if (ChannelPartnerCode == undefined) {
                ChannelPartnerCode = '';
            }
            if (ReOpeningDate == undefined) {
                ReOpeningDate = null;
            }
            if (OpenCloseEndedScheme == undefined) {
                OpenCloseEndedScheme = '';
            }

            console.log(UniqueNo);

            const insertBankRequest = transaction.request();
            insertBankRequest.output("Id", msSql.BigInt)
                .input("UniqueNo", UniqueNo)
                .input("SchemeCode", SchemeCode)
                .input("RTASchemeCode", RTASchemeCode)
                .input("AMCSchemeCode", AMCSchemeCode)
                .input("ISIN", ISIN)
                .input("AMCCode", AMCCode)
                .input("SchemeType", SchemeType)
                .input("SchemePlan", SchemePlan)
                .input("SchemeName", SchemeName)
                .input("PurchaseAllowed", PurchaseAllowed)
                .input("PurchaseTransactionMode", PurchaseTransactionMode)
                .input("MinimumPurchaseAmount", MinimumPurchaseAmount)
                .input("AdditionalPurchaseAmount", AdditionalPurchaseAmount)
                .input("MaximumPurchaseAmount", MaximumPurchaseAmount)
                .input("PurchaseAmountMultiplier", PurchaseAmountMultiplier)
                .input("PurchaseCutoffTime", PurchaseCutoffTimeHHMMSS)
                .input("RedemptionAllowed", RedemptionAllowed)
                .input("RedemptionTransactionMode", RedemptionTransactionMode)
                .input("MinimumRedemptionQty", MinimumRedemptionQty)
                .input("RedemptionQtyMultiplier", RedemptionQtyMultiplier)
                .input("MaximumRedemptionQty", MaximumRedemptionQty)
                .input("MinimumRedemptionAmount", MinimumRedemptionAmount)
                .input("MaximumRedemptionAmount", MaximumRedemptionAmount)
                .input("RedemptionAmountMultiplier", RedemptionAmountMultiplier)
                .input("RedemptionCutoffTime", RedemptionCutoffTimeHHMMSS)
                .input("RTAAgentCode", RTAAgentCode)
                .input("AMCActiveFlag", AMCActiveFlag)
                .input("DividentReinvestmentFlag", DividentReinvestmentFlag)
                .input("SIPFlag", SIPFlag)
                .input("STPFlag", STPFlag)
                .input("SWPFlag", SWPFlag)
                .input("SwitchFlag", SwitchFlag)
                .input("SettlementType", SettlementType)
                .input("AMCInd", AMCInd)
                .input("FaceValue", FaceValue)
                .input("StartDate", StartDate)
                .input("EndDate", EndDate)
                .input("ExitLoadFlag", ExitLoadFlag)
                .input("ExitLoad", ExitLoad)
                .input("LockInPeriodFlag", LockInPeriodFlag)
                .input("LockInPeriod", LockInPeriod)
                .input("ChannelPartnerCode", ChannelPartnerCode)
                .input("ReOpeningDate", ReOpeningDate)
                .input("OpenCloseEndedScheme", OpenCloseEndedScheme);
            const result = await insertBankRequest.execute("InsertBSEScheme");

            // const insertAmfiRequest = transaction.request();
            // insertAmfiRequest.input("ISIN", ISIN)
            // const insertAmfiResult = await insertAmfiRequest.execute("InsertBSESchemeAmfi");
            await transaction.commit();
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

exports.UploadSIPSchemeExcel = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    const workBook = xlsx.read(req.files.documentFile.data);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        for (const row of jsonData) {
            await transaction.begin();

            let AMCCode = row['AMC CODE'];
            let AMCName = row['AMC NAME'];
            let SchemeCode = row['SCHEME CODE'];
            let SchemeName = row['SCHEME NAME'];
            let SIPTransactionMode = row['SIP TRANSACTION MODE'];;
            let SIPFrequency = row['SIP FREQUENCY'];
            let SIPDates = row['SIP DATES'];
            let SIPMinimumGap = row['SIP MINIMUM GAP'];
            let SIPMaximumGap = row['SIP MAXIMUM GAP'];
            let SIPInstallmentGap = row['SIP INSTALLMENT GAP'];
            let SIPStatus = row['SIP STATUS'];
            let SIPMinimumInstallmentAmount = row['SIP MINIMUM INSTALLMENT AMOUNT'];
            let SIPMaximumInstallmentAmount = row['SIP MAXIMUM INSTALLMENT AMOUNT'];
            let SIPMultiplierAmount = row['SIP MULTIPLIER AMOUNT'];
            let SIPMinimumInstallmentNumber = row['SIP MINIMUM INSTALLMENT NUMBERS'];
            let SIPMaximumInstallmentNumber = row['SIP MAXIMUM INSTALLMENT NUMBERS'];
            let ISIN = row['SCHEME ISIN'];
            let SchemeType = row['SCHEME TYPE'];
            let PauseFlag = row['PAUSE FLAG'];
            let PauseMinimumInstallment = row['PAUSE MINIMUM INSTALLMENTS'];
            let PauseMaximumInstallment = row['PAUSE MAXIMUM INSTALLMENTS'];
            let PauseModifictionCount = row['PAUSE MODIFICATION COUNT'];
            let Filler1 = row['FILLER 1'];
            let Filler2 = row['FILLER 2'];
            let Filler3 = row['FILLER 3'];
            let Filler4 = row['FILLER 4'];
            let Filler5 = row['FILLER 5'];

            if (AMCCode == undefined) {
                AMCCode = '';
            }
            if (AMCName == undefined) {
                AMCName = '';
            }
            if (SchemeCode == undefined) {
                SchemeCode = '';
            }
            if (SchemeName == undefined) {
                SchemeName = '';
            }
            if (SIPTransactionMode == undefined) {
                SIPTransactionMode = '';
            }
            if (SIPFrequency == undefined) {
                SIPFrequency = '';
            }
            if (SIPDates == undefined) {
                SIPDates = '';
            }
            if (SIPMinimumGap == undefined) {
                SIPMinimumGap = 0;
            }
            if (SIPMaximumGap == undefined) {
                SIPMaximumGap = 0;
            }
            if (SIPInstallmentGap == undefined) {
                SIPInstallmentGap = 0;
            }
            if (SIPStatus == undefined) {
                SIPStatus = 0;
            }
            if (SIPMinimumInstallmentAmount == undefined) {
                SIPMinimumInstallmentAmount = '';
            }
            if (SIPMaximumInstallmentAmount == undefined) {
                SIPMaximumInstallmentAmount = '';
            }
            if (SIPMultiplierAmount == undefined) {
                SIPMultiplierAmount = '';
            }
            if (SIPMinimumInstallmentNumber == undefined) {
                SIPMinimumInstallmentNumber = 0;
            }
            if (SIPMaximumInstallmentNumber == undefined) {
                SIPMaximumInstallmentNumber = 0;
            }
            if (ISIN == undefined) {
                ISIN = '';
            }
            if (SchemeType == undefined) {
                SchemeType = '';
            }
            if (PauseFlag == undefined) {
                PauseFlag = '';
            }
            if (PauseMinimumInstallment == undefined) {
                PauseMinimumInstallment = 0;
            }
            if (PauseMaximumInstallment == undefined) {
                PauseMaximumInstallment = 0;
            }
            if (PauseModifictionCount == undefined) {
                PauseModifictionCount = 0;
            }
            if (Filler1 == undefined) {
                Filler1 = '';
            }
            if (Filler2 == undefined) {
                Filler2 = '';
            }
            if (Filler3 == undefined) {
                Filler3 = '';
            }
            if (Filler4 == undefined) {
                Filler4 = '';
            }
            if (Filler5 == undefined) {
                Filler5 = '';
            }

            console.log(SchemeCode);

            const insertBankRequest = transaction.request();
            insertBankRequest.output("Id", msSql.BigInt)
                .input("AMCCode", AMCCode)
                .input("AMCName", AMCName)
                .input("SchemeCode", SchemeCode)
                .input("SchemeName", SchemeName)
                .input("SIPTransactionMode", SIPTransactionMode)
                .input("SIPFrequency", SIPFrequency)
                .input("SIPDates", SIPDates)
                .input("SIPMinimumGap", SIPMinimumGap)
                .input("SIPMaximumGap", SIPMaximumGap)
                .input("SIPInstallmentGap", SIPInstallmentGap)
                .input("SIPStatus", SIPStatus)
                .input("SIPMinimumInstallmentAmount", SIPMinimumInstallmentAmount)
                .input("SIPMaximumInstallmentAmount", SIPMaximumInstallmentAmount)
                .input("SIPMultiplierAmount", SIPMultiplierAmount)
                .input("SIPMinimumInstallmentNumber", SIPMinimumInstallmentNumber)
                .input("SIPMaximumInstallmentNumber", SIPMaximumInstallmentNumber)
                .input("ISIN", ISIN)
                .input("SchemeType", SchemeType)
                .input("PauseFlag", PauseFlag)
                .input("PauseMinimumInstallment", PauseMinimumInstallment)
                .input("PauseMaximumInstallment", PauseMaximumInstallment)
                .input("PauseModifictionCount", PauseModifictionCount)
                .input("Filler1", Filler1)
                .input("Filler2", Filler2)
                .input("Filler3", Filler3)
                .input("Filler4", Filler4)
                .input("Filler5", Filler5);
            const result = await insertBankRequest.execute("InsertBSESIPScheme");
            await transaction.commit();
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

exports.UploadSWPSchemeExcel = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    const workBook = xlsx.read(req.files.documentFile.data);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        for (const row of jsonData) {
            await transaction.begin();

            let AMCCode = row['AMC CODE'];
            let AMCName = row['AMC NAME'];
            let BSESchemeCode = row['BSE SCHEME CODE'];
            let SchemeName = row['SCHEME NAME'];
            let ISIN = row['SCHEME ISIN'];;
            let SchemeType = row['SCHEME TYPE'];
            let ASWPTransactionMode = row['ASWP TRANSACTION MODE'];;
            let ASWPMinimumInstallmentAmount = row['ASWP MINIMUM INSTALLMENT AMOUNT'];
            let ASWPMaximumInstallmentAmount = row['ASWP MAXIMUM INSTALLMENT AMOUNT'];
            let ASWPMultiplierAmount = row['ASWP MULTIPLIER AMOUNT'];
            let ASWPMinimumInstallmentUnits = row['ASWP MINIMUM INSTALLMENT UNITS'];
            let ASWPMaximumInstallmentUNits = row['ASWP MAXIMUM INSTALLMENT UNITS'];
            let ASWPMultiplierUnits = row['ASWP MULTIPLIER UNITS'];
            let ASWPMinimumInstallmentNumber = row['ASWP MINIMUM INSTALLMENT NUMBERS'];
            let ASWPMaximumInstallmentNumber = row['ASWP MAXIMUM INSTALLMENT NUMBERS'];
            let ASWPFrequency = row['ASWP FREQUENCY'];
            let ASWPDates = row['ASWP DATES'];
            let ASWPMinimumGap = row['ASWP MINIMUM GAP'];
            let ASWPMaximumGap = row['ASWP MAXIMUM GAP'];
            let ASWPInstallmentGap = row['ASWP INSTALLMENT GAP'];
            let ASWPStatus = row['ASWP STATUS'];

            if (AMCCode == undefined) {
                AMCCode = '';
            }
            if (AMCName == undefined) {
                AMCName = '';
            }
            if (BSESchemeCode == undefined) {
                BSESchemeCode = '';
            }
            if (SchemeName == undefined) {
                SchemeName = '';
            }
            if (ISIN == undefined) {
                ISIN = '';
            }
            if (SchemeType == undefined) {
                SchemeType = '';
            }
            if (ASWPTransactionMode == undefined) {
                ASWPTransactionMode = '';
            }
            if (ASWPMinimumInstallmentAmount == undefined) {
                ASWPMinimumInstallmentAmount = '';
            }
            if (ASWPMaximumInstallmentAmount == undefined) {
                ASWPMaximumInstallmentAmount = '';
            }
            if (ASWPMultiplierAmount == undefined) {
                ASWPMultiplierAmount = '';
            }
            if (ASWPMinimumInstallmentUnits == undefined) {
                ASWPMinimumInstallmentUnits = '';
            }
            if (ASWPMaximumInstallmentUNits == undefined) {
                ASWPMaximumInstallmentUNits = '';
            }
            if (ASWPMultiplierUnits == undefined) {
                ASWPMultiplierUnits = '';
            }
            if (ASWPMinimumInstallmentNumber == undefined) {
                ASWPMinimumInstallmentNumber = '';
            }
            if (ASWPMaximumInstallmentNumber == undefined) {
                ASWPMaximumInstallmentNumber = '';
            }
            if (ASWPFrequency == undefined) {
                ASWPFrequency = '';
            }
            if (ASWPDates == undefined) {
                ASWPDates = '';
            }
            if (ASWPMinimumGap == undefined) {
                ASWPMinimumGap = 0;
            }
            if (ASWPMaximumGap == undefined) {
                ASWPMaximumGap = 0;
            }
            if (ASWPInstallmentGap == undefined) {
                ASWPInstallmentGap = 0;
            }
            if (ASWPStatus == undefined) {
                ASWPStatus = 0;
            }

            console.log(BSESchemeCode);

            const insertBankRequest = transaction.request();
            insertBankRequest.output("Id", msSql.BigInt)
                .input("AMCCode", AMCCode)
                .input("AMCName", AMCName)
                .input("BSESchemeCode", BSESchemeCode)
                .input("SchemeName", SchemeName)
                .input("ISIN", ISIN)
                .input("SchemeType", SchemeType)
                .input("ASWPTransactionMode", ASWPTransactionMode)
                .input("ASWPMinimumInstallmentAmount", ASWPMinimumInstallmentAmount)
                .input("ASWPMaximumInstallmentAmount", ASWPMaximumInstallmentAmount)
                .input("ASWPMultiplierAmount", ASWPMultiplierAmount)
                .input("ASWPMinimumInstallmentUnits", ASWPMinimumInstallmentUnits)
                .input("ASWPMaximumInstallmentUNits", ASWPMaximumInstallmentUNits)
                .input("ASWPMultiplierUnits", ASWPMultiplierUnits)
                .input("ASWPMinimumInstallmentNumber", ASWPMinimumInstallmentNumber)
                .input("ASWPMaximumInstallmentNumber", ASWPMaximumInstallmentNumber)
                .input("ASWPFrequency", ASWPFrequency)
                .input("ASWPDates", ASWPDates)
                .input("ASWPMinimumGap", ASWPMinimumGap)
                .input("ASWPMaximumGap", ASWPMaximumGap)
                .input("ASWPInstallmentGap", ASWPInstallmentGap)
                .input("ASWPStatus", ASWPStatus);
            const result = await insertBankRequest.execute("InsertBSESWPScheme");
            await transaction.commit();
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

exports.UploadSTPSchemeExcel = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    const workBook = xlsx.read(req.files.documentFile.data);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        for (const row of jsonData) {
            await transaction.begin();

            let AMCCode = row['AMC CODE'];
            let AMCName = row['AMC NAME'];
            let BSESchemeCode = row['BSE SCHEME CODE'];
            let SchemeName = row['SCHEME NAME'];
            let ISIN = row['SCHEME ISIN'];;
            let SchemeType = row['SCHEME TYPE'];
            let ASTPTransactionMode = row['ASTP TRANSACTION MODE'];;
            let ASTPInMinimumInstallmentAmount = row['ASTP IN MINIMUM INSTALLMENT AMOUNT'];
            let ASTPInMaximumInstallmentAmount = row['ASTP IN MAXIMUM INSTALLMENT AMOUNT'];
            let ASTPInMultiplierAmount = row['ASTP IN MULTIPLIER AMOUNT'];
            let ASTPOutMinimumInstallmentAmount = row['ASTP OUT MINIMUM INSTALLMENT AMOUNT'];
            let ASTPOutMaximumInstallmentAmount = row['ASTP OUT MAXIMUM INSTALLMENT AMOUNT'];
            let ASTPOutMultiplierAmount = row['ASTP OUT MULTIPLIER AMOUNT'];
            let ASTPMinimumInstallmentUnits = row['ASTP MINIMUM INSTALLMENT UNITS'];
            let ASTPMaximumInstallmentUnits = row['ASTP MAXIMUM INSTALLMENT UNITS'];
            let ASTPMultiplierUnits = row['ASTP MULTIPLIER UNITS'];
            let ASTPMinimumInstallmentNumber = row['ASTP MINIMUM INSTALLMENT NUMBERS'];
            let ASTPMaximumInstallmentNumber = row['ASTP MAXIMUM INSTALLMENT NUMBERS'];
            let ASTPRegIn = row['ASTP Reg IN'];
            let ASTPRegOut = row['ASTP Reg OUT'];
            let ASTPFrequency = row['ASTP FREQUENCY'];
            let ASTPDates = row['ASTP DATES'];
            let ASTPMinimumGap = row['ASTP MINIMUM GAP'];
            let ASTPMaximumGap = row['ASTP MAXIMUM GAP'];
            let ASTPInstallmentGap = row['ASTP INSTALLMENT GAP'];
            let ASTPStatus = row['ASTP STATUS'];


            if (AMCCode == undefined) {
                AMCCode = '';
            }
            if (AMCName == undefined) {
                AMCName = '';
            }
            if (BSESchemeCode == undefined) {
                BSESchemeCode = '';
            }
            if (SchemeName == undefined) {
                SchemeName = '';
            }
            if (ISIN == undefined) {
                ISIN = '';
            }
            if (SchemeType == undefined) {
                SchemeType = '';
            }
            if (ASTPTransactionMode == undefined) {
                ASTPTransactionMode = '';
            }
            if (ASTPInMinimumInstallmentAmount == undefined) {
                ASTPInMinimumInstallmentAmount = '';
            }
            if (ASTPInMaximumInstallmentAmount == undefined) {
                ASTPInMaximumInstallmentAmount = '';
            }
            if (ASTPInMultiplierAmount == undefined) {
                ASTPInMultiplierAmount = '';
            }
            if (ASTPOutMinimumInstallmentAmount == undefined) {
                ASTPOutMinimumInstallmentAmount = '';
            }
            if (ASTPOutMaximumInstallmentAmount == undefined) {
                ASTPOutMaximumInstallmentAmount = '';
            }
            if (ASTPOutMultiplierAmount == undefined) {
                ASTPOutMultiplierAmount = '';
            }
            if (ASTPMinimumInstallmentNumber == undefined) {
                ASTPMinimumInstallmentNumber = '';
            }
            if (ASTPMaximumInstallmentNumber == undefined) {
                ASTPMaximumInstallmentNumber = '';
            }
            if (ASTPRegIn == undefined) {
                ASTPRegIn = '';
            }
            if (ASTPRegOut == undefined) {
                ASTPRegOut = '';
            }
            if (ASTPFrequency == undefined) {
                ASTPFrequency = '';
            }
            if (ASTPDates == undefined) {
                ASTPDates = '';
            }
            if (ASTPMinimumGap == undefined) {
                ASTPMinimumGap = 0;
            }
            if (ASTPMaximumGap == undefined) {
                ASTPMaximumGap = 0;
            }
            if (ASTPInstallmentGap == undefined) {
                ASTPInstallmentGap = 0;
            }
            if (ASTPStatus == undefined) {
                ASTPStatus = '';
            }

            console.log(BSESchemeCode);

            const insertBankRequest = transaction.request();
            insertBankRequest.output("Id", msSql.BigInt)
                .input("AMCCode", AMCCode)
                .input("AMCName", AMCName)
                .input("BSESchemeCode", BSESchemeCode)
                .input("SchemeName", SchemeName)
                .input("ISIN", ISIN)
                .input("SchemeType", SchemeType)
                .input("ASTPTransactionMode", ASTPTransactionMode)
                .input("ASTPInMinimumInstallmentAmount", ASTPInMinimumInstallmentAmount)
                .input("ASTPInMaximumInstallmentAmount", ASTPInMaximumInstallmentAmount)
                .input("ASTPInMultiplierAmount", ASTPInMultiplierAmount)
                .input("ASTPOutMinimumInstallmentAmount", ASTPOutMinimumInstallmentAmount)
                .input("ASTPOutMaximumInstallmentAmount", ASTPOutMaximumInstallmentAmount)
                .input("ASTPOutMultiplierAmount", ASTPOutMultiplierAmount)
                .input("ASTPMinimumInstallmentUnits", ASTPMinimumInstallmentUnits)
                .input("ASTPMaximumInstallmentUnits", ASTPMaximumInstallmentUnits)
                .input("ASTPMultiplierUnits", ASTPMultiplierUnits)
                .input("ASTPMinimumInstallmentNumber", ASTPMinimumInstallmentNumber)
                .input("ASTPMaximumInstallmentNumber", ASTPMaximumInstallmentNumber)
                .input("ASTPRegIn", ASTPRegIn)
                .input("ASTPRegOut", ASTPRegOut)
                .input("ASTPFrequency", ASTPFrequency)
                .input("ASTPDates", ASTPDates)
                .input("ASTPMinimumGap", ASTPMinimumGap)
                .input("ASTPMaximumGap", ASTPMaximumGap)
                .input("ASTPInstallmentGap", ASTPInstallmentGap)
                .input("ASTPStatus", ASTPStatus);
            const result = await insertBankRequest.execute("InsertBSESTPScheme");
            await transaction.commit();
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

exports.UploadHolidayExcel = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    const workBook = xlsx.read(req.files.documentFile.data);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        for (const row of jsonData) {
            // console.log(row);

            let SrNO = row['Sr.NO.'];
            let Holidays = row['Holidays'];
            let Date = null;
            let Day = row['Day'];


            if (SrNO == undefined) {
                SrNO = 0;
            }
            if (Holidays == undefined) {
                Holidays = '';
            }
            if (row['Date'] != null && row['Date'] != undefined) {
                Date = date.format(CommonFunction.ExcelDateToJSDate(row['Date']), 'YYYY-MM-DD');
            }
            if (Day == undefined) {
                Day = '';
            }

            console.log(Holidays);

            await transaction.begin();

            const insertBankRequest = transaction.request();
            insertBankRequest.input("HolidayDate", Date)
                .input("Name", Holidays)
                .input("Mode", '')
                .input("BSESchemeId", 0);
            const result = await insertBankRequest.execute("InsertBSEHoliday");

            await transaction.commit();
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

// function timeToFractionalHours(timeString) {
//     // Ensure timeString is a string
//     if (typeof timeString !== 'string') {
//         throw new Error('timeString must be a string');
//     }

//     // Split the time string into hours, minutes, and seconds
//     const timeComponents = timeString.split(':');
//     if (timeComponents.length !== 3) {
//         throw new Error('Invalid time format');
//     }

//     const hours = parseInt(timeComponents[0], 10);
//     const minutes = parseInt(timeComponents[1], 10);
//     const seconds = parseInt(timeComponents[2], 10);

//     // Calculate the fractional hours
//     const fractionalHours = hours + (minutes / 60) + (seconds / 3600);

//     return fractionalHours;
// }

// function formatTimeForSQL(timeString) {
//     const [hours, minutes, seconds] = timeString.split(':').map(Number);
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
// }

function convertFractionalTimeToHHMMSS(PurchaseCutoffTime) {
    // Calculate total seconds in a day
    const totalSecondsInDay = PurchaseCutoffTime * 24 * 60 * 60;

    // Calculate hours, minutes, seconds
    const hours = Math.floor(totalSecondsInDay / 3600);
    const minutes = Math.floor((totalSecondsInDay % 3600) / 60);
    const seconds = Math.floor(totalSecondsInDay % 60);

    // Format hours, minutes, seconds to HH:mm:ss
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return formattedTime;
}