const firebase = require("../utils/firedb");
const firestore = require("firebase/firestore/lite");
const Comment = require("../models/comment");

const addComment = async (req, res, next) => {
  try {
    const data = req.body;
    const db = firestore.getFirestore(firebase);
    const commentsDB = firestore.collection(db, "comments");
    await firestore.addDoc(commentsDB, data);
    res.status(201).json({
      message: "comment created",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getAllComments = async (req, res, next) => {
  try {
    const allComments = [];

    const db = firestore.getFirestore(firebase);
    const commentsDB = await firestore.collection(db, "comments");
    const data = await firestore.getDocs(commentsDB);

    if (data.empty)
      res.status(404).json({
        message: "Data is empty",
      });
    else {
      data.forEach((doc) => {
        const comment = new Comment(
          doc.id,
          doc.data().commentAuthor,
          doc.data().commentContent,
          doc.data().commentDate,
          doc.data().commentId
        );
        allComments.push(comment);
      });
      res.status(200).json({
        data: allComments,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const db = firestore.getFirestore(firebase);
    const comment = await firestore.doc(db, "comments", commentId);
    const data = await firestore.getDoc(comment);

    if (data.empty)
      res.status(404).json({
        message: "Comment with given ID cannot be found.",
      });
    else
      res.status(200).json({
        data: data.data(),
      });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const data = req.body;
    const db = firestore.getFirestore(firebase);
    const comment = await firestore.doc(db, "comments", commentId);
    await firestore.updateDoc(comment, data);

    res.status(200).json({
      message: "Comment record has updated successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const db = firestore.getFirestore(firebase);
    const comment = await firestore.doc(db, "comments", commentId);
    await firestore.deleteDoc(comment);

    res.status(200).json({
      message: "Comment record has been deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addComment,
  getAllComments,
  getComment,
  updateComment,
  deleteComment,
};
