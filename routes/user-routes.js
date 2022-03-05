const express = require('express');
const { addUser, getAllUsers, getUser, updateUser, deleteUser} = require('../controllers/userController');

const router = express.Router();

router.post('/users', addUser);
router.get('/users', getAllUsers);
router.get('/users/:userId', getUser);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);

module.exports = {
    routes: router,
};