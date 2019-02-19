const browsersync = require("browser-sync").create();
const gulp = require("gulp");
const less = require("gulp-less");
const cssnano = require("cssnano");
const autoprefixer = require("autoprefixer");
const imagemin = require("gulp-imagemin");
const rename = require("gulp-rename");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const eslint = require("gulp-eslint");

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./"
    },
    port: 3000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// CSS task
function css() {
  return gulp
  .src(["./src/less/*.less"])
    .pipe(plumber())
    .pipe(less({ outputStyle: "expanded" }))
    .pipe(gulp.dest("./css/"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest("./css/"))
    .pipe(browsersync.stream());
}

// Lint scripts
/*function scriptsLint() {
  return gulp
    .src(["./js/main.js", "./gulpfile.js"])
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}*/

// Transpile, concatenate and minify scripts
/*function scripts() {
  return (
    gulp
      .src(["./js/main.js"])
      .pipe(plumber())
      // folder only, filename is specified in webpack config
      .pipe(gulp.dest("./js/assets/js/"))
      .pipe(browsersync.stream())
  );
}*/

// Optimize Images
function images() {
  return gulp
    .src("./src/img/**/*")
    .pipe(newer("./src/assets/img"))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest("./src/assets/img"));
}


// Watch files
function watchFiles() {
  gulp.watch("./src/less/**/*", css);
  gulp.watch("./src/less/*", css);
  gulp.watch(
    [
      "./src/less/**/*",
      "./src/less/*",
      //"./_includes/**/*",
      "./*.html",
      "./js/*.js"
    ],
    gulp.series(css,browserSyncReload)
  );
  gulp.watch("./src/img/**/*", images);
}

// define complex tasks
//const js = gulp.series(scriptsLint, scripts);
const watch = gulp.parallel(watchFiles, browserSync);
const compile = gulp.parallel(css);

// export tasks
exports.watch = watch;
exports.compile = css;
//exports.js = js;