// models/order.js
import fs from 'fs';
import path from 'path';

const ordersFilePath = path.join(process.cwd(), 'orders.json');

// 初始化订单数据
let orders = [];

// 加载订单数据
try {
    if (fs.existsSync(ordersFilePath)) {
        const data = fs.readFileSync(ordersFilePath, 'utf8');
        orders = JSON.parse(data);
    } else {
        // 创建空文件
        fs.writeFileSync(ordersFilePath, '[]');
    }
} catch (err) {
    console.error('加载订单数据失败:', err);
}

// 保存订单到文件
export function saveOrders() {
    try {
        fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
        return true;
    } catch (err) {
        console.error('保存订单失败:', err);
        return false;
    }
}

// 导出订单数据
export { orders };