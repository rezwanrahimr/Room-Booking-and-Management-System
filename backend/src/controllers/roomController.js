const multer = require('multer');
const Room = require("../models/roomModel");

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Middleware to handle file uploads
const uploadRoomPicture = upload.single('picture');

// create a room
const createRoom = async (req, res) => {
    try {
        const { title, rent } = req.body;

        const facilities = req.body.facilities.split(',').map((facility) => facility.trim());

        // Convert the uploaded file to base64 for storage
        const picture = req.file ? req.file.buffer.toString('base64') : null;

        const newRoom = new Room({
            title,
            rent,
            facilities,
            picture,
        });

        await newRoom.save();
        res.status(201).json({ message: 'Room created successfully', room: newRoom });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//fetch all rooms
const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// fetch by id
const getRoomsById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//update a room
const updateRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) return res.status(404).json({ message: "Room not found" });

        // Update room fields
        Object.assign(room, req.body);

        // If there's a new picture uploaded, update it
        if (req.file) {
            room.picture = req.file.buffer.toString('base64'); // Convert to base64 if a new file is uploaded
        }

        await room.save();
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//delete a room
const deleteRoom = async (req, res) => {
    try {
        const roomId = req.params.id;

        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        await room.deleteOne();

        res.json({ message: "Room removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    uploadRoomPicture,
    createRoom,
    getRooms,
    getRoomsById,
    updateRoom,
    deleteRoom,
};
