// src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const artistRoutes = require('./routes/artistRoutes');

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// servir le front (dossier public)
app.use(express.static(path.join(__dirname, '../public')));

// routes API
app.use('/api/artists', artistRoutes);

// petite route de santé
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Festival API is alive 🎸' });
});

// ⬅️ très important : on exporte l'app, on ne fait pas app.listen ici
module.exports = app;
