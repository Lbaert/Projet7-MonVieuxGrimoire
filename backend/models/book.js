const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  userId: String,
  title: String,
  author: String,
  imageUrl: String,
  year: Number,
  genre: String,
  ratings: [
    {
      userId: String,
      grade: Number,
    },
  ],
  averageRating: Number,
});

module.exports = mongoose.model('Book', bookSchema);
