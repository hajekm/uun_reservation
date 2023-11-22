const express = require('express');
const session = require('express-session');
const usersRoutes = require('./routes/users.js');
const roomsRoutes = require('./routes/rooms.js');
const defaultRoutes = require('./routes/default.js');
const reservationsRoutes = require('./routes/reservations.js');
const passport = require('passport');
require('./middleware/passport.js')(passport);

const app = express();

app.use(express.json());

app.use(session({
    secret: 'tajný_klíč',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    next();
});

app.get('/', (req, res) => {
    res.send('Homepage');
});

app.use('/users', usersRoutes);
app.use('/rooms', roomsRoutes);
app.use('/reservations', reservationsRoutes);
app.use('/', defaultRoutes);

module.exports = app;