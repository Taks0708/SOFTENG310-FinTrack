const express = require('express');
const { isAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();
const jwt = require('jsonwebtoken');
const transactionController = require('../controllers/transactionsController');

/**
 * Route that creates a new transaction in the database for the authenticated user.
 * Expects:
 *  - Auth token in headers.
 *  - Request body: [title, amount, description], representing each name for the transaction to be made.
 * Returns:
 *  - Returns success: boolean.
 */
router.post('/', isAuthenticated, transactionController.transaction);

/**
 * Route that deletes a transaction from the database.
 * Expects:
 *  - Auth token in headers.
 *  - transactionID in the params representing the transaction to be deleted.
 * Returns:
 *  - Returns success: boolean.
 */
router.delete('/:transactionID', isAuthenticated, transactionController.deleteTransaction);

/**
 * Route that gets the transactions of a user ordered by the date they were created. 
 * It returns the transactions page by page depending on params.
 * Expects:
 *  - Auth token in headers.
 *  - pageNumber in the params.
 * Returns:
 *  - The transactions of the user in JSON form stored in an array.
 */
router.get('/page/:pageNumber', isAuthenticated, transactionController.transactions);

/**
 * Route that gets the transactions of a user ordered by the date they were created. 
 * It returns all the transactions.
 * Expects:
 *  - Auth token in headers.
 * Returns:
 *  - The transactions of the user in JSON form stored in an array.
 */
router.get('/', isAuthenticated, transactionController.allTransactions);

module.exports = router;
