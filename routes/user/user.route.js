// Routes pour les utilisateurs

const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const authMiddleware = require('../../middlewares/auth.middleware')

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Créer un nouveau compte utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: motdepasse123
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/register', userController.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Se connecter et obtenir un token JWT
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: motdepasse123
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Email ou mot de passe incorrect
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Se déconnecter et supprimer le cookie JWT
 *     tags: [Utilisateurs]
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.post('/logout', userController.logout);

/**
 * @swagger
 * /api/users/me/bets:
 *   get:
 *     summary: Récupérer mes paris personnels
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de mes paris
 *       401:
 *         description: Non authentifié
 */
router.get('/me/bets', authMiddleware.verifyToken, userController.getMyBets);

/**
 * @swagger
 * /api/users/me/bets:
 *   post:
 *     summary: Créer un pari personnel
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Non authentifié
 */
router.post('/me/bets', authMiddleware.verifyToken, userController.createBet);

/**
 * @swagger
 * /api/users/me/bets/{betId}:
 *   delete:
 *     summary: Supprimer un de mes paris
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: betId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pari supprimé
 *       401:
 *         description: Non authentifié
 */
router.delete('/me/bets/:betId', authMiddleware.verifyToken, userController.deleteMyBet);

/**
 * @swagger
 * /api/users/me/friends/bets:
 *   get:
 *     summary: Récupérer les paris futurs de mes amis (ceux dans mes groupes)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des paris futurs de mes amis
 *       401:
 *         description: Non authentifié
 */
router.get('/me/friends/bets', authMiddleware.verifyToken, userController.getFriendsFutureBets);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Utilisateurs]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par son ID
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:id', userController.getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Modifier un utilisateur
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
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
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur modifié
 *       401:
 *         description: Non authentifié
 */
router.put('/:id', authMiddleware.verifyToken, userController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       401:
 *         description: Non authentifié
 */
router.delete('/:id', authMiddleware.verifyToken, userController.deleteUser);

module.exports = router;
