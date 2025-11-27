const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Issue = require('../models/Issue');
const Membership = require('../models/Membership');
const { protect } = require('../middleware/authMiddleware');

// @desc    Check book availability
// @route   GET /api/transactions/availability
// @access  Private
router.get('/availability', protect, async (req, res) => {
    const { title, author, category } = req.query;
    const query = { status: 'available' };

    if (title) query.title = { $regex: title, $options: 'i' };
    if (author) query.author = { $regex: author, $options: 'i' };
    if (category) query.category = category;

    try {
        const books = await Book.find(query);
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Issue a book
// @route   POST /api/transactions/issue
// @access  Private
router.post('/issue', protect, async (req, res) => {
    const { bookId, memberId, issueDate, returnDate, remarks } = req.body;

    try {
        // Check if book is available
        const book = await Book.findById(bookId);
        if (!book || book.status !== 'available') {
            return res.status(400).json({ message: 'Book is not available' });
        }

        // Check if member exists
        const member = await Membership.findOne({ memberId }); // Assuming memberId is the string ID
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Create Issue
        const issue = await Issue.create({
            issueId: 'ISS' + Date.now(), // Simple ID generation
            book: book._id,
            member: member._id,
            issueDate,
            returnDate,
            remarks,
            status: 'active'
        });

        // Update Book status
        book.status = 'issued';
        await book.save();

        res.status(201).json(issue);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Return a book (Calculate Fine)
// @route   POST /api/transactions/return
// @access  Private
router.post('/return', protect, async (req, res) => {
    const { bookId, memberId, returnDate } = req.body; // returnDate here is the ACTUAL return date

    try {
        // Find active issue
        // We need to find the issue by book and member (or just book if we trust it's unique active issue)
        // But let's use bookId and memberId for safety
        // First find the book and member ObjectIds
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const member = await Membership.findOne({ memberId });
        if (!member) return res.status(404).json({ message: 'Member not found' });

        const issue = await Issue.findOne({
            book: book._id,
            member: member._id,
            status: 'active'
        });

        if (!issue) {
            return res.status(404).json({ message: 'No active issue found for this book and member' });
        }

        // Calculate Fine
        const expectedReturn = new Date(issue.returnDate);
        const actualReturn = new Date(returnDate || Date.now());

        let fine = 0;
        if (actualReturn > expectedReturn) {
            const diffTime = Math.abs(actualReturn - expectedReturn);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            fine = diffDays * 10; // 10 units per day
        }

        res.json({
            issueId: issue._id,
            fineAmount: fine,
            daysOverdue: fine / 10,
            actualReturnDate: actualReturn
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Confirm Return / Pay Fine
// @route   POST /api/transactions/pay-fine
// @access  Private
router.post('/pay-fine', protect, async (req, res) => {
    const { issueId, fineAmount, finePaid, remarks, actualReturnDate } = req.body;

    try {
        const issue = await Issue.findById(issueId);
        if (!issue) return res.status(404).json({ message: 'Issue not found' });

        if (fineAmount > 0 && !finePaid) {
            return res.status(400).json({ message: 'Fine must be paid' });
        }

        // Update Issue
        issue.actualReturnDate = actualReturnDate;
        issue.fineAmount = fineAmount;
        issue.finePaid = finePaid;
        issue.remarks = remarks || issue.remarks;
        issue.status = 'returned';
        await issue.save();

        // Update Book status
        const book = await Book.findById(issue.book);
        book.status = 'available';
        await book.save();

        res.json(issue);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
