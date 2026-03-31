const router = require("express").Router();
const Recipe = require("../models/recipeModel.js");

const fetch = async (req, res) => {
  try {
    const recipes = await Recipe.find({}, { title: 1 }); 
    res.json(recipes);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const fetchOne = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json("Recipe not found");
    }

    res.json(recipe);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const ingredientsSearch = async (req, res) => {
  try {
    const userIngredients = req.body.ingredients.map(i =>
      i.toLowerCase().trim()
    );

    if (!userIngredients || userIngredients.length === 0) {
      return res.status(400).json("No ingredients provided");
    }

    const recipes = await Recipe.find({
      ingredients: { $in: userIngredients }
    });

    if (recipes.length === 0) {
      return res.status(404).json("No matching recipes");
    }

    let bestRecipe = null;
    let maxMatch = 0;

    for (let recipe of recipes) {
      const matchCount = recipe.ingredients.filter(i =>
        userIngredients.includes(i)
      ).length;

      if (matchCount > maxMatch) {
        maxMatch = matchCount;
        bestRecipe = recipe;
      }
    }

    res.json(bestRecipe);

  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = {fetch, fetchOne, ingredientsSearch};