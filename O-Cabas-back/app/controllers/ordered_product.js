import debug from 'debug';
import ordered_product from '../models/ordered_product.js';
const logger = debug('api:ordered_product_controller');

const ordered_product_controller= {
    async get_all(_, res){
        const result = await ordered_product.find_all();
        res.json(result);
    },

    async get_one(req, res){
        const result = await ordered_product.find_by_pk(req.params.id);
        if(!result){
            return res.status(404).json({status:'error', message:'Produit commandé non trouvé'})
        }
        res.json(result);
    },

    async create(req, res){
        logger(req.user)
        const result = await ordered_product.insert(req.body);
        res.json(result);
    },

    async modify(req, res){
        try {
            const result = await ordered_product.update(req.params.id, req.body);
            res.json(result);
        } catch (error) {
            logger('Error updating ordered_product:', error);
            res.status(500).json({ error: 'Could not update ordered_product' });
        }
    },

    async remove(req, res){
        const result = await ordered_product.delete(req.params.id);
        res.json(result);
    },
}

export default ordered_product_controller;