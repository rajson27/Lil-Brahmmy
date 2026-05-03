const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// 📁 1. Auto-create 'uploads' folder if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log("📁 Created 'uploads' folder");
}

// 🖼️ 2. Configure Image Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } 
});

// 🌐 3. Make the uploads folder accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🗄️ 4. MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rajson12345', 
    database: 'brahmmy_db',
    port: 3306   
});

db.connect(err => {
    if (err) console.error("❌ Database connection failed:", err.message);
    else console.log("✅ Connected to MySQL Database");
});

// --- ROUTES ---

// 🔑 LOGIN
app.post('/login', (req, res) => {
    const { id, password } = req.body;
    const sql = "SELECT * FROM users WHERE faculty_id = ? AND password = ?";
    
    db.query(sql, [id, password], (err, data) => {
        if (err) return res.status(500).json({ success: false, message: "Internal Server Error" });
        
        if (data.length > 0) {
            const user = data[0];
            if (user.status === 'approved') {
                res.json({ success: true, user: user });
            } else if (user.status === 'declined') {
                res.json({ success: false, message: `Declined: ${user.decline_reason || 'Please contact admin.'}` });
            } else {
                res.json({ success: false, message: "Account pending. Admin is reviewing your ID proof." });
            }
        } else {
            res.json({ success: false, message: "Invalid Faculty ID or Password" });
        }
    });
});

app.post('/register', upload.single('proof_image'), (req, res) => {
    const { id, name, email, password } = req.body;
    const proof_image = req.file ? req.file.filename : null;

    console.log("Attempting to register:", { id, name, email }); // DEBUG LOG

    if (!proof_image) return res.status(400).json({ error: "ID Proof image is required." });

    const sql = "INSERT INTO users (faculty_id, full_name, email, password, proof_image, status, role) VALUES (?, ?, ?, ?, ?, 'pending', 'teacher')";
    
    db.query(sql, [id, name, email, password, proof_image], (err, result) => {
        if (err) {
            console.error("SQL ERROR:", err); // THIS WILL TELL US THE EXACT BUG
            if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "ID or Email already exists!" });
            return res.status(500).json({ error: "Database error." });
        }
        console.log("User added successfully, Row ID:", result.insertId);
        res.json({ message: "Registration successful!" });
    });
});

// 👮 ADMIN: GET ALL USERS (For Management & History)
app.get('/admin/all-users', (req, res) => {
    // Orders by newest first so your history looks correct
    db.query("SELECT * FROM users ORDER BY created_at DESC", (err, data) => {
        if (err) return res.status(500).json([]);
        res.json(data);
    });
});

// 👮 ADMIN: UPDATE STATUS (Approve/Decline)
app.post('/admin/update-status', (req, res) => {
    const { userId, status, reason } = req.body;
    const sql = "UPDATE users SET status = ?, decline_reason = ? WHERE id = ?";
    
    db.query(sql, [status, reason || null, userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `User ${status} successfully!` });
    });
});

// 👮 ADMIN: PERMANENTLY REMOVE TEACHER
app.delete('/admin/delete-user/:id', (req, res) => {
    const userId = req.params.id;
    const sql = "DELETE FROM users WHERE id = ? AND role != 'admin'"; // Safety: can't delete admins
    
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Teacher removed from system." });
    });
});

app.listen(3001, () => console.log("🚀 Server running on http://localhost:3001"));