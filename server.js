const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// In-memory storage for tasks
let tasks = [];

// Middleware for basic validation
const validateTask = (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required." });
  }
  next();
};

// API Documentation
app.get("/", (req, res) => {
  res.send("Welcome to Task Manager API");
});

// Retrieve all tasks
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

// Retrieve a specific task by ID
app.get("/tasks/:id", (req, res) => {
  const id = req.params.id;
  const task = tasks.find((task) => task.id === id);
  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }
  res.status(200).json(task);
});

// Create a new task
app.post("/tasks", validateTask, (req, res) => {
  const newTask = {
    id: String(tasks.length + 1),
    title: req.body.title,
    description: req.body.description,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update an existing task by ID
app.put("/tasks/:id", validateTask, (req, res) => {
  const id = req.params.id;
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found." });
  }
  tasks[taskIndex] = {
    id,
    title: req.body.title,
    description: req.body.description,
  };
  res.status(200).json(tasks[taskIndex]);
});

// Delete a task by ID
app.delete("/tasks/:id", (req, res) => {
  const id = req.params.id;
  tasks = tasks.filter((task) => task.id !== id);
  res.status(200).json({ message: "Task deleted successfully." });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error." });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
