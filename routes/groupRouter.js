const express = require("express");
const {
    addGroup,
    getAllGroups,
    getGroup,
    updateGroup,
    deleteGroup,
} = require("../controllers/groupController");

const router = express.Router();

router.post("/", addGroup);
router.get("/", getAllGroups);
router.get("/:groupId", getGroup);
router.put("/:groupId", updateGroup);
router.delete("/:groupId", deleteGroup);

module.exports = {
    routes: router,
};