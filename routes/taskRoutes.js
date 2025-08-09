const express = require('express');
const router = express.Router();

const {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const { protect } = require('../middlewares/authMiddleware');

// Route: /api/tasks
router
  .route('/')
  .get(protect, getTasks)     // Get all tasks (with filters/sorting/pagination)
  .post(protect, createTask); // Create a new task

// Route: /api/tasks/:id
router
  .route('/:id')
  .get(protect, getTask)       // Get single task by ID
  .put(protect, updateTask)    // Update task by ID
  .delete(protect, deleteTask) // Delete task by ID

module.exports = router;
