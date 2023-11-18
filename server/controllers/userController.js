const User = require('../models/user');

const userController = {
    getAllUsers: async (req, res) => {
        res.send('V�echny u�ivatele (p�ihl�eno)');
    },

    createUser: async (req, res) => {
        res.send('U�ivatel vytvo�en');
    },

    getUserById: async (req, res) => {
        res.send(`U�ivatel s ID: ${req.params.userId}`);
    },

    updateUser: async (req, res) => {
        res.send(`U�ivatel s ID: ${req.params.userId} aktualizov�n`);
    },

    deleteUser: async (req, res) => {
        res.send(`U�ivatel s ID: ${req.params.userId} odstran�n`);
    }
};

module.exports = userController;
