const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const collegeRoutes = require('./routes/collegeRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create necessary directories
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}
if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}

// Initialize users.json if it doesn't exist
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// Helper functions for file-based storage
const readUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch (error) {
    return [];
  }
};

const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

const findUserById = (id) => {
  const users = readUsers();
  return users.find(user => user._id === id);
};

const findUserByEmail = (email) => {
  const users = readUsers();
  return users.find(user => user.email === email);
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Authentication Middleware
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const user = findUserById(decoded._id);
    
    if (!user) {
      throw new Error();
    }
    
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// College routes
app.use('/api/colleges', collegeRoutes);

// Routes

// Register User
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = {
      _id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role: 'student',
      createdAt: new Date()
    };
    
    const users = readUsers();
    users.push(user);
    writeUsers(users);
    
    // Generate token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login User
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get User Profile
app.get('/api/users/profile', auth, (req, res) => {
  try {
    const { password: _, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Profile
app.put('/api/users/profile', auth, async (req, res) => {
  try {
    const users = readUsers();
    const userIndex = users.findIndex(u => u._id === req.user._id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = [
      'name', 
      'phone', 
      'birthDate', 
      'interests',
      'education',
      'skills',
      'languages',
      'location',
      'bio',
      'socialLinks',
      'gender',
      'academicYear'
    ];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates!' });
    }

    updates.forEach(update => {
      users[userIndex][update] = req.body[update];
    });

    writeUsers(users);
    
    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Profile Picture
app.post('/api/users/upload-profile-picture', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    // Delete old profile picture if it exists
    const users = readUsers();
    const userIndex = users.findIndex(u => u._id === req.user._id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete old profile picture if it exists and it's not a default image
    if (users[userIndex].profilePicture && !users[userIndex].profilePicture.startsWith('/images/')) {
      const oldPicturePath = path.join(__dirname, users[userIndex].profilePicture);
      if (fs.existsSync(oldPicturePath)) {
        fs.unlinkSync(oldPicturePath);
      }
    }

    // Update with new profile picture
    users[userIndex].profilePicture = '/uploads/' + req.file.filename;
    writeUsers(users);

    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Profile Picture with Default Image
app.post('/api/users/update-profile-picture', auth, async (req, res) => {
  try {
    const users = readUsers();
    const userIndex = users.findIndex(u => u._id === req.user._id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { profilePicture } = req.body;
    
    // Validate that the profile picture is one of the default images
    if (!profilePicture.startsWith('/images/')) {
      return res.status(400).json({ error: 'Invalid profile picture path' });
    }

    // Delete old profile picture if it exists and it's not a default image
    if (users[userIndex].profilePicture && !users[userIndex].profilePicture.startsWith('/images/')) {
      const oldPicturePath = path.join(__dirname, users[userIndex].profilePicture);
      if (fs.existsSync(oldPicturePath)) {
        fs.unlinkSync(oldPicturePath);
      }
    }

    users[userIndex].profilePicture = profilePicture;
    writeUsers(users);

    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
