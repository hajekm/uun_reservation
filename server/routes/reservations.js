const express = require('express');
const router = express.Router();
const reservations = require('../controllers/reservationController.js');
const { ensureAuthenticated, isAdmin, isManager } = require('../middleware/authenticated.js');
const validator = require('../middleware/validator.js');

router.get('/list', isAdmin || isManager ,reservations.getAllReservations);

router.post('/create',
    validator.createReservationValidationRules,
    validator.validate,
    ensureAuthenticated,
    reservations.createReservation
);

router.get('/:reservationId', ensureAuthenticated, reservations.getReservationById);

router.put('/:reservationId',
    validator.updateReservationValidationRules,
    validator.validate,
    ensureAuthenticated,
    reservations.updateReservation
);

router.put('/state/:reservationId',
    validator.setReservationStateRules,
    validator.validate,
    isManager || isAdmin,
    reservations.setReservationState
);

router.delete('/:reservationId', isAdmin, reservations.deleteReservation);

module.exports = router;
