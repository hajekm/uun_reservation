const {Model, DataTypes} = require('sequelize');
const sequelize = require("../middleware/sequelize.js");

class Revision extends Model {
}

Revision.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false
    },
    document: {
        type: DataTypes.JSON,
        allowNull: false
    },
    operation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    documentId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    revision: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Revision',
    tableName: 'revisions'
});

module.exports = Revision;