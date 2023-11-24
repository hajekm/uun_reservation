const Reservation = require('../models/reservation');

const reservationController = {
    getAllReservations: async (req, res) => {
        try {
            const reservations = await Reservation.findAll();
            res.json(reservations);
        } catch (error) {
            console.error('Error fetching reservations:', error);
            res.status(500).send('An error occurred while fetching reservations');
        }
    },

    createReservation: async (req, res) => {
        try {
            const newReservation = await Reservation.create(req.body);
            res.json(newReservation);
        } catch (error) {
            console.error('Error creating reservation:', error);
            res.status(500).send('An error occurred while creating the reservation');
        }
    },

    getReservationById: async (req, res) => {
        try {
            const reservation = await Reservation.findByPk(req.params.reservationId);
            if (reservation) {
                res.json(reservation);
            } else {
                res.status(404).send('Reservation not found');
            }
        } catch (error) {
            console.error('Error fetching reservation:', error);
            res.status(500).send('An error occurred while fetching the reservation');
        }
    },

    getReservationByUser: async (req, res) => {
        try {
            const userId = req.params.userId;
            const reservations = await Reservation.findAll({
                where: { user_id: userId }
            });

            if (reservations && reservations.length > 0) {
                res.json(reservations);
            } else {
                res.status(404).send('No reservations found for the given user');
            }
        } catch (error) {
            console.error('Error fetching reservations by user:', error);
            res.status(500).send('An error occurred while fetching reservations');
        }
    },


    updateReservation: async (req, res) => {
        try {
            const [updated] = await Reservation.update(req.body, {
                where: { id: req.params.reservationId }
            });
            if (updated) {
                const updatedReservation = await Reservation.findByPk(req.params.reservationId);
                res.json(updatedReservation);
            } else {
                res.status(404).send('Reservation not found');
            }
        } catch (error) {
            console.error('Error updating reservation:', error);
            res.status(500).send('An error occurred while updating the reservation');
        }
    },

    setReservationState: async (req, res) => {
        try {
            const [updated] = await Reservation.update(
                { state_id: req.body.state_id },
                { where: { id: req.params.reservationId } }
            );
            if (updated) {
                const updatedReservation = await Reservation.findByPk(req.params.reservationId);
                res.json(updatedReservation);
            } else {
                res.status(404).send('Reservation not found');
            }
        } catch (error) {
            console.error('Error setting reservation state:', error);
            res.status(500).send('An error occurred while setting reservation state');
        }
    },

    deleteReservation: async (req, res) => {
        try {
            const deleted = await Reservation.destroy({
                where: { id: req.params.reservationId }
            });
            if (deleted) {
                res.send(`Reservation with ID: ${req.params.reservationId} deleted`);
            } else {
                res.status(404).send('Reservation not found');
            }
        } catch (error) {
            console.error('Error deleting reservation:', error);
            res.status(500).send('An error occurred while deleting the reservation');
        }
    }
};

module.exports = reservationController;
