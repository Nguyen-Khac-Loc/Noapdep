const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

//new Email(user, url).sendWelcome()
module.exports = class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstName = user.name.split(" ")[0];
		this.url = url;
		this.from = `Admin <${process.env.EMAIL_FROM}>`;
	}
	newTransport() {
		if (process.env.NODE_ENV === "production") {
			//brevo
			return nodemailer.createTransport({
				service: "Gmail",
				auth: {
					user: process.env.GMAIL_USERNAME,
					pass: process.env.APP_PASSWORD,
				},
			});
		}
		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
	}

	async send(template, subject) {
		//render html = pug template
		const html = pug.renderFile(
			`${__dirname}/../views/emails/${template}.pug`,
			{
				firstName: this.firstName,
				url: this.url,
				subject,
				email: this.to,
				from: this.from.split(/<|>/)[1],
			}
		);
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText.htmlToText(html),
		};
		//tao transport va gui mail
		await this.newTransport().sendMail(mailOptions);
	}
	async sendWelcome() {
		await this.send("welcome", "Chào mừng bạn đến với Noapdep!");
	}

	async sendResetPassword() {
		await this.send(
			"resetpassword",
			"THƯ TẠO MỚI MẬT KHẨU (có hiệu lực trong 10 phút)"
		);
	}
	async sendDeletedAccount() {
		await this.send(
			"deleteaccount",
			"TÀI KHOẢN ĐÃ ĐƯỢC XOÁ"
		);
	}
};
