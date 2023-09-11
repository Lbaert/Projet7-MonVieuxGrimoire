const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;


require('dotenv').config();

// Middleware pour traiter les données JSON dans les requêtes
app.use(bodyParser.json());

// MongoDB Atlas
const mongoDBAtlasURI = 'mongodb+srv://lbaert0:R04WhfuYXieK4dw6@cluster0.gnyrenc.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoDBAtlasURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connexion à MongoDB Atlas établie');
  })
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB Atlas :', err);
  });

// Import des routes
const authRoutes = require('../backend/routes/authRoutes');
const bookRoutes = require('../backend/routes/bookRoutes');

// Middleware de vérification du token
const verifyToken = require('../backend/middlewares/middleware');

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Routes de gestion des livres
app.use('/api/books', verifyToken, bookRoutes);

///

// Route middleware pour gérer les erreurs 404 (route non trouvée)
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

///

// Démarrer le serveur sur le port spécifié
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
