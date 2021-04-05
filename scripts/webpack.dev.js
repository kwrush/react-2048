const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { merge } = require('webpack-merge');
const webpackCommon = require('./webpack.common');
const getLocalIPs = require('./getLocalIPs');

module.exports = merge(webpackCommon, {
  mode: 'development',
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
  ],
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    inline: true,
    port: 3000,
    after: (_, server) => {
      // Print the local ip if host mode is activated
      if (server.options.host === '0.0.0.0') {
        const ips = getLocalIPs();
        if (ips.length > 0) {
          // eslint-disable-next-line no-console
          console.log(
            `You can also access the development server at http://${ips[0]}:3000`,
          );
        }
      }
    },
  },
});
