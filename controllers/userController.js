const firebase = require("../utils/firedb");
const firestore = require("firebase/firestore/lite");
const User = require("../models/user");
const logger = require("../utils/logger");

const addUser = async (req, res, next) => {
    try {
        const data = req.body;
        const db = firestore.getFirestore(firebase);
        const usersDB = firestore.doc(db, "users", data.userId);
        await firestore.setDoc(usersDB, data);
        res.status(201).json({
            message: "User added successfully.",
        });
    } catch (error) {
        logger.error(error.message);
        res.status(400).json({
            message: error.message,
        });
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await getAllUsersFromDB();

        if (allUsers.empty) {
            res.status(404).json({
                message: "No user record found.",
            });
        } else {
            res.status(200).json({
                data: allUsers,
            });
        }
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({
            message: error.message,
        });
    }
};

const getUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const allUsers = await getAllUsersFromDB();
        const user = allUsers.filter(
            (x) => x.id === userId
        )
        res.status(200).json(user);

    } catch (error) {
        logger.error(error.message);
        res.status(500).json({
            message: error.message,
        });
    }
};

const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const data = req.body;
        const db = firestore.getFirestore(firebase);
        const user = await firestore.doc(db, "users", userId);
        await firestore.updateDoc(user, data);

        res.status(200).json({
            message: "User record has updated successfully!",
        });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const db = firestore.getFirestore(firebase);
        const user = firestore.doc(db, "users", userId);
        const userCheck = await firestore.getDoc(user);

        if (userCheck.exists()) {
            await firestore.deleteDoc(user);
            res.status(200).json({
                message: "User record has been deleted successfully!",
            });
        } else {
            let errorMessage = "User cannot found.";
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

const getUserByEmail = async (req, res, next) => {
    try {
        const userEmail = req.body.email;
        const allUsers = await getAllUsersFromDB();
        const user = allUsers.filter(
            (x) => x.userSchoolMail === userEmail || x.userOtherMail === userEmail
        )
        res.status(200).json(user);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({
            message: error.message,
        });
    }

}

const getAllUsersFromDB = async () => {
    try {
        const allUsers = [];

        const db = firestore.getFirestore(firebase);
        const usersDB = await firestore.collection(db, "users");
        const data = await firestore.getDocs(usersDB);

        if (!data.empty) {
            data.forEach((doc) => {
                const user = new User(
                    doc.id,
                    doc.data().userColleague,
                    doc.data().userId,
                    doc.data().userLastname,
                    doc.data().userName,
                    doc.data().userOtherMail,
                    doc.data().userPassword,
                    doc.data().userPhoneNumber,
                    doc.data().userSchoolMail
                );
                allUsers.push(user);
            });
        }
        return allUsers;
    } catch (error) {
        logger.error(error.message);
        return [];
    }
}

module.exports = {
    addUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    getUserByEmail
};
