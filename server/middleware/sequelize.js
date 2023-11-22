const Sequelize = require("sequelize");
const config = require('../config/config');

const sequelize = new Sequelize(
    config.database.dbName,
    config.database.username,
    config.database.password,
    {
        host: config.database.host,
        port: config.database.port,
        dialect: 'mysql',
        logging: false
    }
);

sequelize.authenticate().then(() => {
}).catch((err) => {
    console.log("Connection to db failed!");
    console.log(err);
});

module.exports = sequelize;