// middleware/authMiddleware.js
module.exports = {
  ensureAuthenticated: function (req, res, next) {
    console.log('Utente autenticato:', req.isAuthenticated());
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Non autorizzato' });
  },
};
