const db = require('../db/database');

// Create a new task
const createTask = (title, description, deadline, callback) => {
  const sql = `INSERT INTO tasks (title, description, status, deadline) VALUES (?, ?, 'pending', ?)`;
  db.run(sql, [title, description, deadline], function (err) {
    callback(err, { id: this?.lastID, title, description, status: 'pending', deadline });
  });
};

// Get all tasks
const getAllTasks = (callback) => {
  const sql = `SELECT * FROM tasks`;
  db.all(sql, [], (err, rows) => {
    callback(err, rows);
  });
};

// Update task status, deadline, title, or description
const updateTask = (id, updates, callback) => {
  const fields = [];
  const params = [];
  
  Object.keys(updates).forEach(key => {
    if (updates[key] !== undefined) {
      if (['title', 'description', 'status', 'deadline'].includes(key)) {
        fields.push(`${key} = ?`);
        params.push(updates[key]);
      }
    }
  });

  if (fields.length === 0) {
    return callback(null, { changes: 0 });
  }

  params.push(id);
  const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
  
  db.run(sql, params, function (err) {
    callback(err, { changes: this?.changes });
  });
};

// Clear all tasks for testing purposes
const clearTasks = (callback) => {
  const sql = `DELETE FROM tasks`;
  db.run(sql, [], function (err) {
    if (callback) callback(err);
  });
}

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  clearTasks
};
