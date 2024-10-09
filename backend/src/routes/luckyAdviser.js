const express = require("express");
const luckyAdviserController = require("../controllers/luckyAdviserController");
const router = express.Router();

/**
 * Route that generate responses from the user with input.

 *  - POST /generate-response: 
 *    - Handles requests to get a response based on a user prompt.
 *    - Expects the request body to contain necessary prompt data.
 * 
 * Returns:
 *  - Response based on the controller's handling of the request, typically containing
 *    relevant advice or responses.
 */

router.post("/generate-response", luckyAdviserController.getResponseForPrompt);

/**
 * Route that generates responses and give advice for the user when the
 * I'm feeling lucky button is pressed in the frontend.
 *
 *  - POST /lucky-advice:
 *    - Provides lucky advice for the authenticated user.
 *    - Expects the request body to contain any required parameters for advice.
 *
 * Returns:
 *  - Response based on the controller's handling of the request, typically containing
 *    relevant advice or responses.
 */
router.post("/lucky-advice", luckyAdviserController.getLuckyAdvice);

module.exports = router;
