const firebase = require("../firedb");
const firestore = require("firebase/firestore/lite");
const Notification = require("../models/notification");

const addNotification = async (req, res, next) => {
    try {
        const data = req.body;
        const db = firestore.getFirestore(firebase);
        const notificationsDB = firestore.collection(db, "notifications");
        await firestore.addDoc(notificationsDB, data);
        res.status(201).json({
            message: "Notification added successfully!",
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

const getAllNotifications = async (req, res, next) => {
    try {
        const allNotifications = [];

        const db = firestore.getFirestore(firebase);
        const notificationsDB = await firestore.collection(db, "notifications");
        const data = await firestore.getDocs(notificationsDB);

        if (data.empty) {
            res.status(404).json({
                messsage: "No Notification record found.",
            });
        } else {
            data.forEach((doc) => {
                const notification = new Notification(
                    doc.id,
                    doc.data().notifContent,
                    doc.data().notifDate,
                    doc.data().notifId,
                    doc.data().notifTargetGroup,
                    doc.data().notifTitle,
                );
                allNotifications.push(notification);
            });
            res.status(200).json({
                data: allNotifications,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getNotification = async (req, res, next) => {
    try {
        const notificationId = req.params.notificationId;
        const db = firestore.getFirestore(firebase);
        const notification = await firestore.doc(db, "notifications", notificationId);
        const data = await firestore.getDoc(notification);

        if (data.empty) {
            res.status(404).json({
                message: "Notification with given ID cannot be found.",
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

const updateNotification = async (req, res, next) => {
    try {
        const notificationId = req.params.notificationId;
        const data = req.body;
        const db = firestore.getFirestore(firebase);
        const notification = await firestore.doc(db, "notifications", notificationId);
        await firestore.updateDoc(notification, data);

        res.status(200).json({
            message: "Notification record has updated successfully!",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteNotification = async (req, res, next) => {
    try {
        const notificationId = req.params.notificationId;
        const db = firestore.getFirestore(firebase);
        const notification = await firestore.doc(db, "notifications", notificationId);
        await firestore.deleteDoc(notification);

        res.status(200).json({
            message: "Notification record has been deleted successfully!",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    addNotification,
    getAllNotifications,
    getNotification,
    updateNotification,
    deleteNotification,
};