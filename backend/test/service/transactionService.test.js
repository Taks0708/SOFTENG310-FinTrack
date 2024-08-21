const pool = require('../../src/config/db');
const transactionService = require('../../src/services/transactionService');
const sinon = require('sinon');
const { expect } = require('chai');

describe('transactionService', () => {
    let poolQueryStub;

    beforeEach(() => {
        poolQueryStub = sinon.stub(pool, 'query');
    });

    afterEach(() => {
        poolQueryStub.restore();
    });

    describe('getUserTransactionsByPage', () => {
        it('should return an array of transactions', async () => {
            const mockTransactions = [
                { id: 1, amount: 100, title: 'Transaction 1' },
                { id: 2, amount: 200, title: 'Transaction 2' },
            ];
            poolQueryStub.resolves({ rows: mockTransactions });

            const userID = 1;
            const pageNumber = 1;
            const result = await transactionService.getUserTransactionsByPage(userID, pageNumber);

            expect(result).to.be.an('array');
            expect(result).to.deep.equal(mockTransactions);
            expect(poolQueryStub.calledOnce).to.be.true;
        });

        it('should handle errors and throw the error', async () => {
            poolQueryStub.rejects(new Error('error when getting transactions'));

            const userID = 1;
            const pageNumber = 1;

            try {
                await transactionService.getUserTransactionsByPage(userID, pageNumber);
                throw new Error('Test failed: Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('error when getting transactions');
                expect(poolQueryStub.calledOnce).to.be.true;
            }
        });
    });

    describe('makeTransaction', () => {
        it('should successfully make a transaction and update balance', async () => {
            poolQueryStub.onFirstCall().resolves({ rowCount: 1 });
            poolQueryStub.onSecondCall().resolves({ rowCount: 1 });

            const userID = 1;
            const amount = 100;
            const title = 'Transaction 1';
            const description = 'Description 1';
            await transactionService.makeTransaction(userID, amount, title, description);

            expect(poolQueryStub.calledTwice).to.be.true;
            expect(poolQueryStub.firstCall.args[0].text).to.include('INSERT INTO transactions');
            expect(poolQueryStub.secondCall.args[0].text).to.include('UPDATE users SET balance');
        });

        it('should handle errors and throw the error', async () => {
            poolQueryStub.rejects(new Error('error making transaction'));

            const userID = 1;
            const amount = 100;
            const title = 'Transaction 1';
            const description = 'Description 1';

            try {
                await transactionService.makeTransaction(userID, amount, title, description);
                throw new Error('Test failed: Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('error making transaction');
                expect(poolQueryStub.calledOnce).to.be.true;
            }
        });
    });

    describe('deleteTransaction', () => {
        it('should successfully delete a transaction and update balance', async () => {
            poolQueryStub.onFirstCall().resolves({ rows: [{ amount: 100 }] });  // Mock getTransactionAmountQuery result
            poolQueryStub.onSecondCall().resolves({ rowCount: 1 });  // Mock deleteTransactionQuery result
            poolQueryStub.onThirdCall().resolves({ rowCount: 1 });  // Mock updateBalanceQuery result

            const userID = 1;
            const transactionID = 1;
            const result = await transactionService.deleteTransaction(userID, transactionID);

            expect(result).to.deep.equal({ success: true, message: 'Transaction deleted and balance updated successfully' });
            expect(poolQueryStub.calledThrice).to.be.true;
        });

        it('should handle errors when transaction does not exist', async () => {
            poolQueryStub.resolves({ rows: [] });

            const userID = 1;
            const transactionID = 1;
            const result = await transactionService.deleteTransaction(userID, transactionID);

            expect(result).to.deep.equal({ success: false, message: 'Transaction not found or does not belong to user' });
            expect(poolQueryStub.calledOnce).to.be.true;
        });

        it('should handle errors and throw the error', async () => {
            poolQueryStub.rejects(new Error('error deleting transaction'));

            const userID = 1;
            const transactionID = 1;

            try {
                await transactionService.deleteTransaction(userID, transactionID);
                throw new Error('Test failed: Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('error deleting transaction');
                expect(poolQueryStub.calledOnce).to.be.true;
            }
        });
    });

    describe('getAllTransactions', () => {
        it('should return an array of transactions', async () => {
            const mockTransactions = [
                { id: 1, amount: 100, title: 'Transaction 1' },
                { id: 2, amount: 200, title: 'Transaction 2' },
            ];
            poolQueryStub.resolves({ rows: mockTransactions });

            const userID = 1;
            const result = await transactionService.getAllTransactions(userID);

            expect(result).to.be.an('array');
            expect(result).to.deep.equal(mockTransactions);
            expect(poolQueryStub.calledOnce).to.be.true;
        });

        it('should handle errors and throw the error', async () => {
            poolQueryStub.rejects(new Error('error when getting transactions'));

            const userID = 1;

            try {
                await transactionService.getAllTransactions(userID);
                throw new Error('Test failed: Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('error when getting transactions');
                expect(poolQueryStub.calledOnce).to.be.true;
            }
        });
    });
});
