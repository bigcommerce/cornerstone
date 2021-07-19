module.exports = function (grunt) {
    require('time-grunt')(grunt);
    require('load-grunt-config')(grunt);

    grunt.loadNpmTasks('grunt-run');
    grunt.loadNpmTasks('grunt-stylelint');
    grunt.registerTask('default', ['eslint', 'svgstore']);
};
