export const askAI = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Empty prompt" });

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash", 
        messages: [
          { role: "system", content: "Ты встроенный умный помощник в To-Do приложении. Отвечай кратко и по делу." },
          { role: "user", content: prompt }
        ],
        max_tokens: 200
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error('Ошибка Gemini API:', err);
    res.status(500).json({ error: 'Ошибка ИИ', details: err.message });
  }
};