// ===== IMPORTS =====
const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
require('dotenv').config()

const app = express()

// ===== MIDDLEWARE =====
app.use(cors())
app.use(express.json())

// ===== DATABASE CONNECTION =====
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'portfolio_db'
})

db.connect((err) => {
    if (err) {
        console.log('❌ Database connection failed:', err)
    } else {
        console.log('✅ Connected to MySQL database!')
    }
})

// ===== ROUTES =====

// GET all projects
app.get('/api/projects', (req, res) => {
    const sql = 'SELECT * FROM projects'
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Failed to get projects' })
        } else {
            res.json(results)
        }
    })
})

// POST a contact message
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' })
    }

    const sql = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)'
    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Failed to save message' })
        } else {
            res.json({ success: true, message: 'Message received!' })
        }
    })
})

// ===== START SERVER =====
const PORT = 3000
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})