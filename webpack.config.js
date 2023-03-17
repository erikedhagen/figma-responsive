/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

module.exports = {
  mode: 'production',
  devtool: false,
  experiments: {
    topLevelAwait: true
  },
  entry: {
    app: './src/app.ts'
  },
  resolve: {
    extensions: ['.ts']
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ }]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
}
