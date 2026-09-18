"""
Python port of the legacy Node `cryptoengine.model.js` (crypto-js TripleDES/ECB).

crypto-js `TripleDES.encrypt(data, keyWordArray, {ECB, Pkcs7})` with a 16-byte
(MD5) key expands the key to 24 bytes by appending a zero 8-byte subkey
(k3 = 0x00..00). We replicate that exactly so ciphertext matches the Node app,
which lets FastAPI talk to the same Azure SQL stored procedures and JWTs.
"""
import base64
import hashlib
import os
from Crypto.Cipher import DES3


def _get_key(param: bool) -> str:
    return os.environ["CRYPTO_PARAM_KEY"] if param else os.environ["CRYPTO_KEY"]


def _key24(key_str: str, use_hashing: bool) -> bytes:
    if use_hashing:
        k = hashlib.md5(key_str.encode("utf-8")).digest()  # 16 bytes
    else:
        k = key_str.encode("utf-8")
    # crypto-js 128-bit 3DES uses K1|K2|K1; pyca/pycryptodome interpret a
    # 16-byte key the same way, so pass it through unchanged.
    return k


def _pkcs7_pad(data: bytes) -> bytes:
    pad = 8 - (len(data) % 8)
    return data + bytes([pad]) * pad


def _pkcs7_unpad(data: bytes) -> bytes:
    if not data:
        return data
    pad = data[-1]
    if 1 <= pad <= 8:
        return data[:-pad]
    return data


def _encrypt_raw(plain: str, key_str: str, use_hashing: bool) -> str:
    cipher = DES3.new(_key24(key_str, use_hashing), DES3.MODE_ECB)
    ct = cipher.encrypt(_pkcs7_pad(plain.encode("utf-8")))
    return base64.b64encode(ct).decode("ascii")


def _decrypt_raw(b64: str, key_str: str, use_hashing: bool) -> str:
    cipher = DES3.new(_key24(key_str, use_hashing), DES3.MODE_ECB)
    pt = cipher.decrypt(base64.b64decode(b64))
    return _pkcs7_unpad(pt).decode("utf-8")


def _to_hex(s: str) -> str:
    return s.encode("utf-8").hex()


def _from_hex(h: str) -> str:
    return bytes.fromhex(h).decode("utf-8")


def encrypt(plain, use_hashing: bool = True) -> str:
    return _encrypt_raw(str(plain), _get_key(False), use_hashing)


def decrypt(cipher_b64: str, use_hashing: bool = True) -> str:
    return _decrypt_raw(cipher_b64, _get_key(False), use_hashing)


def param_encrypt(plain, use_hashing: bool = True) -> str:
    return _to_hex(_encrypt_raw(str(plain), _get_key(True), use_hashing))


def param_decrypt(cipher_hex: str, use_hashing: bool = True) -> str:
    return _decrypt_raw(_from_hex(cipher_hex), _get_key(True), use_hashing)


if __name__ == "__main__":
    ref = {
        "encrypt_password": "fxOGvBO2hh/GHHppHrqMjQ==",
        "encrypt_pin": "/DBtb3gib+M=",
        "paramencrypt_42": "76754b6b4e594973546a4d3d",
        "paramencrypt_1": "4b31474b714330623142773d",
    }
    got = {
        "encrypt_password": encrypt("Password@123", True),
        "encrypt_pin": encrypt("123456", True),
        "paramencrypt_42": param_encrypt("42", True),
        "paramencrypt_1": param_encrypt("1", True),
    }
    ok = True
    for k in ref:
        match = ref[k] == got[k]
        ok = ok and match
        print(f"{'OK ' if match else 'FAIL'} {k}: got={got[k]} ref={ref[k]}")
    print("roundtrip param_decrypt(42):", param_decrypt(param_encrypt("42")))
    print("roundtrip decrypt(pw):", decrypt(encrypt("Password@123")))
    print("ALL_MATCH:", ok)
