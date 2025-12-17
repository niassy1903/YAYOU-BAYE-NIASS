const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../controllers/contact');

// Soumission du formulaire de contact
router.post('/submit', submitContactForm);

module.exports = router;
