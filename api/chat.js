export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages))
    return res.status(400).json({ error: "Invalid messages" });

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY)
    return res.status(500).json({ error: "GROQ_API_KEY belum diset di Vercel Environment Variables!" });

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 2048,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `Kamu adalah ZanxAI, asisten AI yang sangat cerdas, ramah, dan helpful. Kamu dibuat untuk membantu siapa saja dengan pertanyaan apapun — mulai dari coding, matematika, sains, bahasa, kreativitas, hingga percakapan sehari-hari. Kamu bisa menjawab dalam Bahasa Indonesia maupun Inggris sesuai bahasa yang digunakan pengguna. Selalu jawab dengan akurat, jelas, dan informatif. Jika ditanya siapa kamu, jawab bahwa kamu adalah ZanxAI.`
          },
          ...messages
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok)
      return res.status(500).json({ error: data.error?.message || "Groq API error" });

    const reply = data.choices?.[0]?.message?.content || "";
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
