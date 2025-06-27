const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Employee = require('./employee.model');

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/jala_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    res.redirect('/dashboard.html');
  } else {
    res.send('<script>alert("Invalid Credentials!"); window.location="/index.html";</script>');
  }
});

// Admin login route
app.post('/admin-login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    res.redirect('/dashboard.html');
  } else {
    res.send('<script>alert("Invalid Admin Credentials!"); window.location="/admin-login.html";</script>');
  }
});

// Forgot password route
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  console.log('Reset password link sent to:', email);
  res.send('<script>alert("Reset link sent to your email."); window.location="/index.html";</script>');
});

// Create employee
app.post('/api/employees', async (req, res) => {
  try {
    const emp = new Employee(req.body);
    await emp.save();
    res.redirect('/employee-search.html');
  } catch (err) {
    res.status(400).send('Error saving employee');
  }
});

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).send('Error fetching employees');
  }
});

// Update employee
app.put('/api/employees/:id', async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).send('Update failed');
  }
});

// Delete employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send('Error deleting employee');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
