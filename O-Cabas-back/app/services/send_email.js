import 'dotenv/config';
import debug from 'debug';
import nodemailer from 'nodemailer';

const logger = debug('api:send_email');

// Fonction pour envoyer un e-mail
export async function send_email(to, subject, text) {
    try {
        // Créez un transporteur SMTP réutilisable
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_SMTP,
            port: process.env.MAIL_SMTP_PORT,
            secure: true, // true pour le port 465, false pour les autres ports
            auth: {
                user: process.env.MAIL_LOGIN,
                pass: process.env.MAIL_PASS
            }
        });

        // Définir les options de l'e-mail
        let mail_options = {
            from: process.env.MAIL_LOGIN,
            to: to,
            subject: subject,
            text: text
        };

        // Envoyer l'e-mail
        let info = await transporter.sendMail(mail_options);
        logger('Envoi du mail effectué à cette adresse: %s', info.messageId);
    } catch (error) {
        console.error('Une erreur est survenue lors de l\'envoi du mail:', error);
    }
}
