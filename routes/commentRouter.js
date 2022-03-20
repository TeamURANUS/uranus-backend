const express = require('express');
const {
    addComment,
    getAllComments,
    getComment,
    updateComment,
    deleteComment,
    getCommentsByAuthor
} = require('../controllers/commentController');

const router = express.Router();

router.post('/', addComment);
router.get('/', getAllComments);
router.get('/:commentId', getComment);
router.put('/:commentId', updateComment);
router.delete('/:commentId', deleteComment);
router.get('/userCommentLog/:userId', getCommentsByAuthor)

module.exports = {
    routes: router,
};
