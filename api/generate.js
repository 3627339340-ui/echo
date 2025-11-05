const axios = require('axios');

module.exports = async function generateHandler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: '只支持 POST' });

    const { input } = req.body || {};
    if (!input) return res.status(400).json({ error: '输入不能为空' });

    const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY || '';
    if (!ZHIPU_API_KEY) {
      return res.status(200).json({ reply: `（未配置 API_KEY）模拟回复：未来收到了你的留言「${input}」。` });
    }

    const response = await axios.post(
      'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      {
        model: 'glm-4',
        messages: [{ role: 'user', content: `请以“未来的我”的温柔语气，写一封回信回应：${input}` }]
      },
      { headers: { Authorization:`Bearer ${ZHIPU_API_KEY}`, 'Content-Type':'application/json' }, timeout:20000 }
    );

    const reply = response?.data?.choices?.[0]?.message?.content || '未来暂时没来得及回复。';
    res.status(200).json({ reply });

  } catch (err) {
    console.error('[ERROR] AI 调用失败：', err.message || err);
    res.status(500).json({ error:'AI接口调用失败', details: err.message || String(err) });
  }
};
