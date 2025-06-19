const express = require('express');
const router = express.Router();
const gcartController = require('../controllers/gcart.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', protect, gcartController.getCartItems);
router.post('/', protect, gcartController.addToCart);

module.exports = router;

