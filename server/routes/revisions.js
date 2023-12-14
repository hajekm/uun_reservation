const express = require('express');
const router = express.Router();
const revision = require('../controllers/revisionController.js');
const { ensureAuthenticated, isAdmin, isManager } = require('../middleware/authenticated.js');

/**
 * @swagger
 * /revisions/list:
 *   get:
 *     tags:
 *       - Revisions
 *     summary: List all revisions
 *     description: Retrieve a list of all revision entries.
 *     security:
 *       - adminAuth: []
 *     responses:
 *       200:
 *         description: A list of revisions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Revision'
 *       401:
 *         description: Unauthorized, only accessible by admins
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 * components:
 *   schemas:
 *     Revision:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         model:
 *           type: string
 *           example: 'Reservation'
 *         document:
 *           type: object
 *           example: { "field": "value" }
 *         operation:
 *           type: string
 *           example: 'create'
 *         documentId:
 *           type: integer
 *           example: 10
 *         revision:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2023-01-01T00:00:00.000Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: '2023-01-01T01:00:00.000Z'
 */
router.get('/revisions/list', revision.getAllRevisions);

module.exports = router;
