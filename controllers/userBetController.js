// Contrôleur pour les paris des utilisateurs (user_bet)

const User_bet = require('../models/User_bet');
const User = require('../models/User');
const Bets = require('../models/Bets');

// Récupérer tous les paris utilisateurs
exports.getAllUserBets = async (req, res) => {
  try {
    const userBets = await User_bet.find().populate('user_id bet_id');
    res.json(userBets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un pari utilisateur par ID
exports.getUserBetById = async (req, res) => {
  try {
    const userBet = await User_bet.findById(req.params.id).populate('user_id bet_id');
    if (!userBet) {
      return res.status(404).json({ error: 'Pari utilisateur non trouvé' });
    }
    res.json(userBet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Créer un nouveau pari pour un utilisateur
exports.createUserBet = async (req, res) => {
  try {
    // Vérifier que les champs requis sont présents
    if (!req.body.user_id) {
      return res.status(400).json({ error: 'Le champ user_id est requis' });
    }
    
    if (!req.body.bet_id) {
      return res.status(400).json({ error: 'Le champ bet_id est requis' });
    }

    if (!req.body.solde) {
      return res.status(400).json({ error: 'Le champ solde est requis' });
    }

    console.log('Recherche utilisateur avec ID:', req.body.user_id);
    
    // Vérifier que l'utilisateur existe
    const user = await User.findById(req.body.user_id);
    console.log('Utilisateur trouvé:', user);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Utilisateur non trouvé',
        user_id: req.body.user_id
      });
    }

    // Vérifier que le pari existe
    const bet = await Bets.findById(req.body.bet_id);
    if (!bet) {
      return res.status(404).json({ error: 'Pari non trouvé' });
    }

    // Vérifier que l'utilisateur a assez de solde
    if (user.solde < req.body.solde) {
      return res.status(400).json({ 
        error: 'Solde insuffisant',
        solde_disponible: user.solde,
        solde_demande: req.body.solde
      });
    }

    // Créer le pari utilisateur
    const userBet = new User_bet(req.body);
    await userBet.save();

    // Déduire le solde de l'utilisateur
    user.solde -= req.body.solde;
    await user.save();

    await userBet.populate('user_id bet_id');
    res.status(201).json(userBet);
  } catch (error) {
    console.error('Erreur lors de la création du pari:', error);
    res.status(400).json({ 
      error: error.message,
      details: error.stack
    });
  }
};

// Mettre à jour un pari utilisateur
exports.updateUserBet = async (req, res) => {
  try {
    const userBet = await User_bet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user_id bet_id');
    if (!userBet) {
      return res.status(404).json({ error: 'Pari utilisateur non trouvé' });
    }
    res.json(userBet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un pari utilisateur
exports.deleteUserBet = async (req, res) => {
  try {
    const userBet = await User_bet.findById(req.params.id);
    if (!userBet) {
      return res.status(404).json({ error: 'Pari utilisateur non trouvé' });
    }

    // Rembourser l'utilisateur
    const user = await User.findById(userBet.user_id);
    if (user) {
      user.solde += userBet.solde;
      await user.save();
    }

    await User_bet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pari utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les paris d'un utilisateur spécifique
exports.getBetsByUser = async (req, res) => {
  try {
    const userBets = await User_bet.find({ user_id: req.params.userId })
      .populate('user_id bet_id')
      .sort({ createdAt: -1 });
    res.json(userBets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les paris pour un pari spécifique
exports.getUserBetsByBet = async (req, res) => {
  try {
    const userBets = await User_bet.find({ bet_id: req.params.betId })
      .populate('user_id bet_id')
      .sort({ createdAt: -1 });
    res.json(userBets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

