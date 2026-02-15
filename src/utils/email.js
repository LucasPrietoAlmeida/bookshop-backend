import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendEmail({ to, subject, text, html }) {
    try {
        const info = await transporter.sendMail({
        from: `"Bookshop" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html,
        });
        console.log('Correo enviado:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error enviando correo:', error);
        throw error;
    }
}
