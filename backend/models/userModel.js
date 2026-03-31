const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    starredRecipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe"
    }]
  }
);

module.exports = mongoose.model("User", UserSchema);
