var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('del', function() {
  return del.sync(['dist', 'assets/stylesheets/css']);
})

gulp.task('sass', function() {
  return gulp.src('assets/stylesheets/scss/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('assets/stylesheets/css'));
})

gulp.task('minify-css', function() {
  return gulp.src('assets/stylesheets/css/application.css')
  .pipe(cleanCSS())
  .pipe(gulp.dest('dist'));
})

gulp.task('watch', function() {
  gulp.watch('assets/stylesheets/scss/**/*.scss', ['sass']);
  gulp.watch('assets/stylesheets/css/application.css', ['minify-css']);
})

gulp.task('default', function() {
  runSequence('del', 'sass', 'minify-css', 'watch');
})
