var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    inject = require('gulp-inject-string');

var headStr = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">
    <title>!Rocket</title>
    <link rel="stylesheet" type="text/css" href="./index.css">
    <script src="./libs/zepto.min.js"></script>
    <script src="./libs/zepto.touch.js"></script>
    <script src="./libs/zepto.fx.js"></script>
    <script src="./libs/zepto.fx_methods.js"></script>
    <script src="./configs/const.js"></script>
  </head>
  <body>
    <div id="if-portrait">请将屏幕横置</div>
    <div class="container">
`;

var footStr = `</div>
    <script src="cordova.js"></script>
    <script src="./build.js"></script>
  </body>
</html>`;

gulp.task('html', function () {
  return gulp.src('./app/htmls/*.html')
             .pipe(concat('index.html'))
             .pipe(inject.wrap(headStr, footStr))
             .pipe(gulp.dest('./app'));
});
