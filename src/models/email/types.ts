import { Document } from 'mongoose';

export interface IEmail extends Document {
	confirmed: boolean;
	email: string;
	last_sended: string | null;
	secret: string | null;
	resend: (this: IEmail) => Promise<void>;
	confirm: (this: IEmail, candidate: string) => Promise<void>;
}
