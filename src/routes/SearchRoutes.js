const express = require("express");
const router = express.Router();
const SearchController = require("../controllers/SearchController");

// Search route
router.get("/", SearchController.search);

module.exports = router;
