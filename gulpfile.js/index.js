

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
    input: "src/svg/*.svg",
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
 * Template for banner to add to file headers
 */

const banner = {
  full:
    `${"/*!\n" +
      " * <%= package.name %> v<%= package.version %>\n" +
      " * <%= package.description %>\n" +
      " * (c) "}${new Date().getFullYear()} <%= package.author.name %>\n` +
    ` * <%= package.license %> License\n` +
    ` * <%= package.repository.url %>\n` +
    ` */\n\n`,
  min:
    `${"/*!" +
      " <%= package.name %> v<%= package.version %>" +
      " | (c) "}${new Date().getFullYear()} <%= package.author.name %>` +
    ` | <%= package.license %> License` +
    ` | <%= package.repository.url %>` +
    ` */\n`
};

/**
 * Gulp Packages
 */

// General
const { gulp, src, dest, watch, series, parallel } = require("gulp");

const flatmap = require("gulp-flatmap");
const lazypipe = require("lazypipe");
const rename = require("gulp-rename");
const header = require("gulp-header");
/* eslint-disable next-line */

// Scripts
const babel = require("gulp-babel");
// const jshint = require("gulp-jshint");npm install gulp-eslint
// const stylish = require("jshint-stylish");
const eslint = require('gulp-eslint');
const concat = require("gulp-concat");
const uglify = require("gulp-terser");
const optimizejs = require("gulp-optimize-js");

// Styles
const sass = require("gulp-sass");
const prefix = require("gulp-autoprefixer");
const minify = require("gulp-cssnano");

// SVGs
const svgmin = require("gulp-svgmin");

// BrowserSync
const browserSync = require("browser-sync");
const packageJson = require("../package.json");

const { cleanDist } = require("./cleanDist");

// Repeated JavaScript tasks
const jsTasks = lazypipe()
  .pipe(
    header,
    banner.full,
    { package: packageJson }
  )
  .pipe(optimizejs)
  .pipe(
    dest,
    paths.scripts.output
  )
  .pipe(
    rename,
    { suffix: ".min" }
  )
  .pipe(
    babel,
    { presets: ["@babel/preset-env"] }
  )
  .pipe(uglify)
  .pipe(optimizejs)
  .pipe(
    header,
    banner.min,
    { package: packageJson }
  )
  .pipe(
    dest,
    paths.scripts.output
  );

// Lint, minify, and concatenate scripts
function buildScripts(done) {
  // Make sure this feature is activated before running
  if (!settings.scripts) return done();

  // Run tasks on script files
  return src(paths.scripts.input).pipe(
    flatmap(function flatmapCb(stream, file) {
      // If the file is a directory
      if (file.isDirectory()) {
        // Setup a suffix variable
        let suffix = "";

        // If separate polyfill files enabled
        if (settings.polyfills) {
          // Update the suffix
          suffix = ".polyfills";

          // Grab files that aren't polyfills, concatenate them, and process them
          src([
            `${file.path}/*.js`,
            `!${file.path}/*${paths.scripts.polyfills}`
          ])
            .pipe(concat(`${file.relative}.js`))
            .pipe(jsTasks());
        }

        // Grab all files and concatenate them
        // If separate polyfills enabled, this will have .polyfills in the filename
        src(`${file.path}/*.js`)
          .pipe(concat(`${file.relative + suffix}.js`))
          .pipe(jsTasks());

        return stream;
      }

      // Otherwise, process the file
      return stream.pipe(jsTasks());
    })
  );
}

// Lint scripts
function lintScripts(done) {
  // Make sure this feature is activated before running
  if (!settings.scripts) return done();

  // Lint scripts
  return src(paths.scripts.input)
    .pipe(eslint({
      "configFile": "./.eslintrc.json"
    }))
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
    .pipe(header(banner.full, { package: packageJson }))
    .pipe(dest(paths.styles.output))
    .pipe(rename({ suffix: ".min" }))
    .pipe(
      minify({
        discardComments: {
          removeAll: true
        }
      })
    )
    .pipe(header(banner.min, { package: packageJson }))
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
};

// Copy static files into output folder
function copyFiles(done) {
  // Make sure this feature is activated before running
  if (!settings.copy) return done();

  // Copy static files
  return src(paths.copy.input).pipe(dest(paths.copy.output));
};

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
};

// Reload the browser when files change
function reloadBrowser(done) {
  if (!settings.reload) return done();
  browserSync.reload();
  return done();
};

// Watch for changes
function watchSource(done) {
  watch(paths.input, series(exports.default, reloadBrowser));
  return done();
};

/**
 * Export Tasks
 */

// Default task
// gulp
exports.default = series(
  cleanDist,
  parallel(lintScripts, buildScripts, buildStyles, buildSVGs, copyFiles)
);

// Watch and reload
// gulp watch
exports.watch = series(exports.default, startServer, watchSource);


