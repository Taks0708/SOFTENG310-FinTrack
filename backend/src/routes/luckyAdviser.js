const express = require('express');
const luckyAdviserController = require('../controllers/luckyAdviserController');
const router = express.Router();

router.post('/generate-response', luckyAdviserController.getResponseForPrompt);
router.post('/lucky-advice', luckyAdviserController.getLuckyAdvice);

module.exports = router;
