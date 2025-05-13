const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5501;

// PIN pentru rute admin
const ADMIN_PIN = process.env.ADMIN_PIN || '1234'; 

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// User hardcodat (mock)
const mockUser = {
  id: 1,
  username: 'admin',
  password: 'parola123', // parola simplă, pentru testare
  first_name: 'Test',
  last_name: 'User',
  email: 'admin@example.com',
  role: 'admin',
  is_approved: true,
  profilePic: ''
};

// Middleware pentru autentificare admin
function authenticateAdmin(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ success: false, error: 'Token lipsește.' });
  }

  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err || decoded.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Acces interzis.' });
    }

    req.user = decoded;
    next();
  });
}

// Middleware pentru autentificare generală
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

// Ruta de test
app.get('/', (req, res) => {
  res.send('✅ Serverul mock funcționează!');
});

// Login fără DB
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === mockUser.username && password === mockUser.password) {
    const token = jwt.sign({ id: mockUser.id, role: mockUser.role }, 'secret_key', { expiresIn: '1h' });

    return res.json({
      success: true,
      token,
      user: {
        username: mockUser.username,
        profilePic: mockUser.profilePic || 'assets/profile_pic.jpg',
        firstName: mockUser.first_name,
        lastName: mockUser.last_name,
        role: mockUser.role,
      },
    });
  } else {
    return res.status(401).json({ success: false, error: 'Username sau parola incorecte!' });
  }
});

// Ruta protejată – doar admin
app.get('/users', authenticateAdmin, (req, res) => {
  res.json({ success: true, users: [mockUser] });
});

// Resetare parolă (mock)
app.post('/reset-password', authenticateAdmin, (req, res) => {
  const { userId, newPassword, pin } = req.body;

  if (pin !== ADMIN_PIN) {
    return res.status(403).json({ success: false, message: "PIN incorect." });
  }

  if (!userId || !newPassword) {
    return res.status(400).json({ success: false, message: "Date invalide." });
  }

  // Doar simulează
  res.json({ success: true, message: 'Parola a fost resetată (mock).' });
});

// Schimbare rol
app.post('/toggle-role', authenticateAdmin, (req, res) => {
  const { userId, newRole, pin } = req.body;

  if (pin !== ADMIN_PIN) {
    return res.status(403).json({ success: false, message: "PIN incorect." });
  }

  res.json({ success: true, message: `Rolul utilizatorului a fost schimbat în ${newRole} (mock).` });
});

// Aprobare user
app.post('/toggle-approval', authenticateAdmin, (req, res) => {
  const { userId, newStatus, pin } = req.body;

  if (pin !== ADMIN_PIN) {
    return res.status(403).json({ success: false, message: "PIN incorect." });
  }

  res.json({ success: true, message: `Statusul utilizatorului a fost actualizat la ${newStatus} (mock).` });
});

// Ștergere utilizator
app.delete('/delete-user', authenticateAdmin, (req, res) => {
  const { userId, pin } = req.body;

  if (!userId || !pin) {
    return res.status(400).json({ success: false, message: 'ID-ul și PIN-ul sunt obligatorii.' });
  }

  if (pin !== ADMIN_PIN) {
    return res.status(403).json({ success: false, message: 'PIN incorect.' });
  }

  res.json({ success: true, message: 'Utilizatorul a fost șters (mock).' });
});

// Pornire server
app.listen(PORT, () => {
  console.log(`🚀 Serverul mock funcționează pe http://localhost:${PORT}`);
});
