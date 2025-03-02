const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",  // Ensure this is pointing to your main TypeScript file
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"), // Ensure this is where you want your bundle
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html", // Make sure this path is correct!
    }),
  ],
};
