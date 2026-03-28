const express = require("express");
const bodyParser = require("body-parser");
const {
  fetch,
  fetchOne
} = require("../controllers/recipeController.js");
const validateToken = require('../middleware/validateToken.js');

const router = express.Router();

router.use(bodyParser.json());

router.get('/fetch', validateToken, fetch);
router.get('/fetch/:id', validateToken, fetchOne)

module.exports = router;