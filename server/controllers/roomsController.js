const Room = require('../models/room');

const roomController = {
    getAllRooms: async (req, res) => {
        try {
            const rooms = await Room.findAll();
            res.json({ data: rooms });
        } catch (error) {
            console.error('Error fetching rooms:', error);
            res.status(500).json({ error: 'An error occurred while fetching rooms' });
        }
    },

    createRoom: async (req, res) => {
        try {
            const newRoom = await Room.create(req.body);
            res.json({ data: newRoom });
        } catch (error) {
            console.error('Error creating room:', error);
            res.status(500).json({ error: 'An error occurred while creating the room' });
        }
    },

    getRoomById: async (req, res) => {
        try {
            const room = await Room.findByPk(req.params.roomId);
            if (room) {
                res.json({ data: room });
            } else {
                res.status(404).json({ error: 'Room not found' });
            }
        } catch (error) {
            console.error('Error fetching room:', error);
            res.status(500).json({ error: 'An error occurred while fetching the room' });
        }
    },

    updateRoom: async (req, res) => {
        try {
            const [updated] = await Room.update(req.body, {
                where: { id: req.params.roomId }
            });
            if (updated) {
                const updatedRoom = await Room.findByPk(req.params.roomId);
                res.json({ data: updatedRoom });
            } else {
                res.status(404).json({ error: 'Room not found' });
            }
        } catch (error) {
            console.error('Error updating room:', error);
            res.status(500).json({ error: 'An error occurred while updating the room' });
        }
    },

    deleteRoom: async (req, res) => {
        try {
            const deleted = await Room.destroy({
                where: { id: req.params.roomId }
            });
            if (deleted) {
                res.json({ message: `Room with ID: ${req.params.roomId} deleted` });
            } else {
                res.status(404).json({ error: 'Room not found' });
            }
        } catch (error) {
            console.error('Error deleting room:', error);
            res.status(500).json({ error: 'An error occurred while deleting the room' });
        }
    }
};

module.exports = roomController;
