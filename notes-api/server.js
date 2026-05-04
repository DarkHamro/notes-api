// import Express.js (Backend-библиотека), SQLite, OPTIONS (чтобы подключить Frontend, поскольку CORS запрещает)
import express from 'express';
import Database from 'better-sqlite3';
import cors from "cors";

const app = express();

app.use(cors());

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
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text is required' });
  
  const result = db
  .prepare('INSERT INTO notes (text, done) VALUES (?, ?)')
  .run(text, 0);
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
});;


// DELETE — удалить по id
app.delete('/notes/:id', (req, res) => {
  db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

// Слушает запросы с порта 3000
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running on port", PORT)
})




