const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

const registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      username: req.body.username,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json("User created");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) 
        return res.status(404).json("User not found");

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) 
        return res.status(400).json("Wrong password");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    const userId = user._id;

    res.json({userId, accessToken, refreshToken });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const logoutUser = async (req, res) => {
  try {
    const { userId } = req.body;

    await User.findByIdAndUpdate(userId, { refreshToken: null });

    res.json("Logged out");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json("No refresh token provided");
  }

  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) 
            return res.status(403).json("Invalid refresh token");

        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
          return res.status(403).json("Token mismatch");
        }

        const newAccessToken = generateAccessToken(user);

        res.json({ accessToken: newAccessToken });
      }
    );
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = {loginUser, logoutUser, registerUser, refreshAccessToken}