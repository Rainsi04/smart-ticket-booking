const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    movieTitle: {
        type: String,
        required: true
    },
    cinemaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cinema',
        default: null
    },
    cinemaName: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    showtime: {
        type: String,
        required: true
    },
    seats: {
        type: [String],
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    bookingId: {
        type: String,
        unique: true
    },
    customerName: {
        type: String,
        default: 'Guest User'
    },
    customerEmail: {
        type: String,
        default: 'guest@example.com'
    },
    bookingDate: {
        type: Date,
        default: Date.now
    }
});

// Generate booking ID before saving
bookingSchema.pre('save', function(next) {
    if (!this.bookingId) {
        this.bookingId = 'BK-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);