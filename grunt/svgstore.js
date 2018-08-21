module.exports = {
    options: {
        prefix: 'icon-',
        cleanup: false,
        includeTitleElement: false
    },

    'default': {
        files: {
            './assets/img/icon-sprite.svg': ['./assets/icons/**/*.svg'],
            './templates/components/amp/common/icon-defs.html': ['./assets/icons/**/*.svg']
        }
    }
};
