const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
} = require('../controllers/users');

// ⚠️ ROUTES SPÉCIFIQUES D’ABORD
router.put('/change-password', auth, changePassword);

// ADMIN
router.get('/', auth, isAdmin, getUsers);
router.delete('/:id', auth, isAdmin, deleteUser);

// UTILISATEUR
router.get('/:id', auth, getUserById);
router.put('/:id', auth, updateUser);

module.exports = router;
