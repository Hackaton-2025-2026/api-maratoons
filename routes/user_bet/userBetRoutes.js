// Routes pour les paris utilisateurs (user_bet)

const express = require('express');
const router = express.Router();
const userBetController = require('../../controllers/userBetController');

// Routes CRUD pour les paris utilisateurs
router.get('/', userBetController.getAllUserBets);
router.get('/user/:userId', userBetController.getBetsByUser);
router.get('/bet/:betId', userBetController.getUserBetsByBet);
router.get('/:id', userBetController.getUserBetById);

router.post('/', userBetController.createUserBet);
router.put('/:id', userBetController.updateUserBet);
router.delete('/:id', userBetController.deleteUserBet);

module.exports = router;
