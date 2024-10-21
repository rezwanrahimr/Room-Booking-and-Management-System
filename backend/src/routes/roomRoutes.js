const express = require("express");
const { createRoom, uploadRoomPicture, updateRoom, deleteRoom, getRooms,getRoomById } = require("../controllers/roomController");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(getRooms).post(protect, admin, uploadRoomPicture, createRoom);
router.route("/:id").put(protect, admin, uploadRoomPicture, updateRoom).get(protect,getRoomById).delete(protect, admin, deleteRoom);

module.exports = router;
