const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Récupérer tous les utilisateurs (Admin uniquement)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclut le mot de passe
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer un utilisateur par ID (Admin ou utilisateur concerné)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    // Vérifie si l'utilisateur connecté est admin ou s'il s'agit de son propre profil
    if (req.user.role !== 'ADMIN' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour un utilisateur (Admin ou utilisateur concerné)
exports.updateUser = async (req, res) => {
  const { name, email, phone, role } = req.body;
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifie si l'utilisateur connecté est admin ou s'il s'agit de son propre profil
    if (req.user.role !== 'ADMIN' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    // Mise à jour des champs autorisés
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    // Seuls les admins peuvent changer le rôle
    if (req.user.role === 'ADMIN') {
      user.role = role || user.role;
    }

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer un utilisateur (Admin uniquement)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Changer le mot de passe (utilisateur concerné uniquement)
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifie l'ancien mot de passe
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
    }

    // Met à jour le mot de passe
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Mot de passe changé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
