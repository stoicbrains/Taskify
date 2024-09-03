const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./Db/Connect');
const Todo = require('./Models/TodoModel');
const User = require('./Models/UserModel');
const authMiddleware = require('../app/Middleware/authMiddleware'); // Import the middleware

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.post('/api/users', async (req, res) => {
  try {
    const { Name, username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before saving
    const newUser = new User({
      Name,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'New user created', user: newUser });
  } catch (error) {
    console.error('User Registration Error:', error.message);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      'your_jwt_secret', 
      { expiresIn: '12h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});


app.get('/api/todos', authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ username: req.user.username });
    res.status(200).json(todos);
  } catch (error) {
    console.error('Fetch Todos Error:', error.message);
    res.status(500).json({ message: 'Error fetching todos', error: error.message });
  }
});


app.post('/api/todos', authMiddleware, async (req, res) => {
  try {
    const { title, desc } = req.body;

    const newTodo = new Todo({
      time: new Date(),
      title,
      desc,
      completed: false,
      username: req.user.username,
    });

    await newTodo.save();
    res.status(201).json({ message: 'New todo created', todo: newTodo });
  } catch (error) {
    console.error('Create Todo Error:', error.message);
    res.status(500).json({ message: 'Error creating todo', error: error.message });
  }
});


app.put('/api/todos/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndUpdate(
      { _id: id, username: req.user.username },
      req.body,
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or unauthorized' });
    }

    res.status(200).json({ message: 'Todo updated', todo });
  } catch (error) {
    console.error('Update Todo Error:', error.message);
    res.status(500).json({ message: 'Error updating todo', error: error.message });
  }
});

app.delete('/api/todos/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({ _id: id, username: req.user.username });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or unauthorized' });
    }

    res.status(200).json({ message: 'Todo deleted', todo });
  } catch (error) {
    console.error('Delete Todo Error:', error.message);
    res.status(500).json({ message: 'Error deleting todo', error: error.message });
  }
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
