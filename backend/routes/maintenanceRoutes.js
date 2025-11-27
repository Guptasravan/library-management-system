const express = require('express');
const router = express.Router();
const Membership = require('../models/Membership');
const Book = require('../models/Book');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

// --- Memberships ---

// @desc    Get all memberships
// @route   GET /api/maintenance/memberships
// @access  Private/Admin
router.get('/memberships', protect, admin, async (req, res) => {
    try {
        const memberships = await Membership.find();
        res.json(memberships);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add membership
// @route   POST /api/maintenance/memberships
// @access  Private/Admin
router.post('/memberships', protect, admin, async (req, res) => {
    try {
        const membership = await Membership.create(req.body);
        res.status(201).json(membership);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update membership
// @route   PUT /api/maintenance/memberships/:id
// @access  Private/Admin
router.put('/memberships/:id', protect, admin, async (req, res) => {
    try {
        const membership = await Membership.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!membership) {
            return res.status(404).json({ message: 'Membership not found' });
        }
        res.json(membership);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// --- Books ---

// @desc    Get all books
// @route   GET /api/maintenance/books
// @access  Private/Admin
router.get('/books', protect, admin, async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add book
// @route   POST /api/maintenance/books
// @access  Private/Admin
router.post('/books', protect, admin, async (req, res) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update book
// @route   PUT /api/maintenance/books/:id
// @access  Private/Admin
router.put('/books/:id', protect, admin, async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// --- Users ---

// @desc    Get all users
// @route   GET /api/maintenance/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add user (Admin can add users directly)
// @route   POST /api/maintenance/users
// @access  Private/Admin
router.post('/users', protect, admin, async (req, res) => {
    try {
        // Basic add user logic, similar to signup but by admin
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password (if provided, or set default)
        // For simplicity, assuming password is provided
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update user
// @route   PUT /api/maintenance/users/:id
// @access  Private/Admin
router.put('/users/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
