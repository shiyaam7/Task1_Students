const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Replace these values with your MySQL credentials
const dbConfig = {
  //host: 'localhost',
  host: 'sql12.freemysqlhosting.net',
  //user: 'root',
  user: 'sql12661489',
  //password: 'mysql',
  password: 'a6v1d7maPW',
  //database: 'school'
  database: 'sql12661489'
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.use(bodyParser.json());

app.use(express.static(__dirname));

app.get('/getStudents', (req, res) => {
  const className = req.query.class || 'Class A';
  const query = `SELECT * FROM school WHERE class = ? ORDER BY sort_rank`;
  connection.query(query, [className], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

app.post('/updateSortOrder', (req, res) => {
  const updatedOrder = req.body.sortOrder;
  const className = req.body.className || 'Class A';

  updatedOrder.forEach((student, index) => {
    const query = 'UPDATE school SET sort_rank = ? WHERE class = ? AND name_of_student = ?';
    connection.query(query, [index + 1, className, student], (err) => {
      if (err) {
        console.error('Error updating MySQL record:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
    });
  });

  res.send('Sort order updated successfully');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
