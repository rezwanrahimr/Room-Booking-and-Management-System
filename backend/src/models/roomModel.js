const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    title: { type: String, required: true },
    rent: { type: Number, required: true },
    facilities: [String],
    picture: String,
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
