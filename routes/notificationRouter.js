const express = require("express");
const {
    addNotification,
    getAllNotifications,
    getNotification,
    updateNotification,
    deleteNotification,
} = require("../controllers/notificationController");

const router = express.Router();

router.post("/", addNotification);
router.get("/", getAllNotifications);
router.get("/:notificationId", getNotification);
router.put("/:notificationId", updateNotification);
router.delete("/:notificationId", deleteNotification);

module.exports = {
    routes: router,
};