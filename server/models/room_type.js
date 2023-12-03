const { Model, DataTypes } = require('sequelize');
const sequelize = require("../middleware/sequelize.js");

class RoomType extends Model { }

RoomType.init({
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
    modelName: 'RoomType',
    tableName: 'room_type',
    timestamps: true
});

module.exports = RoomType;
