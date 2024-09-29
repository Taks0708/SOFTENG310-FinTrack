const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const securePassword = require('../../src/services/securePassword');

/**
* Unit tests for securePassword
* 
* This file contains unit tests for securePassword.
* It uses the Sinon library to stub the functions of the bcrypt library,
* and uses Chai to make assertions.
* @module securePassword
* @dependencies chai, sinon, jwt, transactionsController, transactionService
*/
describe('securePassword', () => {

    // Restore the stubs after each test
    afterEach(() => {
        sinon.restore();
    });

    // Test suite for the hashPassword function
    describe('hashPassword', () => {

        // Test case for a successful hashing
        it('should return a hashed password', async () => {
            // Stub the bcrypt compare function to resolve true
            sinon.stub(bcrypt, 'compare').resolves(true);

            // Stub the bcrypt hash function to resolve with a hashed password
            sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
            const password = 'password';

            // Call the hashPassword function
            const hash = await securePassword.hashPassword(password);

            // Compare the hashed password with the expected value
            const isMatch = await bcrypt.compare(password, hash);

            // Expect the hashed password to match the original password
            expect(isMatch).to.be.true;
        });

        // Test case for an error during hashing
        it('should return an error if hashing fails', async () => {
            // Stub the bcrypt hash function to reject with an error
            sinon.stub(bcrypt, 'hash').rejects(new Error('error hashing password'));
            const password = 'password';
            try {
                // Call the hashPassword function, expect an error to be thrown
                await securePassword.hashPassword(password);
                throw new Error('Test failed: Expected error was not thrown');
            } catch (error) {
                // Expect the error message to be 'Error hashing password'
                expect(error.message).to.equal('Error hashing password');
            }
        });

        // Test if hashed password != plain password
        it('should return a hashed password as a different string', async () => {
            const plainPassword = 'MyPassword123';
            const hashedPassword = await securePassword.hashPassword(plainPassword);
        
            // The hashed password should be a string
            expect(typeof(hashedPassword)).to.be.a('string')
        
            // The hashed password should not match the plain text password
            expect(hashedPassword).to.not.equal(plainPassword);
        });
    });

    // Test suite for the comparePasswords function
    describe('comparePasswords', () => {
        // Test case for a successful comparison
        it('should return true if password matches hash', async () => {
            // Stub the bcrypt compare function to resolve true
            sinon.stub(bcrypt, 'compare').resolves(true);

            // Stub the bcrypt hash function to resolve with a hashed password
            sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
            const password = 'password';

            // Call the hashPassword function
            const hash = await bcrypt.hash(password, 10);

            // Compare the hashed password with the original password
            const isMatch = await securePassword.comparePasswords(password, hash);
            
            // Expect the passwords to match
            expect(isMatch).to.be.true;
        });

        // Test case for a failed comparison
        it('should return false if password does not match hash', async () => {
            // Stub the bcrypt compare function to resolve false
            sinon.stub(bcrypt, 'compare').resolves(false);

            // Stub the bcrypt hash function to resolve with a hashed password
            sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
            const password = 'password';

            // Call the hashPassword function with stubbed values
            const hash = await bcrypt.hash(password, 10);

            // Compare the hashed password with a different password
            const isMatch = await securePassword.comparePasswords('wrongPassword', hash);
            
            // Expect the passwords to not match
            expect(isMatch).to.be.false;
        });
        
        // Test case for an error during comparison
        it('should return an error if comparison fails', async () => {
            // Stub the bcrypt compare function to reject with an error
            sinon.stub(bcrypt, 'compare').rejects(new Error('Error comparing passwords'));
            const password = 'password';

            // Call the comparePasswords function with a password and a hash
            const hash = await bcrypt.hash(password, 10);
            try {
                // Expect an error to be thrown
                await securePassword.comparePasswords(password, hash);
                throw new Error('Test failed: Expected error was not thrown');
            } catch (error) {
                // Expect the error message to be 'Error comparing passwords'
                expect(error.message).to.equal('Error comparing passwords');
            }
        });

        // Test if comparing the same passwords gives true
        it('should return true for matching passwords', async () => {
            const plainPassword = 'MyPassword123';
            const hashedPassword = await securePassword.hashPassword(plainPassword);
        
            const result = await securePassword.comparePasswords(plainPassword, hashedPassword);
        
            // Assert that the passwords match
            expect(result).to.be.true;
          });
        
        // Test if comparing a different passwords gives false
        it('should return false for non-matching passwords', async () => {
            const plainPassword = 'MyPassword123';
            const wrongPassword = 'WrongPassword123';
            const hashedPassword = await securePassword.hashPassword(plainPassword);
        
            const result = await securePassword.comparePasswords(wrongPassword, hashedPassword);
        
            // Assert that the passwords don't match
            expect(result).to.be.false;
        });
    });
});