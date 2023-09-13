const Book = require('../models/Book');

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des livres.' });
  }
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Livre introuvable.' });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération du livre.' });
  }
};

// Get top-rated books
exports.getTopRatedBooks = async (req, res) => {
  try {
    const topRatedBooks = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.status(200).json(topRatedBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des meilleurs livres.' });
  }
};

// Create a new book
exports.createBook = async (req, res) => {
  const { title, author, imageUrl, year, genre } = req.body;
  console.log ("affichageReqBody" + req.body)
  console.log ("affichageReqBodyBook" + JSON.parse(req.body.book))

  try {
    const newBook = new Book({
      userId: req.user.userId, // Utilisez l'ID de l'utilisateur authentifié
      title,
      author,
      imageUrl,
      year,
      genre,
      ratings: [],
      averageRating: 0,
    });

    //await newBook.save();

    res.status(201).json({ message: 'Livre créé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la création du livre.' });
  }
};

// Update a book by ID
exports.updateBookById = async (req, res) => {
  const { id } = req.params;
  const { title, author, imageUrl, year, genre } = req.body;

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Livre introuvable.' });
    }

    // Vérifiez si l'utilisateur est le propriétaire du livre
    if (book.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Accès non autorisé.' });
    }

    // Mettez à jour les propriétés du livre
    book.title = title;
    book.author = author;
    book.imageUrl = imageUrl;
    book.year = year;
    book.genre = genre;

    await book.save();

    res.status(200).json({ message: 'Livre mis à jour avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la mise à jour du livre.' });
  }
};

// Delete a book by ID
exports.deleteBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Livre introuvable.' });
    }

    // Vérifiez si l'utilisateur est le propriétaire du livre
    if (book.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Accès non autorisé.' });
    }

    await book.remove();

    res.status(200).json({ message: 'Livre supprimé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la suppression du livre.' });
  }
};

// Rate a book
exports.rateBook = async (req, res) => {
  const { id } = req.params;
  const { userId, rating } = req.body;

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Livre introuvable.' });
    }

    // Vérifiez si l'utilisateur a déjà noté ce livre
    const existingRating = book.ratings.find((r) => r.userId === userId);
    if (existingRating) {
      return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' });
    }

    // Vérifiez que la note est entre 0 et 5
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'La note doit être comprise entre 0 et 5.' });
    }

    // Ajoutez la nouvelle note à la liste des notations
    book.ratings.push({ userId, grade: rating });

    // Calculez la nouvelle note moyenne
    const totalRatings = book.ratings.reduce((sum, r) => sum + r.grade, 0);
    book.averageRating = totalRatings / book.ratings.length;

    await book.save();

    res.status(200).json({ message: 'Livre noté avec succès.', book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la notation du livre.' });
  }
};
