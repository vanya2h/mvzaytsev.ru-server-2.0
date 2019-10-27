export const swaggerDefinition = {
	info: {
		title: 'mvzaytsev.ru',
		version: '1.0.0',
	},
	basePath: '/api',
	securityDefinitions: {
		ApiKey: {
			type: 'apiKey',
			name: 'authorization',
			scheme: 'bearer',
			in: 'header',
		},
	},
};

export const swaggerOptions = {
	swaggerDefinition,
	apis: [
		'./src/controllers/*.ts',
		'./src/interfaces/*.ts',
		'./src/models/**/*.ts',
	],
};
