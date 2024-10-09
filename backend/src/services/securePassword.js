const bcrypt = require("bcrypt");
const saltRounds = 10;

/**
 * Hashes the password using bcrypt. This is neccesary so that we are not just storing user passwords in plain text on our
 * Database in case anything goes wrong with security on the datbases end
 *
 * @param {string} password - The plain text password to hash.
 * @return {Promise<string>} - The hashed password.
 * @throws {Error} - Throws an error if hashing fails.
 */

async function hashPassword(password) {
    try {
        // Generate a salt using the specified number of salt rounds
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash the password with the generated salt
        const hashedPassword = await bcrypt.hash(password, salt);

        return hashedPassword; // Return the hashed password
    } catch (error) {
        throw new Error("Error hashing password"); // Throw an error if hashing fails
    }
}

/**
 * Compares plain text password with a hashed password to check if they match.
 *
 *
 * @param {string} password - The plain text password.
 * @param {string} hashedPassword - The hashed password to compare with.
 * @return {Promise<boolean>} - Returns true if the passwords match, false otherwise.
 * @throws {Error} - Throws an error if the comparison fails.
 */

async function comparePasswords(password, hashedPassword) {
    try {
        // Compare the plain text password with the hashed password
        const match = await bcrypt.compare(password, hashedPassword);

        return match;
    } catch (error) {
        throw new Error("Error comparing passwords");
    }
}

module.exports = {
    hashPassword,
    comparePasswords,
};
