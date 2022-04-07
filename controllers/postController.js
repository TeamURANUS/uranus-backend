const firebase = require("../utils/firedb");
const firestore = require("firebase/firestore/lite");
const Post = require("../models/post");
const logger = require("../utils/logger");

const addPost = async (req, res, next) => {
    try {
        const data = req.body;
        data.postDate = firestore.Timestamp.fromDate(new Date(data.postDate));
        const db = firestore.getFirestore(firebase);

        data.postAuthor = firestore.doc(db, 'users/' + data.postAuthor);

        const comments = data.postComments;
        const tempComments = [];
        for (let i = 0; i < comments.length; i++) {
            const temp = firestore.doc(db, 'comments/'+comments[i]);
            tempComments.push(temp);
        }
        data.postComments = tempComments;

        data.postGroupId = firestore.doc(db, 'groups/'+ data.postGroupId)

        const postsDB = firestore.doc(db, "posts", data.postId);
        await firestore.setDoc(postsDB, data);
        res.status(201).json({
            message: "Post added successfully!",
        });
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
        data.postDate = firestore.Timestamp.fromDate(new Date(data.postDate));
        const db = firestore.getFirestore(firebase);

        data.postAuthor = firestore.doc(db, 'users/' + data.postAuthor);

        const comments = data.postComments;
        const tempComments = [];
        for (let i = 0; i < comments.length; i++) {
            const temp = firestore.doc(db, 'comments/'+comments[i]);
            tempComments.push(temp);
        }
        data.postComments = tempComments;

        data.postGroupId = firestore.doc(db, 'groups/'+ data.postGroupId)

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
    getPostsByComment
};
