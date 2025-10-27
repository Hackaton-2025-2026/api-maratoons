// Models des paris (bets)

const mongoose = require('mongoose');

const betsSchema = new mongoose.Schema({
  race_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  runner_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  cote: {
    type: Number,
    required: true,
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


