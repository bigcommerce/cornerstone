export const isBrowserIE = navigator.userAgent.includes('Trident');

export const convertIntoArray = collection => Array.prototype.slice.call(collection);
