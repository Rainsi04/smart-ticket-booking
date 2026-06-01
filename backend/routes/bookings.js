const express = require('express');
const router = express.Router();
const {
    createBooking,
    getBookings,
    getBookingById,
    getMyBookings
} = require('../controllers/bookingController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/my', protect, getMyBookings);
router.post('/', optionalAuth, createBooking);
router.get('/', getBookings);
router.get('/:id', getBookingById);

module.exports = router;