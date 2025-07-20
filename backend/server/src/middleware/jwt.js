import jwt from 'jsonwebtoken';
const SECRET = 'demo_jwt_secret';

export default function (req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: '未登录' });
    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch {
        return res.status(401).json({ msg: 'token 无效' });
    }
}