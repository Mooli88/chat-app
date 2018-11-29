'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const scripts = './app/**/*.js';
const styles = "./app/sass/*.scss";
const templates = './app/**/*.html';
const thirdParty = require('./third-party');
const wrap = require("gulp-wrap");

let devMode = false;

gulp.task('sass', function () {
    gulp.src(styles)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('third-party', function () {
    gulp.src(thirdParty)
        .pipe(concat('third-party.js'))
        .pipe(gulp.dest('./public/js'))
});

gulp.task('js', function () {
    gulp.src(scripts)
        .pipe(wrap('(function(chatApp){\n\t"use strict";\n\n\t<%= contents %>\n})(window.chatApp);\n\n'))
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('./public/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('html', function () {
    gulp.src(templates)
        .pipe(gulp.dest('./public/'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('build', function () {
    gulp.start(['third-party', 'sass', 'html', 'js'])
});

gulp.task('build-dev', function () {
    gulp.start(['sass', 'js', 'html'])
});

gulp.task('build-dep', function () {
    gulp.start(['third-party'])
});

gulp.task('browser-sync', function () {
    browserSync.init(null, {
        open: false,
        port: 3012,
        server: {
            baseDir: 'public'
        }
    });
});

gulp.task('watch', function () {
    devMode = true;
    
    gulp.start([
        'build',
        'browser-sync'
    ]);

    gulp.watch(styles, ['sass']);
    
    gulp.watch(scripts, ['js']);
    
    gulp.watch(templates, ['html']);
});