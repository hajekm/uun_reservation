const { Model, DataTypes } = require('sequelize');
const sequelize = require("../middleware/sequelize.js");

class Room extends Model { }

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       required:
 *         - id
 *         - room_number
 *         - description
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the room
 *         room_number:
 *           type: integer
 *           description: Number of the room
 *         type_id:
 *           type: integer
 *           description: Identifier for the type of the room
 *         description:
 *           type: string
 *           description: Description of the room
 *         price:
 *           type: number
 *           format: float
 *           description: Price of the room per night
 *         beds:
 *           type: integer
 *           description: Number of beds in the room
 *         options:
 *           type: string
 *           description: Additional options available in the room
 */
Room.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    room_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type_id: {
        type: DataTypes.INTEGER
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    beds: {
        type: DataTypes.INTEGER
    },
    options: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'Room',
    tableName: 'rooms',
    timestamps: false
});

module.exports = Room;
