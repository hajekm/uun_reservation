const express = require('express');
const router = express.Router();
const rooms = require('../controllers/roomsController.js');
const { ensureAuthenticated, isAdmin, isManager } = require('../middleware/authenticated.js');
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
 *       500:
 *         description: Internal server error
 */
router.get('/list', rooms.getAllRooms);

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
 *             type: object
 *             properties:
 *               room_number:
 *                 type: integer
 *                 description: Number of the room
 *               type_id:
 *                 type: integer
 *                 description: ID of the room type
 *               description:
 *                 type: string
 *                 description: Description of the room
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Price of the room
 *               beds:
 *                 type: integer
 *                 description: Number of beds in the room
 *               options:
 *                 type: string
 *                 description: Additional options for the room
 *     responses:
 *       200:
 *         description: Room updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 */
router.put('/:roomId',
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
 *           type: string
 *         description: Unique ID of the room
 *     responses:
 *       200:
 *         description: Details of the room
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 */
router.get('/:roomId', rooms.getRoomById);

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
 *             type: object
 *             required:
 *               - room_number
 *               - description
 *               - price
 *             properties:
 *               room_number:
 *                 type: integer
 *                 description: Number of the room
 *               type_id:
 *                 type: integer
 *                 description: ID of the room type
 *               description:
 *                 type: string
 *                 description: Description of the room
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Price of the room
 *               beds:
 *                 type: integer
 *                 description: Number of beds in the room
 *               options:
 *                 type: string
 *                 description: Additional options for the room
 *     responses:
 *       201:
 *         description: Room created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/create',
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
 *           type: string
 *         description: Unique ID of the room
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:roomId', isAdmin, rooms.deleteRoom);

module.exports = router;
