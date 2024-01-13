const User = require('../models/user');
const Reservation = require('../models/reservation');
const UserRole = require('../models/user_role');

const userController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll({include: [UserRole]});
            res.json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({error: 'An error occurred while fetching users'});
        }
    },

    getInfo: async (req, res) => {
        try {
            const users = await User.findByPk(req.user.id,{ include: [UserRole] });
            res.json(users);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'An error occurred while fetching user' });
        }
    },

    createUser: async (req, res) => {
        try {
            const newUser = await User.create(req.body);
            res.json(newUser);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({error: 'An error occurred while creating the user'});
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await User.findByPk(req.params.userId);
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({error: 'User not found'});
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({error: 'An error occurred while fetching the user'});
        }
    },

    updateUser: async (req, res) => {
        try {
            const [updated] = await User.update(req.body, {
                where: {id: req.params.userId}
            });
            if (updated) {
                const updatedUser = await User.findByPk(req.params.userId);
                res.json(updatedUser);
            } else {
                res.status(404).json({error: 'User not found'});
            }
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({error: 'An error occurred while updating the user'});
        }
    },

    deleteUser: async (req, res) => {
        try {
            const deleted = await User.destroy({
                where: {id: req.params.userId}
            });
            const deletedReservations = await Reservation.destroy({
                where: { user_id: req.params.userId }
            });
            if (deleted) {
                res.json({message: `User with ID: ${req.params.userId} deleted`});
            } else {
                res.status(404).json({error: 'User not found'});
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({error: 'An error occurred while deleting the user'});
        }
    }
};

module.exports = userController;