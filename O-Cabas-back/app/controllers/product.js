import debug from 'debug';
import product from '../models/product.js';
const logger = debug('api:product_controller');

const product_controller = {
    async get_all(_, res){
        const result = await product.find_all();
        res.json(result);
    },

    async get_one(req, res){
        const result = await product.find_by_pk(req.params.id);
        if(!result){
            return res.status(404).json({status:'error', message:'produits inconnu'})
        }
        res.json(result);
    },
    
    async get_one_by_name(req, res){
        const {name} = req.body
        const result = await product.find_by_name(name);
        if(!result){
            return res.status(404).json({status:'error', message:'Produit inconnu'})
        }
        res.json(result);
    },

    async create(req, res){
        logger(req.body)
        const result = await product.insert(req.body);
        res.json(result);
    },

    async modify(req, res){
        try {
            const result = await product.update(req.params.id, req.body);
            res.json(result);
        } catch (error) {
            logger('Error updating product:', error);
            res.status(500).json({ error: 'Could not update product' });
        }
    },

    async remove(req, res){
        const result = await product.delete(req.params.id);
        res.json(result);
    },
}

export default product_controller;