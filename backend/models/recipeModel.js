const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    ingredients: {
      type: [String],  
    },

    steps: {
      type: [String],   
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },

    cookingTime: {
      type: Number, 
    },

    servings: {
      type: Number,
      default: 1,
    },

    tags: {
      type: [String],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", RecipeSchema);