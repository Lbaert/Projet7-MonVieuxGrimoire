const Book = require("../models/Book");
const multer = require("../middlewares/multer");
const path = require("path");
const fs = require("fs");

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la récupération des livres.",
    });
  }
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Livre introuvable." });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la récupération du livre.",
    });
  }
};

// Get top-rated books
exports.getTopRatedBooks = async (req, res) => {
  try {
    const topRatedBooks = await Book.find()
      .sort({ averageRating: -1 })
      .limit(3);
    res.status(200).json(topRatedBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la récupération des meilleurs livres.",
    });
  }
};

const createBook = async (req, res) => {
  let bookData;
  try {
    bookData = JSON.parse(req.body.book);
  } catch (error) {
    return res.status(400).json({ message: "Invalid book data format." });
  }

  const { title, author, year, genre, ratings } = bookData;
  const userId = req.user.userId;

  // Check if ratings array is provided
  const averageRating = ratings
    ? ratings.reduce((sum, r) => sum + r.grade, 0) / ratings.length
    : 0;

  const imageUrl = `http://localhost:4000/images/${req.file.filename}`;

  try {
    const newBook = new Book({
      userId,
      title,
      author,
      imageUrl,
      year,
      genre,
      ratings: ratings || [], // If ratings array is provided, use it, otherwise use an empty array
      averageRating,
    });

    await newBook.save();
    res
      .status(201)
      .json({ message: "Book created successfully!", book: newBook });
  } catch (error) {
    console.error("Error creating book:", error);
    res
      .status(500)
      .json({ message: "Failed to create book.", error: error.message });
  }
};

exports.createBook = createBook;

// Update a book by ID
exports.updateBookById = async (req, res) => {
  const { id } = req.params;
  const { title, author, year, genre } = req.body;

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Livre introuvable." });
    }

    // Log des détails actuels du livre
    console.log("Existing Book Details:", book);

    // Vérifiez si l'utilisateur est le propriétaire du livre
    if (book.userId !== req.user.userId) {
      return res.status(403).json({ message: "Accès non autorisé." });
    }

    // Vérifiez également les valeurs reçues dans la requête
    console.log("Received Book Update Values:", req.body);

    let imageUrl = book.imageUrl;
    const newImageFile = req.file;

    if (newImageFile) {
      const timestamp = Date.now();
      imageUrl = `http://localhost:4000/images/${newImageFile.filename}`;
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.year = year || book.year;
    book.genre = genre || book.genre;
    book.imageUrl = imageUrl;

    await book.save();

    // Log des détails mis à jour du livre
    console.log("Updated Book Details:", book);

    res.status(200).json({ message: "Livre mis à jour avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la mise à jour du livre.",
    });
  }
};

// Delete a book by ID
exports.deleteBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Livre introuvable." });
    }

    // Vérifiez si l'utilisateur est le propriétaire du livre
    if (book.userId !== req.user.userId) {
      return res.status(403).json({ message: "Accès non autorisé." });
    }

    // Obtenez le chemin de l'image du livre
    const imagePath = book.imageUrl;

    await Book.deleteOne({ _id: id }); // Supprimez le livre de la base de données

    // Supprimez le fichier image du serveur
    if (imagePath) {
      const imagePathParts = imagePath.split("/");
      const imageName = imagePathParts[imagePathParts.length - 1];
      const imageFilePath = path.join(__dirname, "../images", imageName); // Assurez-vous que le chemin est correct

      // Utilisez fs.unlinkSync pour supprimer le fichier image
      fs.unlinkSync(imageFilePath);
    }

    res.status(200).json({ message: "Livre supprimé avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la suppression du livre.",
    });
  }
};

// Rate a book
exports.rateBook = async (req, res) => {
  const { id } = req.params;
  const { userId, rating } = req.body;

  // Avant la récupération du livre
console.log("Book ID:", id);
const book = await Book.findById(id);

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Livre introuvable." });
    }

    // Vérifiez si l'utilisateur a déjà noté ce livre
    const existingRating = book.ratings.find((r) => r.userId === userId);
    if (existingRating) {
      // Si l'utilisateur a déjà noté le livre, mettez à jour sa notation existante
      existingRating.grade = rating;
    } else {
      // Sinon, ajoutez une nouvelle notation
      book.ratings.push({ userId, grade: rating });
    }

    // Calculez la nouvelle note moyenne
    const totalRatings = book.ratings.reduce((sum, r) => sum + r.grade, 0);
    book.averageRating = totalRatings / book.ratings.length;

        // Affichez les valeurs pour déboguer
        console.log("ratings:", book.ratings);
        console.log("averageRating:", book.averageRating);

    // Sauvegardez les modifications du livre
    await book.save();

    // Renvoyez la réponse avec l'`id` du livre inclus
    res.status(200).json({
      message: "Livre noté avec succès.",
      ratings: book.ratings,
      averageRating: book.averageRating,
      id: book._id, // Inclure l'`id` du livre
      title: book.title,
      author: book.author,
      imageUrl: book.imageUrl,
      year: book.year,
      genre: book.genre,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la notation du livre.",
    });
  }
};
