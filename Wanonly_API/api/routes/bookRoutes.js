const bookBuilder = require('../controllers/bookController');
const cartBuilder = require('../controllers/cartController');

module.exports = app => {
    app
        .route('/books')
        .get(bookBuilder.list_all_books)
        .post(bookBuilder.create_a_book);

    app
        .route('/books/:bookID')
        .get(bookBuilder.read_a_book)
        .put(bookBuilder.update_a_book)
        .delete(bookBuilder.delete_a_book);

    app
        .route('/carts/:userID')
        .get(cartBuilder.list_all_books_in_cart)
        .delete(cartBuilder.delete_from_cart)
        
    app
        .route('/carts')
        .put(cartBuilder.add_to_cart)
    
}