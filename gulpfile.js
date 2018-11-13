const gulp = require("gulp"),
  browserSync = require("browser-sync").create(),
  // watch = require('gulp-watch'),
  connect = require("gulp-connect"),
  plumber = require("gulp-plumber"),
  pug = require("gulp-pug"),
  // uglify = require('gulp-uglify-es').default,
  csso = require("gulp-csso"),
  concat = require("gulp-concat"),
  sass = require("gulp-sass"),
  webpack = require("webpack"),
  webpackStream = require("webpack-stream"),
  // webpackconfig = require('./webpack.config.js'),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename"),
  named = require("vinyl-named"),
  path = require("path"),
  sourcemaps = require("gulp-sourcemaps"),
  svgSprite = require("gulp-svg-sprite");

function _path(p) {
  return path.join(__dirname, p);
}

const P = {
  src: "./src",
  dist: "./dist",
  vendorCss: [
    // './node_modules/bootstrap/dist/css/bootstrap.min.css',
    // "./node_modules/jquery-ui-bundle/jquery-ui.min.css",
    // "./node_modules/slick-carousel/slick/slick.css",
    // "./node_modules/slick-carousel/slick/slick-theme.css",
    // "./src/libs/ZoomIn/css/style.css"
  ],
  vendorJs: [
    // './node_modules/bootstrap/dist/js/bootstrap.min.js',
    // './node_modules/requirejs/require.js',
  ]
};
var All_PAGES = [
  "index",
];

// 'cab_provider', 'cab_seller'
const PAGES = All_PAGES;

gulp.task("server", function() {
  connect.server({
    root: P.dist,
    livereload: true
  });
});

gulp.task("pug", function() {
  let files = [];
  function addFile(page) {
    files.push(P.src + "/pages/" + page + "/*.pug");
  };
  for (let i = 0; i < PAGES.length; i++) {
    const e = PAGES[i];
    addFile(e);
  };
  return gulp
    .src(files)
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(P.dist))
    .pipe(connect.reload());
});

gulp.task("sass", function() {
  return (
    gulp
      .src(P.src + "/sass/main.sass")
      .pipe(sourcemaps.init())
      .pipe(plumber())
      .pipe(sass().on("error", sass.logError))
      .pipe(sourcemaps.write())
      // .pipe(
      //   prefix({
      //     browsers: ["last 10 versions"],
      //     cascade: true
      //   })
      // )
      .pipe(gulp.dest(P.dist + "/css"))
      .pipe(connect.reload())
  );
});

// gulp.task('js', function(){
//     return gulp.src(P.js + '/**/*.js')
//         .pipe(uglify())
//         .pipe(gulp.dest(P.dist + '/js'))
//         .pipe(connect.reload());
// })

gulp.task("js", function() {
  return (
    gulp
      .src(P.src + "/pages/**/*.js")
      .pipe(named())
      .pipe(plumber())
      .pipe(
        webpackStream({
          output: {
            filename: "[name].js"
          },
          devtool: "source-map",
          module: {
            rules: [
              {
                test: /\.(js)$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
                query: {
                  presets: ["env"]
                }
              }
            ]
          },
          resolve: {
            alias: {}
          },
          externals: {
            jquery: "jQuery"
          }
          // plugins: [
          // 	new webpack.ProvidePlugin({
          // 		setImmediate: ['setimmediate', 'setImmedate'],
          // 		clearImmediate: ['setimmediate', 'clearImmedate']
          // 	}),
          // ]
        })
      )
      // .pipe(gulp.dest(P.dist))
      // .pipe(uglify())
      // .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest(P.dist + "/js"))
      .pipe(connect.reload())
  );
});

gulp.task("main-js", function() {
  return (
    gulp
      .src(P.src + "/js/*.js")
      .pipe(named())
      .pipe(plumber())
      .pipe(
        webpackStream({
          output: {
            filename: "[name].js"
          },
          devtool: "source-map",
          module: {
            rules: [
              {
                test: /\.(js)$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
                query: {
                  presets: ["env"]
                }
              }
            ]
          },
          resolve: {
            // alias: {
            //   // jquery is NOT a peer dependency in jquery.inputmask so a alias
            //   // is used here to force jquery.inputmask to use your jquery
            //   // version
            //   jquery: _path("node_modules/jquery/dist/jquery"),
            //   // Switch dependency lib accordingly (this one uses jquery)
            //   "inputmask.dependencyLib": _path(
            //     "node_modules/inputmask/dist/inputmask/inputmask.dependencyLib"
            //   ),
            //   // Core library (order of these aliases shouldn't matter FYI)
            //   inputmask: _path(
            //     "node_modules/inputmask/dist/inputmask/inputmask"
            //   ),
            //   // Allows use of jquery input mask via jquery chaining api/$('selector').inputmask(...)
            //   "jquery.inputmask": _path(
            //     "node_modules/inputmask/dist/inputmask/jquery.inputmask"
            //   ),
            //   // Add extensions following the pattern below remember to import them as necessary in your .js files
            //   "inputmask.numeric.extensions": _path(
            //     "node_modules/inputmask/dist/inputmask/inputmask.numeric.extensions"
            //   )
            // }
          },
          externals: {
            jquery: "jQuery"
          }
          // plugins: [
          // 	new webpack.ProvidePlugin({
          // 		setImmediate: ['setimmediate', 'setImmedate'],
          // 		clearImmediate: ['setimmediate', 'clearImmedate']
          // 	}),
          // ]
        })
      )
      // .pipe(gulp.dest(P.dist))
      // .pipe(uglify())
      // .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest(P.dist + "/js"))
      .pipe(connect.reload())
  );
});

// //запускать ручками
gulp.task("vendorCss", function() {
  gulp
    .src(P.vendorCss)
    .pipe(concat("vendor.min.css"))
    .pipe(gulp.dest(P.dist + "/css"));
});

// //запускать ручками
// gulp.task('vendorJs', function(){
//     gulp.src(P.vendorJs)
//         // .pipe(concat('vendor.min.js'))
//         .pipe(gulp.dest(P.js + '/libs'))
// })

gulp.task("img", function() {
  gulp
    .src(P.src + "/img/**/*")
    //пожать картинки
    .pipe(gulp.dest(P.dist + "/img"));
});

gulp.task("fonts", function() {
  gulp.src(P.src + "/fonts/**/*").pipe(gulp.dest(P.dist + "/fonts"));
});

gulp.task("libs", function() {
  gulp.src(P.src + "/libs/**/*").pipe(gulp.dest(P.dist + "/libs"));
});

gulp.task("svg", function() {
  var config = {
    mode: {
      symbol: {
        // symbol mode to build the SVG
        render: {
          css: true, // CSS output option for icon sizing
          scss: false // SCSS output option for icon sizing
        },
        // dest: 'sprite', // destination folder
        // prefix: '.svg--%s', // BEM-style prefix if styles rendered
        sprite: "sprite.svg", //generated sprite name
        example: true // Build a sample page, please!
      }
    }
  };

  gulp
    .src(P.src + "/svg/*.svg")
    .pipe(svgSprite(config))
    .pipe(gulp.dest(P.src + "/svgSprite"))
    .pipe(gulp.dest(P.dist + "/svgSprite"));
});

gulp.task("watch", function() {
  gulp.watch(P.src + "/**/*.pug", ["pug"]);
  gulp.watch(P.src + "/**/*.sass", ["sass"]);
  gulp.watch(P.src + "/**/*.js", ["main-js"]);
});

gulp.task("default", ["server", "watch", "img", "fonts"]);
