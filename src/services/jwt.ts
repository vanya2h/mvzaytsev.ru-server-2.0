import jwt from 'jsonwebtoken';
import { inject } from 'inversify';
import { provides } from '~/utils/provides';
import { CONFIG } from '~/consts';
import { IConfig } from '~/interfaces/config';

@provides(JWTService)
export class JWTService {
	public constructor(@inject(CONFIG) private readonly config: IConfig) {}

	public sign = (payload: any): string => jwt.sign(payload, this.config.secret, {
		algorithm: 'HS256',
		expiresIn: '7d',
	});

	public verify = (token: string): any => {
		try {
			return jwt.verify(token, this.config.secret, {
				algorithms: ['HS256'],
			});
		} catch (error) {
			throw new Error('Требуется повторная авторизация, сессия истекла');
		}
	};
}
