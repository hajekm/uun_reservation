const { Model, DataTypes } = require('sequelize');
const sequelize = require("../middleware/sequelize.js");

class ReservationState extends Model { }

ReservationState.init({
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
    modelName: 'ReservationState',
    tableName: 'reservation_state',
    timestamps: true
});

module.exports = ReservationState;
