const paths = {
  'rootSrc' : './src/', // 入力パスのルートディレクトリ
  'root'    : './dist/',  // 出力パスのルートディレクトリ
  'pugSrc'  : './src/pug/**/',
  'pugDist' : './dist/',
  'ejsSrc'  : './src/ejs/**/',
  'ejsDist' : './dist/',
  'jsonejsSrc':'./src/ejs-json/ejss/',  // Json to Ejsの入力パス
  'jsonejsDist':'./dist/ejss/',  // Json to Ejsの出力パス
  'jsonSrcName':'list-data.json', // Json to Ejsのjsonファイル名
  'cssSrc'  : './src/scss/**/',
  'cssDist' : './dist/css/',
  'webpackSrcName':'entry.js', // バンドルJavaScriptファイル名
  'jsSrc'   : './src/js/',
  'jsDist'  : './dist/js/',
  'svgspriteSrc':'./src/img/SVGSprite/',  // SVGスプライトの入力パス
  'svgspriteDist':'./dist/img/',  // SVGスプライトの出力パス
  'sitemapURL': 'https://sampleurl.jp/sample/'  // サイトマップのルートURL フルパス表記
}
const assetFileNames = [  // srcからコピーするファイルタイプ指定 html,pug,ejs,json,css,scss,xml 以外
  './src/img/**/*.jpg',
  './src/img/**/*.gif',
  './src/img/**/*.png',
  './src/img/**/*.webp',
  './src/img/**/*.svg',
  './src/**/*.ico',
  './src/**/*.swf',
  './src/**/*.mp3',
  './src/**/*.ogg',
  './src/**/*.mp4',
  './src/**/*.av1',
  './src/**/*.txt',
  './src/**/.htaccess'
]

const gulp = require('gulp'),
  fs = require('fs'), // node.jsの標準機能のファイル・ディレクトリ操作
  sass = require('gulp-sass'), //Sassコンパイル
  plumber = require('gulp-plumber'), //エラー時の強制終了を防止
  notify = require('gulp-notify'), //エラー発生時にデスクトップ通知する
  browserSync = require('browser-sync'), //ブラウザ反映
  postcss = require('gulp-postcss'), //autoprefixerとセット
  autoprefixer = require('gulp-autoprefixer'), //ベンダープレフィックス付与
  svgmin = require('gulp-svgmin'),  // SVGファイルサイズ最適化
  svgstore = require('gulp-svgstore'),  // SVGファイル結合
  cheerio = require('gulp-cheerio'),  // SVGのfill削除用
  imagemin = require('gulp-imagemin'),  // 画像の可逆圧縮
  svgo = require('imagemin-svgo'),  // SVG圧縮
  ejs = require('gulp-ejs'),
  rename = require('gulp-rename'), //.ejsの拡張子を変更
  replace = require('gulp-replace'), // ejsの冒頭の空白削除用
  sitemap = require('gulp-sitemap'),  // サイトマップ生成
  pug = require('gulp-pug'),  // htmlコンパイル
  webpackStream = require("webpack-stream"),  // webpackのデータ受け渡し用
  webpack = require("webpack"); // webpack
const { src, dest, watch, lastRun, task, series, parallel } = require('gulp'); // gulpコマンドの省略 使うのをここに書くと関数内でgulp.って書かなくてすむ
const webpackConfig = require("./webpack.config");  // webpackの設定読み込み

compileSass = () => { // SASSコンパイル
  return src(paths.cssSrc + '*.scss', { sourcemaps: true, since: lastRun(compileSass) }) // watch使う場合はreturn必要 SourceMap出力有効
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })) //  エラーチェック
    .pipe(sass({outputStyle: 'compressed'}))  // 圧縮方法 expanded, nested, compact, compressedから選択
    .pipe(autoprefixer()) // ブラウザごとのfix .browserslistrc から自動読み込み
    .pipe(dest(paths.cssDist, {sourcemaps: './sourcemaps'}))
}

compilePug = () => {  // Pugコンパイル
  return src([paths.pugSrc + '*.pug', '!' + paths.pugSrc + '_*.pug'], {since: lastRun(compilePug)})
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })) //  エラーチェック
    .pipe(pug({ pretty: true }))  // 改行を含めた普通の見た目で出力
    .pipe(dest(paths.pugDist))
}

compileJs = () => { // Javascript更新用 圧縮はどうでもいいけどファイル自動更新されないのは面倒なのでpipeだけ残しておく
  return src(paths.jsSrc + '*.js', {since: lastRun(compileJs)})
    .pipe(dest(paths.jsDist))
}

compileWebpack = () => { // webpackコンパイル
  return src(paths.jsSrc + paths.webpackSrcName)  // gulp側ではインポートファイル認識できなさそうだからlastRunつけてない
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(dest(paths.jsDist))
}

copyFile = () => { // 画像とfavicon htaccessコピー ついでにSVG最適化
  return src(assetFileNames, { base: paths.rootSrc }, {since: lastRun(copyFile)})
    .pipe(imagemin([
      svgo({
        plugins: [{removeViewbox: false}]
      })
    ],
    {verbose: true} // ログ表示
    ))
    .pipe(dest(paths.root))
}

compileSvg = () => {  // SVGスプライト画像コンパイル
  return src(paths.svgspriteSrc + '*.svg', {since: lastRun(compileSvg)}) // 結合するSVG専用フォルダを指定 SVGSprite/
    .pipe(svgmin())
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(cheerio({
      run: ($, file) => {
        $('[fill]').removeAttr('fill');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(dest(paths.svgspriteDist))
}

compileEjs = () => {  // EJSコンパイル
  return src([paths.ejsSrc + '*.ejs', '!' + paths.ejsSrc + '_*.ejs'], {since: lastRun(compileEjs)})
    .pipe(ejs())
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })) //  エラーチェック
    .pipe(replace(/[\s\S]*?(<!DOCTYPE)/, "$1")) // 冒頭の空白を正規表現で無理やり消す
    .pipe(rename({extname: '.html'})) // 拡張子をhtmlに
    .pipe(dest(paths.ejsDist))
}

compileJsonEjs = () => {  // json to EJSコンパイル
  let jsonFile = (paths.jsonejsSrc + paths.jsonSrcName),
      tempFile = (paths.jsonejsSrc + '*.ejs'),
      json = JSON.parse(fs.readFileSync(jsonFile, 'utf8')),
      pages = json.pages,
      id;
  for (var i = 0; i < pages.length; i++) {
    id = pages[i].id;
    return src(tempFile)
      .pipe(ejs({ jsonData: pages[i] }))
      .pipe(replace(/[\s\S]*?(<!DOCTYPE)/, "$1")) // 冒頭の空白を正規表現で無理やり消す
      .pipe(rename(id + '.html'))
      .pipe(gulp.dest(paths.jsonejsDist));
  }
}

compileSitemap = () => {  // Sitemap https://cluster-seo.com/blog/generate-sitemap.html#outline__3_2
  return src(paths.root + './**/*.html', { read: false })
    .pipe(sitemap({siteUrl: paths.sitemapURL}))
    .pipe(dest(paths.root))
}

browsersyncTask = () => { // browser-sync
  return browserSync.init({
    server: { baseDir: paths.root },
    reloadOnRestart: true
  })
}


watchTask = () => { // watch
  reload = () => { return browserSync.reload() } // browser-sync reload
  watch(paths.pugSrc + '*.pug').on('change', series(compilePug, reload))
  // watch(paths.ejsSrc + '*.ejs').on('change', series(compileEjs, reload))
  watch(paths.cssSrc + '*.scss').on('change', series(compileSass, reload))
  watch(paths.jsSrc + '**/*.js').on('change', series(compileWebpack, reload))
}

// 実行用コマンド
exports.default = parallel(watchTask, browsersyncTask);
exports.sass = parallel(compileSass);
exports.pug = parallel(compilePug);
exports.js = parallel(compileJs);
exports.webpack = parallel(compileWebpack);
exports.img = parallel(copyFile);
exports.svg = parallel(compileSvg);
exports.ejs = parallel(compileEjs);
exports.jsonejs = parallel(compileJsonEjs);
exports.sitemap = parallel(compileSitemap);
exports.release = parallel(compileSass, compilePug, compileJs, copyFile, compileEjs, compileSitemap, compileWebpack);
