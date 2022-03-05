const express = require('express');
const { addUser, getAllUsers, getUser, updateUser, deleteUser} = require('../controllers/userController');

const router = express.Router();

router.post('/', addUser);
router.get('/', getAllUsers);
router.get('/:userId', getUser);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

module.exports = {
    routes: router,
};
