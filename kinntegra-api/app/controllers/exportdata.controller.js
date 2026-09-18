var https = require('https');
const date = require('date-and-time');
const xlsx = require('xlsx');
const path = require('path');
const cryptoEngine = require("../models/cryptoengine.model");
const clientController = require('../controllers/client.controller');
const appPool = require("../models/db.model");

exports.ExportClient = async (req, res) => {
    const StartDate = req.params.StartDate;
    const EndDate = req.params.EndDate;

    var errorMessage = 'Error while exporting clients...';

    try {
        var data = [];

        const readRequest = req.app.locals.db.request();
        readRequest.input("StartDate", StartDate)
            .input("EndDate", EndDate);
        const readResult = await readRequest.execute("GetClientByCreatedDate");
        if (readResult.recordset.length > 0) {
            var dataList = readResult.recordset;

            for (let i = 0; i < dataList.length; i++) {
                var clientDataItem;
                var leadDataItem;
                var profileData = [];
                var accounts = [];

                const readClientRequest = req.app.locals.db.request();
                readClientRequest.input("Id", dataList[i].Id);
                const readClientResult = await readClientRequest.execute("GetClientById");
                if (readClientResult.recordset.length > 0) {
                    clientDataItem = readClientResult.recordset[0];
                }

                const readLeadRequest = req.app.locals.db.request();
                readLeadRequest.input("Id", clientDataItem.LeadId);
                const readLeadResult = await readLeadRequest.execute("GetLeadById");
                if (readLeadResult.recordset.length > 0) {
                    leadDataItem = readLeadResult.recordset[0];
                }

                const readProfileRequest = req.app.locals.db.request();
                readProfileRequest.input("ClientId", dataList[i].Id);
                const readProfileResult = await readProfileRequest.execute("GetClientProfileExport");
                if (readProfileResult.recordset.length > 0) {
                    var profileList = readProfileResult.recordset;

                    for (let p = 0; p < profileList.length; p++) {
                        var banks = [];

                        if (profileList[p].ClientKycProfileId != 0) {
                            const readBankRequest = req.app.locals.db.request();
                            readBankRequest.input("ClientKycProfileId", profileList[p].ClientKycProfileId);
                            const readBankResult = await readBankRequest.execute("GetClientKycBankExport");

                            if (readBankResult.recordset.length > 0) {
                                var bankList = readBankResult.recordset;

                                for (let b = 0; b < bankList.length; b++) {
                                    var bankItem = {
                                        IFSC: bankList[b].IFSC,
                                        BankName: bankList[b].BankName,
                                        BankBranch: bankList[b].BankBranch,
                                        MICR: bankList[b].MICR,
                                        BankAccountTypeName: bankList[b].BankAccountTypeName,
                                        AccountNumber: bankList[b].AccountNumber,
                                        UPIId: bankList[b].UPIId,
                                        FileTag: bankList[b].FileTag,
                                        IsActive: bankList[b].IsActive
                                    };

                                    banks.push(bankItem);
                                }
                            }
                        }

                        var profileItem = {
                            Name: profileList[p].Name,
                            DateOfBirth: profileList[p].DateOfBirth,
                            RelationName: profileList[p].RelationName,
                            TaxStatusName: profileList[p].TaxStatusName,
                            TaxSlabName: profileList[p].TaxSlabName,
                            LifeExpectancy: profileList[p].LifeExpectancy,
                            FatherName: profileList[p].FatherName,
                            IsKycProfile: profileList[p].IsKycProfile,
                            PANCardNumber: profileList[p].PANCardNumber,
                            CKYCNumber: profileList[p].CKYCNumber,
                            AadharCardNumber: profileList[p].AadharCardNumber,
                            CountryCode: profileList[p].CountryCode,
                            MobileNumber: profileList[p].MobileNumber,
                            Email: profileList[p].Email,
                            PlaceOfBirth: profileList[p].PlaceOfBirth,
                            CountryOfBirth: profileList[p].CountryOfBirth,
                            EmployerName: profileList[p].EmployerName,
                            NetWorth: profileList[p].NetWorth,
                            NetWorthDate: profileList[p].NetWorthDate,
                            PlaceOfIncorporation: profileList[p].PlaceOfIncorporation,
                            CountryOfIncorporation: profileList[p].CountryOfIncorporation,
                            NatureOfBusiness: profileList[p].NatureOfBusiness,
                            OccupationName: profileList[p].OccupationName,
                            GrossAnnualIncomeName: profileList[p].GrossAnnualIncomeName,
                            WealthSourceName: profileList[p].WealthSourceName,
                            IsFATCAUploaded: profileList[p].IsFATCAUploaded,
                            FATCAUploadedDate: profileList[p].FATCAUploadedDate,
                            IsPoliticallyExposed: profileList[p].IsPoliticallyExposed,
                            GenderName: profileList[p].GenderName,
                            MobileDeclarationCode: profileList[p].MobileDeclarationCode,
                            EmailDeclarationCode: profileList[p].EmailDeclarationCode,
                            GuardianName: profileList[p].GuardianName,
                            LumpsumEquity: profileList[p].LumpsumEquity,
                            LumpsumDebt: profileList[p].LumpsumDebt,
                            SipEquity: profileList[p].SipEquity,
                            SipDebt: profileList[p].SipDebt,
                            Banks: banks
                        };

                        profileData.push(profileItem);
                    }

                    // console.log(profileList);
                }

                const readAccountsRequest = req.app.locals.db.request();
                readAccountsRequest.input("ClientId", dataList[i].Id);
                const readAccountsResult = await readAccountsRequest.execute("GetClientAccounts");
                if (readAccountsResult.recordset.length > 0) {
                    var accountsList = readAccountsResult.recordset;

                    for (let a = 0; a < accountsList.length; a++) {
                        var accountItem = await clientController.GetClientAccountInfo(req, res, cryptoEngine.ParamEncrypt(accountsList[a].Id, true));

                        accounts.push(accountItem);
                    }
                }

                var clientData = {
                    Lead: {
                        LeadDate: leadDataItem.LeadDate,
                        FirstName: leadDataItem.FirstName,
                        LastName: leadDataItem.LastName,
                        MobileNumber: leadDataItem.MobileNumber,
                        Email: leadDataItem.Email
                    },
                    Client: {
                        FamilyName: clientDataItem.FamilyName,
                        IsIndividual: clientDataItem.IsIndividual,
                        IsNonIndividual: clientDataItem.IsNonIndividual,
                        AssociateCode: clientDataItem.AssociateCode,
                        AssociateName: clientDataItem.AssociateName,
                        AssociatePANCardNumber: clientDataItem.AssociatePANCardNumber,
                        Profiles: profileData,
                        Accounts: accounts
                    }
                };
                data.push(clientData);
            }
        }

        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.ExportSingleClient = async (req, res, ClientId) => {
    var clientDataItem;
    var leadDataItem;
    var profileData = [];
    var accounts = [];

    const readClientRequest = req.app.locals.db.request();
    readClientRequest.input("Id", cryptoEngine.ParamDecrypt(ClientId, true));
    const readClientResult = await readClientRequest.execute("GetClientById");
    if (readClientResult.recordset.length > 0) {
        clientDataItem = readClientResult.recordset[0];
    }

    const readLeadRequest = req.app.locals.db.request();
    readLeadRequest.input("Id", clientDataItem.LeadId);
    const readLeadResult = await readLeadRequest.execute("GetLeadById");
    if (readLeadResult.recordset.length > 0) {
        leadDataItem = readLeadResult.recordset[0];
    }

    const readProfileRequest = req.app.locals.db.request();
    readProfileRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
    const readProfileResult = await readProfileRequest.execute("GetClientProfileExport");
    if (readProfileResult.recordset.length > 0) {
        var profileList = readProfileResult.recordset;

        for (let p = 0; p < profileList.length; p++) {
            var banks = [];

            if (profileList[p].ClientKycProfileId != 0) {
                const readBankRequest = req.app.locals.db.request();
                readBankRequest.input("ClientKycProfileId", profileList[p].ClientKycProfileId);
                const readBankResult = await readBankRequest.execute("GetClientKycBankExport");

                if (readBankResult.recordset.length > 0) {
                    var bankList = readBankResult.recordset;

                    for (let b = 0; b < bankList.length; b++) {
                        var bankItem = {
                            IFSC: bankList[b].IFSC,
                            BankName: bankList[b].BankName,
                            BankBranch: bankList[b].BankBranch,
                            MICR: bankList[b].MICR,
                            BankAccountTypeName: bankList[b].BankAccountTypeName,
                            AccountNumber: bankList[b].AccountNumber,
                            UPIId: bankList[b].UPIId,
                            FileTag: bankList[b].FileTag,
                            IsActive: bankList[b].IsActive
                        };

                        banks.push(bankItem);
                    }
                }
            }

            var profileItem = {
                Name: profileList[p].Name,
                DateOfBirth: profileList[p].DateOfBirth,
                RelationName: profileList[p].RelationName,
                TaxStatusName: profileList[p].TaxStatusName,
                TaxSlabName: profileList[p].TaxSlabName,
                LifeExpectancy: profileList[p].LifeExpectancy,
                FatherName: profileList[p].FatherName,
                IsKycProfile: profileList[p].IsKycProfile,
                PANCardNumber: profileList[p].PANCardNumber,
                CKYCNumber: profileList[p].CKYCNumber,
                AadharCardNumber: profileList[p].AadharCardNumber,
                CountryCode: profileList[p].CountryCode,
                MobileNumber: profileList[p].MobileNumber,
                Email: profileList[p].Email,
                PlaceOfBirth: profileList[p].PlaceOfBirth,
                CountryOfBirth: profileList[p].CountryOfBirth,
                EmployerName: profileList[p].EmployerName,
                NetWorth: profileList[p].NetWorth,
                NetWorthDate: profileList[p].NetWorthDate,
                PlaceOfIncorporation: profileList[p].PlaceOfIncorporation,
                CountryOfIncorporation: profileList[p].CountryOfIncorporation,
                NatureOfBusiness: profileList[p].NatureOfBusiness,
                OccupationName: profileList[p].OccupationName,
                GrossAnnualIncomeName: profileList[p].GrossAnnualIncomeName,
                WealthSourceName: profileList[p].WealthSourceName,
                IsFATCAUploaded: profileList[p].IsFATCAUploaded,
                FATCAUploadedDate: profileList[p].FATCAUploadedDate,
                IsPoliticallyExposed: profileList[p].IsPoliticallyExposed,
                GenderName: profileList[p].GenderName,
                MobileDeclarationCode: profileList[p].MobileDeclarationCode,
                EmailDeclarationCode: profileList[p].EmailDeclarationCode,
                GuardianName: profileList[p].GuardianName,
                LumpsumEquity: profileList[p].LumpsumEquity,
                LumpsumDebt: profileList[p].LumpsumDebt,
                SipEquity: profileList[p].SipEquity,
                SipDebt: profileList[p].SipDebt,
                Banks: banks
            };

            profileData.push(profileItem);
        }
    }

    const readAccountsRequest = req.app.locals.db.request();
    readAccountsRequest.input("ClientId", cryptoEngine.ParamDecrypt(ClientId, true));
    const readAccountsResult = await readAccountsRequest.execute("GetClientAccounts");
    if (readAccountsResult.recordset.length > 0) {
        var accountsList = readAccountsResult.recordset;

        for (let a = 0; a < accountsList.length; a++) {
            var accountItem = await clientController.GetClientAccountInfo(req, res, cryptoEngine.ParamEncrypt(accountsList[a].Id, true));

            accounts.push(accountItem);
        }
    }

    var clientData = {
        Lead: {
            LeadDate: leadDataItem.LeadDate,
            FirstName: leadDataItem.FirstName,
            LastName: leadDataItem.LastName,
            MobileNumber: leadDataItem.MobileNumber,
            Email: leadDataItem.Email
        },
        Client: {
            FamilyName: clientDataItem.FamilyName,
            IsIndividual: clientDataItem.IsIndividual,
            IsNonIndividual: clientDataItem.IsNonIndividual,
            AssociateCode: clientDataItem.AssociateCode,
            AssociateName: clientDataItem.AssociateName,
            AssociatePANCardNumber: clientDataItem.AssociatePANCardNumber,
            Profiles: profileData,
            Accounts: accounts
        }
    };

    var exportResult = await this.ExportSingleClientToOldSystem(clientData);

    return exportResult;
};

exports.ExportSingleClientToOldSystem = async (inputData) => {
    try {
        return new Promise((resolve, reject) => {
            var headers = {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(inputData))
            };
            var options = {
                host: 'www.kinntegra.co.in',
                path: '/set_client_updated_data',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            var request = https.request(options, function (response) {
                response.setEncoding('utf8');

                response.on('data', async function (message) {
                    // console.log(message);

                    var result = JSON.parse(message);

                    resolve({ Status: true, Remarks: result });
                });
            });

            request.on('error', function (err) {
                console.log(err);
                reject(err);
            });

            request.on('timeout', () => {
                request.destroy();
                reject(new Error('Timeout'));
            });

            request.write(JSON.stringify(inputData));

            request.end();
        });
    }
    catch (err) {
        console.log(err);
    }
};

exports.ExportClientHoldings = async (req, res) => {
    const UCC = req.params.UCC;

    var errorMessage = 'Error while exporting client portfolio...';

    try {
        var fileName = 'holding-' + UCC + '-' + date.format(new Date(), 'DDMMYYYY') + '.xlsx';
        var filePath = path.join(__dirname.replace("app", "public"), '..', 'documents', 'reports', fileName);
        var holdingworkbook = xlsx.utils.book_new();
        var holding = [];

        var clientAccount = await getClientAccount(UCC);

        if (clientAccount != null) {
            var schemesWealth = await getHoldingSchemes('W', clientAccount.Id);
            holding.push({
                Portfolio: 'Wealth',
                Schemes: schemesWealth
            });

            var worksheetWealth = xlsx.utils.json_to_sheet(schemesWealth);
            xlsx.utils.book_append_sheet(holdingworkbook, worksheetWealth, 'Wealth');

            var schemesTax = await getHoldingSchemes('T', clientAccount.Id);
            holding.push({
                Portfolio: 'Tax',
                Schemes: schemesTax
            });

            var worksheetTax = xlsx.utils.json_to_sheet(schemesTax);
            xlsx.utils.book_append_sheet(holdingworkbook, worksheetTax, 'Tax');

            var schemesShortTerm = await getHoldingSchemes('ST', clientAccount.Id);
            holding.push({
                Portfolio: 'Short Term',
                Schemes: schemesShortTerm
            });

            var worksheetShortTerm = xlsx.utils.json_to_sheet(schemesShortTerm);
            xlsx.utils.book_append_sheet(holdingworkbook, worksheetShortTerm, 'ShortTerm');

            var schemesCommodities = await getHoldingSchemes('G', clientAccount.Id);
            holding.push({
                Portfolio: 'Commodities',
                Schemes: schemesCommodities
            });

            var worksheetCommodities = xlsx.utils.json_to_sheet(schemesCommodities);
            xlsx.utils.book_append_sheet(holdingworkbook, worksheetCommodities, 'Commodities');
        }

        xlsx.writeFile(holdingworkbook, filePath);

        res.status(200).send({ Status: true, DownloadFile: process.env.WEB_API_LINK + '/doc/report/' + fileName, Data: holding });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.ExportClientTransactionUnitLedger = async (inputData) => {
    try {
        return new Promise((resolve, reject) => {
            var headers = {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(inputData))
            };
            var options = {
                host: 'www.kinntegra.co.in',
                path: '/set_transaction_unit_data',
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            var request = https.request(options, function (response) {
                response.setEncoding('utf8');

                response.on('data', async function (message) {
                    // console.log(message);

                    var result = JSON.parse(message);

                    resolve({ Status: true, Remarks: result });
                });
            });

            request.on('error', function (err) {
                console.log(err);
                reject(err);
            });

            request.on('timeout', () => {
                request.destroy();
                reject(new Error('Timeout'));
            });

            request.write(JSON.stringify(inputData));

            request.end();
        });
    }
    catch (err) {
        console.log(err);
    }
};

async function getHoldingSchemes(portfolioTypeCode, clientAccountId) {
    var currentDate = date.format(new Date(), 'YYYY-MM-DD');

    var portfolioSchemes = await getTransactionPortfolioSchemesByPortfolioType(portfolioTypeCode, clientAccountId);

    var schemes = [];
    for (let i = 0; i < portfolioSchemes.length; i++) {
        var currentNav = 0;
        var navDate = '';
        var currentUnits = await getFeedDailyHoldingCurrentUnits(clientAccountId, portfolioSchemes[i].BSESchemeId, currentDate);

        var currentNavData = await netAssetValueByDate(portfolioSchemes[i].ISIN, currentDate);
        if (currentNavData != null) {
            currentNav = currentNavData.NAV;
            navDate = date.format(currentNavData.NAVDate, 'DD-MM-YYYY');
        }

        schemes.push({
            Id: portfolioSchemes[i].BSESchemeId,
            ISIN: portfolioSchemes[i].ISIN,
            Units: currentUnits.Units,
            NAV: currentNav,
            NAVDate: navDate
        });
    }

    return schemes;
}

async function getClientAccount(ucc) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("UCC", ucc);
    const readResult = await readRequest.execute("GetClientAccountByUCC");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function getTransactionPortfolioSchemesByPortfolioType(portfolioTypeCode, clientAccountId) {
    var data = [];

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("PortfolioTypeCode", portfolioTypeCode)
        .input("ClientAccountId", clientAccountId);
    const readResult = await readRequest.execute("GetTransactionPortfolioSchemesByPortfolioType");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset;
    }

    return data;
};

async function getFeedDailyHoldingCurrentUnits(clientAccountId, schemeId, holdingDate) {
    var data = 0;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("ClientAccountId", clientAccountId)
        .input("BSESchemeId", schemeId)
        .input("OrderDate", holdingDate);
    const readResult = await readRequest.execute("GetFeedDailyHoldingCurrentUnits");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};

async function netAssetValueByDate(isin, holdingDate) {
    var data;

    let pool = await appPool.connect();

    const readRequest = pool.request();
    readRequest.input("ISIN", isin)
        .input("NAVDate", holdingDate);
    const readResult = await readRequest.execute("NetAssetValueByDate");
    if (readResult.recordset.length > 0) {
        data = readResult.recordset[0];
    }

    return data;
};
