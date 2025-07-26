import { Router } from 'express';
import {comments, saveComments} from '../models/comment.js';
import auth from '../middleware/jwt.js';
import {activities} from "../models/activity.js";
const router = Router();

// 某活动评论列表
router.get('/:activityId', (req, res) => {
    const activityId = Number(req.params.activityId);

    // 1. 简单校验：先确认活动是否存在
    const exists = activities.some(a => a.id === activityId);
    if (!exists) {
        return res.status(404).json({ code: 404, msg: '活动不存在' });
    }

    // 2. 返回该活动下的评论
    const list = comments.filter(c => c.activityId === activityId);
    res.json({ code: 200, data: list });
});
// 发表评论
router.post('/', auth, (req, res) => {
    const { activityId, content } = req.body;
    const { username } = req.user;

    const c = {
        id: comments.length ? Math.max(...comments.map(x => x.id)) + 1 : 1,
        activityId: +activityId,
        username,
        content,
        createdAt: new Date()
    };
    comments.push(c);
    saveComments();
    res.json({ code: 200, data: c });
});
// DELETE /api/comments/:id   删除单条评论
router.delete('/:id', auth, (req, res) => {
    try {
        const { id } = req.params;
        const { username, role } = req.user;

        const idx = comments.findIndex(c => c.id === Number(id));
        if (idx === -1) return res.status(404).json({ code: 404, msg: '评论不存在' });

        // 权限：评论作者或管理员
        if (comments[idx].username !== username && role !== 'admin') {
            return res.status(403).json({ code: 403, msg: '无权删除' });
        }

        comments.splice(idx, 1);
        saveComments();
        res.json({ code: 200, msg: '删除成功' });
    } catch (e) {
        console.error('删除评论失败', e);
        res.status(500).json({ code: 500, msg: '服务器错误' });
    }
});
export default router;