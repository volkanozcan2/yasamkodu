const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();
const QRCode = require('qrcode');

const db = new sqlite3.Database('./students.db');
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      student_name TEXT NOT NULL,
      parent1 TEXT,
      parent2 TEXT,
      blood TEXT,
      allergies TEXT,
      medications TEXT,
      notes TEXT
    )
  `);
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/form.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

app.get('/edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/edit.html'));
});

app.get('/api/students', (req, res) => {
    db.all("SELECT * FROM students", (err, rows) => {
        if (err) {
            console.error("DB'den veri çekilemedi:", err);
            return res.status(500).json({ success: false, message: "Veri okunamadı." });
        }
        res.json(rows);
    });
});
app.get('/qr/:id', (req, res) => {
    const id = req.params.id;
    const url = `${req.protocol}://${req.headers.host}/kart/${id}`;

    QRCode.toDataURL(url, (err, qr) => {
        if (err) return res.status(500).send("QR kod üretilemedi.");
        const img = Buffer.from(qr.split(",")[1], 'base64');
        res.setHeader("Content-Type", "image/png");
        res.send(img);
    });
});
app.get('/kart/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/kart.html'));
});
app.get('/api/students/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: "Veri hatası" });
        if (!row) return res.status(404).json({ success: false, message: "Kayıt yok" });
        res.json(row);
    });
});

app.post('/kaydet', (req, res) => {
    const data = req.body;
    if (!data['student-name'] || !data.blood) {
        return res.status(400).json({ success: false, message: "Eksik bilgi." });
    }
    const id = crypto.randomUUID();
    const stmt = db.prepare(`
    INSERT INTO students (id, student_name, parent1, parent2, blood, allergies, medications, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

    stmt.run(
        id,
        data['student-name'],
        data.parent1,
        data.parent2,
        data.blood,
        data.allergies,
        data.medications,
        data.notes,
        (err) => {
            if (err) {
                console.error("DB Hatası:", err);
                return res.status(500).json({ success: false, message: "Veritabanı hatası." });
            }
            console.log("✅ Veritabanına eklendi:", id);
            res.json({ success: true, id });
        }
    );
    stmt.finalize();
});

app.put('/api/students/:id', (req, res) => {
    const id = req.params.id;
    const d = req.body;

    if (!d['student-name'] || !d.blood) {
        return res.status(400).json({ success: false, message: "Eksik bilgi" });
    }

    db.run(`
    UPDATE students SET
      student_name = ?, parent1 = ?, parent2 = ?, blood = ?,
      allergies = ?, medications = ?, notes = ?
    WHERE id = ?
  `, [
        d['student-name'],
        d.parent1,
        d.parent2,
        d.blood,
        d.allergies,
        d.medications,
        d.notes,
        id
    ], function (err) {
        if (err) return res.status(500).json({ success: false, message: "Güncelleme hatası" });
        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: "Kayıt bulunamadı" });
        }
        res.json({ success: true, message: "Kayıt güncellendi" });
    });
});

app.delete('/api/students/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM students WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ success: false, message: "Silme hatası" });
        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: "Kayıt bulunamadı" });
        }
        res.json({ success: true, message: "Kayıt silindi" });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 http://localhost:${PORT} üzerinde çalışıyor.`);
});