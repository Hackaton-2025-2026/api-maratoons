// Routes pour les paris (bets)

const express = require('express');
const router = express.Router();
const betController = require('../../controllers/bet.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/bets:
 *   get:
 *     summary: Récupérer tous les paris
 *     tags: [Paris]
 *     responses:
 *       200:
 *         description: Liste de tous les paris
 */
router.get('/', betController.getAllBets);

/**
 * @swagger
 * /api/bets/race/{raceId}:
 *   get:
 *     summary: Récupérer les paris par course
 *     tags: [Paris]
 *     parameters:
 *       - in: path
 *         name: raceId
 *         required: true
 *         schema:
 *           type: string
 *         example: race123
 *     responses:
 *       200:
 *         description: Liste des paris pour la course
 */
router.get('/race/:raceId', betController.getBetsByRace);

/**
 * @swagger
 * /api/bets/runner/{runnerId}:
 *   get:
 *     summary: Récupérer les paris par coureur
 *     tags: [Paris]
 *     parameters:
 *       - in: path
 *         name: runnerId
 *         required: true
 *         schema:
 *           type: string
 *         example: runner123
 *     responses:
 *       200:
 *         description: Liste des paris pour le coureur
 */
router.get('/runner/:runnerId', betController.getBetsByRunner);

/**
 * @swagger
 * /api/bets/{id}:
 *   get:
 *     summary: Récupérer un pari par son ID
 *     tags: [Paris]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du pari
 *       404:
 *         description: Pari non trouvé
 */
router.get('/:id', betController.getBetById);

/**
 * @swagger
 * /api/bets:
 *   post:
 *     summary: Créer un nouveau pari
 *     tags: [Paris]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - runnerId
 *               - raceId
 *               - amount
 *             properties:
 *               runnerId:
 *                 type: string
 *                 example: runner123
 *               raceId:
 *                 type: string
 *                 example: race123
 *               amount:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Pari créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/', betController.createBet);

/**
 * @swagger
 * /api/bets/{id}:
 *   put:
 *     summary: Modifier un pari
 *     tags: [Paris]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               runnerId:
 *                 type: string
 *               raceId:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Pari modifié
 *       404:
 *         description: Pari non trouvé
 */
router.put('/:id', betController.updateBet);

/**
 * @swagger
 * /api/bets/{id}:
 *   delete:
 *     summary: Supprimer un pari
 *     tags: [Paris]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pari supprimé
 *       404:
 *         description: Pari non trouvé
 */
router.delete('/:id', betController.deleteBet);

/**
 * @swagger
 * /api/bets/generate/{raceId}:
 *   post:
 *     summary: Générer automatiquement les bets pour tous les runners d'une course
 *     tags: [Paris]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: raceId
 *         required: true
 *         schema:
 *           type: number
 *         example: 47
 *     responses:
 *       201:
 *         description: Bets générés avec succès
 *       400:
 *         description: Course passée ou mauvais timing
 *       404:
 *         description: Course non trouvée
 */
router.post('/generate/:raceId', authMiddleware.verifyToken, betController.generateBetsForRace);

module.exports = router;
