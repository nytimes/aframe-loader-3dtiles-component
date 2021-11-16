const path = require('path');

const PLUGINS = [];

module.exports = {
  devServer: {
    static: __dirname,
    host: '0.0.0.0'
  },
  entry: './index.js',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  output: {
    globalObject: 'this',
    path: path.join(__dirname, 'dist'),
    filename: process.env.NODE_ENV === 'production' ? 'aframe-loader-3dtiles-component.min.js' : 'aframe-loader-3dtiles-component.js',
    publicPath: '/dist',
    libraryTarget: 'umd'
  },
  plugins: PLUGINS,
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /(node_modules)/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    modules: [path.join(__dirname, 'node_modules')]
  },
  externals: {
    three: 'THREE',
    'three/examples/jsm/loaders/GLTFLoader.js': 'THREE',
    'three/examples/jsm/loaders/DRACOLoader.js': 'THREE',
    'three/examples/jsm/loaders/KTX2Loader.js': 'THREE'
  }
};
