const express = require('express');
const router = express.Router();
const { getDashboardStats, getUsers, addUserByAdmin } = require('../controllers/adminController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// GET /api/admin/dashboard/stats
router.get('/dashboard/stats', verifyToken, checkRole(['SYSTEM_ADMIN']), getDashboardStats);

// GET /api/admin/users
router.get('/users', verifyToken, checkRole(['SYSTEM_ADMIN']), getUsers);


router.post('/users', verifyToken, checkRole(['SYSTEM_ADMIN']), addUserByAdmin);

module.exports = router;