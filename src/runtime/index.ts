import { Container } from 'inversify';
import express, { Application } from 'express';
import { buildProviderModule } from 'inversify-binding-decorators';
import { Server } from 'http';
import { IConfig } from '~/interfaces/config';
import {
	CONFIG, MONGOOSE, EXPRESS_APP, HTTP_SERVER, ROUTER,
} from '~/consts';
import { MongoService } from '~/services/mongo';
import { HashifierService } from '~/services/hashifier';
import { ExpressAppService } from '~/services/express-app';

export const container = new Container();

export const run = async (): Promise<Container> => {
	const config: IConfig = {
		mongoUser: process.env.MONGO_USER,
		mongoPassword: process.env.MONGO_PASSWORD,
		mongoHost: process.env.MONGO_HOST,
		mongoDatabase: process.env.MONGO_DATABASE,
		secret: process.env.SECRET,
		prefix: process.env.PREFIX,
		port: parseInt(process.env.PORT, 10),
	};

	container.bind(CONFIG).toConstantValue(config);

	const mongoService = new MongoService();

	const connection = await mongoService.createConnection(`mongodb+srv://${config.mongoHost}`, {
		dbName: config.mongoDatabase,
		pass: config.mongoPassword,
		user: config.mongoUser,
	});

	container.bind(MONGOOSE).toConstantValue(connection);

	const hashifier = new HashifierService(process.env.SECRET);

	container.bind(HashifierService).toConstantValue(hashifier);

	const expressAppService = new ExpressAppService();
	const { app, server } = expressAppService.build();

	container.bind<Application>(EXPRESS_APP).toConstantValue(app);
	container.bind<Server>(HTTP_SERVER).toConstantValue(server);

	const router = express.Router();

	container.bind<express.Router>(ROUTER).toConstantValue(router);

	container.load(buildProviderModule());

	return container;
};
