const pool = require("../config/db");

/**
 * returns the users transactions based off the pageSize variable which changes how many we want to return
 * this is done so that you can easily get transactions page wise.
 * @param {int} userID
 * @param {int} pageNumber
 * @var {int} pageSize // change this to change the number of transactions returned
 * @returns
 */

const getUserTransactionsByPage = async (userID, pageNumber) => {
    const pageSize = 10;
    const offset = (pageNumber - 1) * pageSize;
    try {
        const query = {
            text: `
                SELECT * FROM transactions 
                WHERE user_id = $1 
                ORDER BY created_at ASC 
                LIMIT $2 
                OFFSET $3
            `,
            values: [userID, pageSize, offset],
        };
        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error("error when getting transactions", error);
            throw error;
        }
    } catch (error) {
        console.error("error in function start", error);
        throw error;
    }
};
/**
 * returns a single transaction based on transaction id and userID
 * this is done so that you can easily get a single transaction.
 * @param {int} userID
 * @param {int} transactionID
 * @returns query result table
 */
const getTransaction = async (id, userID) => {
    try {
        const query = {
            text: "SELECT * FROM transactions WHERE id = $1 AND user_id = $2",
            values: [id, userID],
        };

        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error("error when getting a transaction", error);
        throw error;
    }
};

/**
 * creates a transaction , we add it to the database , the reason that we update the balance is because transactions should
 * directly corrolate with the users balance so we update that as needed based on the amount. We add the amount given so that
 * if the value is a negative we will subtract by adding
 * @param {int} userID
 * @param {DoubleRange} amount
 * @param {String} title
 * @param {String} description
 */

const makeTransaction = async (userID, amount, title, description) => {
    try {
        const addTransactionQuery = {
            text: "INSERT INTO transactions (user_id , amount , title , description) VALUES ($1, $2, $3, $4)",
            values: [userID, amount, title, description],
        };
        const changeBalanceQuery = {
            text: "UPDATE users SET balance = balance + $1 WHERE id = $2",
            values: [amount, userID],
        };
        try {
            await pool.query(addTransactionQuery);
            await pool.query(changeBalanceQuery);
            console.log(
                `succesfuly made transaction user_id : ${userID} , amount : ${amount} , title : ${title} , description : ${description}`
            );
        } catch (error) {
            console.error("Error updating balance:", error);
            throw error;
        }
    } catch (error) {
        console.error("problem with decrease balance function", error);
        throw error;
    }
};

/**
 * editted a transaction , the reason that we update the balance is because transactions should
 * directly corrolate with the users balance so we update that as needed based on the amount. We add the amount given so that
 * if the value is a negative we will subtract by adding
 * @param {int} userID
 * @param {int} transactionID
 * @param {DoubleRange} amount
 * @param {String} title
 * @param {String} description
 *
 */
const editTransaction = async (
    transactionID,
    userID,
    title,
    amount,
    description
) => {
    try {
        let oldAmount = null;
        //gets the origional values of the transaction
        try {
            const oldVals = await getTransaction(transactionID, userID);

            //checks we are not returning null.
            if (oldVals.length == 0) {
                return {
                    success: false,
                    message: "Transaction not found or does not belong to user",
                };
            }
            oldAmount = oldVals[0].amount;

            if (oldAmount == null) {
                return {
                    success: false,
                    message: "Transaction not found or does not belong to user",
                };
            }
        } catch (error) {
            console.error("Error getting the transaction to be editted", error);
            throw error;
        }

        const changeBalanceQuery = {
            text: "UPDATE users SET balance = balance - $1 + $2 WHERE id = $3",
            values: [oldAmount, amount, userID],
        };

        const editTransactionQuery = {
            text: "UPDATE transactions SET amount = $3, title = $4, description = $5 WHERE id = $1 AND user_id = $2 ",
            values: [transactionID, userID, amount, title, description],
        };

        await pool.query(editTransactionQuery);
        await pool.query(changeBalanceQuery);

        console.log(
            `Succesfuly editted transaction id: ${transactionID} , user_id : ${userID} , amount : ${amount} , title : ${title} , description : ${description}, oldAmount: ${oldAmount}`
        );

        return {
            success: true,
            message: `Succesfuly editted transaction id: ${transactionID} , user_id : ${userID} , amount : ${amount} , title : ${title} , description : ${description}`,
        };
    } catch (error) {
        console.error("Error editting the transaction", error);
        throw error;
    }
};

/**
 * Deletes a transaction from the users transactions , when doing this we firstly get the transaction amount so that we can also
 * update the users balance so that it no longer reflects the deleted transactions
 * @param {int} userID
 * @param {int} transactionID
 * @returns
 */

const deleteTransaction = async (userID, transactionID) => {
    try {
        // Retrieve the transaction amount to adjust the balance later
        const getTransactionAmountQuery = {
            text: "SELECT amount FROM transactions WHERE id = $1 AND user_id = $2",
            values: [transactionID, userID],
        };
        const result = await pool.query(getTransactionAmountQuery);

        if (result.rows.length === 0) {
            return {
                success: false,
                message: "Transaction not found or does not belong to user",
            };
        }

        const amount = result.rows[0].amount;

        // Delete the transaction
        const deleteTransactionQuery = {
            text: "DELETE FROM transactions WHERE id = $1 AND user_id = $2",
            values: [transactionID, userID],
        };

        // Update the user's balance
        const updateBalanceQuery = {
            text: "UPDATE users SET balance = balance - $1 WHERE id = $2",
            values: [amount, userID],
        };

        await pool.query(deleteTransactionQuery);
        await pool.query(updateBalanceQuery);

        return {
            success: true,
            message: "Transaction deleted and balance updated successfully",
        };
    } catch (error) {
        console.error("Error deleting transaction:", error);
        throw error;
    }
};

/**
 * returns the all of the users transactions in decending order of created at (newest to oldest)
 * @param {int} userID
 * @returns
 */

const getAllTransactions = async (userID) => {
    try {
        const query = {
            text: `
                SELECT * FROM transactions 
                WHERE user_id = $1 
                ORDER BY created_at DESC 
            `,
            values: [userID],
        };
        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error("error when getting transactions", error);
            throw error;
        }
    } catch (error) {
        console.error("error in function start", error);
        throw error;
    }
};
module.exports = {
    getAllTransactions,
    getTransaction,
    makeTransaction,
    getUserTransactionsByPage,
    deleteTransaction,
    editTransaction,
};
