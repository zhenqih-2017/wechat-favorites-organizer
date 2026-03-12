# 微信收藏整理 - 部署指南

## 项目结构
```
wechat-favorites-organizer/
├── index.html          # 前端页面
├── server.js           # 后端API
├── package.json        # 依赖
└── vercel.json         # Vercel配置
```

## 部署步骤

### 1. 部署到 Vercel（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

### 2. 或部署到 Render

1. 上传代码到 GitHub
2. 在 Render 创建 Web Service
3. 选择 Node.js 环境
4. 设置启动命令: `node server.js`

### 3. 本地测试

```bash
npm install
npm start
```

访问 http://localhost:3000

## API 端点

- `GET /api/health` - 健康检查
- `GET /api/fetch?url=` - 单条抓取
- `POST /api/fetch-batch` - 批量抓取

## 环境变量

无需配置，开箱即用。
