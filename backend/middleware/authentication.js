function isAuthenticated(req, res, next) {
  console.log(req.session);
  console.log(req.user);
  console.log(req.session.user);

  if (req.user || (req.session?.user && req.session.user.isVisitor === true)) {
    console.log('req user is visitor true');
    return next();
  } else {
    console.log('user is not logged in , no user in session');
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = isAuthenticated;
