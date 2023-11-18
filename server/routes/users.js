const express = require('express');
const router = express.Router();
const passport = require('passport');
const ensureAuthenticated = require('../middleware/authenticated.js');

router.get('/list', ensureAuthenticated, (req, res) => {
    res.send('Seznam všech uživatelů (přihlášeno jako ' + req.user.displayName + ' a ' + req.user.email + ' přes google)');
});

router.post('/', (req, res) => {
    res.send('Nový uživatel přidán');
});

router.get('/:userId', ensureAuthenticated, (req, res) => {
    res.send(`Získání uživatele s ID: ${req.params.userId}`);
});

router.put('/:userId', ensureAuthenticated, (req, res) => {
    res.send(`Uživatel s ID: ${req.params.userId} aktualizován`);
});

router.delete('/:userId', ensureAuthenticated, (req, res) => {
    res.send(`Uživatel s ID: ${req.params.userId} odstraněn`);
});

module.exports = router;
