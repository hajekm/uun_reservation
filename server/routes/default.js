const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/auth',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/users/list');
    });

module.exports = router;