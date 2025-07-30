import {Router} from 'express';
import auth from '../middleware/jwt.js';
import {orders, saveOrders} from "../models/order.js"; // 添加 saveOrders 导入
const router = Router();

/* 1. 报名  POST /activity/:id/order   */
router.post('/activity/:id/order', auth, (req, res) => {
    try {
        const { id } = req.params;
        const { username } = req.user;

        // 检查是否已报名
        const exist = orders.find(o => o.activityId === +id && o.username === username);
        if (exist) {
            return res.status(400).json({
                code: 400,
                msg: '您已报名该活动，请勿重复报名'
            });
        }

        // 生成新订单ID
        const newId = orders.length > 0
            ? Math.max(...orders.map(o => o.id)) + 1
            : 1;

        const order = {
            id: newId,
            activityId: +id,
            username,
            createdAt: new Date().toISOString() // 使用标准格式
        };

        // 添加到订单列表并持久化
        orders.push(order);
        saveOrders(); // 调用保存函数

        res.json({
            code: 200,
            msg: '报名成功',
            data: order
        });
    } catch (error) {
        console.error('报名失败:', error);
        res.status(500).json({
            code: 500,
            msg: '报名服务暂时不可用，请稍后重试',
            error: process.env.NODE_ENV === 'development'
                ? error.message
                : undefined
        });
    }
});

/* 2. 查询当前用户是否已报名  GET /activity/:id/order/status  */
router.get('/activity/:id/order/status', auth, (req, res) => {
    try {
        const { id } = req.params;
        const { username } = req.user;
        console.log('查询用户', username, '活动', id);
        const enrolled = orders.some(o =>
            o.activityId === +id && o.username === username
        );

        // 确保返回统一格式的响应
        res.json({
            code: 200,
            data: { enrolled }
        });
    } catch (error) {
        console.error('查询报名状态失败:', error);
        res.status(500).json({
            code: 500,
            msg: '查询报名状态失败',
            error: process.env.NODE_ENV === 'development'
                ? error.message
                : undefined
        });
    }
});
/* 3. 批量查询报名状态 POST /activity/enroll-status/batch */
router.post('/activity/enroll-status/batch', auth, (req, res) => {
    console.error('当前 orders:', orders, Array.isArray(orders));
    try {
        const { activityIds } = req.body;
        const { username } = req.user;

        // 创建状态映射对象
        const statusMap = {};

        activityIds.forEach(id => {
            statusMap[id] = orders.some(o =>
                o.activityId === +id && o.username === username
            );
        });

        res.json({
            code: 200,
            data: statusMap
        });
    } catch (error) {
        console.error('批量查询报名状态失败:', error);
        res.json({ code: 200, data: {} });
    }
});

// DELETE /api/activity/:id/order   取消报名
router.delete('/activity/:id/order', auth, (req, res) => {
    try {
        const { id } = req.params;
        const { username } = req.user;

        const idx = orders.findIndex(
            o => o.activityId === Number(id) && o.username === username
        );
        if (idx === -1) return res.status(404).json({ code: 404, msg: '未报名' });

        orders.splice(idx, 1);
        saveOrders();                     // 保存到 orders.json
        res.json({ code: 200 });
    } catch (e) {
        console.error('取消报名失败', e);
        res.status(500).json({ code: 500, msg: '取消失败' });
    }
});

export default router;