const Book = require('../models/book.model');

exports.createBook = async (req, res) => {
    try {
        const { title, description, price, author } = req.body;
        const book = new Book({
            title,
            description,
            price,
            author,
            ownerId: req.user._id,
        });
        await book.save();
        res.status(201).json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBooks = async (req, res) => {
    try {
        const { title, author, page = 1, limit = 10 } = req.query;

        const filter = { status: 'PUBLISHED' };
        if (title) filter.title = { $regex: title, $options: 'i' };
        if (author) filter.author = { $regex: author, $options: 'i' };

        const books = await Book.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Book.countDocuments(filter);

        res.json({
            total,
            page: Number(page),
            limit: Number(limit),
            books
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        if (!book.ownerId.equals(req.user._id)) {
            return res.status(403).json({ message: 'Forbidden: not the owner' });
        }

        if (book.status === 'SOLD') {
            return res.status(400).json({ message: 'Cannot edit a sold book' });
        }

        const { title, description, price, author } = req.body;
        book.title = title ?? book.title;
        book.description = description ?? book.description;
        book.price = price ?? book.price;
        book.author = author ?? book.author;

        await book.save();
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.buyBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        if (book.ownerId.equals(req.user._id)) return res.status(400).json({ message: 'Cannot buy your own book' });
        if (book.status === 'SOLD') return res.status(400).json({ message: 'Book already sold' });

        book.status = 'SOLD';
        book.soldAt = new Date();
        await book.save();

        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};