const {src, dest, watch, parallel, series} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');

function styles() {
    return src('app/scss/style.scss')
        .pipe(concat('style.min.css'))
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function scripts() {
    return src('app/js/main.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function watching() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
    watch(['app/scss/style.scss'], styles)
    watch(['app/js/main.js'], scripts)
    watch(['app/*.html']).on('change', browserSync.reload)
}



function building() {
    return src([
        'app/css/style.min.css',
        'app/images/*.*',
        'app/js/main.min.js',
        'app/**/*.html',
        'app/libs/**'
    ], {base : 'app'})
    .pipe(dest('dist'))
}

function cleanDist() {
    return src('dist')
        .pipe(clean())
}

function images() {
    return src(['app/images/src/*.*', '!app/images/src/*.svg'])
        .pipe(newer('app/images/dist'))
        .pipe(avif({quality : 50}))
        .pipe(src('app/images/*.*'))
        //.pipe(newer('app/images/dist'))
        .pipe(webp())
        .pipe(src('app/images/*.*'))
        //.pipe(newer('app/images/dist'))
        .pause(imagemin())
        //.pipe(dest('app/images/dist'))
}



exports.styles = styles;
exports.images = images 
exports.scripts = scripts;
exports.watching = watching;


exports.build = series(cleanDist, building);
exports.default = parallel(styles, images, scripts, watching);