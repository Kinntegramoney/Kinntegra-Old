var https = require('https');
const date = require('date-and-time');
const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const archiver = require('archiver');
const path = require('path');
const fileSystem = require("fs");

const httpAgent = new https.Agent({
    keepAlive: true,
    keepAliveMsecs: 30000,
    maxSockets: 50,
    maxFreeSockets: 20,
    scheduling: "lifo",
    timeout: 60000
});

const CommonFunction = function () { }

CommonFunction.GetRandomNumber = (numberOfDigits) => {
    var randomNumber = "";

    for (let i = 0; i < Number(numberOfDigits); i++) {
        randomNumber += (Math.floor(Math.random() * 10)).toString();
    }

    return randomNumber;
};

CommonFunction.GetUniqueId = () => {
    return uuidv4();
};

CommonFunction.padLeft = (text, padChar, size) => {
    return String(text).padStart(size, padChar);
};

CommonFunction.ConvertToIndianCurrency = (num) => {
    // Constants are defined
    var digit = [];
    digit[0] = "";
    digit[1] = "One ";
    digit[2] = "Two ";
    digit[3] = "Three ";
    digit[4] = "Four ";
    digit[5] = "Five ";
    digit[6] = "Six ";
    digit[7] = "Seven ";
    digit[8] = "Eight ";
    digit[9] = "Nine ";
    digit[10] = "Ten ";
    digit[11] = "Eleven ";
    digit[12] = "Twelve ";
    digit[13] = "Thirteen ";
    digit[14] = "Fourteen ";
    digit[15] = "Fifteen ";
    digit[16] = "Sixteen ";
    digit[17] = "Seventeen ";
    digit[18] = "Eighteen ";
    digit[19] = "Nineteen ";
    digit[20] = "Twenty ";
    digit[30] = "Thirty ";
    digit[40] = "Forty ";
    digit[50] = "Fifty ";
    digit[60] = "Sixty ";
    digit[70] = "Seventy ";
    digit[80] = "Eighty ";
    digit[90] = "Ninety ";
    digit[100] = "Hundred ";

    var tt = [];
    tt[2] = "Thousand ";
    tt[3] = "Lakh ";
    tt[4] = "Crore ";
    tt[5] = "Hundred Crore ";

    // Separating the whole number and digits
    var nn = "";
    var dd = "";
    var numStr = parseFloat(num).toFixed(2).toString();
    if (numStr.indexOf('.') !== -1) {
        dd = numStr.split('.')[1];
        nn = numStr.split('.')[0];
    } else {
        nn = numStr;
    }

    // Variables to store the word representation
    var str = "";
    var str1 = "";

    var x = nn.length - 1;
    var y = 0;
    var z = "";

    if (x > 1) {
        while (x > -1) {
            if (y === 0) {
                z = nn.substring(x - 1, x + 1);
                if (parseInt(z) < 21 && parseInt(z) > 0) {
                    str = digit[parseInt(z)] + str;
                } else if (parseInt(z) > 0) {
                    str = digit[parseInt(z[0]) * 10] + digit[parseInt(z[1])] + str;
                }
                x = x - 2;
            }

            if (y === 1) {
                z = nn.substring(x, x + 1);
                if (parseInt(z) !== 0) {
                    str = digit[parseInt(z)] + "Hundred " + str;
                }
                x = x - 1;
            }

            if (y > 1) {
                if (x !== 0) {
                    z = nn.substring(x - 1, x + 1);
                    if (parseInt(z) < 21 && parseInt(z) > 0) {
                        str = digit[parseInt(z)] + tt[y] + str;
                    } else if (parseInt(z) > 0) {
                        str1 = digit[parseInt(z[0]) * 10] + digit[parseInt(z[1])];
                        str = str1 + tt[y] + str;
                    }
                    x = x - 2;
                } else {
                    z = nn.substring(0, 1);
                    if (parseInt(z) < 21 && parseInt(z) > 0) {
                        str = digit[parseInt(z)] + tt[y] + str;
                    } else if (parseInt(z) > 0) {
                        str1 = digit[parseInt(z[0]) * 10] + digit[parseInt(z[1])];
                        str = str1 + tt[y] + str;
                    }
                    x = -1;
                }
            }

            y = y + 1;
        }
    } else {
        if (parseInt(nn) < 21 && parseInt(nn) > 0) {
            str = digit[parseInt(nn)];
        } else if (parseInt(nn) > 0) {
            str = digit[parseInt(nn[0]) * 10] + digit[parseInt(nn[1])];
        }
    }

    if (str === "") {
        str = "Zero ";
    }

    str = str + "Rupees ";

    // Digits are evaluated (Paise)
    if (parseInt(dd) > 0) {
        if (dd.length === 1) {
            z = parseInt(dd) * 10;
        } else {
            z = dd;
        }

        if (parseInt(z) < 21 && parseInt(z) > 0) {
            str = str + "and " + digit[parseInt(z)] + "Paise";
        } else if (parseInt(z) > 0) {
            str1 = digit[parseInt(z[0]) * 10] + digit[parseInt(z[1])];
            str = str + "and " + str1 + "Paise";
        }
    }

    // Return the word representation
    return str.trim() + " Only";
};

CommonFunction.FormatToINR = (num) => {
    let decimal = (num - Math.floor(num)).toString();
    let money = Math.floor(num).toString();
    let length = money.length;
    let delimiter = '';
    let reversedMoney = money.split('').reverse().join('');

    for (let i = 0; i < length; i++) {
        if ((i == 3 || (i > 3 && (i - 1) % 2 == 0)) && i != length) {
            delimiter += ',';
        }
        delimiter += reversedMoney[i];
    }

    let result = delimiter.split('').reverse().join('');
    decimal = decimal.replace(/0\./, '.').substring(0, 3);

    if (decimal !== '0') {
        result += decimal;
    }

    return result;
};

CommonFunction.ToArrayBuffer = (buffer) => {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return arrayBuffer;
};

CommonFunction.ArrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

CommonFunction.Levenshtein = (a, b) => {
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,    // Deletion
                    matrix[i][j - 1] + 1,    // Insertion
                    matrix[i - 1][j - 1] + 1 // Substitution
                );
            }
        }
    }

    return matrix[a.length][b.length];
};

CommonFunction.ConvertDateDMYToYMD = (inputDate, separator) => {
    var outputDate = '';
    // console.log(inputDate);
    var months = getMonths();

    if (inputDate != '') {
        if (inputDate.toString().includes('.')) {
            outputDate = date.format(new Date(inputDate), 'YYYY-MM-DD');
        }
        else {
            var dateTimeList = inputDate.split(' ');
            var dateList = dateTimeList[0].split(separator);
            var monthNumber = dateList[1];
            var month = months.find(x => x.ShortName.toLowerCase() == dateList[1].toString().toLowerCase());
            if (month != null) {
                monthNumber = month.MonthNumber;
            }

            outputDate = dateList[2] + '-' + monthNumber + '-' + dateList[0];
        }
    }

    return outputDate;
};

CommonFunction.ExcelDateToJSDate = (serial) => {
    let excelEpoch = new Date(1900, 0, 1);
    let daysOffset = serial - 1; // Excel mistakenly includes 1900-02-29 (which never existed)

    if (serial >= 60) {
        daysOffset--; // Adjust for Excel's leap year bug
    }

    return new Date(excelEpoch.getTime() + daysOffset * 86400000);
};

CommonFunction.GetGreaterNearest = (array, search) => {
    array.sort(function (a, b) { return a - b });

    let first = array.length > 0 ? array[0] : null;

    for (let i = 0; i < array.length; i++) {
        const value = Number(array[i]);
        if (value >= search) {
            return value;
        }
    }

    return first;
};

CommonFunction.GetNextValue = (array, search) => {
    array.sort(function (a, b) { return a - b });

    let first = array.length > 0 ? array[0] : null;

    for (let i = 0; i < array.length; i++) {
        const val = Number(array[i]);
        if (val > search) {
            return val;
        }
    }

    return first;
};

CommonFunction.FormatYMDDateWithSeparator = (inputDate, separator) => {
    var outputDate = ''

    if (inputDate != '') {
        if (inputDate.toString().includes('/') || inputDate.toString().includes('-')) {
            inputDate = inputDate.replaceAll('/', '').replaceAll('-', '');
        }
        else if (inputDate.toString().includes('.')) {
            return null;
        }

        var year = inputDate.toString().substr(4, 4).toString();
        var month = inputDate.toString().substr(2, 2).toString();
        var day = inputDate.toString().substr(0, 2).toString();

        outputDate = year + separator + month + separator + day;
    }

    return outputDate;
};

CommonFunction.GetNumberOfDays = (startYMDDateString, endYMDDateString) => {
    const startDate = new Date(startYMDDateString);
    const endDate = new Date(endYMDDateString);

    // Calculate the difference in milliseconds
    const diffInMs = endDate - startDate;

    // Convert milliseconds to days
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays;
};

CommonFunction.ZipDirectory = async (sourceDir, outPath) => {
    return new Promise((resolve, reject) => {
        const archive = archiver('zip', { zlib: { level: 9 } });
        const stream = fileSystem.createWriteStream(outPath);

        archive
            .directory(sourceDir, false)
            .on('error', err => reject(err))
            .pipe(stream)
            ;

        stream.on('close', () => resolve());
        archive.finalize();
    });
};

CommonFunction.SendRequest = async (options, body) => {
    return new Promise((resolve, reject) => {

        options.agent = httpAgent;

        if (body) {
            options.headers["Content-Length"] =
                Buffer.byteLength(body);
        }

        const req = https.request(options, (res) => {

            let response = "";

            res.setEncoding("utf8");

            res.on("data", chunk => {
                response += chunk;
            });

            res.on("end", () => {
                res.resume();
                resolve(response);
            });

        });

        req.setTimeout(30000, () => {
            req.destroy(new Error("Request timeout"));
        });

        req.on("error", reject);

        if (body)
            req.write(body);

        req.end();

    });
};


function getMonths() {
    return [
        { ShortName: 'Jan', MonthNumber: '01' },
        { ShortName: 'Feb', MonthNumber: '02' },
        { ShortName: 'Mar', MonthNumber: '03' },
        { ShortName: 'Apr', MonthNumber: '04' },
        { ShortName: 'May', MonthNumber: '05' },
        { ShortName: 'Jun', MonthNumber: '06' },
        { ShortName: 'Jul', MonthNumber: '07' },
        { ShortName: 'Aug', MonthNumber: '08' },
        { ShortName: 'Sep', MonthNumber: '09' },
        { ShortName: 'Oct', MonthNumber: '10' },
        { ShortName: 'Nov', MonthNumber: '11' },
        { ShortName: 'Dec', MonthNumber: '12' },
    ];
};

module.exports = CommonFunction;