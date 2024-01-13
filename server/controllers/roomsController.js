const Room = require('../models/room');
const sequelize = require("../middleware/sequelize.js");

const roomController = {
    getAllRooms: async (req, res) => {
        try {
            const rooms = await Room.findAll();
            res.json(rooms);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            res.status(500).json({error: 'An error occurred while fetching rooms'});
        }
    },

    createRoom: async (req, res) => {
        try {
            const newRoom = await Room.create(req.body);
            res.json(newRoom);
        } catch (error) {
            console.error('Error creating room:', error);
            res.status(500).json({error: 'An error occurred while creating the room'});
        }
    },

    getRoomById: async (req, res) => {
        try {
            const room = await Room.findByPk(req.params.roomId);
            if (room) {
                res.json(room);
            } else {
                res.status(404).json({error: 'Room not found'});
            }
        } catch (error) {
            console.error('Error fetching room:', error);
            res.status(500).json({error: 'An error occurred while fetching the room'});
        }
    },

    updateRoom: async (req, res) => {
        try {
            const [updated] = await Room.update(req.body, {
                where: {id: req.params.roomId}
            });
            if (updated) {
                const updatedRoom = await Room.findByPk(req.params.roomId);
                res.json(updatedRoom);
            } else {
                res.status(404).json({error: 'Room not found'});
            }
        } catch (error) {
            console.error('Error updating room:', error);
            res.status(500).json({error: 'An error occurred while updating the room'});
        }
    },

    deleteRoom: async (req, res) => {
        try {
            const deleted = await Room.destroy({
                where: {id: req.params.roomId}
            });
            if (deleted) {
                res.json({message: `Room with ID: ${req.params.roomId} deleted`});
            } else {
                res.status(404).json({error: 'Room not found'});
            }
        } catch (error) {
            console.error('Error deleting room:', error);
            res.status(500).json({error: 'An error occurred while deleting the room'});
        }
    },

    getAllAvailableRooms: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;

            const occupiedRooms = await Reservation.findAll({
                where: {
                    [sequelize.or]: [
                        {
                            start_date: {
                                [sequelize.between]: [startDate, endDate]
                            }
                        },
                        {
                            end_date: {
                                [sequelize.between]: [startDate, endDate]
                            }
                        },
                        {
                            [sequelize.and]: [
                                { start_date: { [sequelize.lte]: startDate } },
                                { end_date: { [sequelize.gte]: endDate } }
                            ]
                        }
                    ]
                },
                attributes: ['room_id']
            });

            const occupiedRoomIds = occupiedRooms.map(room => room.room_id);

            const availableRooms = await Room.findAll({
                where: {
                    id: {
                        [sequelize.notIn]: occupiedRoomIds
                    }
                }
            });

            res.json(availableRooms);
        } catch (error) {
            console.error('Error fetching available rooms:', error);
            res.status(500).json({ error: 'An error occurred while fetching available rooms' });
        }
    }
};

module.exports = roomController;
