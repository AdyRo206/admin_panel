const express = require('express');
const mysql = require('mysql');

const app = express();
const PORT = 5501;

// Conexiune MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'test1234',
  database: 'admin_panel',
});

db.connect((err) => {
  if (err) {
    console.error('Eroare la conectarea la MySQL:', err);
    return;
  }
  console.log('Conexiune reușită la MySQL!');
});

// Endpoint test MySQL
app.get('/api/utilizatori', (req, res) => {
  const query = 'SELECT * FROM utilizatori';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Eroare la query:', err);
      res.status(500).send('Eroare la interogarea bazei de date');
      return;
    }
    res.json(results);
  });
});

// Endpoint test server
app.get('/', (req, res) => {
  res.send('Serverul Node.js funcționează!');
});

// Pornire server
app.listen(PORT, () => {
  console.log(`Serverul rulează pe http://localhost:${PORT}`);
});
