const nodemailer = require('nodemailer');

class EmailManager {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: "andresnovmusica@gmail.com",
                pass: "bgzp zcwu kamn ipcc"
            }
        });
    }

    async sendEmailPurchase(email, first_name, ticket) {
        try {
            const emailOptions = {
                from: "E-commerce <ecommerce@coder.com>",
                to: email,
                subject: 'Purchase Confirmation',
                html: `
                    <h1>Purchase Confirmation</h1>
                    <p>Thanks for your Purchase! ${first_name}!</p>
                    <p>Your order number is: ${ticket}</p>
                `
            };

            await this.transporter.sendMail(emailOptions);
        } catch (error) {
            console.error('Error sending email', error);
        }
    }

    async sendEmailReset(email, first_name, token) {
        try {
            const emailOptions = {
                from: 'ecommerce@coder.com',
                to: email,
                subject: 'Reset Password',
                html: `
                    <h1>Reset Password</h1>
                    <p>Hello ${first_name},</p>
                    <p>You have requested to reset your password. Use the following code to change your password:</p>
                    <p><strong>${token}</strong></p>
                    <p>This code will expire in 1 hour.</p>
                    <a href="http://localhost:8080/password">Reset Password</a>
                    <p>If you did not request this reset, please ignore this email.</p>
                `
            };

            await this.transporter.sendEmail(emailOptions);
        } catch (error) {
            console.error("Error sending email", error);
            throw new Error("Error sending email");
        }
    }
}

module.exports = EmailManager;