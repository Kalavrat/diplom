const isAuthenticated = (req, res, next) => {
  console.log("===========================================");
  console.log(req.session);
  console.log("===========================================");
  if (req.session.userId) {
    console.log(req.session);

    next();
  } else {
    console.log(req.session);
    res.status(401).send("Unauthorized");
  }
};

module.exports = isAuthenticated;
