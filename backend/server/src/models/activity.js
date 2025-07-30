import fs from 'fs';
import path from 'path';

const activitiesFilePath = path.join(process.cwd(), 'activities.json');
function readActivities() {
    if (!fs.existsSync(activitiesFilePath)) {
        // 文件不存在时，用初始数据初始化
        const initData = [
            { id: 1, title: '校园篮球3v3对抗赛', startTime: '2025-08-02 09:00', endTime: '2025-08-02 12:00', location: '篮球场', desc: '三对三半场淘汰赛，冠军队伍颁发奖杯与奖品', quota: 12, status: 'online', pv: 128, uv: 56, createdBy: 'alice' },
            { id: 2, title: '羽毛球双打友谊赛', startTime: '2025-08-03 14:00', endTime: '2025-08-03 17:00', location: '羽毛球馆', desc: '混合双打循环赛，体验竞技与配合的乐趣', quota: 16, status: 'online', pv: 210, uv: 95, createdBy: 'bob' },
            { id: 3, title: '校园夜跑荧光派对', startTime: '2025-08-05 19:30', endTime: '2025-08-05 21:30', location: '操场', desc: '5 公里荧光夜跑，装备免费发放，完赛有奖牌', quota: 200, status: 'online', pv: 88, uv: 42, createdBy: 'alice' },
            { id: 4, title: '乒乓球技巧公开课', startTime: '2025-08-06 15:00', endTime: '2025-08-06 17:00', location: '乒乓球室', desc: '零基础到进阶技巧教学，专业教练现场指导', quota: 30, status: 'online', pv: 32, uv: 18, createdBy: 'carol' }
        ];
        fs.writeFileSync(activitiesFilePath, JSON.stringify(initData, null, 2));
        return initData;
    }
    return JSON.parse(fs.readFileSync(activitiesFilePath, 'utf8'));
}

export function saveActivities(data = activities) {
    try {
        fs.writeFileSync(activitiesFilePath, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error('保存活动失败:', err);
        return false;
    }
}

// 启动时读一次，后续所有路由共享同一份内存数据
export let activities = readActivities();