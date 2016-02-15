module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			css: {
				files: [
					'assets/sass/*.sass',
					'assets/sass/*.scss'
				],
				tasks: ['compass']
			},
			js: {
				files: [
					'assets/js/main.js',
					'Gruntfile.js'
				],
				tasks: ['jshint']
			}
		},
		compass: {
			dist: {
				options: {
					sassDir: 'assets/sass',
					cssDir: 'build/css',
					outputStyle: 'compressed'
				}
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: ['Gruntfile.js', 'assets/js/main.js']
		},
		concat: {
			js: {
				src: [
					'assets/js/jquery.min.js',
					'assets/js/jquery.scrollex.min.js',
					'assets/js/jquery.scrolly.min.js',
					'assets/js/jquery.poptrox.min.js',
					'assets/js/owl.carousel.min.js',
					'assets/js/skel.min.js',
					'assets/js/util.js',
					'assets/js/main.js'
				],
				dest: '.temp/js/main.js'
			},
			css: {
				src: [
					'assets/stylesheets/font-awesome.min',
					'assets/stylesheets/ProximaNovaLight',
					'assets/stylesheets/RalewayRegular',
					'assets/stylesheets/owl.carousel',
					'assets/stylesheets/owl.transitions'
				],
				dest: 'build/css/main.min.css'
			}
		},
		uglify: {
			js: {
				files: {
					'build/js/main.min.js': ['.temp/js/main.js']
				}
			}
		},
		jsbeautifier: {
			files: ['Gruntfile.js', 'assets/js/main.js'],
			options: {
				js: {
					indentSize: 1,
					indentChar: '	'
				}
			}
		},
		imagemin: {
			static: {
				options: {
					optimizationLevel: 1
				},
				files: [{
					expand: true,						// Enable dynamic expansion
					cwd: 'assets/stylesheets/images',	// Src matches are relative to this path
					src: ['**/*.{png,jpg,gif,svg}'],		// Actual patterns to match
					dest: 'build/css/images'			// Destination path prefix
				}]
			},
			dynamic: {
				options: {
					optimizationLevel: 1
				},
				files: [{
					expand: true,
					cwd: 'images/',
					src: ['**/*.{png,jpg,gif,svg}'],
					dest: 'build/img'
				}]
			}
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					'index.html': 'index-dev.html',
				}
			}
		},
		clean: ['build/', '.temp'],
		copy: {
			fonts: {
				files: [
					{
						expand: true,
						cwd: 'assets/',
						src: ['fonts/*'],
						dest: 'build/fonts',
						filter: 'isFile',
						flatten: true
					}
				]
			}
		}
	});

	// Load the Grunt plugins.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jsbeautifier');

	// Register the default tasks.
	grunt.registerTask('default', ['clean', 'copy', 'compass', 'htmlmin', 'concat', 'uglify', 'imagemin']);

	grunt.registerTask('watch', ['jsbeautifier', 'jshint', 'compass', 'watch']);
};
