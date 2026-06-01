const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Cinema name is required'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    address: {
        type: String,
        required: true
    },
    screens: {
        type: Number,
        default: 4,
        min: 1
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

cinemaSchema.index({ city: 1, name: 1 });

module.exports = mongoose.model('Cinema', cinemaSchema);
