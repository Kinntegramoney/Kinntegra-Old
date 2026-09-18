const date = require('date-and-time');
const cryptoEngine = require("../models/cryptoengine.model");
const base64img = require('base64-img');
const path = require('path');
const pdfEngine = require("../models/pdfengine.model");
const bseConfig = require("../configs/bse.config");
const bseService = require('../models/bseservice.model');
const CommonFunction = require('./commonfunction.model');
const handlebars = require('handlebars');
const PDFMerger = require('pdf-merger-js');
const fileSystem = require("fs");
const pdfjsLib = require('pdfjs-dist');
const pdfJSWorker = require('pdfjs-dist/build/pdf.worker');
const canvas = require('canvas');
const joinImages = require('join-images-updated');
const Jimp = require("jimp");
const { open } = require('fs/promises');

const Reports = function () { }

Reports.PrepareClientAOFPdf = async (data) => {
    let aofData = {
        LogoImagePath: base64img.base64Sync(path.join('app', 'assets', 'images', 'logo-green.png')),
        ClientCode: '',
        ClientType: '',
        ARN: '',
        SubARN: '',
        EUIN: '',
        ClientTaxStatus: '',
        ClientAppName1: '',
        ClientPAN: '',
        ClientDOB: '',
        ClientGender: '',
        ClientGuardian: '',
        ClientGuardianPAN: '',
        ClientAdd1: '',
        ClientAdd2: '',
        ClientAdd3: '',
        ClientCity: '',
        ClientPincode: '',
        ClientState: '',
        ClientCountry: '',
        ClientEmail: '',
        ClientMobile: '',
        ClientHolding: '',
        ClientOccupation: '',
        ClientAppName2: '',
        ClientPAN2: '',
        ClientDOB2: '',
        ClientAppName3: '',
        ClientPAN3: '',
        ClientDOB3: '',
        ClientForeignAdd1: '',
        ClientForeignAdd2: '',
        ClientForeignAdd3: '',
        ClientForeignCity: '',
        ClientForeignPincode: '',
        ClientForeignCountry: '',
        BankName: '',
        BankBranch: '',
        ClientAccountNo1: '',
        ClientAccountType1: '',
        ClientIFSCCode1: '',
        BankAddress: '',
        BankCity: '',
        BankState: '',
        ClientNominee: '',
        ClientNomineeRelation: '',
        NomineeGuardianName: '',
        NomineeAddress: '',
        NomineeCity: '',
        NomineePincode: '',
        NomineeState: '',
        ApplicationDate: ''
    };

    aofData.ClientCode = data.UCC;

    if (data.AssociateCode == '01') {
        aofData.SubARN = '';
    } else {
        aofData.SubARN = 'ARN-' + data.ARN;
    }
    aofData.ARN = process.env.COMPANY_ARN;
    aofData.EUIN = (data.EUIN != '') ? 'E' + data.EUIN : data.EUIN;

    aofData.ClientHolding = data.AccountTypeName;

    var firstHolder = data.AccountHolders.find(x => x.SerialNumber === 1);
    // console.log(firstHolder);
    if (firstHolder != null) {
        aofData.ClientTaxStatus = firstHolder.ProfileDetails.TaxStatusCode;
        aofData.ClientOccupation = firstHolder.ProfileDetails.OccupationName;
        aofData.ClientAppName1 = firstHolder.ProfileDetails.Name;
        aofData.ClientDOB = date.format(firstHolder.ProfileDetails.DateOfBirth, 'DD/MM/YYYY');
        aofData.ClientGender = firstHolder.ProfileDetails.GenderCode;
        if (firstHolder.ProfileDetails.TaxStatusCode == '02' || firstHolder.ProfileDetails.TaxStatusCode == '26' || firstHolder.ProfileDetails.TaxStatusCode == '28') {
            aofData.ClientGuardian = firstHolder.GuardianDetails.ProfileDetails.Name;
            aofData.ClientGuardianPAN = firstHolder.GuardianDetails.ProfileDetails.PANCardNumber;
        } else {
            aofData.ClientPAN = firstHolder.ProfileDetails.PANCardNumber;
        }
        aofData.ClientAdd1 = firstHolder.CommincationDetails.LocalAddress1;
        aofData.ClientAdd2 = firstHolder.CommincationDetails.LocalAddress2;
        aofData.ClientAdd3 = firstHolder.CommincationDetails.LocalAddress3;
        aofData.ClientCity = firstHolder.CommincationDetails.LocalCity;
        aofData.ClientState = firstHolder.CommincationDetails.LocalStateName;
        aofData.ClientPincode = firstHolder.CommincationDetails.LocalPinCode;
        aofData.ClientCountry = firstHolder.CommincationDetails.LocalCountryName;
        aofData.ClientEmail = firstHolder.ProfileDetails.Email;
        if (firstHolder.ProfileDetails.TaxStatusCode == '21' || firstHolder.ProfileDetails.TaxStatusCode == '24' || firstHolder.ProfileDetails.TaxStatusCode == '61' || firstHolder.ProfileDetails.TaxStatusCode == '62' || firstHolder.ProfileDetails.TaxStatusCode == '70' || firstHolder.ProfileDetails.TaxStatusCode == '77' || firstHolder.ProfileDetails.TaxStatusCode == '78') {
            aofData.ClientForeignAdd1 = firstHolder.CommincationDetails.ForeignAddress1;
            aofData.ClientForeignAdd2 = firstHolder.CommincationDetails.ForeignAddress2;
            aofData.ClientForeignAdd3 = firstHolder.CommincationDetails.ForeignAddress3;
            aofData.ClientForeignCity = firstHolder.CommincationDetails.ForeignCity;
            aofData.ClientForeignPincode = firstHolder.CommincationDetails.ForeignPinCode;
            aofData.ClientForeignCountry = firstHolder.CommincationDetails.ForeignCountryName;
        }
        aofData.ClientMobile = firstHolder.ProfileDetails.MobileNumber;
    }

    var secondHolder = data.AccountHolders.find(x => x.SerialNumber === 2);
    if (secondHolder != null) {
        aofData.ClientAppName2 = secondHolder.ProfileDetails.Name;
        aofData.ClientDOB2 = date.format(secondHolder.ProfileDetails.DateOfBirth, 'DD/MM/YYYY');
        aofData.ClientPAN2 = secondHolder.ProfileDetails.PANCardNumber;
    }

    var thirdHolder = data.AccountHolders.find(x => x.SerialNumber === 3);
    if (thirdHolder != null) {
        aofData.ClientAppName3 = thirdHolder.ProfileDetails.Name;
        aofData.ClientDOB3 = date.format(secondHolder.ProfileDetails.DateOfBirth, 'DD/MM/YYYY');
        aofData.ClientPAN3 = thirdHolder.ProfileDetails.PANCardNumber;
    }

    if (data.AccountNominees.length > 0) {
        aofData.ClientNominee = data.AccountNominees[0].NomineeName;
        aofData.NomineeGuardianName = data.AccountNominees[0].GuardianName;
        aofData.NomineeAddress = '';//data.AccountNominees[0].Address1 + ' ' + data.AccountNominees[0].Address2 + ' ' + data.AccountNominees[0].Address3;
        aofData.NomineeCity = '';//data.AccountNominees[0].City;
        aofData.NomineePincode = '';//data.AccountNominees[0].Pincode;
        aofData.NomineeState = '';//data.AccountNominees[0].StateName;
        aofData.ClientNomineeRelation = data.AccountNominees[0].RelationName;
    }

    aofData.ClientType = bseService.GetBseClientTypeCode(process.env.BSE_CLIENT_TYPE);

    var defaultBank = data.AccountBanks.find(x => x.IsDefault === true);
    if (defaultBank != null) {
        aofData.ClientAccountType1 = defaultBank.BankAccountTypeName;
        aofData.ClientAccountNo1 = defaultBank.AccountNumber;
        aofData.ClientIFSCCode1 = defaultBank.IFSC;
        aofData.BankName = defaultBank.BankName;
        aofData.BankBranch = (defaultBank.BankBranch.length > 25) ? defaultBank.BankBranch.substr(0, 25) : defaultBank.BankBranch;
        aofData.BankAddress = defaultBank.Address;
        aofData.BankCity = defaultBank.City
        aofData.BankState = defaultBank.State;
    }

    aofData.ApplicationDate = date.format(data.Created, 'DD-MM-YYYY');

    let fileName = bseConfig.MemberId + data.UCC + date.format(new Date(), 'DDMMYYYY') + '.pdf';

    // console.log(aofData);

    var reportBuffer = await pdfEngine.GenerateA4PortraitPdfBuffer("accountopeningform.template.hbs", aofData, fileName, 'reports');

    return { FileName: fileName, ReportBuffer: reportBuffer };
};

Reports.PrepareClientLOEPdf = async (data) => {
    let loeData = {
        LogoImagePath: base64img.base64Sync(path.join('app', 'assets', 'images', 'logo-green.png')),
        ClientCode: '',
        ApplicationDate: '',
        ClientName: '',
        AssociateName: '',
        HelpdeskContact: '',
    };

    loeData.ClientCode = data.UCC;
    loeData.ApplicationDate = date.format(data.Created, 'DD-MM-YYYY');
    var firstHolder = data.AccountHolders.find(x => x.SerialNumber === 1);
    if (firstHolder != null) {
        loeData.ClientName = firstHolder.ProfileDetails.Name;
    }
    loeData.AssociateName = (data.EntityTypeName.toLowerCase() == 'individual') ? data.AssociateName : data.EUINHolderName;
    loeData.HelpdeskContact = process.env.HELPDESK_CONTACT;
    loeData.AuthorisedPerson1 = data.AuthorisedPerson1;
    loeData.Email1 = data.Email1;
    loeData.Mobile1 = data.Mobile1;

    let fileName = 'loe' + bseConfig.MemberId + data.UCC + date.format(new Date(), 'DDMMYYYY') + '.pdf';

    var reportBuffer = await pdfEngine.GenerateA4PortraitPdfBuffer("engagementletter.template.hbs", loeData, fileName, 'reports');

    return { FileName: fileName, ReportBuffer: reportBuffer };
};

Reports.PrepareMandateScanFilePdf = async (data) => {
    let param = "{0}|{1}|{2}|{3}|{4}|{5}|{6}|{7}|{8}|{9}|{10}|{11}|{12}|{13}|{14}|{15}|{16}|{17}|{18}|{19}|{20}|{21}|{22}|{23}|{24}|{25}|{26}|{27}|{28}|{29}|{30}|{31}|{32}|{33}|{34}|{35}|{36}|{37}|{38}|{39}|{40}|{41}|{42}|{43}|{44}|{45}|{46}|{47}|{48}|{49}|{50}|{51}|{52}|{53}|{54}|{55}|{56}|{57}|{58}|{59}|{60}|{61}|{62}|{63}|{64}|{65}|{66}|{67}|{68}|{69}|{70}|{71}|{72}|{73}|{74}|{75}|{76}|{77}|{78}|{79}";

    let startDateString = date.format(data.StartDate, "DDMMYYYY");
    let startDateList = startDateString.split("");
    param = param.replace('{0}', startDateList[0]);
    param = param.replace('{1}', startDateList[1]);
    param = param.replace('{2}', startDateList[2]);
    param = param.replace('{3}', startDateList[3]);
    param = param.replace('{4}', startDateList[4]);
    param = param.replace('{5}', startDateList[5]);
    param = param.replace('{6}', startDateList[6]);
    param = param.replace('{7}', startDateList[7]);

    let endDateString = date.format(data.EndDate, "DDMMYYYY");
    let endDateList = endDateString.split("");
    param = param.replace('{72}', endDateList[0]);
    param = param.replace('{73}', endDateList[1]);
    param = param.replace('{74}', endDateList[2]);
    param = param.replace('{75}', endDateList[3]);
    param = param.replace('{76}', endDateList[4]);
    param = param.replace('{77}', endDateList[5]);
    param = param.replace('{78}', endDateList[6]);
    param = param.replace('{79}', endDateList[7]);

    switch (data.AccountMandate.BankAccountTypeCode) {
        case 'SB':
            param = param.replace('{8}', '');
            break;
        case 'CB':
            param = param.replace('{8}', 'left: 525px;');
            break;
        case 'NE':
            param = param.replace('{8}', 'left: 575px;');
            break;
        case 'NO':
            param = param.replace('{8}', 'left: 625px;');
            break;
        default:
            param = param.replace('{8}', 'left: 650px;');
            break;
    }

    let accountNumberList = data.AccountMandate.AccountNumber.split("");
    for (let i = 9; i <= 40; i++) {
        if (i - 9 < accountNumberList.length) {
            param = param.replace('{' + i + '}', accountNumberList[i - 9]);
        } else {
            param = param.replace('{' + i + '}', '');
        }
    }

    param = param.replace('{41}', data.AccountMandate.BankName);

    let ifscList = data.AccountMandate.IFSC.toUpperCase().split("");

    for (let i = 42; i <= 52; i++) {
        if (i - 42 < ifscList.length) {
            param = param.replace('{' + i + '}', ifscList[i - 42]);
        } else {
            param = param.replace('{' + i + '}', '');
        }
    }

    let micrList = data.AccountMandate.MICR.split("");

    for (let i = 53; i <= 61; i++) {
        if (i - 53 < micrList.length) {
            param = param.replace('{' + i + '}', micrList[i - 53]);
        } else {
            param = param.replace('{' + i + '}', '');
        }
    }

    param = param.replace('{62}', CommonFunction.ConvertToIndianCurrency(data.AccountMandate.Amount).replace('Rupees ', ''));
    param = param.replace('{63}', data.AccountMandate.Amount);
    param = param.replace('{64}', data.AccountMandate.BSEMandateId);
    param = param.replace('{65}', data.AccountFirstHolder.ProfileDetails.MobileNumber);
    param = param.replace('{66}', data.UCC);
    param = param.replace('{67}', data.AccountFirstHolder.ProfileDetails.Email);
    param = param.replace('{68}', '');
    param = param.replace('{69}', '');
    param = param.replace('{70}', '');
    param = param.replace('{71}', '');

    let paramData = [];

    let paramList = param.split('|');
    for (let i = 0; i < paramList.length; i++) {
        paramData.push({ data: paramList[i] });
    }

    let mandateData = {
        CheckmarkImagePath: base64img.base64Sync(path.join('app', 'assets', 'images', 'mandate-check.png')),
        Param: paramData
    };

    // console.log(mandateData);

    let fileName = data.AccountMandate.BSEMandateId + '.pdf';

    var reportBuffer = await pdfEngine.GenerateA5LandscapeMandatePdfBuffer("mandate.template.hbs", mandateData, fileName, 'reports');

    return { FileName: fileName, ReportBuffer: reportBuffer };
};

Reports.PrepareClientAOFBankChequePdf = async (data) => {
    let aofBankData = {
        IsBankCheque1: false,
        BankCheque1: null,
        IsBankCheque2: false,
        BankCheque2: null,
        IsBankCheque3: false,
        BankCheque3: null,
        IsBankCheque4: false,
        BankCheque4: null,
        IsBankCheque5: false,
        BankCheque5: null
    };

    let UCC = data[0].UCC;

    if (data.length > 0) {
        aofBankData.IsBankCheque1 = true;
        aofBankData.BankCheque1 = new handlebars.SafeString('data:' + data[0].FileContentType + ';base64,' + Buffer.from(data[0].FileContent).toString('base64'));
    }
    if (data.length > 1) {
        aofBankData.IsBankCheque2 = true;
        aofBankData.BankCheque2 = new handlebars.SafeString('data:' + data[1].FileContentType + ';base64,' + Buffer.from(data[1].FileContent).toString('base64'));
    }
    // if (data.length > 2) {
    //     aofBankData.IsBankCheque3 = true;
    //     aofBankData.BankCheque3 = new handlebars.SafeString('data:' + data[2].FileContentType + ';base64,' + Buffer.from(data[2].FileContent).toString('base64'));
    // }
    // if (data.length > 3) {
    //     aofBankData.IsBankCheque4 = true;
    //     aofBankData.BankCheque4 = new handlebars.SafeString('data:' + data[3].FileContentType + ';base64,' + Buffer.from(data[3].FileContent).toString('base64'));
    // }
    // if (data.length > 4) {
    //     aofBankData.IsBankCheque5 = true;
    //     aofBankData.BankCheque5 = new handlebars.SafeString('data:' + data[4].FileContentType + ';base64,' + Buffer.from(data[4].FileContent).toString('base64'));
    // }

    let fileName = 'aofbank-' + bseConfig.MemberId + UCC + date.format(new Date(), 'DDMMYYYY') + '.pdf';

    var reportBuffer = await pdfEngine.GenerateA4PortraitPdfBuffer("aofcheque.template.hbs", aofBankData, fileName, 'reports');

    return reportBuffer;
};

Reports.PrepareClientAOFImage = async (accountBankData, aofData) => {
    try {
        let UCC = accountBankData[0].UCC;

        if (aofData.FileContentType == 'image/tiff') {
            return { FileName: bseConfig.MemberId + UCC + date.format(new Date(), 'DDMMYYYY') + '.tiff', ReportBuffer: Buffer.from(aofData.FileContent) };
        }
        else {
            var merger = new PDFMerger();

            // var aofChequeBuffer = await Reports.PrepareClientAOFBankChequePdf(accountBankData);

            // var aofImageFileName = aofData.FileName.replace('.pdf', '.tiff');

            // await merger.add(Buffer.from(aofData.FileContent));
            // await merger.add(aofChequeBuffer);

            // await merger.save(path.join(__dirname.replace("app", "public"), '..', 'documents', 'reports', 'aofscan-' + bseConfig.MemberId + UCC + date.format(new Date(), 'DDMMYYYY') + '.pdf'));

            // const aofPdfBuffer = await merger.saveAsBuffer();

            const aofPdfBuffer = Buffer.from(aofData.FileContent);

            var imageFiles = [];

            pdfjsLib.GlobalWorkerOptions.workerSrc = pdfJSWorker;
            const pdfDoc = await pdfjsLib.getDocument({ data: CommonFunction.ToArrayBuffer(aofPdfBuffer) }).promise;
            for (let i = 0; i < pdfDoc.numPages; i++) {
                const page = await pdfDoc.getPage(i + 1);
                const viewport = page.getViewport({ scale: 1.1 });
                const canvasDoc = canvas.createCanvas(viewport.width, viewport.height);
                const context = canvasDoc.getContext('2d');
                await page.render({ canvasContext: context, viewport, background: null }).promise;
                const imageDataURL = canvasDoc.toBuffer('image/png');

                var filepath = path.join(__dirname.replace("app", "public"), '..', 'documents', 'reports', 'temp', (i + 1) + '-' + bseConfig.MemberId + UCC + date.format(new Date(), 'DDMMYYYY') + '.png');
                fileSystem.writeFileSync(filepath, imageDataURL);

                imageFiles.push(filepath);
            }

            for (let i = 0; i < accountBankData.length; i++) {
                if (accountBankData[i].FileContentType == 'application/pdf') {
                    var bankPdfBuffer = Buffer.from(accountBankData[i].FileContent);

                    const pdfDoc = await pdfjsLib.getDocument({ data: CommonFunction.ToArrayBuffer(bankPdfBuffer) }).promise;
                    for (let j = 0; j < pdfDoc.numPages; j++) {
                        const page = await pdfDoc.getPage(j + 1);
                        const viewport = page.getViewport({ scale: 1.1 });
                        const canvasDoc = canvas.createCanvas(viewport.width, viewport.height);
                        const context = canvasDoc.getContext('2d');
                        await page.render({ canvasContext: context, viewport, background: null }).promise;
                        const imageDataURL = canvasDoc.toBuffer('image/png');

                        var filepath = path.join(__dirname.replace("app", "public"), '..', 'documents', 'reports', 'temp', accountBankData[i].FileName.toLowerCase().replace('.pdf', '.png'));
                        fileSystem.writeFileSync(filepath, imageDataURL);

                        imageFiles.push(filepath);
                    }
                }
                else {
                    var filepath = path.join(__dirname.replace("app", "public"), '..', 'documents', 'reports', 'temp', accountBankData[i].FileName);
                    fileSystem.writeFileSync(filepath, Buffer.from(accountBankData[i].FileContent));

                    imageFiles.push(filepath);
                }
            }

            for (let i = 0; i < imageFiles.length; i++) {
                var compressImageFile = await Jimp.read(imageFiles[i]);
                await compressImageFile.resize(500, Jimp.AUTO);
                await compressImageFile.writeAsync(imageFiles[i]);
            }

            var filepath = path.join(__dirname.replace("app", "public"), '..', 'documents', 'reports', 'temp', bseConfig.MemberId + UCC + date.format(new Date(), 'DDMMYYYY') + '.png');

            if (imageFiles.length > 0) {
                var imageFile = await joinImages.joinImages(imageFiles);
                await imageFile.toFile(filepath);
            }

            var tifffilepath = path.join(__dirname.replace("app", "public"), '..', 'documents', 'reports', bseConfig.MemberId + UCC + date.format(new Date(), 'DDMMYYYY') + '.tiff');
            var tiffImageFile = await Jimp.read(filepath);
            await tiffImageFile.writeAsync(tifffilepath);

            // var tiffBlob = await fileSystem.openAsBlob(tifffilepath);
            // var tiffFileArrayBuffer = await tiffBlob.arrayBuffer();

            // var tiffFileBuffer = CommonFunction.ArrayBufferToBase64(tiffFileArrayBuffer);

            var tiffFileBuffer = fileSystem.readFileSync(tifffilepath, { encoding: 'base64' });

            return { FileName: bseConfig.MemberId + UCC + date.format(new Date(), 'DDMMYYYY') + '.tiff', ReportBuffer: Buffer.from(tiffFileBuffer, 'base64') };
        }
    }
    catch (err) {
        console.log(err);
    }
};

Reports.PrepareClientMandateImage = async (mandateData) => {
    var mandateImageFileName = mandateData.FileName.replace('.pdf', '.png');
    var mandateTiffImageFileName = mandateData.FileName.replace('.pdf', '.tiff');

    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfJSWorker;
    const pdfDoc = await pdfjsLib.getDocument({ data: CommonFunction.ToArrayBuffer(Buffer.from(mandateData.FileContent)) }).promise;
    const page = await pdfDoc.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvasDoc = canvas.createCanvas(viewport.width, viewport.height)
    const context = canvasDoc.getContext('2d');
    await page.render({ canvasContext: context, viewport }).promise;
    const imageDataURL = canvasDoc.toBuffer('image/png');

    var filepath = path.join(__dirname.replace("app", "public"), '..', 'documents', 'reports', mandateImageFileName);
    fileSystem.writeFileSync(filepath, imageDataURL);

    var tifffilepath = path.join(__dirname.replace("app", "public"), '..', 'documents', 'reports', mandateTiffImageFileName);
    var tiffImageFile = await Jimp.read(filepath);
    await tiffImageFile.resize(600, Jimp.AUTO);
    await tiffImageFile.writeAsync(tifffilepath);

    // var tiffBlob = await fileSystem.openAsBlob(tifffilepath);
    // var tiffFileArrayBuffer = await tiffBlob.arrayBuffer();

    // var tiffFileBuffer = CommonFunction.ArrayBufferToBase64(tiffFileArrayBuffer);

    var tiffFileBuffer = fileSystem.readFileSync(tifffilepath, { encoding: 'base64' });

    return { FileName: mandateTiffImageFileName, ReportBuffer: Buffer.from(tiffFileBuffer, 'base64') };
};

Reports.PrepareNonIndividualClientFATCAPdf = async (data) => {
    let param = "{0}|{1}|{2}|{3}|{4}|{5}|{6}|{7}|{8}|{9}|{10}|{11}|{12}|{13}|{14}|{15}|{16}|{17}|{18}|{19}|{20}|{21}|{22}|{23}|{24}|{25}|{26}|{27}|{28}|{29}|{30}|{31}|{32}|{33}|{34}|{35}|{36}|{37}|{38}|{39}|{40}|{41}|{42}|{43}|{44}|{45}|{46}|{47}|{48}|{49}|{50}|{51}|{52}|{53}|{54}|{55}|{56}|{57}|{58}|{59}|{60}|{61}|{62}|{63}|{64}|{65}|{66}|{67}|{68}|{69}|{70}|{71}|{72}";

    let firstHolder = data.AccountHolders[0];
    let PANCardNumberList = firstHolder.ProfileDetails.PANCardNumber.toUpperCase().split('');

    param = param.replace('{0}', PANCardNumberList[0]);
    param = param.replace('{1}', PANCardNumberList[1]);
    param = param.replace('{2}', PANCardNumberList[2]);
    param = param.replace('{3}', PANCardNumberList[3]);
    param = param.replace('{4}', PANCardNumberList[4]);
    param = param.replace('{5}', PANCardNumberList[5]);
    param = param.replace('{6}', PANCardNumberList[6]);
    param = param.replace('{7}', PANCardNumberList[7]);
    param = param.replace('{8}', PANCardNumberList[8]);
    param = param.replace('{9}', PANCardNumberList[9]);

    let doiString = date.format(firstHolder.ProfileDetails.DateOfBirth, "DDMMMYYYY");
    let doiList = doiString.split("");
    param = param.replace('{10}', doiList[0]);
    param = param.replace('{11}', doiList[1]);
    param = param.replace('{12}', doiList[2]);
    param = param.replace('{13}', doiList[3]);
    param = param.replace('{14}', doiList[4]);
    param = param.replace('{15}', doiList[5]);
    param = param.replace('{16}', doiList[6]);
    param = param.replace('{17}', doiList[7]);
    param = param.replace('{18}', doiList[8]);

    param = param.replace('{19}', firstHolder.ProfileDetails.Name.toUpperCase());

    if (firstHolder.CommincationDetails.LocalAddressTypeCode.toString() == '2') {
        param = param.replace('{20}', base64img.base64Sync(path.join('app', 'assets', 'images', 'selected-radiobutton.png')));
        param = param.replace('{21}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-radiobutton.png')));
        param = param.replace('{22}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-radiobutton.png')));
        param = param.replace('{23}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-radiobutton.png')));
    }
    else if (firstHolder.CommincationDetails.LocalAddressTypeCode.toString() == '3') {
        param = param.replace('{20}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-radiobutton.png')));
        param = param.replace('{21}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-radiobutton.png')));
        param = param.replace('{22}', base64img.base64Sync(path.join('app', 'assets', 'images', 'selected-radiobutton.png')));
        param = param.replace('{23}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-radiobutton.png')));
    }
    else {
        param = param.replace('{20}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-radiobutton.png')));
        param = param.replace('{21}', base64img.base64Sync(path.join('app', 'assets', 'images', 'selected-radiobutton.png')));
        param = param.replace('{22}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-radiobutton.png')));
        param = param.replace('{23}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-radiobutton.png')));
    }

    param = param.replace('{24}', firstHolder.ProfileDetails.PlaceOfIncorporation.toUpperCase());
    param = param.replace('{25}', firstHolder.ProfileDetails.CountryOfIncorporation.toUpperCase());

    switch (firstHolder.ProfileDetails.GrossAnnualIncomeCode.toString()) {
        case '31':
            param = param.replace('{26}', base64img.base64Sync(path.join('app', 'assets', 'images', 'partial-checkbox.png')));
            param = param.replace('{27}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{28}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{29}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{30}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{31}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            break;
        case '32':
            param = param.replace('{26}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{27}', base64img.base64Sync(path.join('app', 'assets', 'images', 'partial-checkbox.png')));
            param = param.replace('{28}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{29}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{30}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{31}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            break;
        case '33':
            param = param.replace('{26}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{27}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{28}', base64img.base64Sync(path.join('app', 'assets', 'images', 'partial-checkbox.png')));
            param = param.replace('{29}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{30}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{31}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            break;
        case '34':
            param = param.replace('{26}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{27}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{28}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{29}', base64img.base64Sync(path.join('app', 'assets', 'images', 'partial-checkbox.png')));
            param = param.replace('{30}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{31}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            break;
        case '35':
            param = param.replace('{26}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{27}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{28}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{29}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{30}', base64img.base64Sync(path.join('app', 'assets', 'images', 'partial-checkbox.png')));
            param = param.replace('{31}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            break;
        case '36':
            param = param.replace('{26}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{27}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{28}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{29}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{30}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{31}', base64img.base64Sync(path.join('app', 'assets', 'images', 'partial-checkbox.png')));
            break;
        default:
            param = param.replace('{26}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{27}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{28}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{29}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{30}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            param = param.replace('{31}', base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')));
            break;
    }

    param = param.replace('{32}', firstHolder.ProfileDetails.NetWorth);
    param = param.replace('{33}', (firstHolder.ProfileDetails.NetWorthDate == null) ? '' : date.format(firstHolder.ProfileDetails.NetWorthDate, "DD/MMM/YYYY"));
    param = param.replace('{34}', firstHolder.ProfileDetails.NatureOfBusiness.toUpperCase());

    if (firstHolder.UBODetails.length > 0) {
        param = param.replace('{35}', firstHolder.UBODetails[0].Name.toUpperCase());
        param = param.replace('{36}', firstHolder.UBODetails[0].PANCardNumber.toUpperCase());
        param = param.replace('{37}', firstHolder.UBODetails[0].PlaceOfBirth.toUpperCase() + ',' + firstHolder.UBODetails[0].CountryOfBirth.toUpperCase());
        param = param.replace('{38}', firstHolder.UBODetails[0].CountryName.toUpperCase());
        param = param.replace('{39}', firstHolder.UBODetails[0].OccupationName.toUpperCase());
        param = param.replace('{40}', firstHolder.UBODetails[0].CountryName.toUpperCase());
        param = param.replace('{41}', '');
        param = param.replace('{42}', date.format(firstHolder.UBODetails[0].DateOfBirth, "DD/MM/YYYY"));
        param = param.replace('{43}', firstHolder.UBODetails[0].GenderCode.toUpperCase());
    }
    else {
        param = param.replace('{35}', '');
        param = param.replace('{36}', '');
        param = param.replace('{37}', '');
        param = param.replace('{38}', '');
        param = param.replace('{39}', '');
        param = param.replace('{40}', '');
        param = param.replace('{41}', '');
        param = param.replace('{42}', '');
        param = param.replace('{43}', '');
    }

    if (firstHolder.UBODetails.length > 1) {
        param = param.replace('{44}', firstHolder.UBODetails[1].Name.toUpperCase());
        param = param.replace('{45}', firstHolder.UBODetails[1].PANCardNumber.toUpperCase());
        param = param.replace('{46}', firstHolder.UBODetails[1].PlaceOfBirth.toUpperCase() + ',' + firstHolder.UBODetails[1].CountryOfBirth.toUpperCase());
        param = param.replace('{47}', firstHolder.UBODetails[1].CountryName.toUpperCase());
        param = param.replace('{48}', firstHolder.UBODetails[1].OccupationName.toUpperCase());
        param = param.replace('{49}', firstHolder.UBODetails[1].CountryName.toUpperCase());
        param = param.replace('{50}', '');
        param = param.replace('{51}', date.format(firstHolder.UBODetails[1].DateOfBirth, "DD/MM/YYYY"));
        param = param.replace('{52}', firstHolder.UBODetails[1].GenderCode.toUpperCase());
    }
    else {
        param = param.replace('{44}', '');
        param = param.replace('{45}', '');
        param = param.replace('{46}', '');
        param = param.replace('{47}', '');
        param = param.replace('{48}', '');
        param = param.replace('{49}', '');
        param = param.replace('{50}', '');
        param = param.replace('{51}', '');
        param = param.replace('{52}', '');
    }

    if (firstHolder.UBODetails.length > 2) {
        param = param.replace('{53}', firstHolder.UBODetails[2].Name.toUpperCase());
        param = param.replace('{54}', firstHolder.UBODetails[2].PANCardNumber.toUpperCase());
        param = param.replace('{55}', firstHolder.UBODetails[2].PlaceOfBirth.toUpperCase() + ',' + firstHolder.UBODetails[2].CountryOfBirth.toUpperCase());
        param = param.replace('{56}', firstHolder.UBODetails[2].CountryName.toUpperCase());
        param = param.replace('{57}', firstHolder.UBODetails[2].OccupationName.toUpperCase());
        param = param.replace('{58}', firstHolder.UBODetails[2].CountryName.toUpperCase());
        param = param.replace('{59}', '');
        param = param.replace('{60}', date.format(firstHolder.UBODetails[2].DateOfBirth, "DD/MM/YYYY"));
        param = param.replace('{61}', firstHolder.UBODetails[2].GenderCode.toUpperCase());
    }
    else {
        param = param.replace('{53}', '');
        param = param.replace('{54}', '');
        param = param.replace('{55}', '');
        param = param.replace('{56}', '');
        param = param.replace('{57}', '');
        param = param.replace('{58}', '');
        param = param.replace('{59}', '');
        param = param.replace('{60}', '');
        param = param.replace('{61}', '');
    }

    if (firstHolder.UBODetails.length > 3) {
        param = param.replace('{62}', firstHolder.UBODetails[3].Name.toUpperCase());
        param = param.replace('{63}', firstHolder.UBODetails[3].PANCardNumber.toUpperCase());
        param = param.replace('{64}', firstHolder.UBODetails[3].PlaceOfBirth.toUpperCase() + ',' + firstHolder.UBODetails[3].CountryOfBirth.toUpperCase());
        param = param.replace('{65}', firstHolder.UBODetails[3].CountryName.toUpperCase());
        param = param.replace('{66}', firstHolder.UBODetails[3].OccupationName.toUpperCase());
        param = param.replace('{67}', firstHolder.UBODetails[3].CountryName.toUpperCase());
        param = param.replace('{68}', '');
        param = param.replace('{69}', date.format(firstHolder.UBODetails[3].DateOfBirth, "DD/MM/YYYY"));
        param = param.replace('{70}', firstHolder.UBODetails[3].GenderCode.toUpperCase());
    }
    else {
        param = param.replace('{62}', '');
        param = param.replace('{63}', '');
        param = param.replace('{64}', '');
        param = param.replace('{65}', '');
        param = param.replace('{66}', '');
        param = param.replace('{67}', '');
        param = param.replace('{68}', '');
        param = param.replace('{69}', '');
        param = param.replace('{70}', '');
    }

    param = param.replace('{71}', date.format(data.Created, 'DD-MM-YYYY'));
    param = param.replace('{72}', firstHolder.CommincationDetails.LocalCity.toUpperCase());

    let paramData = [];
    let paramList = param.split('|');
    for (let i = 0; i < paramList.length; i++) {
        paramData.push({ data: paramList[i] });
    }

    let fatcaData = {
        BSELogoImagePath: base64img.base64Sync(path.join('app', 'assets', 'images', 'bse-logo.png')),
        EmptyCheckboxImagePath: base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-checkbox.png')),
        PartialCheckboxImagePath: base64img.base64Sync(path.join('app', 'assets', 'images', 'partial-checkbox.png')),
        EmptyRadioImagePath: base64img.base64Sync(path.join('app', 'assets', 'images', 'empty-radiobutton.png')),
        SelectedRadioImagePath: base64img.base64Sync(path.join('app', 'assets', 'images', 'selected-radiobutton.png')),
        Param: paramData
    }

    let fileName = data.UCC + '-Non-Individual-FATCA' + '.pdf';

    var reportBuffer = await pdfEngine.GenerateA4PortraitFATCAPdfBuffer("clientnonindividualfatca.template.hbs", fatcaData, fileName, 'reports');

    return { FileName: fileName, ReportBuffer: reportBuffer };
};

Reports.ConvertPdfToTiff = async () => {
    try {
        var pdfFilePath = path.join(__dirname.replace("app", "public"), '..', 'documents', 'reports', 'FATCA_AAATC1240J.pdf');

        var imageFiles = [];

        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfJSWorker;
        const pdfDoc = await pdfjsLib.getDocument({ src: pdfFilePath }).promise;
        for (let i = 0; i < pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i + 1);
            const viewport = page.getViewport({ scale: 1.1 });
            const canvasDoc = canvas.createCanvas(viewport.width, viewport.height);
            const context = canvasDoc.getContext('2d');
            await page.render({ canvasContext: context, viewport, background: null }).promise;
            const imageDataURL = canvasDoc.toBuffer('image/png');

            var filepath = path.join(__dirname.replace("app", "public"), '..', 'documents', 'reports', 'temp', (i + 1) + '-' + 'FATCA_AAATC1240J.png');
            fileSystem.writeFileSync(filepath, imageDataURL);

            imageFiles.push(filepath);
        }

        for (let i = 0; i < imageFiles.length; i++) {
            var compressImageFile = await Jimp.read(imageFiles[i]);
            await compressImageFile.resize(500, Jimp.AUTO);
            await compressImageFile.writeAsync(imageFiles[i]);
        }

        var filepath = path.join(__dirname.replace("app", "public"), '..', 'documents', 'reports', 'temp', 'FATCA_AAATC1240J.png');

        if (imageFiles.length > 0) {
            var imageFile = await joinImages.joinImages(imageFiles);
            await imageFile.toFile(filepath);
        }

        var tifffilepath = path.join(__dirname.replace("app", "public"), '..', 'documents', 'reports', 'FATCA_AAATC1240J.tiff');
        var tiffImageFile = await Jimp.read(filepath);
        await tiffImageFile.writeAsync(tifffilepath);

        // var tiffBlob = await fileSystem.openAsBlob(tifffilepath);
        // var tiffFileArrayBuffer = await tiffBlob.arrayBuffer();

        // var tiffFileBuffer = CommonFunction.ArrayBufferToBase64(tiffFileArrayBuffer);

        // var tiffFileBuffer = fileSystem.readFileSync(tifffilepath, { encoding: 'base64' });

        return { FileName: 'FATCA_AAATC1240J.tiff' };
    }
    catch (err) {
        console.log(err);
    }
};

module.exports = Reports;
