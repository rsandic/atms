module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-codekit');
    grunt.initConfig({
        // jshint: {
        //     scripts: {
        //         src: ['scripts/**.js', 'lib/**.js']
        //     },
        //     tests: { // We can have more than one jshint task, this ones called `jshint:tests`
        //         src: 'tests/**.js'
        //     }
        // },
        // uglify: {
        //     scripts: {
        //         expand: true,
        //         cwd: 'js/',
        //         src: '**.js',
        //         dest: 'js/',
        //         ext: '.min.js'
        //     }
        // },
        less: {
            styles: {
                files: {
                    'css/main.css': 'css/main.less' //destination source map
                },
                sourceMap: true
            },
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'css/',
                    src: ['main.css', '!*.min.css'],
                    dest: 'css/',
                    ext: '.min.css'
                }]
            }
        },
        codekit: {
            // globbed_example_config: {
            //     src: '*.kit',
            //     dest: 'build/html/'
            // },
            // explicit_output_names: {
            //     files: {
            //         'build/html/index.html': 'index.kit'
            //     }
            // },
            // build_with_underscored_files: {
            //     options: { compilePrefixed: true },
            //     files: {
            //         'build/about.html': '_about.kit',
            //         'build/index.html': '_index.kit'
            //     }
            // }
        },
        watch: {
            // scripts: {
            //     files: 'js/**.js',
            //     task: 'uglify:scripts'
            // },
            styles: {
                files: ['bower_components/bootstrap/less/**.less', 'css/**less'],
                tasks: ['less'],
                //event:['all'],
                options: {
                    spawn: false,
                    reload: true,
                    //nospawn: true //suprotno od spawn, spawn false, radi isto reloaduje task
                }
            }
        }
    });
    //grunt.loadNpmTasks('grunt-contrib-jshint');
    //grunt.registerTask('jsmin', ['uglify'])
    //grunt.registerTask('kit', ['codekit']);
    //grunt.registerTask('minCss', ['cssmin']);
    grunt.registerTask('default', ['less','watch']);
};