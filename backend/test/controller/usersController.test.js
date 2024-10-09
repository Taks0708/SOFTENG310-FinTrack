const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const userController = require('../../src/controllers/usersController');
const userService = require('../../src/services/userService');

/**
* Unit tests for the usersController
* 
* This file contains unit tests for the usersController.
* It uses the Sinon library to stub the functions of the userService,
* and uses Chai to make assertions.
* @module usersController
* @dependencies chai, sinon, jwt, transactionsController, transactionService
*/
describe('usersController', () => {

    let req, res;
    let testPassword = 'test'
    let testEmail = 'test'
    
    // Set up the req and res objects before each test
    beforeEach(() => {
      req = { body: {}, user: {} }; // Set up a req object with a body and user object
      res = {
        send: sinon.stub(), // Stub the send function
        status: sinon.stub().returnsThis(), // Stub the status function
      };
    });
    
    // Restore the stubbed functions after each test
    afterEach(() => {
      sinon.restore(); 
    });

    // Test the login function
    describe('login', () => {
      // Test the login function when the login is successful
        it('should return token on successful login', async () => {
          // Set up the req object
          req.body = { email: testEmail, password: testPassword };

          // Stub functions to mock valid login
          sinon.stub(userService, 'checkEmailExists').resolves(true);
          sinon.stub(userService, 'checkPasswordCorrect').resolves(true);
          sinon.stub(userService, 'getUserID').resolves(1);
          sinon.stub(jwt, 'sign').returns('fakeToken');
          
          // Call the login function
          await userController.login(req, res);
          
          // Check if the send function was successful
          expect(res.send.calledWith({ success: true, token: 'fakeToken' })).to.be.true;

        });
        
        // Test the login function when the email does not exist
        it('should return error if email does not exist', async () => {
            // Set up the req object
            req.body = { email: testEmail, password: testPassword };

            // Stub functions to mock invalid email
            sinon.stub(userService, 'checkEmailExists').resolves(false);
            
            // Call the login function
            await userController.login(req, res);
          
            // Check if the send function was unsuccessful
            expect(res.send.calledWith({ success: false, error: 'Email does not exist' })).to.be.true;
        });
        
        // Test the login function when the password is incorrect
        it('should return error if password is incorrect', async () => {
            // Set up the req object
            req.body = { email: testEmail, password: testPassword };

            // Stub functions to mock invalid password
            sinon.stub(userService, 'checkEmailExists').resolves(true);
            sinon.stub(userService, 'checkPasswordCorrect').resolves(false);

            // Call the login function
            await userController.login(req, res);

            // Check if the send function was unsuccessful
            expect(res.send.calledWith({ success: false, error: 'Incorrect password' })).to.be.true;
        });

        // Test the login function when an error occurs
        it('should return error if an error occurs during login', async () => {
            // Set up the req object
            req.body = { email: testEmail, password: testPassword };

            // Stub the checkEmailExists function to reject with an error
            sinon.stub(userService, 'checkEmailExists').rejects(new Error('An error occurred'));

            // Call the login function
            await userController.login(req, res);
        
            expect(res.status.calledWith(500)).to.be.true; // Expect response status to be 500
            expect(res.send.calledWith({ success: false, error: 'An error occurred' })).to.be.true; // Expect response to contain an error message
        });
    });

    // Test the signup function
    describe('signup', () => {
        // Test the signup function when the signup is successful
        it('should return token on successful signup', async () => {
          // Set up the req object
          req.body = { email: testEmail, password: testPassword };

          // Stub functions to mock valid signup
          sinon.stub(userService, 'checkEmailExists').resolves(false);
          sinon.stub(userService, 'createUser');
          sinon.stub(userService, 'getUserID').resolves(1);
          sinon.stub(jwt, 'sign').returns('fakeToken');
          
          // Call the signup function
          await userController.signup(req, res);
          
          // Check if the send function was successful
          expect(res.send.calledWith({ success: true, token: 'fakeToken' })).to.be.true;
        });
        
        // Test the signup function when the email already exists
        it('should return error if email already in use', async () => {
          // Set up the req object
          req.body = { email: testEmail, password: testPassword };

          // Stub functions to mock email already in use
          sinon.stub(userService, 'checkEmailExists').resolves(true);
          
          // Call the signup function
          await userController.signup(req, res);
          
          // Check if the send function was unsuccessful because of email already in use
          expect(res.send.calledWith({ success: false, error: 'Email already in use' })).to.be.true;
        });

        // Test the signup function when an error occurs
        it('should return error if an error occurs during signup', async () => {
            // Set up the req object
            req.body = { email: testEmail, password: testPassword };

            // Stub the checkEmailExists function to reject with an error
            sinon.stub(userService, 'checkEmailExists').rejects(new Error('An error occurred'));

            // Call the signup function
            await userController.signup(req, res);
        
            expect(res.status.calledWith(500)).to.be.true; // Expect response status to be 500
            expect(res.send.calledWith({ success: false, error: 'An error occurred' })).to.be.true; // Expect response to contain an error message
        });
    });

    // Test the balance function
    describe('balance', () => {
        // Test the balance function when the balance is successful
        it('should return balance', async () => {
          // Set up the req object
          req.user = { id: 1 };

          // Stub the getBalance function to resolve with a balance of 100
          sinon.stub(userService, 'getBalance').resolves(100);
          
          // Call the balance function
          await userController.balance(req, res);
          
          // Check if the send function was successful
          expect(res.send.calledWith({ result: 100 })).to.be.true;
        });
        
        // Test the balance function when an error occurs
        it('should return error if an error occurs during balance check', async () => {
          // Set up the req object
          req.user = { id: 1 };

          // Stub the getBalance function to reject with an error
          sinon.stub(userService, 'getBalance').rejects(new Error('An error occurred'));
          
          // Call the balance function
          await userController.balance(req, res);
    
          expect(res.status.calledWith(500)).to.be.true; // Expect response status to be 500
          expect(res.send.calledWith({ success: false, error: 'An error occurred' })).to.be.true; // Expect response to contain an error message
        });
    });

    // Test the setBalance function
    describe('setBalance', () => {
      // Test the setBalance function when the balance is successful
        it('should return balance', async () => {
          req.user = { id: 1 }; // Set up the req object
          req.body = { balance: 100 }; // Set up the req body

          // Stub the setBalance function to resolve with a balance of 100
          sinon.stub(userService, 'setBalance').resolves(100);
          
          // Call the setBalance function
          await userController.setBalance(req, res);
          
          // Check if the send function was successful and returned the balance
          expect(res.send.calledWith({ result: 100 })).to.be.true;
        });
        
        // Test the setBalance function when an error occurs
        it('should return error if an error occurs during balance set', async () => {
          req.user = { id: 1 }; // Set up the req object
          req.body = { balance: 100 }; // Set up the req body

          // Stub the setBalance function to reject with an error
          sinon.stub(userService, 'setBalance').rejects(new Error('An error occurred'));
          
          // Call the setBalance function
          await userController.setBalance(req, res);
          
          expect(res.status.calledWith(500)).to.be.true; // Expect response status to be 500
          expect(res.send.calledWith({ success: false, error: 'An error occurred' })).to.be.true; // Expect response to contain an error message
        });
    });

    // Test the goal function
    describe('goal', () => {
      // Test the goal function when the goal is successful
        it('should return goal', async () => {
          // Set up the req object
          req.user = { id: 1 };

          // Stub the getGoal function to resolve with a goal of 100
          sinon.stub(userService, 'getGoal').resolves(100);
          
          // Call the goal function
          await userController.goal(req, res);
          
          // Check if the send function was successful and returned the goal
          expect(res.send.calledWith({ result: 100 })).to.be.true;
        });
        
        // Test the goal function when an error occurs
        it('should return error if an error occurs during goal check', async () => {
          // Set up the req object
          req.user = { id: 1 };

          // Stub the getGoal function to reject with an error
          sinon.stub(userService, 'getGoal').rejects(new Error('An error occurred'));
          
          // Call the goal function
          await userController.goal(req, res);
    
          expect(res.status.calledWith(500)).to.be.true; // Expect response status to be 500
          expect(res.send.calledWith({ success: false, error: 'An error occurred' })).to.be.true; // Expect response to contain an error message
        });
    });

    // Test the setGoal function
    describe('setGoal', () => {
        // Test the setGoal function when the goal is successful
        it('should return goal', async () => {
          req.user = { id: 1 }; // Set up the req objectE
          req.body = { goal: 100 }; // Set up the req body

          // Stub the setGoal function to resolve with a goal of 100
          sinon.stub(userService, 'setGoal').resolves(100);
          
          // Call the setGoal function
          await userController.setGoal(req, res);
          
          // Check if the send function was successful and returned the goal
          expect(res.send.calledWith({ result: 100 })).to.be.true;
        });
        
        // Test the setGoal function when an error occurs
        it('should return error if an error occurs during goal set', async () => {
          req.user = { id: 1 }; // Set up the req object
          req.body = { goal: 100 }; // Set up the req body

          // Stub the setGoal function to reject with an error
          sinon.stub(userService, 'setGoal').rejects(new Error('An error occurred'));
          
          // Call the setGoal function
          await userController.setGoal(req, res);
          
          expect(res.status.calledWith(500)).to.be.true; // Expect response status to be 500
          expect(res.send.calledWith({ success: false, error: 'An error occurred' })).to.be.true; // Expect response to contain an error message
        });
    });
});