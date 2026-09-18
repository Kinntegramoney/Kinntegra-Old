import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class AppCryptoService {
  private Key = "!29D26m#91k90T*";
  private Iv = CryptoJS.enc.Utf8.parse("!29D26m#91k90T*");
  private paramKey = "!29D26m#91k90T*";

  constructor() { }

  Encrypt(toEncrypt: any): any {
    return CryptoJS.AES.encrypt(toEncrypt, this.Key, {
      keySize: 128 / 8,
      iv: this.Iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString();
  }

  Decrypt(toDecrypt: any): any {
    return CryptoJS.AES.decrypt(toDecrypt, this.Key, {
      keySize: 128 / 8,
      iv: this.Iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
  }

  ParamEncrypt(toEncrypt: any): any {
    let useHashing = true
    var toEncryptArray = CryptoJS.enc.Utf8.parse(toEncrypt);
    var keyArray;

    if (useHashing) {
      keyArray = CryptoJS.MD5(CryptoJS.enc.Utf8.parse(this.paramKey));
    }
    else {
      keyArray = CryptoJS.enc.Utf8.parse(this.paramKey);
    }

    var options = {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    };

    var encrypted = CryptoJS.TripleDES.encrypt(toEncryptArray, keyArray, options);

    return this.StringToHex(encrypted.toString());
  }

  ParamDecrypt(cipherString: any): any {
    let useHashing = true;
    var keyArray;

    if (useHashing) {
      keyArray = CryptoJS.MD5(CryptoJS.enc.Utf8.parse(this.paramKey));
    }
    else {
      keyArray = CryptoJS.enc.Utf8.parse(this.paramKey);
    }

    var options = {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    };

    var decrypted = CryptoJS.TripleDES.decrypt(this.HexToString(cipherString), keyArray, options);
    return CryptoJS.enc.Utf8.stringify(decrypted);
  }

  StringToHex(stringData: any): any {
    return Buffer.from(stringData, 'utf8').toString('hex');
  }

  HexToString(hexData: any): any {
    return Buffer.from(hexData, 'hex').toString('utf8');
  }
}
