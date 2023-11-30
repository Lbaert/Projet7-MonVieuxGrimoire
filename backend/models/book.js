const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: String,
  year: Number,
  genre: String,
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, min: 0, max: 5 },
    },
  ],
  averageRating: { type: Number, default: 0 }, // Ajoutez cette ligne
});

module.exports = mongoose.model('Book', bookSchema);
