const express = require('express');
const router = express.Router();
const rooms = require('../controllers/roomsController.js');
const { ensureAuthenticated, isAdmin, isManager } = require('../middleware/authenticated.js');
const validator = require('../middleware/validator.js');

router.get('/list', rooms.getAllRooms);

router.put('/:roomId',
    validator.updateRoomValidationRules,
    validator.validate,
    isAdmin,
    rooms.updateRoom
);

router.get('/:roomId', rooms.getRoomById);

router.post('/create',
    validator.createRoomValidationRules,
    validator.validate,
    isAdmin,
    rooms.createRoom
);

router.delete('/:roomId', isAdmin, rooms.deleteRoom);

module.exports = router;
