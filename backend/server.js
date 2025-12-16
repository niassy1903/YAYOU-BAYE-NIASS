require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users'); // Ajoutez cette ligne
const orderRoutes = require('./routes/orders');
const promotionRoutes = require('./routes/promotions');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes); // Ajoutez cette ligne
app.use('/api/orders', orderRoutes);
app.use('/api/promotions', promotionRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
});
