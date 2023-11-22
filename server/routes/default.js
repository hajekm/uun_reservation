const express = require('express');
const router = express.Router();
const passport = require('passport');
const mockAuthMiddleware = require('../utils/mockAuth');

function authMiddleware(req, res, next) {
    if (process.env.NODE_ENV === 'googleAuthOverride') {
        return mockAuthMiddleware(req, res, next);
    } else {
        return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
    }
}

function authCallbackMiddleware(req, res, next) {
    if (process.env.NODE_ENV === 'googleAuthOverride') {
        return mockAuthMiddleware(req, res, next);
    } else {
        req.returnTo = req.session.returnTo;
        return passport.authenticate('google', { failureRedirect: '/login' })(req, res, next);
    }
}

function postAuthRedirect(req, res) {
    const redirectTo = req.returnTo || '/';
    //delete req.redirectTo;
    res.redirect(redirectTo);
}

router.get('/auth', authMiddleware);

router.get('/auth/callback', authCallbackMiddleware, postAuthRedirect);

module.exports = router;