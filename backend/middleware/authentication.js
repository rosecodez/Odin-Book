function isAuthenticated(req, res, next) {
  console.log(req.user);
  if (req.isAuthenticated() && req.user) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = isAuthenticated;
