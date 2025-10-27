// Routes pour les utilisateurs

const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const authMiddleware = require('../../middlewares/auth.middleware')

// Routes publiques
router.post('/register', userController.register);
router.post('/login', userController.login);

// Routes protégées par JWT pour les paris
router.get('/me/bets', authMiddleware.verifyToken, userController.getMyBets);
router.post('/me/bets', authMiddleware.verifyToken, userController.createBet);

router.delete('/me/bets/:betId', authMiddleware.verifyToken, userController.deleteMyBet);

// Routes avec paramètres dynamiques (doivent être en dernier)
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', authMiddleware.verifyToken, userController.updateUser);
router.delete('/:id', authMiddleware.verifyToken, userController.deleteUser);

module.exports = router;
