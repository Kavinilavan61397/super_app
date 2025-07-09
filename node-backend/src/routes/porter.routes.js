const express = require('express');
const router = express.Router();
const porterController = require('../controllers/porter.controller');

router.post('/', porterController.createPorter);
router.get('/:id', porterController.getPorter);
router.get('/', porterController.listPorters);
router.put('/:id', porterController.updatePorter);

module.exports = router; 