// Routes pour les utilisateurs

const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

// Routes CRUD pour les utilisateurs
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;

