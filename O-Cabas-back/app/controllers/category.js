import debug from 'debug';
import category from '../models/category.js';

const logger = debug('api:category_controller');

const category_controller = {
    async get_all(_, res){
        const result = await category.find_all();
        res.json(result);
    },

    async get_one(req, res){
        const result = await category.find_by_pk(req.params.id);
        if(!result){
            return res.status(404).json({status:'error', message:'categorie inconnu'})
        }
        res.json(result);
    },

    async get_by_name(req, res){
        const result = await category.find_by_name(req.body);
        if(!result){
            return res.status(404).json({status:'error', message:'categorie inconnu'})
        }
        res.json(result);
    },
    
    async create(req, res){
        const result = await category.insert(req.body);
        res.json(result);
    },

    async modify(req, res){
        try {
            const result = await category.update(req.params.id, req.body);
            res.json(result);
        } catch (error) {
            logger('Error updating category:', error);
            res.status(500).json({ error: 'Could not update category' });
        }
    },

    async remove(req, res){
        const result = await category.delete(req.params.id);
        res.json(result);
    },
}

export default category_controller;