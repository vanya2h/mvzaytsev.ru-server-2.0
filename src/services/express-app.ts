import http, { Server } from 'http';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import express, { Application } from 'express';
import { provides } from '~/utils/provides';

@provides(ExpressAppService)
export class ExpressAppService {
	public build = (): {
		app: Application,
		server: Server
	} => {
		const app = express();
		const server = http.createServer(app);

		app.use(cookieParser());
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(bodyParser.json());
		app.use(cors());
		app.use(morgan('dev'));

		return {
			app,
			server,
		};
	};
}
