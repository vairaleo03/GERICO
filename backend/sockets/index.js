// sockets/index.js

const jwt = require('jsonwebtoken');

module.exports = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return next(new Error('Autenticazione fallita'));
        socket.user = decoded;
        next();
      });
    } else {
      next(new Error('Token non fornito'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Utente connesso: ${socket.user.id}`);

    // Unisci l'utente alla stanza corrispondente al suo ID
    socket.join(socket.user.id);

    socket.on('disconnect', () => {
      console.log(`Utente disconnesso: ${socket.user.id}`);
    });
  });
};
