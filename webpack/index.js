const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const path = require('path');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const { config, paths } = require('../config');
const getDevelopmentConfig = require('./development');
const getProductionConfig = require('./production');

const base = {
	entry: `${paths.sourceDir}/index.ts`,
	target: 'node',
	output: {
		path: paths.buildDir,
		publicPath: '/',
	},
	resolve: {
		extensions: ['.ts', '.js'],
		alias: {
			'~': paths.sourceDir,
		},
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
			},
		],
	},
	plugins: [
		new Dotenv({
			path: path.resolve(paths.rootDir, config.nodeEnv === 'production' ? '.env.prod' : '.env.dev'),
		}),
		new DuplicatePackageCheckerPlugin(),
		new webpack.EnvironmentPlugin({
			NODE_ENV: config.nodeEnv,
		}),
	],
	optimization: {
		minimizer: [
			new TerserWebpackPlugin({
				parallel: true,
				sourceMap: true,
				cache: true,
			}),
		],
	},
};

let webpackConfig = getProductionConfig(base);

switch (process.env.NODE_ENV) {
case 'production': {
	break;
}
case 'development': {
	webpackConfig = getDevelopmentConfig(base);
	break;
}
}

module.exports = webpackConfig;
