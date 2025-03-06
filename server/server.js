const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const fsPromises = require('fs').promises;
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Create necessary directories
const uploadsDir = path.join(__dirname, 'uploads');
const dataDir = path.join(__dirname, 'data');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize users.json if it doesn't exist
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// Helper functions for file-based storage
const readUsers = async () => {
  try {
    const data = await fsPromises.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

const writeUsers = async (users) => {
  await fsPromises.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
};

const findUserById = async (id) => {
  const users = await readUsers();
  return users.find(user => user._id === id);
};

const findUserByEmail = async (email) => {
  const users = await readUsers();
  return users.find(user => user.email === email);
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
    }
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Authentication Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('No authentication token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const user = await findUserById(decoded._id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.error('Authentication error:', e.message);
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

// College routes
const collegeRoutes = require('./routes/collegeRoutes');
app.use('/api/colleges', collegeRoutes);

// ChatGPT routes
const chatgptRoutes = require('./routes/chatgpt');
app.use('/api/chatgpt', chatgptRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Register User
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
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
    
    const users = await readUsers();
    users.push(user);
    await writeUsers(users);
    
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
    const user = await findUserByEmail(email);
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
app.get('/api/users/profile', auth, async (req, res) => {
  try {
    const { password: _, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User Profile
app.put('/api/users/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const users = await readUsers();
    const userIndex = users.findIndex(user => user._id === req.user._id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user data while preserving sensitive fields
    const updatedUser = {
      ...users[userIndex],
      ...updates,
      // Preserve these fields
      _id: users[userIndex]._id,
      email: users[userIndex].email,
      password: users[userIndex].password,
      role: users[userIndex].role
    };

    users[userIndex] = updatedUser;
    await writeUsers(users);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Upload Profile Picture
app.post('/api/users/upload-profile-picture', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const users = await readUsers();
    const userIndex = users.findIndex(u => u._id === req.user._id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete old profile picture if it exists and is not a default picture
    if (users[userIndex].profilePicture && 
        !users[userIndex].profilePicture.startsWith('/images/') &&
        fs.existsSync(path.join(__dirname, users[userIndex].profilePicture))) {
      await fsPromises.unlink(path.join(__dirname, users[userIndex].profilePicture));
    }

    // Update user's profile picture path
    const profilePicturePath = '/uploads/' + req.file.filename;
    users[userIndex].profilePicture = profilePicturePath;
    await writeUsers(users);

    res.json({ profilePicture: profilePicturePath });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
});

// Update Profile Picture (for default pictures)
app.post('/api/users/update-profile-picture', auth, async (req, res) => {
  try {
    const { profilePicture } = req.body;
    if (!profilePicture) {
      return res.status(400).json({ error: 'Profile picture URL is required' });
    }

    const users = await readUsers();
    const userIndex = users.findIndex(u => u._id === req.user._id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete old profile picture if it exists and is not a default picture
    if (users[userIndex].profilePicture && 
        !users[userIndex].profilePicture.startsWith('/images/') &&
        fs.existsSync(path.join(__dirname, users[userIndex].profilePicture))) {
      await fsPromises.unlink(path.join(__dirname, users[userIndex].profilePicture));
    }

    users[userIndex].profilePicture = profilePicture;
    await writeUsers(users);

    res.json({ profilePicture });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Failed to update profile picture' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
