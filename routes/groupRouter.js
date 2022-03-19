const express = require("express");
const {
    addGroup,
    getAllGroups,
    getGroup,
    updateGroup,
    deleteGroup,
    getGroupByAdmin,
    getGroupByAssistant,
    getGroupByMember,
    getGroupByPost
} = require("../controllers/groupController");

const router = express.Router();

router.post("/", addGroup);
router.get("/", getAllGroups);
router.get("/:groupId", getGroup);
router.put("/:groupId", updateGroup);
router.delete("/:groupId", deleteGroup);
router.get("/adminUserGroupLog/:userId", getGroupByAdmin);
router.get("/assistantUserGroupLog/:userId", getGroupByAssistant);
router.get("/userGroupLog/:userId", getGroupByMember);
router.get("/postGroupLog/:postId", getGroupByPost)


module.exports = {
    routes: router,
};
