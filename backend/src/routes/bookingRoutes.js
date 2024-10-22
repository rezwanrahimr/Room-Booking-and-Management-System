const express = require('express');
const { createBooking, getUserBookings, getBookingById, getBookingByRoomId, getAllBookings, updateBooking, cancelBooking } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/', protect, getUserBookings);
router.get('/admin', protect, admin, getAllBookings);
router.get('/room/:id', protect, getBookingByRoomId);
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, updateBooking);
router.put('/cancel/:id', protect, cancelBooking);

module.exports = router;
