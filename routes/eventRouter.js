const express = require('express');
const {
    addUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
} = require("../controllers/userController");
const {
    addEvent,
    getAllEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    getEventByOrganizer,
    getEventByUser
} = require('../controllers/eventController');

const router = express.Router();

router.post('/', addEvent);
router.get('/', getAllEvents);
router.get('/:eventId', getEvent);
router.put('/:eventId', updateEvent);
router.delete('/:eventId', deleteEvent);
router.get('/organizationEventLog/:organizationId', getEventByOrganizer)
router.get('/userEventLog/:userId', getEventByUser)

module.exports = {
    routes: router,
};
