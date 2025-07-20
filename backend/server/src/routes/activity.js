import { Router } from 'express';
import { activities } from '../models/activity.js';
const router = Router();

// 列表 + 搜索 + 分页
router.get('/', (req, res) => {
    const { keyword = '', page = 1, size = 10 } = req.query;
    let list = activities.filter(a => a.title.includes(keyword));
    const total = list.length;
    list = list.slice((page - 1) * size, page * size);
    res.json({ code: 200, data: { list, total } });
});

// 详情
router.get('/:id', (req, res) => {
    const act = activities.find(a => a.id === +req.params.id);
    if (!act) return res.status(404).json({ msg: '活动不存在' });
    res.json({ code: 200, data: act });
});

// 新增
router.post('/', (req, res) => {
    const id = activities.length ? Math.max(...activities.map(a => a.id)) + 1 : 1;
    const act = { id, ...req.body, pv: 0, uv: 0 };
    activities.push(act);
    res.json({ code: 200, data: act });
});

// 编辑
router.put('/:id', (req, res) => {
    const idx = activities.findIndex(a => a.id === +req.params.id);
    if (idx === -1) return res.status(404).json({ msg: '活动不存在' });
    Object.assign(activities[idx], req.body);
    res.json({ code: 200, data: activities[idx] });
});

// 删除
router.delete('/:id', (req, res) => {
    const idx = activities.findIndex(a => a.id === +req.params.id);
    if (idx === -1) return res.status(404).json({ msg: '活动不存在' });
    activities.splice(idx, 1);
    res.json({ code: 200, msg: '删除成功' });
});

export default router;