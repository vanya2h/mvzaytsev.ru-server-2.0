module.exports = {
	parser: '@typescript-eslint/parser',
  extends: ['airbnb-typescript/base'],
  env: {
    'browser': true,
    'node': true,
    'commonjs': true
  },
	settings: {
    'import/resolver': 'webpack',
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
  },
	rules: {
		'no-console': 0,
    'import/prefer-default-export': 0,
		'no-tabs': 0,
		'implicit-arrow-linebreak': 0,
		'indent': [2, 'tab'],
		'no-underscore-dangle': [2, { 'allowAfterThis': true }],
		'max-len': [2, {
			'code': 100,
			'tabWidth': 2
		}],
    'import/no-default-export': 1,
    '@typescript-eslint/indent': 0,
		'@typescript-eslint/interface-name-prefix': 0,
		'@typescript-eslint/no-misused-new': 0,
		'@typescript-eslint/no-empty-interface': 0,
		'@typescript-eslint/explicit-function-return-type': [
			'warn',
			{
				allowExpressions: true,
				allowHigherOrderFunctions: true,
			},
		],
		'@typescript-eslint/no-parameter-properties': 0,
		'@typescript-eslint/no-use-before-define': 0,
	},
}
