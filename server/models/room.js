const { Model, DataTypes } = require('sequelize');
const sequelize = require("../middleware/sequelize.js");

class Room extends Model { }

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
