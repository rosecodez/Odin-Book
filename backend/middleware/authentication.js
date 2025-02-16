function isAuthenticated(req, res, next) {
  console.log(req.session);
  console.log(req.user);
  console.log(req.session?.user);

  if (!req.user && !req.session?.user) {
    console.log('unauthorized');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = req.user || req.session.user;
  console.log(user);

  res.json({ user });
}

module.exports = isAuthenticated;
