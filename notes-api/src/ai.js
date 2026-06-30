export const askAI = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Empty prompt" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Ключ GEMINI_API_KEY не найден на сервере" });
    }

    // Строго v1beta и строго gemini-1.5-flash без лишних слов
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Ты встроенный умный помощник в To-Do приложении. Отвечай кратко, ёмко и по делу. Клиент спрашивает: ${prompt}` }]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('Ошибка от Google API:', data.error);
      return res.status(500).json({ error: data.error.message });
    }

    // Извлекаем текст ответа
    const reply = data.candidates[0].content.parts[0].text;
    res.json({ reply });

  } catch (err) {
    console.error('Критическая ошибка в askAI:', err);
    res.status(500).json({ error: 'Ошибка ИИ', details: err.message });
  }
};