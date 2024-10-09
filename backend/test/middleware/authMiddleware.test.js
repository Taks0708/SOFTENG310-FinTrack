const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const { expect } = require('chai');
const authMiddleware = require('../../src/middleware/authMiddleware');

/**
* Unit tests for authMiddleware
* 
* This file contains unit tests for authMiddleware.
* It uses the Sinon library to stub the functions of the jwt library,
* and uses Chai to make assertions.
* @module authMiddleware
* @dependencies chai, sinon, jwt, transactionsController, transactionService
*/
describe('authMiddleware', () => {
    let req, res, next;

    // Set up the req and res objects before each test with stubbed methods for their fields
    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: sinon.stub().returnsThis(), // Make the status method chainable
            json: sinon.stub(), // Stub the json method
        };
        next = sinon.stub(); // Stub the next function
    });

    // Restore the stubs after each test
    afterEach(() => {
        sinon.restore();
    });

    // Test suite for the isAuthenticated function
    describe('isAuthenticated', () => {
        // Test case for a valid token
        it('should call next if token is valid', () => {
            // Set the authorization header to a valid token
            req.headers.authorization = 'Bearer validToken';

            // Stub the jwt verify function to yield the user ID
            sinon.stub(jwt, 'verify').yields(null, { userID: 1 });

            // Call the isAuthenticated function
            authMiddleware.isAuthenticated(req, res, next);

            expect(jwt.verify.calledOnce).to.be.true; // Expect the jwt verify function to be called once
            expect(next.calledOnce).to.be.true; // Expect the next function to be called once
            expect(req.user).to.deep.equal({ userID: 1 }); // Expect the req.user field to be set to the user ID
        });

        // Test case for an invalid token
        it('should return 401 if token is invalid', () => {
            // Set the authorization header to an invalid token
            req.headers.authorization = 'Bearer invalidToken';

            // Stub the jwt verify function to yield an error
            sinon.stub(jwt, 'verify').yields(new Error('Invalid token'), null);

            // Call the isAuthenticated function
            authMiddleware.isAuthenticated(req, res, next);

            expect(jwt.verify.calledOnce).to.be.true; // Expect the jwt verify function to be called once
            expect(res.status.calledWith(401)).to.be.true; // Expect the status method to be called with 401, Unauthorized
            expect(res.json.calledWith({ error: 'Unauthorized' })).to.be.true; // Expect the json method to be called with an error message
            expect(next.notCalled).to.be.true; // Expect the next function not to be called
        });

        // Test case for a missing token
        it('should return 401 if token is missing', () => {
            // Call the isAuthenticated function without missing token
            req.headers.authorization = 'Bearer ';
            authMiddleware.isAuthenticated(req, res, next);

            expect(res.status.calledWith(401)).to.be.true; // Expect the status method to be called with 401, Unauthorized
            expect(res.json.calledWith({ error: 'No token provided' })).to.be.true; // Expect error message to be 'No token provided'
            expect(next.notCalled).to.be.true; // Expect the next function not to be called
        });

        // Test case for a malformed token
        it('should return 401 if authorization header is missing', () => {
            // Call the isAuthenticated function without setting the authorization header
            authMiddleware.isAuthenticated(req, res, next);

            expect(res.status.calledWith(401)).to.be.true; // Expect the status method to be called with 401, Unauthorized
            expect(res.json.calledWith({ error: 'No token provided' })).to.be.true; // Expect error message to be 'No token provided'
            expect(next.notCalled).to.be.true; // Expect the next function not to be called
        });

        // Test case for a malformed token
        it('should return 401 if authorization header is malformed', () => {
            // Call the isAuthenticated function with an invalid token format
            req.headers.authorization = 'InvalidFormatToken';
            authMiddleware.isAuthenticated(req, res, next);

            expect(res.status.calledWith(401)).to.be.true; // Expect the status method to be called with 401, Unauthorized
            expect(res.json.calledWith({ error: 'No token provided' })).to.be.true; // Expect error message to be 'No token provided'
            expect(next.notCalled).to.be.true; // Expect the next function not to be called
        });
    });
});
