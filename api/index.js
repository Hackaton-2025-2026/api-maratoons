// api/index.js - Function handler for Vercel serverless
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const userRoutes = require('../routes/user/user.route');
const betRoutes = require('../routes/bets/bet.route');
const groupRoutes = require('../routes/groups/group.route');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('../config/swagger');
const authMiddleware = require('../middlewares/auth.middleware');

const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL?.replace(/\/$/, ''),
  'http://localhost:5173',
  'http://localhost:5174'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
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

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Connect to MongoDB (only once, Vercel caches the connection)
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }
  try {
    await connectDB();
    isConnected = true;
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

// Route "/"
app.get('/', (req, res) => {
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

// Export the Express app as a serverless function
module.exports = async (req, res) => {
  // Connect to database on first request
  await connectToDatabase();
  
  // Handle the request
  app(req, res);
};

