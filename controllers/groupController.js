const firebase = require("../utils/firedb");
const firestore = require("firebase/firestore/lite");
const Group = require("../models/group");
const logger =require("../utils/logger")

const addGroup = async (req, res, next) => {
    try {
        const data = req.body;
        const db = firestore.getFirestore(firebase);
        const groupsDB = firestore.doc(db, "groups", data.groupId);
        await firestore.setDoc(groupsDB, data);
        res.status(201).json({
            message: "Group added successfully!",
        });
    } catch (error) {
        logger.error(error.message);
        res.status(400).json({
            message: error.message,
        });
    }
};

const getAllGroups = async (req, res, next) => {
    try {
        const allGroups = await getAllGroupsFromDB();

        if (allGroups.empty) {
            res.status(404).json({
                message: "No Group record found.",
            });
        } else {
            res.status(200).json({
                data: allGroups,
            });
        }
    } catch (error) {
        logger.error(error.message);
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
        logger.error(error.message);
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
        logger.error(error.message);
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
        logger.error(error.message);
        res.status(500).json({
            message: error.message,
        });
    }
};

const getGroupByAdmin = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const allGroups = await getAllGroupsFromDB();
        const adminUserGroups = allGroups.filter(
            (x) => x.groupAdmin._key.path.segments[6] === userId
        );
        res.status(200).json(adminUserGroups);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({
            message: error.message
        })
    }
}

const getGroupByAssistant = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const allGroups = await getAllGroupsFromDB();
        let userGroups = [];
        for (let i = 0; i < allGroups.length; i++) {
            const group = allGroups[i];
            const temp = group.groupAssistants.filter(
                (x) => x._key.path.segments[6] === userId
            );
            if (temp[0] !== undefined)
                userGroups.push(group);
        }
        res.status(200).json(userGroups);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({
            message: error.message
        })
    }
}

const getGroupByMember = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const allGroups = await getAllGroupsFromDB();
        let userGroups = [];
        for (let i = 0; i < allGroups.length; i++) {
            const group = allGroups[i];
            const temp = group.groupMembers.filter(
                (x) => x._key.path.segments[6] === userId
            );
            if (temp[0] !== undefined)
                userGroups.push(group);
        }
        res.status(200).json(userGroups);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({
            message: error.message
        })
    }
}

const getGroupByPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const allGroups = await getAllGroupsFromDB();
        let postGroup = {};
        for (let i = 0; i < allGroups.length; i++) {
            const group = allGroups[i];
            const temp = group.groupPosts.filter(
                (x) => x._key.path.segments[6] === postId
            );
            if (temp[0] !== undefined) {
                postGroup = group;
                break;
            }
        }
        res.status(200).json(postGroup);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({
            message: error.message
        })
    }
}

const getAllGroupsFromDB = async () => {
    try {
        const allGroups = [];

        const db = firestore.getFirestore(firebase);
        const groupsDB = await firestore.collection(db, "groups");
        const data = await firestore.getDocs(groupsDB);

        if (!data.empty) {
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
                    doc.data().groupPrivacyPermissions);
                allGroups.push(group);
            })
        }
        return allGroups;
    } catch (error) {
        logger.error(error.message);
        return [];
    }
}
module.exports = {
    addGroup,
    getAllGroups,
    getGroup,
    updateGroup,
    deleteGroup,
    getGroupByAdmin,
    getGroupByAssistant,
    getGroupByMember,
    getGroupByPost
};
