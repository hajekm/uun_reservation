const {Model, DataTypes} = require('sequelize');
const sequelize = require("../middleware/sequelize.js");
const Revision = require('./revision');

class Reservation extends Model {
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The reservation ID
 *         user_id:
 *           type: integer
 *           description: The ID of the user who made the reservation
 *         room_id:
 *           type: integer
 *           description: The ID of the room reserved
 *         start_date:
 *           type: string
 *           format: date
 *           description: The start date of the reservation
 *         end_date:
 *           type: string
 *           format: date
 *           description: The end date of the reservation
 *         state_id:
 *           type: integer
 *           description: The state ID of the reservation
 *         revisionId:
 *           type: integer
 *           description: The ID of the associated revision in the revisions table
 */
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
    modelName: 'Reservation',
    tableName: 'reservations',
    timestamps: true
});

Reservation.revision = Reservation.hasPaperTrail();

module.exports = Reservation;
