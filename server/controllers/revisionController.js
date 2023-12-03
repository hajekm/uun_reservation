const Revision = require('../models/revision');

const revisionsController = {
    getAllRevisions: async (req, res) => {
        try {
            const revisions = await Revision.findAll();
            res.json(revisions);
        } catch (error) {
            console.error('Error fetching revisions:', error);
            res.status(500).json({ error: 'An error occurred while fetching revisions' });
        }
    }
};

module.exports = revisionsController;
