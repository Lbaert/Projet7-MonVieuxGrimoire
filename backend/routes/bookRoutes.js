const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController'); // Importez le contrôleur

// Routes de Livres (Books)
router.get('/', booksController.getBooks);
router.get('/:id', booksController.getBookById);
router.get('/bestrating', booksController.getBestRatedBooks);
router.post('/create', booksController.createBook);
router.put('/:id', booksController.updateBook);
router.delete('/:id', booksController.deleteBook);

module.exports = router;
