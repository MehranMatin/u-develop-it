// import express
const express = require('express');
// import mysql2
const mysql = require('mysql2');
// import module given to us by colleage
const inputCheck = require('./utils/inputCheck');
// port designation
const PORT = process.env.PORT || 3001;
// expression to instantiate express
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username
        user: 'root',
        // Your MySQL password
        password: '18001800',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

// Get all the candidates
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// GET a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// Create a candidate
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(
        body,
            'first_name', 
            'last_name',
            'industry_connected'
        );
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// connection function that will start the Express.js server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});