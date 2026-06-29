import db from '../config/db.js';

export const getNotes = (req, res) => {
  try {
    const notes = db.prepare('SELECT * FROM notes').all();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения заметок' });
  }
};

export const createNote = (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text is required' });

    const result = db.prepare('INSERT INTO notes (text, done) VALUES (?, ?)').run(text, 0);
    return res.status(201).json({ id: result.lastInsertRowid, text, done: 0 });
  } catch (err) {
    console.error("POST ERROR:", err);
    return res.status(500).json({ error: "server crash" });
  }
};

export const updateNote = (req, res) => {
  const id = req.params.id;
  const { done } = req.body;
  if (done === undefined) return res.status(400).json({ error: "done is required" });

  db.prepare('UPDATE notes SET done = ? WHERE id = ?').run(done ? 1 : 0, id);
  res.json({ success: true });
};

export const deleteNote = (req, res) => {
  db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id);
  res.status(204).send();
};