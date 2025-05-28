  const path = require("path");
  const common = require("./webpack.common.js");
  const { merge } = require("webpack-merge");

  module.exports = merge(common, {
    mode: "development",
    devServer: {
      static: path.resolve(__dirname, "dist"),
      historyApiFallback: true,
      port: 9000,
      hot: true,
      client: {
        overlay: {
          errors: true,
          warnings: true,
        },
      },
      watchFiles: ["src/**/*"],
    },
  });