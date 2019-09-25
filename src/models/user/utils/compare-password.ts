import bcrypt from 'bcrypt';
import { IUser } from '../types';

export function comparePassword(this: IUser, candidate: string): Promise<boolean> {
	const user = this;

	return new Promise((resolve, reject) => {
		bcrypt.compare(candidate, user.password, (err, isMatch) => {
			if (err) {
				reject(err);
			} else {
				resolve(isMatch);
			}
		});
	});
}
