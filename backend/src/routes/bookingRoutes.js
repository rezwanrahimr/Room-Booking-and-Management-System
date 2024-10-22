const express = require('express');
const { createBooking, getUserBookings, getBookingByRoomId, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/', protect, getUserBookings);
router.get('/room/:id', protect, getBookingByRoomId);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
