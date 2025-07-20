import { Router } from 'express';
import { orders } from '../models/order.js';
import auth from '../middleware/jwt.js';
const router = Router();

// 报名
router.post('/:activityId', auth, (req, res) => {
    const { activityId } = req.params;
    const { username } = req.user;

    const exist = orders.find(o => o.activityId === +activityId && o.username === username);
    if (exist) return res.status(400).json({ msg: '已报名' });

    const order = {
        id: orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1,
        activityId: +activityId,
        username,
        createdAt: new Date()
    };
    orders.push(order);
    res.json({ code: 200, data: order });
});

// 某活动报名列表
router.get('/activity/:activityId', (req, res) => {
    const { activityId } = req.params;
    const list = orders.filter(o => o.activityId === +activityId);
    res.json({ code: 200, data: list });
});

export default router;