var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var shell = require('gulp-shell');
var watch = require('gulp-watch');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');


var sassInput = './stylesheets/**/*.scss';
var sassOutput = './public/css';

var jsInput = './scripts/**/*.js';
var jsOutput = './public/js'

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

var hugoInput = [
  'archetypes/**/*.*',
  'content/**/*.*',
  'layouts/**/*.*',
  'static/**/*.*',
  'config.tml'
];

gulp.task('default', ['serve']);

gulp.task('build', ['hugo', 'sass', 'js']);

gulp.task('hugo', function() {
  return buildHugo();
});

gulp.task('sass', function () {
  return buildSass();
});

gulp.task('js', function () {
  return buildJs();
});


gulp.task('watch', function() {
  watch(sassInput, function (vinyl) {
    gutil.log(gutil.colors.green(vinyl.relative), 'fired', gutil.colors.green(vinyl.event));
    return buildSass().pipe(connect.reload());
  });
  watch(jsInput, function (vinyl) {
    gutil.log(gutil.colors.green(vinyl.relative), 'fired', gutil.colors.green(vinyl.event));
    return buildJs().pipe(connect.reload());
  });
  watch(hugoInput, function (vinyl) {
    gutil.log(gutil.colors.green(vinyl.relative), 'fired', gutil.colors.green(vinyl.event));
    return buildHugo().pipe(connect.reload());
  });
});

gulp.task('serve', function() {
  connect.server({
      'root': 'public',
      'livereload': true,
      'port': 6789
  });
  gulp.start('watch');
});

function buildHugo() {
  return gulp
    .src('')
    .pipe(plumber({
      errorHandler: handleError
    }))
    .pipe(shell([
      'hugo --buildDrafts'
    ]
  ));
}

function buildSass() {
  return gulp
    .src(sassInput)
    .pipe(plumber({
      errorHandler: handleError
    }))
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(gulp.dest(sassOutput));
}

function buildJs() {
  return gulp.src(jsInput)
    .pipe(plumber({
      errorHandler: handleError
    }))
    .pipe(concat('site.js'))
    .pipe(uglify())
    .pipe(gulp.dest(jsOutput));
}

function handleError(error) {
  gutil.beep();
  var message = null;
  if (error.hasOwnProperty('formatted')) {
    message = error.formatted;
  } else {
    message = error;
  }
  gutil.log(gutil.colors.red(message));
  this.emit('end');
}
