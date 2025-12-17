const express = require('express');
const router = express.Router();
const { subscribeNewsletter } = require('../controllers/newsletter');

// Inscription à la newsletter
router.post('/subscribe', subscribeNewsletter);

module.exports = router;
