import { Router } from 'express';
import {activities, saveActivities} from '../models/activity.js';
import auth from '../middleware/jwt.js';
import {orders, saveOrders} from "../models/order.js";
import {comments, saveComments} from "../models/comment.js";
const router = Router();

// 列表 + 搜索 + 分页
router.get('/', (req, res) => {
    try {
        const { keyword = '', page = 1, size = 10 } = req.query;
        let list = activities.filter(a => a.title.includes(keyword));
        const total = list.length;
        list = list.slice((page - 1) * size, page * size);
        res.json({ code: 200, data: { list, total } });
    } catch (e) {
        console.error('列表接口异常', e);
        res.json({ code: 200, data: { list: [], total: 0 } }); // 降级空列表
    }
});

// 详情
router.get('/:id', (req, res) => {
    const act = activities.find(a => a.id === +req.params.id);
    if (!act) return res.status(404).json({ msg: '活动不存在' });
    res.json({ code: 200, data: act });
});

// 新增
router.post('/', (req, res) => {
    try {
        const id = activities.length ? Math.max(...activities.map(a => a.id)) + 1 : 1;
        const act = { id, ...req.body, pv: 0, uv: 0 };
        activities.push(act);

        saveActivities();    // 关键：把新数组写回 activities.json
        res.json({ code: 200, data: act });
    } catch (err) {
        console.error('新增活动失败', err);
        res.status(500).json({ code: 500, msg: '服务器内部错误' });
    }
});

// 编辑
router.put('/:id', (req, res) => {
    try {
        const idx = activities.findIndex(a => a.id === +req.params.id);
        if (idx === -1) return res.status(404).json({ msg: '活动不存在' });

        Object.assign(activities[idx], req.body);
        saveActivities();                 // ← 新增：把修改写回文件
        res.json({ code: 200, data: activities[idx] });
    } catch (err) {
        console.error('编辑活动失败', err);
        res.status(500).json({ code: 500, msg: '服务器内部错误' });
    }
});

// 删除
router.delete('/:id', auth, (req, res) => {
    try {
        const id = Number(req.params.id);
        const { username, role } = req.user;

        const idx = activities.findIndex(a => a.id === id);
        if (idx === -1) return res.status(404).json({ code: 404, msg: '活动不存在' });
        if (activities[idx].createdBy !== username && role !== 'admin') {
            return res.status(403).json({ code: 403, msg: '无权删除' });
        }

        /* 1. 删除活动 */
        activities.splice(idx, 1);

        /* 2. 删除该活动的所有订单（报名） */
        const newOrders = orders.filter(o => o.activityId !== id);
        orders.splice(0, orders.length, ...newOrders);

        /* 3. 删除该活动的所有评论 */
        const newComments = comments.filter(c => c.activityId !== id);
        comments.splice(0, comments.length, ...newComments);

        /* 4. 持久化 */
        saveActivities();
        saveOrders();
        saveComments();

        res.json({ code: 200, msg: '删除成功' });
    } catch (e) {
        console.error('删除活动异常', e);
        res.status(500).json({ code: 500, msg: '服务器内部错误' });
    }
});
export default router;