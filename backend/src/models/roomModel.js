const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  rent: { type: Number, required: true },
  facilities: { type: [String], required: true },
  picture: { type: String },
});

module.exports = mongoose.model("Room", roomSchema);
