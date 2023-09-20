const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Route pour les livres les mieux notés
router.get('/bestrating', bookController.getTopRatedBooks);

// Routes pour les livres
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

module.exports = router;
