const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const generateHandler = require('./api/generate');
const voiceHandler = require('./api/voice');

const app = express();
app.use(bodyParser.json({ limit: '512kb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.get('/_health', (req,res)=>res.status(200).send('ok'));

// API 路由
app.post('/api/generate', (req,res)=>generateHandler(req,res));
app.get('/api/voice', (req,res)=>voiceHandler(req,res));

process.on('uncaughtException', (err)=>console.error('[uncaughtException]', err));
process.on('unhandledRejection', (reason)=>console.error('[unhandledRejection]', reason));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`✅ future-echo server started on port ${PORT}`));
