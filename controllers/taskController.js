const Task = require('../models/Task');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all tasks for a user (with filtering, sorting, pagination)
// @route   GET /api/tasks
// @access  Private
exports.getTasks = asyncHandler(async (req, res, next) => {
  const { status, priority, sort, search } = req.query;
  const query = { user: req.user._id };

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (search) query.title = { $regex: search, $options: 'i' };

  let sortOption = {};
  if (sort === 'dueDate') sortOption = { dueDate: 1 };
  else if (sort === 'priority') sortOption = { priority: -1 };
  else sortOption = { createdAt: -1 };

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const tasks = await Task.find(query).sort(sortOption).skip(skip).limit(limit);
  const totalTasks = await Task.countDocuments(query);

  res.json({
    tasks,
    page,
    pages: Math.ceil(totalTasks / limit),
    totalTasks,
  });
});

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = asyncHandler(async (req, res, next) => {
  const { title, description, dueDate, priority } = req.body;

  if (!title || !description || !dueDate || !priority) {
    return next(new ErrorResponse('Please provide all required fields', 400));
  }

  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    dueDate,
    priority,
  });

  res.status(201).json(task);
});

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    return next(new ErrorResponse('Task not found', 404));
  }

  res.json(task);
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = asyncHandler(async (req, res, next) => {
  const { title, description, dueDate, priority, status } = req.body;

  let task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    return next(new ErrorResponse('Task not found', 404));
  }

  task.title = title || task.title;
  task.description = description || task.description;
  task.dueDate = dueDate || task.dueDate;
  task.priority = priority || task.priority;
  task.status = status || task.status;

  const updatedTask = await task.save();
  res.json(updatedTask);
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const deleted = await Task.deleteOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (deleted.deletedCount === 0) {
    return next(new ErrorResponse('Task not found or already deleted', 404));
  }

  res.json({ message: 'Task deleted successfully' });
});
