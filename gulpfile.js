'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const browserSync = require("browser-sync").create();
const fileinclude = require('gulp-file-include');
const babel = require('gulp-babel');

sass.compiler = require('node-sass');


function style() {
    console.log('Build css');
    return gulp.src('./src/scss/styles.scss')
        .pipe(concat('./main.min.scss'))
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./dist/css'));
}

function html() {
    gulp.src('./src/templates/*.html')
        .pipe(fileinclude())
        .pipe(gulp.dest('./dist'));
}

function js() {
    return gulp.src('./src/js/*.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'));
}

/* javascripts tasks */
function js_libs() {
    return gulp.src([
            // include all 3rd-party libraries
        ])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('./dist/js'));
}

function reload() {
    browserSync.reload();
}

function watch() {
    browserSync.init({
        server: {
            baseDir: './dist/',
        },
        port: 9000,
        open: false
    });

    gulp.watch("src/scss/**/*.scss", style);
    gulp.watch("src/scss/**/*.scss", reload);

    gulp.watch("src/js/*.js", js);
    gulp.watch("src/js/*.js", reload);

    gulp.watch("./src/templates/**/*.html", html);
    gulp.watch("./src/templates/**/*.html", reload);

}

exports.style = style;
exports.js_libs = js_libs;
exports.js = js;
exports.html = html;

var build = gulp.parallel(style, html, js, watch);
gulp.task('build', build);
gulp.task('default', build);
