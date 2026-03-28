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

module.exports = {fetch, fetchOne};