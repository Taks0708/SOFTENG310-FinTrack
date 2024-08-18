const pool = require('../config/db');
const { hashPassword, comparePasswords } = require('./securePassword');

/**
 * Takes in user email and returns the id of the user, the reason for this is purely for future proofing incase it is needed 
 * it may not be used but would rather have it than not
 * @param {String} email 
 * @returns 
 */
const getUserID = async (email) => {
    try {
        const query = {
            text: 'SELECT id FROM users WHERE email = $1',
            values: [email],
        };
        const result = await pool.query(query);
        if (result.rows.length > 0) {
            return result.rows[0].id;
        } else {
            return null;
        }
    } catch (error) {
        console.error('An error occurred while getting user ID:', error);
        throw error;
    }
}
/**
 * Queries the database to check if the given email exists , this is used in conjuction with the controller for login and 
 * signup to ensure that the user exists so not to create duplicates of a user
 * @param {String} email 
 * @returns 
 */
const checkEmailExists = async (email) => {
    const query = {
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email],
    };
    const result = await pool.query(query);
    return result.rows.length > 0;
}

const checkPasswordCorrect = async (email, password) => {
    const query = {
        text: 'SELECT password FROM users WHERE email = $1',
        values: [email],
    };
    try{const result = await pool.query(query);
    if (result.rows.length === 0) {
        return false;
    }
    const hashedPassword = result.rows[0].password;
    const passwordsMatch =  await comparePasswords(password, hashedPassword);
    return passwordsMatch;
}
    catch(error){

        console.error('An error occurred while checking password:', error);
        return false; 
    }
    
}
/**
 * creates user in the database , we hash the password so as not to store it in plain text. Then we check if the user exists
 * this is to ensure that we dont create the user twice in the system
 * @param {String} email 
 * @param {String} password 
 */
const createUser = async (email, password) => {
    try {
        password = await hashPassword(password); 
        const query = {
            text: 'INSERT INTO users (email, password) VALUES ($1, $2)',
            values: [email, password],
        };
        //check user does not exist
        const userExists = await checkEmailExists(email);
        if (userExists) {
            throw new Error('User already exists');
        }
        else {
            await pool.query(query);
        }
    } catch (error) {
        // error
        console.error('An error occurred while creating user:', error);
        throw error;
    }
}
/**
 * gets the balance from the database of the specified user
 * 
 * @param {int} userID 
 * @returns  {int} result 
 */
const getBalance = async (userID) => {
    try {
        const query  = {
            text: 'SELECT balance FROM users WHERE id = $1' ,
            values : [userID]
        }
        try {
            const result = await pool.query(query);
            return result.rows[0];
        } catch (error){
            console.error ("problem when fetching balance" , error);
        }
    }catch{
        console.error("problem before query", error);
    }
}
/**
 * gets the savings goal from the database of the specified user
 * 
 * @param {int} userID 
 * @returns {int} result
 */
const getGoal = async (userID) => {
    try {
        const query  = {
            text: 'SELECT saving_goal FROM users WHERE id = $1' ,
            values : [userID]
        }
        try {
            const result = await pool.query(query);
            return result.rows[0];
        } catch (error){
            console.error ("problem when fetching balance" , error);
        }
    }catch{
        console.error("problem before query", error);
    }
}
/**
 * sets the balance from the database of the specified user , for when the users wants to change how much they have incase they made a mistake
 * 
 * @param {int} userID 
 * @returns success: message:
 */
const setBalance = async (userID, newBalance) => {
    try {
        const query = {
            text: 'UPDATE users SET balance = $1 WHERE id = $2',
            values: [newBalance, userID],
        };
        const result = await pool.query(query);
        if (result.rowCount > 0) {
            return { success: true, message: 'Balance updated successfully' };
        } else {
            return { success: false, message: 'User not found' };
        }
    } catch (error) {
        console.error('An error occurred while updating balance:', error);
        throw error;
    }
};
/**
 * sets the goal from the database of the specified user
 * 
 * @param {int} userID 
 * @returns success: message:
 */
const setGoal= async (userID, goal) => {
    try {
        const query = {
            text: 'UPDATE users SET saving_goal = $1 WHERE id = $2',
            values: [goal, userID],
        };
        const result = await pool.query(query);
        if (result.rowCount > 0) {
            return { success: true, message: 'Goal updated successfully' };
        } else {
            return { success: false, message: 'User not found' };
        }
    } catch (error) {
        console.error('An error occurred while updating balance:', error);
        throw error;
    }
};






module.exports = {
    checkEmailExists,
    checkPasswordCorrect,
    createUser, 
    getUserID,
    getBalance,
    getGoal,
    setBalance,
    setGoal
};