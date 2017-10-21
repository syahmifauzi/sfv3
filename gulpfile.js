'use strict';

var gulp          = require('gulp'),
    shell         = require('gulp-shell'),
    jade          = require('gulp-jade'),

    sass          = require('gulp-sass'),
    uncss         = require('gulp-uncss'),
    nano          = require('gulp-cssnano'),
    sourcemaps    = require('gulp-sourcemaps'),
    autoprefixer  = require('gulp-autoprefixer'),

    uglify        = require('gulp-uglify'),
    concat        = require('gulp-concat'),
    rename        = require('gulp-rename'),
    runSequence   = require('run-sequence'),
    browserSync   = require('browser-sync').create();


gulp.task('default', function(callback) {
    runSequence(
        'browser-sync',
        ['jade', 'sass', 'sass:vendors', 'js', 'js:vendors', 'copy'],
        callback
    );
});


// Static Server + Watching Files..
gulp.task('browser-sync', ['jekyll-build'], function() {
    browserSync.init({
        server: {
            baseDir: '_site/'
        }
    });
    gulp.watch(['_config.yml', '_data/**/*.yml', 'README.md'], ['jekyll-rebuild']);
    gulp.watch(['*.{md,html}', '_includes/**/*.html', '_layouts/*.html', '_posts/*.*'], ['jekyll-rebuild']);
    gulp.watch(['_jadefiles/**/*.jade'], ['jade']);
    gulp.watch(['assets/css/**/*.scss', '!assets/css/vendors.scss','!assets/css/0-vendors/**/*.scss'], ['sass']);
    gulp.watch(['assets/css/vendors.scss', 'assets/css/0-vendors/**/*.scss'], ['sass:vendors']);
    gulp.watch(['assets/js/app.js'], ['js']);
    gulp.watch(['!assets/js/app.js', 'assets/js/**/*.js'], ['js:vendors']);
    gulp.watch(['assets/img/**/*'], ['copy']);
});


// Run jekyll command in console..
gulp.task('jekyll-build', shell.task(['bundle exec jekyll build']));


// Rebuild jekyll..
gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
    browserSync.reload();
});


// Jade.. SASS(and Vendors).. JS(and Vendors).. Static Files..
// -----------------------------------------------------------
gulp.task('jade', function() {
    return gulp.src('_jadefiles/**/*.jade')
    .pipe(jade({ pretty: true }))
        // Run errorHandler if have error
        .on('error', errorHandler)
    .pipe(gulp.dest('_includes'));
});

gulp.task('sass', function() {
    return gulp.src('assets/css/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'compressed',
        onError: browserSync.notify
    }))
        // Run errorHandler if have error
        .on('error', errorHandler)
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(nano())
    .pipe(gulp.dest('_site/assets/css'))
    .pipe(browserSync.stream())
    .pipe(gulp.dest('assets/css'));
});

gulp.task('sass:vendors', function() {
    return gulp.src('assets/css/vendors.scss')
    .pipe(sass({
        outputStyle: 'compressed',
        onError: browserSync.notify
    }))
        // Run errorHandler if have error
        .on('error', errorHandler)
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    // .pipe(uncss({
    //     html: ['index.html', '_includes/**/*.html', '_layouts/**/*.html', '_posts/**/*.html']
    // }))
    .pipe(nano())
    .pipe(gulp.dest('_site/assets/css'))
    .pipe(browserSync.stream())
    .pipe(gulp.dest('assets/css'));
});

gulp.task('js', function() {
    return gulp.src('assets/js/app.js')
    // .pipe(uglify())
    .pipe(gulp.dest('_site/assets/js'))
    .pipe(browserSync.stream());
});

gulp.task('js:vendors', function() {
    return gulp.src(['!assets/js/app.js', 'assets/js/**/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest('_site/assets/js'))
    .pipe(browserSync.stream())
});

// Copy specific n statics files only..
gulp.task('copy', function() {
    return gulp.src('assets/img/**/*.*')
    .pipe(gulp.dest('_site/assets/img'))
    .pipe(browserSync.stream());
});
// -----------------------------------------------------------


// Prevent gulp watch from break..
// -----------------------------------------------------------
function errorHandler(error) {
    // Logs out error in the command line
    console.log(error.toString());
    // Ends the current pipe, so Gulp watch doesn't break
    this.emit('end');
}
// -----------------------------------------------------------
