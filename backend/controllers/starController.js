const mongoose = require("mongoose");
const User = require("../models/userModel");

const toggleStar = async (req, res) => {
  try {
    const { recipeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json("Invalid recipe ID");
    }

    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json("User not found");

    const alreadyStarred = user.starredRecipes.some(
      (id) => id.toString() === recipeId
    );

    if (alreadyStarred) {
      user.starredRecipes = user.starredRecipes.filter(
        (id) => id.toString() !== recipeId
      );
    } else {
      user.starredRecipes.push(recipeId);
    }

    await user.save();

    res.json({
      message: alreadyStarred ? "Unstarred" : "Starred",
      starredRecipes: user.starredRecipes
    });

  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getStarredRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("starredRecipes");

    if (!user) return res.status(404).json("User not found");

    res.json(user.starredRecipes);

  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = {
  toggleStar,
  getStarredRecipes
};