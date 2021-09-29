const express = require("express");
const router = express.Router();

const { getAllMovies, getCharacter } = require("../controllers/movies");
const { createComment, getAllComments } = require("../controllers/comments");
const { expressMiddleware } = require("../middleware/clientIp");

router.get("/movies", getAllMovies);
router.get("/character/:episode_id", getCharacter);
router.post("/comment/:episode_id", expressMiddleware, createComment);
router.get("/comments", getAllComments);

module.exports = router;
