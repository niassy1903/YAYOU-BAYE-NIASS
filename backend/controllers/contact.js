const transporter = require('../config/email');

// Soumission du formulaire de contact
exports.submitContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Envoyer un email au support
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER, // Envoyer à votre adresse email
      subject: `Nouveau message de contact: ${subject}`,
      text: message,
      html: `<p>${message}</p>`,
    });

    res.status(200).json({ message: 'Votre message a été envoyé avec succès !' });
  } catch (err) {
    console.error('Erreur lors de l\'envoi du message:', err);
    res.status(500).json({ message: 'Erreur lors de l\'envoi du message.' });
  }
};
