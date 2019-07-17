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
  Bookshelf.find({}, (err, bookshelves) => {
    if (err) res.json(err)
    res.json(bookshelves)
  });
});

//get one parent and its children
app.get('/bookshelves/:id', (req, res) => {
  Bookshelf.findById(req.params.id).populate('books').exec( (err, bookshelf) => {
    if (err) res.json(err)
    res.json(bookshelf)
  });
});

//create a parent
app.post('/bookshelves', (req, res) => {
  let shelf = new Bookshelf ({
    location: req.body.location,
    size: req.body.size
  });
  shelf.save((err, shelf) => {
    if (err) res.json(err);
    res.json(shelf)
  });
});

//update one parent
app.put('/bookshelves/:id', (req, res) => {
  Bookshelf.findByIdAndUpdate(req.params.id, {
    location: req.body.location,
    size: req.body.size
  }, {
    new: true
  }, (err, shelf) => {
    if (err) res.json(err)
    res.json(shelf)
  });
});

// FIX ME
//delete one parent
app.delete('/bookshelves/:id', (req, res) => {
  Bookshelf.findByIdAndDelete(req.params.id, (err) => {
    if (err) res.json(err)
    res.json({message: 'deleted!'})
  });
});

//create a child
app.post('/bookshelves/:id/book', (req, res) => {
  Bookshelf.findById(req.params.id, (err, shelf) => {
    let newBook = new Book({
      title: req.body.title, 
      author: req.body.author, 
      genre: req.body.genre, 
    })
      newBook.save( (err, book) => {
        shelf.books.push(book)
        shelf.save( (err, shelf) => {
          if (err) res.json(err)
          res.json(shelf)
      });
    });
  });
});

//read one child
app.get('/books/:id', (req, res) => {
  Book.findById(req.params.id).populate('bookshelf').exec( (err, book) => {
    if (err) res.json(err)
    res.json(book)
  });
});

//delete one child
// app.delete('/bookshelves/:sid/book/:bid', (req, res) => {
//   Bookshelf.findById(req.params.sid, (err, shelf) => {
//     Book.findById(req.params.bid, (err, book) => {
//       shelf.books.remove(book);
//       shelf.save( (err) => {
//         book.remove( (err) => {
//           if (err) res.json(err)
//           res.json(1)
//         });
//       });
//     });
//   });
// })

//delete one child - from class
app.delete('/bookshelves/:sid/book/:bid', (req, res) => {
  Bookshelf.findById(req.params.sid, (err, shelf) => {
    shelf.books.pull(req.params.bid)
    shelf.save( err => {
      if (err) res.json(err)
      Book.findByIdAndDelete(req.params.bid, (err) => {
        if (err) res.json(err)
        res.json(1)
      })
    })
  })
})

app.get('/', (req, res) => {
  res.send('listening!')
})

app.listen(3001)