import multer from 'multer';
const Room = require("../models/roomModel");

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

const createRoom = async (req, res) => {
    const { title, rent, facilities } = req.body;
    const picture = req.file.path;

    const room = new Room({ title, rent, facilities, picture });
    await room.save();

    res.status(201).json(room);
};


const uploadRoomPicture = upload.single('picture');

// Get All Rooms
const getRooms = async (req, res) => {
    const rooms = await Room.find();
    res.json(rooms);
};

// Update Room
const updateRoom = async (req, res) => {
    const room = await Room.findById(req.params.id);

    if (!room) return res.status(404).json({ message: "Room not found" });

    Object.assign(room, req.body);
    await room.save();

    res.json(room);
};

// Delete Room
const deleteRoom = async (req, res) => {
    const room = await Room.findById(req.params.id);

    if (!room) return res.status(404).json({ message: "Room not found" });

    await room.remove();
    res.json({ message: "Room removed" });
};

module.exports = { createRoom, uploadRoomPicture, getRooms, updateRoom, deleteRoom };
