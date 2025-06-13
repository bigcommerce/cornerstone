module.exports = {
    jest: {
        cmd: 'npx',
        args: [
            'jest',
        ],
    },
    prettier: {
        cmd: 'npx',
        args: [
            'prettier',
            '--check',
            'assets/scss/**/*.scss',
        ],
    },
};
