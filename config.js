// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');

const rootDir = path.resolve(__dirname);

const paths = {
	rootDir,
	sourceDir: path.join(rootDir, 'src'),
	buildDir: path.join(rootDir, 'build'),
};

const config = {
	devServerPort: parseInt(process.env.PORT, 10) || 3001,
	nodeEnv: process.env.NODE_ENV || 'production',
	isAnalyzeModeEnabled: process.env.ANALYZE === 'true',
};

module.exports = {
	paths,
	config,
};
