const firebase = require("../firedb");
const firestore = require("firebase/firestore/lite");
const Post = require("../models/post");

const addPost = async (req, res, next) => {
    try {
        const data = req.body;
        const db = firestore.getFirestore(firebase);
        const postsDB = firestore.collection(db, "posts");
        await firestore.addDoc(postsDB, data);
        res.status(201).json({
            message: "Post added successfully!",
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

const getAllPosts = async (req, res, next) => {
    try {
        const allPosts = [];

        const db = firestore.getFirestore(firebase);
        const postsDB = await firestore.collection(db, "posts");
        const data = await firestore.getDocs(postsDB);

        if (data.empty) {
            res.status(404).json({
                messsage: "No Post record found.",
            });
        } else {
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
            res.status(200).json({
                data: allPosts,
            });
        }
    } catch (error) {
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
        const post = await firestore.doc(db, "posts", postId);
        await firestore.updateDoc(post, data);

        res.status(200).json({
            message: "Post record has updated successfully!",
        });
    } catch (error) {
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
        await firestore.deleteDoc(post);

        res.status(200).json({
            message: "Post record has been deleted successfully!",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    addPost,
    getAllPosts,
    getPost,
    updatePost,
    deletePost,
};