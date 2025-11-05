import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "只支持 POST 请求" });

  const { input } = req.body;
  if (!input) return res.status(400).json({ error: "输入不能为空" });

  try {
    const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY;
    const response = await axios.post(
      "https://open.bigmodel.cn/api/paas/v4/chat/completions",
      {
        model: "glm-4",
        messages: [
          {
            role: "user",
            content: `请以“未来的我”的温柔语气，回信给现在的我。我的留言是：“${input}”`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${ZHIPU_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "未来暂时没来得及回复。";
    res.status(200).json({ reply });
  } catch (err) {
    console.error("智谱AI调用失败:", err.message);
    res.status(500).json({ error: "AI接口调用失败", details: err.message });
  }
}
