'use strict';

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const pkg = require('./package');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {

  entry: {
    [pkg.name]: path.join(__dirname, 'assets', 'app')
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
    filename: '[name].js'
  },

  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }, {
        test: /\.json$/,
        loader: 'json-loader',
        exclude: /node_modules/
      }, {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!less-loader'
        })
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin(`${pkg.name}.css`)
  ]
};
