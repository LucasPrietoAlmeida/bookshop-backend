const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, bookController.createBook);
router.get('/', bookController.getBooks);
router.put('/:id', authMiddleware, bookController.updateBook);
router.post('/:id/buy', authMiddleware, bookController.buyBook);
router.get('/me/books', authMiddleware, bookController.getMyBooks);

module.exports = router;
