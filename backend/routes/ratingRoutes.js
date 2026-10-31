const express = require('express');
const router = express.Router();
const { submitRating } = require('../controllers/ratingController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// POST /api/ratings

router.post('/', verifyToken, checkRole(['NORMAL_USER']), submitRating);

module.exports = router;