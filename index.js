require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const userRoutes = require('./routes/user/userRoutes');
const betRoutes = require('./routes/bets/betRoutes');
const userBetRoutes = require('./routes/user_bet/userBetRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
connectDB();

// Route "/"
app.get('/', (req, res) => {
  res.json({
    message: 'API Marathon - Bienvenue!',
    version: '1.0.0',
    status: 'running'
  });
});

// Route "/api/health"
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/user-bets', userBetRoutes);

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📝 API disponible sur http://localhost:${PORT}`);
});

// Gestion de l'arrêt propre
process.on('SIGTERM', () => {
  console.log('👋 Arrêt du serveur...');
  mongoose.connection.close();
  process.exit(0);
});

