import { Document, Model } from 'mongoose';

export interface IEmailDocument extends Document {
	confirmed: boolean;
	email: string;
	last_sended: string | null;
	secret: string | null;
	resend: (this: IEmail) => Promise<void>;
	confirm: (this: IEmail, candidate: string) => Promise<void>;
}

export interface IEmail extends IEmailDocument {
	resend(): Promise<void>;
	confirm(candidate: string): Promise<void>;
}

export interface IEmailModel extends Model<IEmail> {}
