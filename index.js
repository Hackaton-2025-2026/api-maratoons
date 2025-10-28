require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const userRoutes = require('./routes/user/user.route');
const betRoutes = require('./routes/bets/bet.route');
const groupRoutes = require('./routes/groups/group.route');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 3000;
const authMiddleware = require('./middlewares/auth.middleware');
const socketService = require('./services/socket/socket.service');
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Connexion à MongoDB
connectDB();

// Route "/"
app.get('/',(req, res) => {
  res.json({
    message: 'API Marathon - Bienvenue!',
    version: '1.0.0',
    status: 'running',
    documentation: `${req.protocol}://${req.get('host')}/api-docs`
  });
});

// Route "/api/health"
app.get('/api/health', authMiddleware.verifyToken, (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      user: req.user
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/groups', groupRoutes);

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

const http = require('http');
const server = http.createServer(app);

socketService.connectSocket(server);

// Démarrage du serveur
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📝 API disponible sur http://localhost:${PORT}`);
});

// Gestion de l'arrêt propre
process.on('SIGTERM', () => {
  console.log('👋 Arrêt du serveur...');
  mongoose.connection.close();
  process.exit(0);
});

