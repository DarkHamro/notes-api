import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notesRoutes from '../routes/notes_ways.js';
import aiRoutes from '../routes/ai_ways.js';

dotenv.config();

const app = express();

// Global Middleware
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check endpoints
app.get('/', (req, res) => res.send('Бэкенд notes-api запущен и готов к работе!'));
app.get('/health', (req, res) => res.json({ status: 'ok', message: 'Сервер видит тебя!' }));

// API Routes
app.use('/notes', notesRoutes);
app.use('/ai', aiRoutes);

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});



