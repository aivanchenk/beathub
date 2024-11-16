const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");
  console.log("Token received:", token);

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded.user; // Attach the decoded user to req
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
