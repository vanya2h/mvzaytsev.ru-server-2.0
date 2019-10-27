import { Model, Schema, model, HookNextFunction } from 'mongoose';
import { provides } from '~/utils/provides';
import { PasswordVerifier } from '~/services/password-verifier';
import { IUser, IUserModel } from './types';
import { USER_MODEL } from '~/consts';

@provides(UserModel)
export class UserModel {
	public static createSchema = (): Schema<IUser> => new Schema({
		name: {
			type: String,
			isRequired: true,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		email: {
			type: Schema.Types.ObjectId,
			unique: true,
			isRequired: true,
		},
		password: {
			type: String,
			isRequired: true,
		},
		bio: {
			type: String,
			isRequired: false,
		},
	},
	{
		timestamps: true,
		strict: false,
	});

	public model: IUserModel;

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

		schema.method('comparePassword', async function comparePassword(
			this: IUser,
			candidate: string,
		): Promise<boolean> {
			return passwordVerifier.verifyAgainst(candidate, this.password);
		});

		schema.static('findByEmail', async function findByEmail(
			this: Model<IUser>,
			email: string,
		) {
			const [user] = await this.aggregate([
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
						email_raw: email,
					},
				},
			]);

			return user as IUser;
		});

		this.model = model<IUser, IUserModel>(USER_MODEL, schema);
	}
}
