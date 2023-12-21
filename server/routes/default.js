const express = require('express');
const router = express.Router();
const passport = require('passport');
const mockAuthMiddleware = require('../utils/mockAuth');

function authMiddleware(req, res, next) {
    if (process.env.NODE_ENV === 'googleAuthOverride') {
        return mockAuthMiddleware(req, res, next);
    } else {
        return passport.authenticate('google', {scope: ['profile', 'email']})(req, res, next);
    }
}

function authCallbackMiddleware(req, res, next) {
    if (process.env.NODE_ENV === 'googleAuthOverride') {
        return mockAuthMiddleware(req, res, next);
    } else {
        req.returnTo = req.session.returnTo;
        return passport.authenticate('google', {failureRedirect: '/login'})(req, res, next);
    }
}

function postAuthRedirect(req, res) {
    const redirectTo = 'http://localhost:3000'; //req.returnTo || 
    //delete req.redirectTo;
    res.redirect(redirectTo);
}

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     googleOAuth:
 *       type: oauth2
 *       flows:
 *         authorizationCode:
 *           authorizationUrl: https://accounts.google.com/o/oauth2/v2/auth
 *           tokenUrl: https://oauth2.googleapis.com/token
 *           scopes: { }
 *           x-client-id: 657224920436-sk7p2u3drrib3drg2ni29t1atggi90nf.apps.googleusercontent.com
 */
/**
 * @swagger
 * security:
 *   - googleOAuth: []
 */
router.get('/auth', authMiddleware);

router.get('/auth/callback', authCallbackMiddleware, postAuthRedirect);

module.exports = router;