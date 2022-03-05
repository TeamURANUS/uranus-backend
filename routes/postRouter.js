const express = require("express");
const {
    addPost,
    getAllPosts,
    getPost,
    updatePost,
    deletePost,
} = require("../controllers/postController");

const router = express.Router();

router.post("/", addPost);
router.get("/", getAllPosts);
router.get("/:postId", getPost);
router.put("/:postId", updatePost);
router.delete("/:postId", deletePost);

module.exports = {
    routes: router,
};