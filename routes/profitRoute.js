const express = require('express');
const router = express.Router();
const profitController = require('../controllers/profitController');

router.get('/', profitController.getProfitPercentage);
router.put('/', profitController.updateProfitPercentage);

module.exports = router;
