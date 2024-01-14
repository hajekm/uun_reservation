module.exports = {
    database: {
        username: 'root',
        password: 'password',
        host: 'db',
        port: 3306,
        dbName: 'reservations'
    },
    googleAuth: {
        clientID: "",
        clientSecret: "",
        callbackURL: ''
    },
    swagger: {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Reservations',
                version: '1.0.0',
            },
        },
        apis: ['./routes/*.js', './models/*.js']
    },
    mailer: {
        username: '',
        password: ''
    }
};