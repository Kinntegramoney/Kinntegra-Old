const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");

exports.SaveComprehensivePlanIncome = async (req, res) => {
    var { ClientId, ClientIncomeDetails } = req.body;
    let ClientIncomeData = JSON.parse(ClientIncomeDetails);
    var errorMessage = "Error while saving comprehensive plan income data...";

    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const clientIncomeDetailsDeleteRequest = transaction.request();
        clientIncomeDetailsDeleteRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const ClientIncomeDetailsDeleteResult = await clientIncomeDetailsDeleteRequest.execute("DeleteClientCPIncome");

        for (let i = 0; i < ClientIncomeData.length; i++) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                .input("ClientFamilyId", cryptoEngine.ParamDecrypt(ClientIncomeData[i].ClientFamilyId, true))
                .input("IncomeCategory", ClientIncomeData[i].IncomeCategory)
                .input("BuinessName", ClientIncomeData[i].BuinessName)
                .input("MonthlyNetIncome", ClientIncomeData[i].MonthlyNetIncome)
                .input("YearlyNetIncome", ClientIncomeData[i].YearlyNetIncome)
                .input("IncrementMonth", ClientIncomeData[i].IncrementMonth)
                .input("AverageGrowthRate", ClientIncomeData[i].AverageGrowthRate)
                .input("RetirementAge", ClientIncomeData[i].RetirementAge)
                .input("RetirementYear", ClientIncomeData[i].RetirementYear)
            const result = await request.execute("InsertClientCPIncome");
        }

        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'Comprehensive Plan Income',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);
        res.status(200).send({ Status: true, Message: "Comprehensive Plan Income Saved Successfully.", Data: {} });
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        res.status(500).send(errorMessage);
    }
};

exports.SaveComprehensivePlanOtherIncome = async (req, res) => {
    var { ClientId, ClientOtherIncomeDetails } = req.body;
    let ClientIncomeData = JSON.parse(ClientOtherIncomeDetails);
    var errorMessage = "Error while saving comprehensive plan  other income data...";

    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const clientOtherIncomeDetailsDeleteRequest = transaction.request();
        clientOtherIncomeDetailsDeleteRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const ClientOtherIncomeDetailsDeleteResult = await clientOtherIncomeDetailsDeleteRequest.execute("DeleteClientCPOtherIncome");


        for (let i = 0; i < ClientIncomeData.length; i++) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                .input("ClientFamilyId", cryptoEngine.ParamDecrypt(ClientIncomeData[i].ClientFamilyId, true))
                .input("IncomeCategory", ClientIncomeData[i].IncomeCategory)
                .input("Description", ClientIncomeData[i].Description)
                .input("Amount", ClientIncomeData[i].Amount)
                .input("Frequency", ClientIncomeData[i].Frequency)
                .input("FromDate", ClientIncomeData[i].FromDate)
                .input("ToDate", ClientIncomeData[i].ToDate)
                .input("AsOnDate", ClientIncomeData[i].AsOnDate)
            const result = await request.execute("InsertClientCPOtherIncome");
        }

        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'Comprehensive Plan Income',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);
        res.status(200).send({ Status: true, Message: "Comprehensive Plan Other Income Saved Successfully.", Data: {} });
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        res.status(500).send(errorMessage);
    }
};

exports.SaveComprehensivePlanFixedAssetIncome = async (req, res) => {
    var { ClientId, ClientFixedAssetIncomeDetails } = req.body;
    let ClientIncomeData = JSON.parse(ClientFixedAssetIncomeDetails);
    var errorMessage = "Error while saving comprehensive plan fixed asset income data...";

    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const clientFixedAssetIncomeDetailsDeleteRequest = transaction.request();
        clientFixedAssetIncomeDetailsDeleteRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const ClientFixedAssetIncomeDetailsDeleteResult = await clientFixedAssetIncomeDetailsDeleteRequest.execute("DeleteClientCPFixedAssetIncome");


        for (let i = 0; i < ClientIncomeData.length; i++) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                .input("ClientFamilyId", cryptoEngine.ParamDecrypt(ClientIncomeData[i].ClientFamilyId, true))
                .input("IncomeCategory", ClientIncomeData[i].IncomeCategory)
                .input("Description", ClientIncomeData[i].Description)
                .input("InvestmentValue", ClientIncomeData[i].InvestmentValue)
                .input("EstimatedMarketValue", ClientIncomeData[i].EstimatedMarketValue)
                .input("RentalIncome", ClientIncomeData[i].RentalIncome)
                .input("PropertyExpense", ClientIncomeData[i].PropertyExpense)
                .input("UptoDate", ClientIncomeData[i].UptoDate)
                .input("PurchaseYear", ClientIncomeData[i].PurchaseYear)
                .input("ROI", ClientIncomeData[i].ROI)
                .input("GrowthPercentage", ClientIncomeData[i].GrowthPercentage)
                .input("Yield", ClientIncomeData[i].Yield)
            const result = await request.execute("InsertClientCPFixedAssetIncome");
        }

        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'Comprehensive Plan Income',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);
        res.status(200).send({ Status: true, Message: "Comprehensive Plan Fixed Asset Income Saved Successfully.", Data: {} });
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        res.status(500).send(errorMessage);
    }
};


exports.SaveComprehensivePlanWealthSustainabilityAsset = async (req, res) => {
    var { ClientId, ClientWealthSustainabilityAssetDetails } = req.body;
    let ClientIncomeData = JSON.parse(ClientWealthSustainabilityAssetDetails);
    var errorMessage = "Error while saving comprehensive plan wealth sustainability asset data...";

    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const clientWealthSustainabilityAssetDetailsDeleteRequest = transaction.request();
        clientWealthSustainabilityAssetDetailsDeleteRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const ClientWealthSustainabilityAssetDetailsDeleteResult = await clientWealthSustainabilityAssetDetailsDeleteRequest.execute("DeleteClientCPWealthSustainabilityAsset");


        for (let i = 0; i < ClientIncomeData.length; i++) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                .input("ClientFamilyId", cryptoEngine.ParamDecrypt(ClientIncomeData[i].ClientFamilyId, true))
                .input("IncomeCategory", ClientIncomeData[i].IncomeCategory)
                .input("Description", ClientIncomeData[i].Description)
                .input("InvestmentValue", ClientIncomeData[i].InvestmentValue)
                .input("Frequency", ClientIncomeData[i].Frequency)
                .input("StartDate", ClientIncomeData[i].StartDate)
                .input("EndDate", ClientIncomeData[i].EndDate)
                .input("MaturityDate", ClientIncomeData[i].MaturityDate)
                .input("MaturityValue", ClientIncomeData[i].MaturityValue)
                .input("BonusPercentage", ClientIncomeData[i].BonusPercentage)
                .input("ROI", ClientIncomeData[i].ROI)
            const result = await request.execute("InsertClientCPWealthSustainabilityAsset");
        }

        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'Comprehensive Plan Income',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);
        res.status(200).send({ Status: true, Message: "Comprehensive Plan Wealth Sustainability Asset Saved Successfully.", Data: {} });
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        res.status(500).send(errorMessage);
    }
};

exports.SaveComprehensivePlanWealthCreationAsset = async (req, res) => {
    var { ClientId, ClientWealthCreationAssetDetails } = req.body;
    let ClientIncomeData = JSON.parse(ClientWealthCreationAssetDetails);
    var errorMessage = "Error while saving comprehensive plan wealth creation asset data...";

    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const clientWealthCreationAssetDetailsDeleteRequest = transaction.request();
        clientWealthCreationAssetDetailsDeleteRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const ClientWealthCreationAssetDetailsDeleteResult = await clientWealthCreationAssetDetailsDeleteRequest.execute("DeleteClientCPWealthCreationAsset");


        for (let i = 0; i < ClientIncomeData.length; i++) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                .input("ClientFamilyId", cryptoEngine.ParamDecrypt(ClientIncomeData[i].ClientFamilyId, true))
                .input("IncomeCategory", ClientIncomeData[i].IncomeCategory)
                .input("AnnualContribution", ClientIncomeData[i].AnnualContribution)
                .input("CurrentValue", ClientIncomeData[i].CurrentValue)
                .input("Description", ClientIncomeData[i].Description)
                .input("MaturityDate", ClientIncomeData[i].MaturityDate)



            const result = await request.execute("InsertClientCPWealthCreationAsset");
        }

        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'Comprehensive Plan Income',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);
        res.status(200).send({ Status: true, Message: "Comprehensive Plan Wealth Creation Asset Saved Successfully.", Data: {} });
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        res.status(500).send(errorMessage);
    }
};


exports.SaveComprehensivePlanHouseHoldExpense = async (req, res) => {
    var { ClientId, ClientHouseHoldExpenseDetails } = req.body;
    let ClientIncomeData = JSON.parse(ClientHouseHoldExpenseDetails);
    var errorMessage = "Error while saving comprehensive plan house hold expense data...";

    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const clientHouseHoldExpenseDetailsDeleteRequest = transaction.request();
        clientHouseHoldExpenseDetailsDeleteRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const ClientHouseHoldExpenseDetailsDeleteResult = await clientHouseHoldExpenseDetailsDeleteRequest.execute("DeleteClientCPHouseHoldExpense");


        for (let i = 0; i < ClientIncomeData.length; i++) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                .input("ExpenseCategory", ClientIncomeData[i].ExpenseCategory)
                .input("AnnualAmount", ClientIncomeData[i].AnnualAmount)
                .input("UpToYear", ClientIncomeData[i].UpToYear)
                .input("Inflation", ClientIncomeData[i].Inflation)
                .input("IsPostRetirement", ClientIncomeData[i].IsPostRetirement)
                .input("PostRetirementPercentage", ClientIncomeData[i].PostRetirementPercentage)



            const result = await request.execute("InsertClientCPHouseholdExpense");
        }

        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'Comprehensive Plan Income',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);
        res.status(200).send({ Status: true, Message: "Comprehensive Plan House Hold Expenses Saved Successfully.", Data: {} });
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        res.status(500).send(errorMessage);
    }
};

exports.SaveComprehensivePlanLifeStyleExpense = async (req, res) => {
    var { ClientId, ClientLifeStyleExpenseDetails } = req.body;
    let ClientIncomeData = JSON.parse(ClientLifeStyleExpenseDetails);
    var errorMessage = "Error while saving comprehensive plan life style expense data...";

    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const clientLifeStyleExpenseDetailsDeleteRequest = transaction.request();
        clientLifeStyleExpenseDetailsDeleteRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const ClientLifeStyleExpenseDetailsDeleteResult = await clientLifeStyleExpenseDetailsDeleteRequest.execute("DeleteClientCPLifeStyleExpense");


        for (let i = 0; i < ClientIncomeData.length; i++) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                .input("ExpenseCategory", ClientIncomeData[i].ExpenseCategory)
                .input("AnnualAmount", ClientIncomeData[i].AnnualAmount)
                .input("UpToYear", ClientIncomeData[i].UpToYear)
                .input("Inflation", ClientIncomeData[i].Inflation)
                .input("IsPostRetirement", ClientIncomeData[i].IsPostRetirement)
                .input("PostRetirementPercentage", ClientIncomeData[i].PostRetirementPercentage)



            const result = await request.execute("InsertClientCPLifeStyleExpense");
        }

        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'Comprehensive Plan Income',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);
        res.status(200).send({ Status: true, Message: "Comprehensive Plan Life Style Expenses Saved Successfully.", Data: {} });
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        res.status(500).send(errorMessage);
    }
};

exports.GetComprehensivePlanOtherIncome = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching other income...";

    try {
        var dataList = [];
        var data = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientCPOtherIncome");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        for (let i = 0; i < dataList.length; i++) {
            var dataItem = dataList[i];

            var otherIncome = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                ClientId: cryptoEngine.ParamEncrypt(dataItem.ClientId, true),
                ClientFamilyId: cryptoEngine.ParamEncrypt(dataItem.ClientFamilyId, true),
                IncomeCategory: dataItem.IncomeCategory,
                Description: dataItem.Description,
                Amount: dataItem.Amount,
                Frequency: dataItem.Frequency,
                FromDate: dataItem.FromDate,
                ToDate: dataItem.ToDate,
                AsOnDate: dataItem.AsOnDate
            };

            data.push(otherIncome);
        }

        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetComprehensivePlanIncome = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching  income...";

    try {
        var dataList = [];
        var data = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientCPIncome");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        for (let i = 0; i < dataList.length; i++) {
            var dataItem = dataList[i];

            var income = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                ClientId: cryptoEngine.ParamEncrypt(dataItem.ClientId, true),
                ClientFamilyId: cryptoEngine.ParamEncrypt(dataItem.ClientFamilyId, true),
                IncomeCategory: dataItem.IncomeCategory,
                BuinessName: dataItem.BuinessName,
                MonthlyNetIncome: dataItem.MonthlyNetIncome,
                YearlyNetIncome: dataItem.YearlyNetIncome,
                IncrementMonth: dataItem.IncrementMonth,
                AverageGrowthRate: dataItem.AverageGrowthRate,
                RetirementAge: dataItem.RetirementAge,
                RetirementYear: dataItem.RetirementYear,
            };

            data.push(income);
        }

        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetComprehensivePlanFixedAssetIncome = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching fixed asset income...";

    try {
        var dataList = [];
        var data = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientCPFixedAssetIncome");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        for (let i = 0; i < dataList.length; i++) {
            var dataItem = dataList[i];

            var otherIncome = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                ClientId: cryptoEngine.ParamEncrypt(dataItem.ClientId, true),
                ClientFamilyId: cryptoEngine.ParamEncrypt(dataItem.ClientFamilyId, true),
                IncomeCategory: dataItem.IncomeCategory,
                Description: dataItem.Description,
                InvestmentValue: dataItem.InvestmentValue,
                EstimatedMarketValue: dataItem.EstimatedMarketValue,
                RentalIncome: dataItem.RentalIncome,
                PropertyExpense: dataItem.PropertyExpense,
                UptoDate: dataItem.UptoDate,
                PurchaseYear: dataItem.PurchaseYear,
                ROI: dataItem.ROI,
                GrowthPercentage: dataItem.GrowthPercentage,
                Yield: dataItem.Yield

            };

            data.push(otherIncome);
        }

        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.SaveComprehensivePlanLiability = async (req, res) => {
    var { ClientId, ClientLiabilityDetails } = req.body;
    let ClientIncomeData = JSON.parse(ClientLiabilityDetails);
    var errorMessage = "Error while saving comprehensive plan liability  data...";

    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const clientLiabilityDetailsDeleteRequest = transaction.request();
        clientLiabilityDetailsDeleteRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const ClientLiabilityDetailsDeleteResult = await clientLiabilityDetailsDeleteRequest.execute("DeleteClientCPLiability");


        for (let i = 0; i < ClientIncomeData.length; i++) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                .input("LiabilityCategory", ClientIncomeData[i].LiabilityCategory)
                .input("Description", ClientIncomeData[i].Description)
                .input("EMI", ClientIncomeData[i].EMI)
                .input("RemainingInstallment", ClientIncomeData[i].RemainingInstallment)
                .input("InterestRate", ClientIncomeData[i].InterestRate)




            const result = await request.execute("InsertClientCPLiability");
        }

        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'Comprehensive Plan Income',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);
        res.status(200).send({ Status: true, Message: "Comprehensive Plan Liability  Saved Successfully.", Data: {} });
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        res.status(500).send(errorMessage);
    }
};

exports.SaveComprehensivePlanDependentExpense = async (req, res) => {
    var { ClientId, ClientDependentExpenseDetails } = req.body;
    let ClientIncomeData = JSON.parse(ClientDependentExpenseDetails);
    var errorMessage = "Error while saving comprehensive plan dependent expense data...";

    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const clientDependentExpenseDetailsDeleteRequest = transaction.request();
        clientDependentExpenseDetailsDeleteRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const ClientDependentExpenseDetailsDeleteResult = await clientDependentExpenseDetailsDeleteRequest.execute("DeleteClientCPDependentExpense");


        for (let i = 0; i < ClientIncomeData.length; i++) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                .input("ExpenseCategory", ClientIncomeData[i].ExpenseCategory)
                .input("AnnualAmount", ClientIncomeData[i].AnnualAmount)
                .input("UpToYear", ClientIncomeData[i].UpToYear)
                .input("Inflation", ClientIncomeData[i].Inflation)
                .input("Description", ClientIncomeData[i].Description)




            const result = await request.execute("InsertClientCPDependentExpense");
        }

        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'Comprehensive Plan Income',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);
        res.status(200).send({ Status: true, Message: "Comprehensive Plan Dependent Expenses Saved Successfully.", Data: {} });
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        res.status(500).send(errorMessage);
    }
};

exports.SaveComprehensivePlanInsurancePremimumExpense = async (req, res) => {
    var { ClientId, ClientInsurancePremimumExpenseDetails } = req.body;
    let ClientIncomeData = JSON.parse(ClientInsurancePremimumExpenseDetails);
    var errorMessage = "Error while saving comprehensive plan insurance premimum expense data...";

    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const clientInsurancePremimumExpenseDetailsDeleteRequest = transaction.request();
        clientInsurancePremimumExpenseDetailsDeleteRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const ClientInsurancePremimumExpenseDetailsDeleteResult = await clientInsurancePremimumExpenseDetailsDeleteRequest.execute("DeleteClientCPInsurancePremimumExpense");


        for (let i = 0; i < ClientIncomeData.length; i++) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                .input("ExpenseCategory", ClientIncomeData[i].ExpenseCategory)
                .input("AnnualAmount", ClientIncomeData[i].AnnualAmount)
                .input("UpToYear", ClientIncomeData[i].UpToYear)
                .input("Description", ClientIncomeData[i].Description)



            const result = await request.execute("InsertClientCPInsurancePremimumExpense");
        }

        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'Comprehensive Plan Income',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);
        res.status(200).send({ Status: true, Message: "Comprehensive Plan Insurance Premimum Expenses Saved Successfully.", Data: {} });
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        res.status(500).send(errorMessage);
    }
};


exports.SaveComprehensivePlanInsurance = async (req, res) => {
    var { ClientId, ClientInsuranceDetails } = req.body;
    let ClientIncomeData = JSON.parse(ClientInsuranceDetails);
    var errorMessage = "Error while saving comprehensive plan insurance  data...";

    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const clientInsuranceDetailsDeleteRequest = transaction.request();
        clientInsuranceDetailsDeleteRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const ClientInsuranceDetailsDeleteResult = await clientInsuranceDetailsDeleteRequest.execute("DeleteClientCPInsurance");


        for (let i = 0; i < ClientIncomeData.length; i++) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                .input("ClientFamilyId", cryptoEngine.ParamDecrypt(ClientIncomeData[i].ClientFamilyId, true))
                .input("InsuranceCategory", ClientIncomeData[i].IncomeCategory)
                .input("Description", ClientIncomeData[i].Description)
                .input("Amount", ClientIncomeData[i].Amount)
            const result = await request.execute("InsertClientCPInsurance");
        }

        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'Comprehensive Plan Income',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);
        res.status(200).send({ Status: true, Message: "Comprehensive Plan Insurance  Saved Successfully.", Data: {} });
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        res.status(500).send(errorMessage);
    }
};

exports.SaveComprehensivePlanGoal = async (req, res) => {
    var { ClientId, ClientGoalDetails, ClientGoalYearDetails } = req.body;
    let ClientIncomeData = JSON.parse(ClientGoalDetails);
    let ClientGoalYearData = JSON.parse(ClientGoalYearDetails);
  
    
    var errorMessage = "Error while saving comprehensive plan goal  data...";

    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';

    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        const clientGoalDetailsDeleteRequest = transaction.request();
        clientGoalDetailsDeleteRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const ClientGoalDetailsDeleteResult = await clientGoalDetailsDeleteRequest.execute("DeleteClientCPGoal");


        for (let i = 0; i < ClientIncomeData.length; i++) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true))
                .input("ClientFamilyId", cryptoEngine.ParamDecrypt(ClientIncomeData[i].ClientFamilyId, true))
                .input("GoalCategory", ClientIncomeData[i].IncomeCategory)
                .input("AmountToday", ClientIncomeData[i].AmountToday)
                .input("InflationPercentage", ClientIncomeData[i].InflationPercentage)
            const result = await request.execute("InsertClientCPGoal");

            // ClientCpGoalId = cryptoEngine.ParamEncrypt(result.output.Id, true);
        

            // const clientGoalYearDetailsDeleteRequest = transaction.request();
            // clientGoalYearDetailsDeleteRequest.input("ClientCpGoalId", cryptoEngine.ParamDecrypt(ClientCpGoalId, true));
            // const ClientGoalYearDetailsDeleteResult = await clientGoalYearDetailsDeleteRequest.execute("DeleteClientCPGoalYear");
            // console.log(ClientCpGoalId);
            // for (let i = 0; i < ClientGoalYearData.length; i++) {
            //     const GoalYearRequest = transaction.request();
            //     console.log(ClientCpGoalId);
            //     console.log(ClientGoalYearData[i].GoalYear);
            //     GoalYearRequest.input("ClientCpGoalId", cryptoEngine.ParamDecrypt(ClientCpGoalId, true))
            //         .input("GoalYear", ClientGoalYearData[i].GoalYear)
            //     const result = await GoalYearRequest.execute("InsertClientCPGoalYear");
            // }

         }




        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'Comprehensive Plan Income',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);
        res.status(200).send({ Status: true, Message: "Comprehensive Plan Goal Saved Successfully.", Data: {} });
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        res.status(500).send(errorMessage);
    }
};

exports.GetComprehensivePlanWealthSustainabilityAsset = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching wealth sustainability asset...";

    try {
        var dataList = [];
        var data = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientCPWealthSustainabilityAsset");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        for (let i = 0; i < dataList.length; i++) {
            var dataItem = dataList[i];

            var wealthSustainabilityAsset = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                ClientId: cryptoEngine.ParamEncrypt(dataItem.ClientId, true),
                ClientFamilyId: cryptoEngine.ParamEncrypt(dataItem.ClientFamilyId, true),
                IncomeCategory: dataItem.IncomeCategory,
                Description: dataItem.Description,
                InvestmentValue: dataItem.InvestmentValue,
                Frequency: dataItem.Frequency,
                StartDate: dataItem.StartDate,
                EndDate: dataItem.EndDate,
                MaturityDate: dataItem.MaturityDate,
                MaturityValue: dataItem.MaturityValue,
                BonusPercentage: dataItem.BonusPercentage,
                ROI: dataItem.ROI
            };

            data.push(wealthSustainabilityAsset);
        }

        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};


exports.GetComprehensivePlanWealthCreationAsset = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching wealth creation asset...";

    try {
        var dataList = [];
        var data = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientCPWealthCreationAsset");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        for (let i = 0; i < dataList.length; i++) {
            var dataItem = dataList[i];

            var wealthCreationAsset = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                ClientId: cryptoEngine.ParamEncrypt(dataItem.ClientId, true),
                ClientFamilyId: cryptoEngine.ParamEncrypt(dataItem.ClientFamilyId, true),
                IncomeCategory: dataItem.IncomeCategory,
                Description: dataItem.Description,
                AnnualContribution: dataItem.AnnualContribution,
                CurrentValue: dataItem.CurrentValue,
                MaturityDate: dataItem.MaturityDate,

            };

            data.push(wealthCreationAsset);
        }

        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};


exports.GetComprehensivePlanHouseHoldExpense = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching house hold expense...";

    try {
        var dataList = [];
        var data = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientCPHouseholdExpense");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        for (let i = 0; i < dataList.length; i++) {
            var dataItem = dataList[i];

            var householdExpense = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                ClientId: cryptoEngine.ParamEncrypt(dataItem.ClientId, true),
                ExpenseCategory: dataItem.ExpenseCategory,
                AnnualAmount: dataItem.AnnualAmount,
                UpToYear: dataItem.UpToYear,
                Inflation: dataItem.Inflation,
                IsPostRetirement: dataItem.IsPostRetirement,
                PostRetirementPercentage: dataItem.PostRetirementPercentage,

            };

            data.push(householdExpense);
        }

        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};


exports.GetComprehensivePlanLifeStyleExpense = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching life style expense...";

    try {
        var dataList = [];
        var data = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientCPLifeStyleExpense");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        for (let i = 0; i < dataList.length; i++) {
            var dataItem = dataList[i];

            var lifeStyleExpense = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                ClientId: cryptoEngine.ParamEncrypt(dataItem.ClientId, true),
                ExpenseCategory: dataItem.ExpenseCategory,
                AnnualAmount: dataItem.AnnualAmount,
                UpToYear: dataItem.UpToYear,
                Inflation: dataItem.Inflation,
                IsPostRetirement: dataItem.IsPostRetirement,
                PostRetirementPercentage: dataItem.PostRetirementPercentage,

            };

            data.push(lifeStyleExpense);
        }

        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetComprehensivePlanDependentExpense = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching dependent expense...";

    try {
        var dataList = [];
        var data = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientCPDependentExpense");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        for (let i = 0; i < dataList.length; i++) {
            var dataItem = dataList[i];

            var dependentExpense = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                ClientId: cryptoEngine.ParamEncrypt(dataItem.ClientId, true),
                ExpenseCategory: dataItem.ExpenseCategory,
                AnnualAmount: dataItem.AnnualAmount,
                UpToYear: dataItem.UpToYear,
                Inflation: dataItem.Inflation,
                Description: dataItem.Description


            };

            data.push(dependentExpense);
        }

        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetComprehensivePlanInsurancePremimumExpense = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching insurance premimum expense...";

    try {
        var dataList = [];
        var data = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientCPInsurancePremimumExpense");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        for (let i = 0; i < dataList.length; i++) {
            var dataItem = dataList[i];

            var insurancePremimumExpense = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                ClientId: cryptoEngine.ParamEncrypt(dataItem.ClientId, true),
                ExpenseCategory: dataItem.ExpenseCategory,
                AnnualAmount: dataItem.AnnualAmount,
                UpToYear: dataItem.UpToYear,
                Description: dataItem.Description

            };

            data.push(insurancePremimumExpense);
        }

        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetComprehensivePlanLiability = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching liability ...";

    try {
        var dataList = [];
        var data = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientCPLiability");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        for (let i = 0; i < dataList.length; i++) {
            var dataItem = dataList[i];

            var libilityExpense = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                ClientId: cryptoEngine.ParamEncrypt(dataItem.ClientId, true),
                LiabilityCategory: dataItem.LiabilityCategory,
                Description: dataItem.Description,
                EMI: dataItem.EMI,
                RemainingInstallment: dataItem.RemainingInstallment,
                InterestRate: dataItem.InterestRate
            };

            data.push(libilityExpense);
        }

        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetComprehensivePlanInsurance = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching insurance  expense...";

    try {
        var dataList = [];
        var data = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientCPInsurance");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        for (let i = 0; i < dataList.length; i++) {
            var dataItem = dataList[i];

            var insurance = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                ClientId: cryptoEngine.ParamEncrypt(dataItem.ClientId, true),
                ClientFamilyId: cryptoEngine.ParamEncrypt(dataItem.ClientFamilyId, true),
                InsuranceCategory: dataItem.InsuranceCategory,
                Description: dataItem.Description,
                Amount: dataItem.Amount
            };

            data.push(insurance);
        }

        res.status(200).send({ Status: (data != null), Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};


exports.GetComprehensivePlanGoal = async (req, res) => {
    const ClientId = req.params.ClientId;

    var errorMessage = "Error while fetching goal expenses...";

    try {
        var dataList = [];
        var goalData = [];
        var goalYearDetailsData = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
        const readResult = await readRequest.execute("GetClientCPGoal");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        for (let i = 0; i < dataList.length; i++) {
            var dataItem = dataList[i];

            var goal = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                ClientId: cryptoEngine.ParamEncrypt(dataItem.ClientId, true),
                ClientFamilyId: cryptoEngine.ParamEncrypt(dataItem.ClientFamilyId, true),
                GoalCategory: dataItem.GoalCategory,
                AmountToday: dataItem.AmountToday,
                InflationPercentage: dataItem.InflationPercentage
            };

            goalData.push(goal);
        }
        // console.log(goalData);
        // console.log(goal);

        if (goal != null || goal != undefined) {
            const readGoalYearDetailsRequest = req.app.locals.db.request();
            readGoalYearDetailsRequest.input("ClientCpGoalId", cryptoEngine.ParamDecrypt(goal.Id, true));
            const goalYearDetailsResult = await readGoalYearDetailsRequest.execute("GetClientCPGoalYear");
            if (goalYearDetailsResult.recordset.length > 0) {
                var goalYearData = goalYearDetailsResult.recordset;
                for (let i = 0; i < goalYearData.length; i++) {
                    var item = {
                        Id: cryptoEngine.ParamEncrypt(goalYearData[i].Id, true),
                        ClientCPGoalId: cryptoEngine.ParamEncrypt(goalYearData[i].ClientCPGoalId, true),
                        GoalYear: goalYearData[i].GoalYear,

                    };
                    goalYearDetailsData.push(item);
                }
            }
        }

        var goalData = {
            goalDataDetails: goalData,
            goalYearDataDetails: goalYearDetailsData

        }

        res.status(200).send({ Status: (goalData != null), Message: "", Data: goalData });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};