const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/auth");

// Fonction de validation d'une adresse e-mail
const isEmailValid = (email) => {
  // Utilisez une expression régulière pour valider l'adresse e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Signup function
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'adresse e-mail est valide
    if (!isEmailValid(email)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Veuillez fournir une adresse e-mail valide.",
        });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Cet utilisateur existe déjà." });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "Utilisateur enregistré avec succès." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Une erreur s'est produite lors de l'inscription.",
        error: error.message,
      });
  }
};

// Login function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Identifiants incorrects." });
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Identifiants incorrects." });
    }

    // Générer un token JWT
    const token = jwt.sign({ userId: user._id }, config.secretKey, {
      expiresIn: "1h",
    });

    res.status(200).json({ success: true, userId: user._id, token });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Une erreur s'est produite lors de la connexion.",
        error: error.message,
      });
  }
};
