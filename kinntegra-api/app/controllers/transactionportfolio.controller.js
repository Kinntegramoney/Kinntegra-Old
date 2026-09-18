const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");

exports.SaveTransactionPortfolio = async (req, res) => {
    var { Id, WefDate, TransactionPortfolioTypeId, RationalForTrade, TransactionPortfolioSchemes } = req.body;

    var TransactionPortfolioSchemesData = JSON.parse(TransactionPortfolioSchemes);

    var errorMessage = "Error while saving transaction portfolio...";

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        const deleteRequest = transaction.request();
        deleteRequest.input("WefDate", WefDate)
            .input("TransactionPortfolioTypeId", cryptoEngine.ParamDecrypt(TransactionPortfolioTypeId, true));
        const deleteResult = await deleteRequest.execute("DeleteTransactionPortfolioByWefDate");

        const request = transaction.request();
        request.output("Id", msSql.BigInt)
            .input("WefDate", WefDate)
            .input("TransactionPortfolioTypeId", cryptoEngine.ParamDecrypt(TransactionPortfolioTypeId, true))
            .input("RationalForTrade", RationalForTrade)

        const result = await request.execute("InsertTransactionPortfolio");
        Id = cryptoEngine.ParamEncrypt(result.output.Id, true);

        for (let i = 0; i < TransactionPortfolioSchemesData.length; i++) {
            var item = TransactionPortfolioSchemesData[i];

            const schemeRequest = transaction.request();
            schemeRequest.input("TransactionPortfolioId", cryptoEngine.ParamDecrypt(Id, true))
                .input("BSESchemeId", cryptoEngine.ParamDecrypt(item.BSESchemeId, true))
                .input("AllocationType", item.AllocationType)
                .input("ResidentPercentage", item.ResidentPercentage)
                .input("NRIPercentage", item.NRIPercentage)
                .input("IsResident", item.IsResident)
                .input("IsNRI", item.IsNRI)
                .input("SWPPriority", item.SWPPriority)
                .input("SWPMonths", item.SWPMonths)
                .input("SWPResidentPercentage", item.SWPResidentPercentage)
                .input("SWPNRIPercentage", item.SWPNRIPercentage)
                .input("LumpsumPriority", item.LumpsumPriority);
            const schemeResult = await schemeRequest.execute("InsertTransactionPortfolioSchemes");
        }

        await transaction.commit();

        res.status(200).send({ Status: true, Message: "", Data: { Id: Id } });
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

        res.status(500).send(errorMessage);
    }
};

exports.SaveTransactionPortfolioWealthEquityDebt = async (req, res) => {

    var { TransactionPortfolioId, WefDate, EquityAllocationType, DebtAllocationType, TransactionPortfolioTypeId, RationalForTrade, TransactionPortfolioWealthEquityDetails, TransactionPortfolioWealthDebtDetails } = req.body;


    if (EquityAllocationType == 'Equity') {
        var TransactionPortfolioWealthEquityData = JSON.parse(TransactionPortfolioWealthEquityDetails);
    }
    else if (DebtAllocationType == 'Debt') {
        var TransactionPortfolioWealthDebtData = JSON.parse(TransactionPortfolioWealthDebtDetails);
    }


    var errorMessage = "Error while saving trasaction portfolio...";

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(TransactionPortfolioId, true) == 0) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("WefDate", WefDate)
                .input("TransactionPortfolioTypeId", cryptoEngine.ParamDecrypt(TransactionPortfolioTypeId, true))
                .input("RationalForTrade", RationalForTrade)

            const result = await request.execute("InsertTransactionPortfolio");
            TransactionPortfolioId = cryptoEngine.ParamEncrypt(result.output.Id, true);
        }

        const transactionPortfolioSchemesDeleteRequest = transaction.request();
        transactionPortfolioSchemesDeleteRequest.input("TransactionPortfolioId", cryptoEngine.ParamDecrypt(TransactionPortfolioId, true));
        const TransactionPortfolioSchemesDeleteResult = await transactionPortfolioSchemesDeleteRequest.execute("DeleteTransactionPortfolioSchemes");

        if (EquityAllocationType == 'Equity') {
            for (let i = 0; i < TransactionPortfolioWealthEquityData.length; i++) {
                const transactionPortfolioSchemesEquityDetailsRequest = transaction.request();
                transactionPortfolioSchemesEquityDetailsRequest.input("TransactionPortfolioId", cryptoEngine.ParamDecrypt(TransactionPortfolioId, true))
                    .input("BSESchemeId", cryptoEngine.ParamDecrypt(TransactionPortfolioWealthEquityData[i].BSESchemeId, true))
                    .input("AllocationType", EquityAllocationType)
                    .input("ResidentPercentage", TransactionPortfolioWealthEquityData[i].ResidentPercentage)
                    .input("NRIPercentage", TransactionPortfolioWealthEquityData[i].NRIPercentage)
                    .input("IsResident", true)
                    .input("IsNRI", true)
                    .input("SWPPriority", TransactionPortfolioWealthEquityData[i].SWPPriority)
                    .input("SWPMonths", TransactionPortfolioWealthEquityData[i].SWPMonths)
                    .input("SWPResidentPercentage", TransactionPortfolioWealthEquityData[i].SWPResidentPercentage)
                    .input("SWPNRIPercentage", TransactionPortfolioWealthEquityData[i].SWPNRIPercentage)
                    .input("LumpsumPriority", TransactionPortfolioWealthEquityData[i].LumpsumPriority);
                const TransactionPortfolioSchemesEquityDetailsResult = await transactionPortfolioSchemesEquityDetailsRequest.execute("InsertTransactionPortfolioSchemes");
            }
        }
        else if (DebtAllocationType == 'Debt') {
            for (let i = 0; i < TransactionPortfolioWealthDebtData.length; i++) {
                const transactionPortfolioSchemesDebtDetailsRequest = transaction.request();
                transactionPortfolioSchemesDebtDetailsRequest.input("TransactionPortfolioId", cryptoEngine.ParamDecrypt(TransactionPortfolioId, true))
                    .input("BSESchemeId", cryptoEngine.ParamDecrypt(TransactionPortfolioWealthDebtData[i].BSESchemeId, true))
                    .input("AllocationType", DebtAllocationType)
                    .input("ResidentPercentage", TransactionPortfolioWealthDebtData[i].ResidentPercentage)
                    .input("NRIPercentage", TransactionPortfolioWealthDebtData[i].NRIPercentage)
                    .input("IsResident", true)
                    .input("IsNRI", true)
                    .input("SWPPriority", TransactionPortfolioWealthDebtData[i].SWPPriority)
                    .input("SWPMonths", TransactionPortfolioWealthDebtData[i].SWPMonths)
                    .input("SWPResidentPercentage", TransactionPortfolioWealthDebtData[i].SWPResidentPercentage)
                    .input("SWPNRIPercentage", TransactionPortfolioWealthDebtData[i].SWPNRIPercentage)
                    .input("LumpsumPriority", TransactionPortfolioWealthDebtData[i].LumpsumPriority);
                const TransactionPortfolioSchemesDebtDetailsResult = await transactionPortfolioSchemesDebtDetailsRequest.execute("InsertTransactionPortfolioSchemes");
            }

        }


        await transaction.commit();

        res.status(200).send({ Status: true, Message: "", Data: { Id: TransactionPortfolioId } });

    } catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) {
            errorMessage = "Duplicate record. Record already exists.";
        }

        res.status(500).send(errorMessage);
    }
};

exports.SaveTransactionPortfolioShortTerm = async (req, res) => {

    var { TransactionPortfolioId, WefDate, ShortTermAllocationType, TransactionPortfolioTypeId, RationalForTrade, TransactionPortfolioShortTermDetails } = req.body;


    let TransactionPortfolioShortTermData = JSON.parse(TransactionPortfolioShortTermDetails);

    var errorMessage = "Error while saving trasaction portfolio...";

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(TransactionPortfolioId, true) == 0) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("WefDate", WefDate)
                .input("TransactionPortfolioTypeId", cryptoEngine.ParamDecrypt(TransactionPortfolioTypeId, true))
                .input("RationalForTrade", RationalForTrade)

            const result = await request.execute("InsertTransactionPortfolio");
            TransactionPortfolioId = cryptoEngine.ParamEncrypt(result.output.Id, true);
        }

        const transactionPortfolioSchemesDeleteRequest = transaction.request();
        transactionPortfolioSchemesDeleteRequest.input("TransactionPortfolioId", cryptoEngine.ParamDecrypt(TransactionPortfolioId, true));
        const TransactionPortfolioSchemesDeleteResult = await transactionPortfolioSchemesDeleteRequest.execute("DeleteTransactionPortfolioSchemes");


        for (let i = 0; i < TransactionPortfolioShortTermData.length; i++) {
            const transactionPortfolioSchemesShortTermDetailsRequest = transaction.request();
            transactionPortfolioSchemesShortTermDetailsRequest.input("TransactionPortfolioId", cryptoEngine.ParamDecrypt(TransactionPortfolioId, true))
                .input("BSESchemeId", cryptoEngine.ParamDecrypt(TransactionPortfolioShortTermData[i].BSESchemeId, true))
                .input("AllocationType", ShortTermAllocationType)
                .input("ResidentPercentage", TransactionPortfolioShortTermData[i].ResidentPercentage)
                .input("NRIPercentage", TransactionPortfolioShortTermData[i].NRIPercentage)
                .input("IsResident", true)
                .input("IsNRI", true)
                .input("SWPPriority", TransactionPortfolioShortTermData[i].SWPPriority)
                .input("SWPMonths", TransactionPortfolioShortTermData[i].SWPMonths)
                .input("SWPResidentPercentage", TransactionPortfolioShortTermData[i].SWPResidentPercentage)
                .input("SWPNRIPercentage", TransactionPortfolioShortTermData[i].SWPNRIPercentage)
                .input("LumpsumPriority", TransactionPortfolioShortTermData[i].LumpsumPriority);
            const TransactionPortfolioSchemesShortTermDetailsResult = await transactionPortfolioSchemesShortTermDetailsRequest.execute("InsertTransactionPortfolioSchemes");
        }



        await transaction.commit();

        res.status(200).send({ Status: true, Message: "", Data: { Id: TransactionPortfolioId } });

    } catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) {
            errorMessage = "Duplicate record. Record already exists.";
        }

        res.status(500).send(errorMessage);
    }
};

exports.SaveTransactionPortfolioTax = async (req, res) => {

    var { TransactionPortfolioId, WefDate, TaxAllocationType, TransactionPortfolioTypeId, RationalForTrade, TransactionPortfolioTaxDetails } = req.body;


    let TransactionPortfolioTaxData = JSON.parse(TransactionPortfolioTaxDetails);

    var errorMessage = "Error while saving trasaction portfolio...";

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(TransactionPortfolioId, true) == 0) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("WefDate", WefDate)
                .input("TransactionPortfolioTypeId", cryptoEngine.ParamDecrypt(TransactionPortfolioTypeId, true))
                .input("RationalForTrade", RationalForTrade)

            const result = await request.execute("InsertTransactionPortfolio");
            TransactionPortfolioId = cryptoEngine.ParamEncrypt(result.output.Id, true);
        }

        const transactionPortfolioSchemesDeleteRequest = transaction.request();
        transactionPortfolioSchemesDeleteRequest.input("TransactionPortfolioId", cryptoEngine.ParamDecrypt(TransactionPortfolioId, true));
        const TransactionPortfolioSchemesDeleteResult = await transactionPortfolioSchemesDeleteRequest.execute("DeleteTransactionPortfolioSchemes");


        for (let i = 0; i < TransactionPortfolioTaxData.length; i++) {
            const transactionPortfolioSchemesTaxDetailsRequest = transaction.request();
            transactionPortfolioSchemesTaxDetailsRequest.input("TransactionPortfolioId", cryptoEngine.ParamDecrypt(TransactionPortfolioId, true))
                .input("BSESchemeId", cryptoEngine.ParamDecrypt(TransactionPortfolioTaxData[i].BSESchemeId, true))
                .input("AllocationType", TaxAllocationType)
                .input("ResidentPercentage", TransactionPortfolioTaxData[i].ResidentPercentage)
                .input("NRIPercentage", TransactionPortfolioTaxData[i].NRIPercentage)
                .input("IsResident", true)
                .input("IsNRI", true)
                .input("SWPPriority", TransactionPortfolioTaxData[i].SWPPriority)
                .input("SWPMonths", TransactionPortfolioTaxData[i].SWPMonths)
                .input("SWPResidentPercentage", TransactionPortfolioTaxData[i].SWPResidentPercentage)
                .input("SWPNRIPercentage", TransactionPortfolioTaxData[i].SWPNRIPercentage)
                .input("LumpsumPriority", TransactionPortfolioTaxData[i].LumpsumPriority);
            const TransactionPortfolioSchemesTaxDetailsResult = await transactionPortfolioSchemesTaxDetailsRequest.execute("InsertTransactionPortfolioSchemes");
        }



        await transaction.commit();

        res.status(200).send({ Status: true, Message: "", Data: { Id: TransactionPortfolioId } });

    } catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) {
            errorMessage = "Duplicate record. Record already exists.";
        }

        res.status(500).send(errorMessage);
    }
};

exports.SaveTransactionPortfolioCommodities = async (req, res) => {

    var { TransactionPortfolioId, WefDate, CommoditiesAllocationType, TransactionPortfolioTypeId, RationalForTrade, TransactionPortfolioCommoditiesDetails } = req.body;


    let TransactionPortfolioCommoditiesData = JSON.parse(TransactionPortfolioCommoditiesDetails);

    var errorMessage = "Error while saving trasaction portfolio...";

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(TransactionPortfolioId, true) == 0) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("WefDate", WefDate)
                .input("TransactionPortfolioTypeId", cryptoEngine.ParamDecrypt(TransactionPortfolioTypeId, true))
                .input("RationalForTrade", RationalForTrade)

            const result = await request.execute("InsertTransactionPortfolio");
            TransactionPortfolioId = cryptoEngine.ParamEncrypt(result.output.Id, true);
        }

        const transactionPortfolioSchemesDeleteRequest = transaction.request();
        transactionPortfolioSchemesDeleteRequest.input("TransactionPortfolioId", cryptoEngine.ParamDecrypt(TransactionPortfolioId, true));
        const TransactionPortfolioSchemesDeleteResult = await transactionPortfolioSchemesDeleteRequest.execute("DeleteTransactionPortfolioSchemes");


        for (let i = 0; i < TransactionPortfolioCommoditiesData.length; i++) {
            const transactionPortfolioSchemesCommoditiesDetailsRequest = transaction.request();
            transactionPortfolioSchemesCommoditiesDetailsRequest.input("TransactionPortfolioId", cryptoEngine.ParamDecrypt(TransactionPortfolioId, true))
                .input("BSESchemeId", cryptoEngine.ParamDecrypt(TransactionPortfolioCommoditiesData[i].BSESchemeId, true))
                .input("AllocationType", CommoditiesAllocationType)
                .input("ResidentPercentage", TransactionPortfolioCommoditiesData[i].ResidentPercentage)
                .input("NRIPercentage", TransactionPortfolioCommoditiesData[i].NRIPercentage)
                .input("IsResident", true)
                .input("IsNRI", true)
                .input("SWPPriority", TransactionPortfolioCommoditiesData[i].SWPPriority)
                .input("SWPMonths", TransactionPortfolioCommoditiesData[i].SWPMonths)
                .input("SWPResidentPercentage", TransactionPortfolioCommoditiesData[i].SWPResidentPercentage)
                .input("SWPNRIPercentage", TransactionPortfolioCommoditiesData[i].SWPNRIPercentage)
                .input("LumpsumPriority", TransactionPortfolioCommoditiesData[i].LumpsumPriority);
            const TransactionPortfolioSchemesCommoditiesDetailsResult = await transactionPortfolioSchemesCommoditiesDetailsRequest.execute("InsertTransactionPortfolioSchemes");
        }

        await transaction.commit();

        res.status(200).send({ Status: true, Message: "", Data: { Id: TransactionPortfolioId } });

    } catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) {
            errorMessage = "Duplicate record. Record already exists.";
        }

        res.status(500).send(errorMessage);
    }
};

exports.SaveTransactionPortfolioOther = async (req, res) => {

    var { TransactionPortfolioId, WefDate, OtherAllocationType, TransactionPortfolioTypeId, RationalForTrade, TransactionPortfolioOtherDetails } = req.body;


    let TransactionPortfolioOtherData = JSON.parse(TransactionPortfolioOtherDetails);

    var errorMessage = "Error while saving trasaction portfolio...";

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(TransactionPortfolioId, true) == 0) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("WefDate", WefDate)
                .input("TransactionPortfolioTypeId", cryptoEngine.ParamDecrypt(TransactionPortfolioTypeId, true))
                .input("RationalForTrade", RationalForTrade)

            const result = await request.execute("InsertTransactionPortfolio");
            TransactionPortfolioId = cryptoEngine.ParamEncrypt(result.output.Id, true);
        }

        const transactionPortfolioSchemesDeleteRequest = transaction.request();
        transactionPortfolioSchemesDeleteRequest.input("TransactionPortfolioId", cryptoEngine.ParamDecrypt(TransactionPortfolioId, true));
        const TransactionPortfolioSchemesDeleteResult = await transactionPortfolioSchemesDeleteRequest.execute("DeleteTransactionPortfolioSchemes");


        for (let i = 0; i < TransactionPortfolioOtherData.length; i++) {
            const transactionPortfolioSchemesOtherDetailsRequest = transaction.request();
            transactionPortfolioSchemesOtherDetailsRequest.input("TransactionPortfolioId", cryptoEngine.ParamDecrypt(TransactionPortfolioId, true))
                .input("BSESchemeId", cryptoEngine.ParamDecrypt(TransactionPortfolioOtherData[i].BSESchemeId, true))
                .input("AllocationType", OtherAllocationType)
                .input("ResidentPercentage", TransactionPortfolioOtherData[i].ResidentPercentage)
                .input("NRIPercentage", TransactionPortfolioOtherData[i].NRIPercentage)
                .input("IsResident", true)
                .input("IsNRI", true)
                .input("SWPPriority", TransactionPortfolioOtherData[i].SWPPriority)
                .input("SWPMonths", TransactionPortfolioOtherData[i].SWPMonths)
                .input("SWPResidentPercentage", TransactionPortfolioOtherData[i].SWPResidentPercentage)
                .input("SWPNRIPercentage", TransactionPortfolioOtherData[i].SWPNRIPercentage)
                .input("LumpsumPriority", TransactionPortfolioOtherData[i].LumpsumPriority);
            const TransactionPortfolioSchemesOtherDetailsResult = await transactionPortfolioSchemesOtherDetailsRequest.execute("InsertTransactionPortfolioSchemes");
        }

        await transaction.commit();

        res.status(200).send({ Status: true, Message: "", Data: { Id: TransactionPortfolioId } });

    } catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) {
            errorMessage = "Duplicate record. Record already exists.";
        }

        res.status(500).send(errorMessage);
    }
};

exports.GetTransactionPortfolios = async (req, res) => {

    var errorMessage = "Error while fetching  transation portfolios data...";
    try {
        var transationPortfoliosData = [];
        var transationPortfolioSchemeDetailsData = [];

        const readTransationPortfoliosRequest = req.app.locals.db.request();

        const transationPortfoliosResult = await readTransationPortfoliosRequest.execute("GetTransactionPortfolios");
        if (transationPortfoliosResult.recordset.length > 0) {
            var transationPortfolioData = transationPortfoliosResult.recordset;

            for (let i = 0; i < transationPortfolioData.length; i++) {
                var item = {
                    Id: cryptoEngine.ParamEncrypt(transationPortfolioData[i].Id, true),
                    WefDate: transationPortfolioData[i].WefDate,
                    TransactionPortfolioTypeId: cryptoEngine.ParamEncrypt(transationPortfolioData[i].TransactionPortfolioTypeId, true),
                    RationalForTrade: transationPortfolioData[i].RationalForTrade,
                    TransactionPortfolioType: transationPortfolioData[i].Name
                };
                transationPortfoliosData.push(item);
            }
        }

        const readTransationPortfolioSchemesDetailsRequest = req.app.locals.db.request();
        const transationPortfolioSchemeDetailsResult = await readTransationPortfolioSchemesDetailsRequest.execute("GetTransactionPortfolioSchemes");
        if (transationPortfolioSchemeDetailsResult.recordset.length > 0) {
            var transationPortfolioSchemeData = transationPortfolioSchemeDetailsResult.recordset;

            transationPortfolioSchemeDetailsData = transationPortfolioSchemeData.map(x => {
                const Id = cryptoEngine.ParamEncrypt(x.Id, true);
                const TransactionPortfolioId = cryptoEngine.ParamEncrypt(x.TransactionPortfolioId, true);
                const BSESchemeId = cryptoEngine.ParamEncrypt(x.BSESchemeId, true);

                return { ...x, Id, TransactionPortfolioId, BSESchemeId }
            });
        }

        var data = {
            TransationPortfolioDetails: transationPortfoliosData,
            TransationPortfolioSchemeDetails: transationPortfolioSchemeDetailsData
        };

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetTransactionPortfolioDataByDate = async (req, res) => {

    var { WefDate } = req.body;
    var errorMessage = "Error while fetching portfolios id...";

    try {
        var data;
        var transationPortfoliosData = [];

        const readTransationPortfoliosDataRequest = req.app.locals.db.request();
        readTransationPortfoliosDataRequest.input("WefDate", WefDate)
        const transationPortfoliosDataResult = await readTransationPortfoliosDataRequest.execute("GetTransactionPortfolioDataByDate");
        if (transationPortfoliosDataResult.recordset.length > 0) {
            var transationPortfolioData = transationPortfoliosDataResult.recordset;

            for (let i = 0; i < transationPortfolioData.length; i++) {
                var item = {
                    Id: cryptoEngine.ParamEncrypt(transationPortfolioData[i].Id, true),
                    BSESchemeId: cryptoEngine.ParamEncrypt(transationPortfolioData[i].BSESchemeId, true),
                    TransactionPortfolioSchemeId: cryptoEngine.ParamEncrypt(transationPortfolioData[i].TransactionPortfolioSchemeId, true),
                    WefDate: transationPortfolioData[i].WefDate,
                    TransactionPortfolioTypeId: cryptoEngine.ParamEncrypt(transationPortfolioData[i].TransactionPortfolioTypeId, true),
                    RationalForTrade: transationPortfolioData[i].RationalForTrade,
                    TransactionPortfolioType: transationPortfolioData[i].Name,
                    AllocationType: transationPortfolioData[i].AllocationType,
                    ResidentPercentage: transationPortfolioData[i].ResidentPercentage,
                    NRIPercentage: transationPortfolioData[i].NRIPercentage,
                    IsResident: transationPortfolioData[i].IsResident,
                    IsNRI: transationPortfolioData[i].IsNRI,
                    SWPPriority: transationPortfolioData[i].SWPPriority,
                    SWPMonths: transationPortfolioData[i].SWPMonths,
                    SWPResidentPercentage: transationPortfolioData[i].SWPResidentPercentage,
                    SWPNRIPercentage: transationPortfolioData[i].SWPNRIPercentage,
                    SchemeName: transationPortfolioData[i].SchemeName,
                };
                transationPortfoliosData.push(item);
            }

            data = {
                TransationPortfolioDetails: transationPortfoliosData,

            };
        }

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetTransationPortfolioSchemesCurrentAll = async (req, res) => {
    var data;

    const readTransationPortfoliosDataRequest = req.app.locals.db.request();
    const transationPortfoliosDataResult = await readTransationPortfoliosDataRequest.execute("GetTransationPortfolioSchemesCurrentAll");
    if (transationPortfoliosDataResult.recordset.length > 0) {
        data = transationPortfoliosDataResult.recordset.map(item => {
            const Id = cryptoEngine.ParamEncrypt(item.Id, true);
            const TransactionPortfolioTypeId = cryptoEngine.ParamEncrypt(item.TransactionPortfolioTypeId, true);
            const BSESchemeId = cryptoEngine.ParamEncrypt(item.BSESchemeId, true);

            return { ...item, Id, TransactionPortfolioTypeId, BSESchemeId };
        });
    }

    return data;
};

exports.GetTransactionPortfolioByTypeDate = async (req, res) => {
    const PortfolioTypeId = req.params.PortfolioTypeId;
    const WefDate = req.params.WefDate;

    var errorMessage = "Error while fetching portfolio data...";

    try {
        var data;

        const request = req.app.locals.db.request();
        request.input("Date", WefDate)
            .input("TransactionPortfolioTypeId", cryptoEngine.ParamDecrypt(PortfolioTypeId, true));
        const result = await request.execute("GetTransactionPortfolioByDate");

        if (result.recordset.length > 0) {
            var dataList = result.recordset;

            var schemeData = [];

            for (let i = 0; i < dataList.length; i++) {
                var item = dataList[i];

                schemeData.push({
                    BSESchemeId: cryptoEngine.ParamEncrypt(item.BSESchemeId, true),
                    SchemeName: item.SchemeName,
                    AllocationType: item.AllocationType,
                    ResidentPercentage: item.ResidentPercentage,
                    NRIPercentage: item.NRIPercentage,
                    IsResident: item.IsResident,
                    IsNRI: item.IsNRI,
                    SWPPriority: item.SWPPriority,
                    SWPMonths: item.SWPMonths,
                    SWPResidentPercentage: item.SWPResidentPercentage,
                    SWPNRIPercentage: item.SWPNRIPercentage,
                    LumpsumPriority: item.LumpsumPriority,
                });
            }

            data = {
                Id: cryptoEngine.ParamEncrypt(dataList[0].Id, true),
                WefDate: dataList[0].WefDate,
                TransactionPortfolioTypeId: cryptoEngine.ParamEncrypt(dataList[0].TransactionPortfolioTypeId, true),
                RationalForTrade: dataList[0].RationalForTrade,
                TransactionPortfolioSchemes: schemeData
            };
        }

        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetTransactionPortfolioDatesByType = async (req, res) => {
    const PortfolioTypeId = req.params.PortfolioTypeId;

    var errorMessage = "Error while fetching portfolio data...";

    try {
        var data = [];

        const request = req.app.locals.db.request();
        request.input("TransactionPortfolioTypeId", cryptoEngine.ParamDecrypt(PortfolioTypeId, true));
        const result = await request.execute("GetTransactionPortfolioDatesByType");

        if (result.recordset.length > 0) {
            data = result.recordset;
        }

        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};