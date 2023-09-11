const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Charger les variables d'environnement depuis le fichier .env

function verifyToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Accès non autorisé. Token invalide.' });
    }

    // Si le token est valide, ajoutez les informations d'utilisateur décodées à l'objet de demande.
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
