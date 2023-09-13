const stringToArrayBuffer = (str: string) => {
  let buf = new ArrayBuffer(str.length);
  let bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};

const importSecretKey = async (rawKey: any, aesName: string) => {
  return await window.crypto.subtle.importKey('raw', rawKey, aesName, true, [
    'encrypt',
    'decrypt',
  ]);
};

export const fromHexString = (hexString: any) =>
  Uint8Array.from(
    hexString.match(/.{1,2}/g).map((byte: string) => parseInt(byte, 16)),
  );

const aesDecrypt = async (
  aesName: string,
  keyStr: string,
  keySize: number,
  iv: Uint8Array,
  encoded: Uint8Array,
) => {
  const alg = {
    name: aesName,
    iv,
    length: keySize,
  };

  let key = await importSecretKey(stringToArrayBuffer(atob(keyStr)), aesName);

  return await window.crypto.subtle.decrypt(alg, key, encoded);
};

const aesEncrypt = async (
  aesName: string,
  keyStr: string,
  keySize: number,
  iv: Uint8Array,
  encoded: Uint8Array,
) => {
  const alg = {
    name: aesName,
    iv,
    length: keySize,
  };
  let key = await importSecretKey(stringToArrayBuffer(atob(keyStr)), aesName);
  return await window.crypto.subtle.encrypt(alg, key, encoded);
};

export const Uint8ToBase64String = (u8a: any) => {
  return window.btoa(String.fromCharCode.apply(String, u8a));
};

export const Base64StringToUint8 = (base64: string) => {
  let binary_string = window.atob(base64);
  let len = binary_string.length;
  let bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
};

export const Uint8ArrayToBase64String = (u8a: Uint8Array) => {
  return Buffer.from(u8a).toString('base64')
  // return window.btoa(String.fromCharCode.apply(String, u8a));
};

export const GetAESBase64Key = async (hex_key: string) => {
  let master_key = await crypto.subtle.importKey(
    'raw',
    fromHexString(hex_key),
    {name: 'PBKDF2'},
    false,
    ['deriveKey'],
  );

  let aes_key_obj = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new Uint8Array(),
      info: new Uint8Array(),
      "iterations": 100000,
      hash: 'SHA-384',
    },
    master_key,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  );

  let arrayBuffer = await crypto.subtle.exportKey('raw', aes_key_obj);
  const base64String = btoa(
    String.fromCharCode(...new Uint8Array(arrayBuffer)),
  );

  return base64String;
};

export const aesGCMEncrypt = async (
  keyStr: string,
  iv: Uint8Array,
  inputByteData: Uint8Array,
) => {
  const keySize = 256;
  return await aesEncrypt('AES-GCM', keyStr, keySize, iv, inputByteData);
};

export const aesGCMDecrypt = async (
  keyStr: string,
  iv: Uint8Array,
  encoded: Uint8Array,
) => {
  const keySize = 256;
  return await aesDecrypt('AES-GCM', keyStr, keySize, iv, encoded);
};
