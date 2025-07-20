import { Router } from 'express';
import { comments } from '../models/comment.js';
import auth from '../middleware/jwt.js';
const router = Router();

// 某活动评论列表
router.get('/:activityId', (req, res) => {
    const list = comments.filter(c => c.activityId === +req.params.activityId);
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
    res.json({ code: 200, data: c });
});

export default router;