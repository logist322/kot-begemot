"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var del = require("del");
var svgstore = require("gulp-svgstore");

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("min", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**",
    "source/*.ico",
    "source/*.html"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("sprite", function() {
  return gulp.src("build/img/logo-*.svg")
    .pipe(svgstore({
      inLineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("cleanLogos", function() {
  return del("build/img/logo-*.svg")
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("build/"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css", "min"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "sprite",
  "cleanLogos",
  "css",
  "min"
));

gulp.task("start", gulp.series("build", "server"));
