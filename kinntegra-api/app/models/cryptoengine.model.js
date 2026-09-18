const cryptojs = require("crypto-js");
const mfuConfig = require("../configs/mfu.config");
const key = process.env.CRYPTO_KEY;
const paramKey = process.env.CRYPTO_PARAM_KEY;

const CryptoEngine = function () { }

CryptoEngine.Encrypt = (toEncrypt, useHashing) => {
    var toEncryptArray = cryptojs.enc.Utf8.parse(toEncrypt);
    var keyArray;

    if (useHashing) {
        keyArray = cryptojs.MD5(cryptojs.enc.Utf8.parse(key));
    }
    else {
        keyArray = cryptojs.enc.Utf8.parse(key);
    }

    var options = {
        mode: cryptojs.mode.ECB,
        padding: cryptojs.pad.Pkcs7
    };

    var encrypted = cryptojs.TripleDES.encrypt(toEncryptArray, keyArray, options);

    return encrypted.toString();
};

CryptoEngine.Decrypt = (cipherString, useHashing) => {
    var keyArray;

    if (useHashing) {
        keyArray = cryptojs.MD5(cryptojs.enc.Utf8.parse(key));
    }
    else {
        keyArray = cryptojs.enc.Utf8.parse(key);
    }

    var options = {
        mode: cryptojs.mode.ECB,
        padding: cryptojs.pad.Pkcs7
    };

    var decrypted = cryptojs.TripleDES.decrypt(cipherString, keyArray, options);

    return cryptojs.enc.Utf8.stringify(decrypted);
};

CryptoEngine.ParamEncrypt = (toEncrypt, useHashing) => {
    var toEncryptArray = cryptojs.enc.Utf8.parse(toEncrypt);
    var keyArray;

    if (useHashing) {
        keyArray = cryptojs.MD5(cryptojs.enc.Utf8.parse(paramKey));
    }
    else {
        keyArray = cryptojs.enc.Utf8.parse(paramKey);
    }

    var options = {
        mode: cryptojs.mode.ECB,
        padding: cryptojs.pad.Pkcs7
    };

    var encrypted = cryptojs.TripleDES.encrypt(toEncryptArray, keyArray, options);

    return CryptoEngine.StringToHex(encrypted.toString());
};

CryptoEngine.ParamDecrypt = (cipherString, useHashing) => {
    var keyArray;

    if (useHashing) {
        keyArray = cryptojs.MD5(cryptojs.enc.Utf8.parse(paramKey));
    }
    else {
        keyArray = cryptojs.enc.Utf8.parse(paramKey);
    }

    var options = {
        mode: cryptojs.mode.ECB,
        padding: cryptojs.pad.Pkcs7
    };

    var decrypted = cryptojs.TripleDES.decrypt(CryptoEngine.HexToString(cipherString), keyArray, options);
    return cryptojs.enc.Utf8.stringify(decrypted);
};

CryptoEngine.MFUEncrypt = (toEncrypt, useHashing) => {
    var toEncryptArray = cryptojs.enc.Utf8.parse(toEncrypt);
    var keyArray;

    if (useHashing) {
        keyArray = cryptojs.MD5(cryptojs.enc.Utf8.parse(mfuConfig.SymmetricKey));
    }
    else {
        keyArray = cryptojs.enc.Utf8.parse(mfuConfig.SymmetricKey);
    }

    var options = {
        mode: cryptojs.mode.ECB,
        padding: cryptojs.pad.Pkcs7
    };

    var encrypted = cryptojs.AES.encrypt(toEncryptArray, keyArray, options);

    return encrypted.toString();
};

CryptoEngine.MFUDecrypt = (cipherString, useHashing) => {
    var keyArray;

    if (useHashing) {
        keyArray = cryptojs.MD5(cryptojs.enc.Utf8.parse(mfuConfig.SymmetricKey));
    }
    else {
        keyArray = cryptojs.enc.Utf8.parse(mfuConfig.SymmetricKey);
    }

    var options = {
        mode: cryptojs.mode.ECB,
        padding: cryptojs.pad.Pkcs7
    };

    var decrypted = cryptojs.AES.decrypt(cipherString, keyArray, options);

    return cryptojs.enc.Utf8.stringify(decrypted);
};


CryptoEngine.StringToHex = (stringData) => {
    return Buffer.from(stringData, 'utf8').toString('hex');
};

CryptoEngine.HexToString = (hexData) => {
    return Buffer.from(hexData, 'hex').toString('utf8');
};

module.exports = CryptoEngine;