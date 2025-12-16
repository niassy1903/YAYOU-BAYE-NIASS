const Promotion = require('../models/Promotion');

// Récupérer toutes les promotions
exports.getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().populate('productId', 'name price');
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Créer une promotion
exports.createPromotion = async (req, res) => {
  const { productId, discount, startDate, endDate } = req.body;
  try {
    const promotion = new Promotion({ productId, discount, startDate, endDate });
    await promotion.save();
    res.status(201).json(promotion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer une promotion
exports.deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) return res.status(404).json({ message: 'Promotion non trouvée' });
    res.json({ message: 'Promotion supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
