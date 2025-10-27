// Contrôleur pour les paris (bets)

const Bets = require('../models/Bets');

// Récupérer tous les paris
exports.getAllBets = async (req, res) => {
  try {
    const bets = await Bets.find().populate('race_id runner_id');
    res.json(bets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un pari par ID
exports.getBetById = async (req, res) => {
  try {
    const bet = await Bets.findById(req.params.id).populate('race_id runner_id');
    if (!bet) {
      return res.status(404).json({ error: 'Pari non trouvé' });
    }
    res.json(bet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Créer un nouveau pari
exports.createBet = async (req, res) => {
  try {
    const bet = new Bets(req.body);
    await bet.save();
    await bet.populate('race_id runner_id');
    res.status(201).json(bet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Mettre à jour un pari
exports.updateBet = async (req, res) => {
  try {
    const bet = await Bets.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('race_id runner_id');
    if (!bet) {
      return res.status(404).json({ error: 'Pari non trouvé' });
    }
    res.json(bet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un pari
exports.deleteBet = async (req, res) => {
  try {
    const bet = await Bets.findByIdAndDelete(req.params.id);
    if (!bet) {
      return res.status(404).json({ error: 'Pari non trouvé' });
    }
    res.json({ message: 'Pari supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer les paris d'une course spécifique
exports.getBetsByRace = async (req, res) => {
  try {
    const bets = await Bets.find({ race_id: req.params.raceId })
      .populate('race_id runner_id');
    res.json(bets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer les paris d'un coureur spécifique
exports.getBetsByRunner = async (req, res) => {
  try {
    const bets = await Bets.find({ runner_id: req.params.runnerId })
      .populate('race_id runner_id');
    res.json(bets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

