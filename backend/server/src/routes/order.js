import { Router } from 'express';
import auth from '../middleware/jwt.js';
import {orders} from "../models/order.js";
const router = Router();

/* 1. 报名  POST /activity/:id/order   */
router.post('/activity/:id/order', auth,(req, res) => {
    const { id } = req.params;
    const { username } = req.user;

    const exist = orders.find(o => o.activityId === +id && o.username === username);
    if (exist) return res.status(400).json({ msg: '已报名' });

    const order = {
        id: orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1,
        activityId: +id,
        username,
        createdAt: new Date()
    };
    addOrder(order);       // ← 持久化
    res.json({ code: 200, data: order });
});

/* 2. 查询当前用户是否已报名  GET /activity/:id/order/status  */
router.get('/activity/:id/order/status',  auth,(req, res) => {
    const { id } = req.params;
    const { username } = req.user;

    const enrolled = orders.some(o => o.activityId === +id && o.username === username);
    res.json({ enrolled });
});

export default router;