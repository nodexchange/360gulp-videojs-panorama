var gulp = require('gulp'),
  cssmin = require('gulp-cssmin'),
  rename = require('gulp-rename'),
  connect = require('gulp-connect');

var fileincluder = require('gulp-file-includer')

gulp.task('fileincluder', function () {
  gulp.src(['src/index_360.html'])
    .pipe(fileincluder())
    .pipe(gulp.dest('./dist/'))
    .pipe(connect.reload())

});

gulp.task('assets', function () {
  return gulp.src('./src/assets/*')
    .pipe(gulp.dest('./dist/'))
});

gulp.task('compile-css', function () {
  gulp.src('src/**/*.css')
    .pipe(cssmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('build'))
});

gulp.task('build-css', ['assets', 'compile-css'], function () {
  gulp.run('fileincluder');
});
gulp.task('build', ['assets'], function () {
  gulp.run('fileincluder');
})

gulp.task('watch', function () {
  gulp.watch('./src/js/*.js', ['build']);
  gulp.watch('./src/css/*.css', ['build-css']);
});

gulp.task('webserver', function () {
  connect.server({
    port: 8080,
    livereload: true
  });
});

gulp.task('default', ['build', 'build-css', 'webserver', 'watch']);
