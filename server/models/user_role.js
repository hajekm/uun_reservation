const {Model, DataTypes} = require('sequelize');
const sequelize = require("../middleware/sequelize.js");
const User = require('./user');

class UserRole extends Model {
}

UserRole.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    sequelize,
    modelName: 'UserRole',
    tableName: 'user_role',
    timestamps: true
});


module.exports = UserRole;
