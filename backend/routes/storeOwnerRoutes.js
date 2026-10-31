const express = require('express');
const router = express.Router();
const { getOwnerDashboard } = require('../controllers/storeOwnerController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// GET /api/owner/dashboard

router.get('/dashboard', verifyToken, checkRole(['STORE_OWNER']), getOwnerDashboard);

module.exports = router;