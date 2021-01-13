const gulp = require('gulp')
const plumber = require('gulp-plumber') //отслеживает ошибки
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const concat = require('gulp-concat-css')
const modifyCssUrls = require('gulp-modify-css-urls')
const notify = require( 'gulp-notify' )

module.exports = function styles2() {
    return gulp.src(['src/style/libs/**/*.scss'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({sourceMap: true})
            .on('error', notify.onError(
                {
                    message: "<%= error.message %>",
                    title  : "Sass Error!"
                }
            ))
        )
        .pipe(modifyCssUrls({
            modify(url, filePath) {
                return `/${url}`;
            },
            prepend: '../',
        }))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/css/libs'))
}

