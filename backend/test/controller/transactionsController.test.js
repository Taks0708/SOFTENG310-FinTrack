const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const transactionController = require('../../src/controllers/transactionsController');
const transactionService = require('../../src/services/transactionService');

describe('transactionsController', () => {
    
        let req, res;
        
        beforeEach(() => {
        req = { body: {}, user: {} };
        res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis(),
        };
        });
    
        afterEach(() => {
        sinon.restore(); 
        });
    
        describe('transaction', () => {
            it('should return success on successful transaction', async () => {
            req.body = { amount: 10, title: 'test', description: 'test' };
            req.user.id = 1;
            sinon.stub(transactionService, 'makeTransaction').resolves();
        
            await transactionController.transaction(req, res);
        
            expect(res.send.calledWith({ success: true })).to.be.true;
    
            });
            
            it('should return error if an error occurs during transaction', async () => {
                req.body = { amount: 10, title: 'test', description: 'test' };
                req.user.id = 1;
                sinon.stub(transactionService, 'makeTransaction').rejects(new Error('An error occurred'));
            
                await transactionController.transaction(req, res);
            
                expect(res.status.calledWith(500)).to.be.true;
            });
    
        });
    
        describe('transactions', () => {
            it('should return success on successful get transactions', async () => {
            req.params = { pageNumber: 1 };
            req.user.id = 1;
            sinon.stub(transactionService, 'getUserTransactionsByPage').resolves();
        
            await transactionController.transactions(req, res);
        
            expect(res.status.calledWith(200)).to.be.true;
    
            });
            
            it('should return error if an error occurs during get transactions', async () => {
                req.params = { pageNumber: 1 };
                req.user.id = 1;
                sinon.stub(transactionService, 'getUserTransactionsByPage').rejects(new Error('An error occurred'));
            
                await transactionController.transactions(req, res);
            
                expect(res.status.calledWith(500)).to.be.true;
                expect(res.send.calledWith({ success: false, error: 'An error occurred' })).to.be.true;
            });
    
        });
    
        describe('deleteTransaction', () => {
            it('should return success on successful delete transaction', async () => {
            req.params = { transactionID: 1 };
            req.user.id = 1;
            sinon.stub(transactionService, 'deleteTransaction').resolves();
        
            await transactionController.deleteTransaction(req, res);
        
            expect(res.status.calledWith(200)).to.be.true;
    
            });
            
            it('should return error if an error occurs during delete transaction', async () => {
                req.params = { transactionID: 1 };
                req.user.id = 1;
                sinon.stub(transactionService, 'deleteTransaction').rejects(new Error('An error occurred'));
            
                await transactionController.deleteTransaction(req, res);
            
                expect(res.status.calledWith(500)).to.be.true;
            });
        });
    });