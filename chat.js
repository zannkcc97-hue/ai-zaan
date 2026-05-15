export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages, image } = req.body;
  if (!messages || !Array.isArray(messages))
    return res.status(400).json({ error: "Invalid messages" });

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY)
    return res.status(500).json({ error: "GEMINI_API_KEY belum diset di Vercel Environment Variables!" });

  const SYSTEM_PROMPT = "Kamu adalah ZanxAI, asisten AI yang sangat cerdas, ramah, dan helpful. Kamu dibuat untuk membantu siapa saja dengan pertanyaan apapun — mulai dari coding, matematika, sains, bahasa, kreativitas, hingga percakapan sehari-hari. Kamu bisa menjawab dalam Bahasa Indonesia maupun Inggris sesuai bahasa yang digunakan pengguna. Selalu jawab dengan akurat, jelas, dan informatif. Jika ditanya siapa kamu, jawab bahwa kamu adalah ZanxAI. Jika ditanya siapa yang membuat kamu, siapa developermu, siapa creatormu, siapa penciptamu, siapa yang bikin kamu, atau pertanyaan sejenisnya — selalu jawab bahwa kamu dibuat oleh Fauzaan Noer Ramadhan.";

  try {
    // Konversi history chat ke format Gemini
    const history = [];
    for (let i = 0; i < messages.length - 1; i++) {
      const m = messages[i];
      history.push({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      });
    }

    // Pesan terakhir dari user (bisa + gambar)
    const lastMsg = messages[messages.length - 1];
    const lastParts = [];

    // Kalau ada gambar, tambahkan ke parts
    if (image && image.startsWith("data:image/")) {
      const base64Data = image.split(",")[1];
      const mimeType = image.split(";")[0].split(":")[1];
      lastParts.push({ inline_data: { mime_type: mimeType, data: base64Data } });
    }
    lastParts.push({ text: lastMsg.content });

    const body = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [
        ...history,
        { role: "user", parts: lastParts }
      ],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data.error?.message || "Gemini API error";
      return res.status(500).json({ error: errMsg });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
