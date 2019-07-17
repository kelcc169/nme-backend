const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  bookshelf: [{type: mongoose.Schema.Types.ObjectId, ref: 'Bookshelf'}]
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book;