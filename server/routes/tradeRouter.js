import { Router } from 'express';
import tradeController from '../controllers/tradeController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.get('/get_data_landing_page', tradeController.getDataLandingPage);
router.get('/get_auto_list', authMiddleware, tradeController.getAutoList);
router.get('/get_tradeagent_list', tradeController.getTradeagentList);
router.get('/get_currency', tradeController.getCurrency)
router.get('/get_currency_exchange', tradeController.getCurrencyExchange)
router.get('/get_trade', authMiddleware, tradeController.getTrade)
router.get('/get_best_pair', tradeController.getBestPair)
router.get('/get_market_list', tradeController.getMarketList)
router.get('/get_graph', tradeController.getGraph)
router.post('/get_graph_ask_bid', tradeController.getGraphAskBid)
router.get('/get_cource_currency', tradeController.getCourceCurrency)
router.get('/get_server_time', tradeController.getServerTime)
router.post('/get_calculation', authMiddleware, tradeController.getCalculation)
router.post('/create_trade', authMiddleware, tradeController.createTrade)
router.post('/stop_auto_trade', authMiddleware, tradeController.stopAutoTrade)
router.post('/start_auto_trade', authMiddleware, tradeController.startAutoTrade)
router.post('/get_data_exchange', authMiddleware, tradeController.getDataExchange)

export default router;