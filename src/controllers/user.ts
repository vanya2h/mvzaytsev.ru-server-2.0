import { inject } from 'inversify';
import express from 'express';
import { UserModel } from '~/models/user';
import { provides } from '~/utils/provides';
import { ROUTER } from '~/consts';
import { JWTService } from '~/services/jwt';
import { protect } from '~/middlewares/protect';

@provides(UserController)
export class UserController {
	public constructor(
		@inject(ROUTER) router: express.Router,
		private readonly userModel: UserModel,
		private readonly jwtService: JWTService,
	) {
		router.use('/user', this.buildRouter());
	}

	private buildRouter = (): express.Router => {
		const router = express.Router();
		const { model } = this.userModel;

		router.get('/auth', protect, async (req, res) => res.json((req as any).user));

		router.post('/sign-up', async (req, res, next) => {
			try {
				const user = await model.create(req.body);
				return res.json(user);
			} catch (error) {
				return next(error);
			}
		});

		router.post('/sign-in', async (req, res, next) => {
			try {
				const user = await model.findOne({ email: req.body.email	});
				if (!user) throw new Error('Юзер с таким e-mail не зарегистрирован, извините');

				const isCompared = await user.comparePassword(req.body.password);
				if (!isCompared) throw new Error('Кажется вы ошиблись при вводе пароля, попробуйте снова');

				const token = this.jwtService.sign({
					// eslint-disable-next-line no-underscore-dangle
					userId: user._id,
				});

				return res.json({
					token,
					user,
				});
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
