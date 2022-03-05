const express = require('express');
const { addUser, getAllUsers, getUser, updateUser, deleteUser} = require('../controllers/userController');

const router = express.Router();

router.post('/add', addUser);
router.get('/get', getAllUsers);
router.get('/get/:userId', getUser);
router.put('/update/:userId', updateUser);
router.delete('/delete/:userId', deleteUser);

module.exports = {
    routes: router,
};