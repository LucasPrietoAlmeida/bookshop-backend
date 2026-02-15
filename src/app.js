const express = require('express');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);

const authMiddleware = require('./middlewares/auth.middleware');

app.get('/users/me', authMiddleware, (req, res) => {
    res.json(req.user);
});


module.exports = app;
