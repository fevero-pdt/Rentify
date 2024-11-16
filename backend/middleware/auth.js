const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
      req.userId = req.session.user._id;
      next();
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  };
  
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Admins only." });
    }
  };
  
module.exports = { isAuthenticated, isAdmin };
  