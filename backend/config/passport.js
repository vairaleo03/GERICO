// config/passport.js
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function (passport) {
  // Strategia di autenticazione locale
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Trova l'utente per email
      User.findOne({ email: email })
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'Email non registrata' });
          }

          // Confronta la password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password errata' });
            }
          });
        })
        .catch(err => console.log(err));
    })
  );

  // Serializzazione dell'utente
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserializzazione dell'utente
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
