import { Container } from 'inversify';
import express, { Application } from 'express';
import { buildProviderModule } from 'inversify-binding-decorators';
import { Server } from 'http';
import { IConfig } from '~/interfaces/config';
import * as consts from '~/consts';
import { MongoService } from '~/services/mongo';
import { PasswordVerifier } from '~/services/password-verifier';
import { ExpressAppService } from '~/services/express-app';

export const container = new Container();

export const run = async (): Promise<Container> => {
	const config: IConfig = {
		mongoUser: process.env.MONGO_USER,
		mongoPassword: process.env.MONGO_PASSWORD,
		mongoHost: process.env.MONGO_HOST,
		mongoDatabase: process.env.MONGO_DATABASE,
		secret: process.env.SECRET,
		emailActor: process.env.EMAIL_ACTOR,
		emailActorName: process.env.EMAIL_ACTOR_NAME,
		prefix: process.env.PREFIX,
		port: parseInt(process.env.PORT, 10),
	};

	container.bind(consts.CONFIG).toConstantValue(config);

	const mongoService = new MongoService();

	const connection = await mongoService.createConnection(`mongodb+srv://${config.mongoHost}`, {
		dbName: config.mongoDatabase,
		pass: config.mongoPassword,
		user: config.mongoUser,
	});

	container.bind(consts.MONGOOSE).toConstantValue(connection);

	const passwordVerfier = new PasswordVerifier(process.env.SECRET);
	container.bind(PasswordVerifier).toConstantValue(passwordVerfier);

	const expressAppService = new ExpressAppService();
	const { app, server } = expressAppService.build();

	container.bind<Application>(consts.EXPRESS_APP).toConstantValue(app);
	container.bind<Server>(consts.HTTP_SERVER).toConstantValue(server);

	const router = express.Router();
	container.bind<express.Router>(consts.ROUTER).toConstantValue(router);

	container.load(buildProviderModule());

	return container;
};
