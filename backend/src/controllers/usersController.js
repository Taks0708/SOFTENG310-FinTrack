const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env file

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const emailExists = await userService.checkEmailExists(email);
        if (!emailExists) {
           
            return res.send({ success: false, error: 'Email does not exist' });
        }

        const passwordCorrect = await userService.checkPasswordCorrect(email, password);
        if (!passwordCorrect) {
            return res.send({ success: false, error: 'Incorrect password' });
        }

        const userId = await userService.getUserID(email);
        const token = jwt.sign({
            id: userId,
            email: email
        }, process.env.CIPHER, { expiresIn: '1d' });

        res.send({ success: true, token: token });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).send({ success: false, error: error.message });
    }
}
  
  exports.signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Checking if email exists');
        const emailExists = await userService.checkEmailExists(email);
        if (emailExists) {
            return res.send({ success: false, error: 'Email already in use' });
        }

        console.log('Creating user');
        await userService.createUser(email, password);

        console.log('Getting user ID');
        const userId = await userService.getUserID(email);
        
        console.log('Creating JWT token');
        const token = jwt.sign({
            id: userId,
            email: email
        }, process.env.CIPHER, { expiresIn: '1d' });

        res.send({ success: true, token: token });
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).send({ success: false, error: error.message });
    }
}
  
  exports.balance = async (req, res) => {
    const userID = req.user.id;
    console.log(userID);
    try {
        const result = await userService.getBalance(userID);
        console.log(result);
        res.send({ result: result });
    } catch (error) {
        console.error('Error getting balance:', error);
        res.status(500).send({ success: false, error: error.message });
    }
}

exports.goal = async (req, res) => {
    const userID = req.user.id;
    try {
        const result = await userService.getGoal(userID);
        res.send({ result: result });
    } catch (error) {
        console.error('Error getting balance:', error);
        res.status(500).send({ success: false, error: error.message });
    }
}
exports.setBalance = async(req , res) => {
    const {balance} = req.body;
    const userID = req.user.id;
    try{
        const result = await userService.setBalance(userID, balance) 
        res.send({result : result});
   }catch(error) {
        console.error('error when trying to set balance: ' , error);
        res.status(500).send({success : false , error : error.message});
   }
}
exports.setGoal = async(req , res) => {
    const {goal} = req.body;
     const userID = req.user.id;
    try{
        const result = await userService.setGoal(userID, goal) 
    res.send({result : result});
   }catch(error) {
    console.error('error when trying to set goal ' , error);
    res.status(500).send({success : false , error : error.message});
   }
}