var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

var sassInput = './stylesheets/**/*.scss';
var sassOutput = './public/css';
var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

gulp.task('default', ['sass']);


gulp.task('sass', function () {
  return gulp
    .src(sassInput)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(gulp.dest(sassOutput));
});

gulp.task('watch', function() {
  return gulp
    .watch(sassInput, ['sass'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});
