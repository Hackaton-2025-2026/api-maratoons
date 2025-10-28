// Contrôleur pour les paris (bets)

const Bets = require('../models/Bets');
const { validateRaceAndRunner } = require('../services/race/race.service');

// Récupérer tous les paris
exports.getAllBets = async (req, res) => {
  try {
    const bets = await Bets.find();
    res.json(bets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un pari par ID
exports.getBetById = async (req, res) => {
  try {
    const bet = await Bets.findById(req.params.id);
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
    const { race_id, runner_id } = req.body;

    // Convertir en Number si nécessaire
    const raceId = Number(race_id);
    const runnerId = Number(runner_id);

    // Valider que race_id et runner_id existent dans l'API externe
    const validation = await validateRaceAndRunner(raceId, runnerId);
    
    if (!validation.raceValid || !validation.runnerValid) {
      return res.status(400).json({ 
        error: 'Validation échouée',
        details: validation.errors
      });
    }

    // Créer le pari avec les IDs convertis
    const bet = new Bets({
      ...req.body,
      race_id: raceId,
      runner_id: runnerId
    });
    await bet.save();
    res.status(201).json(bet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Mettre à jour un pari
exports.updateBet = async (req, res) => {
  try {
    const { race_id, runner_id } = req.body;

    // Si race_id ou runner_id sont modifiés, valider leur existence
    if (race_id || runner_id) {
      const existingBet = await Bets.findById(req.params.id);
      
      const raceIdToValidate = race_id || existingBet.race_id;
      const runnerIdToValidate = runner_id || existingBet.runner_id;

      const validation = await validateRaceAndRunner(raceIdToValidate, runnerIdToValidate);
      
      if (!validation.raceValid || !validation.runnerValid) {
        return res.status(400).json({ 
          error: 'Validation échouée',
          details: validation.errors
        });
      }
    }

    // Mettre à jour le pari
    const bet = await Bets.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
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
    const raceId = Number(req.params.raceId);
    const bets = await Bets.find({ race_id: raceId });
    res.json(bets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer les paris d'un coureur spécifique
exports.getBetsByRunner = async (req, res) => {
  try {
    const runnerId = Number(req.params.runnerId);
    const bets = await Bets.find({ runner_id: runnerId });
    res.json(bets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

