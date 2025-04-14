const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/books');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS for both development and production
app.use(cors({
  origin: ['https://shelf-mu.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  credentials: true
}));

// Configure request body parsing with increased limits
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Server is running');
});

// Root endpoint with API info
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Book Exchange API is running',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      books: '/api/books'
    },
    version: '1.0.0'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Try accessing http://localhost:${PORT}/health to verify server status`);
});
