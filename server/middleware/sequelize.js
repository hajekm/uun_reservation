const Sequelize = require("sequelize");
const config = require('../config/config');
const revisionModel = require('../models/user');

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

const options = {
    revisionModel: revisionModel.modelName,
    tableName: 'revisions'
};
const PaperTrail = require('sequelize-paper-trail').init(sequelize, options);
PaperTrail.defineModels();

sequelize.paperTrail = PaperTrail;
sequelize.authenticate().then(() => {
}).catch((err) => {
    console.log("Connection to db failed!");
    console.log(err);
});

module.exports = sequelize;