const Booking = require('../models/bookingModel');
const Room = require('../models/roomModel');

// Create a new booking
const createBooking = async (req, res) => {
    const { roomId, fromDate, toDate, price } = req.body;

    try {
        const existingBooking = await Booking.findOne({
            $or: [
                { fromDate: { $lt: toDate }, toDate: { $gt: fromDate } },
                { fromDate: { $gte: fromDate, $lt: toDate } },
                { toDate: { $gt: fromDate, $lte: toDate } }
            ],
            status: 'booked'
        });

        if (existingBooking) {
            return res.status(400).json({
                status: false,
                message: 'Room is already booked for the selected dates',
                data: null
            });
        }

        const booking = new Booking({
            userId: req.user._id,
            roomId,
            fromDate,
            toDate,
            price,
        });

        await booking.save();

        res.status(201).json({
            status: true,
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Server error',
            data: error.message
        });
    }
};


// Get bookings for a user
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id }).populate('roomId');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Cancel booking
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({ message: 'Booking cancelled' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { createBooking, getUserBookings, cancelBooking };
