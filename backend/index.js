const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');

// Create routes directory if it doesn't exist
const routesDir = path.join(__dirname, 'routes');
fs.ensureDirSync(routesDir);

// Ensure models directory exists
const modelsDir = path.join(__dirname, 'models');
fs.ensureDirSync(modelsDir);

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
fs.ensureDirSync(dataDir);

// Initialize empty data files if they don't exist
const usersFile = path.join(dataDir, 'users.json');
const booksFile = path.join(dataDir, 'books.json');

if (!fs.existsSync(usersFile)) {
  fs.writeJSONSync(usersFile, []);
}

if (!fs.existsSync(booksFile)) {
  fs.writeJSONSync(booksFile, []);
}

// Create the required route files if they don't exist
// First, check if auth.js exists, if not create it
const authRoutePath = path.join(routesDir, 'auth.js');
if (!fs.existsSync(authRoutePath)) {
  const authRouteContent = `
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
  `;
  fs.writeFileSync(authRoutePath, authRouteContent);
}

// Now make sure we have a User model
const userModelPath = path.join(modelsDir, 'User.js');
if (!fs.existsSync(userModelPath)) {
  const userModelContent = `
const fs = require('fs-extra');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

class User {
  static async getAll() {
    try {
      return await fs.readJSON(usersFilePath);
    } catch (error) {
      console.error('Error reading users:', error);
      return [];
    }
  }

  static async getById(id) {
    const users = await this.getAll();
    return users.find(user => user.id === id);
  }

  static async getByEmail(email) {
    const users = await this.getAll();
    return users.find(user => user.email === email);
  }

  static async create(userData) {
    const users = await this.getAll();
    
    // Check if email already exists
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await fs.writeJSON(usersFilePath, users);
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static async update(id, userData) {
    const users = await this.getAll();
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) {
      throw new Error('User not found');
    }
    
    users[index] = { ...users[index], ...userData };
    await fs.writeJSON(usersFilePath, users);
    
    // Return user without password
    const { password, ...userWithoutPassword } = users[index];
    return userWithoutPassword;
  }

  static async delete(id) {
    const users = await this.getAll();
    const filteredUsers = users.filter(user => user.id !== id);
    await fs.writeJSON(usersFilePath, filteredUsers);
  }
}

module.exports = User;
  `;
  fs.writeFileSync(userModelPath, userModelContent);
}

// Now import the routes
const authRoutes = require('./routes/auth');
let userRoutes;
let bookRoutes;

// Check if users.js exists
const usersRoutePath = path.join(routesDir, 'users.js');
if (fs.existsSync(usersRoutePath)) {
  userRoutes = require('./routes/users');
}

// Check if books.js exists
const booksRoutePath = path.join(routesDir, 'books.js');
if (fs.existsSync(booksRoutePath)) {
  bookRoutes = require('./routes/books');
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Increase payload size limit for JSON requests (50MB)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Basic request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
if (userRoutes) app.use('/api/users', userRoutes);
if (bookRoutes) app.use('/api/books', bookRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Try accessing http://localhost:${PORT}/health to verify server status`);
});
