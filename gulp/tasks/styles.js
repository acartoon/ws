const gulp = require('gulp')
const plumber = require('gulp-plumber')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const concat = require('gulp-concat-css')
const modifyCssUrls = require('gulp-modify-css-urls')
const notify = require( 'gulp-notify' )
const order = require( 'gulp-order' )

module.exports = function styles() {
  return gulp.src(['src/**/*.scss', '!src/style/libs/*.scss'])
    .pipe(plumber()) // отслеживание ошибок
    .pipe(sourcemaps.init())
    .pipe(order([
        'style/*.scss',
        'includes/partners/**/*.scss',
        'includes/modules/**/*.scss',
    ]), { base: './src' })
    .pipe(sass({sourceMap: true})
        .on('error', notify.onError(
            {
                message: "<%= error.message %>",
                title  : "Sass Error!"
            }
        ))
    )
    .pipe(concat('style.css', {rebaseUrls: false}))
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
    .pipe(gulp.dest('build/css'))
}

