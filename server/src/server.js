const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Trust proxy for secure cookies/headers when deployed behind Render/reverse proxy
app.set('trust proxy', 1);

// Flexible and secure CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, server-to-server health checks)
      if (!origin) return callback(null, true);

      // Check if origin matches allowed origins, Vercel preview URLs, or wildcard
      const isAllowed =
        process.env.CLIENT_URL === '*' ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        process.env.NODE_ENV !== 'production';

      if (isAllowed) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint (Essential for Render & Uptime Monitors)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'StudySync API Server',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root API Welcome Endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'StudySync Group Study Management API is active and operational.',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      groups: '/api/groups'
    }
  });
});

// Mount Core Application Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));

// 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`
  });
});

// Centralized error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[StudySync Server] Running on port ${PORT}`);
  console.log(`[API Base] http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
