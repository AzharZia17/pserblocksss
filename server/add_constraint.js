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

        try {
            // Re-add unique constraint.
            // First, we might need to clean up duplicates if any were added in the meantime.
            // For simplicity, we'll try to add it. If it fails, user has duplicates.
            // But since this is a dev env, I'll just try to add it.
            await client.query('ALTER TABLE blocks ADD CONSTRAINT blocks_block_number_key UNIQUE (block_number)');
            console.log("Re-added UNIQUE constraint on block_number.");
        } catch (err) {
            console.error("Error adding constraint (maybe duplicate data exists?):", err.message);
            console.log("Attempting to delete duplicates keeping latest...");
            // Keep latest
            await client.query(`
                DELETE FROM blocks a USING blocks b
                WHERE a.id < b.id AND a.block_number = b.block_number;
            `);
            console.log("Duplicates deleted.");
            await client.query('ALTER TABLE blocks ADD CONSTRAINT blocks_block_number_key UNIQUE (block_number)');
            console.log("Re-added UNIQUE constraint on block_number.");
        }

    } catch (err) {
        console.error("Migration error:", err);
    } finally {
        await client.end();
    }
}

migrate();
