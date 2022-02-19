const path = require('path');
const { merge } = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');
const webpackCommon = require('./webpack.common');

module.exports = merge(webpackCommon, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, '../dist'),
    },
    port: 3000,
    onListening: async () => {
      const ip = await WebpackDevServer.internalIP('v4');
      // eslint-disable-next-line no-console
      console.log(
        `\n\x1b[1mYou can access the development server from another device via \x1b[4;36mhttp://${ip}:3000/\x1b[0m\n`,
      );
    },
  },
});
