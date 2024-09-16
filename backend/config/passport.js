// config/passport.js
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function (passport) {
  // Strategia di autenticazione locale
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });

        if (!user) {
          return done(null, false, { message: 'Email non registrata' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password errata' });
        }
      } catch (err) {
        return done(err);
      }
    })
  );

  // Serializzazione dell'utente
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserializzazione dell'utente - correggiamo l'uso di async/await qui
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id); // Usa async/await
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
