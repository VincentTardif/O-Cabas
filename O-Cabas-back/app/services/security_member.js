import 'dotenv/config';
import debug from "debug";
import jwt from 'jsonwebtoken';

import user from '../models/user.js';

const logger = debug("api:security_services");
export default {
    // async is_authenticated_as_member(req, res, next) {
    //     // Récupérer le jeton d'authentification depuis les en-têtes de la requête
    //     const check_token = req.headers.authorization;
    //     // Vérifier si un jeton d'authentification est présent dans les en-têtes
    //     if(!check_token){
    //         // Si aucun jeton n'est présent, renvoyer une erreur 401 (Non autorisé)
    //         return res.status(401).json({status: 'error', message:'Vous n\'êtes pas membre de l\'association!'})
    //     }

    //     // Extraire le jeton de l'en-tête "Authorization"
    //     const token = req.headers.authorization.split(' ')[1];
    //     // Enregistrement du jeton dans les logs
    //     logger("authorization", req.headers.authorization);
        
    //     // Vérification des informations du jeton
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //     // Enregistrement des informations décodées du jeton dans les logs
    //     logger("decoded", decoded);
        
    //     // Si le jeton est valide
    //     if (decoded){
    //         // Récupérer le statut de l'utilisateur correspondant à cet email
    //         const result = await user.find_user_status_by_email(decoded);
    //         // Enregistrement du résultat dans les logs
    //         logger(result);
    //         if (result === undefined){
    //             return res.send('Un problème est survenue lors de votre connexion, veuillez vous reconnecter.')
    //         }
    //         // Enregistrement du statut de l'utilisateur dans les logs
    //         logger(result.status);
    //         // Si le statut est vrai (utilisateur autorisé)
    //         if(result.status === true){
    //             // Ajouter les informations de l'utilisateur décodées à la requête
    //             req.user = decoded;
    //             // Poursuivre le traitement de la requête
    //             next();
    //         } else {
    //             // Si le statut est faux (utilisateur non autorisé), renvoyer une erreur 401 (Non autorisé)
    //             res.status(401).json({status: 'error', message: 'Vous n\'êtes pas autorisé à accéder à cette ressource.'});
    //         }
    //     }
    // }

    async is_authenticated_as_member(req, res, next) {
        // Récupérer le jeton d'authentification depuis les en-têtes de la requête
        const check_token = req.headers.authorization;
        // Vérifier si un jeton d'authentification est présent dans les en-têtes
        if(!check_token){
            // Si aucun jeton n'est présent, renvoyer une erreur 401 (Non autorisé)
            return res.status(401).json({status: 'error', message:'Vous n\'êtes pas membre de l\'association!'})
        }

        // Extraire le jeton de l'en-tête "Authorization"
        const token = req.headers.authorization.split(' ')[1];
        // Enregistrement du jeton dans les logs
        logger("authorization", req.headers.authorization);
        
        // Vérification des informations du jeton
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Enregistrement des informations décodées du jeton dans les logs
        logger("decoded", decoded.email);
        
        // Si le jeton est valide
        if (decoded){
            // Récupérer le statut de l'utilisateur correspondant à cet email
            const result = await user.find_user_status_by_email(decoded.email);
            // Enregistrement du résultat dans les logs
            logger(result);
            if (result === undefined){
                return res.send('Un problème est survenue lors de votre connexion, veuillez vous reconnecter.')
            }
            // Enregistrement du statut de l'utilisateur dans les logs
            logger(result.status);
            // Si le statut est vrai (utilisateur autorisé)
            if(result.status === true){
                // Ajouter les informations de l'utilisateur décodées à la requête
                req.user = decoded.email;
                // Poursuivre le traitement de la requête
                next();
            } else {
                // Si le statut est faux (utilisateur non autorisé), renvoyer une erreur 401 (Non autorisé)
                res.status(401).json({status: 'error', message: 'Vous n\'êtes pas autorisé à accéder à cette ressource.'});
            }
        }
    }

    
}

