import { inject } from 'inversify';
import express from 'express';
import { UserModel } from '~/models/user';
import { provides } from '~/utils/provides';
import { ROUTER } from '~/consts';
import { JWTService } from '~/services/jwt';
import { protect } from '~/middlewares/protect';
import { EmailModel } from '~/models/email';

@provides(UserController)
export class UserController {
	public constructor(
		@inject(ROUTER) router: express.Router,
		private readonly userModel: UserModel,
		private readonly emailModel: EmailModel,
		private readonly jwtService: JWTService,
	) {
		router.use('/user', this.buildRouter());
	}

	private buildRouter = (): express.Router => {
		const router = express.Router();
		const { model } = this.userModel;

		router.get('/auth', protect, async (req, res) => {
			res.json((req as any).user);
		});

		router.post('/sign-up', async (req, res, next) => {
			try {
				const user = await model.create({
					...req.body,
					email: await this.emailModel.model.create({
						email: req.body.email,
					}),
				});

				return res.json(user);
			} catch (error) {
				return next(error);
			}
		});

		router.post('/sign-in', async (req, res, next) => {
			try {
				// eslint-disable-next-line no-underscore-dangle
				const [user] = await model.aggregate([
					{
						$lookup: {
							from: 'emails',
							localField: 'email',
							foreignField: '_id',
							as: 'email',
						},
					},
					{ $unwind: '$email' },
					{
						$addFields: {
							email_raw: '$email.email',
						},
					},
					{
						$match: {
							email_raw: req.body.email,
						},
					},
				]);

				if (!user) throw new Error('Пользователь с таким E-mail не зарегистрован');
				// eslint-disable-next-line no-underscore-dangle
				const userDoc = await model.findById(user._id);

				if (!userDoc) throw new Error('Что-то пошло не так, обратитесь в поддержку');

				const isCompared = await userDoc.comparePassword(req.body.password);
				if (!isCompared) throw new Error('Кажется вы ошиблись при вводе пароля, попробуйте снова');

				const token = this.jwtService.sign({
					// eslint-disable-next-line no-underscore-dangle
					userId: userDoc._id,
				});

				return res.json({ token, user });
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

		router.get('/entries', async (req, res, next) => {
			try {
				return res.json(
					await model.find().limit(10).skip(JSON.parse(req.query.skip)).sort('createdAt'),
				);
			} catch (error) {
				return next(error);
			}
		});

		router.get('/email', protect, async (req: any, res, next) => {
			try {
				const email = await this.emailModel.model.findById(req.user.email);
				if (!email) throw new Error('Данный E-mail не зарегистрирован, обратитесь к поддержку');

				await email.resend();
				return res.json(true);
			} catch (error) {
				return next(error);
			}
		});

		router.post('/confirm', protect, async (req: any, res, next) => {
			try {
				const email = await this.emailModel.model.findById(req.user.email);
				if (!email) throw new Error('Данный E-mail не зарегистрирован, обратитесь к поддержку');

				await email.confirm(req.body.secret);
				return res.json(true);
			} catch (error) {
				return next(error);
			}
		});

		return router;
	};
}
