const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const userService = require('../../src/services/userService');
const pool = require('../../src/config/db');
const securePassword = require('../../src/services/securePassword');

describe('userService', () => {
    describe('getUserID', () => {
        let poolQueryStub;
    
        beforeEach(() => {
            poolQueryStub = sinon.stub(pool, 'query');
        });
    
        afterEach(() => {
            poolQueryStub.restore();
        });
    
        it('should return user ID if the user exists', async () => {
            const mockResult = { rows: [{ id: 1 }] };
            poolQueryStub.resolves(mockResult);
    
            const userId = await userService.getUserID('test@example.com');
            expect(userId).to.equal(1);
            expect(poolQueryStub.calledOnce).to.be.true;
        });
    
        it('should return null if the user does not exist', async () => {
            const mockResult = { rows: [] };
            poolQueryStub.resolves(mockResult);
    
            const userId = await userService.getUserID('nonexistent@example.com');
            expect(userId).to.be.null;
            expect(poolQueryStub.calledOnce).to.be.true;
        });
    
        it('should throw an error if the query fails', async () => {
            poolQueryStub.rejects(new Error('Query failed'));
    
            try {
                await userService.getUserID('error@example.com');
            } catch (error) {
                expect(error.message).to.equal('Query failed');
            }
            expect(poolQueryStub.calledOnce).to.be.true;
        });
    });
    
    describe('checkEmailExists', () => {
        let poolQueryStub;
    
        beforeEach(() => {
            poolQueryStub = sinon.stub(pool, 'query');
        });
    
        afterEach(() => {
            poolQueryStub.restore();
        });
    
        it('should return true if the email exists', async () => {
            const mockResult = { rows: [{ email: 'test@example.com' }] };
            poolQueryStub.resolves(mockResult);
    
            const exists = await userService.checkEmailExists('test@example.com');
            expect(exists).to.be.true;
        });
    
        it('should return false if the email does not exist', async () => {
            const mockResult = { rows: [] };
            poolQueryStub.resolves(mockResult);
    
            const exists = await userService.checkEmailExists('nonexistent@example.com');
            expect(exists).to.be.false;
        });
    });

    describe('checkPasswordCorrect', () => {
        let poolQueryStub;
        let comparePasswordsStub;
    
        beforeEach(() => {
            poolQueryStub = sinon.stub(pool, 'query');
            comparePasswordsStub = sinon.stub(securePassword, 'comparePasswords');
        });
    
        afterEach(() => {
            poolQueryStub.restore();
            comparePasswordsStub.restore();
        });
    
        it('should return true if the password is correct', async () => {
            const mockResult = { rows: [{ password: 'hashedPassword' }] };
            poolQueryStub.resolves(mockResult);
            comparePasswordsStub.resolves(true);
    
            const isCorrect = await userService.checkPasswordCorrect('test@example.com', 'password123');
            expect(isCorrect).to.be.true;
        });
    
        it('should return false if the password is incorrect', async () => {
            const mockResult = { rows: [{ password: 'hashedPassword' }] };
            poolQueryStub.resolves(mockResult);
            comparePasswordsStub.resolves(false);
    
            const isCorrect = await userService.checkPasswordCorrect('test@example.com', 'wrongPassword');
            expect(isCorrect).to.be.false;
        });
    
        it('should return false if the user does not exist', async () => {
            const mockResult = { rows: [] };
            poolQueryStub.resolves(mockResult);
    
            const isCorrect = await userService.checkPasswordCorrect('nonexistent@example.com', 'password123');
            expect(isCorrect).to.be.false;
        });
    
        it('should handle errors during password check', async () => {
            poolQueryStub.rejects(new Error('Query failed'));
    
            const isCorrect = await userService.checkPasswordCorrect('error@example.com', 'password123');
            expect(isCorrect).to.be.false;
        });
    });

    describe('createUser', () => {
        let checkEmailExistsStub, poolQueryStub, hashPasswordStub;
    
        beforeEach(() => {
            checkEmailExistsStub = sinon.stub(userService, 'checkEmailExists');
            poolQueryStub = sinon.stub(pool, 'query');
            hashPasswordStub = sinon.stub(securePassword, 'hashPassword');
        });
    
        afterEach(() => {
            checkEmailExistsStub.restore();
            poolQueryStub.restore();
            hashPasswordStub.restore();
        });
    
        it('should create a new user if email does not exist', async () => {
            const mockResult = { rows: [] };
            checkEmailExistsStub.resolves(false);
            hashPasswordStub.resolves('hashedPassword');
            poolQueryStub.resolves(mockResult);
    
            await userService.createUser('test@example.com', 'password123');
    
            expect(checkEmailExistsStub.notCalled).to.be.true;
            expect(hashPasswordStub.calledOnce).to.be.true;
            expect(poolQueryStub.calledOnce).to.be.true;
        });
    
        it('should throw an error if the user already exists', async () => {
            const mockResult = { rows: [{ email: 'test@example.com' }] };
            checkEmailExistsStub.resolves(true);
            poolQueryStub.resolves(mockResult);
    
            try {
                await userService.createUser('test@example.com', 'password123');
            } catch (error) {
                expect(error.message).to.equal('User already exists');
            }
            expect(checkEmailExistsStub.calledOnce).to.be.true;
            expect(hashPasswordStub.notCalled).to.be.true;
            expect(poolQueryStub.notCalled).to.be.true;
        });
    
        it('should throw an error if the query fails', async () => {
            checkEmailExistsStub.resolves(false);
            hashPasswordStub.resolves('hashedPassword');
            poolQueryStub.rejects(new Error('Query failed'));
    
            try {
                await userService.createUser('test@example.com', 'password123');
            } catch (error) {
                expect(error.message).to.equal('Query failed');
            }
            expect(checkEmailExistsStub.calledOnce).to.be.true;
            expect(hashPasswordStub.calledOnce).to.be.true;
            expect(poolQueryStub.notCalled).to.be.true;
        });
    });
    
    describe('getBalance', () => {
        let poolQueryStub;
    
        beforeEach(() => {
            poolQueryStub = sinon.stub(pool, 'query');
        });
    
        afterEach(() => {
            poolQueryStub.restore();
        });
    
        it('should return the correct balance', async () => {
            const mockResult = { rows: [{ balance: 100.0 }] };
            poolQueryStub.resolves(mockResult);
    
            const balance = await userService.getBalance(1);
            expect(balance.balance).to.equal(100.0);
        });
    
        it('should handle errors during the query', async () => {
            poolQueryStub.rejects(new Error('Query failed'));
    
            const balance = await userService.getBalance(1);
            expect(balance).to.be.undefined;
        });
    });
    
    describe('getGoal', () => {
        let poolQueryStub;
    
        beforeEach(() => {
            poolQueryStub = sinon.stub(pool, 'query');
        });
    
        afterEach(() => {
            poolQueryStub.restore();
        });
    
        it('should return the correct goal', async () => {
            const mockResult = { rows: [{ saving_goal: 100.0 }] };
            poolQueryStub.resolves(mockResult);
    
            const goal = await userService.getGoal(1);
            expect(goal.saving_goal).to.equal(100.0);
        });
    
        it('should handle errors during the query', async () => {
            poolQueryStub.rejects(new Error('Query failed'));
    
            const goal = await userService.getGoal(1);
            expect(goal).to.be.undefined;
        });
    });
    
    describe('setBalance', () => {
        let poolQueryStub;
    
        beforeEach(() => {
            poolQueryStub = sinon.stub(pool, 'query');
        });
    
        afterEach(() => {
            poolQueryStub.restore();
        });
    
        it('should return success message if balance is set', async () => {
            poolQueryStub.resolves({ rowCount: 1 });
    
            const result = await userService.setBalance(1, 100);
            expect(result.success).to.be.true;
            expect(result.message).to.equal('Balance updated successfully');
        });
    
        it('should return error message if user is not found', async () => {
            poolQueryStub.resolves({ rowCount: 0 });
    
            const result = await userService.setBalance(1, 100);
            expect(result.success).to.be.false;
            expect(result.message).to.equal('User not found');
        });
    
        it('should handle errors during the query', async () => {
            poolQueryStub.rejects(new Error('Query failed'));
    
            await userService.setBalance(1, 100);
            expect(userService.setBalance(1, 100).threw());
        });
    });

    describe('setGoal', () => {
        let poolQueryStub;
    
        beforeEach(() => {
            poolQueryStub = sinon.stub(pool, 'query');
        });
    
        afterEach(() => {
            poolQueryStub.restore();
        });
    
        it('should return success message if goal is set', async () => {
            poolQueryStub.resolves({ rowCount: 1 });
    
            const result = await userService.setGoal(1, 100);
            expect(result.success).to.be.true;
            expect(result.message).to.equal('Goal updated successfully');
        });
    
        it('should return error message if user not found', async () => {
            poolQueryStub.resolves({ rowCount: 0 });
    
            const result = await userService.setGoal(1, 100);
            expect(result.success).to.be.false;
            expect(result.message).to.equal('User not found');
        });
    
        it('should handle errors during the query', async () => {
            poolQueryStub.rejects(new Error('Query failed'));
    
            const result = await userService.setGoal(1, 100);
            expect(result.success).to.be.false;
            expect(result.message).to.equal('Query failed');
        });
    });
});


