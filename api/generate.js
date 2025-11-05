// api/generate.js (CommonJS style module export)
const axios = require('axios');

module.exports = async function generateHandler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: '只支持 POST 请求' });
    }

    const { input } = req.body || {};
    if (!input || typeof input !== 'string') {
      return res.status(400).json({ error: '输入不能为空' });
    }

    const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY || '';
    if (!ZHIPU_API_KEY) {
      // 不阻止返回，但提示环境变量未配置
      console.warn('[WARN] ZHIPU_API_KEY 未配置，返回模拟回复（仅用于本地测试）');
      return res.status(200).json({ reply: `（未配置 ZHIPU_API_KEY）未来的我：我收到了你的留言「${input}」，不过 API 密钥未配置，请在部署平台设置 ZHIPU_API_KEY。` });
    }

    // 调用智谱AI（示例接口）
    const response = await axios.post(
      'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      {
        model: 'glm-4',
        messages: [
          {
            role: 'user',
            content: `请以“未来的我”的温柔语气，回信给现在的我。我的留言是：“${input}”`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${ZHIPU_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );

    const reply = (response && response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message && response.data.choices[0].message.content)
      ? response.data.choices[0].message.content
      : (response && response.data && response.data.message) || '未来暂时没法回信，请稍后再试。';

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('[ERROR] 调用智谱AI失败：', err && err.message ? err.message : err);
    // 不让程序崩溃，返回 500 响应
    return res.status(500).json({ error: 'AI接口调用失败', details: err && err.message ? err.message : String(err) });
  }
};
