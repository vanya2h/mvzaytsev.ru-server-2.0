const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { config } = require('../config');

const getOptionalPlugins = () => {
	const plugins = [];

	if (config.isAnalyzeModeEnabled) {
		plugins.push(new BundleAnalyzerPlugin());
	}
	return plugins;
};

const getProductionConfig = base => ({
	mode: 'production',
	devtool: false,
	plugins: [...getOptionalPlugins(), ...base.plugins],
});

module.exports = base => ({
	...base,
	...getProductionConfig(base),
});
