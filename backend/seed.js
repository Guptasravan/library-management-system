const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Book = require('./models/Book');
const Membership = require('./models/Membership');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const seedData = async () => {
    try {
        await User.deleteMany();
        await Book.deleteMany();
        await Membership.deleteMany();

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('admin123', salt);
        const userPassword = await bcrypt.hash('user123', salt);

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: adminPassword,
            role: 'admin'
        });

        const user = await User.create({
            name: 'Normal User',
            email: 'user@example.com',
            password: userPassword,
            role: 'user'
        });

        console.log('Users Created');

        // Create Books
        await Book.create([
            { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Book', serialNo: 'B001', status: 'available' },
            { title: 'Inception', author: 'Christopher Nolan', category: 'Movie', serialNo: 'M001', status: 'available' },
            { title: '1984', author: 'George Orwell', category: 'Book', serialNo: 'B002', status: 'available' },
        ]);

        console.log('Books Created');

        // Create Memberships
        await Membership.create([
            {
                memberId: 'MEM001',
                name: 'John Doe',
                email: 'john@example.com',
                contact: '1234567890',
                address: '123 Main St',
                aadhaarCard: '1234-5678-9012',
                startDate: new Date(),
                endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
                planType: '6 months',
                status: 'active'
            }
        ]);

        console.log('Memberships Created');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
