// Bring in the passport local strategy
const LocalStrategy = require('passport-local').Strategy;
// Bring in our User Model
const Users = require('./sequelize').users;

module.exports = (passport) => {
  // Define what fields are our authentication fields
  passport.use(new LocalStrategy({
    usernameField: 'userEmail',
    passwordField: 'userPassword',
    passReqToCallback : true
  },
  // Create the authentication function
  async function(req, email, password, callback) {
    // Query the DB for the user
    const user =  await Users.findOne({
      where: {
        userEmail: email
      }
    });
    if (user == null) {
      // User Doesn't Exist
      return callback(null, false, req.flash('loginMessage', 'No user found.'));
    } else if (!user.validPassword(password)) {
      console.log('incorrect password');
      // Incorrect Password
      return callback(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
    }
    console.log('correct password');
    // All is well, log the user in
    return callback(null, user);
  }));

    // Configure Passport authenticated session persistence.
    //
    // In order to restore authentication state across HTTP requests, Passport needs
    // to serialize users into and deserialize users out of the session.  The
    // typical implementation of this is as simple as supplying the user ID when
    // serializing, and querying the user record by ID from the database when
    // deserializing.
    passport.serializeUser(function(user, callback) {
      callback(null, {
          userID: user.userID,
          userFirstName: user.userFirstName,
          userLastName: user.userLastName,
          userLevel: user.userLevel
      });
    });

    passport.deserializeUser(async function(userInfo, callback) {
       const user =  await Users.findOne({
          where: {
            userID: userInfo.userID
          },
          raw: true
        });
        callback(null, user);
    });
};