const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    author: String,
    status: { type: String, enum: ['PUBLISHED', 'SOLD'], default: 'PUBLISHED' },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    soldAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    emailSent: { type: Boolean, default: false }
});

module.exports = mongoose.model('Book', bookSchema);
