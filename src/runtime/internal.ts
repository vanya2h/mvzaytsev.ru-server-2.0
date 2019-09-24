import { AsyncContainerModule } from 'inversify';
import { IConfig } from '~/interfaces/config';
import { CONFIG, MONGOOSE } from '~/consts';
import { MongoService } from '~/services/mongo';

export const internalModule = new AsyncContainerModule(async bind => {
	const config: IConfig = {
		mongoUser: process.env.MONGO_USER,
		mongoPassword: process.env.MONGO_PASSWORD,
		mongoHost: process.env.MONGO_HOST,
		mongoDatabase: process.env.MONGO_DATABASE,
	};

	bind(CONFIG).toConstantValue(config);

	const mongoService = new MongoService();

	const connection = await mongoService.createConnection(
		`mongodb+srv://${config.mongoHost}/${config.mongoDatabase}`,
	);

	bind(MONGOOSE).toConstantValue(connection);
});
