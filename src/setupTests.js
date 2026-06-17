import '@testing-library/jest-dom';

// jsdom in this version has no crypto at all — polyfill it
if (!global.crypto) {
  global.crypto = {};
}
if (typeof global.crypto.randomUUID !== 'function') {
  global.crypto.randomUUID = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
}