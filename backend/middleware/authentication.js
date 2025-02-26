function isAuthenticated(req, res, next) {
  console.log(req.session);
  console.log(req.user);
  console.log(req.session?.user);
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://odin-book-frontend.onrender.com'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (!req.user && !req.session?.user) {
    console.log('unauthorized');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = req.user || req.session.user;
  console.log(user);

  return next();
}

module.exports = isAuthenticated;
