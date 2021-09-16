const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  mode: process.env.NODE_ENV,
  entry: "./src/index.tsx",
  output: {
    path: `${__dirname}/dist`,
    filename: "[contenthash].bundle.js",
  },
  target: "web",
  node: {
    global: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.scss$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
            }
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(jpe?g|png)$/i,
        loader: "file-loader",
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    fallback: {
      "fs": false,
      "path": false,
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/index.html"),
      filename: "index.html",
    }),
  ],
  devServer: {
    index: "index.html",
    contentBase: path.join(__dirname, "dist"),
    compress: false,
    port: 3000,
    historyApiFallback: true,
  },
  experiments: {
    topLevelAwait: true,
  }
};