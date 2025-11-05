// server.js (CommonJS)
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// 引入我们写的 handler（CommonJS 模块）
const generateHandler = require('./api/generate');

const app = express();

// 中间件
app.use(bodyParser.json({ limit: '256kb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件（把根目录当静态目录）
app.use(express.static(path.join(__dirname, '/')));

// 健康检查（Zeabur/负载均衡可用）
app.get('/_health', (req, res) => res.status(200).send('ok'));

// API 路由（与前端 fetch 的路径一致）
app.post('/api/generate', (req, res) => generateHandler(req, res));

// 捕获未处理异常，记录但不退出（尽量避免容器直接崩溃）
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason && reason.stack ? reason.stack : reason);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ future-echo server started on port ${PORT}`);
});
