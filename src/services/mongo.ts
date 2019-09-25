import mongoose, { Mongoose, ConnectionOptions } from 'mongoose';
import { provides } from '~/utils/provides';

@provides(MongoService)
export class MongoService {
	public static defaultOpts: ConnectionOptions = {
		poolSize: 5,
		reconnectInterval: 2000,
		connectTimeoutMS: 30000,
		keepAlive: true,
		keepAliveInitialDelay: 30000,
		reconnectTries: Number.MAX_VALUE,
		promiseLibrary: Promise,
		useNewUrlParser: true,
		ssl: true,
		useUnifiedTopology: true,
	};

	public static connect = (
		url: string,
		opts: ConnectionOptions = {},
	): Promise<Mongoose> =>
		mongoose.connect(url, {
			...MongoService.defaultOpts,
			...opts,
		});

	public createConnection = async (
		url: string,
		opts: ConnectionOptions = {},
	): Promise<Mongoose> => {
		try {
			const connection = await MongoService.connect(url, opts);
			console.log(`Connected to ${url}`);

			return connection;
		} catch (error) {
			console.log(error);

			throw new Error(`Cannot connect to ${url}`);
		}
	};
}
