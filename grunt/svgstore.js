module.exports = {
    'options': {
        'prefix': 'icon-',
        'cleanup': false,
        'svg': {
            'style': 'display: none'
        }
    },
    'default': {
        'files': {
            './templates/components/common/icons/icon-defs.html': ['./assets/icons/**/*.svg']
        }
    }
};
