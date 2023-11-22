const express = require('express');
const router = express.Router();
const user = require('../controllers/userController.js');
const { ensureAuthenticated, isAdmin, isManager } = require('../middleware/authenticated.js');
const validator = require('../middleware/validator.js');

router.get('/list', isAdmin, user.getAllUsers);

router.put('/:userId',
    validator.updateUserValidationRules,
    validator.validate,
    isAdmin,
    user.updateUser
);

router.get('/:userId', isManager || isAdmin, user.getUserById);

router.post('/create',
    validator.createUserValidationRules,
    validator.validate,
    isAdmin,
    user.createUser
);

router.delete('/:userId', isAdmin, user.deleteUser);

module.exports = router;
