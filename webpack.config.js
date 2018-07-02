const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    "pious-squid": path.join(__dirname, "dist", "index.js"),
    "pious-squid.min": path.join(__dirname, "dist", "index.js")
  },
  output: {
    path: path.join(__dirname, "bundle"),
    filename: "[name].js",
    library: "PiousSquid"
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        include: /\.min\.js$/
      })
    ]
  }
};
