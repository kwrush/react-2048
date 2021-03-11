const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, '../src/index.tsx'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js',
    clean: true,
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
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
};
