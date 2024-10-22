const Booking = require('../models/bookingModel');
const Room = require('../models/roomModel');

// Create a new booking
const createBooking = async (req, res) => {
    const { roomId, fromDate, toDate, price } = req.body;

    try {
        const existingBooking = await Booking.findOne({
            roomId: roomId, // Ensure you are checking for the same room
            $or: [
                {
                    fromDate: { $lte: toDate },
                    toDate: { $gte: fromDate }
                }
            ],
            status: 'booked'
        });

        if (existingBooking) {
            const error = new Error('Room is already booked for the selected dates');
            error.statusCode = 400;
            throw error;
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
        res.status(error.statusCode || 500).json({
            status: false,
            message: error.message || 'Server error',
            data: null
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

// get booking by id
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('roomId');
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get bookings for a user
const getBookingByRoomId = async (req, res) => {
    try {
        const currentDate = new Date();
        const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

        const bookings = await Booking.find({
            roomId: req.params.id,
            fromDate: { $lte: endOfDay },
            toDate: { $gte: startOfDay }
        }).populate('roomId');


        console.log(bookings);

        if (bookings.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'No bookings available for the current date',
                data: null
            });
        }

        res.status(200).json({
            status: true,
            message: 'Bookings retrieved successfully',
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Server error',
            data: error.message
        });
    }
};


// get all bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('roomId').populate('userId');
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

module.exports = { createBooking, getUserBookings, getBookingById, getBookingByRoomId, getAllBookings, cancelBooking };
