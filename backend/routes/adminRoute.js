const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const validateAdmin = require("../middleware/validateAdmin");
const {
  adminLogin,
  addRecipe,
  deleteRecipe,
  getAllRecipes
} = require("../controllers/adminController");

router.use(bodyParser.json());

router.post("/login", adminLogin);
router.get("/recipes", validateAdmin, getAllRecipes);
router.post("/recipe", validateAdmin, addRecipe);
router.delete("/recipe/:id", validateAdmin, deleteRecipe);

module.exports = router;
