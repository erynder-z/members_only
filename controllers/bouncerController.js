exports.bouncer = (req, res) => {
  res.render('bouncer', { user: req.user });
};
