const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Replace these values with your MySQL credentials
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'school'
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

let students = [
    { class: 'Class A', name_of_student: 'Arun', sort_rank: 1 },
    { class: 'Class B', name_of_student: 'Tejas', sort_rank: 1 },
    { class: 'Class B', name_of_student: 'David', sort_rank: 2 },
    { class: 'Class A', name_of_student: 'Uma', sort_rank: 2 },
    { class: 'Class B', name_of_student: 'Divya', sort_rank: 3 },
    { class: 'Class A', name_of_student: 'Simon', sort_rank: 3 },
    { class: 'Class A', name_of_student: 'Rakesh', sort_rank: 4 },
    { class: 'Class B', name_of_student: 'Selvam', sort_rank: 4 },
    { class: 'Class B', name_of_student: 'Shruthi', sort_rank: 5 },
    { class: 'Class A', name_of_student: 'Deepak', sort_rank: 5 },
  ];

app.use(bodyParser.json());

app.use(express.static(__dirname));

app.get('/getStudents', (req, res) => {
  const className = req.query.class || 'Class A';
  const query = `SELECT * FROM students WHERE class = ? ORDER BY sort_rank`;
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

  updatedOrder.forEach((student, index) => {
    const studentIndex = students.findIndex(s => s.name_of_student === student);
    students[studentIndex].sort_rank = index + 1;

    const query = 'UPDATE students SET sort_rank = ? WHERE class = ? AND name_of_student = ?';
    connection.query(query, [index + 1, 'Class A', student], (err) => {
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
