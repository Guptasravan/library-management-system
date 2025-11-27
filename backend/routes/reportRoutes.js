const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const Membership = require('../models/Membership');
const Book = require('../models/Book');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get Active Issues
// @route   GET /api/reports/active-issues
// @access  Private
router.get('/active-issues', protect, async (req, res) => {
    try {
        const issues = await Issue.find({ status: 'active' })
            .populate('book')
            .populate('member');
        res.json(issues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get Overdue Returns
// @route   GET /api/reports/overdue
// @access  Private
router.get('/overdue', protect, async (req, res) => {
    try {
        const today = new Date();
        const issues = await Issue.find({
            status: 'active',
            returnDate: { $lt: today }
        })
            .populate('book')
            .populate('member');
        res.json(issues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Master List of Memberships
// @route   GET /api/reports/members
// @access  Private
router.get('/members', protect, async (req, res) => {
    try {
        const members = await Membership.find();
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Master List of Books/Movies
// @route   GET /api/reports/books
// @access  Private
router.get('/books', protect, async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
