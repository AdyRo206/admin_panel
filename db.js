const mysql = require('mysql2');

// Configurarea conexiunii la baza de date
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Schimbă acest lucru cu utilizatorul tău MySQL
  password: 'test1234',      // Schimbă acest lucru cu parola ta MySQL
  database: 'admin_panel' // Numele bazei de date
});

// Verifică conexiunea
db.connect((err) => {
  if (err) {
    console.error('Eroare la conexiunea la baza de date:', err);
  } else {
    console.log('Conexiune reușită la baza de date MySQL');
  }
});

module.exports = db;
