const Cinema = require('../models/Cinema');

// @desc    Get list of cities with active cinemas
// @route   GET /api/cinemas/cities
const getCities = async (req, res) => {
    try {
        const cities = await Cinema.distinct('city', { isActive: true });
        cities.sort();

        res.status(200).json({
            success: true,
            count: cities.length,
            data: cities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching cities',
            error: error.message
        });
    }
};

// @desc    Get cinemas (optional ?city=Mumbai filter)
// @route   GET /api/cinemas
const getCinemas = async (req, res) => {
    try {
        const filter = { isActive: true };
        if (req.query.city) {
            filter.city = req.query.city;
        }

        const cinemas = await Cinema.find(filter).sort({ city: 1, name: 1 });

        res.status(200).json({
            success: true,
            count: cinemas.length,
            data: cinemas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching cinemas',
            error: error.message
        });
    }
};

// @desc    Get single cinema
// @route   GET /api/cinemas/:id
const getCinemaById = async (req, res) => {
    try {
        const cinema = await Cinema.findById(req.params.id);

        if (!cinema || !cinema.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Cinema not found'
            });
        }

        res.status(200).json({
            success: true,
            data: cinema
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching cinema',
            error: error.message
        });
    }
};

module.exports = { getCities, getCinemas, getCinemaById };
