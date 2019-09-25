import { inject } from 'inversify';
import express from 'express';
import { UserModel } from '~/models/user';
import { provides } from '~/utils/provides';
import { ROUTER } from '~/consts';

@provides(UserController)
export class UserController {
	public constructor(
		@inject(ROUTER) router: express.Router,
		private readonly userModel: UserModel,
	) {
		console.log('123');
		console.log(router);
		router.use('/user', this.buildRouter());
	}

	private buildRouter = (): express.Router => {
		const router = express.Router();
		const { model } = this.userModel;

		router.post('/entry', async (req, res, next) => {
			try {
				const user = await model.create(req.body);
				return res.json(user);
			} catch (error) {
				return next(error);
			}
		});

		router.get('/entry', async (req, res, next) => {
			try {
				const user = await model.findById(req.query.id);
				if (!user) {
					throw new Error('Пользователь не найден');
				}
				return res.json(user);
			} catch (error) {
				return next(error);
			}
		});

		return router;
	};
}
