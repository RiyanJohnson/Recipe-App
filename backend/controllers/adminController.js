const jwt = require("jsonwebtoken");
const Recipe = require("../models/recipeModel");

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const adminLogin = (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json("Invalid admin credentials");
  }

  const token = jwt.sign(
    { isAdmin: true, username: "admin" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "4h" }
  );

  res.json({ adminToken: token });
};

const addRecipe = async (req, res) => {
  try {
    const { title, ingredients, steps, difficulty, cookingTime, servings, tags } = req.body;

    if (!title || !steps || steps.length === 0) {
      return res.status(400).json("Title and at least one step are required");
    }

    const recipe = new Recipe({
      title,
      ingredients: ingredients || [],
      steps,
      difficulty: difficulty || "easy",
      cookingTime: cookingTime ? Number(cookingTime) : undefined,
      servings: servings ? Number(servings) : 1,
      tags: tags || [],
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json("Recipe not found");
    res.json("Recipe deleted");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.json(recipes);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = { adminLogin, addRecipe, deleteRecipe, getAllRecipes };
