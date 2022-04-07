const firebase = require("../utils/firedb");
const firestore = require("firebase/firestore/lite");
const Event = require("../models/event");
const logger = require("../utils/logger");

const addEvent = async (req, res, next) => {
  try {
    const data = req.body;
    data.eventDate = firestore.Timestamp.fromDate(new Date(data.eventDate));
    const db = firestore.getFirestore(firebase);
    data.eventOrganizers = firestore.doc(db, 'groups/'+data.eventOrganizers)
    const participants = data.eventParticipants;
    const temp = [];
    for (let i = 0; i < participants.length; i++) {
      temp.push(firestore.doc(db, 'users/'+participants[i]))
    }
    data.eventParticipants = temp;
    const eventsDB = firestore.doc(db, "events", data.eventId);
    await firestore.setDoc(eventsDB, data);
    res.status(201).json({
      message: "Event added successfully!",
    });
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({
      message: error.message,
    });
  }
};

const getAllEvents = async (req, res, next) => {
  try {
    const allEvents = await getAllEventsFromDB();

    if (allEvents.empty) {
      res.status(404).json({
        message: "No event record found.",
      });
    } else {
      res.status(200).json({
        data: allEvents,
      });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

const getEvent = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const db = firestore.getFirestore(firebase);
    const event = await firestore.doc(db, "events", eventId);
    const data = await firestore.getDoc(event);

    if (data.empty) {
      res.status(404).json({
        message: "Event with given ID cannot be found.",
      });
    } else {
      res.status(200).json({
        data: data.data(),
      });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const data = req.body;
    data.eventDate = firestore.Timestamp.fromDate(new Date(data.eventDate));
    const db = firestore.getFirestore(firebase);
    data.eventOrganizers = firestore.doc(db, 'groups/'+data.eventOrganizers)
    const participants = data.eventParticipants;
    const temp = [];
    for (let i = 0; i < participants.length; i++) {
      temp.push(firestore.doc(db, 'users/'+participants[i]))
    }
    data.eventParticipants = temp;
    const event = await firestore.doc(db, "events", eventId);
    await firestore.updateDoc(event, data);

    res.status(200).json({
      message: "Event record has updated successfully!",
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const db = firestore.getFirestore(firebase);
    const event = await firestore.doc(db, "events", eventId);
    const eventCheck = await firestore.getDoc(event);

    if (eventCheck.exists()) {
      await firestore.deleteDoc(event);
      res.status(200).json({
        message: "Event record has been deleted successfully!",
      });
    } else {
      let errorMessage = "Event cannot found.";
      logger.error(errorMessage);
      res.status(500).json({
        message: errorMessage,
      });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

const getEventByOrganizer = async (req, res, next) => {
  try {
    const organizationId = req.params.organizationId;
    const allEvents = await getAllEventsFromDB();
    let organizationEvents = [];
    for (let i = 0; i < allEvents.length; i++) {
      const event = allEvents[i];
      const temp = event.eventOrganizers.filter(
        (x) => x._key.path.segments[6] === organizationId
      );
      if (temp[0] !== undefined) {
        organizationEvents.push(event);
      }
    }
    res.status(200).json(organizationEvents);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

const getEventByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const allEvents = await getAllEventsFromDB();
    let userEvents = [];
    for (let i = 0; i < allEvents.length; i++) {
      const event = allEvents[i];
      const temp = event.eventParticipants.filter(
        (x) => x._key.path.segments[6] === userId
      );
      if (temp[0] !== undefined) {
        userEvents.push(event);
      }
    }

    res.status(200).json(userEvents);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllEventsFromDB = async () => {
  try {
    const allEvents = [];

    const db = firestore.getFirestore(firebase);
    const eventsDB = await firestore.collection(db, "events");
    const data = await firestore.getDocs(eventsDB);

    if (!data.empty) {
      data.forEach((doc) => {
        const event = new Event(
          doc.id,
          doc.data().eventCapacity,
          doc.data().eventDate,
          doc.data().eventDescription,
          doc.data().eventDuration,
          doc.data().eventId,
          doc.data().eventName,
          doc.data().eventOrganizers,
          doc.data().eventParticipants,
          doc.data().eventPlace
        );
        allEvents.push(event);
      });
    }
    return allEvents;
  } catch (error) {
    logger.error(error.message);
    return [];
  }
};

module.exports = {
    addEvent,
    getAllEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    getEventByOrganizer,
    getEventByUser,
};
