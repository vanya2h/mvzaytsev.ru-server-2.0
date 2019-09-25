import mongoose, { Schema, Model, HookNextFunction } from 'mongoose';
import { provides } from '~/utils/provides';
import { comparePassword } from './utils/compare-password';
import { HashifierService } from '~/services/hashifier';
import { IUser } from './types';

@provides(UserModel)
export class UserModel {
	public static createSchema = (): Schema<IUser> => new Schema({
		email: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		password: { type: String, required: true },
	}, {
		timestamps: true,
	});

	public model: Model<IUser>;

	public constructor(hashifier: HashifierService) {
		const schema = UserModel.createSchema();

		schema.pre('save', async function handleSave(this: IUser, next: HookNextFunction) {
			const user = this;

			if (!user.isModified('password')) {
				return next();
			}
			try {
				user.password = await hashifier.hashWithSalt(user.password);
				return next();
			} catch (error) {
				return next(error);
			}
		});

		schema.methods.comparePassword = comparePassword;

		this.model = mongoose.model<IUser>('User', schema);
	}
}
