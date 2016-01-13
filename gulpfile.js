var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var shell = require('gulp-shell');
var watch = require('gulp-watch');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var connect = require('gulp-connect');


var sassInput = './stylesheets/**/*.scss';
var sassOutput = './public/css';
var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

var hugoInput = [
  'archetypes/**/*.*',
  'content/**/*.*',
  'data/**/*.*',
  'layouts/**/*.*',
  'static/**/*.*'
];

gulp.task('default', ['serve']);

gulp.task('build', ['hugo', 'sass']);

gulp.task('hugo', function() {
  return executeGulpHugo();
});

gulp.task('sass', function () {
  return executeGulpSass();
});

gulp.task('watch', function() {
  watch(sassInput, function (vinyl) {
    gutil.log(gutil.colors.green(vinyl.relative), 'fired', gutil.colors.green(vinyl.event));
    return executeGulpSass().pipe(connect.reload());
  });
  watch(hugoInput, function (vinyl) {
    gutil.log(gutil.colors.green(vinyl.relative), 'fired', gutil.colors.green(vinyl.event));
    return executeGulpHugo().pipe(connect.reload());
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

function executeGulpHugo() {
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

function executeGulpSass() {
  return gulp
    .src(sassInput)
    .pipe(plumber({
      errorHandler: handleError
    }))
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(gulp.dest(sassOutput));
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
