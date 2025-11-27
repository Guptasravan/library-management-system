const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, enum: ['Book', 'Movie'], default: 'Book' },
    serialNo: { type: String, required: true, unique: true },
    status: { type: String, enum: ['available', 'issued'], default: 'available' },
    addedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);
