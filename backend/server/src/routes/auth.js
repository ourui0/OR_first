// src/routes/auth.js
import { Router } from 'express';
import jwt from "jsonwebtoken";
const router = Router();
const SECRET = 'demo_jwt_secret';
let users = [];

router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: '用户已存在' });
    }
    users.push({ username, email, password });
    // 返回真实 JWT
    const token = 'fake-jwt-' + username;   // 开发阶段用假 token
    res.json({ code: 200, data: { token } });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ message: '用户名或密码错误' });

    // 签发 token（载荷里放 username）
    const token = jwt.sign({ username }, SECRET, { expiresIn: '2h' });
    res.json({ code: 200, data: { token } });
});
export default router;