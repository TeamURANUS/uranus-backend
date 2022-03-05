const express = require('express');
const { addComment, getAllComments, getComment, updateComment, deleteComment} = require('../controllers/commentController');

const router = express.Router();

router.post('/add-comment', addComment);
router.get('/get-comments', getAllComments);
router.get('/get-comment/:commentId', getComment);
router.put('/update-comment/:commentId', updateComment);
router.delete('/delete-comment/:commentId', deleteComment);

module.exports = {
    routes: router,
};