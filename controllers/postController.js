const firebase = require("../utils/firedb");
const firestore = require("firebase/firestore/lite");
const Post = require("../models/post");
const logger = require("../utils/logger");
const idGenerator = require("../utils/idGenerator");
const {getAllGroupsFromDB} = require("../controllers/groupController");
const {getAllUsersFromDB} = require("../controllers/userController");
const axios = require('axios');
const admin = require("../utils/firebaseService");
const {port, host} = require('../utils/config')

const addNotification = async (notification) => {
    try {
        const db = firestore.getFirestore(firebase);

        notification.notifId = idGenerator();

        const notificationsDB = firestore.doc(db, "notifications", notification.notifId);
        await firestore.setDoc(notificationsDB, notification);
    } catch (error) {
        logger.error(error.message);
    }
};

const getUserFcmTokens = async (groupMembers) => {
    var userIds = [];
    var tokens = []
    groupMembers.forEach((member) => {
        userIds.push(member._key.path.segments[6])
    });
    const allUsers = await getAllUsersFromDB();
    const users = allUsers.filter(
        (x) => userIds.includes(x.id)
    )
    for (let i = 0; i < users.length; i++) {
        if (users[i].fcmToken) {
            tokens.push(users[i].fcmToken)
        }
    }

    return tokens;
};

const sendGetRequest = async (url) => {
    try {
        const resp = await axios.get(url);
        return resp;
    } catch (err) {
        console.error(err);
    }
};

const sendNotification = async (tokens, title, body) => {
    await admin.messaging().sendMulticast({
        tokens: tokens,
        notification: {
            title: title,
            body: body,
        },
    });
};


const addPost = async (req, res, next) => {
    try {
        const data = req.body;
        data.postDate = firestore.Timestamp.fromDate(new Date(data.postDate));
        const db = firestore.getFirestore(firebase);

        const author = data.postAuthor;
        const group = data.postGroupId;

        data.postAuthor = firestore.doc(db, 'users/' + data.postAuthor);

        const comments = data.postComments;
        if (comments != null) {
            const tempComments = [];
            for (let i = 0; i < comments.length; i++) {
                const temp = firestore.doc(db, 'comments/' + comments[i]);
                tempComments.push(temp);
            }
            data.postComments = tempComments;
        } else {
            data.postComments = [];
        }

        data.postGroupId = firestore.doc(db, 'groups/' + data.postGroupId);
        data.postId = idGenerator();

        const allGroups = await getAllGroupsFromDB();
        const filteredResult = allGroups.filter(
            (x) => x.groupId === group && x.groupAdmin._key.path.segments[6] === author
        );
        if (filteredResult.length === 0) {
            data.postSentByAdmin = false;
        } else {
            data.postSentByAdmin = true;
        }
        const postsDB = firestore.doc(db, "posts", data.postId);
        await firestore.setDoc(postsDB, data);
        res.status(201).json({
            message: `Post added successfully! ${data.postId}`,
        });


        let requestedGroup = await sendGetRequest(`http://${host}:${port}/api/groups/${group}`);
        requestedGroup = requestedGroup.data.data;
        const groupName = requestedGroup.groupName;
        const tokens = await getUserFcmTokens(requestedGroup.groupMembers.concat(requestedGroup.groupAssistants).concat([requestedGroup.groupAdmin]));
        await sendNotification(tokens, groupName, data.postTitle);
        const notification = {
            notifDate: data.postDate,
            notifTargetGroup: [data.postGroupId],
            notifId: '',
            notifContent: data.postContent,
            notifTitle: data.postTitle
        };
        await addNotification(notification);

    } catch (error) {
        logger.error(error.message);
        res.status(400).json({
            message: error.message,
        });
    }
};

const getAllPosts = async (req, res, next) => {
    try {
        const allPosts = await getAllPostsFromDB();

        if (allPosts.empty) {
            res.status(404).json({
                message: "No Post record found.",
            });
        } else {
            res.status(200).json({
                data: allPosts,
            });
        }
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({
            message: error.message,
        });
    }
};

const getPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const db = firestore.getFirestore(firebase);
        const post = await firestore.doc(db, "posts", postId);
        const data = await firestore.getDoc(post);

        if (data.empty) {
            res.status(404).json({
                message: "Post with given ID cannot be found.",
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

const updatePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const data = req.body;
        const db = firestore.getFirestore(firebase);

        const date = data.postDate;
        if (date != null) {
            data.postDate = firestore.Timestamp.fromDate(new Date(data.postDate));
        }

        const author = data.postAuthor;
        if (author != null) {
            data.postAuthor = firestore.doc(db, 'users/' + data.postAuthor);
        }

        const comments = data.postComments;
        if (comments != null) {
            const tempComments = [];
            for (let i = 0; i < comments.length; i++) {
                const temp = firestore.doc(db, 'comments/' + comments[i]);
                tempComments.push(temp);
            }
            data.postComments = tempComments;
        } else {
            const post = await firestore.doc(db, "posts/" + postId);
            const postData = await firestore.getDoc(post);
            data.postComments = postData.data().postComments;
        }

        const groupId = data.postGroupId;
        if (groupId != null) {
            data.postGroupId = firestore.doc(db, 'groups/' + data.postGroupId)
        }

        const post = await firestore.doc(db, "posts", postId);
        await firestore.updateDoc(post, data);

        res.status(200).json({
            message: "Post record has updated successfully!",
        });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({
            message: error.message,
        });
    }
};

const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const db = firestore.getFirestore(firebase);
        const post = await firestore.doc(db, "posts", postId);
        const postCheck = await firestore.getDoc(post);

        if (postCheck.exists()) {
            await firestore.deleteDoc(post);
            res.status(200).json({
                message: "Post record has been deleted successfully!",
            });
        } else {
            let errorMessage = "Post cannot found.";
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

const getPostsByAuthor = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const allPosts = await getAllPostsFromDB();
        const userPosts = allPosts.filter(
            (x) => x.postAuthor._key.path.segments[6] === userId
        );
        res.status(200).json(userPosts);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({
            message: error.message
        });
    }
};

const getPostsByComment = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const allPosts = await getAllPostsFromDB();
        let commentPost = {};
        for (let i = 0; i < allPosts.length; i++) {
            const post = allPosts[i];
            const temp = post.postComments.filter(
                (x) => x._key.path.segments[6] === commentId
            );
            if (temp[0] !== undefined) {
                commentPost = post;
                break;
            }
        }
        res.status(200).json(commentPost);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({
            message: error.message
        })
    }
};

const getPostsByGroupId = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const allPosts = await getAllPostsFromDB();
        let posts = [];
        for (let i = 0; i < allPosts.length; i++) {
            const post = allPosts[i];
            console.log(post);
            const temp = post.hasOwnProperty("postGroupId") && post.postGroupId._key.path.segments[6].trim() === groupId;
            if (temp) {
                posts.push(post)
            }
        }
        res.status(200).json(posts);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({
            message: error.message
        })
    }
};

const getAllPostsFromDB = async () => {
    try {
        const allPosts = [];

        const db = firestore.getFirestore(firebase);
        const postsDB = await firestore.collection(db, "posts");
        const data = await firestore.getDocs(postsDB);

        if (!data.empty) {
            data.forEach((doc) => {
                const post = new Post(
                    doc.id,
                    doc.data().postAuthor,
                    doc.data().postComments,
                    doc.data().postContent,
                    doc.data().postDate,
                    doc.data().postId,
                    doc.data().postTitle,
                    doc.data().postGroupId,
                    doc.data().postSentByAdmin,
                );
                allPosts.push(post);
            });
        }
        return allPosts;
    } catch (error) {
        logger.error(error.message);
        return [];
    }
};

module.exports = {
    addPost,
    getAllPosts,
    getPost,
    updatePost,
    deletePost,
    getPostsByAuthor,
    getPostsByComment,
    getPostsByGroupId
};
