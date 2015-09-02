module.exports = {
    options: {
        prefix: 'icon-',
        cleanup: false,
        includeTitleElement: false
    },

    'default': {
        files: {
            './templates/components/common/icons/icon-defs.html': ['./assets/icons/**/*.svg']
        }
    }
};
