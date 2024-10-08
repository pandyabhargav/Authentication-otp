const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    
    console.log("User is not authenticated. Redirecting to login.");
    res.redirect('/login');
  };
  module.exports = isAuthenticated;

