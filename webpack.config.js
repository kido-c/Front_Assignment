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
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },

  entry: "./src/index",

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        use: [{ loader: "babel-loader" }],
        exclude: /node_modules/,
      },

      {
        test: /\.(ts|tsx)?$/,
        use: ["ts-loader"],
        exclude: ["/node_modules/"],
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
