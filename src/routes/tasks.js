const express = require('express');
const router = express.Router();
const taskModel = require('../models/task');

// Create a new task
router.post('/', (req, res) => {
  const { title, description, deadline } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  taskModel.createTask(title, description, deadline, (err, task) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create task' });
    }
    res.status(201).json(task);
  });
});

// List all tasks
router.get('/', (req, res) => {
  taskModel.getAllTasks((err, tasks) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to get tasks' });
    }
    res.json(tasks);
  });
});

// Update an existing task
router.put('/:id', (req, res) => {
  const taskId = req.params.id;
  const updates = req.body; // e.g., { status: 'done', deadline: '2023-10-31' }

  if (updates.status && !['pending', 'done'].includes(updates.status)) {
    return res.status(400).json({ error: 'Invalid status. Must be pending or done' });
  }

  taskModel.updateTask(taskId, updates, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update task' });
    }
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Task not found or no updates provided' });
    }
    res.json({ message: 'Task updated successfully' });
  });
});

module.exports = router;
