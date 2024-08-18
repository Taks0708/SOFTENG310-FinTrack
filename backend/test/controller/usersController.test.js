// test/controllers/userController.test.js
const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const userController = require('../../src/controllers/usersController');
const userService = require('../../src/services/userService');

describe('usersController', () => {

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

    describe('login', () => {
        it('should return token on successful login', async () => {
          req.body = { email: 'test', password: 'test' };
          sinon.stub(userService, 'checkEmailExists').resolves(true);
          sinon.stub(userService, 'checkPasswordCorrect').resolves(true);
          sinon.stub(userService, 'getUserID').resolves(1);
          sinon.stub(jwt, 'sign').returns('fakeToken');
    
          await userController.login(req, res);
    
          expect(res.send.calledWith({ success: true, token: 'fakeToken' })).to.be.true;

        });
        
        it('should return error if email does not exist', async () => {
            req.body = { email: 'test', password: 'test' };
            sinon.stub(userService, 'checkEmailExists').resolves(false);
            
            await userController.login(req, res);
        
            expect(res.send.calledWith({ success: false, error: 'Email does not exist' })).to.be.true;
        });
        
        
        it('should return error if password is incorrect', async () => {
            req.body = { email: 'test', password: 'test' };
            sinon.stub(userService, 'checkEmailExists').resolves(true);
            sinon.stub(userService, 'checkPasswordCorrect').resolves(false);
        
            await userController.login(req, res);
        
            expect(res.send.calledWith({ success: false, error: 'Incorrect password' })).to.be.true;
        });

        it('should return error if an error occurs during login', async () => {
            req.body = { email: 'test', password: 'test' };
            sinon.stub(userService, 'checkEmailExists').rejects(new Error('An error occurred'));
        
            await userController.login(req, res);
        
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith({ success: false, error: 'An error occurred' })).to.be.true;
        });
    });

    describe('signup', () => {
        it('should return token on successful signup', async () => {
          req.body = { email: 'test', password: 'test' };
          sinon.stub(userService, 'checkEmailExists').resolves(false);
          sinon.stub(userService, 'createUser');
          sinon.stub(userService, 'getUserID').resolves(1);
          sinon.stub(jwt, 'sign').returns('fakeToken');
    
          await userController.signup(req, res);
    
          expect(res.send.calledWith({ success: true, token: 'fakeToken' })).to.be.true;
        });
    
        it('should return error if email already in use', async () => {
          req.body = { email: 'test', password: 'test' };
          sinon.stub(userService, 'checkEmailExists').resolves(true);
    
          await userController.signup(req, res);
    
          expect(res.send.calledWith({ success: false, error: 'Email already in use' })).to.be.true;
        });

        it('should return error if an error occurs during signup', async () => {
            req.body = { email: 'test', password: 'test' };
            sinon.stub(userService, 'checkEmailExists').rejects(new Error('An error occurred'));
        
            await userController.signup(req, res);
        
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith({ success: false, error: 'An error occurred' })).to.be.true;
        });
    });


    describe('balance', () => {
        it('should return balance', async () => {
          req.user = { id: 1 };
          sinon.stub(userService, 'getBalance').resolves(100);
    
          await userController.balance(req, res);
    
          expect(res.send.calledWith({ result: 100 })).to.be.true;
        });
    
        it('should return error if an error occurs during balance check', async () => {
          req.user = { id: 1 };
          sinon.stub(userService, 'getBalance').rejects(new Error('An error occurred'));
    
          await userController.balance(req, res);
    
          expect(res.status.calledWith(500)).to.be.true;
          expect(res.send.calledWith({ success: false, error: 'An error occurred' })).to.be.true;
        });
    });

    describe('setBalance', () => {
        it('should return balance', async () => {
          req.user = { id: 1 };
          req.body = { balance: 100 };
          sinon.stub(userService, 'setBalance').resolves(100);
    
          await userController.setBalance(req, res);
    
          expect(res.send.calledWith({ result: 100 })).to.be.true;
        });
    
        it('should return error if an error occurs during balance set', async () => {
          req.user = { id: 1 };
          req.body = { balance: 100 };
          sinon.stub(userService, 'setBalance').rejects(new Error('An error occurred'));
    
          await userController.setBalance(req, res);
    
          expect(res.status.calledWith(500)).to.be.true;
          expect(res.send.calledWith({ success: false, error: 'An error occurred' })).to.be.true;
        });
    });

    describe('goal', () => {
        it('should return goal', async () => {
          req.user = { id: 1 };
          sinon.stub(userService, 'getGoal').resolves(100);
    
          await userController.goal(req, res);
    
          expect(res.send.calledWith({ result: 100 })).to.be.true;
        });
    
        it('should return error if an error occurs during goal check', async () => {
          req.user = { id: 1 };
          sinon.stub(userService, 'getGoal').rejects(new Error('An error occurred'));
    
          await userController.goal(req, res);
    
          expect(res.status.calledWith(500)).to.be.true;
          expect(res.send.calledWith({ success: false, error: 'An error occurred' })).to.be.true;
        });
    });

    describe('setGoal', () => {
        it('should return goal', async () => {
          req.user = { id: 1 };
          req.body = { goal: 100 };
          sinon.stub(userService, 'setGoal').resolves(100);
    
          await userController.setGoal(req, res);
    
          expect(res.send.calledWith({ result: 100 })).to.be.true;
        });
    
        it('should return error if an error occurs during goal set', async () => {
          req.user = { id: 1 };
          req.body = { goal: 100 };
          sinon.stub(userService, 'setGoal').rejects(new Error('An error occurred'));
    
          await userController.setGoal(req, res);
    
          expect(res.status.calledWith(500)).to.be.true;
          expect(res.send.calledWith({ success: false, error: 'An error occurred' })).to.be.true;
        });
    });
});