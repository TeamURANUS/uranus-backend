const firebase = require("../utils/firedb");
const firestore = require("firebase/firestore/lite");
const Comment = require("../models/comment");
const logger = require("../utils/logger");
const idGenerator = require("../utils/idGenerator");

const addComment = async (req, res, next) => {
  try {
    const data = req.body;
    data.commentDate = firestore.Timestamp.fromDate(new Date(data.commentDate));
    const db = firestore.getFirestore(firebase);
    data.commentAuthor = firestore.doc(db, 'users/' + data.commentAuthor);
    data.commentId = idGenerator();
    const commentsDB = firestore.doc(db, "comments", data.commentId);
    await firestore.setDoc(commentsDB, data);
    res.status(201).json({
      message: `comment created ${data.commentId}`,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({
      message: error.message,
    });
  }
};

const getAllComments = async (req, res, next) => {
  try {
    const allComments = await getAllCommentsFromDB();

    if (allComments.empty)
      res.status(404).json({
        message: "Data is empty",
      });
    else {
      res.status(200).json({
        data: allComments,
      });
    }
  } catch (error) {
    logger.error(error.message);
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
    logger.error(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const data = req.body;
    data.commentDate = firestore.Timestamp.fromDate(new Date(data.commentDate));
    const db = firestore.getFirestore(firebase);
    data.commentAuthor = firestore.doc(db, 'users/' + data.commentAuthor);
    const comment = await firestore.doc(db, "comments", commentId);
    await firestore.updateDoc(comment, data);

    res.status(200).json({
      message: "Comment record has updated successfully!",
    });
  } catch (error) {
    logger.error(error.message);
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
    const commentCheck = await firestore.getDoc(comment);

    if (commentCheck.exists()) {
      await firestore.deleteDoc(comment);
      res.status(200).json({
        message: "Comment record has been deleted successfully!",
      });
    } else {
      let errorMessage = "Comment cannot found.";
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

const getCommentsByAuthor = async (req, res, next) => {
  try {
    const userID = req.params.userId;
    const allComments = await getAllCommentsFromDB();
    const userComments = allComments.filter(
      (x) => x.commentAuthor._key.path.segments[6] === userID
    );
    res.status(200).json(userComments);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllCommentsFromDB = async () => {
  try {
    const allComments = [];

    const db = firestore.getFirestore(firebase);
    const commentsDB = await firestore.collection(db, "comments");
    const data = await firestore.getDocs(commentsDB);

    if (!data.empty) {
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
    }
    return allComments;
  } catch (error) {
    logger.error(error.message);
    return [];
  }
};

module.exports = {
  addComment,
  getAllComments,
  getComment,
  updateComment,
  deleteComment,
  getCommentsByAuthor,
};
