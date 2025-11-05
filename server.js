// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// 导入 handler（CommonJS）
const generateHandler = require('./api/generate');

const app = express();
app.use(bodyParser.json({ limit: '512kb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件来自 public/
app.use(express.static(path.join(__dirname, 'public')));

// 健康检查（方便平台探测）
app.get('/_health', (req, res) => res.status(200).send('ok'));

// API 路由
app.post('/api/generate', (req, res) => generateHandler(req, res));

// 捕获未处理异常，记录，防止容器因未捕获异常直接退出
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
