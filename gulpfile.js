var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var shell = require('gulp-shell');
var watch = require('gulp-watch');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');


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

gulp.task('default', ['sass']);

gulp.task('build', ['hugo', 'sass']);

gulp.task('hugo', shell.task([
  'hugo',
]))

gulp.task('sass', function () {
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
});

gulp.task('watch', function() {
  watch(sassInput, function (vinyl) {
    gutil.log(gutil.colors.green(vinyl.relative), 'fired', gutil.colors.green(vinyl.event));
    gulp.start('sass');
  });
  watch(hugoInput, function (vinyl) {
    gutil.log(gutil.colors.green(vinyl.relative), 'fired', gutil.colors.green(vinyl.event));
    gulp.start('hugo');
  });
});

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
