import jwt from 'jsonwebtoken';
const SECRET = 'demo_jwt_secret';   // 与登录签发时保持一致

export default function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: '缺少或格式错误的 token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 解析 token，把载荷挂到 req.user
        const payload = jwt.verify(token, SECRET);
        req.user = { username: payload.username };   // 或 payload.sub
        next();
    } catch (err) {
        // 捕获过期、签名错误等
        return res.status(401).json({ msg: err.message });
    }
}