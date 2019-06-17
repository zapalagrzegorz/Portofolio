/*  */

/**
 * Settings
 * Turn on/off build features
 */

const settings = {
    clean: true,
    scripts: true,
    polyfills: true,
    styles: true,
    svgs: true,
    copy: true,
    reload: true
};

exports.settings = settings;

/**
 * Paths to project folders
 */

const paths = {
    input: "src/",
    output: "dist/",
    scripts: {
        input: "src/**/*.js",
        polyfills: ".polyfill.js",
        output: "dist/js/"
    },
    styles: {
        input: "src/sass/**/*.{scss,sass}",
        output: "dist/css/"
    },
    svgs: {
        input: "src/svg-sprite/*.svg",
        output: "dist/svg/"
    },
    copy: {
        input: "src/copy/**/*",
        output: "dist/"
    },
    reload: "./dist/"
};
exports.paths = paths;

/**
 * Gulp Packages
 */

// General
const { gulp, src, dest, watch, series, parallel } = require("gulp");

const rename = require("gulp-rename");
/* eslint-disable next-line */

// Scripts
const babel = require("gulp-babel");
// const jshint = require("gulp-jshint");npm install gulp-eslint
// const stylish = require("jshint-stylish");
const eslint = require("gulp-eslint");
const concat = require("gulp-concat");
const uglify = require("gulp-terser");
const { argv } = require("yargs");
const gulpif = require("gulp-if");

// Styles
const sass = require("gulp-sass");
const prefix = require("gulp-autoprefixer");
const minify = require("gulp-cssnano");

// SVGs
const svgmin = require("gulp-svgmin");
const svgo = require("gulp-svgo");
const svgstore = require("gulp-svgstore");

// BrowserSync
const browserSync = require("browser-sync");

const fileinclude = require("gulp-file-include");
const { cleanDist } = require("./cleanDist");

// Repeated JavaScript tasks

// Lint, minify, and concatenate scripts
function buildScripts(done) {
    // Make sure this feature is activated before running
    if (!settings.scripts) return done();

    // Run tasks on script files
    return src(paths.scripts.input)
        .pipe(
            gulpif(argv.production, babel({ presets: ["@babel/preset-env"] }))
        )
        .pipe(gulpif(argv.production, uglify()))
        .pipe(concat("main.js"))
        .pipe(dest(paths.scripts.output));
}

// Lint scripts
function lintScripts(done) {
    // Make sure this feature is activated before running
    if (!settings.scripts) return done();

    // Lint scripts
    return src(paths.scripts.input)
        .pipe(
            eslint({
                configFile: "./.eslintrc.json"
            })
        )
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

// Process, lint, and minify Sass files
function buildStyles(done) {
    // Make sure this feature is activated before running
    if (!settings.styles) return done();

    // Run tasks on all Sass files
    return src(paths.styles.input)
        .pipe(
            sass({
                outputStyle: "expanded",
                sourceComments: true,
                includePaths: "node_modules/bootstrap/scss"
            })
        )
        .pipe(
            prefix({
                cascade: true,
                remove: true
            })
        )
        .pipe(dest(paths.styles.output))
        .pipe(rename({ suffix: ".min" }))
        .pipe(
            minify({
                discardComments: {
                    removeAll: true
                }
            })
        )
        .pipe(dest(paths.styles.output));
}

// Optimize SVG files
function buildSVGs(done) {
    // Make sure this feature is activated before running
    if (!settings.svgs) return done();

    // Optimize SVG files
    return src(paths.svgs.input)
        .pipe(svgmin())
        .pipe(dest(paths.svgs.output));
}

// Copy static files into output folder
function copyFiles(done) {
    // Make sure this feature is activated before running
    if (!settings.copy) return done();

    // Copy static files
    return src(paths.copy.input).pipe(dest(paths.copy.output));
}

// Watch for changes to the src directory
function startServer(done) {
    // Make sure this feature is activated before running
    if (!settings.reload) return done();

    // Initialize BrowserSync
    browserSync.init({
        server: {
            baseDir: paths.reload
        }
    });

    // Signal completion
    return done();
}

// Reload the browser when files change
function reloadBrowser(done) {
    if (!settings.reload) return done();
    browserSync.reload();
    return done();
}

// Watch for changes
function watchSource(done) {
    watch(paths.input, series(exports.default, reloadBrowser));
    return done();
}

function svgSprite() {
    return src(paths.svgs.input)
        .pipe(
            svgo({
                plugins: [
                    { removeTitle: true },
                    { convertPathData: { floatPrecision: 2 } },
                    { removeViewBox: false }
                ]
            })
        )
        .pipe(rename({ prefix: "image-" }))
        .pipe(svgstore({ inlineSvg: true }))
        .pipe(dest(paths.svgs.output));
}

// Robi inline czego trzeba w src-master.hbs i zapisuje jako master.hbs
function inlineSVG() {
    return src("dist/index.html")
        .pipe(
            fileinclude({
                prefix: "@@",
                basepath: "@file"
            })
        )
        .pipe(dest("./dist"));
}

/**
 * Export Tasks
 */

// Default task
// gulp
exports.default = series(
    cleanDist,
    parallel(lintScripts, buildScripts, buildStyles, svgSprite, copyFiles),
    inlineSVG
);

exports.build = series(
    cleanDist,
    parallel(lintScripts, buildScripts, buildStyles, buildSVGs, copyFiles)
);

exports.svgSprite = series(svgSprite);

// Watch and reload
// gulp watch
exports.watch = series(exports.default, startServer, watchSource);
