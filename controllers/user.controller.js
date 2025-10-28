// Contrôleur pour les utilisateurs
const User = require('../models/User');
const User_bet = require('../models/User_bet');
const Bets = require('../models/Bets');
const userService = require('../services/user/user.service');
const jwtService = require('../services/jwt/jwt.service');

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Créer un nouvel utilisateur
exports.register = async (req, res) => {
  try {
    const result = await userService.createUser(req.body);
    const user = result.user;

    // Set token in httpOnly cookie
    if (result.token) {
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        username: user.nom
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.findUserByEmail(email);
    const result = await userService.checkPassword(user, password)

    if (result) {
      const token = await jwtService.createToken(user);

      // Set token in httpOnly cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          username: user.nom
        }
      })
    } else {
      return res.status(401).json({ message: "password non correspondant" })
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.logout = async (req, res) => {
  try {
    // Clear the auth cookie
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Récupérer mes propres paris
exports.getMyBets = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userBets = await User_bet.find({ user_id: userId })
      .populate({ path: 'user_id', model: 'User', select: 'nom email' })
      .populate({ path: 'bet_id', model: 'Bets' })
      .sort({ createdAt: -1 });
    res.json(userBets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Créer un pari pour l'utilisateur connecté
exports.createBet = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bet_id, amount, solde } = req.body;
    
    // Vérifier que bet_id est présent
    if (!bet_id) {
      return res.status(400).json({ error: 'Le champ bet_id est requis' });
    }

    // Le montant peut être "amount" ou "solde"
    const montant = amount || solde;
    
    if (!montant) {
      return res.status(400).json({ error: 'Le montant (amount ou solde) est requis' });
    }

    // Vérifier que le pari existe
    const bet = await Bets.findById(bet_id);
    if (!bet) {
      return res.status(404).json({ error: 'Pari non trouvé' });
    }

    // Vérifier que la course associée au bet est future
    const { validateRaceExists } = require('../services/race/race.service');
    const raceValidation = await validateRaceExists(bet.race_id);
    
    if (raceValidation.exists) {
      const race = raceValidation.data;
      const raceDate = new Date(race.startDate);
      const today = new Date();
      
      // Vérifier que la course est dans le futur
      if (raceDate <= today) {
        return res.status(400).json({ 
          error: 'Impossible de parier sur une course passée ou en cours',
          raceDate: race.startDate,
          raceName: race.name,
          details: 'Les paris ne sont possibles que pour les courses futures'
        });
      }

      // Vérifier que l'utilisateur n'a pas déjà parié sur cette course
      const existingBetsOnRace = await User_bet.find({ user_id: userId })
        .populate({
          path: 'bet_id',
          model: 'Bets'
        });
      
      for (const existingBet of existingBetsOnRace) {
        if (existingBet.bet_id && existingBet.bet_id.race_id === bet.race_id) {
          return res.status(400).json({ 
            error: 'Vous avez déjà parié sur cette course',
            race_id: bet.race_id,
            race_name: race.name,
            existing_bet_id: existingBet._id
          });
        }
      }
    }

    // Calculer les gains potentiels (solde * cote)
    const gainsPotentiels = montant * bet.cote;

    // Créer le pari utilisateur
    const userBet = new User_bet({
      user_id: userId,
      bet_id: bet_id,
      solde: montant
    });
    await userBet.save();

    await userBet.populate('user_id bet_id');
    
    // Ajouter les informations sur le pari
    const response = {
      ...userBet.toObject(),
      cote: bet.cote,
      gains_potentiels: gainsPotentiels
    };
    
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un de mes paris
exports.deleteMyBet = async (req, res) => {
  try {
    const userId = req.user.id;
    const betId = req.params.betId;

    // Récupérer le pari
    const userBet = await User_bet.findById(betId);
    if (!userBet) {
      return res.status(404).json({ error: 'Pari non trouvé' });
    }

    // Vérifier que le pari appartient à l'utilisateur
    if (userBet.user_id.toString() !== userId) {
      return res.status(403).json({ error: 'Vous ne pouvez pas supprimer ce pari' });
    }

    // Rembourser l'utilisateur
    const user = await User.findById(userId);
    if (user) {
      user.solde += userBet.solde;
      await user.save();
    }

    await User_bet.findByIdAndDelete(betId);
    res.json({ message: 'Pari supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer les paris futurs de mes amis (ceux dans mes groupes)
exports.getFriendsFutureBets = async (req, res) => {
  try {
    const userId = req.user.id;
    const futureBets = await userService.getFriendsFutureBets(userId);
    
    res.json({
      message: 'Paris futurs de mes amis',
      total: futureBets.length,
      bets: futureBets
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des paris des amis:', error);
    res.status(500).json({ error: error.message });
  }
};

