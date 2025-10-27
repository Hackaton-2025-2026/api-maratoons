const express = require('express');
const router = express.Router();
const groupController = require('../../controllers/group.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Appliquer le middleware d'authentification à toutes les routes de ce routeur
router.use(authMiddleware.verifyToken);
router.get('/', groupController.getAllGroup);
router.get('/:id', groupController.getAllUserByGroup);
router.post('/create', groupController.createGroup);
router.post('/join/:code', groupController.joinGroup);
router.post('/:id/leave', groupController.leaveGroup);
router.post('/:id/ban', groupController.banUser);

module.exports = router;