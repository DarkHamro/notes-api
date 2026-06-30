import { GoogleGenAI } from '@google/genai';

export const askAI = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Empty prompt" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Ключ GEMINI_API_KEY не найден в переменных окружения сервера" });
    }

    // Initializing official gemini
    const ai = new GoogleGenAI({ apiKey });

    // Calling directly through SDK
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Ты встроенный умный помощник в To-Do приложении. Отвечай кратко, ёмко и по делу. Клиент спрашивает: ${prompt}`,
    });

    // Taking text from SDK
    const reply = response.text;
    
    res.json({ reply });
  } catch (err) {
    console.error('Критическая ошибка в askAI:', err);
    res.status(500).json({ error: 'Ошибка ИИ', details: err.message });
  }
};