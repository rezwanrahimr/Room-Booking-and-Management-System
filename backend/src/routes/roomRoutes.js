const express = require("express");
<<<<<<< HEAD
const { createRoom, uploadRoomPicture, updateRoom, deleteRoom, getRooms, getRoomsById } = require("../controllers/roomController");
=======
const { createRoom, uploadRoomPicture, updateRoom, deleteRoom, getRooms,getRoomById } = require("../controllers/roomController");
>>>>>>> ee3a1e947e1950a6e86ab8d6faafcf3aa2d7a6e2
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(getRooms).post(protect, admin, uploadRoomPicture, createRoom);
<<<<<<< HEAD
router.route("/:id").put(protect, admin, uploadRoomPicture, updateRoom).get(protect, getRoomsById).delete(protect, admin, deleteRoom);
=======
router.route("/:id").put(protect, admin, uploadRoomPicture, updateRoom).get(getRoomById).delete(protect, admin, deleteRoom);
>>>>>>> ee3a1e947e1950a6e86ab8d6faafcf3aa2d7a6e2

module.exports = router;
