const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const Cinema = require('../models/Cinema');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res) => {
    try {
        const { movieId, cinemaId, showtime, seats, customerName, customerEmail } = req.body;

        if (!cinemaId) {
            return res.status(400).json({
                success: false,
                message: 'Please select a city and cinema'
            });
        }
        
        // Get movie details
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        const cinema = await Cinema.findById(cinemaId);
        if (!cinema || !cinema.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Cinema not found'
            });
        }
        
        // Calculate total
        const total = seats.length * movie.price;
        
        const bookingPayload = {
            movieId,
            movieTitle: movie.title,
            cinemaId: cinema._id,
            cinemaName: cinema.name,
            city: cinema.city,
            showtime,
            seats,
            total,
            customerName: customerName || 'Guest User',
            customerEmail: customerEmail || 'guest@example.com'
        };

        if (req.user) {
            bookingPayload.userId = req.user._id;
            bookingPayload.customerName = req.user.name;
            bookingPayload.customerEmail = req.user.email;
        }
        
        // Create booking
        const booking = await Booking.create(bookingPayload);
        
        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ bookingDate: -1 });
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Public
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching booking',
            error: error.message
        });
    }
};

// @desc    Get bookings for logged-in user
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .sort({ bookingDate: -1 })
            .populate('movieId', 'title genre poster duration')
            .populate('cinemaId', 'name city address');

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching your bookings',
            error: error.message
        });
    }
};

module.exports = {
    createBooking,
    getBookings,
    getBookingById,
    getMyBookings
};