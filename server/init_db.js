const { Client } = require('pg');
require('dotenv').config();

const dbName = process.env.DB_NAME || 'pser_blocks';

async function initDB() {
    // 1. Connect to default 'postgres' database to check/create target DB
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: 'postgres'
    });

    try {
        await client.connect();
        console.log("Connected to 'postgres' database.");

        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
        if (res.rowCount === 0) {
            console.log(`Database '${dbName}' not found. Creating...`);
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database '${dbName}' created.`);
        } else {
            console.log(`Database '${dbName}' already exists.`);
        }
    } catch (err) {
        console.error("Error checking/creating database:", err);
        // Continue, maybe the database already exists or we can't create it (user might need to do it)
    } finally {
        await client.end();
    }

    // 2. Connect to the target database and create table
    const targetClient = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: dbName,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    try {
        await targetClient.connect();
        console.log(`Connected to '${dbName}' database.`);

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS blocks (
                id SERIAL PRIMARY KEY,
                block_number VARCHAR(255) UNIQUE NOT NULL,
                status VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await targetClient.query(createTableQuery);
        console.log("Table 'blocks' ensured.");

    } catch (err) {
        console.error("Error creating table:", err);
    } finally {
        await targetClient.end();
    }
}

initDB();
