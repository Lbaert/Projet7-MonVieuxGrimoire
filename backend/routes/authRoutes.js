const express = require('express');
const router = express.Router();
const authController = require('../controllers/usersController'); // Importez le contrôleur

// Routes de Connexion (Authentification)
router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;
