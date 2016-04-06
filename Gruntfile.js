module.exports = function(grunt) {
    require('time-grunt')(grunt);
    require('load-grunt-config')(grunt, {
        jitGrunt: {
            staticMappings: {
                scsslint: 'grunt-scss-lint'
            }
        }
    });

    grunt.registerTask('default', ['eslint', 'karma', 'scsslint', 'svgstore'])
};
