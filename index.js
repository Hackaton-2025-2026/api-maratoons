require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const userRoutes = require('./routes/user/user.route');
const betRoutes = require('./routes/bets/bet.route');
const groupRoutes = require('./routes/groups/group.route');
const redoc = require('redoc-express');
const swaggerSpecs = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 3000;
const authMiddleware = require('./middlewares/auth.middleware');
const socketService = require('./services/socket/socket.service');
// Middleware
// Configure CORS to handle both with and without trailing slash
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL?.replace(/\/$/, ''), // Remove trailing slash if present
  'http://localhost:5173',
  'http://localhost:5174'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Remove trailing slash from origin for comparison
    const normalizedOrigin = origin.replace(/\/$/, '');
    const normalizedAllowed = allowedOrigins.map(o => o.replace(/\/$/, ''));

    if (normalizedAllowed.indexOf(normalizedOrigin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie']
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Documentation avec ReDoc
app.get('/api-docs', redoc({
  title: 'API Marathon Documentation',
  specUrl: '/api-docs/swagger.json'
}));

// Endpoint pour servir le swagger.json
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpecs);
});

// Connexion à MongoDB
// Gérer la connexion différemment selon l'environnement
if (process.env.VERCEL) {
  // En production Vercel, se connecter si pas déjà connecté
  if (mongoose.connection.readyState === 0) {
    connectDB();
  }
} else {
  // En développement/local, se connecter normalement
  connectDB();
}

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

// Configuration pour Vercel (serverless)
const serverless = require('serverless-http');

const http = require('http');
const server = http.createServer(app);

// Only enable Socket.IO in development (not supported on Vercel serverless)
if (process.env.NODE_ENV !== 'production') {
  socketService.connectSocket(server);
  console.log('🔌 Socket.IO enabled for development');
} else {
  console.log('⚠️ Socket.IO disabled for production (Vercel serverless)');
}

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

// Export pour Vercel
module.exports.handler = serverless(app);

