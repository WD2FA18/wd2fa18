module.exports = {
    redirectIfLoggedIn: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        // They are already logged in so let's redirect them to /
        res.redirect('/');
    },
    redirectIfNotAdmin: function(req, res, next) {
      if (!req.isAuthenticated()) {
        // Not logged in, redirect
        req.flash('loginMessage', 'You must be logged in to view that page!');
        res.redirect('/login');
      } else if (req.session.passport.user.userLevel !== 'admin') {
        req.flash('message', 'You are not authorized to view that page!');
        req.flash('type', 'alert-warning');
        res.redirect('/');
      } else {
        // All is well!
        return next();
      }
    }
};