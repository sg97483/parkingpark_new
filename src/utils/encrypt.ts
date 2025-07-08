export const encrypt = (text: string) => {
  console.log('🚀 ~ file: encrypt.ts:2 ~ encrypt ~ text', text);
  const sha1 = require('js-sha1');
  var sha1Plus = sha1.create();
  sha1Plus.update(text);
  var sha2Plus = sha1.create();
  const password = sha1Plus.hex(text);
  sha2Plus.update(password.substring(6));

  return text === '' ? '' : sha2Plus.hex();
};

export const crypto = (str: string) => {
  const keyChar = new Uint8Array([10, 30, 50, 70, 90]);
  const codeChar = new Uint8Array(str.length);
  for (let x = 0, y = 0; x < str.length; x++) {
    codeChar[x] = str.charCodeAt(x) ^ keyChar[y];
    y = ++y < keyChar.length ? y : 0;
  }
  return String.fromCharCode(...codeChar);
};

export const generateRandomId = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

export const getRandomBoolean = () => Math.random() < 0.5;
