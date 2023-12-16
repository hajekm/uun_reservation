const express = require('express');
const router = express.Router();
const rooms = require('../controllers/roomsController.js');
const {ensureAuthenticated, isAdmin, isManager} = require('../middleware/authenticated.js');
const validator = require('../middleware/validator.js');

/**
 * @swagger
 * tags:
 *   - name: Rooms
 *     description: Operations related to rooms
 *
 * /rooms/list:
 *   get:
 *     tags: [Rooms]
 *     summary: Get a list of all rooms
 *     responses:
 *       200:
 *         description: List of rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Room'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/rooms/list', rooms.getAllRooms);

/**
 * @swagger
 * /rooms/{roomId}:
 *   put:
 *     tags: [Rooms]
 *     summary: Update a room by ID
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique ID of the room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       200:
 *         description: Room updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.put('/rooms/:roomId',
    validator.updateRoomValidationRules,
    validator.validate,
    isAdmin,
    rooms.updateRoom
);

/**
 * @swagger
 * /rooms/{roomId}:
 *   get:
 *     tags: [Rooms]
 *     summary: Get a room by its ID
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique ID of the room
 *     responses:
 *       200:
 *         description: Details of the room
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/rooms/:roomId', rooms.getRoomById);

/**
 * @swagger
 * /rooms/create:
 *   post:
 *     tags: [Rooms]
 *     summary: Create a new room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       201:
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/rooms/create',
    validator.createRoomValidationRules,
    validator.validate,
    isAdmin,
    rooms.createRoom
);

/**
 * @swagger
 * /rooms/{roomId}:
 *   delete:
 *     tags: [Rooms]
 *     summary: Delete a room by ID
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique ID of the room
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.delete('/rooms/:roomId', isAdmin, rooms.deleteRoom);

module.exports = router;
