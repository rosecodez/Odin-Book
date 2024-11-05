// In authentication.js or similar file
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = isAuthenticated;
