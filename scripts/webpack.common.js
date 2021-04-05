const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const { author, description } = require('../package.json');

module.exports = {
  entry: path.resolve(__dirname, '../src/index.tsx'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new FaviconsWebpackPlugin({
      logo: './public/images/favicon.svg',
      favicons: {
        appName: 'React 2048',
        appShortName: '2048',
        developerName: author,
        appDescription: description,
        background: 'white',
        theme_color: 'white',
        display: 'fullscreen',
        orientation: 'portrait',
        start_url: '../index.html',
        icons: {
          android: true,
          appleIcon: true,
          favicons: true,
          windows: true,
          appleStartup: false,
          coast: false,
          firefox: false,
          yandex: false,
        },
      },
    }),
  ],
};
