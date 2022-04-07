const express = require("express");
const {
    addPost,
    getAllPosts,
    getPost,
    updatePost,
    deletePost,
    getPostsByAuthor,
    getPostsByComment, getPostsByGroupId
} = require("../controllers/postController");

const router = express.Router();

router.post("/", addPost);
router.get("/", getAllPosts);
router.get("/:postId", getPost);
router.put("/:postId", updatePost);
router.delete("/:postId", deletePost);
router.get("/userPosts/:userId", getPostsByAuthor);
router.get("/commentPosts/:commentId", getPostsByComment)
router.get("/groupPosts/:groupId", getPostsByGroupId)

module.exports = {
    routes: router,
};
