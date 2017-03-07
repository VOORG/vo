var webpack = require('webpack')

module.exports = {
  entry: './src/vo.js',
  output: {
    path: __dirname,
    filename: './dist/vo.js'
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: "babel"},
      {test: /\.css$/, loader: "style!css"},
      {test: /\.(jpgpng)$/, loader: "url?limit=8192"},
      {test: /\.scss$/, loader: "style!css!sass"}
    ]
  }
}