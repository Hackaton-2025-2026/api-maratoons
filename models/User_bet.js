// Models de liaison entre utilisateurs et paris

const mongoose = require('mongoose');

const userBetSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  bet_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  solde: {
    type: Number,
    required: true,
    min: 0
  },
  position_runner: {
    type: Number,
    min: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour mettre à jour updatedAt automatiquement
userBetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const User_bet = mongoose.model('User_bet', userBetSchema);

module.exports = User_bet;

