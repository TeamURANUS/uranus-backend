const firebase = require("../utils/firedb");
const firestore = require("firebase/firestore/lite");
const Notification = require("../models/notification");
const logger = require("../utils/logger");

const addNotification = async (req, res, next) => {
    try {
        const data = req.body;
        const db = firestore.getFirestore(firebase);
        const notificationsDB = firestore.doc(db, "notifications", data.notifId);
        await firestore.setDoc(notificationsDB, data);
        res.status(201).json({
            message: "Notification added successfully!",
        });
    } catch (error) {
        logger.error(error.message);
        res.status(400).json({
            message: error.message,
        });
    }
};

const getAllNotifications = async (req, res, next) => {
    try {
        const allNotifications = await getAllNotificationsFromDB();

        if (allNotifications.empty) {
            res.status(404).json({
                message: "No Notification record found.",
            });
        } else {
            res.status(200).json({
                data: allNotifications,
            });
        }
    } catch (error) {
        logger.error(error.message);
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
        logger.error(error.message);
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
        logger.error(error.message);
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
        const notifCheck = await firestore.getDoc(notification);

        if (notifCheck.exists()) {
            await firestore.deleteDoc(notification);
            res.status(200).json({
                message: "Notification record has been deleted successfully!",
            });
        } else {
            let errorMessage = "Notification cannot found.";
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

const getNotificationsByTargetGroup = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const allNotifications = await getAllNotificationsFromDB();
        let groupNotifications = [];
        for (let i = 0; i < allNotifications.length; i++) {
            const notification = allNotifications[i];
            const temp = notification.notifTargetGroup.filter(
                (x) => x._key.path.segments[6] === groupId
            );
            if (temp[0] !== undefined) {
                groupNotifications.push(notification);
            }
        }
        res.status(200).json(groupNotifications);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({
            message: error.message
        })
    }
};

const getAllNotificationsFromDB = async () => {
    try {
        const allNotifications = [];
        const db = firestore.getFirestore(firebase);
        const notificationsDB = await firestore.collection(db, "notifications");
        const data = await firestore.getDocs(notificationsDB);

        if (!data.empty) {
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
        }
        return allNotifications;

    } catch (error) {
        logger.error(error.message);
        return [];
    }

};

module.exports = {
    addNotification,
    getAllNotifications,
    getNotification,
    updateNotification,
    deleteNotification,
    getNotificationsByTargetGroup
};
