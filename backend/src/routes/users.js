const express = require("express");
const { isAuthenticated } = require("../middleware/authMiddleware");
const router = express.Router();
const usersController = require("../controllers/usersController");

/**
 * Route that takes email and password and checks it with the backend to see if the user exists and password is valid.
 * Expects: [email, password] to be sent in the request body.
 * Returns: Returns success: boolean. If successful, returns a token as well. The token should be used in headers for future validation.
 */
router.post("/login", usersController.login);

/**
 * Route that takes email and password, validates the email's originality, and creates the user in the backend.
 * Expects: [email, password] to be sent in the request body.
 * Returns: Returns success: boolean. If successful, returns a token as well. The token should be used in headers for future validation.
 */
router.post("/signup", usersController.signup);

/**
 * Route to get the balance of a user.
 * Expects: Auth token in headers.
 * Returns: User balance as a JSON object.
 */
router.get("/balance", isAuthenticated, usersController.balance);

/**
 * Route to set the balance of a user.
 * Expects: Auth token in headers as well as balance in the request body, which represents the new balance to be set.
 * Returns: success: boolean, representing if it was successful or not.
 */
router.patch("/balance", isAuthenticated, usersController.setBalance);

/**
 * Route to set the savings goal of a user.
 * Expects: Auth token in headers as well as goal in the request body, which represents the new goal to be set.
 * Returns: success: boolean, representing if it was successful or not.
 */
router.patch("/goal", isAuthenticated, usersController.setGoal);

/**
 * Route to get the goal of a user.
 * Expects: Auth token in headers.
 * Returns: User goal as a JSON object.
 */
router.get("/goal", isAuthenticated, usersController.goal);

module.exports = router;
