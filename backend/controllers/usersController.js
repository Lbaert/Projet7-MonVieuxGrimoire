const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Charger les variables d'environnement depuis le fichier .env

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
    }
    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    // Créer un nouvel utilisateur
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.json({ message: 'Inscription réussie.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }
    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }
    // Générer un token JWT en utilisant la clé secrète à partir des variables d'environnement
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '24h' });
    res.json({ userId: user._id, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la connexion.' });
  }
};
