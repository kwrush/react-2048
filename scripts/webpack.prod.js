const { merge } = require('webpack-merge');
const { GenerateSW } = require('workbox-webpack-plugin');
const webpackCommon = require('./webpack.common');
const { name } = require('../package.json');

module.exports = merge(webpackCommon, {
  mode: 'production',
  output: {
    clean: true,
  },
  plugins: [
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      modifyURLPrefix: { url: `/${name}/` },
    }),
  ],
});
