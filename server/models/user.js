const { Model, DataTypes } = require('sequelize');
const sequelize = require("../middleware/sequelize.js");
const UserRole = require("./user_role");

class User extends Model { }

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user_role',
            key: 'id'
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false 
});

User.belongsTo(UserRole, { foreignKey: 'role_id' });

module.exports = User;
