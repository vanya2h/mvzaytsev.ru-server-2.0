import sg from '@sendgrid/mail';
import { inject } from 'inversify';
import { provides } from '~/utils/provides';
import { CONFIG } from '~/consts';
import { IConfig } from '~/interfaces/config';
import { stripHtml } from '~/utils/strip-html';

@provides(MailService)
export class MailService {
	private client: typeof sg;

	public constructor(@inject(CONFIG) private readonly config: IConfig) {
		sg.setApiKey(process.env.SENDGRID_API_KEY);
		this.client = sg;
	}

	public send = async (to: string, subject: string, html: string): Promise<void> => {
		try {
			await this.client.send({
				to,
				html,
				from: {
					name: this.config.emailActorName,
					email: this.config.emailActor,
				},
				text: stripHtml(html),
				subject,
			});
		} catch (error) {
			throw new Error('Не удалось отправить E-mail, обратитесь в тех. поддержку');
		}
	};
}
