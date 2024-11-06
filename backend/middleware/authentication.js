function isAuthenticated(req, res, next) {
  console.log("user in is authenticated!!!!!!!!!", req.user);
  if (req.user) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = isAuthenticated;
