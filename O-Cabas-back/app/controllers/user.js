import 'dotenv/config';
import debug from 'debug';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import user from '../models/user.js';
import {send_email} from '../services/send_email.js';

const logger = debug('api:user_controller');

const user_controller = {
    async get_all(_, res){
        const result = await user.find_all();
        res.json(result);
    },

    async get_one(req, res){
        const result = await user.find_by_pk(req.params.id);
        if(!result){
            return res.status(404).json({status:'error', message:'utilisateur inconnu'})
        }
        res.json(result);
    },

    async get_one_by_email(req, res){
        const {email} =  req.body;
        const result = await user.find_by_email(email);
        res.json(result);
    },

    async modify(req, res){
        try {
            const result = await user.update(req.params.id, req.body);
            res.json(result);
        } catch (error) {
            logger('Error updating user:', error);
            res.status(500).json({ error: 'Could not update user' });
        }
    },

    async validate_account(req, res){
        try {
            const result = await user.account_actived(req.params.id, req.body);
            res.json(result);
        } catch (error) {
            logger('Error updating user:', error);
            res.status(500).json({ error: 'Could not update user' });
        }
    },

    async unvalidate_account(req, res){
        try {
            const result = await user.account_desactived(req.params.id, req.body);
            res.json(result);
        } catch (error) {
            logger('Error updating user:', error);
            res.status(500).json({ error: 'Could not update user' });
        }
    },

    async validate_admin(req, res){
        try {
            const result = await user.account_is_admin(req.params.id, req.body);
            res.json(result);
        } catch (error) {
            logger('Error updating user:', error);
            res.status(500).json({ error: 'Could not update user' });
        }
    },

    async unvalidate_admin(req, res){
        try {
            const result = await user.account_is_not_admin(req.params.id, req.body);
            res.json(result);
        } catch (error) {
            logger('Error updating user:', error);
            res.status(500).json({ error: 'Could not update user' });
        }
    },

    async remove(req, res){
        const result = await user.delete(req.params.id);
        res.json(result);
    },

    async create_user(req, res){
        const user_id = req.body;
        // Password hashing
        const hash = await bcrypt.hash(user_id.password, parseInt(process.env.PASSWORD_SALT));
        logger(hash);
        user_id.password = hash;

        // check if user email already exist
        const {email} = req.body;
        logger(email);
        const find_user_mail = await user.find_by_email(email);
        if (find_user_mail){
            return res.status(400).json({status: 'error', message: `L\'utilisateur existe déjà! Veuillez entrer une nouvelle adresse mail.`});
        }
        
        // calls user model to insert data
        const result = await user.insert(user_id);
        if (!result){
            logger('il manque des informations')
            return res.status(418).json({ status: 'error', message: 'informations manquantes' });
        }
        // res.status(200).json({ status: 'success', data: result });

        // Send an email to the administrator for validation
    const admin_email = process.env.MAIL_LOGIN;
    const subject = 'Validation du compte utilisateur';
    const message = `Un nouveau compte utilisateur a été créé avec l'adresse e-mail : ${email}. Veuillez valider son statut.`;
    await send_email(admin_email, subject, message);

    res.status(200).json({ status: 'success', data: result });
        
    },
    
    // async login_user(req, res) {
    //     const {email} = req.body;
    //     const result = await user.find_by_email(email);
    //     logger(result);

    //     if (!result) {
    //         logger('Aucun utilisateur trouvé avec le pseudo spécifié');
    //         return res.status(401).json({ status: 'error', message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
    //     }
    //     // Comparing the provided password with the password returned by the database
    //     const is_equal = await bcrypt.compare(req.body.password, result.password);
    //     logger(is_equal);
    
    //     if (is_equal) {
    //         // delete is used to remove the property from the object (no sensitive data should be in the token)
    //         delete result.password;
    
    //         // Generating the JWT token
    //         const token = jwt.sign(result.email, process.env.JWT_SECRET);
    //         logger(result) 
    //         res.json({ status: 'success', data: result, token });
            
    //     } else {
    //         logger('mot de passe incorrect ou non spécifié');
    //         return res.status(401).json({ status: 'error', message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
    //     }
    // },

    async login_user(req, res) {
        const {email} = req.body;
        const result = await user.find_by_email(email);
        logger(result);

        if (!result) {
            logger('Aucun utilisateur trouvé avec le pseudo spécifié');
            return res.status(401).json({ status: 'error', message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
        }
        // Comparing the provided password with the password returned by the database
        const is_equal = await bcrypt.compare(req.body.password, result.password);
        logger(is_equal);
    
        if (is_equal) {
            // delete is used to remove the property from the object (no sensitive data should be in the token)
            delete result.password;

            // Generating the JWT token
            const token = jwt.sign({email:result.email}, process.env.JWT_SECRET, {expiresIn:7200});
            logger(result) 
            res.json({ status: 'success', data: result, token });
            
        } else {
            logger('mot de passe incorrect ou non spécifié');
            return res.status(401).json({ status: 'error', message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
        }
    },

    

    async logout_user(req, res, next) {
        // Retrieve the JWT token from the request headers
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            // If no token is provided, return a response with an error
            return res.status(401).json({ status: 'error', message: 'Aucun token fourni' });
        }
        try {
            // Verify and decode the JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            logger(decoded)
            // If everything is fine, send a response indicating that the user is successfully logged out
            res.json({ status: 'success', message: 'Utilisateur déconnecté avec succès' });
        } catch (error) {
            // If an error occurs during token verification, return a response with an error
            return res.status(401).json({ status: 'error', message: 'Token invalid ou expiré' });
        }
        // Call the next middleware in the chain
        next();
    },

    async post_contact(req, res){
        
        const {firstname, lastname, email, message } = req.body;

        const admin_email = process.env.MAIL_LOGIN;
        const subject = 'Formulaire de contact';
        const text = `Nom: ${lastname} Prénom: ${firstname}\nEmail: ${email}\nMessage: ${message}`;
            await send_email(admin_email, subject, text);
            
            return res.status(200).json({ status: 'success', message: 'Votre message a bien été envoyé!'});
        
    },
    
    async get_to_account(req, res){
        const result = await user.account(req.user);
        res.json(result);
    },

    async modify_my_account(req, res){
        if (req.body.is_admin || req.body.status){
            return res.send(`Impossible d'effectuer la modification`);
        }
        const result = await user.update_account(req.user, req.body);
        res.json(result);
    },

    async remove_my_account(req, res){
        const result = await user.delete_account(req.user);
        res.json(result);
    },
}

export default user_controller;