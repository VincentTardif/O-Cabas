import debug from 'debug';
import producer from '../models/producer.js';
const logger = debug('api:producer_controller');

const producer_controller = {
    async get_all(_, res){
        const result = await producer.find_all();
        res.json(result);
    },

    async get_one(req, res){
        const result = await producer.find_by_pk(req.params.id);
        if(!result){
            return res.status(404).json({status:'error', message:'Producteur inconnu'})
        }
        res.json(result);
    },

    async create(req, res){
        const result = await producer.insert(req.body);
        res.json(result);
    },

    async modify(req, res){
        try {
            const result = await producer.update(req.params.id, req.body);
            res.json(result);
        } catch (error) {
            logger('Error updating producer:', error);
            res.status(500).json({ error: 'Could not update producer' });
        }
    },

    async remove(req, res){
        const result = await producer.delete(req.params.id);
        res.json(result);
    },
}

export default producer_controller;