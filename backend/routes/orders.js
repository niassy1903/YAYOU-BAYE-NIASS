const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const {
  getOrders,
  getUserOrders,
  createOrder,
  updateOrderStatus,
} = require('../controllers/orders');

// Routes publiques (pour l'utilisateur connecté)
router.get('/my-orders', auth, getUserOrders);
router.post('/', auth, createOrder);

// Routes protégées (Admin)
router.get('/', auth, isAdmin, getOrders);
router.put('/:id/status', auth, isAdmin, updateOrderStatus);

module.exports = router;
