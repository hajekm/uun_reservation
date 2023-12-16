const { body, validationResult } = require('express-validator');

const createUserValidationRules = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Must be a valid email address'),
    body('password').optional().isEmpty().withMessage('Password must not be set')
];

const updateUserValidationRules = [
    body('username').optional().notEmpty().withMessage('Username cannot be empty'),
    body('email').optional().isEmail().withMessage('Must be a valid email address'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const createRoomValidationRules = [
    body('room_number')
        .notEmpty().withMessage('Room number is required')
        .isInt().withMessage('Room number must be an integer')
        .toInt(),
    body('type_id').optional().isInt().withMessage('Type ID must be an integer').toInt(),
    body('description').notEmpty().withMessage('Description is required')
        .isString().withMessage('Description must be a string').trim(),
    body('price').notEmpty().withMessage('Price is required')
        .isDecimal().withMessage('Price must be a decimal number').toFloat(),
    body('beds').optional().isInt({ min: 1 })
        .withMessage('Number of beds must be an integer greater than 0').toInt(),
    body('options').optional().isString().withMessage('Options must be a string').trim()
];

const updateRoomValidationRules = [
    body('room_number').optional()
        .isInt().withMessage('Room number must be an integer').toInt(),

    body('type_id').optional()
        .isInt().withMessage('Type ID must be an integer').toInt(),

    body('description').optional()
        .isString().withMessage('Description must be a string').trim(),

    body('price').optional()
        .isDecimal().withMessage('Price must be a decimal number').toFloat(),

    body('beds').optional()
        .isInt({ min: 1 }).withMessage('Number of beds must be an integer greater than 0').toInt(),

    body('options').optional().isString().withMessage('Options must be a string').trim()
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
    console.log(extractedErrors);
    return res.status(422).json({
        error: extractedErrors,
    });
};

const createReservationValidationRules = [
    body('room_id')
        .notEmpty().withMessage('Room ID is required')
        .isInt().withMessage('Room ID must be an integer')
        .toInt(),
    body('start_date')
        .notEmpty().withMessage('Start date is required')
        .isISO8601().withMessage('Start date must be a valid date'),
    body('end_date')
        .notEmpty().withMessage('End date is required')
        .isISO8601().withMessage('End date must be a valid date')
];

const updateReservationValidationRules = [
    body('user_id').optional()
        .isInt().withMessage('User ID must be an integer').toInt(),
    body('room_id').optional()
        .isInt().withMessage('Room ID must be an integer').toInt(),
    body('start_date').optional()
        .isISO8601().withMessage('Start date must be a valid date'),
    body('end_date').optional()
        .isISO8601().withMessage('End date must be a valid date'),
    body('state_id').optional()
        .isInt().withMessage('State ID must be an integer').trim()
];

const setReservationStateRules = [
    body('state_id').notEmpty()
        .isInt().withMessage('State ID must be an integer').trim()
];

module.exports = {
    createUserValidationRules,
    updateUserValidationRules,
    validate,
    createRoomValidationRules,
    updateRoomValidationRules,
    createReservationValidationRules,
    updateReservationValidationRules,
    setReservationStateRules
};