import { Router } from 'express';
import jwt from 'jsonwebtoken';
const router = Router();
const SECRET = 'demo_jwt_secret';

let users = []; // 内存

router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    if (users.find(u => u.username === username)) {
        // 真正失败：返回 400
        return res.status(400).json({ message: '用户已存在' });
    }
    users.push({ username, email, password });
    // 真正成功：返回 200 + token
    res.json({ code: 200, data: { token: 'fake-jwt-' + username } });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        // 真正失败：返回 401
        return res.status(401).json({ message: '用户名或密码错误' });
    }
    // 真正成功：返回 200 + token
    res.json({ code: 200, data: { token: 'fake-jwt-' + username } });
});

export default router;