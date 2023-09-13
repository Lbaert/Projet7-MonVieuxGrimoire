const jwt = require('jsonwebtoken');
const config = require('../config/auth');

// Middleware pour l'authentification de l'utilisateur
exports.authenticateUser = (req, res, next) => {
  // Récupérer le token JWT de l'en-tête d'autorisation
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentification requise.' });
  }

  // Vérifier le token JWT
  jwt.verify(token, config.secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide.' });
    }

    // Ajouter l'ID de l'utilisateur à la requête pour une utilisation ultérieure
    req.user = { userId: user.userId };
    next(); // Continuer le traitement de la requête
  });
};
