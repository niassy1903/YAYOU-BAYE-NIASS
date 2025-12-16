const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const {
  getPromotions,
  createPromotion,
  deletePromotion,
} = require('../controllers/promotions');

// Routes publiques
router.get('/', getPromotions);

// Routes protégées (Admin)
router.post('/', auth, isAdmin, createPromotion);
router.delete('/:id', auth, isAdmin, deletePromotion);

module.exports = router;
