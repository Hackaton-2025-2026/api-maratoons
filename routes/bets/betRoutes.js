// Routes pour les paris (bets)

const express = require('express');
const router = express.Router();
const betController = require('../../controllers/betController');

// Routes CRUD pour les paris
router.get('/', betController.getAllBets);
router.get('/race/:raceId', betController.getBetsByRace);
router.get('/runner/:runnerId', betController.getBetsByRunner);

router.get('/:id', betController.getBetById);
router.post('/', betController.createBet);
router.put('/:id', betController.updateBet);
router.delete('/:id', betController.deleteBet);

module.exports = router;
