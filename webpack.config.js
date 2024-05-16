import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

export default {
  mode: "development",
  devServer: {
    open: true,
    historyApiFallback: true,
    port: 3000,
    hot: true,
  },

  resolve: {
    extensions: [".js", ".jsx"],
  },

  entry: "./src/index",

  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        use: [{ loader: "babel-loader" }],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: `./public/index.html`,
    }),
    new CleanWebpackPlugin(),
  ],
};
