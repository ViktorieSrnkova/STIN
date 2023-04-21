import { ENV_EMAIL_PASSWORD, ENV_ENV } from 'const/env';
import nodemailer from 'nodemailer';

const NAME_EMAIL = 'Datinn';
const BASE_EMAIL = 'noreply@datinn.io';

const transporter = nodemailer.createTransport({
	host: 'smtp.seznam.cz',
	port: 465,
	secure: true, // true for 465, false for other ports
	auth: {
		user: BASE_EMAIL, // generated ethereal user
		pass: ENV_EMAIL_PASSWORD, // generated ethereal password
	},
});

export class EmailService {
	static async send(
		email: string,
		subject: string,
		html: string,
		attachments?: {
			filename: string;
			contentType: 'application/pdf';
			path: string;
		}[],
	): Promise<void> {
		let s = subject;

		if (ENV_ENV !== 'PROD') {
			s = `${ENV_ENV}: ${s}`;
		}

		await transporter.sendMail({
			from: `"${NAME_EMAIL}" <${BASE_EMAIL}>`,
			to: email,
			subject: s,
			html,
			attachments,
		});
	}
}
