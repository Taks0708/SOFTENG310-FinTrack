const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const { expect } = require('chai');
const authMiddleware = require('../../src/middleware/authMiddleware');

describe('authMiddleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('isAuthenticated', () => {
        it('should call next if token is valid', () => {
            req.headers.authorization = 'Bearer validToken';
            sinon.stub(jwt, 'verify').yields(null, { userID: 1 });

            authMiddleware.isAuthenticated(req, res, next);

            expect(jwt.verify.calledOnce).to.be.true;
            expect(next.calledOnce).to.be.true;
            expect(req.user).to.deep.equal({ userID: 1 });
        });

        it('should return 401 if token is invalid', () => {
            req.headers.authorization = 'Bearer invalidToken';
            sinon.stub(jwt, 'verify').yields(new Error('Invalid token'), null);

            authMiddleware.isAuthenticated(req, res, next);

            expect(jwt.verify.calledOnce).to.be.true;
            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ error: 'Unauthorized' })).to.be.true;
            expect(next.notCalled).to.be.true;
        });

        it('should return 401 if token is missing', () => {
            req.headers.authorization = 'Bearer ';
            authMiddleware.isAuthenticated(req, res, next);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ error: 'No token provided' })).to.be.true;
            expect(next.notCalled).to.be.true;
        });

        it('should return 401 if authorization header is missing', () => {
            authMiddleware.isAuthenticated(req, res, next);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ error: 'No token provided' })).to.be.true;
            expect(next.notCalled).to.be.true;
        });

        it('should return 401 if authorization header is malformed', () => {
            req.headers.authorization = 'InvalidFormatToken';
            authMiddleware.isAuthenticated(req, res, next);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ error: 'No token provided' })).to.be.true;
            expect(next.notCalled).to.be.true;
        });
    });
});
