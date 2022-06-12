import { Router } from 'express';
import siteController from '../controllers/siteController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.get('/get_translation', siteController.getTranslation);
router.get('/get_news', siteController.getNews);
router.post('/get_history_payment', authMiddleware, siteController.getHistoryPayment)
router.get('/get_operation', authMiddleware, siteController.getOperation)
router.post('/refill', authMiddleware, siteController.refill)
router.post('/set_withdrawal', authMiddleware, siteController.setWithdrawal)
router.get('/get_news_item', siteController.getNewsItem)
router.get('/get_page', siteController.getPage)
router.get('/get_paykassa_balance', siteController.getPaykassaBalance)
router.get('/get_course_binance', siteController.getCourseBinance)
router.get('/get_tickets', authMiddleware, siteController.getTickets)
router.get('/get_ticket', authMiddleware, siteController.getTicket)
router.get('/close_ticket', authMiddleware, siteController.closeTicket)
router.get('/get_comments', authMiddleware, siteController.getCommnets)
router.post('/set_ticket', authMiddleware, siteController.setTicket)
router.post('/set_comment_ticket', authMiddleware, siteController.setCommentTicket)

export default router;