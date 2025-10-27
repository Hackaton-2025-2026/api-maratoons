// Contrôleur pour les utilisateurs
const User = require('../models/User');
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
      res.status(201).json(result);
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
    try{
        const { email, password } = req.body;
        const user = await userService.findUserByEmail(email);
        const result = await userService.checkPassword(user, password)

        if(result) {
            const token = await jwtService.createToken(user);
            return res.status(200).json({token})
        }else{
            return res.status(200).json({message: "password non correspondant"})
        }

    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

