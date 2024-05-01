import {Router} from 'express';
import {user_controller, order_controller} from '../controllers/index.js';
import validate_service from '../services/validation/validate.js';
const router = Router();

router.post('/order', validate_service.validate_order_data, order_controller.create_order);
router.get('/my_orders', order_controller.get_my_orders);
router.get('/my_order_detail/:id', order_controller.get_my_order_detail);
router.get('/account', user_controller.get_to_account);
router.patch('/account', user_controller.modify_my_account);
router.delete('/account', user_controller.remove_my_account);

export default router ;