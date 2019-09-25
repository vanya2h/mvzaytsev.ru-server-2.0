import 'reflect-metadata';
import { Server } from 'http';
import {
	Application, Request, Response, NextFunction,
} from 'express';
import { run } from '~/runtime';
import {
	HTTP_SERVER, CONFIG, EXPRESS_APP, ROUTER,
} from './consts';
import { IConfig } from './interfaces/config';
import { UserController } from './controllers';


(async () => {
	const container = await run();
	const config = container.get<IConfig>(CONFIG);
	const app = container.get<Application>(EXPRESS_APP);
	const router = container.get<Application>(ROUTER);

	container.get(UserController);

	app.use(config.prefix, router);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	app.use((err: any, req: Request, res: Response, __: NextFunction) => {
		if (err.name === 'ValidationError') {
			res.status(422);
			return res.json(err);
		}

		res.status(500);

		if (err instanceof Error) {
			return res.json({
				reason: err.message,
			});
		}

		return res.json({
			reason: 'Неизвестная ошибка',
		});
	});


	container.get<Server>(HTTP_SERVER).listen(config.port, () => {
		console.log(`Server available on localhost:${config.port}`);
	});
})();
