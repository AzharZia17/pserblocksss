const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function migrate() {
    try {
        await client.connect();
        console.log("Connected to database.");

        // Try to drop the unique constraint. 
        // Constraint name is usually 'blocks_block_number_key' for table 'blocks' column 'block_number'.
        try {
            await client.query('ALTER TABLE blocks DROP CONSTRAINT blocks_block_number_key');
            console.log("Dropped UNIQUE constraint on block_number.");
        } catch (err) {
            console.log("Constraint might not exist or name is different:", err.message);
        }

    } catch (err) {
        console.error("Migration error:", err);
    } finally {
        await client.end();
    }
}

migrate();
