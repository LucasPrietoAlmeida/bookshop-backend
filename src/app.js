const express = require('express');
const dotenv = require('dotenv');
const bookRoutes = require('./routes/book.routes');
const authRoutes = require('./routes/auth.routes');
const authMiddleware = require('./middlewares/auth.middleware');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/books', bookRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
