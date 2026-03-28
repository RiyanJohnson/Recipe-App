const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Recipe = require("./models/recipeModel.js");
const recipes = require("./recipes.json");

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("DB connected");
    await Recipe.deleteMany();

    await Recipe.insertMany(recipes);
    console.log("Recipes seeded");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();