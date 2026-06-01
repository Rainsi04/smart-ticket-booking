const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Movie title is required'],
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    genre: {
        type: String,
        required: true
    },
    synopsis: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    poster: {
        type: String,
        required: true
    },
    showtimes: {
        type: [String],
        default: ['12:00 PM', '3:30 PM', '7:00 PM', '10:30 PM']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Movie', movieSchema);