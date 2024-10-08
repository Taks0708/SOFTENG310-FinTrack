const pool = require('../../src/config/db');
const transactionService = require('../../src/services/transactionService');
const sinon = require('sinon');
const { expect } = require('chai');

/**
* Unit tests for transactionService
* 
* This file contains unit tests for transactionService.
* It uses the Sinon library to stub the functions of the database,
* and uses Chai to make assertions.
* @module transactionService
* @dependencies chai, sinon, jwt, transactionsController, transactionService
*/

describe('transactionService', () => {
    let poolQueryStub;

    // Stub the pool.query function before each test
    beforeEach(() => {
        poolQueryStub = sinon.stub(pool, 'query');
    });

    // Restore the stub after each test
    afterEach(() => {
        poolQueryStub.restore();
    });

    // Test suite for the getUserTransactionsByPage function
    describe('getUserTransactionsByPage', () => {

        // Test case for a successful query
        it('should return an array of transactions', async () => {
            // Mock the query result
            const mockTransactions = [
                { id: 1, amount: 100, title: 'Transaction 1' },
                { id: 2, amount: 200, title: 'Transaction 2' },
            ];
            // Stub the pool query function to resolve with the mock transactions
            poolQueryStub.resolves({ rows: mockTransactions });

            const userID = 1;
            const pageNumber = 1;

            // Call the getUserTransactionsByPage function
            const result = await transactionService.getUserTransactionsByPage(userID, pageNumber);

            expect(result).to.be.an('array'); // Expect the result to be an array of transactions
            expect(result).to.deep.equal(mockTransactions); // Expect the result to match the mock transactions
            expect(poolQueryStub.calledOnce).to.be.true; // Expect the pool query function to be called once
        });

        // Test if get user transaction by page calls the sql query
        it('should return paginated transactions for a user', async () => {
            const userID = 1;
            const pageNumber = 2;
            const mockTransactions = [
                { id: 1, amount: 100, title: 'Transaction 1' },
                { id: 2, amount: 200, title: 'Transaction 2' },
            ];

            poolQueryStub.resolves({ rows: mockTransactions });
            
            const result = await transactionService.getUserTransactionsByPage(userID, pageNumber);
            
            expect(poolQueryStub.calledOnce).to.be.true;
            expect(result).to.deep.equal(mockTransactions);
            expect(poolQueryStub.firstCall.args[0].text).to.include('SELECT * FROM transactions');
            expect(poolQueryStub.firstCall.args[0].values).to.deep.equal([userID, 10, 10]); // Check OFFSET is correct
        });

        // Test case for an error during the query
        it('should handle errors and throw the error', async () => {
            // Stub the pool query function to reject with an error
            poolQueryStub.rejects(new Error('error when getting transactions'));

            const userID = 1;
            const pageNumber = 1;

            try {
                // Call the getUserTransactionsByPage function, expect an error to be thrown
                await transactionService.getUserTransactionsByPage(userID, pageNumber);
                throw new Error('Test failed: Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('error when getting transactions'); // Expect the error message to be 'error when getting transactions'
                expect(poolQueryStub.calledOnce).to.be.true; // Expect the pool query function to be called once
            }
        });
    });

    // Test suite for the makeTransaction function
    describe('makeTransaction', () => {
        // Test case for a successful transaction
        it('should successfully make a transaction and update balance', async () => {
            // Stub the pool query function to resolve with the expected results
            poolQueryStub.onFirstCall().resolves({ rowCount: 1 });
            poolQueryStub.onSecondCall().resolves({ rowCount: 1 });

            const userID = 1;
            const amount = 100;
            const title = 'Transaction 1';
            const description = 'Description 1';

            // Call the makeTransaction function
            await transactionService.makeTransaction(userID, amount, title, description);

            expect(poolQueryStub.calledTwice).to.be.true; // Expect the pool query function to be called twice
            expect(poolQueryStub.firstCall.args[0].text).to.include('INSERT INTO transactions'); // Expect the first query to be an insert query
            expect(poolQueryStub.firstCall.args[0].values).to.deep.equal([userID, amount, title, description]); 
            expect(poolQueryStub.secondCall.args[0].text).to.include('UPDATE users SET balance'); // Expect the second query to be an update query
            expect(poolQueryStub.secondCall.args[0].values).to.deep.equal([amount, userID]); 
        });
        
        // Test case for an error during the transaction
        it('should handle errors and throw the error', async () => {
            // Stub the pool query function to reject with an error
            poolQueryStub.rejects(new Error('error making transaction'));

            const userID = 1;
            const amount = 100;
            const title = 'Transaction 1';
            const description = 'Description 1';

            try {
                // Call the makeTransaction function, expect an error to be thrown
                await transactionService.makeTransaction(userID, amount, title, description);
                throw new Error('Test failed: Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('error making transaction'); // Expect the error message to be 'error making transaction'
                expect(poolQueryStub.calledOnce).to.be.true; // Expect the pool query function to be called once
            }
        });
    });

    // Test suite for the deleteTransaction function
    describe('deleteTransaction', () => {
        // Test case for a successful transaction deletion
        it('should successfully delete a transaction and update balance', async () => {
            // Stub the pool query function to resolve with the expected results
            poolQueryStub.onFirstCall().resolves({ rows: [{ amount: 100 }] });  
            poolQueryStub.onSecondCall().resolves({ rowCount: 1 }); 
            poolQueryStub.onThirdCall().resolves({ rowCount: 1 });

            const userID = 1;
            const transactionID = 1;

            // Call the deleteTransaction function and await the result
            const result = await transactionService.deleteTransaction(userID, transactionID);

            expect(result).to.deep.equal({ success: true, message: 'Transaction deleted and balance updated successfully' }); // Expect the result to be successful with a success message
            expect(poolQueryStub.calledThrice).to.be.true; // Expect the pool query function to be called three times
        }); 

        // Test case for an error when the transaction does not exist
        it('should handle errors when transaction does not exist', async () => {
            // Stub the pool query function to resolve with an empty array
            poolQueryStub.resolves({ rows: [] });

            const userID = 1;
            const transactionID = 1;

            // Call the deleteTransaction function and await the result
            const result = await transactionService.deleteTransaction(userID, transactionID);

            expect(result).to.deep.equal({ success: false, message: 'Transaction not found or does not belong to user' }); // Expect the result to be unsuccessful with an error message
            expect(poolQueryStub.calledOnce).to.be.true; // Expect the pool query function to be called once
        });

        // Test case for an error during the transaction deletion
        it('should handle errors and throw the error', async () => {
            // Stub the pool query function to reject with an error
            poolQueryStub.rejects(new Error('error deleting transaction'));

            const userID = 1;
            const transactionID = 1;

            try {
                // Call the deleteTransaction function, expect an error to be thrown
                await transactionService.deleteTransaction(userID, transactionID);
                throw new Error('Test failed: Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('error deleting transaction'); // Expect the error message to be 'error deleting transaction'
                expect(poolQueryStub.calledOnce).to.be.true; // Expect the pool query function to be called once
            }
        });
    });

    // Test suite for the getAllTransactions function
    describe('getAllTransactions', () => {
        // Test case for a successful query
        it('should return an array of transactions', async () => {
            // Mock the query result
            const mockTransactions = [
                { id: 1, amount: 100, title: 'Transaction 1' },
                { id: 2, amount: 200, title: 'Transaction 2' },
            ];

            // Stub the pool query function to resolve with the mock transactions
            poolQueryStub.resolves({ rows: mockTransactions });

            const userID = 1;

            // Call the getAllTransactions function and await the result
            const result = await transactionService.getAllTransactions(userID);

            expect(result).to.be.an('array'); // Expect the result to be an array of transactions
            expect(result).to.deep.equal(mockTransactions); // Expect the result to match the mock transactions
            expect(poolQueryStub.calledOnce).to.be.true; // Expect the pool query function to be called once
        });
        // Test case for an error during the query
        it('should handle errors and throw the error', async () => {
            // Stub the pool query function to reject with an error
            poolQueryStub.rejects(new Error('error when getting transactions'));

            const userID = 1;

            try {
                // Call the getAllTransactions function, expect an error to be thrown
                await transactionService.getAllTransactions(userID);
                throw new Error('Test failed: Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('error when getting transactions'); // Expect the error message to be 'error when getting transactions'
                expect(poolQueryStub.calledOnce).to.be.true; // Expect the pool query function to be called once
            }
        });
    });
});
