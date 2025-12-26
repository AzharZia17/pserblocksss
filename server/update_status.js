const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function updateStatus() {
    try {
        await client.connect();

        // Update all 'Recorded' (from previous step) to 'Assigned'
        await client.query("UPDATE blocks SET status = 'Assigned' WHERE status = 'Recorded'");
        console.log("Updated old 'Recorded' blocks to 'Assigned'.");

    } catch (err) {
        console.error("Update error:", err);
    } finally {
        await client.end();
    }
}

updateStatus();
