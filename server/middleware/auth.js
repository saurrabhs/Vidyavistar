const jwt = require('jsonwebtoken');
const { readUsers } = require('../utils/userUtils');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('No authentication token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const users = await readUsers();
    const user = users.find(u => u._id === decoded._id);
    
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

module.exports = auth;
