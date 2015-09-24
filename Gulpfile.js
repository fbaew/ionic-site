var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var concat      = require('gulp-concat');
var sass        = require('gulp-sass');
var minifyCss   = require('gulp-minify-css');
var rename      = require('gulp-rename');
var browserSync = require('browser-sync');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var pagespeed   = require('psi');

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

var paths = {
  sass: ['scss/**/*.scss']
};

var AUTOPREFIXER_BROWSERS = [
  'ie >= 9',
  'ie_mob >= 9',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('sass', function(done) {
  return gulp.src('./scss/site.scss')
    .pipe(sass({onError: browserSync.notify}))
    .pipe(gulp.dest('./css/'))
    .pipe(gulp.dest('./_site/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./css/'))
    .pipe(gulp.dest('./_site/css/'));
});

gulp.task('styles:v2', function() {
  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src('_scss/v2.scss')
    .pipe($.sourcemaps.init())
    .pipe(sass({
      precision: 10,
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    //
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./css/'))
    .pipe(gulp.dest('./_site/css/'))

    // .pipe($.sourcemaps.write('./css/'))
    // Concatenate and minify styles
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./css/'))
    .pipe(gulp.dest('./_site/css/'))
    .pipe($.size({title: 'styles'}));
});

gulp.task('sass', function(done) {
  return gulp.src('./scss/site.scss')
    .pipe(sass({onError: browserSync.notify}))
    .pipe(gulp.dest('./css/'))
    .pipe(gulp.dest('./_site/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./css/'))
    .pipe(gulp.dest('./_site/css/'));
});

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function(done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});


/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('server', ['sass', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

gulp.task('server:styles', ['sass'], function() {
  browserSync.reload();
});
gulp.task('server:stylesv2', ['styles:v2'], function() {
  browserSync.reload();
});
gulp.task('server:jekyll', ['jekyll-build'], function() {
  browserSync.reload();
});

gulp.task('watch', ['server'],function() {
  gulp.watch('scss/**.scss', ['server:styles']);
  gulp.watch(['_scss/*.scss', '_scss/docs/*.scss'], ['server:stylesv2']);
  gulp.watch(['*.html', '_layouts/*.html', '_posts/*'], ['server:jekyll']);

});

gulp.task('default', ['sass']);
