import webpack from 'webpack'

export default {
  entry: {
    'mp-kat-scraper': ['./src']
  },
  output: {
    path: 'lib',
    library: 'KAT',
    libraryTarget: 'umd',
    filename: '[name].js'
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.json?$/,
        loader: 'json'
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'stage-0'],
          plugins: [
            'transform-class-properties',
            ['transform-runtime', {
              polyfill: false,
              regenerator: true
            }]
          ]
        }
      }
    ],
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/^\.\/package$/, function(result) {
      if (/cheerio/.test(result.context))
        result.request = './package.json'
    })
  ]
}
