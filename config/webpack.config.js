const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const { join } = require('path');

require('dotenv').config({ path: join(__dirname, '.env') });

module.exports = {
	context: __dirname,
	devtool: 'source-map',
	entry: [ join(__dirname, '..', 'src/main.ts') ],
	resolve: {
		extensions: [ '.ts', '.js' ],
		plugins: [ PnpWebpackPlugin ]
	},
	node: {
		__dirname: false
	},
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/,
				use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
			},
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				options: PnpWebpackPlugin.tsLoaderOptions({
					configFile: join(__dirname, 'tsconfig.json'),
					// Disable the type-checking, as it will be checked by another module
					transpileOnly: true
				})
			}
		]
	},
	output: {
		filename: '[name].js',
		path: join(__dirname, '..', 'build')
	},
	plugins: [
		new ForkTsCheckerWebpackPlugin(PnpWebpackPlugin.forkTsCheckerOptions({
			test: /\.ts$/,
			configFile: join(__dirname, 'tsconfig.json'),
			eslint: true,
			eslintOptions: {
				configFile: join(__dirname, '.eslintrc.js')
			}
		})),
		new CopyWebpackPlugin([
			{ from: '**/*.html', to: '', context: join(__dirname, '..', 'src') },
			{ from: '**/*.js', to: '', context: join(__dirname, '..', 'src') },
			{ from: 'vbs', to: '../build/vbs', context: join(__dirname, '..', 'src') },
			{ from: 'scss/spectrum.min.css', to: '../build/css', context: join(__dirname, '..', 'src') }
		]),
		new MiniCssExtractPlugin({ filename: 'css/[name].css' })
	],
	resolveLoader: {
		plugins: [ PnpWebpackPlugin.moduleLoader(module) ]
	},
	target: 'electron-main'
};
