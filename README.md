# Web 开发大作业 —— 体育活动室

> Vue3 + ElementPlus + Vite（前端）  
> Node.js + Express + JWT（后端）  
> GitHub Actions 自动 CI/CD

仓库地址：https://github.com/ourui0/OR_first

---

## ✅ 完成情况对照评分表

| 评分规则功能点 | 实现情况 | 备注 |
|---|---|---|
| 多用户注册、登录 | ✅ | 注册接口 /api/auth/register，登录后返回 JWT |
| 活动管理 | ✅ | 创建者本人或管理员均可增删改活动 |
| 活动报名 | ✅ | 活动详情页一键报名/取消 |
| 活动订单管理 | ✅ | 用户可在列表/详情查看已报名状态；创建者/管理员可查看活动成员 |
| 活动列表查看 | ✅ | 首页表格 + 分页 + 搜索 |
| 活动详情查看 | ✅ | Detail.vue 展示时间、地点、描述、报名人数 |
| 活动评论 | ✅ | 详情页实时评论；作者/管理员可删 |
| 活动搜索 | ✅ | 顶部关键字实时过滤 |

> 未单独做「管理员界面」和「我的活动」页面，但**创建者和管理员共用同一套界面完成全部管理操作**，权限已在接口层区分，满足需求。

---

## 🌟 附加功能
- 响应式布局（ElementPlus 断点适配）
- GitHub Actions 自动 lint + build + 部署前端到 GitHub Pages
- RESTful API 设计，统一返回 `{code, msg, data}`

---

## 🚀 技术栈
- **前端**  
  Vue3、Vite、Vue-Router、Pinia、ElementPlus、Axios

- **后端**  
  Node.js、Express、JWT、bcryptjs、Mongoose（已留好扩展位）

- **CI/CD**  
  GitHub Actions + GitHub Pages（前端）  
  Render / Railway Docker 部署（后端）

---

## 📁 目录结构
```plaintext
project
├─ .github/workflows/ci.yml        # GitHub Actions
├─ backend
│  ├─ server/index.js             # 入口
│  ├─ src/routes/activity.js      # 活动 CRUD + 搜索
│  ├─ src/routes/order.js         # 报名/取消/查询
│  ├─ src/routes/comment.js       # 评论增删
│  ├─ src/middleware/jwt.js       # JWT 统一鉴权
│  ├─ models/*.js                 # 内存持久化（json 文件）
│  └─ package.json
└─ frontend
├─ src/views/Activity/List.vue # 列表+搜索+报名状态
├─ src/views/Activity/Detail.vue # 详情+评论+报名/取消
├─ src/services/activity.js    # 前端 API 封装
├─ vite.config.js              # 代理 /api → localhost:3000
└─ package.json
```
---
## 🔧 快速开始

### 1. 克隆仓库
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### 2. 后端
```bash
cd backend
# 新建环境变量
cat > .env <<EOF
PORT=3000
JWT_SECRET=super_secret_demo
CORS_ORIGIN=http://localhost:5173
EOF

npm install
npm run dev        # 默认监听 3000
```

### 3. 前端
```bash
cd ../frontend
npm install
npm run dev        # 默认 http://localhost:5173
```

打开浏览器访问 [http://localhost:5173](http://localhost:5173) 即可体验。

---

## 🧪 测试账号
| 邮箱              | 密码   | 权限   |
|-------------------|--------|--------|
| admin@example.com | 123456 | 管理员 |
| user@example.com  | 123456 | 普通用户 |

---

## 🔐 权限设计简要说明
- JWT payload 包含 `username` 与 `role`（admin / user）。
- 所有需鉴权的接口统一走 `backend/src/middleware/jwt.js`。
- 删除活动 / 删除评论时，后端再次校验：
  ```js
  if (record.createdBy !== username && role !== 'admin') return 403;
  ```
  即使前端隐藏按钮，接口依旧安全。

---

## 🌐 生产部署
- **前端**：Push 到 `main` 分支 → GitHub Actions 构建并推送到 `gh-pages` 分支 → GitHub Pages 自动发布。
- **后端**：已提供 `backend/Dockerfile`，示例一键部署到 Render：
  ```bash
  docker build -t sport-backend ./backend
  docker run -p 3000:3000 -e JWT_SECRET=xxx sport-backend
  ```
```