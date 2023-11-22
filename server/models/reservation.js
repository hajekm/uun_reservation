const { Model, DataTypes } = require('sequelize');
const sequelize = require("../middleware/sequelize.js");

class Reservation extends Model { }

Reservation.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER
    },
    room_id: {
        type: DataTypes.INTEGER
    },
    start_date: {
        type: DataTypes.DATEONLY
    },
    end_date: {
        type: DataTypes.DATEONLY
    },
    state_id: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize,
    modelName: 'Reservation',
    tableName: 'reservations',
    timestamps: false
});

module.exports = Reservation;
