
const {getUserTransactionsByPage , makeTransaction, deleteTransaction,getAllTransactions} = require('../services/transactionService')
const jwt = require('jsonwebtoken');

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
exports.allTransactions = async(req , res) =>{
    const userID = req.user.id;
    try{
       const result =  await getAllTransactions(userID );
       res.status(200).send({sucess : true , result : result})
    }catch{
        console.error('Error when getting transactions' , error);
        res.status(500).send({ success: false, error: error.message });
    }
}

