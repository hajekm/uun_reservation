const User = require('../models/user');

const userController = {
    getAllUsers: async (req, res) => {
        res.send('Všechny uživatele (pøihlášeno)');
    },

    createUser: async (req, res) => {
        res.send('Uživatel vytvoøen');
    },

    getUserById: async (req, res) => {
        res.send(`Uživatel s ID: ${req.params.userId}`);
    },

    updateUser: async (req, res) => {
        res.send(`Uživatel s ID: ${req.params.userId} aktualizován`);
    },

    deleteUser: async (req, res) => {
        res.send(`Uživatel s ID: ${req.params.userId} odstranìn`);
    }
};

module.exports = userController;
