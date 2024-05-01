import 'dotenv/config';
import debug from "debug";
import jwt from 'jsonwebtoken';
import user from '../models/user.js';

const logger = debug("api:security_services");
export default {
    //  async is_authenticated_as_admin(req, res, next) {
    //     const check_token = req.headers.authorization;
    //     if(!check_token){
    //         return res.status(401).json({status: 'error', message:'Vous n\'êtes pas autorisé à accéder à cette ressource.'})
    //     }

    //     const token = req.headers.authorization.split(' ')[1];
    //     logger("authorization", req.headers.authorization);
    //     // Verifying token information
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //     logger("decoded", decoded);
    //     // If the token is valide
    //     if (decoded){
    //         // retrieve the user role who match to this email
    //         const result = await user.find_user_role_by_email(decoded);
    //         logger(result)
    //         logger(result.is_admin)
    //         if(result.is_admin === true){
    //             req.user = decoded;
    //             logger(req.user)
    //             next();
    //         } else {
    //                 return res.status(401).json({status: 'error', message: 'Vous n\'êtes pas autorisé à accéder à cette ressource.'});
    //         }
    //     }
    // }

       async is_authenticated_as_admin(req, res, next) {
        const check_token = req.headers.authorization;
        if(!check_token){
            return res.status(401).json({status: 'error', message:'Vous n\'êtes pas autorisé à accéder à cette ressource.'})
        }

        const token = req.headers.authorization.split(' ')[1];
        logger("authorization", req.headers.authorization);
        // Verifying token information
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        logger("decoded", decoded);
        // If the token is valide
        if (decoded){
            // retrieve the user role who match to this email
            const result = await user.find_user_role_by_email(decoded.email);
            logger(result.is_admin)
            if(result.is_admin === true){
                req.user = decoded.email;
                logger(req.user)
                next();
            } else if(result.is_admin === false) {
                logger('stop')
            } else {
                return res.status(401).json({status: 'error', message: 'Vous n\'êtes pas autorisé à accéder à cette ressource.'});

            }
        }
    }
}

    

