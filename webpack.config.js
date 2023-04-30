const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CompiledExtractPlugin } = require('@compiled/webpack-loader');
module.exports = {
    plugins: [
        new MiniCssExtractPlugin(),
        new CompiledExtractPlugin(),
        new HtmlWebpackPlugin({
            template: "public/index.html", // to import index.html file inside index.js
        }),
    ],
    devServer: {
        port: 4040, // you can change the port
        historyApiFallback: true,
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // .js and .jsx files
                exclude: /node_modules/, // excluding the node_modules folder
                use: [{
                    loader: "babel-loader",
                },
                {
                    loader: '@compiled/webpack-loader',
                    options: {
                        extract: true,
                    },
                }],
            },
            {
                test: /\.(sa|sc|c)ss$/, // styles files
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/, // to import images and fonts
                loader: "url-loader",
                options: { limit: false },
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            }
        ],
    },
};