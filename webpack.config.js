const path = require("path");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
  const dev = env.development;
  return {
    mode: dev ? "development" : "production",
    entry: "./src/index.js",
    output: {
      filename: "main.js", // dev ? "main.js" : "[name].[contenthash].js",
      path: path.resolve(__dirname, "dist"),
      assetModuleFilename: "[name][ext]",
    },
    devtool: dev ? "inline-source-map" : "source-map",
    optimization: {
      usedExports: true,
    },
    // sideEffects: [ "*.scss" ],
    //target: dev ? "web" : "browserslist",
    devServer: {
      //static: path.resolve(__dirname),
      historyApiFallback: true,
      hot: true,
      proxy: {
        // "/api": "http://192.168.18.149:5000",
        "/api": "http://localhost:5000",
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader?cacheDirectory",
            options: {
              plugins: [dev && "react-refresh/babel"].filter(Boolean),
            },
          },
        },
        {
          test: /\.scss$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|ico|webp)$/i,
          type: "asset/resource",
        },
        // {
        //   test: /\.html$/i,
        //   loader: "html-loader",
        // },
      ],
    },
    plugins: [
      //dev && new webpack.HotModuleReplacementPlugin(),
      dev && new ReactRefreshWebpackPlugin(),
      new HtmlWebpackPlugin({ template: './src/index.html' }),
    ].filter(Boolean),
  };
};
