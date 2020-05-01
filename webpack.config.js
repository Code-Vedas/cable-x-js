const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    "cable-x-js": "./src/index.ts",
    "cable-x-js.min": "./src/index.ts",
  },
  externals: {
    rxjs: "rxjs",
    "rxjs/operators": "rxjs/operators",
    actioncable: "actioncable",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    libraryTarget: "umd",
    library: "CableXJs",
    umdNamedDefine: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  devtool: "source-map",
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: "awesome-typescript-loader",
        exclude: /node_modules/,
        query: {
          declaration: false,
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin([
      {
        from: "src/package.json",
        to: "package.json",
      },
    ]),
    new CopyPlugin([
      {
        from: "README.md",
        to: "README.md",
      },
    ]),
    new CopyPlugin([
      {
        from: "LICENSE",
        to: "LICENSE",
      },
    ]),
  ],
};
