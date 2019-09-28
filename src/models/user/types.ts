import { Document, Schema, Model } from 'mongoose';

export interface IUserDocument extends Document {
	email: Schema.Types.ObjectId;
	email_raw: string;
	password: string;
	name: string;
	isAdmin: boolean;
	bio: string;
}

export interface IUser extends IUserDocument {
	comparePassword(candidate: string): Promise<boolean>;
}


export interface IUserModel extends Model<IUser> {
	findByEmail(email: string,): Promise<IUser>,
}
