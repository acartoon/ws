const gulp = require('gulp')
const plumber = require('gulp-plumber')
// const eslint = require('gulp-eslint')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')

module.exports = function script() {
    return gulp.src(['src/js/functions.js', 'src/includes/**/*.js', 'src/js/index.js',])
        .pipe(plumber())
        .pipe(concat('script.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js/'))
}