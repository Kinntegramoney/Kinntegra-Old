var https = require('https');
const CommonFunction = require('./commonfunction.model');

const ImportDataService = function () { }

ImportDataService.GetAssociateList = async () => {
    try {
        return new Promise((resolve, reject) => {

            var headers = {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                // 'Content-Length': Buffer.byteLength(JSON.stringify(inputData)),
                // 'x-api-key': lendboxConfig.APIKey,
                // 'x-api-code': lendboxConfig.APICode
            };
            var options = {
                host: 'www.kinntegra.co.in',
                path: '/get_associate_pan',
                method: 'GET',
                headers: headers
            };

            var request = https.request(options, function (response) {
                response.setEncoding('utf8');

                response.on('data', async function (message) {
                    // console.log(message);

                    var result = JSON.parse(message);

                    resolve(result);
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

            // request.write(JSON.stringify(inputData));

            request.end();
        });
    }
    catch (err) {
        console.log(err);
    }
};

ImportDataService.GetAssociate = async (PANCardNumber) => {
    try {
        return new Promise((resolve, reject) => {

            var headers = {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                // 'Content-Length': Buffer.byteLength(JSON.stringify(inputData)),
                // 'x-api-key': lendboxConfig.APIKey,
                // 'x-api-code': lendboxConfig.APICode
            };
            var options = {
                host: 'www.kinntegra.co.in',
                path: '/get_associate_data/' + encodeURIComponent(PANCardNumber),
                method: 'GET',
                headers: headers
            };

            var request = https.request(options, function (response) {
                response.setEncoding('utf8');

                response.on('data', async function (message) {
                    // console.log(message);

                    var result = JSON.parse(message);

                    resolve(result);
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

            // request.write(JSON.stringify(inputData));

            request.end();
        });
    }
    catch (err) {
        console.log(err);
    }
};

ImportDataService.GetClientList = async () => {
    try {
        return new Promise((resolve, reject) => {

            var headers = {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                // 'Content-Length': Buffer.byteLength(JSON.stringify(inputData)),
                // 'x-api-key': lendboxConfig.APIKey,
                // 'x-api-code': lendboxConfig.APICode
            };
            var options = {
                host: 'www.kinntegra.co.in',
                path: '/get_lead_data',
                method: 'GET',
                headers: headers,
                timeout: 30000,
            };

            var request = https.request(options, function (response) {
                response.setEncoding('utf8');

                let responseData = '';

                response.on('data', (chunk) => { responseData += chunk });

                response.on('end', () => {
                    const resultData = responseData.toString();

                    var result = JSON.parse(resultData);

                    resolve(result);
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

            // request.write(JSON.stringify(inputData));

            request.end();
        });
    }
    catch (err) {
        console.log(err);
    }
};

ImportDataService.GetClient = async (Id) => {
    try {
        return new Promise((resolve, reject) => {

            var headers = {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                // 'Content-Length': Buffer.byteLength(JSON.stringify(inputData)),
                // 'x-api-key': lendboxConfig.APIKey,
                // 'x-api-code': lendboxConfig.APICode
            };
            var options = {
                host: 'www.kinntegra.co.in',
                path: '/get_client_data/' + encodeURIComponent(Id),
                method: 'GET',
                headers: headers,
                timeout: 30000,
            };

            var request = https.request(options, function (response) {
                response.setEncoding('utf8');

                let responseData = '';

                response.on('data', (chunk) => { responseData += chunk });

                response.on('end', () => {
                    const resultData = responseData.toString();

                    var result = JSON.parse(resultData);

                    resolve(result);
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

            // request.write(JSON.stringify(inputData));

            request.end();
        });
    }
    catch (err) {
        console.log(err);
    }
};

ImportDataService.GetDocument = async (documentUrl) => {
    try {
        return new Promise((resolve, reject) => {

            var urlPath = documentUrl.replace('https://kinntegra.co.in', '')

            var headers = {
                // 'Accept': 'application/json',
                // 'Content-type': 'application/json',
                // 'Content-Length': Buffer.byteLength(JSON.stringify(inputData)),
                // 'x-api-key': lendboxConfig.APIKey,
                // 'x-api-code': lendboxConfig.APICode
            };
            var options = {
                host: 'www.kinntegra.co.in',
                path: urlPath,
                method: 'GET',
                headers: headers,
                timeout: 30000,
                encoding: 'base64',
            };

            var request = https.request(options, function (response) {
                response.setEncoding('base64');

                let responseData = '';

                response.on('data', (chunk) => { responseData += chunk });

                response.on('end', () => {
                    resolve(Buffer.from(responseData, 'base64'));
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

            // request.write(JSON.stringify(inputData));

            request.end();
        });
    }
    catch (err) {
        console.log(err);
    }
};

ImportDataService.GetStateList = async () => {
    try {
        return new Promise((resolve, reject) => {

            var headers = {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                // 'Content-Length': Buffer.byteLength(JSON.stringify(inputData)),
                // 'x-api-key': lendboxConfig.APIKey,
                // 'x-api-code': lendboxConfig.APICode
            };
            var options = {
                host: 'www.kinntegra.co.in',
                path: '/get_state_list',
                method: 'GET',
                headers: headers,
                timeout: 30000,
            };

            var request = https.request(options, function (response) {
                response.setEncoding('utf8');

                let responseData = '';

                response.on('data', (chunk) => { responseData += chunk });

                response.on('end', () => {
                    const resultData = responseData.toString();

                    var result = JSON.parse(resultData);

                    resolve(result);
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

            // request.write(JSON.stringify(inputData));

            request.end();
        });
    }
    catch (err) {
        console.log(err);
    }
};

ImportDataService.GetBankList = async (from, to) => {
    try {
        return new Promise((resolve, reject) => {

            var headers = {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                // 'Content-Length': Buffer.byteLength(JSON.stringify(inputData)),
                // 'x-api-key': lendboxConfig.APIKey,
                // 'x-api-code': lendboxConfig.APICode
            };
            var options = {
                host: 'www.kinntegra.co.in',
                path: '/get_bank_list/' + from + '/' + to,
                method: 'GET',
                headers: headers,
                timeout: 30000,
            };

            var request = https.request(options, function (response) {
                response.setEncoding('utf8');

                let responseData = '';

                response.on('data', (chunk) => { responseData += chunk });

                response.on('end', () => {
                    const resultData = responseData.toString();

                    var result = JSON.parse(resultData);

                    resolve(result);
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

            // request.write(JSON.stringify(inputData));

            request.end();
        });
    }
    catch (err) {
        console.log(err);
    }
};

ImportDataService.GetTransactionUnitLedgerList = async () => {
    try {
        return new Promise((resolve, reject) => {

            var headers = {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                // 'Content-Length': Buffer.byteLength(JSON.stringify(inputData)),
                // 'x-api-key': lendboxConfig.APIKey,
                // 'x-api-code': lendboxConfig.APICode
            };
            var options = {
                host: 'www.kinntegra.co.in',
                path: '/get_transaction_unit_data',
                method: 'GET',
                headers: headers,
                timeout: 30000,
            };

            var request = https.request(options, function (response) {
                response.setEncoding('utf8');

                let responseData = '';

                response.on('data', (chunk) => { responseData += chunk });

                response.on('end', () => {
                    const resultData = responseData.toString();

                    var result = JSON.parse(resultData);

                    resolve(result);
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

            // request.write(JSON.stringify(inputData));

            request.end();
        });
    }
    catch (err) {
        console.log(err);
    }
};

ImportDataService.GetDateWiseTransactionUnitLedgerData = async (recordDate, transactionType) => {
    try {
        return new Promise((resolve, reject) => {

            var headers = {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                // 'Content-Length': Buffer.byteLength(JSON.stringify(inputData)),
                // 'x-api-key': lendboxConfig.APIKey,
                // 'x-api-code': lendboxConfig.APICode
            };
            var options = {
                host: 'www.kinntegra.co.in',
                path: '/get_sell_fund/' + transactionType + '/' + recordDate,
                method: 'GET',
                headers: headers,
                timeout: 30000,
            };

            var request = https.request(options, function (response) {
                response.setEncoding('utf8');

                let responseData = '';

                response.on('data', (chunk) => { responseData += chunk });

                response.on('end', () => {
                    const resultData = responseData.toString();

                    var result = JSON.parse(resultData);

                    resolve(result);
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

            // request.write(JSON.stringify(inputData));

            request.end();
        });
    }
    catch (err) {
        console.log(err);
    }
};

ImportDataService.GetTransactionUnitLedgerData = async (id) => {
    try {
        return new Promise((resolve, reject) => {

            var headers = {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                // 'Content-Length': Buffer.byteLength(JSON.stringify(inputData)),
                // 'x-api-key': lendboxConfig.APIKey,
                // 'x-api-code': lendboxConfig.APICode
            };
            var options = {
                host: 'www.kinntegra.co.in',
                path: '/get_transaction_unit_data_by_id/' + id,
                method: 'GET',
                headers: headers,
                timeout: 30000,
            };

            var request = https.request(options, function (response) {
                response.setEncoding('utf8');

                let responseData = '';

                response.on('data', (chunk) => { responseData += chunk });

                response.on('end', () => {
                    const resultData = responseData.toString();

                    var result = JSON.parse(resultData);

                    resolve(result);
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

            // request.write(JSON.stringify(inputData));

            request.end();
        });
    }
    catch (err) {
        console.log(err);
    }
};

ImportDataService.GetBSESchemeAmfiList = async () => {
    try {
        return new Promise((resolve, reject) => {

            var headers = {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                // 'Content-Length': Buffer.byteLength(JSON.stringify(inputData)),
                // 'x-api-key': lendboxConfig.APIKey,
                // 'x-api-code': lendboxConfig.APICode
            };
            var options = {
                host: 'www.kinntegra.co.in',
                path: '/get_scheme_data',
                method: 'GET',
                headers: headers,
                timeout: 30000,
            };

            var request = https.request(options, function (response) {
                response.setEncoding('utf8');

                let responseData = '';

                response.on('data', (chunk) => { responseData += chunk });

                response.on('end', () => {
                    const resultData = responseData.toString();

                    var result = JSON.parse(resultData);

                    resolve(result);
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

            // request.write(JSON.stringify(inputData));

            request.end();
        });
    }
    catch (err) {
        console.log(err);
    }
};

ImportDataService.GetAmfiNav = async (amfiCode) => {
    // try {
    return new Promise((resolve, reject) => {

        var headers = {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'verify': false,
            // 'Content-Length': Buffer.byteLength(JSON.stringify(inputData)),
            // 'x-api-key': lendboxConfig.APIKey,
            // 'x-api-code': lendboxConfig.APICode
        };
        var options = {
            host: 'api.mfapi.in',
            path: '/mf/' + amfiCode,
            method: 'GET',
            headers: headers,
            timeout: 30000,
        };

        var request = https.request(options, function (response) {
            response.setEncoding('utf8');

            let responseData = '';

            response.on('data', (chunk) => { responseData += chunk });

            response.on('end', () => {
                try {
                    const resultData = responseData.toString();

                    var result = JSON.parse(resultData);

                    if (result.data != null) {
                        result.data = result.data.map(x => {
                            const date = CommonFunction.ConvertDateDMYToYMD(x.date, '-');

                            return { ...x, date };
                        });
                    }

                    resolve(result);
                }
                catch (err) {
                    reject(err);
                }
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

        // request.write(JSON.stringify(inputData));

        request.end();
    });
    // }
    // catch (err) {
    //     console.log(err);
    // }
};

module.exports = ImportDataService;