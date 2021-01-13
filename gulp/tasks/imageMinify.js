const gulp = require('gulp')

module.exports = function imageMinify() {
  return gulp.src('src/i/**/*.{gif,png,jpg,svg,webp}')
    .pipe(gulp.dest('build/i'))
}

