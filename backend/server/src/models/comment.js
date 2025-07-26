import fs from 'fs';
import path from 'path';

const commentsFilePath = path.join(process.cwd(), 'comments.json');

// 初始化评论数据
let comments = [];

// 加载评论数据
try {
    if (fs.existsSync(commentsFilePath)) {
        const data = fs.readFileSync(commentsFilePath, 'utf8');
        comments = JSON.parse(data);
    } else {
        fs.writeFileSync(commentsFilePath, '[]');
    }
} catch (err) {
    console.error('加载评论数据失败:', err);
}

// 保存评论到文件
export function saveComments() {
    try {
        fs.writeFileSync(commentsFilePath, JSON.stringify(comments, null, 2));
        return true;
    } catch (err) {
        console.error('保存评论失败:', err);
        return false;
    }
}

// 导出评论数据
export { comments };