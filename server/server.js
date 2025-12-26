const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');
const ExcelJS = require('exceljs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});

// Routes

// GET /api/blocks - Fetch all blocks
app.get('/api/blocks', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM blocks ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error("GET /api/blocks error:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/blocks - Add a new block
app.post('/api/blocks', async (req, res) => {
    const { block_number } = req.body;
    console.log("Received block_number:", block_number);

    if (!block_number) {
        return res.status(400).json({ error: 'Block number is required' });
    }

    try {
        // Check if block already exists
        const checkRes = await db.query('SELECT id FROM blocks WHERE block_number = $1', [block_number]);
        if (checkRes.rows.length > 0) {
            return res.status(400).json({ error: 'Block number already exists' });
        }

        // Insert new block as 'Assigned'
        const insertRes = await db.query(
            "INSERT INTO blocks (block_number, status) VALUES ($1, 'Assigned') RETURNING *",
            [block_number]
        );

        console.log("Block added:", insertRes.rows[0]);
        res.status(201).json(insertRes.rows[0]);
    } catch (err) {
        console.error("POST /api/blocks error:", err);
        // Handle unique constraint violation just in case
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Block number already exists' });
        }
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

// GET /api/blocks/search - Search block
app.get('/api/blocks/search', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query required' });

    try {
        const result = await db.query('SELECT * FROM blocks WHERE block_number = $1', [q]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.json({ block_number: q, status: 'Not Found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/export - Export Excel
app.get('/api/export', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM blocks ORDER BY created_at ASC');
        const blocks = result.rows;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Blocks');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Block Number', key: 'block_number', width: 20 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Created At', key: 'created_at', width: 25 },
        ];

        worksheet.addRows(blocks);

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + 'blocks.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
