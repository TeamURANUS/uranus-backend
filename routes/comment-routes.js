const express = require('express');
const { addComment, getAllComments, getComment, updateComment, deleteComment} = require('../controllers/commentController');

const router = express.Router();

router.post('/comments', addComment);
router.get('/comments', getAllComments);
router.get('/comments/:commentId', getComment);
router.put('/comments/:commentId', updateComment);
router.delete('/comments/:commentId', deleteComment);

module.exports = {
    routes: router,
};