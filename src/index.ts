import 'reflect-metadata';
import { Server } from 'http';
import { run } from '~/runtime';
import { HTTP_SERVER, CONFIG } from './consts';
import { IConfig } from './interfaces/config';
import { UserController } from './controllers';


(async () => {
	const container = await run();
	const config = container.get<IConfig>(CONFIG);

	container.get(UserController);

	container.get<Server>(HTTP_SERVER).listen(config.port, () => {
		console.log(`Server available on localhost:${config.port}`);
	});
})();
