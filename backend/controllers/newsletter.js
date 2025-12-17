const transporter = require('../config/email');

// Inscription à la newsletter
exports.subscribeNewsletter = async (req, res) => {
  const { email } = req.body;

  try {
    // Envoyer un email de confirmation
    await transporter.sendMail({
      from: `"Yayou Shop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Inscription à la Newsletter',
      text: 'Merci pour votre inscription à notre newsletter !',
      html: '<b>Merci pour votre inscription à notre newsletter !</b>',
    });

    res.status(200).json({ message: 'Inscription à la newsletter réussie !' });
  } catch (err) {
    console.error('Erreur lors de l\'envoi de l\'email:', err);
    res.status(500).json({ message: 'Erreur lors de l\'inscription à la newsletter.' });
  }
};
