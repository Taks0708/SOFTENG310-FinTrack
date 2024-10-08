const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const transactionController = require('../../src/controllers/transactionsController');
const transactionService = require('../../src/services/transactionService');

/**
* Unit tests for the transactionsController
* 
* This file contains unit tests for the transactionsController.
* It uses the Sinon library to stub the functions of the transactionService,
* and uses Chai to make assertions.
* @module transactionsController
* @dependencies chai, sinon, jwt, transactionsController, transactionService
*/
describe('transactionsController', () => {
    
        let req, res;
        
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
        
        // Test the transaction function
        describe('transaction', () => {
            // Test the transaction function when the transaction is successful
            it('should return success on successful transaction', async () => {
            // Set up the req object
            req.body = { amount: 10, title: 'test', description: 'test' };
            req.user.id = 1;

            // Stub the makeTransaction function to resolve
            sinon.stub(transactionService, 'makeTransaction').resolves();
            
            // Call the transaction function
            await transactionController.transaction(req, res);
                
            // Check if the send function was successful
            expect(res.send.calledWith({ success: true })).to.be.true;
    
            });
            
            // Test the transaction function when an error occurs
            it('should return error if an error occurs during transaction', async () => {
                // Set up the req object
                req.body = { amount: 10, title: 'test', description: 'test' };
                req.user.id = 1;

                // Stub the makeTransaction function to throw an error
                sinon.stub(transactionService, 'makeTransaction').rejects(new Error('An error occurred'));
                
                // Call the transaction function
                await transactionController.transaction(req, res);
                
                // Check if the status function was called with 500
                expect(res.status.calledWith(500)).to.be.true;
            });
    
        });
        
        // Test the transactions function
        describe('get transactions by page', () => {
            // Test the transactions function when the transactions are successful
            it('should return success on successful get transactions', async () => {
            
                // Set up the req object
            req.params = { pageNumber: 1 };
            req.user.id = 1;

            // Stub the getUserTransactionsByPage function to resolve
            sinon.stub(transactionService, 'getUserTransactionsByPage').resolves();
            
            // Call the transactions function with stubbed function
            await transactionController.transactions(req, res);
            
            // Check if the status function was called with 200 in the response (success)
            expect(res.status.calledWith(200)).to.be.true;
    
            });
            
            // Test the transactions function when an error occurs
            it('should return error if an error occurs during get transactions', async () => {
                // Set up the req object
                req.params = { pageNumber: 1 };
                req.user.id = 1;

                // Stub the getUserTransactionsByPage function to throw an error
                sinon.stub(transactionService, 'getUserTransactionsByPage').rejects(new Error('An error occurred'));
                
                // Call the transactions function with stubbed function
                await transactionController.transactions(req, res);
                
                expect(res.status.calledWith(500)).to.be.true; // Expect the response status to be 500
                expect(res.send.calledWith({ success: false, error: 'An error occurred' })).to.be.true; // Expect the response to contain an error message
            });
    
        });
        
        // Test the deleteTransaction function
        describe('deleteTransaction', () => {
            // Test the deleteTransaction function when the transaction is successful
            it('should return success on successful delete transaction', async () => {
            // Set up the req object
            req.params = { transactionID: 1 };
            req.user.id = 1;

            // Stub the deleteTransaction function to resolve
            sinon.stub(transactionService, 'deleteTransaction').resolves();
            
            // Call the deleteTransaction function
            await transactionController.deleteTransaction(req, res);
            
            // Check if the status function was called with 200 in the response (success)
            expect(res.status.calledWith(200)).to.be.true;
    
            });
            
            // Test the deleteTransaction function when an error occurs
            it('should return error if an error occurs during delete transaction', async () => {
                // Set up the req object
                req.params = { transactionID: 1 };
                req.user.id = 1;

                // Stub the deleteTransaction function to throw an error
                sinon.stub(transactionService, 'deleteTransaction').rejects(new Error('An error occurred'));
                
                // Call the deleteTransaction function
                await transactionController.deleteTransaction(req, res);
                
                // Check if the status function was called with 500 in the response (error)
                expect(res.status.calledWith(500)).to.be.true;
            });
        });


        // Test the editTransaction function
        describe('editTransaction', () => {
            // Test the editTransaction function when the transaction is successful

            it('should return success on successful edit transaction', async () => {
                // Set up the req object
                req.params = { transactionID: 1 };
                req.user.id = 1;
                req.body = {title: "test", amount: "amount", description: "description"}

                // Stub the editTransaction function to resolve
                sinon.stub(transactionService, 'editTransaction').resolves({success: true, message: `Succesfuly editted transaction id`});
                
                // Call the editTransaction function
                await transactionController.editTransaction(req, res);
                
                // Check if the status function was called with 200 in the response (success)
                expect(res.status.calledWith(200)).to.be.true;
    
            });
            
            // Test the editTransaction function when an error occurs
            it('should return error if an error occurs during edit transaction', async () => {
                // Set up the req object
                req.params = { transactionID: 1 };
                req.user.id = 1;
                req.body = {title: "test", amount: "amount", description: "description"}

                // Stub the editTransaction function to throw an error
                sinon.stub(transactionService, 'editTransaction').rejects(new Error('An error occurred'));
                
                // Call the editTransaction function
                await transactionController.editTransaction(req, res);
                
                // Check if the status function was called with 500 in the response (error)
                expect(res.status.calledWith(500)).to.be.true;
            });

            it('should return 401 if transaction does not exsist', async () => {
                req.params = { transactionID: 1 };
                req.user.id = 1;
                req.body = {title: "test", amount: "amount", description: "description"}

                // Stub the editTransaction function to return false
                sinon.stub(transactionService, 'editTransaction').resolves({success: false, message: 'Transaction not found or does not belong to user'});
                                
                // Call the editTransaction function
                await transactionController.editTransaction(req, res);
                
                // Check if the status function was called with 401 in the response (error)
                expect(res.status.calledWith(401)).to.be.true;

            });

        });



        // Test the allTransactions function
        describe ('allTransactions', () => {    
            // Test the allTransactions function when the transactions are successful
            it('should return success on successful get all transactions', async () => {
                // Set up the req object
                req.user.id = 1;

                // Stub the getAllTransactions function to resolve
                sinon.stub(transactionService, 'getAllTransactions').resolves();
                
                // Call the allTransactions function
                await transactionController.allTransactions(req, res);
                
                // Check if the status function was called with 200 in the response (success)
                expect(res.status.calledWith(200)).to.be.true;
        
                });
                
                // Test the allTransactions function when an error occurs
                it('should return error if an error occurs during get all transactions', async () => {
                    // Set up the req object
                    req.user.id = 1;

                    // Stub the getAllTransactions function to throw an error
                    sinon.stub(transactionService, 'getAllTransactions').rejects(new Error('An error occurred'));
                    
                    // Call the allTransactions function
                    await transactionController.allTransactions(req, res);
                
                    expect(res.status.calledWith(500)).to.be.true; // Expect the response status to be 500
                    expect(res.send.calledWith({ success: false, error: 'An error occurred' })).to.be.true; // Expect the response to contain an error message
                });
        });
    });