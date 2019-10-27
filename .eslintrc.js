module.exports = {
	parser: "@typescript-eslint/parser",
  extends: ["airbnb-typescript/base"],
  env: {
    "browser": true,
    "node": true,
    "commonjs": true
  },
	settings: {
    "import/resolver": "webpack",
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: "module",
  },
	rules: {
		"no-console": "off",
    "import/prefer-default-export": "off",
		"no-tabs": "off",
		"implicit-arrow-linebreak": "off",
		"object-curly-newline": "off",
		"new-cap": "off",
		"indent": ["error", "tab"],
		"no-underscore-dangle": ["error", { "allowAfterThis": true }],
		"max-len": ["error", {
			"code": 100,
			"tabWidth": 2
		}],
		"import/no-default-export": "warn",
		"import/no-extraneous-dependencies": "off",
    "@typescript-eslint/indent": "off",
		"@typescript-eslint/interface-name-prefix": "off",
		"@typescript-eslint/no-misused-new": "off",
		"@typescript-eslint/no-empty-interface": "off",
		"@typescript-eslint/explicit-function-return-type": [
			"warn",
			{
				allowExpressions: true,
				allowHigherOrderFunctions: true,
			},
		],
		"@typescript-eslint/no-parameter-properties": "off",
		"@typescript-eslint/no-use-before-define": "off",
	},
}
