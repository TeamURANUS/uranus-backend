const firebase = require('../firedb');
const firestore  = require('firebase/firestore/lite');
const Comment = require('../models/comment');

const addComment = async (req, res, next) => {
    try {
        const data = req.body;
        const db = firestore.getFirestore(firebase);
        const commentsDB = firestore.collection(db, 'comments');
        await firestore.addDoc(commentsDB, data);
        res.send('Comment added successfully!');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllComments = async(req, res, next) => {
    try {
        const allComments = [];

        const db = firestore.getFirestore(firebase);
        const commentsDB = await firestore.collection(db, 'comments');
        const data = await firestore.getDocs(commentsDB);

        if(data.empty)
            res.status(404).send("No comment record found.");
        else {
            data.forEach(doc => {
                const comment = new Comment(
                    doc.id,
                    doc.data().commentAuthor,
                    doc.data().commentContent,
                    doc.data().commentDate,
                    doc.data().commentId,
                );
                allComments.push(comment);
            });
            res.send(allComments);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getComment = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const db = firestore.getFirestore(firebase);
        const comment = await firestore.doc(db, 'comments', commentId);
        const data = await firestore.getDoc(comment);

        if(data.empty)
            res.status(404).send("Comment with given ID cannot be found.");
        else
            res.send(data.data());
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateComment = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const data = req.body;
        const db = firestore.getFirestore(firebase);
        const comment = await firestore.doc(db, 'comments', commentId);
        await firestore.updateDoc(comment, data);

        res.send('Comment record has updated successfully!');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const db = firestore.getFirestore(firebase);
        const comment = await firestore.doc(db, 'comments', commentId);
        await firestore.deleteDoc(comment);

        res.send('Comment record has been deleted successfully!');
    } catch (error) {
        res.send(400).send(error.message);
    }
}

module.exports = {
    addComment,
    getAllComments,
    getComment,
    updateComment,
    deleteComment,
};