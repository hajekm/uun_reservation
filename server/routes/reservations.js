const express = require('express');
const router = express.Router();
const reservations = require('../controllers/reservationController.js');
const { ensureAuthenticated, isAdmin, isManager } = require('../middleware/authenticated.js');
const validator = require('../middleware/validator.js');

/**
 * @swagger
 * /reservations/list:
 *   get:
 *     summary: Retrieve a list of all reservations
 *     responses:
 *       200:
 *         description: A list of reservations
 *       401:
 *         description: Unauthorized access
 */
router.get('/list', isAdmin || isManager ,reservations.getAllReservations);

/**
 * @swagger
 * /reservations/create:
 *   post:
 *     summary: Create a new reservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - room_id
 *               - start_date
 *               - end_date
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID of the user
 *               room_id:
 *                 type: integer
 *                 description: ID of the room
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 description: Start date of the reservation
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 description: End date of the reservation
 *               state_id:
 *                 type: integer
 *                 description: ID of the reservation state
 *     responses:
 *       201:
 *         description: Reservation created
 *       400:
 *         description: Validation error
 */
router.post('/create',
    validator.createReservationValidationRules,
    validator.validate,
    ensureAuthenticated,
    reservations.createReservation
);

/**
 * @swagger
 * /reservations/{reservationId}:
 *   get:
 *     summary: Get a reservation by its ID
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The reservation ID
 *     responses:
 *       200:
 *         description: Reservation data
 *       404:
 *         description: Reservation not found
 *       401:
 *         description: Unauthorized access
 */
router.get('/:reservationId', ensureAuthenticated, reservations.getReservationById);

/**
 * @swagger
 * /reservations/{reservationId}:
 *   put:
 *     summary: Update a reservation
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID of the user
 *               room_id:
 *                 type: integer
 *                 description: ID of the room
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 description: Start date of the reservation
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 description: End date of the reservation
 *               state_id:
 *                 type: integer
 *                 description: ID of the reservation state
 *     responses:
 *       200:
 *         description: Reservation updated
 *       400:
 *         description: Validation error
 */
router.put('/:reservationId',
    validator.updateReservationValidationRules,
    validator.validate,
    ensureAuthenticated,
    reservations.updateReservation
);

/**
 * @swagger
 * /reservations/state/{reservationId}:
 *   put:
 *     summary: Set the state of a reservation
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - state_id
 *             properties:
 *               state_id:
 *                 type: integer
 *                 description: New state ID for the reservation
 *     responses:
 *       200:
 *         description: Reservation state updated
 *       400:
 *         description: Validation error
 */
router.put('/state/:reservationId',
    validator.setReservationStateRules,
    validator.validate,
    isManager || isAdmin,
    reservations.setReservationState
);

/**
 * @swagger
 * /reservations/{reservationId}:
 *   delete:
 *     summary: Delete a reservation
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The reservation ID
 *     responses:
 *       200:
 *         description: Reservation deleted
 *       404:
 *         description: Reservation not found
 *       401:
 *         description: Unauthorized access
 */
router.delete('/:reservationId', isAdmin, reservations.deleteReservation);

module.exports = router;
