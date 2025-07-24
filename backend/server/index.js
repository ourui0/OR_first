import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRouter    from './src/routes/auth.js';
import activityRouter from './src/routes/activity.js';
import orderRouter    from './src/routes/order.js';
import commentRouter  from './src/routes/comment.js';
import auth from "./src/middleware/jwt.js";
import {orders} from "./src/models/order.js";
import router from "./src/routes/order.js";

const app = express();
const PORT = 3000;

// 临时内存“数据库”
const users = [];

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
// 路由
app.use('/auth', authRouter);
app.use('/activity',activityRouter);
app.use('/',   orderRouter);
app.use('/comment', commentRouter);
// app.post('/activity/:id/order', (req, res) => {
//     res.json({ ok: true });
// });

// 404 处理
app.use((_req, res) => res.status(404).json({ msg: 'API not found' }));


app.listen(PORT, () => console.log(`🚀 Server ready → http://localhost:${PORT}`));