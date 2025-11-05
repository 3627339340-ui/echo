const axios = require('axios');

module.exports = async function voiceHandler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error:'只支持 GET' });

    const text = req.query.text;
    const gender = req.query.gender || 'female';
    if (!text) return res.status(400).json({ error:'text 参数不能为空' });

    const API_KEY = process.env.ZHIPU_API_KEY || '';
    if (!API_KEY) return res.status(400).json({ error:'未配置 API_KEY' });

    const ttsRes = await axios.post(
      'https://open.bigmodel.cn/api/paas/v4/tts',
      { text, voice: gender==='male'?'zh_male':'zh_female', format:'mp3' },
      { headers:{ Authorization:`Bearer ${API_KEY}` }, responseType:'arraybuffer', timeout:20000 }
    );

    res.setHeader('Content-Type','audio/mpeg');
    res.send(ttsRes.data);

  } catch (err) {
    console.error('[VOICE ERROR]', err.message || err);
    res.status(500).json({ error:'语音生成失败', details: err.message || String(err) });
  }
};
