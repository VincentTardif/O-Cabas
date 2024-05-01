import {Router} from 'express';
import {user_controller, 
        producer_controller, 
        category_controller, 
        product_controller, 
        order_controller} from '../controllers/index.js';
const router = Router();

// Route to manage users ---------------------------------
router.get('/users', user_controller.get_all);
router.get('/user/:id', user_controller.get_one);
router.get('/user', user_controller.get_one_by_email);
router.patch('/user/:id', user_controller.modify);
router.patch('/user_activated/:id', user_controller.validate_account);
router.patch('/user_desactivated/:id', user_controller.unvalidate_account);
router.patch('/user_admin/:id', user_controller.validate_admin);
router.patch('/user_not_admin/:id', user_controller.unvalidate_admin);
router.delete('/user/:id', user_controller.remove);

// Route to manage producers ---------------------------------
router.get('/producers', producer_controller.get_all);
router.get('/producer/:id', producer_controller.get_one);
router.post('/producer', producer_controller.create);
router.patch('/producer/:id', producer_controller.modify);
router.delete('/producer/:id', producer_controller.remove);

// Route to manage category ---------------------------------
router.get('/categories', category_controller.get_all);
router.get('/category/:id', category_controller.get_one);
router.post('/category', category_controller.create);
router.patch('/category/:id', category_controller.modify);
router.delete('/category/:id', category_controller.remove);

// Route to manage products ---------------------------------
router.get('/products', product_controller.get_all);
router.get('/product/:id', product_controller.get_one);
router.post('/product', product_controller.create);
router.patch('/product/:id', product_controller.modify);
router.delete('/product/:id', product_controller.remove);

// Route to manage orders ---------------------------------
router.get('/orders', order_controller.get_all);
router.get('/order/:id', order_controller.get_one);
router.patch('/order_pending/:id', order_controller.modify_status_true);
router.patch('/order_completed/:id', order_controller.modify_status_false);

export default router;