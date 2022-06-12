import { Router } from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/auth', authMiddleware, userController.auth);
router.post('/get_user_list', authMiddleware, userController.getUserList);
router.post('/confirm_email_user', authMiddleware, userController.confirmEmailUser);
router.post('/login', userController.login);
router.get('/get_balance_list', authMiddleware, userController.getBalanceList);
router.get('/send_confirm_email', authMiddleware, userController.sendConfirmEmail);
router.post('/register', userController.register);
router.post('/verify_data', authMiddleware, userController.verifyData);
router.post('/upload_user_file', authMiddleware, userController.uploadUserFile);
router.post('/change_password', authMiddleware, userController.changePassword);
router.get('/get_user_file', authMiddleware, userController.getUserFile);
router.get('/send_vip_request', authMiddleware, userController.sendVipRequest);
router.post('/restore_password', userController.restorePassword)
router.post('/restore_password_data', userController.restorePasswordData)
router.post('/check_pass_restore', userController.checkPassRestore)

export default router;