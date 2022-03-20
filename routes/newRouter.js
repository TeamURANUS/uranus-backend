const express = require("express");
const {
    addNew,
    getAllNews,
    getNew,
    updateNew,
    deleteNew,
    getNewsByAuthor
} = require("../controllers/newController");

const router = express.Router();

router.post("/", addNew);
router.get("/", getAllNews);
router.get("/:newId", getNew);
router.put("/:newId", updateNew);
router.delete("/:newId", deleteNew);
router.get("/userNews/:userId", getNewsByAuthor);

module.exports = {
    routes: router,
};
