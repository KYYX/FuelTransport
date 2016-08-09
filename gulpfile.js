var gulp   = require('gulp'),
    concat = require('gulp-concat');

gulp.task('html', function () {
  return gulp.src('./app/htmls/*.html')
             .pipe(concat('index.html'))
             .pipe(gulp.dest('./app'));
});
