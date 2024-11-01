function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
}

module.exports = isAuthenticated;
