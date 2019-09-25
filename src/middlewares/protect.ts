import { RequestHandler } from 'express';
import { container } from '~/runtime';
import { JWTService } from '~/services/jwt';
import { UserModel } from '~/models/user';

export const protect: RequestHandler = async (req, _, next) => {
	try {
		if (typeof req.headers.authorization !== 'undefined') {
			const decoded = container.get(JWTService).verify(req.headers.authorization);
			if (decoded && decoded.userId) {
				const user = await container.get(UserModel).model.findById(decoded.userId);
				(req as any).user = user;

				return next();
			}

			throw new Error('Во время авторизации что-то пошло не так, попробуйте позже');
		} else {
			throw new Error('Требуется авторизация');
		}
	} catch (error) {
		return next(error);
	}
};
