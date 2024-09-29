const transactionService = require('../services/transactionService')

const jwt = require('jsonwebtoken');

/**
 * route that creates a new transaction and calls the makeTransaction function to perform an SQL query
 */
exports.transaction = async (req, res) => { 
    const {amount,title,description} = req.body;
    const userID = req.user.id;
    try {
        await transactionService.makeTransaction(userID , amount , title , description );
        res.send({ success: true });
    } catch (error) {
        console.error('Error making transactions', error);
        res.status(500).send({ success: false, error: error.message });
    }
}


/**
 * route that edits a current transaction and calls the editUser function to perform an SQL query
 */
exports.editTransaction = async(req, res) => {
    const {transactionID} = req.params;
    const userID = req.user.id;
    const {title,amount,description} = req.body;
    try{
        console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n"+transactionID+userID+title+amount+description);
        const oldVals =  await transactionService.getTransaction(transactionID,userID);
        
        await transactionService.editTransaction(transactionID,userID,title,amount,description,oldVals[0].amount);
        res.status(200).send({sucess : true})
     }catch (error) {
         console.error('Error when editting transaction' , error);
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
       const result =  await transactionService.getUserTransactionsByPage(userID , pageNumber);
       res.status(200).send({sucess : true , result : result})
    }catch (error) {
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
       const result =  await transactionService.deleteTransaction(userID , transactionID);
       res.status(200).send({sucess : true , result : result})
    }catch (error){
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
       const result =  await transactionService.getAllTransactions(userID);
       res.status(200).send({sucess : true , result : result})
    }catch (error){
        console.error('Error when getting transactions' , error);
        res.status(500).send({ success: false, error: error.message });
    }
}

