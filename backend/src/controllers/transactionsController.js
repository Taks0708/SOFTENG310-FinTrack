const {getUserTransactionsByPage , makeTransaction, deleteTransaction,getAllTransactions} = require('../services/transactionService')
const jwt = require('jsonwebtoken');

/**
 * route that creates a new transaction and calls the makeTransaction function to perform an SQL query
 */
exports.transaction = async (req, res) => { 
    const {amount,title,description} = req.body;
    const userID = req.user.id;
    try {
        await makeTransaction(userID , amount , title , description );
        res.send({ success: true });
    } catch (error) {
        console.error('Error making transactions', error);
        res.status(500).send({ success: false, error: error.message });
    }
}

/**
 * route that gets the transactions of a user by page (in blocks of 10) and calls the getUserTransactionsByPage function to perform an SQL query
 * a page number is required to get the transactions
 * order is given from oldest to newest
 */
exports.transactions = async(req , res) =>{
    const {pageNumber} = req.params;
    const userID = req.user.id;
    try{
       const result =  await getUserTransactionsByPage(userID , pageNumber);
       res.status(200).send({sucess : true , result : result})
    }catch{
        console.error('Error when getting transactions' , error);
        res.status(500).send({ success: false, error: error.message });
    }
}

/**
 * route that deletes a transaction and calls the deleteTransaction function to perform an SQL query
 */
exports.deleteTransaction = async(req , res) =>{
    const {transactionID} = req.params;
    const userID = req.user.id;
    try{
       const result =  await deleteTransaction(userID , transactionID);
       res.status(200).send({sucess : true , result : result})
    }catch{
        console.error('Error when getting transactions' , error);
        res.status(500).send({ success: false, error: error.message });
    }
}

/**
 * route that gets all transactions of a user and calls the getAllTransactions function to perform an SQL query
 * order is given from newest to oldest
 */
exports.allTransactions = async(req , res) =>{
    const userID = req.user.id;
    try{
       const result =  await getAllTransactions(userID);
       res.status(200).send({sucess : true , result : result})
    }catch{
        console.error('Error when getting transactions' , error);
        res.status(500).send({ success: false, error: error.message });
    }
}

