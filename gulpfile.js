/**
 * Gulp with WP
 * Implements:
 *  CSS: Sass to CSS conversion, Minification,
 *  JS: Concatenates and uglifies Vendor and Custom JS
 *
 *  @version 1.0.1
 */

// Start Project Variables

var config = {
    bowerDir: './bower_components',
    basePath: './public',
    baseSourcePath: './source',
    mapsPath: './maps'
};

const AUTOPREFIXER_BROWSERS = [
    'last 2 version',
    '> 1%',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
];

// Style related.
var styleSRC                = config.baseSourcePath + '/sass/style.scss'; // Path to main .scss file.
var styleDestination        = config.basePath + '/assets/css'; // Path to place the compiled CSS file.
// Default set to root folder.

// JS Custom related.
var jsCustomSRC         = config.baseSourcePath + '/js/manifest.js';
var jsCustomDestination = config.basePath + '/assets/js/dist';
var jsCustomFile        = '';

//End Project Variables

// Load all the modules from package.json
var gulp = require('gulp');

// CSS related plugins.
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var mmq          = require('gulp-merge-media-queries');

//JS related plugins

var uglify       = require('gulp-uglify');

//Utility related plugins
var environments = require('gulp-environments'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    include = require('gulp-include'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    bower = require('gulp-bower'),
    bs = require('browser-sync').create(),
    filter = require('gulp-filter'),
    lineec = require('gulp-line-ending-corrector'),
    runSequence = require('run-sequence');

var development = environments.development,
    production  = environments.production;

var staging = environments.make("staging");


// Default error handler
var onError = function (err) {
    console.log('An error occured:', err.message);
    this.emit('end');
};

// Install all Bower components
gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
});



// Jshint outputs any kind of javascript problems you might have
// Only checks javascript files inside /src directory
gulp.task('jshint', function () {
    return gulp.src(config.baseSourcePath + '/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

// Concatenates all files that it finds in the manifest
// and creates two versions: normal and minified.
// It's dependent on the jshint task to succeed.
gulp.task('scripts', ['jshint'], function () {
    return gulp.src(config.baseSourcePath + '/js/manifest.js')
        .pipe(include())
        .pipe(rename({basename: 'scripts'}))
        .pipe(gulp.dest(config.basePath + '/assets/js/dist'))
        // Normal done, time to create the minified javascript (scripts.min.js)
        // remove the following 3 lines if you don't want it
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(config.basePath + '/assets/js/dist'))
    //    .pipe(notify({title: 'Javascript', message: 'scripts task complete'}))
    //.pipe( livereload() );
});

// Different options for the Sass tasks
var options = {};
options.sass = {
    errLogToConsole: true,
    precision: 8,
    noCache: true,
    //imagePath: 'assets/img',
    includePaths: [
        config.baseSourcePath + '/sass/bootstrap-sass/assets/stylesheets'
    ]
};

options.sassmin = {
    errLogToConsole: true,
    precision: 8,
    noCache: true,
    outputStyle: 'compressed',
    //imagePath: 'assets/img',
    includePaths: [
        config.baseSourcePath + '/sass/bootstrap-sass/assets/stylesheets'
    ]
};

// Sass
gulp.task('sass', function () {
    return gulp.src(config.baseSourcePath + '/sass/styles.scss')
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass(options.sass))
        .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }
        ))
        .pipe(sourcemaps.write(config.mapsPath))
        //.pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(config.basePath + '/assets/css'));
       // .pipe(notify({title: 'Sass', message: 'sass task complete'}))

});

// Sass-min - Release build minifies CSS after compiling Sass
gulp.task('sass-min', function () {
    return gulp.src(config.baseSourcePath + '/sass/style.scss')
        .pipe(plumber())
        .pipe(sass(options.sassmin))
        .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }
        ))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(config.basePath + '/assets/css'))
       // .pipe(notify({title: 'Sass', message: 'sass-min task complete'}));
});


// Start the livereload server and watch files for change
gulp.task('watch', function () {



    gulp.watch(config.baseSourcePath + '/sass/**/*.scss', ['sass']);


});



gulp.task('default', ['watch'], function () {
    // Does nothing in this task, just triggers the dependent 'watch'
});


/**
 * Set Environments
 */


// ==== TASKS ==== //

/**
 * Task: `customJS`.
 *
 * Concatenate and uglify custom JS scripts.
 *
 * This task does the following:
 *     1. Gets the source folder for JS custom files
 *     2. Concatenates all the files and generates custom.js
 *     3. Renames the JS file with suffix .min.js
 *     4. Uglifes/Minifies the JS file and generates custom.min.js
 */

gulp.task('customJS', function () {
    return gulp.src(jsCustomSRC)
        .pipe(include())
        .pipe(rename({basename: 'scripts'}))
        .pipe(gulp.dest(config.baseSourcePath + '/js/dist'))
        .pipe(gulp.dest(jsCustomDestination))

});

gulp.task('customJS-min', function () {
    return gulp.src(jsCustomSRC)
        .pipe(include())
        .pipe(rename({basename: 'scripts'}))
        .pipe(gulp.dest(config.basePath + '/assets/js/dist'))
        .pipe(uglify())
        .pipe(gulp.dest(jsCustomDestination))

});
/**
 * Task: `styles`.
 *
 * Compiles Sass, Autoprefixes it and Minifies CSS.
 *
 * This task does the following:
 *    1. Gets the source scss file
 *    2. Compiles Sass to CSS
 *    3. Autoprefixes it and generates style.css
 */
gulp.task('styles', function () {
    return gulp.src(styleSRC)
        .pipe(plumber())
        .pipe(sass(options.sass))
        .pipe(gulp.dest(styleDestination))
});
/**
 * styles-min Minifies CSS
 */

gulp.task('styles-min', function () {
    return gulp.src(styleSRC)
        .pipe(plumber())
        .pipe(sass(options.sassmin))
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(lineec())
        .pipe(gulp.dest(styleDestination))
});


/**
 * Gulp Build Task
 *
 * Compiles styles, js
 * gulp build --env production
 *
 */

gulp.task('build', function () {

    switch (true) {
        case development() :
            runSequence('styles', 'customJS');
            break;
        case staging() :
            runSequence('bower','styles', 'customJS');
            break;
        case production() :
            runSequence('bower', 'styles-min', 'customJS-min');
            break;
        default:
            runSequence('styles', 'customJS');
    }
});