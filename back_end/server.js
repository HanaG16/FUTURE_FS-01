// ===== IMPORTS =====
const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
require('dotenv').config()

const app = express()

// ===== MIDDLEWARE =====
app.use(cors())
app.use(express.json())

// ===== DATABASE CONNECTION POOL =====
const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

// test connection
pool.getConnection((err, connection) => {
    if (err) {
        console.log('❌ Database connection failed:', err)
    } else {
        console.log('✅ Connected to MySQL database!')
        connection.release()
    }
})
// ===== ROUTES =====

// GET all projects
app.get('/api/projects', (req, res) => {
    pool.query('SELECT * FROM projects', (err, results) => {
        if (err) {
            console.log('Database error:', err)
            res.status(500).json([])
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
    pool.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.log('Insert error:', err)
            res.status(500).json({ error: 'Failed to save message' })
        } else {
            res.json({ success: true, message: 'Message received!' })
        }
    })
})

// ===== START SERVER =====
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
})
