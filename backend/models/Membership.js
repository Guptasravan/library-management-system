const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
    memberId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    aadhaarCard: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    planType: { type: String, enum: ['6 months', '1 year', '2 years'], required: true },
    status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' }
});

module.exports = mongoose.model('Membership', membershipSchema);
