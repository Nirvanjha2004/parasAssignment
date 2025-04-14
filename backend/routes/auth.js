const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, mobile, role } = req.body;
    
    if (!name || !email || !password || !mobile || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (role !== 'owner' && role !== 'seeker') {
      return res.status(400).json({ error: 'Role must be either "owner" or "seeker"' });
    }
    
    const user = await User.create({
      name,
      email,
      password, // Note: In a real app, password should be hashed
      mobile,
      role
    });
    
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = await User.getByEmail(email);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Remove password before sending back user data
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      user: userWithoutPassword,
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
