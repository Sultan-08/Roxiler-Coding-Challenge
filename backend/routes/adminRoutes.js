const express = require('express');
const router = express.Router();
const { getDashboardStats, getUsers, addUserByAdmin } = require('../controllers/adminController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.get('/dashboard/stats', verifyToken, checkRole(['SYSTEM_ADMIN']), getDashboardStats);

router.get('/users', verifyToken, checkRole(['SYSTEM_ADMIN']), getUsers);


router.post('/users', verifyToken, checkRole(['SYSTEM_ADMIN']), addUserByAdmin);

module.exports = router;