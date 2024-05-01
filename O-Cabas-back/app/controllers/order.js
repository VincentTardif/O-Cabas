import debug from 'debug';
import order from '../models/order.js';
const logger = debug('api:order_controller');

const order_controller = {
    async get_all(_, res){
        const result = await order.find_all();
        res.json(result);
    },

    async get_one(req, res){
        const result = await order.find_by_pk(req.params.id);
        if(!result){
            return res.status(404).json({status:'error', message:'commande inconnue'})
        }
        res.json(result);
    },
    
    async get_my_orders(req, res){
        const result = await order.get_all_my_orders(req.user);
        res.json(result);
    },

    async get_my_order_detail(req, res){
        const result = await order.get_detail_order(req.user, req.params.id);
        res.json(result);
    },

    async create_order(req, res){
        logger(req.body)
        const result = await order.insert_into_order(req.body.order, req.body.products);
        res.json(result);
    },
  
    async modify_status_true(req, res){
        try {
            const result = await order.pending_order(req.params.id);
            res.json(result);
        } catch (error) {
            logger('Error updating order:', error);
            res.status(500).json({ error: 'Could not update status order' });
        }
    },
    
    async modify_status_false(req, res){
        try {
            const result = await order.order_completed(req.params.id);
            res.json(result);
        } catch (error) {
            logger('Error updating order:', error);
            res.status(500).json({ error: 'Could not update status order' });
        }
    },
    
    async remove(req, res){
        const result = await order.delete(req.params.id);
        res.json(result);
    },
}

export default order_controller;