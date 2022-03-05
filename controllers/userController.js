const firebase = require('../firedb');
const firestore  = require('firebase/firestore/lite');
const User = require('../models/user');

const addUser = async (req, res, next) => {
    try {
        const data = req.body;
        const db = firestore.getFirestore(firebase);
        const usersDB = firestore.collection(db, 'users');
        await firestore.addDoc(usersDB, data);
        res.send('User added successfully!');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllUsers = async(req, res, next) => {
    try {
        const allUsers = [];

        const db = firestore.getFirestore(firebase);
        const usersDB = await firestore.collection(db, 'users');
        const data = await firestore.getDocs(usersDB);

        if(data.empty)
            res.status(404).send("No user record found.");
        else {
            data.forEach(doc => {
                const user = new User(
                    doc.id,
                    doc.data().userColleague,
                    doc.data().userId,
                    doc.data().userLastname,
                    doc.data().userName,
                    doc.data().userOtherMail,
                    doc.data().userPassword,
                    doc.data().userPhoneNumber,
                    doc.data().userSchoolMail,
                );
                allUsers.push(user);
            });
            res.send(allUsers);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const db = firestore.getFirestore(firebase);
        const user = await firestore.doc(db, 'users', userId);
        const data = await firestore.getDoc(user);

        if(data.empty)
            res.status(404).send("User with given ID cannot be found.");
        else
            res.send(data.data());
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const data = req.body;
        const db = firestore.getFirestore(firebase);
        const user = await firestore.doc(db, 'users', userId);
        await firestore.updateDoc(user, data);

        res.send('User record has updated successfully!');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const db = firestore.getFirestore(firebase);
        const user = await firestore.doc(db, 'users', userId);
        await firestore.deleteDoc(user);

        res.send('User record has been deleted successfully!');
    } catch (error) {
        res.send(400).send(error.message);
    }
}

module.exports = {
    addUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
}