const express = require('express');
const {addUser, getAllUsers, getUser, updateUser, deleteUser} = require("../controllers/userController");
const {addEvent, getAllEvents, getEvent, updateEvent, deleteEvent} = require('../controllers/eventController');

const router = express.Router();

router.post('/add', addEvent);
router.get('/get', getAllEvents);
router.get('/get/:eventId', getEvent);
router.put('/update/:eventId', updateEvent);
router.delete('/delete/:eventId', deleteEvent);

module.exports = {
    routes: router,
};