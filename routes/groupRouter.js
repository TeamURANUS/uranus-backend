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
  getGroupByPost,
  getAllGroupsByUser,
} = require("../controllers/groupController");

const router = express.Router();

router.post("/", addGroup);
router.get("/", getAllGroups);
router.get("/:groupId", getGroup);
router.put("/:groupId", updateGroup);
router.delete("/:groupId", deleteGroup);
router.get("/adminUserGroups/:userId", getGroupByAdmin);
router.get("/assistantUserGroups/:userId", getGroupByAssistant);
router.get("/userGroups/:userId", getGroupByMember);
router.get("/postGroup/:postId", getGroupByPost);
router.get("/allGroupsOfUser/:userId", getAllGroupsByUser);

module.exports = {
  routes: router,
};
