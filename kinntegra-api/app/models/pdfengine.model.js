const fileSystem = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');

const PdfEngine = function () { }

PdfEngine.GenerateA4PortraitPdf = async (pdfTemplate, data, fileName, reportType) => {
    var templatePath = path.join(__dirname.replace("models", ""), "templates", "reports", pdfTemplate);
    const templateString = fileSystem.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateString);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
        dumpio: false
    });
    const page = await browser.newPage();
    const html = template(data);


    await page.setCacheEnabled(false);
    await page.setContent(html, {
        waitUntil: ["load", "networkidle0"]
    });
    await page.addStyleTag({ path: path.join('app', '/assets/styles/reportstyle.scss') });

    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    const pdfFilePath = path.join(__dirname.replace("app", "public"), '..', 'documents', reportType, fileName);

    fileSystem.writeFileSync(pdfFilePath, pdfBuffer);

    return pdfFilePath;
};

PdfEngine.GenerateA4LandscapePdf = async (pdfTemplate, data, fileName, reportType) => {
    var templatePath = path.join(__dirname.replace("models", ""), "templates", "reports", pdfTemplate);
    const templateString = fileSystem.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateString);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
        dumpio: false
    });
    const page = await browser.newPage();
    const html = template(data);


    await page.setCacheEnabled(false);
    await page.setContent(html, {
        waitUntil: ["load", "networkidle0"]
    });
    await page.addStyleTag({ path: path.join('app', '/assets/styles/reportstyle.scss') });

    const pdfBuffer = await page.pdf({ format: 'A4', landscape: true });
    await browser.close();

    const pdfFilePath = path.join(__dirname.replace("app", "public"), '..', 'documents', reportType, fileName);

    fileSystem.writeFileSync(pdfFilePath, pdfBuffer);

    return pdfFilePath;
};

PdfEngine.GenerateA4PortraitPdfBuffer = async (pdfTemplate, data, fileName, reportType) => {
    var templatePath = path.join(__dirname.replace("models", ""), "templates", "reports", pdfTemplate);
    const templateString = fileSystem.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateString);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
        dumpio: false
    });
    const page = await browser.newPage();
    const html = template(data);


    await page.setCacheEnabled(false);
    await page.setContent(html, {
        waitUntil: ["load", "networkidle0"]
    });
    await page.addStyleTag({ path: path.join('app', '/assets/styles/reportstyle.scss') });

    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    const pdfFilePath = path.join(__dirname.replace("app", "public"), '..', 'documents', reportType, fileName);

    fileSystem.writeFileSync(pdfFilePath, pdfBuffer);

    return pdfBuffer;
};

PdfEngine.GenerateA4PortraitCEPPdfBuffer = async (pdfTemplate, data, fileName, reportType) => {
    var templatePath = path.join(__dirname.replace("models", ""), "templates", "reports", pdfTemplate);
    const templateString = fileSystem.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateString);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
        dumpio: false
    });
    const page = await browser.newPage();
    const html = template(data);


    await page.setCacheEnabled(false);
    await page.setContent(html, {
        waitUntil: ["load", "networkidle0"]
    });
    await page.addStyleTag({ path: path.join('app', '/assets/styles/cepstyle.scss') });

    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    const pdfFilePath = path.join(__dirname.replace("app", "public"), '..', 'documents', reportType, fileName);

    fileSystem.writeFileSync(pdfFilePath, pdfBuffer);

    // return pdfFilePath;

    return pdfBuffer;
};

PdfEngine.GenerateA4PortraitFATCAPdfBuffer = async (pdfTemplate, data, fileName, reportType) => {
    var templatePath = path.join(__dirname.replace("models", ""), "templates", "reports", pdfTemplate);
    const templateString = fileSystem.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateString);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
        dumpio: false
    });
    const page = await browser.newPage();
    const html = template(data);


    await page.setCacheEnabled(false);
    await page.setContent(html, {
        waitUntil: ["load", "networkidle0"]
    });
    await page.addStyleTag({ path: path.join('app', '/assets/styles/fatcastyle.scss') });

    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    const pdfFilePath = path.join(__dirname.replace("app", "public"), '..', 'documents', reportType, fileName);

    fileSystem.writeFileSync(pdfFilePath, pdfBuffer);

    return pdfBuffer;
};

PdfEngine.GenerateA5LandscapeMandatePdfBuffer = async (pdfTemplate, data, fileName, reportType) => {
    var templatePath = path.join(__dirname.replace("models", ""), "templates", "reports", pdfTemplate);
    const templateString = fileSystem.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateString);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
        dumpio: false
    });
    const page = await browser.newPage();
    const html = template(data);

    // fileSystem.writeFileSync(path.join(__dirname.replace("app", "public"), '..', 'documents', reportType, 'mandate.html'), html);

    await page.setCacheEnabled(false);
    await page.setContent(html, {
        waitUntil: ["load", "networkidle0"]
    });
    await page.addStyleTag({ path: path.join('app', '/assets/styles/mandatestyle.scss') });

    const pdfBuffer = await page.pdf({ format: 'A5', landscape: true });
    await browser.close();

    const pdfFilePath = path.join(__dirname.replace("app", "public"), '..', 'documents', reportType, fileName);

    fileSystem.writeFileSync(pdfFilePath, pdfBuffer);

    return pdfBuffer;
};

const eqHelper = function (a, b, options) {
    if (a === b) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
};

handlebars.registerHelper('eq', eqHelper);

module.exports = PdfEngine;