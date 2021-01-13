const gulp = require('gulp')
const plumber = require('gulp-plumber')


module.exports = function script_libs() {
    return gulp.src(['src/js/libs/*.js'])
            .pipe(plumber())
            .pipe(gulp.dest('build/js/libs'))
}
