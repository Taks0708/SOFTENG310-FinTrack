const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const securePassword = require('../../src/services/securePassword');

describe('securePassword', () => {

    beforeEach(() => {
        sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('hashPassword', () => {
        it('should return a hashed password', async () => {
            sinon.stub(bcrypt, 'compare').resolves(true);
            const password = 'password';
            const hash = await securePassword.hashPassword(password);
            const isMatch = await bcrypt.compare(password, hash);
            expect(isMatch).to.be.true;
        });
    });

    describe('comparePasswords', () => {
        it('should return true if password matches hash', async () => {
            sinon.stub(bcrypt, 'compare').resolves(true);
            const password = 'password';
            const hash = await bcrypt.hash(password, 10);
            const isMatch = await securePassword.comparePasswords(password, hash);
            expect(isMatch).to.be.true;
        });

        it('should return false if password does not match hash', async () => {
            sinon.stub(bcrypt, 'compare').resolves(false);
            const password = 'password';
            const hash = await bcrypt.hash(password, 10);
            const isMatch = await securePassword.comparePasswords('wrongPassword', hash);
            expect(isMatch).to.be.false;
        });
    });
});