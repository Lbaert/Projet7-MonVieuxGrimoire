const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');


// Routes pour les livres
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.get('/bestrating', bookController.getTopRatedBooks);

module.exports = router;


