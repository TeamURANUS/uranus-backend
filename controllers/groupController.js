const firebase = require("../firedb");
const firestore = require("firebase/firestore/lite");
const Group = require("../models/group");

const addGroup = async (req, res, next) => {
    try {
        const data = req.body;
        const db = firestore.getFirestore(firebase);
        const groupsDB = firestore.collection(db, "groups");
        await firestore.addDoc(groupsDB, data);
        res.status(201).json({
            message: "Group added successfully!",
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

const getAllGroups = async (req, res, next) => {
    try {
        const allGroups = [];

        const db = firestore.getFirestore(firebase);
        const groupsDB = await firestore.collection(db, "groups");
        const data = await firestore.getDocs(groupsDB);

        if (data.empty) {
            res.status(404).json({
                messsage: "No Group record found.",
            });
        } else {
            data.forEach((doc) => {
                const group = new Group(
                    doc.id,
                    doc.data().groupAdmin,
                    doc.data().groupAssistants,
                    doc.data().groupDescription,
                    doc.data().groupId,
                    doc.data().groupIsCommunity,
                    doc.data().groupMembers,
                    doc.data().groupName,
                    doc.data().groupPostPermissions,
                    doc.data().groupPosts,
                    doc.data().groupPrivacyPermissions
                );
                allGroups.push(group);
            });
            res.status(200).json({
                data: allGroups,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getGroup = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const db = firestore.getFirestore(firebase);
        const group = await firestore.doc(db, "groups", groupId);
        const data = await firestore.getDoc(group);

        if (data.empty) {
            res.status(404).json({
                message: "Group with given ID cannot be found.",
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

const updateGroup = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const data = req.body;
        const db = firestore.getFirestore(firebase);
        const group = await firestore.doc(db, "groups", groupId);
        await firestore.updateDoc(group, data);

        res.status(200).json({
            message: "Group record has updated successfully!",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteGroup = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const db = firestore.getFirestore(firebase);
        const group = await firestore.doc(db, "groups", groupId);
        await firestore.deleteDoc(group);

        res.status(200).json({
            message: "Group record has been deleted successfully!",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    addGroup,
    getAllGroups,
    getGroup,
    updateGroup,
    deleteGroup,
};