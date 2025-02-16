function isAuthenticated(req, res, next) {
  console.log(req.session + 'req session');
  console.log(req.user + 'req.user');
  console.log(req.session.user + 'req.session.user');

  if (req.user || (req.session?.user && req.session.user.isVisitor === true)) {
    console.log('req user is visitor true');
    return next();
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = isAuthenticated;
