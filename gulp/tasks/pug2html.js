const gulp = require('gulp');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const pugLinter = require('gulp-pug-linter');
const htmlValidator = require('gulp-w3c-html-validator');
const bemValidator = require('gulp-html-bem-validator');
const config = require('../config');
const pugbem = require('gulp-pugbem');

module.exports = function pug2html() {
  // return gulp.src('src/pages/make.pug')
  return gulp.src('src/pages/**/*.pug')
    .pipe(plumber())
    // .pipe(pugLinter({ reporter: 'default' }))
    .pipe(pug({ pretty: true,
        plugins: [pugbem]
    }))
    // .pipe(htmlValidator())
    // .pipe(bemValidator())
    .pipe(gulp.dest('build'))
}

