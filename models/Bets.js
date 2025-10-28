// Models des paris (bets)

const mongoose = require('mongoose');

const betsSchema = new mongoose.Schema({
  race_id: {
    type: Number,
    required: true,
  },
  runner_id: {
    type: Number,
    required: true,
  },
  cote: {
    type: Number,
    required: true,
    min: 1
  },
  position: {
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
betsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Bets = mongoose.model('Bets', betsSchema);

module.exports = Bets;
