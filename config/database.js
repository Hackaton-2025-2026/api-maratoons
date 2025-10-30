// Méthode de connection à la BD

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI + process.env.DATABASE_NAME + '?retryWrites=true&w=majority';
    
    await mongoose.connect(mongoURI);
    
    console.log('✅ Connexion à MongoDB réussie');
    console.log(`📦 Base de données: ${process.env.DATABASE_NAME}`);
    
    // Événements de connexion
    mongoose.connection.on('error', (err) => {
      console.error('❌ Erreur MongoDB:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB déconnecté');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnecté');
    });
    
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error.message);
    // Ne pas faire crash l'application sur Vercel, loguer seulement l'erreur
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

module.exports = connectDB;

