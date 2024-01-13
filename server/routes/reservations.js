const express = require('express');
const router = express.Router();
const reservations = require('../controllers/reservationController.js');
const {ensureAuthenticated, isAdmin, isManager} = require('../middleware/authenticated.js');
const validator = require('../middleware/validator.js');

/**
 * @swagger
 * tags:
 *   - name: Reservations
 *     description: Operations related to reservations
 *
 * /reservations/list:
 *   get:
 *     tags: [Reservations]
 *     summary: Retrieve a list of all reservations
 *     responses:
 *       200:
 *         description: A list of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: An error occurred while fetching reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Unauthorized access
 */
router.get('/reservations/list', isAdmin || isManager, reservations.getAllReservations);

/**
 * @swagger
 * /reservations/create:
 *   post:
 *     tags: [Reservations]
 *     summary: Create a new reservation
  *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - room_id
 *               - start_date
 *               - end_date
 *             properties:
 *               room_id:
 *                 type: integer
 *                 description: The ID of the room for the reservation
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: The start date of the reservation in ISO 8601 format
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: The end date of the reservation in ISO 8601 format
 *     responses:
 *       201:
 *         description: Reservation created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Validation error
 *       500:
 *         description: An error occurred while creating the reservation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/reservations/create',
    validator.createReservationValidationRules,
    validator.validate,
    ensureAuthenticated,
    reservations.createReservation
);

/**
 * @swagger
 * /reservations/{reservationId}:
 *   put:
 *     tags: [Reservations]
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
 *     responses:
 *       200:
 *         description: Reservation updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Reservation not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: An error occurred while updating the reservation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.put('/reservations/:reservationId',
    validator.updateReservationValidationRules,
    validator.validate,
    ensureAuthenticated,
    reservations.updateReservation
);

/**
 * @swagger
 * /reservations/state/{reservationId}:
 *   put:
 *     tags: [Reservations]
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Reservation not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: An error occurred while setting reservation state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.put('/reservations/state/:reservationId',
    validator.setReservationStateRules,
    validator.validate,
    isManager || isAdmin,
    reservations.setReservationState
);

/**
 * @swagger
 * /reservations/{reservationId}:
 *   delete:
 *     tags: [Reservations]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Reservation not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: An error occurred while deleting the reservation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Unauthorized access
 */
router.delete('/reservations/:reservationId', isAdmin, reservations.deleteReservation);

/**
 * @swagger
 * /reservations/user/{userId}:
 *   get:
 *     summary: Get reservations for a specific user
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID to fetch reservations for
 *     responses:
 *       200:
 *         description: List of reservations for the specified user
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: No reservations found for the given user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/reservations/user/:userId', reservations.getReservationByUser);

/**
 * @swagger
 * /reservations/{reservationId}:
 *   get:
 *     tags: [Reservations]
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reservation not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: An error occurred while fetching the reservation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Unauthorized access
 */
router.get('/reservations/:reservationId', ensureAuthenticated, reservations.getReservationById);

module.exports = router;
