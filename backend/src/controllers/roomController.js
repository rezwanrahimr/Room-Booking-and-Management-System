const multer = require('multer');
const Room = require("../models/roomModel");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to handle file uploads
const uploadRoomPicture = upload.single('picture');

// create a room
const createRoom = async (req, res) => {
    try {
        const { title, rent } = req.body;

        const facilities = req.body.facilities.split(',').map((facility) => facility.trim());

        // Convert the uploaded file to base64 
        const picture = req.file ? req.file.buffer.toString('base64') : null;

        const newRoom = new Room({
            title,
            rent,
            facilities,
            picture,
        });

        await newRoom.save();
        res.status(201).json({
            status: true,
            message: 'Room created successfully',
            data: newRoom
        });
    } catch (error) {

        res.status(500).json({
            status: true,
            message: error.message,
            data: null
        });
    }
};


// fetch all rooms
const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// fetch by id
const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) return res.status(404).json({ message: "Room not found" });

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

        Object.assign(room, req.body);

        if (req.file) {
            room.picture = req.file.buffer.toString('base64'); // Convert to base64 if a new file is uploaded
        }

        await room.save();
        res.status(201).json({
            status: true,
            message: 'Room update successfully',
            data: room
        });
    } catch (error) {
        res.status(500).json({
            status: true,
            message: error.message,
            data: null
        });
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
        res.status(200).json({
            status: true,
            message: 'Room removed successfully',
            data: null
        });
    } catch (error) {
        res.status(500).json({
            status: true,
            message: error.message,
            data: null
        });
    }
};


module.exports = {
    uploadRoomPicture,
    createRoom,
    getRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
};
