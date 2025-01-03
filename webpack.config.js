const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production', // Optimized for production
  entry: {
    popup: './popup.js', // Entry point for popup
    signup: './signup.js', // Entry point for signin
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js', // Generates popup.bundle.js and signin.bundle.js
  },
  devtool: 'source-map', // Generates source maps for easier debugging
  module: {
    rules: [
      {
        test: /\.js$/, // Transpile JavaScript files
        exclude: /node_modules/, // Ignore dependencies
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'], // Support modern JavaScript
          },
        },
      },
      {
        test: /\.ts$/, // Support for TypeScript if needed
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'], // Resolve both JavaScript and TypeScript files
    modules: ['node_modules'],
  },
  plugins: [
    new webpack.ProvidePlugin({
      createClient: ['@supabase/supabase-js', 'createClient'],
    }),
  ],
};
