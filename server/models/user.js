const { Model, DataTypes } = require('sequelize');
const sequelize = require("../middleware/sequelize.js");
const UserRole = require("./user_role");
const Revision = require('./revision');

class User extends Model { }

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - role_id
 *         - username
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the user
 *         role_id:
 *           type: integer
 *           description: The role ID associated with the user
 *         username:
 *           type: string
 *           description: Username of the user
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *         password:
 *           type: string
 *           description: Password for the user (stored encrypted)
 *       example:
 *         id: 1
 *         role_id: 2
 *         username: "johndoe"
 *         email: "johndoe@example.com"
 *         password: "hashedpassword"
 */
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
    },
    revision: {
        type: DataTypes.INTEGER,
        references: {
            model: Revision,
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true 
});

User.belongsTo(UserRole, { foreignKey: 'role_id' });

module.exports = User;
