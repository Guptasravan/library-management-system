const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    issueId: { type: String, required: true, unique: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership', required: true },
    issueDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    actualReturnDate: { type: Date },
    fineAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'returned'], default: 'active' },
    remarks: { type: String },
    finePaid: { type: Boolean, default: false }
});

module.exports = mongoose.model('Issue', issueSchema);
