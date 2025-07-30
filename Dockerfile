# 1. 用官方 Node 20 轻量镜像作为基础
FROM node:20-alpine

# 2. 在镜像里建个 /app 目录
WORKDIR /app

# 3. 先把依赖文件拷进去
COPY package*.json ./

# 4. 安装依赖（生产环境）
RUN npm ci --only=production

# 5. 把其余源码拷进去
COPY . .

# 6. 声明容器对外暴露的端口
EXPOSE 3000

# 7. 容器启动时执行的命令
CMD ["node", "server/index.js"]