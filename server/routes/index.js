import { Router } from 'express';
import userRouter from './userRouter.js';
import tradeRouter from './tradeRouter.js';
import siteRouter from './siteRouter.js';

const router = Router();

router.use('/user',userRouter);
router.use('/trade',tradeRouter);
router.use('/site',siteRouter);

export default router;