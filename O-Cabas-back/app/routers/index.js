import {Router} from 'express';
import public_router from './public.js';
import private_router from './private.js';
import admin_router from './admin.js';
import security_service_admin from '../services/security_admin.js';
import security_service_member from '../services/security_member.js';
const router = Router();

router.use(public_router);
router.use(security_service_member.is_authenticated_as_member, private_router);
router.use(security_service_admin.is_authenticated_as_admin, admin_router);

export default router;