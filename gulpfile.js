
require('dotenv').config();

const gulp = require('gulp'),
    args = require('yargs').argv,
    log = require('fancy-log'),
    compiler = require('webpack'),
    webpack = require('webpack-stream'),
    sass = require('gulp-sass')(require('sass')),
    sourcemaps = require('gulp-sourcemaps'),
    ts = require('gulp-typescript'),
    gulpBabel = require('gulp-babel'),
    ansicolors = require('ansi-colors'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    iconfont = require('gulp-iconfont'),
    iconfontCss = require('gulp-iconfont-css');


const isProduction = !!args.prod // --prod argument

const paths = {
    src: {
        ts: './src/js/**/*.ts',
        js: './src/js/**/*.js',
        scss: './src/scss/*.scss',
        fonts: './src/fonts/**/*.{eot,svg,ttf,woff,woff2}',
    },
    dest: {
        build: './public/build',
        ts: './public/build/js/ts',
        js: './public/build/js',
        css: './public/build/css',
        fonts: './public/build/fonts',
    },
}


gulp.task('build:iconfont', function() {
    const fontName = 'CustomIcons';
    return gulp.src(['src/font-icons/*.svg'])
        .pipe(iconfontCss({
            fontName: fontName,
            path: 'src/templates/font-icons/_icons.scss',
            targetPath: '../../../../src/scss/modules/_icons.scss',
            fontPath: '../fonts/icons/'
        }))
        .pipe(iconfont({
            fontName: fontName,
            fontHeight: 1000,
        }))
        .pipe(gulp.dest('public/build/fonts/icons/'))
        .pipe(browserSync.stream());
});


/**
 * Prepare fonts
 */
gulp.task('build:fonts', function() {
    return gulp.src(paths.src.fonts) 
        .pipe(gulp.dest(paths.dest.fonts))
        .pipe(browserSync.stream());
});


/**
 * Compile TS to ES6
 */
gulp.task('build:ts', function () {
    return gulp.src(paths.src.ts)
        .pipe(sourcemaps.init())
        .pipe(ts({
            noImplicitAny: false,
            moduleResolution: 'Node',
            target: 'ES2018',
            removeComments: true,
            allowSyntheticDefaultImports: true
        }))
        .pipe(gulpBabel({presets: ['@babel/preset-env']}))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(paths.dest.ts))
        .pipe(browserSync.stream());
});


/**
 * Builds js files
 */
gulp.task('build:js', gulp.series('build:ts', function () {
    log("Building js files...");
    return gulp.src(paths.dest.ts + '/**/*.js')
        .pipe(webpack({
            mode: isProduction ? "production" : "development",
            devtool: "source-map",
            output: {
                filename: 'app.js',
            },
            module: {
                rules: [
                    {
                      test: /\.js$/,
                      enforce: "pre",
                      use: ["source-map-loader"],
                    },
                ],
            },
        }, compiler))
        .pipe(gulp.dest(paths.dest.js))
        .pipe(browserSync.stream());
}));


/**
 * Builds sass files
 */
gulp.task('build:css', function() {
    log("Building sass files...");
    return gulp.src(paths.src.scss)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: isProduction ? 'compressed' : undefined}).on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dest.css))
        .pipe(browserSync.stream());
});


/**
 * Builds both js and css
 */
gulp.task('build', gulp.series(
    'build:fonts',
    'build:iconfont',
    'build:css',
    'build:js',
));


/**
 * Starts the watch process which rebuild the stuff when css or js changes
 */
gulp.task('watch', function() {
    log('Watching source files..');
    gulp.watch([paths.src.ts], gulp.task('build:js'));
    gulp.watch([paths.src.scss], gulp.task('build:css'));
});


/**
 * Starts the dev server
 */
gulp.task('browsersync', function(cb) {
    log('Starting BrowserSync..');
    browserSync.init({
        port: process.env.DEV_SERVER_PORT || 3000,
        server: {
            baseDir: "./public/",
        },
        ui: false,
        notify: false,
    }, cb);

    // Reload the page when html changes
    gulp.watch("./public/**/*.html").on('change', browserSync.reload);
});


/**
 * Builds the project, starts the dev server and runs watch
 */
gulp.task('dev', gulp.series('build', 'browsersync', 'watch',));


/**
 * Cleanup task
 */
gulp.task('clean', function(done) {
    log('Cleaning: ' + ansicolors.blue(paths.dest.build));
    // force: clean files outside current directory
    del(paths.dest.build, {
        force: true
    }).then(function() {
        log('Delete done.');
        done();
    });
});


gulp.task('default', gulp.series('dev'));