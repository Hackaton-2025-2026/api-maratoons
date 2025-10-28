// Contrôleur pour les paris (bets)

const Bets = require('../models/Bets');
const { validateRaceAndRunner, getRunnersByRace, validateRaceExists } = require('../services/race/race.service');

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

// Générer automatiquement les bets pour tous les runners d'une course
exports.generateBetsForRace = async (req, res) => {
  try {
    const raceId = Number(req.params.raceId);
    
    // 1. Vérifier que la race existe et récupérer ses informations
    const raceValidation = await validateRaceExists(raceId);
    if (!raceValidation.exists) {
      return res.status(404).json({ error: `Race ID ${raceId} invalide - Cette course n'existe pas` });
    }
    
    const race = raceValidation.data;
    
    // 2. Vérifier que la race est future
    const today = new Date();
    const raceDate = new Date(race.startDate);
    
    if (raceDate <= today) {
      return res.status(400).json({ 
        error: 'Impossible de générer des bets pour une course passée',
        raceDate: race.startDate
      });
    }
    
    // 3. Calculer le nombre de jours avant la course
    const daysDifference = Math.ceil((raceDate - today) / (1000 * 60 * 60 * 24));
    
    // 4. Vérifier que l'on est au moins à 3 jours de la course
    // et pas à moins de 1 jour avant
    if (daysDifference < 3) {
      return res.status(400).json({ 
        error: 'Les bets doivent être créés au moins 3 jours avant la course',
        raceDate: race.startDate,
        daysUntilRace: daysDifference,
        minimumDaysRequired: 3
      });
    }
    
    if (daysDifference === 1 || daysDifference === 0) {
      return res.status(400).json({ 
        error: 'Les bets ne peuvent pas être créés à moins de 1 jour de la course',
        raceDate: race.startDate,
        daysUntilRace: daysDifference
      });
    }
    
    // 5. Récupérer tous les runners de la course
    const runnersResult = await getRunnersByRace(raceId);
    if (!runnersResult.success) {
      return res.status(500).json({ 
        error: 'Erreur lors de la récupération des runners',
        details: runnersResult.error
      });
    }
    
    const runners = runnersResult.runners;
    if (runners.length === 0) {
      return res.status(400).json({ error: 'Aucun runner trouvé pour cette course' });
    }
    
    // 6. Créer les bets pour chaque runner
    const createdBets = [];
    for (const runner of runners) {
      // Position aléatoire entre 1 et 3
      const position = Math.floor(Math.random() * 3) + 1;
      // Cote entre 1 et 20 (avec incrément de 1)
      const cote = Math.floor(Math.random() * 20) + 1;
      
      // Vérifier si le bet n'existe pas déjà
      const existingBet = await Bets.findOne({ 
        race_id: raceId, 
        runner_id: runner.id 
      });
      
      if (!existingBet) {
        const bet = new Bets({
          race_id: raceId,
          runner_id: runner.id,
          position,
          cote
        });
        await bet.save();
        createdBets.push(bet);
      }
    }
    
    res.status(201).json({
      message: `Bets générés avec succès pour la course ${race.name}`,
      raceId,
      totalRunners: runners.length,
      newBetsCreated: createdBets.length,
      bets: createdBets
    });
    
  } catch (error) {
    console.error('Erreur lors de la génération des bets:', error);
    res.status(500).json({ error: error.message });
  }
};

