const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json("No token provided");

  const token = header.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json("Invalid or expired token");
    if (!decoded.isAdmin) return res.status(403).json("Admin access required");

    req.user = decoded;
    next();
  });
};
