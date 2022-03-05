const express = require('express');
const { addComment, getAllComments, getComment, updateComment, deleteComment} = require('../controllers/commentController');

const router = express.Router();

router.post('/add', addComment);
router.get('/get', getAllComments);
router.get('/get/:commentId', getComment);
router.put('/update/:commentId', updateComment);
router.delete('/delete/:commentId', deleteComment);

module.exports = {
    routes: router,
};