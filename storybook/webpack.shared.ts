import { Configuration } from "webpack/types";

const babelConfig = require("../babel.config.json");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
	rules: [
		{
			test: /\.html$/,
			loader: "html-loader"
		},

		{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			use: [
				{
					loader: "babel-loader",
					options: babelConfig
				}
			]
		},

		{
			test: /\.(less|css)$/,
			use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]
		},

		{
			test: /\.(jpg|png|woff|woff2|eot|ttf|ttc|svg)$/,
			use: [
				{
					loader: "file-loader",
					options: {
						name: "images/[name].[ext]"
					}
				}
			]
		}
	],
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name].[contenthash:8].css",
			chunkFilename: "[id].[name].[contenthash:8].css"
		})
	],
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					format: {
						comments: false
					}
				},
				extractComments: false
			})
		]
	}
} as Configuration;
