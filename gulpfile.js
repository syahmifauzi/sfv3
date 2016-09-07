var gulp          = require('gulp'),
    shell         = require('gulp-shell'),
    jade          = require('gulp-jade'),

    sass          = require('gulp-sass'),
    uncss         = require('gulp-uncss'),
    nano          = require('gulp-cssnano'),
    autoprefixer  = require('gulp-autoprefixer'),

    uglify        = require('gulp-uglify'),
    concat        = require('gulp-concat'),
    // rename        = require('gulp-rename'),
    runSequence   = require('run-sequence'),
    browserSync   = require('browser-sync').create();


gulp.task('default', function(callback) {
  runSequence(
    'browserSync',
    ['jade', 'sass', 'sass:vendors', 'js', 'js:vendors', 'copy'],
    callback
  );
});


// Run jekyll command in console..
gulp.task('jekyll-build', shell.task(['jekyll build']));


// Rebuild jekyll..
gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
  browserSync.reload();
});


// Static Server + Watching Files..
gulp.task('browserSync', ['jekyll-build'], function() {
  browserSync.init({
    server: {
      baseDir: '_site/'
    }
  });
  gulp.watch(['_config.yml', '_data/**/*.yml', 'README.md'], ['jekyll-rebuild']);
  gulp.watch(['*.html', '_includes/**/*.html', '_layouts/*.html', '_posts/*.*', 'blog/*.html'], ['jekyll-rebuild']);
  gulp.watch(['_jadefiles/**/*.jade'], ['jade']);
  gulp.watch(['assets/css/**/*.scss', '!assets/css/vendors.scss','!assets/css/0-vendors/**/*.scss'], ['sass']);
  gulp.watch(['assets/css/vendors.scss', 'assets/css/0-vendors/**/*.scss'], ['sass:vendors']);
  gulp.watch(['assets/js/app.js'], ['js']);
  gulp.watch(['assets/js/vendors/**/*.js'], ['js:vendors']);
  gulp.watch(['assets/img/**/*'], ['copy']);
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
    .pipe(sass({
      outputStyle: 'compressed',
      onError: browserSync.notify
    }))
      // Run errorHandler if have error
      .on('error', errorHandler)
    .pipe(autoprefixer({
      browser: ['last 2 versions', '> i%', 'not ie <= 8'],
      cascade: true
    }))
    .pipe(nano())
    .pipe(gulp.dest('_site/assets/css'))
    .pipe(browserSync.reload({ stream: true }))
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
      browser: ['last 2 versions', '> i%', 'not ie <= 8'],
      cascade: true
    }))
    .pipe(uncss({
      html: ['index.html', '_includes/**/*.html', '_layouts/**/*.html', '_posts/**/*.html']
    }))
    .pipe(nano())
    .pipe(gulp.dest('_site/assets/css'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(gulp.dest('assets/css'));
});

gulp.task('js', function() {
  return gulp.src('assets/js/app.js')
    // .pipe(uglify())
    .pipe(gulp.dest('_site/assets/js'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js:vendors', function() {
  return gulp.src(['!assets/js/app.js', 'assets/js/vendors/**/*.js'])
    .pipe(concat('vendors.js'))
    .pipe(uglify())
    .pipe(gulp.dest('_site/assets/js'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(gulp.dest('assets/js'));
});

// Copy specific n statics files only..
gulp.task('copy', function() {
  gulp.src('assets/img/**/*.*')
    .pipe(gulp.dest('_site/assets/img'))
    .pipe(browserSync.reload({ stream: true }));
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
