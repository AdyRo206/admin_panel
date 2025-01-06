const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5501;

const ADMIN_PIN = process.env.ADMIN_PIN || '1234'; // PIN default

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Serverul Node.js funcționează corect!');
});

function authenticateAdmin(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ success: false, error: 'Token lipsește.' });
  }

  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Token invalid.' });
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Nu ai permisiunea de a accesa această resursă.' });
    }

    req.user = decoded;  
    next();
  });
}

function authenticateAdminOrUser(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.redirect('/login.html'); 
  }

  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Token invalid!' });
    }

    req.user = decoded;
    next();
  });
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username și parola sunt obligatorii!' });
  }

  const query = 'SELECT * FROM users WHERE username = ? LIMIT 1';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Eroare la baza de date:', err);
      return res.status(500).json({ success: false, error: 'Eroare la server.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, error: 'Username sau parola incorecte!' });
    }

    const user = results[0];

    if (!user.is_approved) {
      return res.status(403).json({ success: false, error: 'Contul tău nu a fost încă aprobat.' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Eroare la compararea parolei:', err);
        return res.status(500).json({ success: false, error: 'Eroare la server.' });
      }

      if (isMatch) {
        const token = jwt.sign({ id: user.id, role: user.role }, 'secret_key', { expiresIn: '1h' });

        return res.json({
          success: true,
          token,
          user: {
            username: user.username,
            profilePic: user.profilePic || 'assets/profile_pic.jpg',
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
          },
        });
      } else {
        return res.status(401).json({ success: false, error: 'Username sau parola incorecte!' });
      }
    });
  });
});

app.post('/register', (req, res) => {
  const { username, password, firstName, lastName, email } = req.body;

  if (!username || !password || !firstName || !lastName || !email) {
    return res.status(400).json({ success: false, error: 'Toate câmpurile sunt obligatorii!' });
  }

  const queryCheck = 'SELECT * FROM users WHERE username = ? LIMIT 1';
  db.query(queryCheck, [username], (err, results) => {
    if (err) {
      console.error('Eroare la verificarea utilizatorului:', err);
      return res.status(500).json({ success: false, error: 'Eroare la server.' });
    }

    if (results.length > 0) {
      return res.status(409).json({ success: false, error: 'Utilizatorul există deja!' });
    }

    const role = 'user';
    const isApproved = false; 

    const query = 'INSERT INTO users (username, password, first_name, last_name, email, role, is_approved) VALUES (?, ?, ?, ?, ?, ?, ?)';
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Eroare la criptarea parolei:', err);
        return res.status(500).json({ success: false, error: 'Eroare la server.' });
      }

      db.query(query, [username, hashedPassword, firstName, lastName, email, role, isApproved], (err, result) => {
        if (err) {
          console.error('Eroare la înregistrarea utilizatorului:', err);
          return res.status(500).json({ success: false, error: 'Eroare la server.' });
        }

        res.status(201).json({ success: true, message: 'Utilizator înregistrat cu succes!' });
      });
    });
  });
});

app.get('/users', authenticateAdmin, (req, res) => {
  const query = 'SELECT * FROM users ORDER BY id DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Eroare la obținerea utilizatorilor:', err);
      return res.status(500).json({ success: false, error: 'Eroare la server.' });
    }

    res.json({ success: true, users: results });
  });
});

app.post('/reset-password', authenticateAdmin, (req, res) => {
  const { userId, newPassword, pin } = req.body;

  if (pin !== ADMIN_PIN) {
    return res.status(403).json({ success: false, message: "PIN incorect." });
  }

  if (!userId || !newPassword) {
    return res.status(400).json({ success: false, message: "Datele trimise sunt invalide." });
  }

  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Eroare la criptarea parolei:', err);
      return res.status(500).json({ success: false, message: 'Eroare la server.' });
    }

    const query = 'UPDATE users SET password = ? WHERE id = ?';
    db.query(query, [hashedPassword, userId], (err, result) => {
      if (err) {
        console.error('Eroare la actualizarea parolei:', err);
        return res.status(500).json({ success: false, error: 'Eroare la server.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Utilizatorul nu a fost găsit.' });
      }

      res.json({ success: true, message: 'Parola a fost actualizată cu succes.' });
    });
  });
});

app.post('/toggle-role', authenticateAdmin, (req, res) => {
  const { userId, newRole, pin } = req.body;

  if (pin !== ADMIN_PIN) {
    return res.status(403).json({ success: false, message: "PIN incorect." });
  }

  if (!userId || !newRole) {
    return res.status(400).json({ success: false, message: "Datele trimise sunt invalide." });
  }

  const query = 'UPDATE users SET role = ? WHERE id = ?';
  db.query(query, [newRole, userId], (err, result) => {
    if (err) {
      console.error('Eroare la schimbarea rolului:', err);
      return res.status(500).json({ success: false, error: 'Eroare la server.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Utilizatorul nu a fost găsit.' });
    }

    res.json({ success: true, message: `Rolul utilizatorului a fost schimbat în ${newRole}.` });
  });
});

app.post('/toggle-approval', authenticateAdmin, (req, res) => {
  const { userId, newStatus, pin } = req.body;

  if (pin !== ADMIN_PIN) {
    return res.status(403).json({ success: false, message: "PIN incorect." });
  }

  if (!userId || typeof newStatus !== 'boolean') {
    return res.status(400).json({ success: false, message: "Datele trimise sunt invalide." });
  }

  const query = 'UPDATE users SET is_approved = ? WHERE id = ?';
  db.query(query, [newStatus, userId], (err, result) => {
    if (err) {
      console.error('Eroare la aprobarea utilizatorului:', err);
      return res.status(500).json({ success: false, error: 'Eroare la server.' });
    }

    res.json({ success: true, message: `Statusul utilizatorului a fost actualizat.` });
  });
});

app.delete('/delete-user', authenticateAdmin, (req, res) => {
  const { userId, pin } = req.body;

  if (!userId || !pin) {
    return res.status(400).json({ success: false, message: 'ID-ul utilizatorului și PIN-ul sunt obligatorii.' });
  }

  if (pin !== ADMIN_PIN) {
    return res.status(403).json({ success: false, message: 'PIN incorect.' });
  }

  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Eroare la ștergerea utilizatorului:', err);
      return res.status(500).json({ success: false, error: 'Eroare la server.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Utilizatorul nu există.' });
    }

    res.json({ success: true, message: 'Contul a fost șters cu succes!' });
  });
});

app.listen(PORT, () => {
  console.log(`Serverul funcționează pe http://localhost:${PORT}`);
});
