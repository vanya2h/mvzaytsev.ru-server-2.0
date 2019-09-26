import { Document, Schema } from 'mongoose';

export interface IUser extends Document {
	email: Schema.Types.ObjectId;
	email_raw: string;
	password: string;
	name: string;
	comparePassword: (this: IUser, candidate: string) => Promise<boolean>;
	isAdmin: boolean;
	bio: string;
}
