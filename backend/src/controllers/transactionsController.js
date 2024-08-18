const transactionService = require('../services/transactionService')
const jwt = require('jsonwebtoken');

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

