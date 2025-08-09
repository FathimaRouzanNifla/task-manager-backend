const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    // Reference to the user who owns the task
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User model
    },

    // Task title
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },

    // Task description (optional)
    description: {
      type: String,
      default: '',
      trim: true,
    },

    // Due date for the task
    dueDate: {
      type: Date,
      required: [true, 'Please add a due date'],
    },

    // Priority: Low, Medium, or High
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },

    // Status: Pending or Completed
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Task', taskSchema);
