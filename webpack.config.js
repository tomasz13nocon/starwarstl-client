const path = require("path");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const webpack = require("webpack");

module.exports = (env) => {
  const dev = env.development;
  return {
    mode: dev ? "development" : "production",
    entry: "./src/index.js",
    output: {
      filename: dev ? "main.js" : "[name].[contenthash].js",
      path: path.resolve(__dirname, "dist"),
    },
    devtool: dev ? "inline-source-map" : undefined,
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
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      //dev && new webpack.HotModuleReplacementPlugin(),
      dev && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
  };
};
