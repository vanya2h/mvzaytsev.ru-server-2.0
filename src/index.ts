import 'reflect-metadata';
import { Server } from 'http';
import { Application, Request, Response, NextFunction } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import { run } from '~/runtime';
import swaggerUi from 'swagger-ui-express';
import { HTTP_SERVER, CONFIG, EXPRESS_APP, ROUTER } from './consts';
import { IConfig } from './interfaces/config';
import { UserController } from './controllers';
import { swaggerOptions } from './swagger';
import { IAppError } from './interfaces/app-error';


(async () => {
	const container = await run();
	const config = container.get<IConfig>(CONFIG);
	const app = container.get<Application>(EXPRESS_APP);
	const router = container.get<Application>(ROUTER);

	container.get(UserController);

	app.use(config.prefix, router);

	app.use((err: any, _: Request, res: Response, __: NextFunction) => {
		if (err.name === 'ValidationError') {
			res.status(422);
			return res.json(err);
		}

		res.status(500);
		let errorMessage;

		if (err instanceof Error) {
			errorMessage = err.message;
		}

		return res.json({
			reason: errorMessage || "Неизвестная ошибка"
		} as IAppError);
	});

	const swaggerSpec = swaggerJSDoc(swaggerOptions);
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	container.get<Server>(HTTP_SERVER).listen(config.port, () => {
		console.log(`Server available on localhost:${config.port}`);
	});
})();
