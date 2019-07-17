const express = require('express');
const mongoose = require('mongoose');
const Bookshelf = require('./models/bookshelf');
const Book = require('./models/book');

const app = express();

app.use(express.urlencoded({extended: false}))

mongoose.connect('mongodb://localhost/nme-backend');

//Routes Required:

//get all parent
app.get('/bookshelves', (req, res) => {
  Bookshelf.find({}, function (err, bookshelves) {
    if (err) res.json(err)
    res.json(bookshelves)
  });
});

//get one parent and its children
app.get('/bookshelves/:id', (req, res) => {
  Bookshelf.findById(req.params.id).populate('books').exec(function (err, bookshelf) {
    if (err) res.json(err)
    res.json(bookshelf)
  });
});

//create a parent
app.post('/bookshelves', (req, res) => {
  Bookshelf.create({
    location: req.body.location,
    size: req.body.size
  }, function (err, shelf) {
    if (err) res.json(err);
    res.json(shelf)
  });
});

//update one parent
app.put('/bookshelves/:id', (req, res) => {
  Bookshelf.findByIdAndUpdate(req.params.id, {size: 'short'}, {new: true}, function (err, shelf) {
    if (err) res.json(err)
    res.json(shelf)
  });
});

//delete one parent
app.delete('/bookshelves/:id', (req, res) => {
  Bookshelf.findByIdAndDelete(req.params.id, function (err) {
    if (err) res.json(err)
    res.json({message: 'deleted!'})
  });
});

//create a child
app.post('/bookshelves/:id/book', (req, res) => {
  Bookshelf.findById(req.params.id, function (err, shelf) {
    Book.create({title: req.body.title, author: req.body.author, genre: req.body.genre}, function (err, book) {
      shelf.books.push(book);
      shelf.save(function (err) {
        book.bookshelf.push(shelf);
        book.save(function (err) {
          if (err) res.json(err)
          res.json(shelf)
        });
      });
    });
  });
});

//read one child
app.get('/books/:id', (req, res) => {
  Book.findById(req.params.id).populate('bookshelf').exec(function (err, book) {
    if (err) res.json(err)
    res.json(book)
  });
});

//delete one child
app.delete('/bookshelves/:sid/book/:bid', (req, res) => {
  Bookshelf.findById(req.params.sid, function (err, shelf) {
    Book.findById(req.params.bid, function (err, book) {
      shelf.books.remove(book);
      shelf.save(function (err) {
        book.bookshelf.remove(shelf);
        book.save(function (err) {
          if (err) res.json(err)
          res.json(shelf)
        });
      });
    });
  });
})

app.get('/', (req, res) => {
  res.send('listening!')
})

app.listen(3001)