'use strict';

// plugins initialization
const gulp = require('gulp'),
  sass = require('gulp-sass'),
  prefixer = require('gulp-autoprefixer'),
  cssmin = require('gulp-minify-css'),
  uglify = require('gulp-uglify'),
  rigger = require('gulp-rigger'),
  imagemin = require('gulp-imagemin'),
  spritesmith = require('gulp.spritesmith'),
  rimraf = require('rimraf'),
  sourcemaps = require('gulp-sourcemaps'),
  rename = require('gulp-rename'),
  plumber = require('gulp-plumber'),
  watch = require('gulp-watch'),
  connect = require('gulp-connect');

// paths constants
const path = {
  dist: {
    html: 'dist/',
    js: 'dist/js/',
    css: 'dist/css/',
    img: 'dist/css/images/',
    fonts: 'dist/fonts/',
    htaccess: 'dist/',
    contentImg: 'dist/img/',
    sprites: 'src/css/images/',
    spritesCss: 'src/css/partial/'
  },
  src: {
    html: 'src/*.html',
    js: 'src/js/[^_]*.js',
    css: 'src/css/styles.scss',
    cssVendor: 'src/css/vendor/*.*',
    img: 'src/css/images/**/*.*',
    fonts: 'src/fonts/**/*.*',
    contentImg: 'src/img/**/*.*',
    sprites: 'src/css/sprites/*.png',
    htaccess: 'src/.htaccess'
  },
  watch: {
    html: 'src/*.html',
    js: 'src/js/**/*.js',
    css: 'src/css/**/*.*',
    img: 'src/css/images/**/*.*',
    contentImg: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*',
    htaccess: 'src/.htaccess',
    sprites: 'src/css/sprites/*.png'
  },
  clean: './dist',
  outputDir: './dist'
};

// local server
gulp.task('connect', () => {
  connect.server({
    root: [path.outputDir],
    port: 3000,
    livereload: true
  });
});

// html build
gulp.task('html:build', () => {
  gulp.src(path.src.html)
    .pipe(rigger())
    .pipe(gulp.dest(path.dist.html))
    .pipe(connect.reload())
});

// js build
gulp.task('js:build', () => {
  gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(path.dist.js))
    .pipe(connect.reload())
});

// sprites build
gulp.task('sprites:build', () => {
  var spriteData =
    gulp.src(path.src.sprites)
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.scss',
      imgPath: 'images/sprite.png',
      cssFormat: 'scss',
      //cssTemplate: 'css/scss.template.handlebars',
      cssVarMap: (sprite) => {
        sprite.name = 's-' + sprite.name
      }
    }));
  spriteData.img.pipe(gulp.dest(path.dist.sprites));
  spriteData.css.pipe(gulp.dest(path.dist.spritesCss));
});

// static images build
gulp.task('image:build', () => {
  gulp.src(path.src.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      interlaced: true,
      optimizationLevel: 3
    }))
    .pipe(gulp.dest(path.dist.img))
    .pipe(connect.reload())
});

// build dinamic (content) images
gulp.task('imagescontent:build', () => {
  gulp.src(path.src.contentImg)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      interlaced: true,
      optimizationLevel: 3
    }))
    .pipe(gulp.dest(path.dist.contentImg))
    .pipe(connect.reload())
});

// css build
gulp.task('cssOwn:build', () => {
  gulp.src(path.src.css)
    .pipe(sourcemaps.init())
    .pipe(sass({
      compress: true,
      'include css': true,
      includePaths: ['./partial']
    }))
    .pipe(prefixer({
      browser: ['last 3 version', "> 1%", "ie 8", "ie 7"]
    }))
    .pipe(sourcemaps.write())
    .pipe(sourcemaps.init())
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(path.dist.css))
    .pipe(connect.reload())
});

// build vebdor css
gulp.task('cssVendor:build', () => {
  gulp.src(path.src.cssVendor)
    .pipe(sourcemaps.init())
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.dist.css))
    .pipe(connect.reload())
});

// all styles build
gulp.task('css:build', [
  'cssOwn:build',
  // 'cssVendor:build'
]);

// build fonts
gulp.task('fonts:build', () => {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.dist.fonts))
});

// build htaccess
gulp.task('htaccess:build', () => {
  gulp.src(path.src.htaccess)
    .pipe(gulp.dest(path.dist.htaccess))
});

// build all these sh*t :D
gulp.task('build', [
  'html:build',
  'js:build',
  'sprites:build',
  'css:build',
  'fonts:build',
  'htaccess:build',
  'image:build',
  'imagescontent:build'
]);

// clean build
gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

// watch changes
gulp.task('watch', () => {
  watch([path.watch.html], (event, cb) => {
    gulp.start('html:build');
  });
  watch([path.watch.sprites], (event, cb) => {
    gulp.start('sprites:build');
  });
  watch([path.watch.contentImg], (event, cb) => {
    gulp.start('imagescontent:build');
  });
  watch([path.watch.css], (event, cb) => {
    gulp.start('css:build');
  });
  watch([path.watch.js], (event, cb) => {
    gulp.start('js:build');
  });
  watch([path.watch.img], (event, cb) => {
    gulp.start('image:build');
  });
  watch([path.watch.fonts], (event, cb) => {
    gulp.start('fonts:build');
  });
  watch([path.watch.htaccess], (event, cb) => {
    gulp.start('htaccess:build');
  });
});

// default task
gulp.task('default', ['build', 'watch', 'connect']);