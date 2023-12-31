const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../backend/config/db');
const authRoutes = require('../backend/routes/authRoutes');
const bookRoutes = require('../backend/routes/bookRoutes');
const bookRoutesSecure = require('../backend/routes/bookRoutesSecure');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

// Middleware pour gérer les requêtes CORS
app.use(cors());

// Middleware pour traiter les données JSON dans les requêtes
app.use(bodyParser.json());

// Middleware pour permettre l'utilisation des données URL encodées dans les requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware Helmet pour améliorer la sécurité en définissant divers en-têtes HTTP
app.use(helmet());
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

// Middleware pour servir les fichiers statiques (images)
app.use('/images', express.static(path.join(__dirname, 'images')));

// Middleware pour gérer les en-têtes CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Utilisation des routes d'authentification
app.use('/api/auth', authRoutes);

// Utilisation des routes de livres sans middleware d'authentification
app.use('/api/books', bookRoutes);

// Utilisation des routes de livres avec middleware d'authentification
app.use('/api/books', bookRoutesSecure);

// Définition du port du serveur en fonction de la variable d'environnement ou 4000 par défaut
const port = process.env.PORT || 4000;

// Lancement du serveur
app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}`);
});
