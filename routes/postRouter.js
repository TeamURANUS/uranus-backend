const express = require("express");
const {
    addPost,
    getAllPosts,
    getPost,
    updatePost,
    deletePost,
    getPostsByAuthor,
    getPostsByComment
} = require("../controllers/postController");

const router = express.Router();

router.post("/", addPost);
router.get("/", getAllPosts);
router.get("/:postId", getPost);
router.put("/:postId", updatePost);
router.delete("/:postId", deletePost);
router.get("/userPostLog/:userId", getPostsByAuthor);
router.get("/commentPostLog/:commentId", getPostsByComment)

module.exports = {
    routes: router,
};
