const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const securePassword = require('../../src/services/securePassword');

describe('securePassword', () => {

    afterEach(() => {
        sinon.restore();
    });

    describe('hashPassword', () => {
        it('should return a hashed password', async () => {
            sinon.stub(bcrypt, 'compare').resolves(true);
            sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
            const password = 'password';
            const hash = await securePassword.hashPassword(password);
            const isMatch = await bcrypt.compare(password, hash);
            expect(isMatch).to.be.true;
        });

        it('should return an error if hashing fails', async () => {
            sinon.stub(bcrypt, 'hash').rejects(new Error('error hashing password'));
            const password = 'password';
            try {
                await securePassword.hashPassword(password);
                throw new Error('Test failed: Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Error hashing password');
            }
        });
    });

    describe('comparePasswords', () => {
        it('should return true if password matches hash', async () => {
            sinon.stub(bcrypt, 'compare').resolves(true);
            sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
            const password = 'password';
            const hash = await bcrypt.hash(password, 10);
            const isMatch = await securePassword.comparePasswords(password, hash);
            expect(isMatch).to.be.true;
        });

        it('should return false if password does not match hash', async () => {
            sinon.stub(bcrypt, 'compare').resolves(false);
            sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
            const password = 'password';
            const hash = await bcrypt.hash(password, 10);
            const isMatch = await securePassword.comparePasswords('wrongPassword', hash);
            expect(isMatch).to.be.false;
        });

        it('should return an error if comparison fails', async () => {
            sinon.stub(bcrypt, 'compare').rejects(new Error('Error comparing passwords'));
            const password = 'password';
            const hash = await bcrypt.hash(password, 10);
            try {
                await securePassword.comparePasswords(password, hash);
                throw new Error('Test failed: Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Error comparing passwords');
            }
        });
    });
});