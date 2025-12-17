const nodemailer = require('nodemailer');

// Configuration du transporteur d'emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // Utilisez le service Gmail
  auth: {
    user: process.env.EMAIL_USER, // Votre adresse email
    pass: process.env.EMAIL_PASSWORD, // Votre mot de passe email
  },
});

module.exports = transporter;
