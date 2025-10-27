const express = require('express');
const router = express.Router();
const groupController = require('../../controllers/group.controller');

router.get('/:id', groupController.createGroup);
router.post('/create', groupController.createGroup);
router.post('/join', groupController.getAllUsers);
router.post('/:id/leave', groupController.getAllUsers);
router.post('/ban', groupController.getAllUsers);

module.exports = router;

