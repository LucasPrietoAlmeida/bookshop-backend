const nodemailer = require('nodemailer');
require('dotenv').config();


const sendEmail = async ({ to, subject, text }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: `"BookShop" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        });

        console.log('Email enviado a:', to, info.messageId);
    } catch (err) {
        console.error('Error enviando email:', err);
    }
};

module.exports = { sendEmail };
