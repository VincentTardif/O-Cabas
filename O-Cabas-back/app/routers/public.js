import {Router} from 'express';
import {user_controller,
        producer_controller, 
        product_controller, 
        category_controller,
        } from '../controllers/index.js';
import validate_service from '../services/validation/validate.js';
import reset_password from '../services/send_reset_password_email.js';
const router = Router();

router.get('/producers', producer_controller.get_all);
router.get('/products', product_controller.get_all);
router.post('/contact', validate_service.contact_form, user_controller.post_contact);
router.post('/register', validate_service.create_user, user_controller.create_user);
router.post('/login', validate_service.login_user, user_controller.login_user);
router.post('/logout', user_controller.logout_user);
router.post('/reset_password', reset_password.send_reset_password);
router.get('/categories', category_controller.get_all);
router.get('/category/:id', category_controller.get_one);
router.get('/category', category_controller.get_by_name);


export default router;