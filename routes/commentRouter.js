const express = require('express');
const { addComment, getAllComments, getComment, updateComment, deleteComment} = require('../controllers/commentController');

const router = express.Router();

router.post('/', addComment);
router.get('/', getAllComments);
router.get('/:commentId', getComment);
router.put('/:commentId', updateComment);
router.delete('/:commentId', deleteComment);

module.exports = {
    routes: router,
};
