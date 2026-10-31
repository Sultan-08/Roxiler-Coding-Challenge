const express = require('express');
const router = express.Router();
const { addStore, getStores } = require('../controllers/storeController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, addStore);
router.get('/', verifyToken, getStores);

module.exports = router;