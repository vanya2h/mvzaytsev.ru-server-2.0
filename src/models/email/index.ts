import mongoose, { Schema } from 'mongoose';
import moment from 'moment';
import { provides } from '~/utils/provides';
import { IEmail, IEmailModel } from './types';
import { makeSecret } from '~/utils/make-secret';
import { EMAIL_MODEL } from '~/consts';
import { MailService } from '~/services/mail';
import { verificationEmail } from '~/emails/verification';
import { PasswordVerifier } from '~/services/password-verifier';

@provides(EmailModel)
export class EmailModel {
	public static createSchema = (): Schema<IEmail> => new Schema({
		email: { type: String, unique: true, isRequired: true },
		last_sended: { type: Date, default: null },
		confirmed: { type: Boolean, default: false },
		secret: { type: String, default: null },
	},
	{
		timestamps: true,
	});

	public model: IEmailModel;

	public constructor(
		mailService: MailService,
		private readonly passwordVerifier: PasswordVerifier,
	) {
		const schema = EmailModel.createSchema();

		schema.method('resend', async function resend(this: IEmail): Promise<void> {
			if (this.confirmed) throw new Error('E-mail уже успешно был подтвержден');

			if (this.last_sended && moment().diff(moment(this.last_sended), 'seconds') < 60) {
				throw new Error('Вы не можете отправлять E-mail чаще, чем 1 раз в 60 секунд');
			}

			const secret = makeSecret(6);

			this.secret = await passwordVerifier.hashWithSalt(secret);
			await this.save();

			await mailService.send(
				this.email,
				'Подтвердите ваш почтовый адрес',
				verificationEmail(secret),
			);

			this.last_sended = new Date().toISOString();
			await this.save();
		});

		schema.method('confirm', async function confirm(
			this: IEmail,
			candidate: string,
		): Promise<void> {
			if (!this.secret) throw new Error('Ваш E-mail уже был успешно подтверждён');
			const isMatched = await passwordVerifier.verifyAgainst(candidate, this.secret);

			if (!isMatched) {
				throw new Error('Код введен неверное, попробуйте ещё раз или отправьте письмо снова');
			}
			this.secret = null;
			this.confirmed = true;

			await this.save();
		});

		this.model = mongoose.model<IEmail, IEmailModel>(EMAIL_MODEL, schema);
	}
}
