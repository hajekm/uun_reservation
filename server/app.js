const express = require('express');
const session = require('express-session');
const userRoutes = require('./routes/users.js');
const defaultRoutes = require('./routes/default.js');
const passport = require('passport');
require('./utils/passport.js')(passport);

const app = express();

app.use(express.json());

app.use(session({
    secret: 'tajný_klíč',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    next();
});

app.get('/', (req, res) => {
    res.send('Vítejte v mé Node.js aplikaci s Express!');
});

app.use('/users', userRoutes);
app.use('/', defaultRoutes);

// Nastavení portu
const PORT = process.env.PORT || 3001;

// Spuštění serveru
app.listen(PORT, () => {
    console.log(`Server běží na portu ${PORT}`);
});
