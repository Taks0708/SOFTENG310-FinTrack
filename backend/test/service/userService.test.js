const { expect } = require('chai');
const sinon = require('sinon');
const userService = require('../../src/services/userService');
const pool = require('../../src/config/db');
const securePassword = require('../../src/services/securePassword');

/**
* Unit tests for userService
* 
* This file contains unit tests for userService.
* It uses the Sinon library to stub the functions of the database, 
* as well as securePassword. It uses Chai to make assertions.
* @module authMiddleware
* @dependencies chai, sinon, jwt, transactionsController, transactionService
*/
describe('userService', () => {
    // Test suite for the getUserID function
    describe('getUserID', () => {
        let poolQueryStub;
        
        // Stub the pool.query function before each test
        beforeEach(() => {
            poolQueryStub = sinon.stub(pool, 'query');
        });
        
        // Restore the stub after each test
        afterEach(() => {
            poolQueryStub.restore();
        });
        
        // Test case for a successful query
        it('should return user ID if the user exists', async () => {
            // Mock the query result
            const mockResult = { rows: [{ id: 1 }] };

            // Stub the pool query function to resolve with the mock result
            poolQueryStub.resolves(mockResult);
            
            // Call the getUserID function with the stubbed pool query
            const userId = await userService.getUserID('test@example.com');

            expect(userId).to.equal(1); // Expect the user ID to be 1
            expect(poolQueryStub.calledOnce).to.be.true; // Expect the pool query function to be called once
        });
        
        // Test case for a non-existent user
        it('should return null if the user does not exist', async () => {
            // Mock the query result to return an empty array
            const mockResult = { rows: [] };

            // Stub the pool query function to resolve with the mock result
            poolQueryStub.resolves(mockResult);
            
            // Call the getUserID function with the stubbed pool query
            const userId = await userService.getUserID('test@example.com');

            expect(userId).to.be.null; // Expect the user ID to be null
            expect(poolQueryStub.calledOnce).to.be.true; // Expect the pool query function to be called once
        });
        
        // Test case for an error during the query
        it('should throw an error if the query fails', async () => {
            const mockError = new Error('Query failed');
            poolQueryStub.rejects(mockError);
    
            try {
                await userService.getUserID('test@example.com');
            } catch (error) {
                expect(error).to.equal(mockError);
            }
        });
    });
    
    // Test suite for the checkEmailExists function
    describe('checkEmailExists', () => {
        let poolQueryStub;
        
        // Stub the pool.query function before each test
        beforeEach(() => {
            poolQueryStub = sinon.stub(pool, 'query');
        });
        
        // Restore the stub after each test
        afterEach(() => {
            poolQueryStub.restore();
        });
        
        // Test case for an existing email
        it('should return true if the email exists', async () => {
            // Mock the query result to return an array with an email
            const mockResult = { rows: [{ email: 'test@example.com' }] };

            // Stub the pool query function to resolve with the mock result
            poolQueryStub.resolves(mockResult);
            
            // Call the checkEmailExists function with the stubbed pool query
            const exists = await userService.checkEmailExists('test@example.com');
            
            // Expect the result to be true, indicating email exists
            expect(exists).to.be.true;
        });
        
        // Test case for a non-existent email
        it('should return false if the email does not exist', async () => {
            // Mock the query result to return an empty array
            const mockResult = { rows: [] };

            // Stub the pool query function to resolve with the mock result
            poolQueryStub.resolves(mockResult);
            
            // Call the checkEmailExists function with the pool query stub
            const exists = await userService.checkEmailExists('test@example.com');

            // Expect the result to be false, indicating email does not exist
            expect(exists).to.be.false;
        });
    });

    // Test suite for the checkPasswordCorrect function
    describe('checkPasswordCorrect', () => {
        let poolQueryStub;
        let comparePasswordsStub;
        
        // Stub the pool.query and securePassword.comparePasswords functions before each test
        beforeEach(() => {
            poolQueryStub = sinon.stub(pool, 'query');
            comparePasswordsStub = sinon.stub(securePassword, 'comparePasswords');
        });
        
        // Restore the stubs after each test
        afterEach(() => {
            poolQueryStub.restore();
            comparePasswordsStub.restore();
        });
        
        // Test case for a correct password
        it('should return true if the password is correct', async () => {
            // Mock the query result to return a hashed password
            const mockResult = { rows: [{ password: 'hashedPassword' }] };
            
            // Stub the pool query function to resolve with the mock result
            poolQueryStub.resolves(mockResult);

            // Stub the securePassword.comparePasswords function to resolve true
            comparePasswordsStub.resolves(true);
            
            // Call the checkPasswordCorrect function with stubbed methods
            const isCorrect = await userService.checkPasswordCorrect('test@example.com', 'password');
            
            // Expect the result to be true, indicating the password is correct
            expect(isCorrect).to.be.true;
            expect(comparePasswordsStub.calledOnce).to.be.true;
        });
        
        // Test case for an incorrect password
        it('should return false if the password is incorrect', async () => {
            // Mock the query result to return a hashed password
            const mockResult = { rows: [{ password: 'hashedPassword' }] };
            
            // Stub the pool query function to resolve with the mock result
            poolQueryStub.resolves(mockResult);

            // Stub the securePassword.comparePasswords function to resolve false
            comparePasswordsStub.resolves(false);
            
            // Call the checkPasswordCorrect function with stubbed methods
            const isCorrect = await userService.checkPasswordCorrect('test@example.com', 'wrongPassword');

            // Expect the result to be false, indicating the password is incorrect
            expect(isCorrect).to.be.false;
            expect(comparePasswordsStub.calledOnce).to.be.true;
        });
        
        // Test case for a non-existent user
        it('should return false if the user does not exist', async () => {
            // Mock the query result to return an empty array    
            const mockResult = { rows: [] };

            // Stub the pool query function to resolve with the mock result
            poolQueryStub.resolves(mockResult);
            
            // Call the checkPasswordCorrect function with stubbed methods
            const isCorrect = await userService.checkPasswordCorrect('test@example.com', 'password');
            
            // Expect the result to be false, indicating the user does not exist
            expect(isCorrect).to.be.false;
        });
        
        // Test case for an error during the query
        it('should handle errors during password check', async () => {
            // Stub the pool query function to reject with an error
            poolQueryStub.rejects(new Error('Query failed'));
            
            // Call the checkPasswordCorrect function with pool query error stub
            const isCorrect = await userService.checkPasswordCorrect('test@example.com', 'password');
            
            // Expect the result to be false, indicating an error occurred
            expect(isCorrect).to.be.false;
        });
    });

    // Test suite for the createUser function
    describe('createUser', () => {
        let checkEmailExistsStub, poolQueryStub, hashPasswordStub;
        
        // Stub the checkEmailExists, pool.query, and securePassword.hashPassword functions before each test
        beforeEach(() => {
            checkEmailExistsStub = sinon.stub(userService, 'checkEmailExists');
            poolQueryStub = sinon.stub(pool, 'query');
            hashPasswordStub = sinon.stub(securePassword, 'hashPassword');
        });
        
        // Restore the stubs after each test
        afterEach(() => {
            checkEmailExistsStub.restore();
            poolQueryStub.restore();
            hashPasswordStub.restore();
        });
        
        // Test case for a new user
        it('should create a new user if email does not exist', async () => {
            // Mock the query result to return an empty array
            const mockResult = { rows: [] };

            // Stub the checkEmailExists function to resolve false, mocking email does not exist
            checkEmailExistsStub.resolves(false);

            // Stub the securePassword.hashPassword function to resolve with a hashed password
            hashPasswordStub.resolves('hashedPassword');

            // Stub the pool query function to resolve with the mock result
            poolQueryStub.resolves(mockResult);
            
            // Call the createUser function with stubbed methods
            await userService.createUser('test@example.com', 'password');
            
            expect(checkEmailExistsStub.notCalled).to.be.true; // Expect the checkEmailExists function to be called once
            expect(hashPasswordStub.calledOnce).to.be.true; // Expect the pool query function to be called once
        });
        
        // Test case for an existing user
        it('should throw an error if the user already exists', async () => {
            // Mock the query result to return an array with an email
            const mockResult = { rows: [{ email: 'test@example.com' }] };

            // Stub the checkEmailExists function to resolve true, mocking email exists
            checkEmailExistsStub.resolves(true);

            // Stub the pool query function to resolve with the mock result
            poolQueryStub.resolves(mockResult);
    
            try {
                // Call the createUser function with stubbed methods
                await userService.createUser('test@example.com', 'password');
            } catch (error) {
                // Expect an error to be thrown with the message 'User already exists'
                expect(error.message).to.equal('User already exists');
            }
        });
        
        // Test case for an error during the query
        it('should throw an error if the query fails', async () => {
            // Stub the checkEmailExists function to resolve false, mocking email does not exist
            checkEmailExistsStub.resolves(false);

            // Stub the securePassword.hashPassword function to resolve with a hashed password
            hashPasswordStub.resolves('hashedPassword');

            // Stub the pool query function to reject with an error
            poolQueryStub.rejects(new Error('Query failed'));
    
            try {
                // Call the createUser function with stubbed methods and expect an error to be thrown
                await userService.createUser('test@example.com', 'password');
            } catch (error) {
                // Expect an error to be thrown with the message 'Query failed'
                expect(error.message).to.equal('Query failed');
            }

        });
    });
    
    describe('getBalance', () => {
        let poolQueryStub;
        
        // Stub the pool.query function before each test
        beforeEach(() => {
            poolQueryStub = sinon.stub(pool, 'query');
        });
        
        // Restore the stub after each test
        afterEach(() => {
            poolQueryStub.restore();
        });
        
        // Test case for a successful query
        it('should return the correct balance', async () => {
            // Mock the query result to return a balance
            const mockResult = { rows: [{ balance: 100.0 }] };

            // Stub the pool query function to resolve with the mock result
            poolQueryStub.resolves(mockResult);
            
            // Call the getBalance function with the stubbed pool query
            const balance = await userService.getBalance(1);

            // Expect the balance to be 100.0
            expect(balance.balance).to.equal(100.0);
        });
        
        // Test case for an error during the query
        it('should handle errors during the query', async () => {
            // Stub the pool query function to reject with an error
            poolQueryStub.rejects(new Error('Query failed'));
            
            // Call the getBalance function with a test user ID and expect an error to be thrown
            const balance = await userService.getBalance(1);

            expect(balance).to.be.undefined; // Expect the balance to be undefined
            expect(userService.getBalance(1)).to.throw; // Expect an error to be thrown
        });
    });
    
    describe('getGoal', () => {
        let poolQueryStub;
        
        // Stub the pool.query function before each test
        beforeEach(() => {
            poolQueryStub = sinon.stub(pool, 'query');
        });
        
        // Restore the stub after each test
        afterEach(() => {
            poolQueryStub.restore();
        });
        
        // Test case for a successful query
        it('should return the correct goal', async () => {
            // Mock the query result to return a goal
            const mockResult = { rows: [{ saving_goal: 100.0 }] };

            // Stub the pool query function to resolve with the mock result
            poolQueryStub.resolves(mockResult);
            
            // Call the getGoal function with the stubbed pool query
            const goal = await userService.getGoal(1);

            // Expect the goal to be 100.0, the same as the mock result
            expect(goal.saving_goal).to.equal(100.0);
        });
        
        // Test case for an error during the query
        it('should handle errors during the query', async () => {
            // Stub the pool query function to reject with an error
            poolQueryStub.rejects(new Error('Query failed'));
            
            // Call the getGoal function with a test user ID and expect an error to be thrown
            const goal = await userService.getGoal(1);

            expect(goal).to.be.undefined; // Expect the goal to be undefined
            expect(userService.getGoal(1)).to.throw; // Expect an error to be thrown
        });
    });
    
    // Test suite for the setBalance function
    describe('setBalance', () => {
        let poolQueryStub;
        
        // Stub the pool.query function before each test
        beforeEach(() => {
            poolQueryStub = sinon.stub(pool, 'query');
        });
        
        // Restore the stub after each test
        afterEach(() => {
            poolQueryStub.restore();
        });
        
        // Test case for a successful balance update
        it('should return success message if balance is set', async () => {
            // Mock the query result to return a row count of 1
            poolQueryStub.resolves({ rowCount: 1 });
            
            // Call the setBalance function with a test user ID and balance
            const result = await userService.setBalance(1, 100);

            expect(result.success).to.be.true; // Expect the result to be successful
            expect(result.message).to.equal('Balance updated successfully'); // Expect the message to be 'Balance updated successfully'
        });
        
        // Test case for a non-existent user
        it('should return error message if user is not found', async () => {
            // Mock the query result to return a row count of 0
            poolQueryStub.resolves({ rowCount: 0 });
            
            // Call the setBalance function with a test user ID and balance
            const result = await userService.setBalance(1, 100);

            expect(result.success).to.be.false; // Expect the result to be unsuccessful
            expect(result.message).to.equal('User not found'); // Expect the message to be 'User not found'
        });
        
        // Test case for an error during the query
        it('should handle errors during the query', async () => {
            // Stub the pool query function to reject with an error
            poolQueryStub.rejects(new Error('Query failed'));
            
            // Call the setBalance function with a test user ID and balance and expect an error to be thrown
            expect(userService.setBalance(1, 100)).to.throw;
        });
    });

    describe('setGoal', () => {
        let poolQueryStub;
        
        // Stub the pool.query function before each test
        beforeEach(() => {
            poolQueryStub = sinon.stub(pool, 'query');
        });
        
        // Restore the stub after each test
        afterEach(() => {
            poolQueryStub.restore();
        });
        
        // Test case for a successful goal update
        it('should return success message if goal is set', async () => {
            // Mock the query result to return a successful result with a row count of 1
            poolQueryStub.resolves({ rowCount: 1 });
            
            // Call the setGoal function with a test user ID and goal
            const result = await userService.setGoal(1, 100);

            expect(result.success).to.be.true; // Expect the result to be successful
            expect(result.message).to.equal('Goal updated successfully'); // Expect the message to be 'Goal updated successfully'
        });
        
        // Test case for a non-existent user
        it('should return error message if user not found', async () => {
            // Mock the query result to return a failed result with a row count of 0
            poolQueryStub.resolves({ rowCount: 0 });
            
            // Call the setGoal function with a test user ID and goal
            const result = await userService.setGoal(1, 100);

            expect(result.success).to.be.false; // Expect the result to be unsuccessful
            expect(result.message).to.equal('User not found'); // Expect the message to be 'User not found'
        });
        
        // Test case for an error during the query
        it('should handle errors during the query', async () => {
            // Stub the pool query function to reject with an error
            poolQueryStub.rejects(new Error('Query failed'));
            
            // Call the setGoal function with a test user ID and goal and expect an error to be thrown
            expect(userService.setGoal(1, 100)).to.throw;
        });
    });
});