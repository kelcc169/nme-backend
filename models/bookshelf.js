const mongoose = require('mongoose');

const bookshelfSchema = new mongoose.Schema({
  location: String,
  size: String,
  books: [{type: mongoose.Schema.Types.ObjectId, ref: 'Book'}]
});

const Bookshelf = mongoose.model('Bookshelf', bookshelfSchema);

module.exports = Bookshelf;