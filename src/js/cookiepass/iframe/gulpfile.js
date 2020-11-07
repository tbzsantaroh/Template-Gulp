// このgulpfile.jsは最初に 'npm rebuild node-sass' をしないと動かないマジで。
// indexが無いときは http://localhost:3000/iframe.html みたいな感じで。

const gulp = require('gulp');
const sass = require('gulp-sass'); //Sassコンパイル
const plumber = require('gulp-plumber'); //エラー時の強制終了を防止
const notify = require('gulp-notify'); //エラー発生時にデスクトップ通知する
const sassGlob = require('gulp-sass-glob'); //@importの記述を簡潔にする
const browserSync = require( 'browser-sync' ); //ブラウザ反映
const postcss = require('gulp-postcss'); //autoprefixerとセット
const autoprefixer = require('autoprefixer'); //ベンダープレフィックス付与
const ejs = require("gulp-ejs");
const rename = require("gulp-rename"); //.ejsの拡張子を変更
const replace = require("gulp-replace"); // ejsの冒頭の空白削除用


// scssのコンパイル
gulp.task('sass', function() {
  return gulp
  .src( './src/scss/**/*.scss' )
  .pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )//エラーチェック
  .pipe( sassGlob() )//importの読み込みを簡潔にする 通常表記使ってるからこれは無くてもいい
  .pipe( sass({
  outputStyle: 'compressed' //expanded, nested, campact, compressedから選択
  }) )
  .pipe( postcss([ autoprefixer(
  {
  // ☆IEは11以上、Androidは4.4以上
  // その他は最新2バージョンで必要なベンダープレフィックスを付与する
  "overrideBrowserslist": ["last 1 versions", "ie >= 11", "Android >= 4"],
  cascade: false}
  ) ]) )
  .pipe(gulp.dest('css'));//コンパイル後の出力先
});


// 保存時のリロード
gulp.task( 'browser-sync', (done) => {
  browserSync.init({

  //ローカル開発
  server: {
  baseDir: "./",
  index: "index.html"
  }
  });
  done();
});

gulp.task( 'bs-reload', (done) => {
  browserSync.reload();
  done();
});


gulp.task("ejs", (done) => {
  gulp
  .src(["src/ejs/**/*.ejs", "!" + "src/ejs/**/_*.ejs"])
  .pipe(ejs()) // 上でconst宣言したこのコマンドを実行 これいる？
  .pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )//エラーチェック
  .pipe(replace(/[\s\S]*?(<!DOCTYPE)/, "$1")) // 冒頭の空白を正規表現で無理やり消す
  .pipe(rename({extname: ".html"})) //拡張子をhtmlに
  .pipe(gulp.dest("./")); //出力先
  done();
});


// 監視
gulp.task( 'watch', (done) => {
  gulp.watch('src/scss/**/*.scss', gulp.task('sass') ); //sassが更新されたらgulp sassを実行
  gulp.watch('src/scss/**/*.scss', gulp.task('bs-reload')); //sassが更新されたらbs-reloadを実行
  gulp.watch('src/ejs/**/*.ejs', gulp.task('ejs') ) ; //ejsが更新されたらgulp-ejsを実行
  gulp.watch('src/ejs/**/*.ejs', gulp.task('bs-reload') ) ; //ejsが更新されたらbs-reloadを実行
});

// default
gulp.task('default', gulp.series(gulp.parallel('browser-sync', 'watch')));
