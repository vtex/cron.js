var webpack = require('webpack')

module.exports = {

  entry: {
    main: ['./src/cron.js']
  },
  output: {
    path: 'dist',
    filename: 'cron.min.js',
    library: 'Cron',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.js$/, exclude: /node_modules/, loader: 'babel'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]

}
