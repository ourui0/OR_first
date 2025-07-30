// models/order.js
import fs from 'fs';
import path from 'path';

const ordersFilePath = path.join(process.cwd(), 'orders.json');

function readOrders() {
    if (!fs.existsSync(ordersFilePath)) {
        fs.writeFileSync(ordersFilePath, '[]');
        return [];
    }
    try {
        return JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));
    } catch {
        return [];
    }
}

export let orders = readOrders();   // 必须成功读到数组

export function saveOrders(data = orders) {
    try {
        fs.writeFileSync(ordersFilePath, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error('保存订单失败:', err);
        return false;
    }
}