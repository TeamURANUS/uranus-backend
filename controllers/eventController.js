const firebase = require("../firedb");
const firestore = require("firebase/firestore/lite");
const Event = require("../models/event");

const addEvent = async (req, res, next) => {
  try {
    const data = req.body;
    const db = firestore.getFirestore(firebase);
    const eventsDB = firestore.collection(db, "events");
    await firestore.addDoc(eventsDB, data);
    res.status(201).json({
      message: "Event added successfully!",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getAllEvents = async (req, res, next) => {
  try {
    const allEvents = [];

    const db = firestore.getFirestore(firebase);
    const eventsDB = await firestore.collection(db, "events");
    const data = await firestore.getDocs(eventsDB);

    if (data.empty) {
      res.status(404).json({
        message: "No event record found.",
      });
    } else {
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
      res.status(200).json({
        data: allEvents,
      });
    }
  } catch (error) {
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
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const data = req.body;
    const db = firestore.getFirestore(firebase);
    const event = await firestore.doc(db, "events", eventId);
    await firestore.updateDoc(event, data);

    res.status(200).json({
      message: "Event record has updated successfully!",
    });
  } catch (error) {
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
    await firestore.deleteDoc(event);

    res.status(200).json({
      message: "Event record has been deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
};
