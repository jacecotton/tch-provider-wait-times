/**
 * Dependencies.
 */

const gulp = require("gulp");
const { src, dest, series, parallel } = require("gulp");

// Script utilities
const babel = require("gulp-babel");
const terser = require("gulp-terser");
const concat = require("gulp-concat");

// Style utilities
const sass = require("gulp-dart-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cleancss = require("gulp-clean-css");

// Image utilities
const imagemin = require("gulp-imagemin");

// All
const sourcemaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");

// npm i --save-dev gulp gulp-babel gulp-terser gulp-concat gulp-dart-sass gulp-postcss autoprefixer gulp-clean-css gulp-imagemin gulp-sourcemaps gulp-plumber gulp-rename @babel/core @babel/preset-env
 
/**
 * Configuration.
 */

const path = ".";

const config = {
  scripts: {
    src: `${path}/assets/scripts/**/*.js`,
    dest: `${path}/scripts/`,
  },

  styles: {
    src: `${path}/assets/styles/**/*.scss`,
    dest: `${path}/styles/`,
  },

  images: {
    src: `${path}/assets/images/**/*`,
    dest: `${path}/images/`,
  },
};
 
/**
 * Tasks.
 */

const tasks = {
  scripts: function() {
    return src(config.scripts.src)
      .pipe(sourcemaps.init())
      .pipe(concat("main.js"))
      .pipe(babel({
        presets: [
          [
            '@babel/env',
            {
              targets: {
                "chrome": "70",
                // "ie": "11",
                "safari": "13",
              },
            },
          ],
        ],
      }))
      .pipe(terser())
      .pipe(sourcemaps.write("."))
      .pipe(dest(config.scripts.dest));
  },

  styles: function() {
    return src(config.styles.src)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(postcss([
        autoprefixer({
          grid: "autoplace",
        }),
      ]))
      .pipe(cleancss({ level: 2 }, (details) => {
        console.log("clean-css stats:", details.stats);
      }))
      .pipe(sourcemaps.write("."))
      .pipe(dest(config.styles.dest))
  },

  images: function() {
    return src(config.images.src)
      .pipe(imagemin())
      .pipe(dest(config.images.dest));
  },

  icons: function() {
    return src(config.icons.src)
      .pipe(imagemin([
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
            },
          ],
        }),
      ]))
      .pipe(dest(config.icons.dest));
  },
};

gulp.task("scripts", tasks.scripts);
gulp.task("styles", tasks.styles);
gulp.task("images", tasks.images);

gulp.task("watch", function watch() {
  gulp.watch(`${path}/assets/styles/`, tasks.styles);
  gulp.watch(`${path}/assets/scripts/`, tasks.scripts);
  gulp.watch(`${path}/assets/images/`, tasks.images);
});

gulp.task("default", series(["styles", "scripts", "images", "watch"]));