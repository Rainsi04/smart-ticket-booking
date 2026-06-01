const express = require('express');
const router = express.Router();
const { getCities, getCinemas, getCinemaById } = require('../controllers/cinemaController');

router.get('/cities', getCities);
router.get('/', getCinemas);
router.get('/:id', getCinemaById);

module.exports = router;
