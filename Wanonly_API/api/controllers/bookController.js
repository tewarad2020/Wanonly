const mongoose = require('mongoose');
const book = mongoose.model('book');


exports.list_all_books = (req, res) => {
    book.find({}, (err, books)=> {
        if (err) res.send(err);
        res.json(books);
    }) 
}

exports.create_a_book = (req, res) => {
    const newBook = new book(req.body);
    newBook.save((err, book) => {
        console.log(err);
        if (err) res.send(err);
        
        res.json(book);
    });
    
}

exports.read_a_book = (req, res) => {
    book.find({ISBN:req.params.bookISBN}, (err, book) => {
        if (err) res.send(err);
        res.json(book);
    })
}

exports.update_a_book = (req, res) => {
    book.findOneAndUpdate(
        {ISBN:req.params.bookISBN},
        req.body,
        { new : true },
        (err, book) => {
            if (err) res.send(err);
            res.json(book);
        }
    )
}

exports.delete_a_book = (req, res) => {
    book.deleteOne({ISBN:req.params.bookISBN} , err => {
        if (err) res.send(err);
        res.json({
            message: 'book successfully deleted', 
            _id: req.params.bookISBN
        })
    })
}

