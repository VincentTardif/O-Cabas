import APIError from '../error/APIError.js';
import client from '../db_client.js';
import {schema_contact, 
        schema_create_user, 
        schema_login_user,
        order_schema} from './schema.js';
import debug from 'debug';

const logger = debug('api:validate_services');

function validate_order_params(req, res, next) {
    const {error} = order_schema.validate(req.body);
    logger(error)
        if (error) {
        next(new APIError(error, 400));
    } else {
        logger('validation du format données ok!');
        } 
    next();
}

export default {
    
    /**
     * Method to validate the data transmitted to add a user to the database
     */
    
    create_user(req, res, next) {
        // if there is an error Joi will return the error in an "error" key
        const {error} = schema_create_user.validate(req.body);
        if (error) {
            // There is a validation error, I switch to the error handling middleware
            next(new APIError(error, 400));
        } else {
            // There is no error, I move on to the next middleware
            next();
        }
    },
    
    login_user(req, res, next) {
        const {error} = schema_login_user.validate(req.body);
    
        if (error) {
            next(new APIError(error, 400));
        } else {
            next();
        }
    },

    contact_form(req, res, next) {
        const {error} = schema_contact.validate(req.body);
    
        if (error) {
            next(new APIError(error, 400));
        } else {
            next();
        }
    },

    async validate_order_data(req, res, next){
        logger('controle de la commande:', req.body);
        validate_order_params(req, res, next);
        // on récupère l'ensemble des produits du panier, avec la quantité et le prix de chaque produit
        const products = req.body.products;
        // on boucle sur chaque produit
        for (const product of products){
            logger(product.id)
            logger(product.quantity)
            logger('totototo', product.price)
            const priceProduct = {
                text:`SELECT price FROM products WHERE id = $1;`,
                values: [product.id]
            };
            // trouver le prix correspondant à l'id du produit récupérer
            const result = await client.query(priceProduct)
            logger('-------', result.rows[0].price)
            if (!result){
                throw new Error (`Le produit avec l'ID ${product.id} n'existe pas.`);
            };
            // vérifier si le prix en BDD correspond au prix de la requête
            if (result.rows[0].price !== product.price){
                throw new Error (`Le prix du produit avec l'ID ${product.id} ne correspond pas au prix du produit de la requête.`)
            } else {
                next()
            };
        }
        logger('Validation terminée!')
    }

    
};
