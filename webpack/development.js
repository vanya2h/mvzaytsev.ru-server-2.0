const NodemonPlugin = require('nodemon-webpack-plugin');
const { config, paths } = require('../config');

const getDevelopmentConfig = base => ({
  mode: 'development',
  watch: true,
  devtool: 'inline-source-map',
  plugins: [...base.plugins, new NodemonPlugin()]
});

module.exports = base => ({
  ...base,
  ...getDevelopmentConfig(base)
});
