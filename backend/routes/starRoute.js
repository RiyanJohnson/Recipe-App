const router = require("express").Router();
const verifyToken = require("../middleware/validateToken");
const {
  toggleStar,
  getStarredRecipes
} = require("../controllers/starController");

router.post("/:recipeId", verifyToken, toggleStar);
router.get("/", verifyToken, getStarredRecipes);

module.exports = router;