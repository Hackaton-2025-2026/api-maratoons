const express = require('express');
const router = express.Router();
const groupController = require('../../controllers/group.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Appliquer le middleware d'authentification à toutes les routes de ce routeur
router.use(authMiddleware.verifyToken);

/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Récupérer tous les groupes
 *     tags: [Groupes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les groupes
 *       401:
 *         description: Non authentifié
 */
router.get('/', groupController.getAllGroup);


/**
 * @swagger
 * /api/groups/{id}/rank:
 *   get:
 *     summary: Récupérer le classement des utilisateurs d'un groupe
 *     tags: [Groupes]
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
 *         description: Classement des utilisateurs du groupe
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Groupe non trouvé
 */
router.get('/:id/rank', groupController.getRankUserByRank)

/**
 * @swagger
 * /api/groups/{id}:
 *   get:
 *     summary: Récupérer les membres d'un groupe
 *     tags: [Groupes]
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
 *         description: Liste des membres du groupe
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Groupe non trouvé
 */
router.get('/:id', groupController.getAllUserByGroup);

/**
 * @swagger
 * /api/groups/create:
 *   post:
 *     summary: Créer un nouveau groupe
 *     tags: [Groupes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mes amis
 *               description:
 *                 type: string
 *                 example: Groupe pour mes amis
 *     responses:
 *       201:
 *         description: Groupe créé avec succès
 *       401:
 *         description: Non authentifié
 */
router.post('/create', groupController.createGroup);

/**
 * @swagger
 * /api/groups/join/{code}:
 *   post:
 *     summary: Rejoindre un groupe avec un code d'invitation
 *     tags: [Groupes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         example: ABC123
 *     responses:
 *       200:
 *         description: Groupe rejoint avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Code invalide
 */
router.post('/join/:code', groupController.joinGroup);

/**
 * @swagger
 * /api/groups/{id}/leave:
 *   post:
 *     summary: Quitter un groupe
 *     tags: [Groupes]
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
 *         description: Groupe quitté avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Groupe non trouvé
 */
router.post('/:id/leave', groupController.leaveGroup);

/**
 * @swagger
 * /api/groups/{id}/ban:
 *   post:
 *     summary: Bannir un utilisateur d'un groupe
 *     tags: [Groupes]
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
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: user123
 *     responses:
 *       200:
 *         description: Utilisateur banni avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permissions insuffisantes
 *       404:
 *         description: Groupe ou utilisateur non trouvé
 */
router.post('/:id/ban', groupController.banUser);

/**
 * @swagger
 * /api/groups/{id}:
 *  put:
 *   summary: Modifier un groupe
 *   tags: [Groupes]
 *   security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: path
 *     name: id
 *     required: true
 *     schema:
 *     type: string
 *     requestBody:
 *     required: true
 *     content:
 *     application/json:
 *    responses:
 *       200:
 *         description: Groupe modifier avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permissions insuffisantes
 */
router.put('/:id', groupController.updateGroup);

/**
 * @swagger
 * /api/groups/{id}:
 *   delete:
 *     summary: Supprimer un groupe
 *     tags: [Groupes]
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
 *         description: Groupe supprimé avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permissions insuffisantes
 */
router.delete('/:id', groupController.deleteGroup);


/**
 * @swagger
 * /api/groups/{id}:
 *  get:
 *  summary: Récupérer un groupe par ID
 *   tags: [Groupes]
 *   security:
 *   - bearerAuth: []
 *   parameters:
 *   - in: path
 *   name: id
 *   required: true
 *   schema:
 *   type: string
 *   responses:
 *    200:
 *     description: Détails du groupe
 *     404:
 *     description: Groupe non trouvé
 */
router.get('/details/:id', groupController.getGroupById);

module.exports = router;