export default async function handler(req, res) {
  console.log("予約不可リクエスト受信:", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const GAS_URL = "https://script.google.com/macros/s/AKfycbw0xAlekbbME08YaiMQMMB5ngfCDaMEWXicbyU1VlFl8quo1srYmibMD6BPWjdzj_Tb7g/exec";
  const data = req.body;

  try {
    const gasRes = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const text = await gasRes.text();
    console.log("GASレスポンス:", text);

    try {
      const result = JSON.parse(text);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({
        message: "GASからのレスポンスがJSONではありません",
        raw: text
      });
    }
  } catch (err) {
    console.error("fuka.js通信エラー:", err);
    return res.status(500).json({ message: "fuka.js通信エラー", error: err.message });
  }
}