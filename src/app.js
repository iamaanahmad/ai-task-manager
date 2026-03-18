const express = require('express');
const app = express();
const tasksRoutes = require('./routes/tasks');

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the AI-Assisted Task Manager API. Check out /tasks to manage your tasks.');
});

// Routes
app.use('/tasks', tasksRoutes);

module.exports = app;
