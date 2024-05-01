import 'dotenv/config';
import jwt from 'jsonwebtoken';
import user from '../models/user.js';
import {send_email} from './send_email.js';
import debug from 'debug';
const logger = debug('api:reset_password');

export default {
    async send_reset_password(req, res) {
        const {email} = req.body;
        try {
            // Vérifier si l'utilisateur existe dans la base de données
            const result = await user.find_by_email(email);
            if (!result.email) {
                return res.status(404).json({ status: 'error', message: 'Aucun utilisateur trouvé avec cet e-mail.' });
            }
            // Générer un token de réinitialisation du mot de passe avec une durée de validité
            const reset_token = jwt.sign({ email: result.email }, process.env.JWT_SECRET, { expiresIn: 3600 });
            // Envoyer un e-mail de réinitialisation du mot de passe contenant le lien avec le token de réinitialisation
            const reset_password_url = `http://localhost:5173/#/reset_password?token=${reset_token}`;
            const subject = 'Réinitialisation du mot de passe.';
            const message = `Cliquer sur le lien pour réinitialiser votre mot de passe : ${reset_password_url}"`;
            await send_email(result.email, subject, message);
            return res.status(200).json({ status: 'success', message: 'Un e-mail de réinitialisation du mot de passe a été envoyé.' });
        } catch (error) {
            console.error('Erreur lors de la réinitialisation du mot de passe :', error);
            return res.status(500).json({ status: 'error', message: 'Une erreur est survenue lors de la réinitialisation du mot de passe.' });
        }
    }
}