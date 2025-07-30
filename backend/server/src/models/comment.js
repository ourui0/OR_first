// models/comment.js
import fs from 'fs';
import path from 'path';

const commentsFilePath = path.join(process.cwd(), 'comments.json');

// 工具：读
function readComments() {
    if (!fs.existsSync(commentsFilePath)) {
        fs.writeFileSync(commentsFilePath, '[]');
        return [];
    }
    try {
        return JSON.parse(fs.readFileSync(commentsFilePath, 'utf8'));
    } catch (err) {
        console.error('解析 comments.json 失败，返回空数组', err);
        return [];
    }
}

// 工具：写
export function saveComments(data =  comments) {
    try {
        fs.writeFileSync(commentsFilePath, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error('保存评论失败:', err);
        return false;
    }
}

// 进程启动时读一次，后续所有路由共享同一份内存数据
export let comments = readComments();