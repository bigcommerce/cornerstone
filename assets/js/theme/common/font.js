const WebFont = require('webfontloader');

const linkEl = document.querySelector('link[href*="https://fonts.googleapis.com/css"]');
const fontUrl = linkEl.getAttribute('href');
const regexFontsCollection = /family=([^&]*)/gm;
const families = regexFontsCollection.exec(fontUrl)[1].replace(/\+/gm, ' ').split('|');

WebFont.load({
    custom: {
        families,
    },
    classes: false,
});
