const TerserPlugin = require('terser-webpack-plugin');  // ライセンスのコメントを別ファイルに出力するためのプラグイン

module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: `development`,

  // メインのJS
  // webpackのentryに記述するパスは`./`から始まる必要がある。
//  entry: `./src/main.js`,
  // 出力ファイル
  output: {
    filename: `bundle.js`
  },

  optimization: {
    minimizer: [
    new TerserPlugin({
        extractComments: 'all' // ライセンスを別ファイルに書き出す
    })
    ]
  }
}
