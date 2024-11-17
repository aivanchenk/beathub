const jwt = require("jsonwebtoken");
const blacklist = require("./blacklist");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");

  console.log(token);

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  if (blacklist.isBlacklisted(token)) {
    return res
      .status(401)
      .json({ msg: "Token has been invalidated, please log in again" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Attach the decoded user to req
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
