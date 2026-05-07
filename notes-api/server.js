// import Express.js (Backend-библиотека), SQLite, OPTIONS (чтобы подключить Frontend, поскольку CORS запрещает)
import express from 'express';
import Database from 'better-sqlite3';
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Сервер видит тебя!' });
});

//Подключаем Database
const db = new Database('data.db');
app.use(express.json());

// Создаём таблицу при старте
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    done INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// CREATE — добавить заметку
app.post('/notes', (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'text is required' });
    }

    const result = db
      .prepare('INSERT INTO notes (text, done) VALUES (?, ?)')
      .run(text, 0);

    return res.status(201).json({
      id: result.lastInsertRowid,
      text,
      done: 0
    });

  } catch (err) {
    console.log("POST ERROR:", err);
    return res.status(500).json({ error: "server crash" });
  }
});

/* OpenAi - интегрирует ИИ в сайт
app.post('/ai', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) return res.status(400).json({ error: "Empty prompt" });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Ты помощник по задачам. Отвечай кратко и по делу." },
          { role: "user", content: prompt }
        ],
        max_tokens: 200 // Ограничиваем расход токенов
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    // Правильно: берем данные из переменной data
    res.json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error('Ошибка OpenAI:', err); // Используем err
    res.status(500).json({ error: 'Ошибка ИИ', details: err.message });
  }});
*/


app.post('/ai', async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("Запрос к ИИ:", prompt);

    // ВРЕМЕННО: Вместо запроса к OpenAI возвращаем готовый текст
    return res.json({ 
      reply: `Я получил твой запрос: "${prompt}". К сожалению, баланс OpenAI пуст, но связь между Vercel и Railway работает идеально! Выпей кофе, ты проделал огромную работу.` 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ — получить все заметки
app.get('/notes', (req, res) => {
  const notes = db.prepare('SELECT * FROM notes').all();
  res.json(notes);
});


// PATCH - частично изменить заметки
app.patch('/notes/:id', (req, res) => {
  const id = req.params.id;
  const { done } = req.body;
  if (done === undefined) {
  return res.status(400).json({ error: "done is required" });
}

  db.prepare('UPDATE notes SET done = ? WHERE id = ?')
    .run(done ? 1 : 0, id);

  res.json({ success: true });
});


// DELETE — удалить по id
app.delete('/notes/:id', (req, res) => {
  db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

// Слушает запросы с порта 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});



