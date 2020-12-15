const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const os = require('os');

/** Get local externel ip addresses */
const getLocalIp = () => {
  const networkInterfaces = os.networkInterfaces();
  return Object.values(networkInterfaces).reduce((acc, dev) => {
    const addresses = dev.reduce((res, details) => {
      if (details.family === 'IPv4' && !details.internal) {
        res.push(details.address);
      }
      return res;
    }, []);

    if (addresses.length > 0) {
      acc.push(addresses[0]);
    }
    return acc;
  }, []);
};

module.exports = {
  mode: 'development',
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
    // Add .ts and .tsx as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    inline: true,
    hot: true,
    port: 3000,
    after: (_, server) => {
      // Print the local ip if host mode is activated
      if (server.options.host === '0.0.0.0') {
        const ips = getLocalIp();
        if (ips.length > 0) {
          // eslint-disable-next-line no-console
          console.log(
            `You can also access the development server at http://${ips[0]}:3000`,
          );
        }
      }
    },
  },
};
