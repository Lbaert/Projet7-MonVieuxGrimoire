const Book = require('../models/book');

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des livres.' });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Livre introuvable.' });
    }
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du livre.' });
  }
};

exports.getBestRatedBooks = async (req, res) => {
  try {
    const bestRatedBooks = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.json(bestRatedBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des livres les mieux notés.' });
  }
};

exports.createBook = async (req, res) => {
  try {
    // Logique pour créer un nouveau livre et l'enregistrer dans la base de données
    const { userId, title, author, imageUrl, year, genre } = req.body;
    const newBook = new Book({ userId, title, author, imageUrl, year, genre });
    await newBook.save();
    res.json({ message: 'Livre ajouté avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du livre.' });
  }
};

exports.updateBook = async (req, res) => {
  try {
    // Logique pour mettre à jour un livre existant par son ID
    const bookId = req.params.id;
    const updatedBookData = req.body;
    const updatedBook = await Book.findByIdAndUpdate(bookId, updatedBookData, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ message: 'Livre introuvable.' });
    }
    res.json({ message: 'Livre mis à jour avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du livre.' });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    // Logique pour supprimer un livre par son ID depuis la base de données
    const bookId = req.params.id;
    const deletedBook = await Book.findByIdAndRemove(bookId);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Livre introuvable.' });
    }
    res.json({ message: 'Livre supprimé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression du livre.' });
  }
};
