import mongoose, { Schema, Model, HookNextFunction } from 'mongoose';
import { provides } from '~/utils/provides';
import { PasswordVerifier } from '~/services/password-verifier';
import { IUser } from './types';
import { USER_MODEL } from '~/consts';

@provides(UserModel)
export class UserModel {
	public static createSchema = (): Schema<IUser> => new Schema({
		email: { type: Schema.Types.ObjectId, unique: true, isRequired: true },
		name: { type: String, isRequired: true },
		isAdmin: { type: Boolean, default: false },
		password: { type: String, isRequired: true },
		bio: { type: String, isRequired: false },
	},
	{
		timestamps: {
			createdAt: 'createdAt',
			updatedAt: 'updatedAt',
		},
		strict: false,
	});

	public model: Model<IUser>;

	public constructor(passwordVerifier: PasswordVerifier) {
		const schema = UserModel.createSchema();

		schema.pre('save', async function handleSave(this: IUser, next: HookNextFunction) {
			if (!this.isModified('password')) return next();

			try {
				this.password = await passwordVerifier.hashWithSalt(this.password);
				return next();
			} catch (error) {
				return next(error);
			}
		});

		schema.methods.comparePassword = async function comparePassword(
			this: IUser,
			candidate: string,
		): Promise<boolean> {
			return passwordVerifier.verifyAgainst(candidate, this.password);
		};

		this.model = mongoose.model<IUser>(USER_MODEL, schema);
	}
}
