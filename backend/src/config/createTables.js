const pool = require("./db");

const checkUsersTableQuery = `
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
  );
`;
const checkTransactionsTableQuery = `
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'transactions'
  );
`;

const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP , 
    balance Numeric(16,2) DEFAULT 0.0 NOT NULL,
    saving_goal Numeric(16,2) DEFAULT 0.0 NOT NULL

  );
`;
const createTransactionTableQuery = `
  CREATE TABLE IF NOT EXISTS transactions (\
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL , 
    amount Numeric(16,2) NOT NULL,
    description TEXT , 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

  )


`;

async function createTables() {
    try {
        // Check if users table exists
        const { rows: usersTableExists } = await pool.query(
            checkUsersTableQuery
        );
        if (!usersTableExists[0].exists) {
            // Create users table
            await pool.query(createUserTableQuery);
            console.log("Users table created successfully");
        } else {
            console.log("Users table already exists");
        }

        // Check if transactions table exists
        const { rows: transactionsTableExists } = await pool.query(
            checkTransactionsTableQuery
        );
        if (!transactionsTableExists[0].exists) {
            // Create transactions table
            await pool.query(createTransactionTableQuery);
            console.log("Transactions table created successfully");
        } else {
            console.log("Transactions table already exists");
        }
    } catch (error) {
        console.error("Error creating tables:", error);
    }
}

module.exports = createTables;
