const express = require("express");
const bodyParser = require("body-parser");
const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser
} = require("../controllers/authController.js");

const router = express.Router();

router.use(bodyParser.json());

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refreshtoken", refreshAccessToken);

module.exports = router;