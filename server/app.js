const express = require('express');
const session = require('express-session');
const usersRoutes = require('./routes/users.js');
const roomsRoutes = require('./routes/rooms.js');
const defaultRoutes = require('./routes/default.js');
const reservationsRoutes = require('./routes/reservations.js');
const revisionsRoutes = require('./routes/revisions.js');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./config/config');
const cors = require('cors');

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
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

const swaggerSpec = swaggerJsdoc(config.swagger);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get('/', (req, res) => {
    res.send({message: 'Nothing to see here'});
});
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use('/api', usersRoutes);
app.use('/api', roomsRoutes);
app.use('/api', reservationsRoutes);
app.use('/api', revisionsRoutes);
app.use('/api', defaultRoutes);

module.exports = app;