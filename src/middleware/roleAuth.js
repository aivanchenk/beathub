const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ msg: "Access forbidden: insufficient permissions" });
  }
  next();
};

module.exports = authorize;
