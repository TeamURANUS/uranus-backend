const express = require('express');
const {addUser, getAllUsers, getUser, updateUser, deleteUser} = require("../controllers/userController");
const {addEvent, getAllEvents, getEvent, updateEvent, deleteEvent} = require('../controllers/eventController');

const router = express.Router();

router.post('/events', addEvent);
router.get('/events', getAllEvents);
router.get('/events/:eventId', getEvent);
router.put('/events/:eventId', updateEvent);
router.delete('/events/:eventId', deleteEvent);

module.exports = {
    routes: router,
};